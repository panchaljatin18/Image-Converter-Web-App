"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "../hooks/useAuth";
import googleDriveService from "../services/googleDriveService";
import authService from "../services/authService";

export default function GoogleDriveButton({ onStatusChange }) {
  const { data: session } = useSession();
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getEffectiveToken = () => {
    return session?.accessToken || authService.getToken();
  };

  useEffect(() => {
    const checkStatus = async () => {
      const token = getEffectiveToken();
      if (!token) return;
      try {
        const data = await googleDriveService.getStatus(token);
        if (data.success) {
          setIsConnected(data.connected);
          if (onStatusChange) onStatusChange(data.connected, data.email);
        }
      } catch (err) {
        console.error("Error checking Drive status:", err);
      }
    };
    checkStatus();
  }, [session, user]);

  const handleConnect = async () => {
    setIsLoading(true);
    setError("");
    const token = getEffectiveToken();
    if (!token) {
      setError("Please log in to your account first.");
      setIsLoading(false);
      return;
    }

    try {
      const redirectUri = `${window.location.origin}/dashboard/google-drive/callback`;
      const data = await googleDriveService.getAuthUrl(token, redirectUri);
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to retrieve authorization URL.");
      }
    } catch (err) {
      setError(err.message || "Failed to start Google OAuth flow.");
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    setError("");
    const token = getEffectiveToken();
    try {
      const data = await googleDriveService.disconnect(token);
      if (data.success) {
        setIsConnected(false);
        if (onStatusChange) onStatusChange(false, null);
      }
    } catch (err) {
      setError(err.message || "Failed to disconnect Google Drive.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <button
          onClick={handleDisconnect}
          disabled={isLoading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "12px",
            padding: "10px 20px",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 600,
            color: "#f87171",
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          {isLoading ? "Disconnecting..." : "Disconnect Google Drive"}
        </button>
        {error && <span style={{ color: "#f87171", fontSize: "0.75rem" }}>{error}</span>}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <button
        onClick={handleConnect}
        disabled={isLoading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          background: "linear-gradient(135deg, #1999D5 0%, #3E9D62 100%)",
          border: "none",
          borderRadius: "12px",
          padding: "12px 24px",
          fontFamily: "Outfit, sans-serif",
          fontWeight: 600,
          color: "white",
          fontSize: "0.95rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(25, 153, 213, 0.2)"
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.72727 15.75L12.2727 21.9L2 21.9L8.72727 15.75Z" fill="#FFCC00"/>
          <path d="M15.2727 15.75L8.72727 15.75L12.2727 21.9L15.2727 15.75Z" fill="#1B80C4"/>
          <path d="M12.2727 3L22.5455 21.9L15.2727 15.75L12.2727 3Z" fill="#006699"/>
          <path d="M12.2727 3L8.72727 15.75L15.2727 15.75L12.2727 3Z" fill="#339966"/>
        </svg>
        {isLoading ? "Connecting..." : "Connect Google Drive"}
      </button>
      {error && <span style={{ color: "#f87171", fontSize: "0.75rem" }}>{error}</span>}
    </div>
  );
}
