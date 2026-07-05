/**
 * config/tools.js
 *
 * Single source of truth for all external CLI tool commands.
 *
 * Every command is resolved from an environment variable with a
 * cross-platform default. NO paths are hardcoded here.
 *
 * Override in your .env (or Render / Docker env) without touching code:
 *
 *   IMAGEMAGICK_COMMAND=convert        # ImageMagick 6 on old Linux
 *   GHOSTSCRIPT_COMMAND=gswin64c       # Windows 64-bit Ghostscript
 *   PYTHON_COMMAND=python              # Windows Python
 *   LIBREOFFICE_COMMAND=soffice        # Same on all platforms
 */
const fs = require("fs");
let libreOfficeCmd = process.env.LIBREOFFICE_COMMAND || "soffice";
if (libreOfficeCmd === "soffice" && process.platform === "win32") {
  const defaultWinPath = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
  if (fs.existsSync(defaultWinPath)) {
    libreOfficeCmd = defaultWinPath;
  }
}

let tesseractCmd = process.env.TESSERACT_COMMAND || "tesseract";
if (tesseractCmd === "tesseract" && process.platform === "win32") {
  const defaultTessPath = "C:\\Program Files\\Tesseract-OCR\\tesseract.exe";
  if (fs.existsSync(defaultTessPath)) {
    tesseractCmd = defaultTessPath;
  }
}

module.exports = {
  /** ImageMagick 7 CLI — "magick" on Windows/Linux; "convert" on IM 6 */
  IMAGEMAGICK: process.env.IMAGEMAGICK_COMMAND || "magick",

  /** LibreOffice headless — "soffice" on Windows, Linux & Docker */
  LIBREOFFICE: libreOfficeCmd,

  /** Python interpreter — "python3" on Linux/Docker; "python" on Windows */
  PYTHON: process.env.PYTHON_COMMAND || "python3",

  /**
   * Ghostscript — "gs" on Linux/Docker/macOS; "gswin64c" on Windows 64-bit
   * Set GHOSTSCRIPT_COMMAND=gswin64c in your Windows .env
   */
  GHOSTSCRIPT: process.env.GHOSTSCRIPT_COMMAND || (process.platform === "win32" ? "gswin64c" : "gs"),

  /** FFmpeg — future video/audio support */
  FFMPEG: process.env.FFMPEG_COMMAND || "ffmpeg",

  /** FFprobe — companion to FFmpeg */
  FFPROBE: process.env.FFPROBE_COMMAND || "ffprobe",

  /** Poppler pdftoimage — future PDF→image support */
  PDFTOPPM: process.env.PDFTOPPM_COMMAND || "pdftoppm",

  /** Tesseract OCR — future OCR support */
  TESSERACT: tesseractCmd,
};
