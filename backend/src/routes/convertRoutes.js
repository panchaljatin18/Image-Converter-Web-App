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
const {
  validateImageMiddleware,
  validateQualityMiddleware,
  validateResizeMiddleware,
  validateCropMiddleware,
} = require("../middleware/validateImage");

// ── Conversion endpoints (API paths unchanged) ───────────────────────────────

router.post("/jpg-to-png",
  uploadLimiter, upload.single("image"), validateUpload,
  validateImageMiddleware, validateQualityMiddleware,
  convertController.jpgToPng
);

router.post("/png-to-jpg",
  uploadLimiter, upload.single("image"), validateUpload,
  validateImageMiddleware, validateQualityMiddleware,
  convertController.pngToJpg
);

router.post("/webp-to-jpg",
  uploadLimiter, upload.single("image"), validateUpload,
  validateImageMiddleware, validateQualityMiddleware,
  convertController.webpToJpg
);

router.post("/jpg-to-webp",
  uploadLimiter, upload.single("image"), validateUpload,
  validateImageMiddleware, validateQualityMiddleware,
  convertController.jpgToWebp
);

router.post("/heic-to-jpg",
  uploadLimiter, upload.single("image"), validateUpload,
  validateImageMiddleware,
  convertController.convertGeneric
);

router.post("/compress-image",
  uploadLimiter, upload.single("image"), validateUpload,
  validateImageMiddleware, validateQualityMiddleware,
  convertController.compressImage
);

router.post("/resize-image",
  uploadLimiter, upload.single("image"), validateUpload,
  validateImageMiddleware, validateResizeMiddleware, validateQualityMiddleware,
  convertController.resizeImage
);

router.post("/crop-image",
  uploadLimiter, upload.single("image"), validateUpload,
  validateImageMiddleware, validateCropMiddleware, validateQualityMiddleware,
  convertController.cropImage
);

router.post("/rotate-image",
  uploadLimiter, upload.single("image"), validateUpload,
  validateImageMiddleware,
  convertController.rotateImage
);

router.post("/watermark",
  uploadLimiter, upload.single("image"), validateUpload,
  validateImageMiddleware,
  convertController.addWatermark
);

// POST /api/convert/convert   body: { targetFormat, quality? }
router.post("/convert",
  uploadLimiter, upload.single("image"), validateUpload,
  validateImageMiddleware, validateQualityMiddleware,
  convertController.convertGeneric
);

module.exports = router;
