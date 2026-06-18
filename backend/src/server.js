require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/image_converter";

// Ensure uploads and downloads directories exist on startup
const uploadsPath = path.join(__dirname, "uploads");
const downloadsPath = path.join(__dirname, "downloads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
if (!fs.existsSync(downloadsPath)) {
  fs.mkdirSync(downloadsPath, { recursive: true });
}

// Connect to MongoDB Database
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Database connected successfully.");
    
    // Create HTTP server
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`Server running in ${process.env.NODE_ENV || "development"} mode`);
      console.log(`Local link: http://localhost:${PORT}`);
      console.log(`=========================================`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Promise Rejection:", err);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error("Database Connection Failure. Server not started:", err);
    process.exit(1);
  });
