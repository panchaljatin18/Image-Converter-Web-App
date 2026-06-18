import React from "react";
import { Zap } from "lucide-react";

export default function ToolsHeader() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #13131f 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "64px 0 56px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "rgba(99,102,241,0.1)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <span className="badge" style={{ marginBottom: "20px", display: "inline-flex" }}>
          <Zap size={12} />
          8 Free Tools
        </span>
        <h1 className="heading-lg" style={{ marginBottom: "16px" }}>
          All Image <span className="text-gradient">Processing Tools</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "520px", margin: "0 auto" }}>
          Every tool is 100% free, browser-based, and processes your images locally — no uploads, no registration.
        </p>
      </div>
    </div>
  );
}
