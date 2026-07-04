/**
 * config/paths.js
 *
 * All filesystem paths resolved once, in one place.
 * Uses __dirname relative to src/ so it works regardless of
 * the current working directory when the process is started.
 *
 * On Docker/Render these directories are created at runtime by server.js.
 */
const path = require("path");
const os   = require("os");

// Root of the src/ directory
const SRC_ROOT = path.join(__dirname, "..");

module.exports = {
  /** Directory where Multer stores uploaded files before processing */
  UPLOADS_DIR: path.join(SRC_ROOT, "uploads"),

  /** Directory where converted output files are served from */
  DOWNLOADS_DIR: path.join(SRC_ROOT, "downloads"),

  /**
   * System temp directory — used for intermediate files created by
   * LibreOffice and Ghostscript. Cleaned up immediately after each job.
   * On Docker this maps to /tmp which is always writable.
   */
  TEMP_DIR: os.tmpdir(),
};
