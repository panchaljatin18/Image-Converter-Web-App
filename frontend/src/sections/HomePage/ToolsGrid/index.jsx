import Link from "next/link";
import { ArrowRight, FileImage } from "lucide-react";

const tools = [
  { id: "jpg-to-png", name: "JPG to PNG", description: "Convert JPEG images to transparent-friendly PNG format instantly", icon: "🔄", href: "/tools/jpg-to-png", color: "#6366f1", gradient: "linear-gradient(135deg, #6366f1, #818cf8)", tag: "Popular" },
  { id: "png-to-jpg", name: "PNG to JPG", description: "Convert PNG files to compressed JPEG for smaller file sizes", icon: "🖼️", href: "/tools/png-to-jpg", color: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4, #67e8f9)", tag: "Popular" },
  { id: "webp-converter", name: "WebP Converter", description: "Convert images to and from WebP for modern web performance", icon: "⚡", href: "/tools/webp-converter", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)", tag: "New" },
  { id: "image-compressor", name: "Image Compressor", description: "Reduce image file size without visible quality loss", icon: "🗜️", href: "/tools/image-compressor", color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #34d399)", tag: "Popular" },
  { id: "image-resizer", name: "Image Resizer", description: "Resize images to exact pixels, percentages, or custom dimensions", icon: "📐", href: "/tools/image-resizer", color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)", tag: null },
  { id: "crop-image", name: "Crop Image", description: "Crop images to any aspect ratio or custom selection area", icon: "✂️", href: "/tools/crop-image", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #f87171)", tag: null },
  { id: "image-to-pdf", name: "Image to PDF", description: "Combine one or multiple images into a single PDF document", icon: "📄", href: "/tools/image-to-pdf", color: "#f97316", gradient: "linear-gradient(135deg, #f97316, #fb923c)", tag: null },
  { id: "pdf-to-image", name: "PDF to Image", description: "Extract PDF pages as high-quality JPG or PNG images", icon: "📑", href: "/tools/pdf-to-image", color: "#ec4899", gradient: "linear-gradient(135deg, #ec4899, #f472b6)", tag: "New" },
];

export default function ToolsGrid() {
  return (
    <section className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <div className="section-header">
          <span className="badge">
            <FileImage size={12} />
            All Tools
          </span>
          <h2 className="heading-lg">
            Powerful Image Tools,{" "}
            <span className="text-gradient">Zero Complexity</span>
          </h2>
          <p>
            Eight professional-grade image processing tools, all running directly in your browser for maximum privacy and speed.
          </p>
        </div>

        <div className="tools-grid">
          {tools.map((tool, i) => (
            <Link key={tool.id} href={tool.href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ position: "relative", cursor: "pointer", animationDelay: `${i * 0.05}s` }}>
                {tool.tag && (
                  <span style={{ position: "absolute", top: "16px", right: "16px", padding: "3px 10px", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", background: tool.tag === "New" ? "rgba(16,185,129,0.15)" : "rgba(99,102,241,0.15)", color: tool.tag === "New" ? "#34d399" : "var(--primary-light)", border: `1px solid ${tool.tag === "New" ? "rgba(16,185,129,0.3)" : "rgba(99,102,241,0.3)"}` }}>
                    {tool.tag}
                  </span>
                )}
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: tool.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "18px", boxShadow: `0 8px 24px ${tool.color}33`, transition: "all 0.3s ease" }}>
                  {tool.icon}
                </div>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: "8px" }}>
                  {tool.name}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "18px" }}>
                  {tool.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: tool.color, fontSize: "0.85rem", fontWeight: 600 }}>
                  Use Tool <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
