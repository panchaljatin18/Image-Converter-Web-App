"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "../hooks/useAuth";
import onedriveService from "../services/onedriveService";
import authService from "../services/authService";

export default function ConnectOneDriveButton({ onStatusChange }) {
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
        const data = await onedriveService.getStatus(token);
        if (data.success) {
          setIsConnected(data.connected);
          if (onStatusChange) onStatusChange(data.connected, data.email);
        }
      } catch (err) {
        console.error("Error checking OneDrive status:", err);
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
      const redirectUri = `${window.location.origin}/dashboard/onedrive/callback`;
      const data = await onedriveService.getAuthUrl(token, redirectUri);
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to retrieve authorization URL.");
      }
    } catch (err) {
      setError(err.message || "Failed to start OneDrive OAuth flow.");
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    setError("");
    const token = getEffectiveToken();
    try {
      const data = await onedriveService.disconnect(token);
      if (data.success) {
        setIsConnected(false);
        if (onStatusChange) onStatusChange(false, null);
      }
    } catch (err) {
      setError(err.message || "Failed to disconnect OneDrive.");
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
          {isLoading ? "Disconnecting..." : "Disconnect OneDrive"}
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
          background: "linear-gradient(135deg, #0078D7 0%, #005A9E 100%)",
          border: "none",
          borderRadius: "12px",
          padding: "12px 24px",
          fontFamily: "Outfit, sans-serif",
          fontWeight: 600,
          color: "white",
          fontSize: "0.95rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(0, 120, 215, 0.2)"
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
        {isLoading ? "Connecting..." : "Connect to OneDrive"}
      </button>
      {error && <span style={{ color: "#f87171", fontSize: "0.75rem" }}>{error}</span>}
    </div>
  );
}
