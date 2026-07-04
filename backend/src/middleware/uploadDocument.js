/**
 * middleware/uploadDocument.js
 *
 * Separate Multer configuration for document and PDF file uploads.
 * Used by documentRoutes and pdfRoutes.
 *
 * Supported:
 *   Documents: PDF, DOCX, DOC, ODT, PPTX, PPT, ODP, XLSX, XLS, ODS
 *   Max size:  from MAX_DOCUMENT_SIZE env (default: 50 MB)
 */

const multer = require("multer");
const path   = require("path");
const fs     = require("fs");
const { UPLOADS_DIR } = require("../config/paths");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_DOC_EXTENSIONS = [
  ".pdf",
  ".docx", ".doc", ".odt", ".rtf",
  ".pptx", ".ppt", ".odp",
  ".xlsx", ".xls", ".ods", ".csv",
];

const ALLOWED_DOC_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/msword",                                                        // doc
  "application/vnd.oasis.opendocument.text",                                  // odt
  "application/rtf", "text/rtf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "application/vnd.ms-powerpoint",                                             // ppt
  "application/vnd.oasis.opendocument.presentation",                          // odp
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",        // xlsx
  "application/vnd.ms-excel",                                                  // xls
  "application/vnd.oasis.opendocument.spreadsheet",                           // ods
  "text/csv",
  "application/octet-stream",  // Some clients send this for unknown types
];

const MAX_DOC_SIZE = Number(process.env.MAX_DOCUMENT_SIZE) || 50 * 1024 * 1024; // 50 MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `doc_${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  // Be lenient on MIME type (browsers vary) but strict on extension
  if (ALLOWED_DOC_EXTENSIONS.includes(ext)) {
    return cb(null, true);
  }
  cb(new multer.MulterError(
    "LIMIT_UNEXPECTED_FILE",
    `Unsupported file type "${ext}". Allowed: ${ALLOWED_DOC_EXTENSIONS.join(", ")}`
  ));
};

const uploadDocument = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_DOC_SIZE, files: 1 },
});

module.exports = uploadDocument;
