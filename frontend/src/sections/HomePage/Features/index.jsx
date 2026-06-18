import { Shield, Zap, Globe, Download, Star, Clock } from "lucide-react";

const features = [
  { icon: <Shield size={24} />, title: "100% Private & Secure", description: "All processing happens directly in your browser. Your files never leave your device — zero server uploads, zero data collection.", color: "#10b981" },
  { icon: <Zap size={24} />, title: "Lightning Fast Processing", description: "Powered by browser-native APIs and WebAssembly for near-instant conversions and compressions, even for large files.", color: "#f59e0b" },
  { icon: <Globe size={24} />, title: "No Account Required", description: "Jump straight into any tool without signing up. Completely free, no subscription, no email — just powerful image tools.", color: "#6366f1" },
  { icon: <Download size={24} />, title: "Batch Processing", description: "Convert and process multiple images at once. Save time with our powerful batch conversion and compression tools.", color: "#06b6d4" },
  { icon: <Star size={24} />, title: "High Quality Output", description: "Our smart algorithms preserve maximum image quality while reducing file sizes, ensuring professional-grade results.", color: "#ec4899" },
  { icon: <Clock size={24} />, title: "Available 24/7", description: "Access all tools anytime, anywhere — on desktop, tablet, or mobile. No installation, no waiting, always ready.", color: "#8b5cf6" },
];

export default function Features() {
  return (
    <section className="section" style={{ background: "var(--bg-primary)" }}>
      <div className="container">
        <div className="section-header">
          <span className="badge">
            <Star size={12} />
            Why ImageToolkit
          </span>
          <h2 className="heading-lg">
            Built for{" "}
            <span className="text-gradient">Speed, Privacy & Quality</span>
          </h2>
          <p>
            No other online image tool matches our combination of browser-based processing, zero data storage, and professional output quality.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "13px", background: `${feature.color}18`, border: `1px solid ${feature.color}33`, display: "flex", alignItems: "center", justifyContent: "center", color: feature.color, flexShrink: 0 }}>
                {feature.icon}
              </div>
              <div>
                <h3 className="heading-sm" style={{ marginBottom: "8px" }}>{feature.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.65 }}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
