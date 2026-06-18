const express = require("express");
const router = express.Router();
const onedriveController = require("../controllers/onedriveController");
const { protect } = require("../middleware/auth");

// All OneDrive/Microsoft Graph endpoints require backend authentication
router.use(protect);

// Get connection status
router.get("/status", onedriveController.getStatus);

// Get OAuth authorization consent page URL
router.get("/auth-url", onedriveController.getAuthUrl);

// Connect OneDrive (OAuth code exchange)
router.post("/connect", onedriveController.connect);

// Disconnect OneDrive
router.post("/disconnect", onedriveController.disconnect);

// List files/folders in OneDrive
router.get("/files", onedriveController.listFiles);

// Get metadata of a file
router.get("/file/:id", onedriveController.getFileMetadata);

// Download file (streams binary content)
router.post("/download", onedriveController.downloadFile);

module.exports = router;
