/**
 * utils/pathHelper.js
 *
 * Cross-platform path utilities.
 *
 * All services use these helpers instead of building paths manually,
 * ensuring consistent behaviour on Windows, Linux, and Docker.
 *
 * Usage:
 *   const { buildOutputPath, getExtension, sanitizeFilename } = require("../utils/pathHelper");
 */

const path   = require("path");
const crypto = require("crypto");

/**
 * Generate a unique output filename.
 *
 * Format: <original-basename>-<timestamp>-<uid>.<ext>
 * Example: photo-1720000000000-a3f2.png
 *
 * @param {string} originalName  - Original upload filename (e.g. "photo.jpg")
 * @param {string} targetExt     - Target extension without dot (e.g. "png")
 * @returns {string}             - Filename only (not a full path)
 */
function buildOutputFilename(originalName, targetExt) {
  const base = path
    .parse(originalName)
    .name
    .replace(/[^a-zA-Z0-9_\-]/g, "_") // sanitize non-alphanum chars
    .slice(0, 64);                      // cap length

  const uid = crypto.randomBytes(4).toString("hex");
  return `${base}-${Date.now()}-${uid}.${targetExt.toLowerCase()}`;
}

/**
 * Build a full absolute output path inside a given directory.
 *
 * @param {string} dir           - Output directory (e.g. paths.DOWNLOADS_DIR)
 * @param {string} originalName
 * @param {string} targetExt
 * @returns {{ filename: string, fullPath: string }}
 */
function buildOutputPath(dir, originalName, targetExt) {
  const filename = buildOutputFilename(originalName, targetExt);
  const fullPath = path.join(dir, filename);
  return { filename, fullPath };
}

/**
 * Normalize a file extension to lowercase without the dot.
 * e.g.  ".JPG" → "jpg",  "JPEG" → "jpeg",  ".PNG" → "png"
 *
 * @param {string} ext
 * @returns {string}
 */
function normalizeExt(ext) {
  return ext.replace(/^\./, "").toLowerCase();
}

/**
 * Get the lowercase extension of a filename (without dot).
 * @param {string} filename
 * @returns {string}
 */
function getExtension(filename) {
  return normalizeExt(path.extname(filename));
}

/**
 * Sanitize a filename to be safe for filesystem use.
 * Replaces path traversal sequences and special chars.
 *
 * @param {string} filename
 * @returns {string}
 */
function sanitizeFilename(filename) {
  return path
    .basename(filename)                 // strip any directory component
    .replace(/[^a-zA-Z0-9._\-]/g, "_") // replace special chars
    .replace(/\.{2,}/g, ".");           // collapse .. sequences
}

module.exports = {
  buildOutputFilename,
  buildOutputPath,
  normalizeExt,
  getExtension,
  sanitizeFilename,
};
