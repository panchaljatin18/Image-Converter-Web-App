/**
 * controllers/pdfController.js
 *
 * Orchestrates PDF operation requests.
 * Calls pdfService only — no Ghostscript commands here.
 *
 * Operations:
 *   - Compress PDF (with quality preset)
 *   - Optimize PDF (image DPI downsampling)
 *   - Reduce PDF size (aggressive — screen preset)
 *   - Convert to PDF/A
 */

const pdfService    = require("../services/pdfService");
const { cleanFile } = require("../utils/fileCleanup");
const ValidationError = require("../errors/ValidationError");

/** Wrap handler with automatic upload-file cleanup in finally block */
function withCleanup(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    } finally {
      await cleanFile(req.file?.path);
    }
  };
}

const pdfController = {

  /**
   * POST /api/pdf/compress
   * Body: { preset?: "low" | "medium" | "high" | "max" }
   * Default preset: "medium" (150 dpi, balanced quality/size)
   */
  compressPdf: withCleanup(async (req, res) => {
    const preset = (req.body.preset || "medium").toLowerCase();
    const VALID_PRESETS = ["low", "medium", "high", "max"];
    if (!VALID_PRESETS.includes(preset)) {
      throw new ValidationError(
        `Invalid preset "${preset}". Valid options: ${VALID_PRESETS.join(", ")}`,
        "INVALID_PRESET"
      );
    }

    const { filename, savings } = await pdfService.compressPdf(
      req.file.path,
      req.file.originalname,
      preset
    );

    return res.status(200).json({
      success: true,
      message: `PDF compressed successfully (${savings} smaller).`,
      downloadUrl: `/downloads/${filename}`,
      savings,
    });
  }),

  /**
   * POST /api/pdf/optimize
   * Body: { dpi?: number }
   * Default dpi: 150
   */
  optimizePdf: withCleanup(async (req, res) => {
    const dpi = parseInt(req.body.dpi, 10) || 150;
    const { filename } = await pdfService.optimizePdf(req.file.path, req.file.originalname, dpi);

    return res.status(200).json({
      success: true,
      message: "PDF optimized successfully.",
      downloadUrl: `/downloads/${filename}`,
    });
  }),

  /**
   * POST /api/pdf/reduce-size
   * Aggressive compression — screen preset, 72 dpi.
   */
  reduceSize: withCleanup(async (req, res) => {
    const { filename, savings } = await pdfService.reduceSize(req.file.path, req.file.originalname);

    return res.status(200).json({
      success: true,
      message: `PDF size reduced successfully (${savings} smaller).`,
      downloadUrl: `/downloads/${filename}`,
      savings,
    });
  }),

  /**
   * POST /api/pdf/to-pdf-a
   * Body: { level?: 1 | 2 | 3 }
   * Default: PDF/A-2
   */
  convertToPdfA: withCleanup(async (req, res) => {
    const level = parseInt(req.body.level, 10) || 2;
    const { filename } = await pdfService.convertToPdfA(req.file.path, req.file.originalname, level);

    return res.status(200).json({
      success: true,
      message: `Converted to PDF/A-${level} successfully.`,
      downloadUrl: `/downloads/${filename}`,
    });
  }),
};

module.exports = pdfController;
