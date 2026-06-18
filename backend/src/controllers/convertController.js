const fs = require("fs");
const imageService = require("../services/imageService");

// Helper to safely delete input file after successful processing
const cleanTempFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Failed to delete temporary file ${filePath}:`, err);
  });
};

const convertController = {
  // POST /api/convert/jpg-to-png
  async jpgToPng(req, res, next) {
    try {
      const outputFilename = await imageService.convertFormat(
        req.file.path,
        req.file.originalname,
        "png"
      );
      cleanTempFile(req.file.path);
      return res.status(200).json({
        success: true,
        message: "Image converted successfully",
        downloadUrl: `/downloads/${outputFilename}`
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/convert/png-to-jpg
  async pngToJpg(req, res, next) {
    try {
      const outputFilename = await imageService.convertFormat(
        req.file.path,
        req.file.originalname,
        "jpeg"
      );
      cleanTempFile(req.file.path);
      return res.status(200).json({
        success: true,
        message: "Image converted successfully",
        downloadUrl: `/downloads/${outputFilename}`
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/convert/webp-to-jpg
  async webpToJpg(req, res, next) {
    try {
      const outputFilename = await imageService.convertFormat(
        req.file.path,
        req.file.originalname,
        "jpeg"
      );
      cleanTempFile(req.file.path);
      return res.status(200).json({
        success: true,
        message: "Image converted successfully",
        downloadUrl: `/downloads/${outputFilename}`
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/convert/jpg-to-webp
  async jpgToWebp(req, res, next) {
    try {
      const outputFilename = await imageService.convertFormat(
        req.file.path,
        req.file.originalname,
        "webp"
      );
      cleanTempFile(req.file.path);
      return res.status(200).json({
        success: true,
        message: "Image converted successfully",
        downloadUrl: `/downloads/${outputFilename}`
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/convert/compress-image
  async compressImage(req, res, next) {
    try {
      const quality = req.body.quality ? parseInt(req.body.quality, 10) : 75;
      const outputFilename = await imageService.compressImage(
        req.file.path,
        req.file.originalname,
        req.file.mimetype,
        quality
      );
      cleanTempFile(req.file.path);
      return res.status(200).json({
        success: true,
        message: "Image compressed successfully",
        downloadUrl: `/downloads/${outputFilename}`
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/convert/resize-image
  async resizeImage(req, res, next) {
    try {
      const { width, height } = req.body;
      const outputFilename = await imageService.resizeImage(
        req.file.path,
        req.file.originalname,
        req.file.mimetype,
        width,
        height
      );
      cleanTempFile(req.file.path);
      return res.status(200).json({
        success: true,
        message: "Image resized successfully",
        downloadUrl: `/downloads/${outputFilename}`
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/convert/crop-image
  async cropImage(req, res, next) {
    try {
      const { width, height, left, top } = req.body;
      const outputFilename = await imageService.cropImage(
        req.file.path,
        req.file.originalname,
        width,
        height,
        left,
        top
      );
      cleanTempFile(req.file.path);
      return res.status(200).json({
        success: true,
        message: "Image cropped successfully",
        downloadUrl: `/downloads/${outputFilename}`
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = convertController;
