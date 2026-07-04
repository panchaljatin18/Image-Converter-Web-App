/**
 * middleware/uploadLimiter.js
 *
 * Dedicated rate limiter for upload/conversion endpoints.
 * Stricter than the general API limiter — prevents conversion abuse.
 *
 * Default: 20 conversion requests per IP per 15 minutes.
 * Override with UPLOAD_RATE_LIMIT_MAX env variable.
 */

const rateLimit = require("express-rate-limit");
const { RATE_LIMIT_WINDOW_MS, UPLOAD_RATE_LIMIT_MAX } = require("../config/constants");

const uploadLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: UPLOAD_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: `Too many conversion requests. Maximum ${UPLOAD_RATE_LIMIT_MAX} per 15 minutes per IP.`,
  },
  // Skip rate limiting for trusted IPs (e.g. internal health checks)
  skip: (req) => req.ip === "127.0.0.1" || req.ip === "::1",
});

module.exports = { uploadLimiter };
