/**
 * utils/logger.js
 *
 * Structured logger for the application.
 * Outputs JSON in production, colorized text in development.
 *
 * Log levels: error > warn > info > debug
 *
 * Usage:
 *   const logger = require("../utils/logger");
 *   logger.info("Server started", { port: 5000 });
 *   logger.error("Conversion failed", { jobId, error: err.message });
 *   logger.tool("imagemagick", "converted photo.jpg → photo.png", { ms: 340 });
 */

const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD  = NODE_ENV === "production";

// ANSI colour codes (ignored in production JSON output)
const COLOURS = {
  reset:  "\x1b[0m",
  red:    "\x1b[31m",
  yellow: "\x1b[33m",
  green:  "\x1b[32m",
  cyan:   "\x1b[36m",
  grey:   "\x1b[90m",
  bold:   "\x1b[1m",
};

function timestamp() {
  return new Date().toISOString();
}

function formatDev(level, message, meta) {
  const colour =
    level === "ERROR" ? COLOURS.red :
    level === "WARN"  ? COLOURS.yellow :
    level === "INFO"  ? COLOURS.green :
    level === "TOOL"  ? COLOURS.cyan :
    COLOURS.grey;

  const metaStr = meta && Object.keys(meta).length
    ? " " + COLOURS.grey + JSON.stringify(meta) + COLOURS.reset
    : "";

  return `${COLOURS.grey}${timestamp()}${COLOURS.reset} ${colour}${COLOURS.bold}[${level}]${COLOURS.reset} ${message}${metaStr}`;
}

function formatProd(level, message, meta) {
  return JSON.stringify({ timestamp: timestamp(), level, message, ...meta });
}

function log(level, message, meta = {}) {
  const output = IS_PROD
    ? formatProd(level, message, meta)
    : formatDev(level, message, meta);

  if (level === "ERROR") {
    console.error(output);
  } else {
    console.log(output);
  }
}

const logger = {
  error: (message, meta = {}) => log("ERROR", message, meta),
  warn:  (message, meta = {}) => log("WARN",  message, meta),
  info:  (message, meta = {}) => log("INFO",  message, meta),
  debug: (message, meta = {}) => {
    if (!IS_PROD) log("DEBUG", message, meta);
  },

  /**
   * Log a tool invocation result.
   * @param {string} tool        - e.g. "imagemagick", "ghostscript"
   * @param {string} message     - e.g. "photo.jpg → photo.png"
   * @param {object} [meta]      - e.g. { ms: 340, inputSize: "2.3 MB" }
   */
  tool: (tool, message, meta = {}) =>
    log("TOOL", `[${tool.toUpperCase()}] ${message}`, meta),
};

module.exports = logger;
