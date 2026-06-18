const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const convertController = require("../controllers/convertController");
const { validateUpload, validateResize, validateCrop } = require("../middleware/validation");

// ─── API Routes for Image Conversion ──────────────────────────────────────────

// JPG to PNG
router.post(
  "/jpg-to-png",
  upload.single("image"),
  validateUpload,
  convertController.jpgToPng
);

// PNG to JPG
router.post(
  "/png-to-jpg",
  upload.single("image"),
  validateUpload,
  convertController.pngToJpg
);

// WEBP to JPG
router.post(
  "/webp-to-jpg",
  upload.single("image"),
  validateUpload,
  convertController.webpToJpg
);

// JPG to WEBP
router.post(
  "/jpg-to-webp",
  upload.single("image"),
  validateUpload,
  convertController.jpgToWebp
);

// Compress Image
router.post(
  "/compress-image",
  upload.single("image"),
  validateUpload,
  convertController.compressImage
);

// Resize Image
router.post(
  "/resize-image",
  upload.single("image"),
  validateUpload,
  validateResize,
  convertController.resizeImage
);

// Crop Image
router.post(
  "/crop-image",
  upload.single("image"),
  validateUpload,
  validateCrop,
  convertController.cropImage
);

module.exports = router;
