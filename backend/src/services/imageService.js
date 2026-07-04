/**
 * services/imageService.js
 *
 * Image processing service using ImageMagick CLI.
 * All operations are offloaded to ImageMagick (magick) via executeCommand.
 * No Sharp dependencies are used here to avoid native module compilation issues.
 */

const fs     = require("fs");
const path   = require("path");
const logger = require("../utils/logger");
const { executeCommand } = require("../utils/executeCommand");
const { buildOutputPath } = require("../utils/pathHelper");
const { DOWNLOADS_DIR }   = require("../config/paths");
const TOOLS = require("../config/tools");
const ToolError = require("../errors/ToolError");

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Map position strings to ImageMagick gravity values
const GRAVITY_MAP = {
  "center": "Center",
  "top-left": "NorthWest",
  "top-right": "NorthEast",
  "bottom-left": "SouthWest",
  "bottom-right": "SouthEast",
};

const imageService = {
  /**
   * Convert image to a target format.
   * Supports JPG, PNG, WEBP, AVIF, etc.
   */
  async convertFormat(inputPath, originalName, targetFormat, quality = 85) {
    const ext = targetFormat.toLowerCase();
    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const q = Math.min(Math.max(Math.round(quality), 1), 100);
    const t0 = Date.now();

    const args = [inputPath, "-quality", String(q), fullPath];
    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to convert file to format "${ext}"`);
    }

    logger.tool("imagemagick", `${originalName} → ${filename}`, { ms: Date.now() - t0, quality: q });
    return { filename, fullPath };
  },

  /**
   * Compress image while keeping its format.
   */
  async compressImage(inputPath, originalName, mimetype, quality = 75) {
    let ext = path.extname(originalName).replace(".", "").toLowerCase() || "jpeg";
    if (ext === "jpg") ext = "jpeg";

    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const q = Math.min(Math.max(Math.round(quality), 1), 100);
    const t0 = Date.now();

    const args = [inputPath, "-quality", String(q), fullPath];
    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to compress image`);
    }

    logger.tool("imagemagick", `compressed ${originalName} → ${filename}`, { ms: Date.now() - t0, quality: q });
    return { filename, fullPath };
  },

  /**
   * Resize image maintaining aspect ratio.
   */
  async resizeImage(inputPath, originalName, mimetype, width, height) {
    let ext = path.extname(originalName).replace(".", "").toLowerCase() || "jpeg";
    if (ext === "jpg") ext = "jpeg";

    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const t0 = Date.now();

    let resizeString = "";
    if (width && height) {
      resizeString = `${width}x${height}`;
    } else if (width) {
      resizeString = String(width);
    } else if (height) {
      resizeString = `x${height}`;
    } else {
      resizeString = "100%"; // No-op resize if neither parameter is passed
    }

    const args = [inputPath, "-resize", resizeString, fullPath];
    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to resize image`);
    }

    logger.tool("imagemagick", `resized ${originalName} → ${filename}`, { ms: Date.now() - t0, width, height });
    return { filename, fullPath };
  },

  /**
   * Crop image using coordinates.
   */
  async cropImage(inputPath, originalName, width, height, left, top) {
    let ext = path.extname(originalName).replace(".", "").toLowerCase() || "jpeg";
    if (ext === "jpg") ext = "jpeg";

    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const t0 = Date.now();

    const cropString = `${width}x${height}+${left}+${top}`;
    const args = [inputPath, "-crop", cropString, "+repage", fullPath];
    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to crop image`);
    }

    logger.tool("imagemagick", `cropped ${originalName} → ${filename}`, { ms: Date.now() - t0 });
    return { filename, fullPath };
  },

  /**
   * Rotate image by a given angle.
   */
  async rotateImage(inputPath, originalName, angle = 90, background = "#ffffff") {
    let ext = path.extname(originalName).replace(".", "").toLowerCase() || "jpeg";
    if (ext === "jpg") ext = "jpeg";

    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const t0 = Date.now();

    const args = [inputPath, "-background", background, "-rotate", String(angle), fullPath];
    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to rotate image`);
    }

    logger.tool("imagemagick", `rotated ${originalName} ${angle}° → ${filename}`, { ms: Date.now() - t0, angle });
    return { filename, fullPath };
  },

  /**
   * Add a text watermark to an image.
   */
  async addWatermark(inputPath, originalName, text = "Watermark", opts = {}) {
    let ext = path.extname(originalName).replace(".", "").toLowerCase() || "jpeg";
    if (ext === "jpg") ext = "jpeg";

    const { filename, fullPath } = buildOutputPath(DOWNLOADS_DIR, originalName, ext);
    const t0 = Date.now();

    const fontSize = parseInt(opts.fontSize, 10) || 36;
    const colour   = opts.colour || "rgba(255,255,255,0.5)";
    const position = opts.position || "center";
    const gravity  = GRAVITY_MAP[position] || "Center";

    const args = [
      inputPath,
      "-gravity", gravity,
      "-pointsize", String(fontSize),
      "-fill", colour,
      "-annotate", "0", text,
      fullPath
    ];

    await executeCommand(TOOLS.IMAGEMAGICK, args);

    if (!fs.existsSync(fullPath)) {
      throw new ToolError("imagemagick", `Failed to add watermark to image`);
    }

    logger.tool("imagemagick", `watermarked ${originalName} → ${filename}`, { ms: Date.now() - t0, text });
    return { filename, fullPath };
  },

  /** Startup check */
  async checkInstallation() {
    const { checkToolAvailable } = require("../utils/executeCommand");
    return checkToolAvailable(TOOLS.IMAGEMAGICK, ["-version"]);
  },
};

module.exports = imageService;
