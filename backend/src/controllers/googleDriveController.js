const googleDriveService = require("../services/googleDriveService");

/**
 * Get Google Drive Connection Status for current user
 */
const getStatus = async (req, res, next) => {
  try {
    const isConnected = !!(req.user.googleDrive && req.user.googleDrive.connected);
    res.status(200).json({
      success: true,
      connected: isConnected,
      email: isConnected ? req.user.googleDrive.email : null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate Google OAuth authorization consent page URL
 */
const getAuthUrl = async (req, res, next) => {
  try {
    const { redirectUri } = req.query;
    if (!redirectUri) {
      return res.status(400).json({
        success: false,
        message: "redirectUri query parameter is required."
      });
    }

    const authUrl = googleDriveService.getAuthUrl(redirectUri);
    res.status(200).json({
      success: true,
      url: authUrl
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Connect user's Google Drive via auth code exchange
 */
const connect = async (req, res, next) => {
  try {
    const { code, redirectUri } = req.body;
    if (!code || !redirectUri) {
      return res.status(400).json({
        success: false,
        message: "Both authorization code and redirectUri are required in request body."
      });
    }

    const { tokens, email } = await googleDriveService.exchangeCode(code, redirectUri);

    // Save tokens and connect state to user model
    req.user.googleDrive = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || (req.user.googleDrive ? req.user.googleDrive.refreshToken : undefined), // Keep old refresh token if not sent
      expiryDate: tokens.expiry_date,
      connected: true,
      email: email
    };

    await req.user.save();

    res.status(200).json({
      success: true,
      message: "Google Drive connected successfully.",
      email: email
    });
  } catch (err) {
    console.error("Error connecting Google Drive:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to exchange auth code."
    });
  }
};

/**
 * Disconnect Google Drive
 */
const disconnect = async (req, res, next) => {
  try {
    req.user.googleDrive = {
      connected: false,
      accessToken: undefined,
      refreshToken: undefined,
      expiryDate: undefined,
      email: undefined
    };

    await req.user.save();

    res.status(200).json({
      success: true,
      message: "Google Drive disconnected successfully."
    });
  } catch (err) {
    next(err);
  }
};

/**
 * List Google Drive files/folders
 */
const listFiles = async (req, res, next) => {
  try {
    const { folderId, query, pageToken, redirectUri } = req.query;

    if (!req.user.googleDrive || !req.user.googleDrive.connected) {
      return res.status(400).json({
        success: false,
        message: "Google Drive account is not connected."
      });
    }

    const data = await googleDriveService.listFiles(req.user, {
      folderId,
      query,
      pageToken,
      redirectUri
    });

    res.status(200).json({
      success: true,
      ...data
    });
  } catch (err) {
    console.error("Error listing files:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch files from Google Drive."
    });
  }
};

/**
 * Retrieve metadata for a single Google Drive file
 */
const getFileMetadata = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { redirectUri } = req.query;

    if (!req.user.googleDrive || !req.user.googleDrive.connected) {
      return res.status(400).json({
        success: false,
        message: "Google Drive account is not connected."
      });
    }

    const metadata = await googleDriveService.getFileMetadata(req.user, id, redirectUri);
    res.status(200).json({
      success: true,
      file: metadata
    });
  } catch (err) {
    console.error("Error fetching file metadata:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve Google Drive file metadata."
    });
  }
};

/**
 * Download a file from Google Drive (Streams content to client)
 */
const downloadFile = async (req, res, next) => {
  try {
    const { fileId, redirectUri } = req.body;
    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "fileId is required in request body."
      });
    }

    if (!req.user.googleDrive || !req.user.googleDrive.connected) {
      return res.status(400).json({
        success: false,
        message: "Google Drive account is not connected."
      });
    }

    // 1. Get metadata for header details
    const metadata = await googleDriveService.getFileMetadata(req.user, fileId, redirectUri);

    // 2. Fetch data stream
    const dataStream = await googleDriveService.downloadFile(req.user, fileId, redirectUri);

    // Set attachment response headers
    res.setHeader("Content-Type", metadata.mimeType || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(metadata.name)}"`);

    dataStream.pipe(res);
  } catch (err) {
    console.error("Error downloading file:", err);
    // Only send JSON response if headers have not been sent yet
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to download file from Google Drive."
      });
    }
  }
};

module.exports = {
  getStatus,
  getAuthUrl,
  connect,
  disconnect,
  listFiles,
  getFileMetadata,
  downloadFile
};
