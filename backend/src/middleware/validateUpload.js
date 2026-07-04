/**
 * middleware/validateUpload.js
 *
 * Extracted upload validation middleware.
 * Checks that a file was actually attached to the request.
 *
 * Separating this from upload.js follows Single Responsibility Principle —
 * Multer handles storage, this handles validation.
 */

const ValidationError = require("../errors/ValidationError");

/**
 * Ensure req.file exists after Multer processes the request.
 * Call this AFTER upload.single("image") in the route chain.
 */
function validateUpload(req, _res, next) {
  if (!req.file) {
    return next(new ValidationError(
      "No file uploaded. Please attach an image file with the field name \"image\".",
      "FILE_MISSING"
    ));
  }
  next();
}

module.exports = { validateUpload };
