const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// ─── Authentication Endpoints ────────────────────────────────────────────────

// Register User
router.post("/register", authController.register);

// Login User
router.post("/login", authController.login);

// Forgot Password
router.post("/forgot-password", authController.forgotPassword);

// Reset Password
router.post("/reset-password", authController.resetPassword);

// Get Current Logged-in User Profile (Protected)
router.get("/me", protect, authController.getMe);

module.exports = router;
