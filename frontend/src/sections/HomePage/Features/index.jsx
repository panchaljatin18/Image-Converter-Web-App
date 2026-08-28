import { Shield, Zap, Globe, Download, Star, Clock } from "lucide-react";
import Container from "@/components/Container";
import Card from "@/components/Card";

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
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#0f0f1a]">
      <Container>
        <div className="text-center max-w-[650px] mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-[0.78rem] font-semibold tracking-wider uppercase bg-indigo-500/15 text-[#818cf8] border border-indigo-500/30 mb-4">
            <Star size={12} />
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-tight font-['Outfit'] mb-4 text-[#f8fafc]">
            Why Use ConvertGalaxy for{" "}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">Online Image Conversion</span>
          </h2>
          <p className="text-[#cbd5e1] text-[1.05rem] leading-[1.7]">
            Built with modern web standards to deliver local client-side processing, complete file privacy, and studio-grade image output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <Card key={i} className="flex flex-col gap-4">
              <div style={{ width: "52px", height: "52px", borderRadius: "13px", background: `${feature.color}18`, border: `1px solid ${feature.color}33`, display: "flex", alignItems: "center", justifyContent: "center", color: feature.color, flexShrink: 0 }}>
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold leading-snug mb-2 text-[#f8fafc]">{feature.title}</h3>
                <p className="text-[#cbd5e1] text-[0.9rem] leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
