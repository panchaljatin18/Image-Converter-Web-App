const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mailService = require("../services/mailService");
const bcrypt = require("bcryptjs");

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
          message: "Email already registered."
        });
      }

      // Check if any existing user uses the same password
      const users = await User.find({});
      for (const u of users) {
        const isMatch = await bcrypt.compare(password, u.password);
        if (isMatch) {
          return res.status(400).json({
            success: false,
            message: "This password has already been chosen by another user. Please choose a different password."
          });
        }
      }

      // Create new user
      await User.create({
        name,
        email,
        password
      });

      // Send welcome email alert
      await mailService.sendWelcomeEmail(email, name);

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

      // Send login alert email
      await mailService.sendLoginAlertEmail(user.email, user.name);

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
  },

  // POST /api/auth/google-login
  async googleLogin(req, res, next) {
    const logger = require("../utils/logger");
    try {
      const { idToken } = req.body;

      logger.info("[GOOGLE OAUTH]: Received Google login request on backend.");

      if (!idToken) {
        logger.warn("[GOOGLE OAUTH]: Missing Google ID token in request body.");
        return res.status(400).json({
          success: false,
          message: "Google ID token is required."
        });
      }

      const { OAuth2Client } = require("google-auth-library");
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      let payload;
      try {
        logger.info("[GOOGLE OAUTH]: Verifying ID token with Google API...");
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        payload = ticket.getPayload();
        logger.info("[GOOGLE OAUTH]: Google ID token verified successfully.", { email: payload.email });
      } catch (err) {
        logger.error("[GOOGLE OAUTH]: Google token verification failed.", { error: err.message });
        return res.status(401).json({
          success: false,
          message: "Invalid Google ID token. Please make sure you are selecting a valid account."
        });
      }

      const { sub: googleId, email, name, picture: avatar } = payload;

      logger.info("[GOOGLE OAUTH]: Searching MongoDB for user...", { email, googleId });
      let user = await User.findOne({ $or: [{ googleId }, { email }] });
      let isNewUser = false;

      if (user) {
        logger.info("[GOOGLE OAUTH]: User found in database.");
        let updated = false;
        if (!user.googleId) {
          user.googleId = googleId;
          updated = true;
          logger.info("[GOOGLE OAUTH]: Linking Google ID to existing email account.");
        }
        if (avatar && !user.avatar) {
          user.avatar = avatar;
          updated = true;
        }
        if (updated) {
          await user.save();
          logger.info("[GOOGLE OAUTH]: User record updated in MongoDB.");
        }
      } else {
        logger.info("[GOOGLE OAUTH]: User not found in database. Creating new user.");
        user = await User.create({
          name,
          email,
          googleId,
          avatar
        });
        logger.info("[GOOGLE OAUTH]: New user created successfully in MongoDB.");
        isNewUser = true;
      }

      // Send email notifications
      if (isNewUser) {
        await mailService.sendWelcomeEmail(user.email, user.name);
      } else {
        await mailService.sendLoginAlertEmail(user.email, user.name);
      }

      logger.info("[GOOGLE OAUTH]: Generating JWT token...");
      const token = generateToken(user._id);
      logger.info("[GOOGLE OAUTH]: JWT token generated successfully.");

      return res.status(200).json({
        success: true,
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      });
    } catch (error) {
      logger.error("[GOOGLE OAUTH]: Unexpected server error in googleLogin.", { error: error.message, stack: error.stack });
      next(error);
    }
  }
};

module.exports = authController;
