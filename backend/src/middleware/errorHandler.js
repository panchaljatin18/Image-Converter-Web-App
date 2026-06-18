const fs = require("fs");
const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  // If there was a file uploaded, delete it to prevent temporary file accumulation
  if (req.file && req.file.path) {
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) console.error(`Error deleting temp file ${req.file.path}:`, unlinkErr);
    });
  }

  // Handle Multer limits/errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File is too large. Maximum limit is 20MB."
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Handle custom validation or processing errors
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred during image processing.";

  console.error("Error handler caught:", err);

  res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = errorHandler;
