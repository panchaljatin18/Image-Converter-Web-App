/**
 * utils/fileCleanup.js
 *
 * Utilities for deleting temporary files after processing.
 *
 * Design rules:
 *  - NEVER throws — a cleanup failure must not override the conversion result.
 *  - Called in finally{} blocks so files are deleted even when conversion fails.
 *  - Works with both single files and arrays of paths.
 *
 * Usage:
 *   const { cleanFile, cleanFiles, cleanDir } = require("../utils/fileCleanup");
 *
 *   // In a try/finally block:
 *   finally { await cleanFile(req.file.path); }
 *   finally { await cleanFiles([inputPath, tempPath]); }
 *   finally { await cleanDir(tmpWorkDir); }
 */

const fs     = require("fs").promises;
const fsSync = require("fs");
const logger = require("./logger");

/**
 * Delete a single file silently.
 * @param {string|null|undefined} filePath
 */
async function cleanFile(filePath) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
    logger.debug("Cleaned temp file", { path: filePath });
  } catch (err) {
    // ENOENT = file already gone — that's fine
    if (err.code !== "ENOENT") {
      logger.warn("Failed to clean temp file", { path: filePath, error: err.message });
    }
  }
}

/**
 * Delete multiple files silently (parallel).
 * @param {Array<string|null|undefined>} filePaths
 */
async function cleanFiles(filePaths = []) {
  await Promise.all(filePaths.map(cleanFile));
}

/**
 * Delete an entire directory and its contents silently.
 * @param {string|null|undefined} dirPath
 */
async function cleanDir(dirPath) {
  if (!dirPath) return;
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    logger.debug("Cleaned temp directory", { path: dirPath });
  } catch (err) {
    logger.warn("Failed to clean temp directory", { path: dirPath, error: err.message });
  }
}

/**
 * Synchronous version for use in error handlers / process exit hooks.
 * @param {string} filePath
 */
function cleanFileSync(filePath) {
  if (!filePath) return;
  try {
    fsSync.unlinkSync(filePath);
  } catch {
    // silent
  }
}

module.exports = { cleanFile, cleanFiles, cleanDir, cleanFileSync };
