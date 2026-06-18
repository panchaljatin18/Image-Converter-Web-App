"use client";

import { signIn, useSession } from "next-auth/react";
import React from "react";

export default function GoogleDriveConnectButton() {
  const { status } = useSession();

  const handleConnect = () => {
    signIn("google");
  };

  return (
    <button
      onClick={handleConnect}
      disabled={status === "loading"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
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
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(25, 153, 213, 0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(25, 153, 213, 0.2)";
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.72727 15.75L12.2727 21.9L2 21.9L8.72727 15.75Z" fill="#FFCC00"/>
        <path d="M15.2727 15.75L8.72727 15.75L12.2727 21.9L15.2727 15.75Z" fill="#1B80C4"/>
        <path d="M12.2727 3L22.5455 21.9L15.2727 15.75L12.2727 3Z" fill="#006699"/>
        <path d="M12.2727 3L8.72727 15.75L15.2727 15.75L12.2727 3Z" fill="#339966"/>
      </svg>
      {status === "loading" ? "Connecting..." : "Connect to Google Drive"}
    </button>
  );
}
