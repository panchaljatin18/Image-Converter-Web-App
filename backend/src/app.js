const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");
const convertRoutes = require("./routes/convertRoutes");
const authRoutes = require("./routes/authRoutes");
const googleDriveRoutes = require("./routes/googleDriveRoutes");
const dropboxRoutes = require("./routes/dropboxRoutes");
const onedriveRoutes = require("./routes/onedriveRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ─── Security & Configuration Middleware ────────────────────────────────────

// Helmet headers for basic web security
app.use(helmet({
  crossOriginResourcePolicy: false // Allows Next.js frontend to fetch images/downloads
}));

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:3000"];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development mode, allow any local network origin (localhost, 127.0.0.1, or local IP addresses)
    const isLocalOrLan = process.env.NODE_ENV === "development" || 
                         /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin);

    if (isLocalOrLan || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy does not allow access from this Origin."));
  },
  credentials: true
}));

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Rate Limiting to prevent brute-force attacks and abuse
const limiterWindowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000;
const limiterMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100;

const apiLimiter = rateLimit({
  windowMs: limiterWindowMs,
  max: limiterMax,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiter to conversion and auth APIs
app.use("/api/convert", apiLimiter);
app.use("/api/auth", apiLimiter);
app.use("/api/google-drive", apiLimiter);
app.use("/api/dropbox", apiLimiter);
app.use("/api/onedrive", apiLimiter);

// ─── Serve Static Processed Files ───────────────────────────────────────────
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/convert", convertRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/google-drive", googleDriveRoutes);
app.use("/api/dropbox", dropboxRoutes);
app.use("/api/onedrive", onedriveRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

// Catch-all 404 for unhandled routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
