/**
 * errors/ValidationError.js
 *
 * Thrown when user input or uploaded file fails validation.
 * Always maps to HTTP 400 Bad Request.
 *
 * Usage:
 *   throw new ValidationError("Width must be a positive integer.");
 *   throw new ValidationError("Unsupported file format.", "INVALID_FORMAT");
 */
const AppError = require("./AppError");

class ValidationError extends AppError {
  /**
   * @param {string} message        - Human-readable validation message
   * @param {string} [code]         - Optional machine-readable code
   * @param {object} [fields]       - Optional map of { fieldName: errorMessage }
   */
  constructor(message, code = "VALIDATION_ERROR", fields = null) {
    super(message, 400, code);
    this.fields = fields; // exposed in error response when present
  }
}

module.exports = ValidationError;
