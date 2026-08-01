"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth status on mount
  useEffect(() => {
    async function loadUser() {
      const adminSession = typeof window !== "undefined" && sessionStorage.getItem("cg_admin_session") === "authorized";
      if (adminSession) {
        setUser({ name: "Jatin Panchal", email: "jmpanchal394@gmail.com", role: "admin" });
      }

      const token = authService.getToken();
      if (token) {
        try {
          const data = await authService.getCurrentUser();
          if (data.success && data.user) {
            setUser(data.user);
          }
        } catch (err) {
          console.error("Failed to authenticate session token:", err);
          authService.logout(); // Clean invalid token
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      if (data.success && data.user) {
        setUser(data.user);
      }
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
      throw err;
    }
  }, []);

  // Register handler
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(name, email, password);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Registration failed");
      setLoading(false);
      throw err;
    }
  }, []);

  // Google Login handler
  const googleLogin = useCallback(async (idToken) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.googleLogin(idToken);
      if (data.success && data.user) {
        setUser(data.user);
      }
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Google Login failed");
      setLoading(false);
      throw err;
    }
  }, []);

  // Forgot Password handler
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.forgotPassword(email);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Request failed");
      setLoading(false);
      throw err;
    }
  };

  // Reset Password handler
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.resetPassword(token, password);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Reset failed");
      setLoading(false);
      throw err;
    }
  };

  // Logout handler
  const logout = useCallback(() => {
    authService.logout();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("cg_admin_session");
      document.cookie = "cg_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; sameSite=strict;";
    }
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    googleLogin,
    forgotPassword,
    resetPassword,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
