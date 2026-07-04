/**
 * services/popplerService.js  [STUB — Future Ready]
 *
 * Poppler utils wrapper for PDF → image conversion (pdftoppm / pdftotext).
 *
 * To activate:
 *   1. Install: apt install poppler-utils  (or set PDFTOPPM_COMMAND env)
 *   2. Implement convertPdfToImages() below
 *   3. Add routes as needed
 *
 * Command: resolved from PDFTOPPM_COMMAND env (default: "pdftoppm").
 */

const TOOLS = require("../config/tools");
const { executeCommand } = require("../utils/executeCommand");
const path = require("path");
const fs = require("fs");
const { DOWNLOADS_DIR } = require("../config/paths");

const SCRIPTS_DIR = path.join(__dirname, "../scripts");

const popplerService = {
  /**
   * Convert PDF pages to images (PNG/JPEG).
   * @param {string} inputPath      - Path to input PDF
   * @param {string} originalName
   * @param {"png"|"jpeg"} [format] - Output image format
   * @param {number} [dpi=150]      - Resolution in DPI
   * @returns {Promise<{ filenames: string[], fullPaths: string[] }>}
   */
  async convertPdfToImages(inputPath, originalName, format = "png", dpi = 150) {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    const outputDirName = `pdf_pages_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const outputDir = path.join(DOWNLOADS_DIR, outputDirName);
    fs.mkdirSync(outputDir, { recursive: true });

    const scriptPath = path.join(SCRIPTS_DIR, "pdf_to_image.py");
    const args = [scriptPath, inputPath, outputDir, format, String(dpi)];

    const { stdout } = await executeCommand(TOOLS.PYTHON, args);
    const trimmed = stdout.trim();
    if (!trimmed) {
      throw new Error("PDF to image script produced no output.");
    }

    const fullPaths = trimmed.split(",").filter(Boolean);
    const filenames = fullPaths.map(p => path.relative(DOWNLOADS_DIR, p).replace(/\\/g, "/"));

    return { filenames, fullPaths };
  },

  /** Startup health check */
  async checkInstallation() {
    const { checkToolAvailable } = require("../utils/executeCommand");
    return checkToolAvailable(TOOLS.PDFTOPPM, ["-v"]);
  },
};

module.exports = popplerService;
