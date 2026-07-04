/**
 * services/pdfService.js
 *
 * PDF operations using Ghostscript.
 *
 * Implements:
 *   - compressPdf()     — Reduce PDF file size with quality presets
 *   - optimizePdf()     — Full optimisation (downsampling + linearise)
 *   - reduceSize()      — Aggressive size reduction (screen preset)
 *   - convertToPdfA()   — Archive-safe PDF/A output
 *
 * Command: resolved from GHOSTSCRIPT_COMMAND env.
 *   Linux / Docker / Mac: "gs"          (default)
 *   Windows 64-bit:       "gswin64c"    → set GHOSTSCRIPT_COMMAND=gswin64c
 *   Windows 32-bit:       "gswin32c"    → set GHOSTSCRIPT_COMMAND=gswin32c
 *
 * Security: Uses executeCommand() (execFile) — args are arrays, no injection.
 * Controllers NEVER call Ghostscript directly — they call this service.
 */

const fs     = require("fs");
const logger = require("../utils/logger");
const { executeCommand } = require("../utils/executeCommand");
const { buildOutputPath } = require("../utils/pathHelper");
const { DOWNLOADS_DIR }  = require("../config/paths");
const TOOLS   = require("../config/tools");
const ToolError = require("../errors/ToolError");

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// ── PDF quality presets ────────────────────────────────────────────────────
//
// -dPDFSETTINGS values (from smallest to largest output):
//   /screen   → 72 dpi   — web viewing, smallest file
//   /ebook    → 150 dpi  — balanced (default)
//   /printer  → 300 dpi  — high quality for print
//   /prepress → 300 dpi  — maximum quality, colour-accurate
//
const PRESETS = {
  low:    "/screen",
  medium: "/ebook",
  high:   "/printer",
  max:    "/prepress",
};

// ── Common Ghostscript flags used in every invocation ─────────────────────
const GS_BASE_FLAGS = [
  "-dBATCH",
  "-dNOPAUSE",
  "-dQUIET",
  "-dSAFER",         // sandbox — prevents file-system writes outside output
];

const pdfService = {

  /**
   * Compress a PDF to reduce its file size.
   *
   * @param {string} inputPath       - Absolute path to the uploaded PDF
   * @param {string} originalName    - Original filename (for naming output)
   * @param {"low"|"medium"|"high"|"max"} [preset="medium"]
   * @returns {Promise<{ filename: string, fullPath: string }>}
   */
  async compressPdf(inputPath, originalName, preset = "medium") {
    const setting = PRESETS[preset] || PRESETS.medium;
    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, "pdf");
    const t0 = Date.now();

    const args = [
      ...GS_BASE_FLAGS,
      "-sDEVICE=pdfwrite",
      `-dPDFSETTINGS=${setting}`,
      `-sOutputFile=${fullPath}`,
      inputPath,
    ];

    await executeCommand(TOOLS.GHOSTSCRIPT, args);
    _assertOutputExists(fullPath, "compress");

    const originalSize = fs.statSync(inputPath).size;
    const outputSize   = fs.statSync(fullPath).size;
    const savings      = (((originalSize - outputSize) / originalSize) * 100).toFixed(1);

    logger.tool("ghostscript", `compressed ${originalName} → ${filename}`, {
      ms: Date.now() - t0,
      preset,
      originalSize: _kb(originalSize),
      outputSize:   _kb(outputSize),
      savings:      `${savings}%`,
    });

    return { filename, fullPath, savings: `${savings}%` };
  },

  /**
   * Optimise a PDF — combines downsampling, colour space and linearisation.
   *
   * @param {string} inputPath
   * @param {string} originalName
   * @param {number} [dpi=150]   - Image resolution target inside the PDF
   * @returns {Promise<{ filename: string, fullPath: string }>}
   */
  async optimizePdf(inputPath, originalName, dpi = 150) {
    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, "pdf");
    const t0 = Date.now();
    const d  = parseInt(dpi, 10) || 150;

    const args = [
      ...GS_BASE_FLAGS,
      "-sDEVICE=pdfwrite",
      "-dPDFSETTINGS=/ebook",
      `-dColorImageResolution=${d}`,
      `-dGrayImageResolution=${d}`,
      `-dMonoImageResolution=${d}`,
      "-dColorImageDownsampleType=/Bicubic",
      "-dGrayImageDownsampleType=/Bicubic",
      "-dCompatibilityLevel=1.5",
      `-sOutputFile=${fullPath}`,
      inputPath,
    ];

    await executeCommand(TOOLS.GHOSTSCRIPT, args);
    _assertOutputExists(fullPath, "optimize");

    logger.tool("ghostscript", `optimized ${originalName} → ${filename}`, { ms: Date.now() - t0, dpi: d });
    return { filename, fullPath };
  },

  /**
   * Aggressively reduce PDF size — targets smallest possible output.
   * Use when file size matters more than visual quality (e.g. email attachments).
   *
   * @param {string} inputPath
   * @param {string} originalName
   * @returns {Promise<{ filename: string, fullPath: string }>}
   */
  async reduceSize(inputPath, originalName) {
    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, "pdf");
    const t0 = Date.now();

    const args = [
      ...GS_BASE_FLAGS,
      "-sDEVICE=pdfwrite",
      "-dPDFSETTINGS=/screen",          // smallest preset
      "-dColorImageResolution=72",
      "-dGrayImageResolution=72",
      "-dMonoImageResolution=72",
      "-dDownsampleColorImages=true",
      "-dDownsampleGrayImages=true",
      "-dEmbedAllFonts=false",           // strip embedded fonts to save space
      `-sOutputFile=${fullPath}`,
      inputPath,
    ];

    await executeCommand(TOOLS.GHOSTSCRIPT, args);
    _assertOutputExists(fullPath, "reduce-size");

    const originalSize = fs.statSync(inputPath).size;
    const outputSize   = fs.statSync(fullPath).size;
    const savings      = (((originalSize - outputSize) / originalSize) * 100).toFixed(1);

    logger.tool("ghostscript", `reduced size ${originalName} → ${filename}`, {
      ms: Date.now() - t0,
      savings: `${savings}%`,
    });

    return { filename, fullPath, savings: `${savings}%` };
  },

  /**
   * Convert PDF to PDF/A (archival-safe format).
   * Uses Ghostscript's PDFA device.
   *
   * @param {string} inputPath
   * @param {string} originalName
   * @param {1|2|3} [level=2]     - PDF/A compliance level (1, 2, or 3)
   * @returns {Promise<{ filename: string, fullPath: string }>}
   */
  async convertToPdfA(inputPath, originalName, level = 2) {
    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, "pdf");
    const t0 = Date.now();
    const lvl = [1, 2, 3].includes(Number(level)) ? Number(level) : 2;

    const args = [
      ...GS_BASE_FLAGS,
      `-sDEVICE=pdfwrite`,
      `-dPDFA=${lvl}`,
      "-dPDFACompatibilityPolicy=1",
      `-sOutputFile=${fullPath}`,
      inputPath,
    ];

    await executeCommand(TOOLS.GHOSTSCRIPT, args);
    _assertOutputExists(fullPath, "pdf-a");

    logger.tool("ghostscript", `PDF/A-${lvl}: ${originalName} → ${filename}`, { ms: Date.now() - t0 });
    return { filename, fullPath };
  },

  /** Startup health check */
  async checkInstallation() {
    const { checkToolAvailable } = require("../utils/executeCommand");
    // Ghostscript uses --version on Linux, -version on Windows
    const r = await checkToolAvailable(TOOLS.GHOSTSCRIPT, ["--version"]);
    if (!r.available) return checkToolAvailable(TOOLS.GHOSTSCRIPT, ["-version"]);
    return r;
  },
};

// ── Private helpers ────────────────────────────────────────────────────────

function _assertOutputExists(fullPath, operation) {
  if (!fs.existsSync(fullPath)) {
    throw new ToolError("ghostscript", `${operation}: No output file produced at "${fullPath}".`);
  }
}

function _kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

module.exports = pdfService;
