const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const googleDriveService = {
  // Helper to fetch with token
  async fetchWithAuth(url, token, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }
      return data;
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => "Request failed");
      throw new Error(errText || "Request failed");
    }
    return res; // Return raw response for downloads
  },

  // Get status
  async getStatus(token) {
    return this.fetchWithAuth(`${API_URL}/google-drive/status`, token);
  },

  // Get Auth URL
  async getAuthUrl(token, redirectUri) {
    return this.fetchWithAuth(`${API_URL}/google-drive/auth-url?redirectUri=${encodeURIComponent(redirectUri)}`, token);
  },

  // Connect (code exchange)
  async connect(token, code, redirectUri) {
    return this.fetchWithAuth(`${API_URL}/google-drive/connect`, token, {
      method: "POST",
      body: JSON.stringify({ code, redirectUri })
    });
  },

  // Disconnect
  async disconnect(token) {
    return this.fetchWithAuth(`${API_URL}/google-drive/disconnect`, token, {
      method: "POST"
    });
  },

  // List files/folders
  async getFiles(token, folderId = "root", query = "", pageToken = "") {
    const url = new URL(`${API_URL}/google-drive/files`);
    url.searchParams.set("folderId", folderId);
    if (query) url.searchParams.set("query", query);
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    
    // Add redirectUri parameter
    const redirectUri = `${window.location.origin}/dashboard/google-drive/callback`;
    url.searchParams.set("redirectUri", redirectUri);

    return this.fetchWithAuth(url.toString(), token);
  },

  // Get file metadata
  async getFileMetadata(token, fileId) {
    const redirectUri = `${window.location.origin}/dashboard/google-drive/callback`;
    return this.fetchWithAuth(`${API_URL}/google-drive/file/${fileId}?redirectUri=${encodeURIComponent(redirectUri)}`, token);
  },

  // Download file (returns blob)
  async downloadFile(token, fileId) {
    const redirectUri = `${window.location.origin}/dashboard/google-drive/callback`;
    const res = await this.fetchWithAuth(`${API_URL}/google-drive/download`, token, {
      method: "POST",
      body: JSON.stringify({ fileId, redirectUri })
    });
    return res.blob();
  }
};

export default googleDriveService;
