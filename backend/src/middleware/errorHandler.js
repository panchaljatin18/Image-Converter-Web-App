/**
 * middleware/errorHandler.js
 *
 * Global Express error handler.
 * Must be the LAST middleware registered in app.js (4-argument signature).
 *
 * Handles:
 *   - AppError (operational, known errors)
 *   - ToolError (external CLI failures)
 *   - ValidationError (bad input)
 *   - MulterError (file upload issues)
 *   - Mongoose validation errors
 *   - Unexpected programmer errors (logged with full stack)
 *
 * Response shape is always:
 *   { success: false, message: string, code?: string, fields?: object }
 *
 * Temp files attached to the request are cleaned up automatically.
 */

const multer = require("multer");
const { cleanFileSync } = require("../utils/fileCleanup");
const AppError = require("../errors/AppError");
const ToolError = require("../errors/ToolError");
const ValidationError = require("../errors/ValidationError");
const logger = require("../utils/logger");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // ── Cleanup any uploaded temp file ────────────────────────────────────────
  if (req.file?.path) {
    cleanFileSync(req.file.path);
  }

  // ── Multer errors ─────────────────────────────────────────────────────────
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? `File too large. Maximum allowed size is ${
            Math.round(require("../config/constants").MAX_FILE_SIZE / (1024 * 1024))
          } MB.`
        : err.message;

    return res.status(400).json({ success: false, message, code: err.code });
  }

  // ── Typed operational errors ───────────────────────────────────────────────
  if (err instanceof ValidationError) {
    logger.warn("Validation error", { message: err.message, fields: err.fields });
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      ...(err.fields ? { fields: err.fields } : {}),
    });
  }

  if (err instanceof ToolError) {
    logger.error("Tool error", {
      tool: err.tool,
      message: err.message,
      notFound: err.toolNotFound,
    });
    return res.status(500).json({
      success: false,
      message: err.toolNotFound
        ? `The "${err.tool}" tool is not installed on this server. Contact support.`
        : "Conversion failed. Please try a different file or format.",
      code: err.code,
    });
  }

  if (err instanceof AppError) {
    if (err.isOperational) {
      logger.warn("Operational error", { message: err.message, code: err.code });
    } else {
      logger.error("Application error", { message: err.message, stack: err.stack });
    }
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  // ── Mongoose validation errors ─────────────────────────────────────────────
  if (err.name === "ValidationError" && err.errors) {
    const fields = Object.fromEntries(
      Object.entries(err.errors).map(([k, v]) => [k, v.message])
    );
    logger.warn("Mongoose validation error", { fields });
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      code: "MONGOOSE_VALIDATION",
      fields,
    });
  }

  // ── Mongoose CastError (bad ObjectId) ─────────────────────────────────────
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format.",
      code: "INVALID_ID",
    });
  }

  // ── MongoDB duplicate key ──────────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
      code: "DUPLICATE_KEY",
    });
  }

  // ── JWT errors ─────────────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token.", code: "JWT_INVALID" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token has expired.", code: "JWT_EXPIRED" });
  }

  // ── Unexpected / programmer errors ────────────────────────────────────────
  logger.error("Unhandled error", {
    message: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : "[hidden in production]",
  });

  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again later.",
    code: "INTERNAL_ERROR",
    ...(process.env.NODE_ENV !== "production" ? { debug: err.message } : {}),
  });
};

module.exports = errorHandler;
