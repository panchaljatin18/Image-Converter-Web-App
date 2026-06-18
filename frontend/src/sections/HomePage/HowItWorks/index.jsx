import { CheckCircle } from "lucide-react";

const steps = [
  { step: "01", icon: "📂", title: "Upload Your Image", desc: "Drag and drop your image file or click to browse. Supports JPG, PNG, WebP, GIF, BMP and more." },
  { step: "02", icon: "⚙️", title: "Choose Settings", desc: "Select your output format, quality level, dimensions, or other tool-specific options to your liking." },
  { step: "03", icon: "⬇️", title: "Download Result", desc: "Click convert and instantly download your processed image. No waiting, no email — immediate results." },
];

export default function HowItWorks() {
  return (
    <section className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <div className="section-header">
          <span className="badge">
            <CheckCircle size={12} />
            How It Works
          </span>
          <h2 className="heading-lg">
            Convert Images in{" "}
            <span className="text-gradient">3 Simple Steps</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }} className="steps-grid">
          {steps.map((s, i) => (
            <div
              key={i}
              style={{ textAlign: "center", padding: "40px 32px", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "24px", position: "relative", overflow: "hidden" }}
            >
              {/* Watermark */}
              <div style={{ position: "absolute", top: "-20px", right: "-10px", fontSize: "100px", fontWeight: 900, fontFamily: "Outfit, sans-serif", color: "rgba(99,102,241,0.04)", lineHeight: 1, userSelect: "none" }}>
                {s.step}
              </div>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>{s.icon}</div>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "50%", background: "var(--gradient-primary)", fontSize: "0.75rem", fontWeight: 800, color: "white", marginBottom: "16px" }}>
                {i + 1}
              </div>
              <h3 className="heading-sm" style={{ marginBottom: "12px" }}>{s.title}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>


    </section>
  );
}
