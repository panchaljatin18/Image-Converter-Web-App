"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "../hooks/useAuth";
import dropboxService from "../services/dropboxService";
import authService from "../services/authService";
import { CheckCircle, AlertCircle, LogOut } from "lucide-react";

export default function DropboxConnectionStatus() {
  const { data: session } = useSession();
  const { user } = useAuth();
  const [status, setStatus] = useState({ connected: false, email: null, loading: true });

  const getEffectiveToken = () => {
    return session?.accessToken || authService.getToken();
  };

  const checkStatus = async () => {
    const token = getEffectiveToken();
    if (!token) {
      setStatus({ connected: false, email: null, loading: false });
      return;
    }
    try {
      const data = await dropboxService.getStatus(token);
      if (data.success) {
        setStatus({ connected: data.connected, email: data.email, loading: false });
      }
    } catch (err) {
      console.error("Error loading Dropbox status:", err);
      setStatus({ connected: false, email: null, loading: false });
    }
  };

  useEffect(() => {
    checkStatus();
  }, [session, user]);

  const handleDisconnect = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));
    const token = getEffectiveToken();
    try {
      await dropboxService.disconnect(token);
      setStatus({ connected: false, email: null, loading: false });
    } catch (err) {
      console.error("Failed to disconnect Dropbox:", err);
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  if (status.loading) {
    return (
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.875rem",
          color: "var(--text-muted)",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
        }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#eab308" }} />
        Checking status...
      </div>
    );
  }

  if (status.connected) {
    return (
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid rgba(34, 197, 94, 0.15)",
          background: "rgba(34, 197, 94, 0.03)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(34, 197, 94, 0.1)",
              color: "#4ade80"
            }}
          >
            <CheckCircle size={18} />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Dropbox Connected</p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>{status.email}</p>
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#f87171",
            background: "rgba(239, 68, 68, 0.05)",
            border: "1px solid rgba(239, 68, 68, 0.1)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <LogOut size={13} />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div 
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        background: "rgba(255, 255, 255, 0.02)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(245, 158, 11, 0.1)",
            color: "#fbbf24"
          }}
        >
          <AlertCircle size={18} />
        </div>
        <div style={{ textAlign: "left" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Dropbox Disconnected</p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Browse and convert files directly.</p>
        </div>
      </div>
    </div>
  );
}
