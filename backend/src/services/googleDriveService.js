const { google } = require("googleapis");

const getOAuth2Client = (redirectUri) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google API Credentials are not configured in the backend environment settings.");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

/**
 * Generate the OAuth consent screen URL
 */
const getAuthUrl = (redirectUri) => {
  const oauth2Client = getOAuth2Client(redirectUri);
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  });
};

/**
 * Exchange Authorization Code for Tokens
 */
const exchangeCode = async (code, redirectUri) => {
  const oauth2Client = getOAuth2Client(redirectUri);
  const { tokens } = await oauth2Client.getToken(code);
  
  // Get user details (email) using the access token
  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();

  return {
    tokens,
    email: userInfo.data.email
  };
};

/**
 * Get an authorized Google Drive API client, automatically rotating expired access tokens
 */
const getDriveClient = async (user, redirectUri) => {
  if (!user.googleDrive || !user.googleDrive.connected) {
    throw new Error("User has not connected Google Drive.");
  }

  const oauth2Client = getOAuth2Client(redirectUri);
  
  oauth2Client.setCredentials({
    access_token: user.googleDrive.accessToken,
    refresh_token: user.googleDrive.refreshToken,
    expiry_date: user.googleDrive.expiryDate
  });

  // Check if token is expired or close to expiring (within 2 minutes)
  const isExpired = Date.now() >= (user.googleDrive.expiryDate - 120000);

  if (isExpired && user.googleDrive.refreshToken) {
    try {
      console.log(`Refreshing access token for user ${user._id}`);
      const { credentials } = await oauth2Client.refreshAccessToken();
      
      // Update tokens in MongoDB
      user.googleDrive.accessToken = credentials.access_token;
      user.googleDrive.expiryDate = credentials.expiry_date;
      if (credentials.refresh_token) {
        user.googleDrive.refreshToken = credentials.refresh_token;
      }
      await user.save();

      oauth2Client.setCredentials(credentials);
    } catch (err) {
      console.error("Failed to refresh Google Drive access token:", err);
      // Mark as disconnected if refresh fails permanently
      user.googleDrive.connected = false;
      await user.save();
      throw new Error("Google Drive authorization has expired. Please reconnect your account.");
    }
  }

  return google.drive({ version: "v3", auth: oauth2Client });
};

/**
 * List files and folders
 */
const listFiles = async (user, { folderId = "root", query = "", pageToken = "", redirectUri }) => {
  const drive = await getDriveClient(user, redirectUri);
  
  let q = `trashed = false and '${folderId}' in parents and (mimeType = 'application/vnd.google-apps.folder' or mimeType starts with 'image/' or mimeType = 'application/pdf')`;
  if (query) {
    q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
  }

  const response = await drive.files.list({
    q,
    pageSize: 50,
    pageToken: pageToken || undefined,
    fields: "nextPageToken, files(id, name, mimeType, size, iconLink, thumbnailLink)"
  });

  return response.data;
};

/**
 * Retrieve metadata for a single file
 */
const getFileMetadata = async (user, fileId, redirectUri) => {
  const drive = await getDriveClient(user, redirectUri);
  const response = await drive.files.get({
    fileId,
    fields: "id, name, mimeType, size"
  });
  return response.data;
};

/**
 * Stream binary content for a file download
 */
const downloadFile = async (user, fileId, redirectUri) => {
  const drive = await getDriveClient(user, redirectUri);
  const response = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );
  return response.data;
};

module.exports = {
  getAuthUrl,
  exchangeCode,
  listFiles,
  getFileMetadata,
  downloadFile
};
