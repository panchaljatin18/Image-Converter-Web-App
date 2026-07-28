/**
 * middleware/validateImage.js
 *
 * Production-grade image validation middleware for ConvertGalaxy.
 *
 * Layers (in order):
 *  1. Filename safety   — length, blocked extensions, path traversal, Unicode
 *  2. Magic bytes       — real file signature check (not just MIME/extension)
 *  3. Dimension limits  — width, height, megapixel cap (OOM protection)
 *  4. Quality bounds    — compression quality parameter sanity
 *  5. Resize bounds     — target dimension sanity for resize requests
 *  6. Crop bounds       — crop region must fit inside original image
 *  7. Animated frames   — GIF/WebP frame count cap (CPU protection)
 *
 * Every layer throws a ValidationError so the global error handler
 * converts it to a consistent JSON 422 response automatically.
 */

const path          = require("path");
const fs            = require("fs");
const sharp         = require("sharp");
const ValidationError = require("../errors/ValidationError");
const logger        = require("../utils/logger");
const {
  MAX_IMAGE_WIDTH,
  MAX_IMAGE_HEIGHT,
  MAX_MEGAPIXELS,
  MAX_RESIZE_WIDTH,
  MAX_RESIZE_HEIGHT,
  MAX_FILENAME_LENGTH,
  MAX_ANIMATED_FRAMES,
  MIN_QUALITY,
  MAX_QUALITY,
  BLOCKED_EXTENSIONS,
} = require("../config/constants");

// ── Magic byte signatures ─────────────────────────────────────────────────────
//
// We read a small slice of the uploaded file's buffer and compare it against
// known file headers. This catches executables and corrupted files that have
// been renamed with a valid image extension.

const MAGIC_SIGNATURES = [
  // JPEG: starts with FF D8 FF
  { formats: ["jpg", "jpeg"], check: (b) => b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF },
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  { formats: ["png"], check: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47 },
  // WebP: RIFF????WEBP
  { formats: ["webp"], check: (b) => b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP" },
  // GIF: GIF87a or GIF89a
  { formats: ["gif"], check: (b) => b.toString("ascii", 0, 3) === "GIF" },
  // BMP: BM
  { formats: ["bmp"], check: (b) => b[0] === 0x42 && b[1] === 0x4D },
  // TIFF: little-endian (II) or big-endian (MM)
  { formats: ["tiff", "tif"], check: (b) => (b[0] === 0x49 && b[1] === 0x49) || (b[0] === 0x4D && b[1] === 0x4D) },
  // HEIC/HEIF: "ftyp" box at offset 4 containing heic/heif/heix variants
  {
    formats: ["heic", "heif"],
    check: (b) => {
      if (b.length < 12) return false;
      const brand = b.toString("ascii", 8, 12).toLowerCase();
      return ["heic", "heif", "heix", "mif1", "msf1", "avif"].includes(brand);
    }
  },
  // AVIF: ftyp box with avif brand
  { formats: ["avif"], check: (b) => b.length >= 12 && b.toString("ascii", 8, 12).toLowerCase() === "avif" },
];

/**
 * Read the first 16 bytes of a file for magic byte comparison.
 * @param {string} filePath
 * @returns {Buffer}
 */
function readMagicBytes(filePath) {
  const fd = fs.openSync(filePath, "r");
  const buffer = Buffer.alloc(16);
  fs.readSync(fd, buffer, 0, 16, 0);
  fs.closeSync(fd);
  return buffer;
}

/**
 * Verify that the file's magic bytes match the declared extension.
 * RAW camera formats are skipped (no universal magic byte pattern).
 */
function verifyMagicBytes(filePath, ext) {
  const RAW_EXTS = [
    ".3fr",".arw",".cr2",".cr3",".crw",".dcr",".dng",".erf",
    ".kdc",".mdc",".mef",".mos",".mrw",".nef",".nrw",".orf",
    ".pef",".raf",".raw",".rw2",".srf",".x3f",
  ];
  // Skip magic check for RAW and SVG (text/XML)
  if (RAW_EXTS.includes(ext) || ext === ".svg") return;

  const format = ext.replace(".", "").toLowerCase();
  const signature = MAGIC_SIGNATURES.find((s) => s.formats.includes(format));
  if (!signature) return; // Unknown format — skip (Multer already filtered)

  const buf = readMagicBytes(filePath);
  if (!signature.check(buf)) {
    logger.warn("Magic byte mismatch", { filePath, ext });
    throw new ValidationError(
      `File content does not match the declared format (${ext.toUpperCase()}). ` +
      "The file may be corrupted or is a disguised executable.",
      "INVALID_FILE_SIGNATURE"
    );
  }
}

// ── Layer 1: Filename safety ──────────────────────────────────────────────────

/**
 * Validates and sanitizes the original filename.
 * Blocks: path traversal, blocked extensions, excessive length,
 *         invalid Unicode, null bytes.
 * @param {string} originalname
 */
function validateFilename(originalname) {
  if (!originalname || typeof originalname !== "string") {
    throw new ValidationError("Missing or invalid filename.", "INVALID_FILENAME");
  }

  // Reject null bytes (used in some injection attacks)
  if (originalname.includes("\0")) {
    throw new ValidationError("Filename contains invalid null bytes.", "INVALID_FILENAME");
  }

  // Reject filenames that are too long
  if (originalname.length > MAX_FILENAME_LENGTH) {
    throw new ValidationError(
      `Filename is too long. Maximum allowed length is ${MAX_FILENAME_LENGTH} characters. ` +
      "Please rename your file and try again.",
      "FILENAME_TOO_LONG"
    );
  }

  // Reject path traversal patterns
  if (originalname.includes("..") || originalname.includes("/") || originalname.includes("\\")) {
    throw new ValidationError(
      "Filename contains invalid path characters. Please rename your file and try again.",
      "INVALID_FILENAME_PATH"
    );
  }

  // Reject blocked/dangerous extensions
  const ext = path.extname(originalname).toLowerCase();
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    throw new ValidationError(
      `Files with the extension "${ext}" are not allowed for security reasons.`,
      "BLOCKED_EXTENSION"
    );
  }
}

// ── Layer 3: Image dimension & megapixel validation ───────────────────────────

/**
 * Validates image dimensions using Sharp metadata.
 * Prevents OOM kills from extremely large images.
 * @param {string} filePath
 * @returns {Promise<{width: number, height: number, pages: number|undefined}>}
 */
async function validateImageDimensions(filePath) {
  let metadata;
  try {
    metadata = await sharp(filePath, { failOnError: true }).metadata();
  } catch (err) {
    logger.warn("Sharp could not read image metadata", { filePath, error: err.message });
    throw new ValidationError(
      "The uploaded file appears to be corrupted or is not a valid image. " +
      "Please try uploading a different file.",
      "CORRUPTED_IMAGE"
    );
  }

  const { width, height, pages } = metadata;

  if (!width || !height || width <= 0 || height <= 0) {
    throw new ValidationError(
      "Image has invalid dimensions (zero or undefined). The file may be corrupted.",
      "INVALID_DIMENSIONS"
    );
  }

  if (width > MAX_IMAGE_WIDTH) {
    throw new ValidationError(
      `Image width (${width}px) exceeds the maximum allowed width of ${MAX_IMAGE_WIDTH.toLocaleString()}px. ` +
      "Please reduce the image size and try again.",
      "IMAGE_TOO_WIDE"
    );
  }

  if (height > MAX_IMAGE_HEIGHT) {
    throw new ValidationError(
      `Image height (${height}px) exceeds the maximum allowed height of ${MAX_IMAGE_HEIGHT.toLocaleString()}px. ` +
      "Please reduce the image size and try again.",
      "IMAGE_TOO_TALL"
    );
  }

  const megapixels = (width * height) / 1_000_000;
  if (megapixels > MAX_MEGAPIXELS) {
    throw new ValidationError(
      `Image is ${megapixels.toFixed(1)} megapixels, which exceeds the ${MAX_MEGAPIXELS} MP limit. ` +
      "Please downscale the image first and try again.",
      "EXCEEDS_MEGAPIXEL_LIMIT"
    );
  }

  return { width, height, pages };
}

// ── Layer 7: Animated frame validation ───────────────────────────────────────

/**
 * Validates that animated images (GIF/WebP) don't exceed the frame count cap.
 * @param {number|undefined} pages — Sharp reports frames as `pages`
 */
function validateAnimatedFrames(pages) {
  if (pages && pages > MAX_ANIMATED_FRAMES) {
    throw new ValidationError(
      `Animated file has ${pages} frames, which exceeds the ${MAX_ANIMATED_FRAMES}-frame limit. ` +
      "Please use a shorter animation and try again.",
      "TOO_MANY_FRAMES"
    );
  }
}

// ── Layer 4: Quality parameter validation ─────────────────────────────────────

/**
 * Validates an optional quality parameter from req.body.
 * @param {any} quality — raw value from req.body.quality
 * @returns {number} — validated integer quality
 */
function validateQuality(quality) {
  if (quality === undefined || quality === null || quality === "") return null; // Optional
  const q = parseInt(quality, 10);
  if (isNaN(q) || q < MIN_QUALITY || q > MAX_QUALITY) {
    throw new ValidationError(
      `Invalid quality value "${quality}". Quality must be an integer between ${MIN_QUALITY} and ${MAX_QUALITY}.`,
      "INVALID_QUALITY"
    );
  }
  return q;
}

// ── Layer 5: Resize parameter validation ──────────────────────────────────────

/**
 * Validates resize target dimensions from req.body.
 * @param {any} width
 * @param {any} height
 */
function validateResizeDimensions(width, height) {
  if (!width && !height) {
    throw new ValidationError(
      "At least one of width or height must be provided for resizing.",
      "MISSING_RESIZE_DIMENSIONS"
    );
  }

  if (width !== undefined && width !== "") {
    const w = parseInt(width, 10);
    if (isNaN(w) || w <= 0) {
      throw new ValidationError(
        "Resize width must be a positive integer greater than zero.",
        "INVALID_RESIZE_WIDTH"
      );
    }
    if (w > MAX_RESIZE_WIDTH) {
      throw new ValidationError(
        `Resize width (${w}px) exceeds the maximum allowed value of ${MAX_RESIZE_WIDTH.toLocaleString()}px.`,
        "RESIZE_WIDTH_TOO_LARGE"
      );
    }
  }

  if (height !== undefined && height !== "") {
    const h = parseInt(height, 10);
    if (isNaN(h) || h <= 0) {
      throw new ValidationError(
        "Resize height must be a positive integer greater than zero.",
        "INVALID_RESIZE_HEIGHT"
      );
    }
    if (h > MAX_RESIZE_HEIGHT) {
      throw new ValidationError(
        `Resize height (${h}px) exceeds the maximum allowed value of ${MAX_RESIZE_HEIGHT.toLocaleString()}px.`,
        "RESIZE_HEIGHT_TOO_LARGE"
      );
    }
  }
}

// ── Layer 6: Crop parameter validation ───────────────────────────────────────

/**
 * Validates crop parameters and verifies they fit within the actual image.
 * @param {any} width  — crop region width
 * @param {any} height — crop region height
 * @param {any} left   — crop offset from left
 * @param {any} top    — crop offset from top
 * @param {number} imgWidth   — original image width
 * @param {number} imgHeight  — original image height
 */
function validateCropDimensions(width, height, left, top, imgWidth, imgHeight) {
  const params = { width, height, left, top };
  for (const [key, val] of Object.entries(params)) {
    if (val === undefined || val === null || val === "") {
      throw new ValidationError(
        `Missing crop parameter: "${key}". All of width, height, left, and top are required.`,
        "MISSING_CROP_PARAM"
      );
    }
  }

  const w = parseInt(width, 10);
  const h = parseInt(height, 10);
  const l = parseInt(left, 10);
  const t = parseInt(top, 10);

  if (isNaN(w) || w <= 0) throw new ValidationError("Crop width must be a positive integer.", "INVALID_CROP_WIDTH");
  if (isNaN(h) || h <= 0) throw new ValidationError("Crop height must be a positive integer.", "INVALID_CROP_HEIGHT");
  if (isNaN(l) || l < 0)  throw new ValidationError("Crop left offset must be zero or a positive integer.", "INVALID_CROP_LEFT");
  if (isNaN(t) || t < 0)  throw new ValidationError("Crop top offset must be zero or a positive integer.", "INVALID_CROP_TOP");

  if (l + w > imgWidth) {
    throw new ValidationError(
      `Crop region (left ${l} + width ${w} = ${l + w}px) exceeds the image width of ${imgWidth}px.`,
      "CROP_OUT_OF_BOUNDS"
    );
  }
  if (t + h > imgHeight) {
    throw new ValidationError(
      `Crop region (top ${t} + height ${h} = ${t + h}px) exceeds the image height of ${imgHeight}px.`,
      "CROP_OUT_OF_BOUNDS"
    );
  }
}

// ── Exported middleware ───────────────────────────────────────────────────────

/**
 * Full image validation middleware.
 * Runs all layers (1→2→3→7) and attaches metadata to req.imageMetadata.
 * Call this AFTER upload.single("image") and validateUpload.
 */
async function validateImageMiddleware(req, res, next) {
  try {
    const file = req.file;
    if (!file) return next(); // Let validateUpload.js handle missing file

    const ext = path.extname(file.originalname).toLowerCase();

    // Layer 1: Filename safety
    validateFilename(file.originalname);

    // Layer 2: Magic bytes
    verifyMagicBytes(file.path, ext);

    // Layer 3 + 7: Dimensions and frame count
    const { width, height, pages } = await validateImageDimensions(file.path);
    validateAnimatedFrames(pages);

    // Attach metadata for downstream use (controllers/services)
    req.imageMetadata = { width, height, pages };

    logger.debug("Image validated", { file: file.originalname, width, height, megapixels: ((width * height) / 1e6).toFixed(1) });
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Validates quality param from req.body and attaches to req.validatedQuality.
 */
function validateQualityMiddleware(req, res, next) {
  try {
    const q = validateQuality(req.body.quality);
    if (q !== null) req.validatedQuality = q;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Validates resize dimensions from req.body.
 */
function validateResizeMiddleware(req, res, next) {
  try {
    validateResizeDimensions(req.body.width, req.body.height);
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Validates crop dimensions from req.body against actual image size.
 * Requires validateImageMiddleware to have run first (req.imageMetadata).
 */
function validateCropMiddleware(req, res, next) {
  try {
    const { width: imgW, height: imgH } = req.imageMetadata || {};
    if (!imgW || !imgH) {
      return next(new ValidationError("Image metadata unavailable. Run validateImageMiddleware first.", "MISSING_METADATA"));
    }
    validateCropDimensions(
      req.body.width, req.body.height,
      req.body.left, req.body.top,
      imgW, imgH
    );
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateImageMiddleware,
  validateQualityMiddleware,
  validateResizeMiddleware,
  validateCropMiddleware,
  // Also export helpers for unit testing
  validateFilename,
  verifyMagicBytes,
  validateImageDimensions,
  validateAnimatedFrames,
  validateQuality,
  validateResizeDimensions,
  validateCropDimensions,
};
