const express = require("express");
const router = express.Router();
const googleDriveController = require("../controllers/googleDriveController");
const { protect } = require("../middleware/auth");

// All Google Drive endpoints require backend authentication
router.use(protect);

// Get connection status
router.get("/status", googleDriveController.getStatus);

// Get OAuth authorization consent page URL
router.get("/auth-url", googleDriveController.getAuthUrl);

// Connect Google Drive (OAuth code exchange)
router.post("/connect", googleDriveController.connect);

// Disconnect Google Drive
router.post("/disconnect", googleDriveController.disconnect);

// List files/folders in Drive
router.get("/files", googleDriveController.listFiles);

// Get metadata of a file
router.get("/file/:id", googleDriveController.getFileMetadata);

// Download file (streams binary content)
router.post("/download", googleDriveController.downloadFile);

module.exports = router;
