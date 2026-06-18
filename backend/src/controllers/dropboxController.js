const dropboxService = require("../services/dropboxService");

const getStatus = async (req, res, next) => {
  try {
    const isConnected = !!(req.user.dropbox && req.user.dropbox.connected);
    res.status(200).json({
      success: true,
      connected: isConnected,
      email: isConnected ? req.user.dropbox.email : null
    });
  } catch (err) {
    next(err);
  }
};

const getAuthUrl = async (req, res, next) => {
  try {
    const { redirectUri } = req.query;
    if (!redirectUri) {
      return res.status(400).json({
        success: false,
        message: "redirectUri query parameter is required."
      });
    }

    const authUrl = dropboxService.getAuthUrl(redirectUri);
    res.status(200).json({
      success: true,
      url: authUrl
    });
  } catch (err) {
    next(err);
  }
};

const connect = async (req, res, next) => {
  try {
    const { code, redirectUri } = req.body;
    if (!code || !redirectUri) {
      return res.status(400).json({
        success: false,
        message: "Both authorization code and redirectUri are required in request body."
      });
    }

    const { tokens, email } = await dropboxService.exchangeCode(code, redirectUri);

    req.user.dropbox = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || (req.user.dropbox ? req.user.dropbox.refreshToken : undefined),
      expiryDate: tokens.expiryDate,
      connected: true,
      email: email
    };

    await req.user.save();

    res.status(200).json({
      success: true,
      message: "Dropbox connected successfully.",
      email: email
    });
  } catch (err) {
    console.error("Error connecting Dropbox:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to exchange auth code."
    });
  }
};

const disconnect = async (req, res, next) => {
  try {
    req.user.dropbox = {
      connected: false,
      accessToken: undefined,
      refreshToken: undefined,
      expiryDate: undefined,
      email: undefined
    };

    await req.user.save();

    res.status(200).json({
      success: true,
      message: "Dropbox disconnected successfully."
    });
  } catch (err) {
    next(err);
  }
};

const listFiles = async (req, res, next) => {
  try {
    const { folderId, query, pageToken, redirectUri } = req.query;

    if (!req.user.dropbox || !req.user.dropbox.connected) {
      return res.status(400).json({
        success: false,
        message: "Dropbox account is not connected."
      });
    }

    const data = await dropboxService.listFiles(req.user, {
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
    console.error("Error listing Dropbox files:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch files from Dropbox."
    });
  }
};

const getFileMetadata = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { redirectUri } = req.query;

    if (!req.user.dropbox || !req.user.dropbox.connected) {
      return res.status(400).json({
        success: false,
        message: "Dropbox account is not connected."
      });
    }

    const metadata = await dropboxService.getFileMetadata(req.user, id, redirectUri);
    res.status(200).json({
      success: true,
      file: metadata
    });
  } catch (err) {
    console.error("Error fetching Dropbox file metadata:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve Dropbox file metadata."
    });
  }
};

const downloadFile = async (req, res, next) => {
  try {
    const { fileId, redirectUri } = req.body;
    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "fileId is required in request body."
      });
    }

    if (!req.user.dropbox || !req.user.dropbox.connected) {
      return res.status(400).json({
        success: false,
        message: "Dropbox account is not connected."
      });
    }

    const metadata = await dropboxService.getFileMetadata(req.user, fileId, redirectUri);
    const dataStream = await dropboxService.downloadFile(req.user, fileId, redirectUri);

    res.setHeader("Content-Type", metadata.mimeType || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(metadata.name)}"`);

    dataStream.pipe(res);
  } catch (err) {
    console.error("Error downloading Dropbox file:", err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to download file from Dropbox."
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
