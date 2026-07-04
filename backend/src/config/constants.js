/**
 * config/constants.js
 *
 * Application-wide constants — supported formats, size limits, etc.
 * Change values here and they automatically propagate everywhere.
 */
module.exports = {
  // ── Upload ────────────────────────────────────────────────────────────────
  /** Maximum upload file size in bytes (default: 50 MB) */
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024,

  /** Maximum number of files per request */
  MAX_FILES_PER_REQUEST: 1,

  // ── Supported input formats (accepted by Multer) ─────────────────────────
  ALLOWED_IMAGE_EXTENSIONS: [
    ".jpg", ".jpeg", ".png", ".webp", ".avif",
    ".heic", ".heif", ".bmp", ".gif", ".tiff", ".tif", ".svg",
  ],

  ALLOWED_IMAGE_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/heic",
    "image/heif",
    "image/bmp",
    "image/gif",
    "image/tiff",
    "image/svg+xml",
    // Some clients send these for HEIC
    "image/x-heic",
    "image/x-heif",
  ],

  // ── Supported output formats ──────────────────────────────────────────────
  /** Formats that Sharp (libvips) can write natively */
  SHARP_OUTPUT_FORMATS: ["jpeg", "jpg", "png", "webp", "avif", "gif", "tiff", "tif", "heif", "heic"],

  /** RAW camera formats — cannot be produced, only read */
  RAW_FORMATS: [
    "3fr", "arw", "cr2", "cr3", "crw", "dcr", "dng", "erf",
    "kdc", "mdc", "mef", "mos", "mrw", "nef", "nrw", "orf",
    "pef", "raf", "raw", "rw2", "srf", "x3f",
  ],

  // ── Job queue ─────────────────────────────────────────────────────────────
  /** Timeout in ms for any single conversion (5 minutes) */
  CONVERSION_TIMEOUT_MS: 5 * 60 * 1000,

  // ── Rate limiting ─────────────────────────────────────────────────────────
  RATE_LIMIT_WINDOW_MS:  parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)  || 15 * 60 * 1000,
  RATE_LIMIT_MAX:        parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  UPLOAD_RATE_LIMIT_MAX: parseInt(process.env.UPLOAD_RATE_LIMIT_MAX, 10)  || 20,
};
