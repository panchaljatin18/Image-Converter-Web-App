/**
 * services/documentService.js
 *
 * LibreOffice headless CLI wrapper for document format conversion.
 *
 * Supports:
 *   - DOCX / DOC / ODT → PDF
 *   - XLSX / XLS / ODS → PDF / CSV
 *   - PPTX / PPT / ODP → PDF
 *   - Any office ↔ any other office format
 *
 * Security: execFile (not exec) — no shell injection possible.
 * Command: resolved from LIBREOFFICE_COMMAND env (default: "soffice").
 *
 * LibreOffice quirk: --convert-to writes to an OUTPUT DIRECTORY,
 * not a specific filename. We use a unique temp dir per job to
 * prevent race conditions under concurrent load.
 */

const fs     = require("fs");
const path   = require("path");
const logger = require("../utils/logger");
const { executeCommand } = require("../utils/executeCommand");
const { makeTempDir }    = require("../utils/tempFile");
const { cleanDir }       = require("../utils/fileCleanup");
const { buildOutputPath } = require("../utils/pathHelper");
const { DOWNLOADS_DIR }  = require("../config/paths");
const TOOLS = require("../config/tools");
const ToolError = require("../errors/ToolError");

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

const documentService = {
  /**
   * Convert a document file to a different format.
   *
   * @param {string} inputPath     - Absolute path of the uploaded file
   * @param {string} originalName  - Original filename
   * @param {string} targetFormat  - e.g. "pdf", "docx", "xlsx"
   * @returns {Promise<{ filename: string, fullPath: string }>}
   */
  async convert(inputPath, originalName, targetFormat) {
    const ext   = targetFormat.toLowerCase();
    const tmpDir = await makeTempDir();
    const t0 = Date.now();

    try {
      // LibreOffice writes to a directory; the output filename is auto-generated
      const args = [
        "--headless",
        "--convert-to", ext,
        "--outdir", tmpDir,
        inputPath,
      ];

      await executeCommand(TOOLS.LIBREOFFICE, args);

      // LibreOffice names the output: <input-basename>.<target-ext>
      const inputBase = path.parse(inputPath).name;
      const loOutput  = path.join(tmpDir, `${inputBase}.${ext}`);

      if (!fs.existsSync(loOutput)) {
        throw new ToolError(
          "libreoffice",
          `No output produced. Expected: ${loOutput}. ` +
          `Ensure LibreOffice supports "${ext}" conversion.`
        );
      }

      // Move to downloads with a unique name
      const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
      fs.renameSync(loOutput, fullPath);

      logger.tool("libreoffice", `${originalName} → ${filename}`, { ms: Date.now() - t0 });
      return { filename, fullPath };
    } finally {
      // Always clean the temp dir — even on failure
      await cleanDir(tmpDir);
    }
  },

  /** Startup health check */
  async checkInstallation() {
    const { checkToolAvailable } = require("../utils/executeCommand");
    return checkToolAvailable(TOOLS.LIBREOFFICE, ["--version"]);
  },
};

module.exports = documentService;
