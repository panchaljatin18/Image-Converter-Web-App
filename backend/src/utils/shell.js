/**
 * utils/shell.js
 *
 * Wraps child_process.exec in a Promise.
 * All services use this — controllers NEVER call exec directly.
 */

const { exec } = require("child_process");

/**
 * Run a shell command and resolve with { stdout, stderr }.
 * Rejects with a clean Error on non-zero exit codes.
 *
 * @param {string} command
 * @param {object} [opts]   - optional child_process.exec options
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
function runCommand(command, opts = {}) {
  return new Promise((resolve, reject) => {
    exec(command, { maxBuffer: 1024 * 1024 * 50, ...opts }, (error, stdout, stderr) => {
      if (error) {
        // Attach stderr to the error message so callers get useful details
        const detail = stderr ? stderr.trim() : error.message;
        return reject(new Error(`Command failed: ${command}\n${detail}`));
      }
      resolve({ stdout, stderr });
    });
  });
}

module.exports = { runCommand };
