const onedriveService = require("../services/onedriveService");

/**
 * Get OneDrive Connection Status for current user
 */
const getStatus = async (req, res, next) => {
  try {
    const isConnected = !!(req.user.onedrive && req.user.onedrive.connected);
    res.status(200).json({
      success: true,
      connected: isConnected,
      email: isConnected ? req.user.onedrive.email : null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate Microsoft OAuth authorization consent page URL
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

    const authUrl = onedriveService.getAuthUrl(redirectUri);
    res.status(200).json({
      success: true,
      url: authUrl
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Connect user's OneDrive via auth code exchange
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

    const { tokens, email } = await onedriveService.exchangeCode(code, redirectUri);

    // Save tokens and connect state to user model
    req.user.onedrive = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || (req.user.onedrive ? req.user.onedrive.refreshToken : undefined),
      expiryDate: tokens.expiryDate,
      connected: true,
      email: email
    };

    await req.user.save();

    res.status(200).json({
      success: true,
      message: "OneDrive connected successfully.",
      email: email
    });
  } catch (err) {
    console.error("Error connecting OneDrive:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to exchange auth code."
    });
  }
};

/**
 * Disconnect OneDrive
 */
const disconnect = async (req, res, next) => {
  try {
    req.user.onedrive = {
      connected: false,
      accessToken: undefined,
      refreshToken: undefined,
      expiryDate: undefined,
      email: undefined
    };

    await req.user.save();

    res.status(200).json({
      success: true,
      message: "OneDrive disconnected successfully."
    });
  } catch (err) {
    next(err);
  }
};

/**
 * List OneDrive files/folders
 */
const listFiles = async (req, res, next) => {
  try {
    const { folderId, query, pageToken, redirectUri } = req.query;

    if (!req.user.onedrive || !req.user.onedrive.connected) {
      return res.status(400).json({
        success: false,
        message: "OneDrive account is not connected."
      });
    }

    const data = await onedriveService.listFiles(req.user, {
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
    console.error("Error listing OneDrive files:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch files from OneDrive."
    });
  }
};

/**
 * Retrieve metadata for a single OneDrive file
 */
const getFileMetadata = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { redirectUri } = req.query;

    if (!req.user.onedrive || !req.user.onedrive.connected) {
      return res.status(400).json({
        success: false,
        message: "OneDrive account is not connected."
      });
    }

    const metadata = await onedriveService.getFileMetadata(req.user, id, redirectUri);
    res.status(200).json({
      success: true,
      file: metadata
    });
  } catch (err) {
    console.error("Error fetching OneDrive file metadata:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve OneDrive file metadata."
    });
  }
};

/**
 * Download a file from OneDrive (Streams content to client)
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

    if (!req.user.onedrive || !req.user.onedrive.connected) {
      return res.status(400).json({
        success: false,
        message: "OneDrive account is not connected."
      });
    }

    // 1. Get metadata for headers
    const metadata = await onedriveService.getFileMetadata(req.user, fileId, redirectUri);

    // 2. Fetch data stream
    const dataStream = await onedriveService.downloadFile(req.user, fileId, redirectUri);

    // Set headers
    res.setHeader("Content-Type", metadata.mimeType || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(metadata.name)}"`);

    dataStream.pipe(res);
  } catch (err) {
    console.error("Error downloading OneDrive file:", err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to download file from OneDrive."
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
