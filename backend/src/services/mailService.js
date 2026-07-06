const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

// Setup standard SMTP transporter using env variables.
// Fallback to a mock transporter if no SMTP config is present.
let transporter;

const initTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    logger.info("[MAIL SERVICE]: Initializing SMTP transporter.", { host, port, user });
    transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: parseInt(port) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass
      }
    });
  } else {
    logger.warn("[MAIL SERVICE]: No SMTP credentials found in environment variables. Falling back to Gmail/Dummy logging.");
    // Create standard console fallback
    transporter = {
      sendMail: async (mailOptions) => {
        logger.info(`[MAIL SERVICE SIMULATION]: Email sent successfully to ${mailOptions.to}`);
        logger.info(`[Subject]: ${mailOptions.subject}`);
        logger.info(`[Body]: ${mailOptions.text}`);
        return { messageId: "simulated-id-" + Date.now() };
      }
    };
  }
  return transporter;
};

const mailService = {
  async sendWelcomeEmail(to, name) {
    const transporter = initTransporter();
    const mailOptions = {
      from: process.env.SMTP_FROM || `"ConvertGalaxy" <no-reply@convertgalaxy.com>`,
      to,
      subject: "Welcome to ConvertGalaxy! 🎉",
      text: `Hello ${name},\n\nWelcome to ConvertGalaxy! Your account has been registered successfully.\n\nYou can now convert, compress, resize, crop and edit all your images directly in your browser.\n\nBest regards,\nConvertGalaxy Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #0f0f1a; color: #f8fafc;">
          <h2 style="color: #6366f1; text-align: center;">Welcome to ConvertGalaxy! 🎉</h2>
          <p style="color: #e2e8f0;">Hello <strong>${name}</strong>,</p>
          <p style="color: #e2e8f0;">Welcome to ConvertGalaxy! Your account has been created successfully.</p>
          <p style="color: #e2e8f0;">You can now convert, compress, resize, and edit your images instantly directly inside your browser.</p>
          <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0;">
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`[MAIL SERVICE]: Welcome email sent successfully to ${to} (${info.messageId})`);
      return info;
    } catch (err) {
      logger.error(`[MAIL SERVICE]: Failed to send welcome email to ${to}`, { error: err.message });
    }
  },

  async sendLoginAlertEmail(to, name) {
    const transporter = initTransporter();
    const timestamp = new Date().toLocaleString();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || `"ConvertGalaxy" <no-reply@convertgalaxy.com>`,
      to,
      subject: "New Login Alert - ConvertGalaxy 🔐",
      text: `Hello ${name},\n\nWe detected a new login to your ConvertGalaxy account on ${timestamp}.\n\nIf this was you, you can safely ignore this email.\n\nBest regards,\nConvertGalaxy Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #0f0f1a; color: #f8fafc;">
          <h2 style="color: #6366f1; text-align: center;">New Login Detected 🔐</h2>
          <p style="color: #e2e8f0;">Hello <strong>${name}</strong>,</p>
          <p style="color: #e2e8f0;">We detected a new login to your ConvertGalaxy account at <strong>${timestamp}</strong>.</p>
          <p style="color: #e2e8f0;">If this was you, no action is required.</p>
          <p style="color: #ef4444; font-weight: bold;">If this wasn't you, please reset your password immediately to secure your account.</p>
          <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0;">
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">This is an automated security message. Please do not reply directly to this email.</p>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`[MAIL SERVICE]: Login alert email sent successfully to ${to} (${info.messageId})`);
      return info;
    } catch (err) {
      logger.error(`[MAIL SERVICE]: Failed to send login alert email to ${to}`, { error: err.message });
    }
  }
};

module.exports = mailService;
