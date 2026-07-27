/**
 * app.js
 *
 * Express application setup.
 *
 * What this file does:
 *  - Loads config (env, constants)
 *  - Registers security, CORS, body parser middleware
 *  - Registers API routes
 *  - Registers global error handler (MUST be last)
 *
 * What this file does NOT do:
 *  - Call child_process (moved to services)
 *  - Connect to MongoDB (done in server.js)
 *  - Run tool checks (done in server.js startup)
 *  - Hardcode any paths or binary names
 */

require("dotenv").config();

const express   = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const path      = require("path");
const rateLimit = require("express-rate-limit");

const logger        = require("./utils/logger");
const { DOWNLOADS_DIR } = require("./config/paths");
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } = require("./config/constants");

const convertRoutes     = require("./routes/convertRoutes");
const authRoutes        = require("./routes/authRoutes");
const googleDriveRoutes = require("./routes/googleDriveRoutes");
const dropboxRoutes     = require("./routes/dropboxRoutes");
const onedriveRoutes    = require("./routes/onedriveRoutes");
const documentRoutes    = require("./routes/documentRoutes");
const pdfRoutes         = require("./routes/pdfRoutes");
const errorHandler      = require("./middleware/errorHandler");


const NODE_ENV     = process.env.NODE_ENV || "development";
const CORS_ORIGIN  = process.env.CORS_ORIGIN  || "http://localhost:3000";

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow Next.js frontend to load /downloads files
}));

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = CORS_ORIGIN.split(",").map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    console.log("Incoming Origin:", origin);

    if (!origin) return callback(null, true);

    const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const isLan = /^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)\d+\.\d+(:\d+)?$/.test(origin);
    const isDomain = /^https?:\/\/(www\.)?convertgalaxy\.com(:\d+)?$/.test(origin);

    if (
      isLocal ||
      isLan ||
      isDomain ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes("*")
    ) {
      return callback(null, true);
    }

    console.log("Blocked Origin:", origin);
    callback(new Error("CORS: origin not allowed."));
  },
  credentials: true,
  exposedHeaders: ["Content-Length"],
}));

// ── HTTP request logger ───────────────────────────────────────────────────────
// Uses morgan-style output through our structured logger
app.use((req, _res, next) => {
  logger.debug(`${req.method} ${req.originalUrl}`, { ip: req.ip });
  next();
});

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── General API rate limiter ──────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

app.use("/api/auth",         generalLimiter);
app.use("/api/google-drive", generalLimiter);
app.use("/api/dropbox",      generalLimiter);
app.use("/api/onedrive",     generalLimiter);
// Note: /api/convert uses uploadLimiter (per-route) defined in convertRoutes.js

// ── Static file serving ───────────────────────────────────────────────────────
app.use("/downloads", express.static(DOWNLOADS_DIR, {
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Range, Content-Type");
    res.set("Access-Control-Expose-Headers", "Content-Length, Content-Range");
  }
}));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/convert",      convertRoutes);
app.use("/api/auth",         authRoutes);
app.use("/api/google-drive", googleDriveRoutes);
app.use("/api/dropbox",      dropboxRoutes);
app.use("/api/onedrive",     onedriveRoutes);
app.use("/api/documents",    documentRoutes);
app.use("/api/pdf",          pdfRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    environment: NODE_ENV,
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    code: "NOT_FOUND",
  });
});

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

module.exports = app;