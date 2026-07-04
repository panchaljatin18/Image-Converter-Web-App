/**
 * utils/tempFile.js
 *
 * Utilities for creating unique temporary file/directory paths.
 * Uses the OS temp directory (os.tmpdir()) which is always writable on
 * Windows, Linux, macOS, and Docker containers (/tmp).
 *
 * Usage:
 *   const { makeTempPath, makeTempDir } = require("../utils/tempFile");
 *
 *   const tmpPath = makeTempPath("png");   // e.g. /tmp/ic_1720000000000_a3f2.png
 *   const tmpDir  = await makeTempDir();   // creates /tmp/ic_1720000000000_b9c1/
 */

const os   = require("os");
const path = require("path");
const fs   = require("fs").promises;
const crypto = require("crypto");

/** Generate a short unique ID */
function uid() {
  return crypto.randomBytes(4).toString("hex");
}

/**
 * Build a unique temp file path WITHOUT creating the file.
 * @param {string} [ext]  - File extension without the dot (e.g. "png")
 * @returns {string}      - Absolute path in OS temp dir
 */
function makeTempPath(ext = "") {
  const suffix = ext ? `.${ext}` : "";
  const name   = `ic_${Date.now()}_${uid()}${suffix}`;
  return path.join(os.tmpdir(), name);
}

/**
 * Create a unique temp directory and return its path.
 * The caller is responsible for cleaning it up via cleanDir().
 * @returns {Promise<string>}
 */
async function makeTempDir() {
  const dirPath = path.join(os.tmpdir(), `ic_dir_${Date.now()}_${uid()}`);
  await fs.mkdir(dirPath, { recursive: true });
  return dirPath;
}

module.exports = { makeTempPath, makeTempDir };
