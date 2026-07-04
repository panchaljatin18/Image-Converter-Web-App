/**
 * routes/documentRoutes.js
 *
 * LibreOffice document conversion routes.
 * All mounted under /api/documents (registered in app.js).
 *
 * Existing API routes are UNCHANGED.
 */

const express  = require("express");
const router   = express.Router();

const uploadDocument    = require("../middleware/uploadDocument");
const { validateUpload } = require("../middleware/validateUpload");
const { uploadLimiter }  = require("../middleware/uploadLimiter");
const documentController = require("../controllers/documentController");

// ── Specific format routes ─────────────────────────────────────────────────

// DOCX → PDF
router.post("/docx-to-pdf",
  uploadLimiter, uploadDocument.single("file"), validateUpload,
  documentController.docxToPdf
);

// PPTX → PDF
router.post("/pptx-to-pdf",
  uploadLimiter, uploadDocument.single("file"), validateUpload,
  documentController.pptxToPdf
);

// XLSX → PDF
router.post("/xlsx-to-pdf",
  uploadLimiter, uploadDocument.single("file"), validateUpload,
  documentController.xlsxToPdf
);

// ODT → PDF
router.post("/odt-to-pdf",
  uploadLimiter, uploadDocument.single("file"), validateUpload,
  documentController.odtToPdf
);

// ODS → PDF
router.post("/ods-to-pdf",
  uploadLimiter, uploadDocument.single("file"), validateUpload,
  documentController.odsToPdf
);

// ODP → PDF
router.post("/odp-to-pdf",
  uploadLimiter, uploadDocument.single("file"), validateUpload,
  documentController.odpToPdf
);

// ── Generic route: any → any ───────────────────────────────────────────────
// POST /api/documents/convert   body: { targetFormat: "pdf" | "docx" | "odt" | ... }
router.post("/convert",
  uploadLimiter, uploadDocument.single("file"), validateUpload,
  documentController.convertGeneric
);

module.exports = router;
