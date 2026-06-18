"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

export default function GoogleLoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        disabled
        className="btn btn-secondary"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          opacity: 0.7,
          cursor: "not-allowed"
        }}
      >
        <span style={{
          width: "16px",
          height: "16px",
          border: "2px solid rgba(255,255,255,0.3)",
          borderTopColor: "#fff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "User Avatar"}
            style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border)" }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
            {session.user?.name}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {session.user?.email}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="btn btn-secondary btn-sm"
          style={{ padding: "6px 12px" }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="btn btn-secondary"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        padding: "10px 20px",
        fontFamily: "Outfit, sans-serif",
        fontWeight: 600,
        color: "var(--text-primary)",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
        e.currentTarget.style.borderColor = "var(--primary-light)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.69-1.55 2.69-3.85 2.69-6.57z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.91-2.24c-.8.54-1.84.87-3.05.87-2.34 0-4.33-1.58-5.03-3.7H1.02v2.32C2.5 15.97 5.56 18 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.97 10.7C3.79 10.16 3.69 9.59 3.69 9s.1-1.16.28-1.7V4.98H1.02C.37 6.19 0 7.56 0 9s.37 2.81 1.02 4.02l2.95-2.32z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4C13.46.99 11.43 0 9 0 5.56 0 2.03 1.02 4.98l2.95 2.32c.7-2.12 2.69-3.72 5.03-3.72z"
        />
      </svg>
      Continue with Google
    </button>
  );
}
