"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import React from "react";
import { CheckCircle, AlertCircle, LogOut } from "lucide-react";

export default function DriveConnectionStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
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
        <span 
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#eab308"
          }} 
        />
        Checking connection status...
      </div>
    );
  }

  if (session && !session.error) {
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
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Google Drive Connected</p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>{session.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
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
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.1)";
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
          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Google Drive Disconnected</p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Connect to browse and convert files directly.</p>
        </div>
      </div>
      <button
        onClick={() => signIn("google")}
        style={{
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--primary-light)",
          background: "rgba(25, 153, 213, 0.05)",
          border: "1px solid rgba(25, 153, 213, 0.1)",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(25, 153, 213, 0.15)";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(25, 153, 213, 0.05)";
          e.currentTarget.style.color = "var(--primary-light)";
        }}
      >
        Connect
      </button>
    </div>
  );
}
