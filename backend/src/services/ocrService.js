/**
 * services/ocrService.js  [STUB — Future Ready]
 *
 * Tesseract OCR wrapper for extracting text from images.
 *
 * To activate:
 *   1. Install: apt install tesseract-ocr  (or set TESSERACT_COMMAND env)
 *   2. Implement extractText() below
 *   3. Add routes as needed
 *
 * Command: resolved from TESSERACT_COMMAND env (default: "tesseract").
 */

const TOOLS = require("../config/tools");
const { executeCommand } = require("../utils/executeCommand");
const path = require("path");
const fs = require("fs");

const SCRIPTS_DIR = path.join(__dirname, "../scripts");

const ocrService = {
  /**
   * Extract text from an image using Tesseract OCR.
   * @param {string} inputPath    - Path to image file
   * @param {string} [language]   - Language code e.g. "eng", "deu"
   * @returns {Promise<string>}   - Extracted text
   */
  async extractText(inputPath, language = "eng") {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    const scriptPath = path.join(SCRIPTS_DIR, "ocr_extractor.py");
    const args = [scriptPath, inputPath, language];

    const { stdout } = await executeCommand(TOOLS.PYTHON, args);
    return stdout.trim();
  },

  /** Startup health check */
  async checkInstallation() {
    const { checkToolAvailable } = require("../utils/executeCommand");
    return checkToolAvailable(TOOLS.TESSERACT, ["--version"]);
  },
};

module.exports = ocrService;
