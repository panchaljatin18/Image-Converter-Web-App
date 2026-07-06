import { getApiUrl } from "../lib/apiUrl";
const API_URL = getApiUrl();

const authService = {
  // Store token in localStorage
  setToken(token) {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  },

  // Retrieve token from localStorage
  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  // Helper to fetch with Bearer token
  async fetchWithAuth(url, options = {}) {
    const token = this.getToken();
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

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  },

  // Register User
  async register(name, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  },

  // Login User
  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.success && data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  // Forgot Password
  async forgotPassword(email) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  },

  // Reset Password
  async resetPassword(token, password) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Password reset failed");
    }
    return data;
  },

  // Get current user profile
  async getCurrentUser() {
    return this.fetchWithAuth(`${API_URL}/auth/me`);
  },

  // Google Login
  async googleLogin(idToken) {
    let res;
    try {
      console.log("[GOOGLE OAUTH]: Sending ID token to backend API at:", `${API_URL}/auth/google-login`);
      res = await fetch(`${API_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
    } catch (networkError) {
      console.error("[GOOGLE OAUTH]: Network/CORS fetch error calling backend API:", networkError);
      throw new Error("Unable to connect to the backend server. Please verify that the backend API server is running on port 5000 and is accessible.");
    }

    const data = await res.json();
    if (!res.ok) {
      console.error("[GOOGLE OAUTH]: Backend server returned error status:", res.status, data.message || "Google Login failed");
      throw new Error(data.message || "Google Login failed");
    }

    if (data.success && data.token) {
      console.log("[GOOGLE OAUTH]: Backend authenticated successfully. Storing JWT token.");
      this.setToken(data.token);
    }
    return data;
  },

  // Logout
  logout() {
    this.setToken(null);
  }
};

export default authService;
