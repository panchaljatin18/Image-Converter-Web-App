const { Readable } = require("stream");

/**
 * Generate the Microsoft OAuth authorization URL
 */
const getAuthUrl = (redirectUri) => {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const tenantId = process.env.MICROSOFT_TENANT_ID || "common";
  if (!clientId) {
    throw new Error("Microsoft API Credentials are not configured in the backend environment settings.");
  }

  const scopes = encodeURIComponent("Files.Read User.Read offline_access");
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${scopes}`;
};

/**
 * Exchange Auth Code for Access & Refresh Tokens
 */
const exchangeCode = async (code, redirectUri) => {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const tenantId = process.env.MICROSOFT_TENANT_ID || "common";

  if (!clientId || !clientSecret) {
    throw new Error("Microsoft API Credentials are not configured in the backend environment settings.");
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("grant_type", "authorization_code");
  params.append("scope", "Files.Read User.Read offline_access");

  const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.error || "Failed to exchange authorization code with Microsoft.");
  }

  // Fetch user account email using Microsoft Graph API
  const meResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: {
      "Authorization": `Bearer ${data.access_token}`
    }
  });

  let email = "OneDrive User";
  if (meResponse.ok) {
    const meData = await meResponse.json();
    email = meData.mail || meData.userPrincipalName || "OneDrive User";
  }

  return {
    tokens: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiryDate: Date.now() + (data.expires_in * 1000)
    },
    email
  };
};

/**
 * Helper to obtain access token and handle rotation/refresh automatically
 */
const getOneDriveClientToken = async (user, redirectUri) => {
  if (!user.onedrive || !user.onedrive.connected) {
    throw new Error("User has not connected OneDrive.");
  }

  let accessToken = user.onedrive.accessToken;
  let expiryDate = user.onedrive.expiryDate;
  const refreshToken = user.onedrive.refreshToken;

  const isExpired = Date.now() >= (expiryDate - 120000); // 2 minutes window

  if (isExpired && refreshToken) {
    try {
      console.log(`Refreshing Microsoft OneDrive access token for user ${user._id}`);
      const clientId = process.env.MICROSOFT_CLIENT_ID;
      const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
      const tenantId = process.env.MICROSOFT_TENANT_ID || "common";

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);
      params.append("refresh_token", refreshToken);
      params.append("grant_type", "refresh_token");
      params.append("scope", "Files.Read User.Read offline_access");

      const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error_description || data.error || "Failed to refresh Microsoft token.");
      }

      accessToken = data.access_token;
      expiryDate = Date.now() + (data.expires_in * 1000);

      user.onedrive.accessToken = accessToken;
      user.onedrive.expiryDate = expiryDate;
      if (data.refresh_token) {
        user.onedrive.refreshToken = data.refresh_token;
      }
      await user.save();
    } catch (err) {
      console.error("Failed to refresh Microsoft OneDrive access token:", err);
      user.onedrive.connected = false;
      await user.save();
      throw new Error("OneDrive authorization has expired. Please reconnect your account.");
    }
  }

  return accessToken;
};

/**
 * List files and folders in OneDrive
 */
const listFiles = async (user, { folderId = "", query = "", pageToken = "", redirectUri }) => {
  const token = await getOneDriveClientToken(user, redirectUri);

  let url;
  if (query) {
    // Global search in OneDrive
    url = new URL("https://graph.microsoft.com/v1.0/me/drive/root/search");
    url.searchParams.set("q", query);
  } else if (folderId) {
    // List folder children
    url = new URL(`https://graph.microsoft.com/v1.0/me/drive/items/${folderId}/children`);
  } else {
    // Root folder children
    url = new URL("https://graph.microsoft.com/v1.0/me/drive/root/children");
  }

  if (!query) {
    url.searchParams.set("$top", "50");
    url.searchParams.set("$select", "id,name,size,file,folder");
  }

  const fetchUrl = pageToken ? pageToken : url.toString();

  const response = await fetch(fetchUrl, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to fetch files from OneDrive.");
  }

  const items = data.value || [];
  const formattedFiles = items.map(item => {
    const isFolder = !!item.folder;
    let mimeType = isFolder ? "application/vnd.google-apps.folder" : (item.file?.mimeType || "application/octet-stream");

    return {
      id: item.id,
      name: item.name,
      mimeType,
      size: item.size,
      path: item.id
    };
  });

  // Filter files that are folders or allowed image/document formats
  const supportedFiles = formattedFiles.filter(file => {
    if (file.mimeType === "application/vnd.google-apps.folder") return true;
    const ext = file.name.split(".").pop().toLowerCase();
    const isImage = file.mimeType.startsWith("image/");
    const isPdf = file.mimeType === "application/pdf" || ext === "pdf";
    const allowedExts = ["jpg", "jpeg", "png", "webp", "avif", "gif", "bmp", "ico", "tiff", "heic", "heif", "jxl"];
    return isImage || isPdf || allowedExts.includes(ext);
  });

  return {
    files: supportedFiles,
    nextPageToken: data["@odata.nextLink"] || null
  };
};

/**
 * Retrieve OneDrive file metadata
 */
const getFileMetadata = async (user, fileId, redirectUri) => {
  const token = await getOneDriveClientToken(user, redirectUri);
  const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to get file metadata from OneDrive.");
  }

  const isFolder = !!data.folder;
  return {
    id: data.id,
    name: data.name,
    mimeType: isFolder ? "application/vnd.google-apps.folder" : (data.file?.mimeType || "application/octet-stream"),
    size: data.size
  };
};

/**
 * Download a file from OneDrive as a binary stream
 */
const downloadFile = async (user, fileId, redirectUri) => {
  const token = await getOneDriveClientToken(user, redirectUri);

  const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to download file from OneDrive.");
  }

  return Readable.fromWeb(response.body);
};

module.exports = {
  getAuthUrl,
  exchangeCode,
  listFiles,
  getFileMetadata,
  downloadFile
};
