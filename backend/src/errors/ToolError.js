/**
 * errors/ToolError.js
 *
 * Thrown when an external CLI tool (ImageMagick, LibreOffice,
 * Ghostscript, Python, FFmpeg, etc.) fails or is not installed.
 *
 * Usage:
 *   throw new ToolError("imagemagick", "Unsupported format: bmp");
 *   throw new ToolError("libreoffice", err.message, true); // tool missing
 */
const AppError = require("./AppError");

class ToolError extends AppError {
  /**
   * @param {string} tool         - Tool name, e.g. "imagemagick", "libreoffice"
   * @param {string} message      - Error detail from stderr or the tool output
   * @param {boolean} [notFound]  - true if the binary could not be found at all
   */
  constructor(tool, message, notFound = false) {
    const prefix = notFound
      ? `[${tool.toUpperCase()}] Tool not found`
      : `[${tool.toUpperCase()}] Conversion failed`;

    super(`${prefix}: ${message}`, 500, "TOOL_ERROR");

    this.tool = tool;
    this.toolNotFound = notFound;
  }
}

module.exports = ToolError;
