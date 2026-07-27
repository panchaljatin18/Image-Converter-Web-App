/**
 * middleware/upload.js
 *
 * Multer configuration for handling file uploads.
 *
 * Supported formats: JPG, JPEG, PNG, WebP, AVIF, HEIC, HEIF,
 *                    BMP, GIF, TIFF, TIF, SVG
 *
 * Max upload size: configured via MAX_FILE_SIZE env (default: 50 MB).
 * All values come from config/constants.js — no magic numbers here.
 */

const multer = require("multer");
const path   = require("path");
const fs     = require("fs");
const { UPLOADS_DIR } = require("../config/paths");
const {
  MAX_FILE_SIZE,
  MAX_FILES_PER_REQUEST,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME_TYPES,
} = require("../config/constants");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ── Storage ────────────────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),

  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

// ── File validation ────────────────────────────────────────────────────────

const fileFilter = (_req, file, cb) => {
  const ext      = path.extname(file.originalname).toLowerCase();
  const extValid = ALLOWED_IMAGE_EXTENSIONS.includes(ext);
  const mimetype = file.mimetype ? file.mimetype.toLowerCase() : "";
  const mimeValid = ALLOWED_IMAGE_MIME_TYPES.includes(mimetype) || mimetype === "application/octet-stream" || !mimetype;

  if (extValid && mimeValid) {
    return cb(null, true);
  }

  cb(
    new multer.MulterError(
      "LIMIT_UNEXPECTED_FILE",
      `Unsupported format. Allowed: ${ALLOWED_IMAGE_EXTENSIONS.join(", ")}`
    )
  );
};

// ── Multer instance ────────────────────────────────────────────────────────

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_PER_REQUEST,
  },
});

module.exports = upload;