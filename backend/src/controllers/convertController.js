/**
 * controllers/convertController.js
 *
 * Orchestrates image conversion requests.
 *
 * SOLID rules enforced here:
 *  S — Single responsibility: only orchestrates, no business logic
 *  O — Open/closed: new formats added to services without changing controller
 *  D — Dependency inversion: depends on service interfaces, not implementations
 *
 * No child_process. No path building. No Sharp. No exec.
 * Controllers call services → services do the work → controller sends response.
 */

const imageService       = require("../services/imageService");
const { cleanFile }      = require("../utils/fileCleanup");
const { validateUpload } = require("../middleware/validateUpload");
const ValidationError    = require("../errors/ValidationError");
const logger             = require("../utils/logger");
const path               = require("path");
const { isConversionSupported } = require("../utils/conversions");

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Smart convert: calls imageService to handle formatting.
 */
async function convertWithFallback(inputPath, originalName, targetFormat, quality = 85) {
  return imageService.convertFormat(inputPath, originalName, targetFormat, quality);
}

/**
 * Wrap any controller action with automatic temp-file cleanup.
 * Ensures the uploaded file is always deleted — even on error.
 */
function withCleanup(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    } finally {
      // Always clean up — regardless of success or failure
      await cleanFile(req.file?.path);
    }
  };
}

// ── Controller ────────────────────────────────────────────────────────────────

const convertController = {

  // POST /api/convert/jpg-to-png
  jpgToPng: withCleanup(async (req, res) => {
    const { filename } = await imageService.convertFormat(req.file.path, req.file.originalname, "png");
    return res.status(200).json({
      success: true,
      message: "Converted to PNG successfully.",
      downloadUrl: `/downloads/${filename}`,
    });
  }),

  // POST /api/convert/png-to-jpg
  pngToJpg: withCleanup(async (req, res) => {
    const { filename } = await imageService.convertFormat(req.file.path, req.file.originalname, "jpeg");
    return res.status(200).json({
      success: true,
      message: "Converted to JPEG successfully.",
      downloadUrl: `/downloads/${filename}`,
    });
  }),

  // POST /api/convert/webp-to-jpg
  webpToJpg: withCleanup(async (req, res) => {
    const { filename } = await imageService.convertFormat(req.file.path, req.file.originalname, "jpeg");
    return res.status(200).json({
      success: true,
      message: "Converted to JPEG successfully.",
      downloadUrl: `/downloads/${filename}`,
    });
  }),

  // POST /api/convert/jpg-to-webp
  jpgToWebp: withCleanup(async (req, res) => {
    const { filename } = await imageService.convertFormat(req.file.path, req.file.originalname, "webp");
    return res.status(200).json({
      success: true,
      message: "Converted to WebP successfully.",
      downloadUrl: `/downloads/${filename}`,
    });
  }),

  // POST /api/convert/compress-image
  compressImage: withCleanup(async (req, res) => {
    const quality = parseInt(req.body.quality, 10) || 75;
    const { filename } = await imageService.compressImage(
      req.file.path,
      req.file.originalname,
      req.file.mimetype,
      quality
    );
    return res.status(200).json({
      success: true,
      message: "Image compressed successfully.",
      downloadUrl: `/downloads/${filename}`,
    });
  }),

  // POST /api/convert/resize-image
  resizeImage: withCleanup(async (req, res) => {
    const { width, height } = req.body;
    const { filename } = await imageService.resizeImage(
      req.file.path,
      req.file.originalname,
      req.file.mimetype,
      width,
      height
    );
    return res.status(200).json({
      success: true,
      message: "Image resized successfully.",
      downloadUrl: `/downloads/${filename}`,
    });
  }),

  // POST /api/convert/crop-image
  cropImage: withCleanup(async (req, res) => {
    const { width, height, left, top } = req.body;
    const { filename } = await imageService.cropImage(
      req.file.path,
      req.file.originalname,
      width,
      height,
      left,
      top
    );
    return res.status(200).json({
      success: true,
      message: "Image cropped successfully.",
      downloadUrl: `/downloads/${filename}`,
    });
  }),

  // POST /api/convert/rotate-image
  rotateImage: withCleanup(async (req, res) => {
    const angle      = parseInt(req.body.angle, 10) || 90;
    const background = req.body.background || "#ffffff";
    const { filename } = await imageService.rotateImage(
      req.file.path,
      req.file.originalname,
      angle,
      background
    );
    return res.status(200).json({
      success: true,
      message: `Image rotated ${angle}° successfully.`,
      downloadUrl: `/downloads/${filename}`,
    });
  }),

  // POST /api/convert/watermark
  addWatermark: withCleanup(async (req, res) => {
    const text     = req.body.text     || "Watermark";
    const fontSize = parseInt(req.body.fontSize, 10) || 36;
    const colour   = req.body.colour   || "rgba(255,255,255,0.5)";
    const position = req.body.position || "center";
    const { filename } = await imageService.addWatermark(
      req.file.path,
      req.file.originalname,
      text,
      { fontSize, colour, position }
    );
    return res.status(200).json({
      success: true,
      message: "Watermark added successfully.",
      downloadUrl: `/downloads/${filename}`,
    });
  }),

  /**
   * POST /api/convert/convert
   * Generic endpoint: any supported input → any supported output format.
   * Body: { targetFormat: "bmp" | "heic" | "avif" | "png" | ... , quality?: number }
   */
  convertGeneric: withCleanup(async (req, res) => {
    const targetFormat = (req.body.targetFormat || "").toLowerCase().trim();
    if (!targetFormat) {
      throw new ValidationError("Missing required field: targetFormat.", "MISSING_FORMAT");
    }

    const sourceFormat = path.extname(req.file.originalname).replace(".", "").toLowerCase();
    if (!isConversionSupported(sourceFormat, targetFormat)) {
      return res.status(400).json({
        success: false,
        message: `Conversion from ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} is not supported.`
      });
    }

    const quality = parseInt(req.body.quality, 10) || 85;
    const { filename } = await convertWithFallback(
      req.file.path,
      req.file.originalname,
      targetFormat,
      quality
    );

    return res.status(200).json({
      success: true,
      message: `Converted to ${targetFormat.toUpperCase()} successfully.`,
      downloadUrl: `/downloads/${filename}`,
    });
  }),
};

module.exports = convertController;
