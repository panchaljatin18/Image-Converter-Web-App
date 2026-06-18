const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const dropboxService = {
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
    return res;
  },

  async getStatus(token) {
    return this.fetchWithAuth(`${API_URL}/dropbox/status`, token);
  },

  async getAuthUrl(token, redirectUri) {
    return this.fetchWithAuth(`${API_URL}/dropbox/auth-url?redirectUri=${encodeURIComponent(redirectUri)}`, token);
  },

  async connect(token, code, redirectUri) {
    return this.fetchWithAuth(`${API_URL}/dropbox/connect`, token, {
      method: "POST",
      body: JSON.stringify({ code, redirectUri })
    });
  },

  async disconnect(token) {
    return this.fetchWithAuth(`${API_URL}/dropbox/disconnect`, token, {
      method: "POST"
    });
  },

  async getFiles(token, folderId = "", query = "", pageToken = "") {
    const url = new URL(`${API_URL}/dropbox/files`);
    url.searchParams.set("folderId", folderId);
    if (query) url.searchParams.set("query", query);
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    
    const redirectUri = `${window.location.origin}/dashboard/dropbox/callback`;
    url.searchParams.set("redirectUri", redirectUri);

    return this.fetchWithAuth(url.toString(), token);
  },

  async getFileMetadata(token, fileId) {
    const redirectUri = `${window.location.origin}/dashboard/dropbox/callback`;
    return this.fetchWithAuth(`${API_URL}/dropbox/file/${encodeURIComponent(fileId)}?redirectUri=${encodeURIComponent(redirectUri)}`, token);
  },

  async downloadFile(token, fileId) {
    const redirectUri = `${window.location.origin}/dashboard/dropbox/callback`;
    const res = await this.fetchWithAuth(`${API_URL}/dropbox/download`, token, {
      method: "POST",
      body: JSON.stringify({ fileId, redirectUri })
    });
    return res.blob();
  }
};

export default dropboxService;
