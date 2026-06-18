import React from "react";

export default function TermsHeader() {
  return (
    <div style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #13131f 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "64px 0 48px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", background: "rgba(99,102,241,0.08)", borderRadius: "50%", filter: "blur(80px)" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <span className="badge" style={{ marginBottom: "20px", display: "inline-flex" }}>📋 Legal</span>
        <h1 className="heading-lg" style={{ marginBottom: "12px" }}>Terms of Service</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Last updated: June 11, 2025</p>
      </div>
    </div>
  );
}
