import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Image Conversion",
    description: "Convert between popular image formats",
    tools: [
      {
        name: "JPG to PNG",
        href: "/tools/jpg-to-png",
        icon: "🔄",
        desc: "Convert JPEG images to lossless PNG format",
        color: "#6366f1",
        gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
        tag: "Popular",
      },
      {
        name: "PNG to JPG",
        href: "/tools/png-to-jpg",
        icon: "🖼️",
        desc: "Convert PNG to compressed JPEG for smaller file sizes",
        color: "#06b6d4",
        gradient: "linear-gradient(135deg, #06b6d4, #67e8f9)",
        tag: "Popular",
      },
      {
        name: "WebP Converter",
        href: "/tools/webp-converter",
        icon: "⚡",
        desc: "Convert any image to/from WebP for modern web",
        color: "#f59e0b",
        gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
        tag: "New",
      },
    ],
  },
  {
    name: "Image Optimization",
    description: "Reduce file size while maintaining quality",
    tools: [
      {
        name: "Image Compressor",
        href: "/tools/image-compressor",
        icon: "🗜️",
        desc: "Reduce file size up to 90% without visible quality loss",
        color: "#10b981",
        gradient: "linear-gradient(135deg, #10b981, #34d399)",
        tag: "Popular",
      },
      {
        name: "Image Resizer",
        href: "/tools/image-resizer",
        icon: "📐",
        desc: "Resize to exact pixels with social media presets",
        color: "#8b5cf6",
        gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
        tag: null,
      },
      {
        name: "Crop Image",
        href: "/tools/crop-image",
        icon: "✂️",
        desc: "Interactively crop to any size or aspect ratio",
        color: "#ef4444",
        gradient: "linear-gradient(135deg, #ef4444, #f87171)",
        tag: null,
      },
    ],
  },
  {
    name: "PDF Tools",
    description: "Convert between images and PDF documents",
    tools: [
      {
        name: "Image to PDF",
        href: "/tools/image-to-pdf",
        icon: "📄",
        desc: "Combine multiple images into a single PDF document",
        color: "#f97316",
        gradient: "linear-gradient(135deg, #f97316, #fb923c)",
        tag: null,
      },
      {
        name: "PDF to Image",
        href: "/tools/pdf-to-image",
        icon: "📑",
        desc: "Extract PDF pages as high-quality JPG or PNG images",
        color: "#ec4899",
        gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
        tag: "New",
      },
    ],
  },
];

export default function ToolsCategoryList() {
  return (
    <div className="container" style={{ padding: "64px 24px" }}>
      {categories.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: "64px" }}>
          <div style={{ marginBottom: "28px" }}>
            <h2
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              {cat.name}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{cat.description}</p>
          </div>

          <div className="tools-grid">
            {cat.tools.map((tool) => (
              <Link key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
                <div className="card" style={{ cursor: "pointer" }}>
                  {tool.tag && (
                    <span
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        padding: "3px 10px",
                        borderRadius: "100px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        background: tool.tag === "New" ? "rgba(16,185,129,0.15)" : "rgba(99,102,241,0.15)",
                        color: tool.tag === "New" ? "#34d399" : "var(--primary-light)",
                        border: `1px solid ${tool.tag === "New" ? "rgba(16,185,129,0.3)" : "rgba(99,102,241,0.3)"}`,
                      }}
                    >
                      {tool.tag}
                    </span>
                  )}
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background: tool.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      marginBottom: "18px",
                      boxShadow: `0 8px 24px ${tool.color}33`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {tool.icon}
                  </div>
                  <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: "8px" }}>
                    {tool.name}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "18px" }}>
                    {tool.desc}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: tool.color, fontSize: "0.85rem", fontWeight: 600 }}>
                    Open Tool
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
