const express = require("express");
const router = express.Router();
const dropboxController = require("../controllers/dropboxController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/status", dropboxController.getStatus);
router.get("/auth-url", dropboxController.getAuthUrl);
router.post("/connect", dropboxController.connect);
router.post("/disconnect", dropboxController.disconnect);
router.get("/files", dropboxController.listFiles);
router.get("/file/:id", dropboxController.getFileMetadata);
router.post("/download", dropboxController.downloadFile);

module.exports = router;
