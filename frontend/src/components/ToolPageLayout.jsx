import Link from "next/link";
import { ArrowLeft, Shield, Zap, Star } from "lucide-react";

const trustBadges = [
  { icon: <Shield size={14} />, text: "100% Private" },
  { icon: <Zap size={14} />, text: "Browser-Based" },
  { icon: <Star size={14} />, text: "Free Forever" },
];

export default function ToolPageLayout({
  title,
  description,
  icon,
  color = "#6366f1",
  gradient = "linear-gradient(135deg, #6366f1, #06b6d4)",
  children,
  relatedTools = [],
}) {
  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f1a 0%, #13131f 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "48px 0 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* BG Orb */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            background: `${color}10`,
            borderRadius: "50%",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Back Link */}
          <Link href="/tools" className="back-link">
            <ArrowLeft size={14} />
            All Tools
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                flexShrink: 0,
                boxShadow: `0 8px 32px ${color}40`,
              }}
            >
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  marginBottom: "10px",
                }}
              >
                {title}
              </h1>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  maxWidth: "560px",
                  marginBottom: "20px",
                }}
              >
                {description}
              </p>

              {/* Trust Badges */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {trustBadges.map((badge) => (
                  <div
                    key={badge.text}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 12px",
                      borderRadius: "100px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span style={{ color }}>{badge.icon}</span>
                    {badge.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Content */}
      <div className="container" style={{ padding: "48px 24px" }}>
        {children}
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div
          style={{
            background: "var(--bg-secondary)",
            borderTop: "1px solid var(--border-light)",
            padding: "48px 0",
          }}
        >
          <div className="container">
            <h2
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "var(--text-primary)",
                marginBottom: "24px",
              }}
            >
              Related Tools
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="related-tool-link"
                >
                  <span style={{ fontSize: "1.2rem" }}>{tool.icon}</span>
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
