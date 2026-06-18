const fs = require("fs");

const validateUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file provided. Please upload an image."
    });
  }
  next();
};

const validateResize = (req, res, next) => {
  const { width, height } = req.body;

  if (!width && !height) {
    return res.status(400).json({
      success: false,
      message: "At least one of width or height must be specified for resizing."
    });
  }

  if (width && (isNaN(width) || parseInt(width, 10) <= 0)) {
    return res.status(400).json({
      success: false,
      message: "Width must be a positive integer."
    });
  }

  if (height && (isNaN(height) || parseInt(height, 10) <= 0)) {
    return res.status(400).json({
      success: false,
      message: "Height must be a positive integer."
    });
  }

  next();
};

const validateCrop = (req, res, next) => {
  const { width, height, left, top } = req.body;

  if (width === undefined || height === undefined || left === undefined || top === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing crop parameters. width, height, left, and top are required."
    });
  }

  const w = parseInt(width, 10);
  const h = parseInt(height, 10);
  const l = parseInt(left, 10);
  const t = parseInt(top, 10);

  if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0 || isNaN(l) || l < 0 || isNaN(t) || t < 0) {
    return res.status(400).json({
      success: false,
      message: "Crop parameters (width, height) must be positive integers, and (left, top) must be non-negative integers."
    });
  }

  next();
};

module.exports = {
  validateUpload,
  validateResize,
  validateCrop
};
