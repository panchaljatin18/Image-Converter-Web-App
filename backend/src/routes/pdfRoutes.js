/**
 * routes/pdfRoutes.js
 *
 * Ghostscript PDF operation routes.
 * All mounted under /api/pdf (registered in app.js).
 *
 * Existing API routes are UNCHANGED.
 */

const express  = require("express");
const router   = express.Router();

const uploadDocument    = require("../middleware/uploadDocument");
const { validateUpload } = require("../middleware/validateUpload");
const { uploadLimiter }  = require("../middleware/uploadLimiter");
const pdfController      = require("../controllers/pdfController");

/**
 * POST /api/pdf/compress
 * Body: { preset?: "low" | "medium" | "high" | "max" }
 * File field: "file"
 */
router.post("/compress",
  uploadLimiter, uploadDocument.single("file"), validateUpload,
  pdfController.compressPdf
);

/**
 * POST /api/pdf/optimize
 * Body: { dpi?: number }
 * File field: "file"
 */
router.post("/optimize",
  uploadLimiter, uploadDocument.single("file"), validateUpload,
  pdfController.optimizePdf
);

/**
 * POST /api/pdf/reduce-size
 * Aggressive size reduction — no body params needed.
 * File field: "file"
 */
router.post("/reduce-size",
  uploadLimiter, uploadDocument.single("file"), validateUpload,
  pdfController.reduceSize
);

/**
 * POST /api/pdf/to-pdf-a
 * Body: { level?: 1 | 2 | 3 }
 * File field: "file"
 */
router.post("/to-pdf-a",
  uploadLimiter, uploadDocument.single("file"), validateUpload,
  pdfController.convertToPdfA
);

module.exports = router;
