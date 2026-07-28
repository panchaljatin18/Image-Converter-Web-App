/**
 * services/imageService.js
 *
 * Image processing service using ImageMagick CLI.
 * All operations are offloaded to ImageMagick (magick) via executeCommand.
 * No Sharp dependencies are used here to avoid native module compilation issues.
 */

const fs     = require("fs");
const path   = require("path");
const logger = require("../utils/logger");
const { executeCommand } = require("../utils/executeCommand");
const { buildOutputPath } = require("../utils/pathHelper");
const { DOWNLOADS_DIR }   = require("../config/paths");
const TOOLS = require("../config/tools");
const ToolError = require("../errors/ToolError");

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Map position strings to ImageMagick gravity values
const GRAVITY_MAP = {
  "center": "Center",
  "top-left": "NorthWest",
  "top-right": "NorthEast",
  "bottom-left": "SouthWest",
  "bottom-right": "SouthEast",
};

const imageService = {
  /**
   * Convert image to a target format.
   * Supports JPG, PNG, WEBP, AVIF, etc.
   */
  async convertFormat(inputPath, originalName, targetFormat, quality = 85, bgColor = null) {
    const ext = targetFormat.toLowerCase();
    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const q = Math.min(Math.max(Math.round(quality), 1), 100);
    const t0 = Date.now();

    const args = [];
    if (bgColor && (ext === "jpg" || ext === "jpeg")) {
      args.push(inputPath, "-background", bgColor, "-flatten", "-quality", String(q), fullPath);
    } else {
      args.push(inputPath, "-quality", String(q), fullPath);
    }
    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to convert file to format "${ext}"`);
    }

    logger.tool("imagemagick", `${originalName} → ${filename}`, { ms: Date.now() - t0, quality: q });
    return { filename, fullPath };
  },

  /**
   * Compress image while keeping its format.
   */
  async compressImage(inputPath, originalName, mimetype, quality = 75, maxDim = null) {
    let ext = path.extname(originalName).replace(".", "").toLowerCase() || "jpeg";
    if (ext === "jpg") ext = "jpeg";

    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const q = Math.min(Math.max(Math.round(quality), 1), 100);
    const t0 = Date.now();

    const args = [inputPath];
    if (maxDim && maxDim > 0) {
      // Resize to fit within the given max dimension while maintaining aspect ratio
      args.push("-resize", `${maxDim}x${maxDim}>`);
    }
    args.push("-quality", String(q), fullPath);
    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to compress image`);
    }

    logger.tool("imagemagick", `compressed ${originalName} → ${filename}`, { ms: Date.now() - t0, quality: q, maxDim });
    return { filename, fullPath };
  },

  /**
   * Resize image to exact or proportional dimensions using 3 modes:
   *  - "stretch": Forces exact WxH, stretching image if aspect ratio differs.
   *  - "crop":    Scales image to fill WxH and center-crops outer edges without distortion.
   *  - "fit":     Scales image to fit inside WxH, padding background to fill exact canvas size.
   *
   * @param {string} inputPath
   * @param {string} originalName
   * @param {string} mimetype
   * @param {number} width
   * @param {number} height
   * @param {string|null} targetFormat
   * @param {number} quality
   * @param {string} resizeMode - "stretch" | "crop" | "fit" (default: "stretch")
   * @param {string} bgColor - Background color for fit mode padding (default: "#ffffff")
   * @param {number|null} targetSizeKB - Optional target file size cap in KB
   */
  async resizeImage(
    inputPath,
    originalName,
    mimetype,
    width,
    height,
    targetFormat = null,
    quality = 85,
    resizeMode = "stretch",
    bgColor = "#ffffff",
    targetSizeKB = null
  ) {
    let ext = targetFormat
      ? targetFormat.toLowerCase()
      : (path.extname(originalName).replace(".", "").toLowerCase() || "jpeg");
    if (ext === "jpg") ext = "jpeg";

    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const q = Math.min(Math.max(Math.round(quality), 1), 100);
    const t0 = Date.now();

    const args = [inputPath];

    const w = parseInt(width, 10) || null;
    const h = parseInt(height, 10) || null;
    const mode = (resizeMode || "stretch").toLowerCase();

    if (w && h) {
      if (mode === "crop") {
        // Scale to fill WxH and center crop overflow without distortion
        args.push("-resize", `${w}x${h}^`, "-gravity", "Center", "-crop", `${w}x${h}+0+0`, "+repage");
      } else if (mode === "fit") {
        // Fit inside WxH with optional background padding to maintain exact canvas size
        if (bgColor && bgColor !== "none" && bgColor !== "transparent") {
          args.push("-resize", `${w}x${h}`, "-background", bgColor, "-gravity", "Center", "-extent", `${w}x${h}`);
        } else {
          args.push("-resize", `${w}x${h}`);
        }
      } else {
        // "stretch" — default exact pixel dimensions
        args.push("-resize", `${w}x${h}!`);
      }
    } else if (w) {
      args.push("-resize", `${w}`);
    } else if (h) {
      args.push("-resize", `x${h}`);
    }

    // Apply target file size cap if requested (e.g. 100 KB) for JPEG output
    const maxKB = parseInt(targetSizeKB, 10);
    if (!isNaN(maxKB) && maxKB > 0 && (ext === "jpeg" || ext === "jpg")) {
      args.push("-define", `jpeg:extent=${maxKB}KB`);
    } else {
      args.push("-quality", String(q));
    }

    args.push(fullPath);
    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to resize image`);
    }

    logger.tool("imagemagick", `resized ${originalName} → ${filename}`, {
      ms: Date.now() - t0,
      width: w,
      height: h,
      mode,
      quality: q,
      targetSizeKB: maxKB || null,
    });
    return { filename, fullPath };
  },


  /**
   * Crop image using coordinates.
   * @param {string} targetFormat - Optional output format override (e.g., "jpeg", "png", "webp")
   */
  async cropImage(inputPath, originalName, width, height, left, top, targetFormat = null, quality = 90) {
    // Determine output extension: prefer targetFormat if provided, else keep input ext
    let ext = targetFormat
      ? targetFormat.toLowerCase()
      : (path.extname(originalName).replace(".", "").toLowerCase() || "jpeg");
    if (ext === "jpg") ext = "jpeg";

    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const q = Math.min(Math.max(Math.round(quality), 1), 100);
    const t0 = Date.now();

    const cropString = `${width}x${height}+${left}+${top}`;
    const args = [inputPath, "-crop", cropString, "+repage", "-quality", String(q), fullPath];
    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to crop image`);
    }

    logger.tool("imagemagick", `cropped ${originalName} → ${filename}`, { ms: Date.now() - t0, quality: q });
    return { filename, fullPath };
  },

  /**
   * Rotate image by a given angle.
   */
  async rotateImage(inputPath, originalName, angle = 90, background = "#ffffff") {
    let ext = path.extname(originalName).replace(".", "").toLowerCase() || "jpeg";
    if (ext === "jpg") ext = "jpeg";

    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const t0 = Date.now();

    const args = [inputPath, "-background", background, "-rotate", String(angle), fullPath];
    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to rotate image`);
    }

    logger.tool("imagemagick", `rotated ${originalName} ${angle}° → ${filename}`, { ms: Date.now() - t0, angle });
    return { filename, fullPath };
  },

  /**
   * Add a text watermark to an image.
   */
  async addWatermark(inputPath, originalName, text = "Watermark", opts = {}) {
    let ext = path.extname(originalName).replace(".", "").toLowerCase() || "jpeg";
    if (ext === "jpg") ext = "jpeg";

    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const t0 = Date.now();

    const fontSize = parseInt(opts.fontSize, 10) || 36;
    const colour   = opts.colour || "rgba(255,255,255,0.5)";
    const position = opts.position || "center";
    const gravity  = GRAVITY_MAP[position] || "Center";

    const args = [
      inputPath,
      "-gravity", gravity,
      "-pointsize", String(fontSize),
      "-fill", colour,
      "-annotate", "0", text,
      fullPath
    ];

    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to add watermark to image`);
    }

    logger.tool("imagemagick", `watermarked ${originalName} → ${filename}`, { ms: Date.now() - t0, text });
    return { filename, fullPath };
  },

  /** Startup check */
  async checkInstallation() {
    const { checkToolAvailable } = require("../utils/executeCommand");
    return checkToolAvailable(TOOLS.IMAGEMAGICK, ["-version"]);
  },
};

module.exports = imageService;
