/**
 * config/env.js
 *
 * Central place for all environment variable resolution.
 * No Windows paths, no hardcoded executables — everything
 * comes from process.env with a sensible cross-platform default.
 *
 * On Windows  : IMAGEMAGICK_COMMAND defaults to "magick"
 * On Linux/Mac: "magick" also works for ImageMagick 7;
 *               set IMAGEMAGICK_COMMAND=convert for older IM6.
 */

module.exports = {
  // ── Server ──────────────────────────────────────────────────────────────────
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // ── Database ─────────────────────────────────────────────────────────────────
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/image_converter",

  // ── Auth ──────────────────────────────────────────────────────────────────────
  JWT_SECRET: process.env.JWT_SECRET || "change_me_in_production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // ── CORS ──────────────────────────────────────────────────────────────────────
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

  // ── Rate limiting ─────────────────────────────────────────────────────────────
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,

  // ── Upload ────────────────────────────────────────────────────────────────────
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024, // 20 MB

  // ── External tool commands ────────────────────────────────────────────────────
  // Set these in your .env (or Render environment) to override.
  // Defaults work on Windows (ImageMagick 7) and Linux (after apt install).
  IMAGEMAGICK_CMD: process.env.IMAGEMAGICK_COMMAND || "magick",
  LIBREOFFICE_CMD: process.env.LIBREOFFICE_COMMAND || "soffice",
  PYTHON_CMD: process.env.PYTHON_COMMAND || "python3",
};
