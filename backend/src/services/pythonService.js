/**
 * services/pythonService.js
 *
 * Python interpreter wrapper for script-based operations.
 *
 * Use cases:
 *   - Background removal (rembg)
 *   - ML-based upscaling
 *   - Custom AI image processing scripts
 *   - Any Python-based conversion task
 *
 * Security: execFile (not exec) — args are an array, no shell injection.
 * Scripts must be in src/scripts/ — user-controlled paths are NEVER allowed.
 * Command: resolved from PYTHON_COMMAND env (default: "python3").
 */

const path   = require("path");
const fs     = require("fs");
const logger = require("../utils/logger");
const { executeCommand } = require("../utils/executeCommand");
const { buildOutputPath } = require("../utils/pathHelper");
const { DOWNLOADS_DIR }  = require("../config/paths");
const TOOLS = require("../config/tools");
const AppError = require("../errors/AppError");

// Scripts must live in a controlled directory — never from user input
const SCRIPTS_DIR = path.join(__dirname, "../scripts");

const pythonService = {
  /**
   * Run a trusted Python script with file arguments.
   * The script name must be a simple filename (no path traversal).
   *
   * @param {string} scriptName    - e.g. "remove_background.py" (filename only)
   * @param {string} inputPath     - Absolute path to input file
   * @param {string} originalName  - For naming the output file
   * @param {string} outputExt     - Output file extension (e.g. "png")
   * @param {string[]} [extraArgs] - Additional safe CLI args for the script
   * @returns {Promise<{ filename: string, fullPath: string }>}
   */
  async runScript(scriptName, inputPath, originalName, outputExt, extraArgs = []) {
    // Prevent path traversal — only allow simple filenames
    if (path.basename(scriptName) !== scriptName || scriptName.includes("..")) {
      throw new AppError("Invalid script name.", 400, "INVALID_SCRIPT");
    }

    const scriptPath = path.join(SCRIPTS_DIR, scriptName);
    if (!fs.existsSync(scriptPath)) {
      throw new AppError(`Script "${scriptName}" not found.`, 404, "SCRIPT_NOT_FOUND");
    }

    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, outputExt);
    const t0 = Date.now();

    const args = [scriptPath, inputPath, fullPath, ...extraArgs];
    await executeCommand(TOOLS.PYTHON, args);

    if (!fs.existsSync(fullPath)) {
      throw new AppError(`Python script "${scriptName}" produced no output.`, 500, "SCRIPT_NO_OUTPUT");
    }

    logger.tool("python", `${scriptName}: ${originalName} → ${filename}`, { ms: Date.now() - t0 });
    return { filename, fullPath };
  },

  /**
   * Remove background from an image using rembg (must be installed).
   *
   * @param {string} inputPath
   * @param {string} originalName
   * @returns {Promise<{ filename: string, fullPath: string }>}
   */
  async removeBackground(inputPath, originalName) {
    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, "png");
    const t0 = Date.now();

    // rembg is a Python CLI tool: rembg i <input> <output>
    const rembgCmd = process.env.REMBG_COMMAND || "rembg";
    const { executeCommand: exec } = require("../utils/executeCommand");
    await exec(rembgCmd, ["i", inputPath, fullPath]);

    logger.tool("python/rembg", `removed background: ${originalName} → ${filename}`, {
      ms: Date.now() - t0,
    });
    return { filename, fullPath };
  },

  /** Startup health check */
  async checkInstallation() {
    const { checkToolAvailable } = require("../utils/executeCommand");
    return checkToolAvailable(TOOLS.PYTHON, ["--version"]);
  },
};

module.exports = pythonService;
