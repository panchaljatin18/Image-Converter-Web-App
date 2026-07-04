/**
 * server.js
 *
 * Application entry point.
 * Responsibilities:
 *   1. Run startup tool checks (non-fatal, informational)
 *   2. Ensure runtime directories exist (uploads, downloads)
 *   3. Connect to MongoDB
 *   4. Start HTTP server
 *   5. Handle unhandled rejections & exceptions gracefully
 */

require("dotenv").config();

const http      = require("http");
const fs        = require("fs");
const mongoose  = require("mongoose");
const app       = require("./app");
const { runToolCheck } = require("./startup/toolCheck");
const logger    = require("./utils/logger");
const { UPLOADS_DIR, DOWNLOADS_DIR } = require("./config/paths");

const PORT     = process.env.PORT     || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/image_converter";

async function start() {
  // ── 1. Tool availability check ──────────────────────────────────────────────
  await runToolCheck();

  // ── 2. Ensure runtime directories ──────────────────────────────────────────
  [UPLOADS_DIR, DOWNLOADS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });

  // ── 3. Connect to MongoDB ───────────────────────────────────────────────────
  await mongoose.connect(MONGO_URI);
  logger.info("MongoDB connected successfully.");

  // ── 4. Start HTTP server ────────────────────────────────────────────────────
  const server = http.createServer(app);

  server.listen(PORT, () => {
    logger.info(`Server started`, {
      port: PORT,
      environment: process.env.NODE_ENV || "development",
      url: `http://localhost:${PORT}`,
    });
  });

  // ── 5. Graceful shutdown handlers ───────────────────────────────────────────
  process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Promise Rejection — shutting down.", { message: err.message });
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception — shutting down.", { message: err.message, stack: err.stack });
    server.close(() => process.exit(1));
  });

  process.on("SIGTERM", () => {
    logger.info("SIGTERM received — closing server gracefully.");
    server.close(() => {
      mongoose.disconnect();
      process.exit(0);
    });
  });
}

start().catch((err) => {
  logger.error("Fatal error during startup.", { message: err.message });
  process.exit(1);
});
