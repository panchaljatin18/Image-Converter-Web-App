/**
 * controllers/documentController.js
 *
 * Orchestrates document conversion requests.
 * Calls documentService only — no child_process, no LibreOffice commands here.
 *
 * Supported conversions (via LibreOffice headless):
 *   DOCX / DOC / ODT / RTF → PDF
 *   PPTX / PPT / ODP       → PDF
 *   XLSX / XLS / ODS / CSV → PDF
 *   Any office format       → any other (generic endpoint)
 */

const documentService = require("../services/documentService");
const { cleanFile }   = require("../utils/fileCleanup");
const ValidationError = require("../errors/ValidationError");
const logger          = require("../utils/logger");

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

/** Standard success response shape */
function success(res, filename, message) {
  return res.status(200).json({
    success: true,
    message,
    downloadUrl: `/downloads/${filename}`,
  });
}

const documentController = {

  // POST /api/documents/docx-to-pdf
  docxToPdf: withCleanup(async (req, res) => {
    const { filename } = await documentService.convert(req.file.path, req.file.originalname, "pdf");
    return success(res, filename, "DOCX converted to PDF successfully.");
  }),

  // POST /api/documents/pptx-to-pdf
  pptxToPdf: withCleanup(async (req, res) => {
    const { filename } = await documentService.convert(req.file.path, req.file.originalname, "pdf");
    return success(res, filename, "PPTX converted to PDF successfully.");
  }),

  // POST /api/documents/xlsx-to-pdf
  xlsxToPdf: withCleanup(async (req, res) => {
    const { filename } = await documentService.convert(req.file.path, req.file.originalname, "pdf");
    return success(res, filename, "XLSX converted to PDF successfully.");
  }),

  // POST /api/documents/odt-to-pdf
  odtToPdf: withCleanup(async (req, res) => {
    const { filename } = await documentService.convert(req.file.path, req.file.originalname, "pdf");
    return success(res, filename, "ODT converted to PDF successfully.");
  }),

  // POST /api/documents/ods-to-pdf
  odsToPdf: withCleanup(async (req, res) => {
    const { filename } = await documentService.convert(req.file.path, req.file.originalname, "pdf");
    return success(res, filename, "ODS converted to PDF successfully.");
  }),

  // POST /api/documents/odp-to-pdf
  odpToPdf: withCleanup(async (req, res) => {
    const { filename } = await documentService.convert(req.file.path, req.file.originalname, "pdf");
    return success(res, filename, "ODP converted to PDF successfully.");
  }),

  /**
   * POST /api/documents/convert
   * Generic: any office format → any supported output format.
   * Body: { targetFormat: "pdf" | "docx" | "odt" | "xlsx" | ... }
   */
  convertGeneric: withCleanup(async (req, res) => {
    const targetFormat = (req.body.targetFormat || "").toLowerCase().trim();
    if (!targetFormat) {
      throw new ValidationError("Missing required field: targetFormat.", "MISSING_FORMAT");
    }

    const { filename } = await documentService.convert(
      req.file.path,
      req.file.originalname,
      targetFormat
    );

    return res.status(200).json({
      success: true,
      message: `Document converted to ${targetFormat.toUpperCase()} successfully.`,
      downloadUrl: `/downloads/${filename}`,
    });
  }),
};

module.exports = documentController;
