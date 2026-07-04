/**
 * errors/AppError.js
 *
 * Base class for all application-level errors.
 * Extends the native Error so it works with Express error middleware.
 *
 * Usage:
 *   throw new AppError("File not found", 404);
 */
class AppError extends Error {
  /**
   * @param {string} message      - Human-readable error message
   * @param {number} statusCode   - HTTP status code (default 500)
   * @param {string} [code]       - Optional machine-readable error code
   */
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;

    // Marks this as an expected, operational error (not a programmer bug).
    // The global error handler uses this flag to decide log verbosity.
    this.isOperational = true;

    // Capture stack trace, excluding this constructor frame
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = AppError;
