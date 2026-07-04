/**
 * routes/convertRoutes.js
 *
 * API routes for image conversion.
 * All existing endpoints are preserved — frontend continues working unchanged.
 * Added: generic /convert endpoint for any-to-any format conversion.
 */

const express = require("express");
const router  = express.Router();

const upload            = require("../middleware/upload");
const { validateUpload }  = require("../middleware/validateUpload");
const { uploadLimiter }   = require("../middleware/uploadLimiter");
const convertController   = require("../controllers/convertController");
const { validateResize, validateCrop } = require("../middleware/validation");

// ── Existing endpoints (API unchanged) ────────────────────────────────────────

router.post("/jpg-to-png",
  uploadLimiter, upload.single("image"), validateUpload,
  convertController.jpgToPng
);

router.post("/png-to-jpg",
  uploadLimiter, upload.single("image"), validateUpload,
  convertController.pngToJpg
);

router.post("/webp-to-jpg",
  uploadLimiter, upload.single("image"), validateUpload,
  convertController.webpToJpg
);

router.post("/jpg-to-webp",
  uploadLimiter, upload.single("image"), validateUpload,
  convertController.jpgToWebp
);

router.post("/compress-image",
  uploadLimiter, upload.single("image"), validateUpload,
  convertController.compressImage
);

router.post("/resize-image",
  uploadLimiter, upload.single("image"), validateUpload, validateResize,
  convertController.resizeImage
);

router.post("/crop-image",
  uploadLimiter, upload.single("image"), validateUpload, validateCrop,
  convertController.cropImage
);

// Rotate image
router.post("/rotate-image",
  uploadLimiter, upload.single("image"), validateUpload,
  convertController.rotateImage
);

// Add text watermark
router.post("/watermark",
  uploadLimiter, upload.single("image"), validateUpload,
  convertController.addWatermark
);

// POST /api/convert/convert   body: { targetFormat, quality? }
router.post("/convert",
  uploadLimiter, upload.single("image"), validateUpload,
  convertController.convertGeneric
);

module.exports = router;
