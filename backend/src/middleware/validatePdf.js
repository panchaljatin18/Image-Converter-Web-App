/**
 * middleware/validatePdf.js
 *
 * Production-grade PDF validation middleware for ConvertGalaxy.
 *
 * Layers:
 *  1. Filename safety     — same rules as image validation
 *  2. Magic bytes         — %PDF header check
 *  3. Encryption check    — reject password-protected PDFs
 *  4. Page count limit    — cap pages to prevent Ghostscript stalls
 *
 * Requires: pdf-parse  (already a peer dep of pdf-poppler or pdfjs-dist)
 * If pdf-parse is not installed, layers 3+4 are skipped gracefully.
 */

const path            = require("path");
const fs              = require("fs");
const ValidationError = require("../errors/ValidationError");
const logger          = require("../utils/logger");
const {
  MAX_PDF_PAGES,
  MAX_FILENAME_LENGTH,
  BLOCKED_EXTENSIONS,
} = require("../config/constants");

// ── Magic bytes ───────────────────────────────────────────────────────────────

/**
 * Read the first 8 bytes of a file.
 * @param {string} filePath
 * @returns {Buffer}
 */
function readHeader(filePath) {
  const fd = fs.openSync(filePath, "r");
  const buf = Buffer.alloc(8);
  fs.readSync(fd, buf, 0, 8, 0);
  fs.closeSync(fd);
  return buf;
}

/**
 * Verify the file starts with the %PDF magic bytes.
 * @param {string} filePath
 */
function verifyPdfMagicBytes(filePath) {
  const buf = readHeader(filePath);
  // %PDF → 25 50 44 46
  if (buf.toString("ascii", 0, 4) !== "%PDF") {
    throw new ValidationError(
      "The uploaded file is not a valid PDF document. " +
      "Please ensure you are uploading a real .pdf file.",
      "INVALID_PDF_SIGNATURE"
    );
  }
}

// ── Filename safety ───────────────────────────────────────────────────────────

function validatePdfFilename(originalname) {
  if (!originalname || typeof originalname !== "string") {
    throw new ValidationError("Missing or invalid filename.", "INVALID_FILENAME");
  }
  if (originalname.includes("\0")) {
    throw new ValidationError("Filename contains invalid null bytes.", "INVALID_FILENAME");
  }
  if (originalname.length > MAX_FILENAME_LENGTH) {
    throw new ValidationError(
      `Filename is too long. Maximum allowed length is ${MAX_FILENAME_LENGTH} characters.`,
      "FILENAME_TOO_LONG"
    );
  }
  if (originalname.includes("..") || originalname.includes("/") || originalname.includes("\\")) {
    throw new ValidationError(
      "Filename contains invalid path characters.",
      "INVALID_FILENAME_PATH"
    );
  }
  const ext = path.extname(originalname).toLowerCase();
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    throw new ValidationError(
      `Files with the extension "${ext}" are not allowed for security reasons.`,
      "BLOCKED_EXTENSION"
    );
  }
  if (ext !== ".pdf") {
    throw new ValidationError(
      "Only PDF files (.pdf) are accepted by this endpoint.",
      "WRONG_EXTENSION"
    );
  }
}

// ── Page count & encryption check (via pdf-parse) ────────────────────────────

/**
 * Attempt to parse the PDF to detect encryption and page count.
 * Gracefully skips if pdf-parse is not installed.
 * @param {string} filePath
 */
async function validatePdfContent(filePath) {
  let pdfParse;
  try {
    pdfParse = require("pdf-parse");
  } catch {
    // pdf-parse not installed — skip content checks
    logger.debug("pdf-parse not installed; skipping PDF content validation.");
    return;
  }

  const dataBuffer = fs.readFileSync(filePath);
  let data;
  try {
    data = await pdfParse(dataBuffer, { max: 0 }); // max: 0 = parse only metadata
  } catch (err) {
    const msg = err.message || "";
    // pdf-parse throws "encrypted" for password-protected documents
    if (msg.toLowerCase().includes("encrypt") || msg.toLowerCase().includes("password")) {
      throw new ValidationError(
        "Password-protected PDFs cannot be processed. " +
        "Please remove the password protection and try again.",
        "ENCRYPTED_PDF"
      );
    }
    // Any other parse error means the file is corrupted / not a real PDF
    throw new ValidationError(
      "The uploaded PDF appears to be corrupted or malformed and could not be opened. " +
      "Please try a different file.",
      "CORRUPTED_PDF"
    );
  }

  if (data.numpages && data.numpages > MAX_PDF_PAGES) {
    throw new ValidationError(
      `The PDF has ${data.numpages} pages, which exceeds the ${MAX_PDF_PAGES}-page limit. ` +
      "Please split the document and try again.",
      "TOO_MANY_PDF_PAGES"
    );
  }

  logger.debug("PDF validated", { filePath, pages: data.numpages });
}

// ── Exported middleware ───────────────────────────────────────────────────────

/**
 * Full PDF validation middleware.
 * Call AFTER upload.single("pdf") and validateUpload.
 */
async function validatePdfMiddleware(req, res, next) {
  try {
    const file = req.file;
    if (!file) return next();

    validatePdfFilename(file.originalname);
    verifyPdfMagicBytes(file.path);
    await validatePdfContent(file.path);

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validatePdfMiddleware,
  validatePdfFilename,
  verifyPdfMagicBytes,
  validatePdfContent,
};
