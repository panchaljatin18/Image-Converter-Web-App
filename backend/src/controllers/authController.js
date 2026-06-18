const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

// Helper to sign password reset JWT token (15 mins duration)
const generateResetToken = (id) => {
  return jwt.sign({ id, type: "reset" }, process.env.JWT_SECRET, {
    expiresIn: "15m"
  });
};

const authController = {
  // POST /api/auth/register
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email address is already registered."
        });
      }

      // Create new user
      await User.create({
        name,
        email,
        password
      });

      return res.status(201).json({
        success: true,
        message: "Account created successfully"
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide an email and password."
        });
      }

      // Find user and include password field
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password."
        });
      }

      // Match password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password."
        });
      }

      // Generate token
      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/forgot-password
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Please enter your email address."
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No account found with this email address."
        });
      }

      // Generate secure reset token
      const resetToken = generateResetToken(user._id);

      // Create reset link (pointing to frontend reset page)
      const resetUrl = `${process.env.CORS_ORIGIN || "http://localhost:3000"}/reset-password?token=${resetToken}`;

      // In production, you would send this via email.
      // Here, we return it in the response for simulation and simple UI demonstration.
      console.log(`[PASSWORD RESET LINK]: ${resetUrl}`);

      return res.status(200).json({
        success: true,
        message: "Password reset link generated successfully. Please check your inbox.",
        resetUrl: resetUrl // Returned for development/demo ease
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/reset-password
  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: "Reset token and new password are required."
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long."
        });
      }

      // Verify reset token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Reset token is invalid or has expired."
        });
      }

      if (decoded.type !== "reset") {
        return res.status(400).json({
          success: false,
          message: "Invalid token type."
        });
      }

      // Find user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User does not exist."
        });
      }

      // Update password
      user.password = password;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Password has been reset successfully."
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/me
  async getMe(req, res, next) {
    try {
      // User is already attached by protect middleware
      return res.status(200).json({
        success: true,
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          createdAt: req.user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
