const { Dropbox } = require("dropbox");
const { Readable } = require("stream");

const getMimeFromExtension = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  const mimeMap = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    avif: "image/avif",
    gif: "image/gif",
    bmp: "image/bmp",
    ico: "image/x-icon",
    tiff: "image/tiff",
    tif: "image/tiff",
    heic: "image/heic",
    heif: "image/heif",
    jxl: "image/jxl",
    pdf: "application/pdf"
  };
  return mimeMap[ext] || "application/octet-stream";
};

const getAuthUrl = (redirectUri) => {
  const clientId = process.env.DROPBOX_CLIENT_ID;
  if (!clientId) {
    throw new Error("Dropbox API Credentials are not configured in the backend environment settings.");
  }
  return `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&token_access_type=offline`;
};

const exchangeCode = async (code, redirectUri) => {
  const clientId = process.env.DROPBOX_CLIENT_ID;
  const clientSecret = process.env.DROPBOX_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Dropbox API Credentials are not configured in the backend environment settings.");
  }

  const params = new URLSearchParams();
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", redirectUri);

  const response = await fetch("https://api.dropbox.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.error || "Failed to exchange auth code with Dropbox.");
  }

  const dbx = new Dropbox({ accessToken: data.access_token });
  const accountInfo = await dbx.usersGetCurrentAccount();

  return {
    tokens: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiryDate: Date.now() + (data.expires_in * 1000)
    },
    email: accountInfo.result.email
  };
};

const getDropboxClient = async (user, redirectUri) => {
  if (!user.dropbox || !user.dropbox.connected) {
    throw new Error("User has not connected Dropbox.");
  }

  let accessToken = user.dropbox.accessToken;
  let expiryDate = user.dropbox.expiryDate;
  const refreshToken = user.dropbox.refreshToken;

  const isExpired = Date.now() >= (expiryDate - 120000);

  if (isExpired && refreshToken) {
    try {
      console.log(`Refreshing Dropbox access token for user ${user._id}`);
      const clientId = process.env.DROPBOX_CLIENT_ID;
      const clientSecret = process.env.DROPBOX_CLIENT_SECRET;

      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", refreshToken);
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);

      const response = await fetch("https://api.dropbox.com/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error_description || data.error || "Failed to refresh Dropbox token");
      }

      accessToken = data.access_token;
      expiryDate = Date.now() + (data.expires_in * 1000);

      user.dropbox.accessToken = accessToken;
      user.dropbox.expiryDate = expiryDate;
      if (data.refresh_token) {
        user.dropbox.refreshToken = data.refresh_token;
      }
      await user.save();
    } catch (err) {
      console.error("Failed to refresh Dropbox access token:", err);
      user.dropbox.connected = false;
      await user.save();
      throw new Error("Dropbox authorization has expired. Please reconnect your account.");
    }
  }

  return new Dropbox({ accessToken });
};

const listFiles = async (user, { folderId = "", query = "", pageToken = "", redirectUri }) => {
  const dbx = await getDropboxClient(user, redirectUri);
  
  if (query) {
    const response = await dbx.filesSearchV2({
      query,
      options: {
        path: folderId || "",
        max_results: 50,
        file_extensions: ["jpg", "jpeg", "png", "webp", "avif", "gif", "bmp", "ico", "tiff", "heic", "heif", "jxl", "pdf"]
      }
    });

    const files = response.result.matches.map(match => {
      const metadata = match.metadata.metadata;
      const isFolder = metadata[".tag"] === "folder";
      return {
        id: metadata.path_lower,
        name: metadata.name,
        mimeType: isFolder ? "application/vnd.google-apps.folder" : getMimeFromExtension(metadata.name),
        size: metadata.size,
        path: metadata.path_display
      };
    });

    return { files };
  } else {
    let response;
    if (pageToken) {
      response = await dbx.filesListFolderContinue({ cursor: pageToken });
    } else {
      response = await dbx.filesListFolder({
        path: folderId || "",
        limit: 50
      });
    }

    const files = response.result.entries.map(entry => {
      const isFolder = entry[".tag"] === "folder";
      return {
        id: entry.path_lower,
        name: entry.name,
        mimeType: isFolder ? "application/vnd.google-apps.folder" : getMimeFromExtension(entry.name),
        size: entry.size,
        path: entry.path_display
      };
    });

    const supportedFiles = files.filter(file => {
      if (file.mimeType === "application/vnd.google-apps.folder") return true;
      const ext = file.name.split(".").pop().toLowerCase();
      return ["jpg", "jpeg", "png", "webp", "avif", "gif", "bmp", "ico", "tiff", "heic", "heif", "jxl", "pdf"].includes(ext);
    });

    return {
      files: supportedFiles,
      nextPageToken: response.result.has_more ? response.result.cursor : null
    };
  }
};

const getFileMetadata = async (user, fileId, redirectUri) => {
  const dbx = await getDropboxClient(user, redirectUri);
  const response = await dbx.filesGetMetadata({ path: fileId });
  const metadata = response.result;
  const isFolder = metadata[".tag"] === "folder";
  return {
    id: metadata.path_lower,
    name: metadata.name,
    mimeType: isFolder ? "application/vnd.google-apps.folder" : getMimeFromExtension(metadata.name),
    size: metadata.size
  };
};

const downloadFile = async (user, fileId, redirectUri) => {
  const dbx = await getDropboxClient(user, redirectUri);
  const accessToken = dbx.auth.getAccessToken();

  const response = await fetch("https://content.dropboxapi.com/2/files/download", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Dropbox-API-Arg": JSON.stringify({ path: fileId })
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to download file from Dropbox.");
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
