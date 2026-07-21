import { CheckCircle } from "lucide-react";
import Container from "@/components/Container";

const steps = [
  { step: "01", icon: "📂", title: "Upload Your Image", desc: "Drag and drop your image file or click to browse. Supports JPG, PNG, WebP, GIF, BMP and more." },
  { step: "02", icon: "⚙️", title: "Choose Settings", desc: "Select your output format, quality level, dimensions, or other tool-specific options to your liking." },
  { step: "03", icon: "⬇️", title: "Download Result", desc: "Click convert and instantly download your processed image. No waiting, no email — immediate results." },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#13131f]">
      <Container>
        <div className="text-center max-w-[650px] mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-[0.78rem] font-semibold tracking-wider uppercase bg-indigo-500/15 text-[#818cf8] border border-indigo-500/30 mb-4">
            <CheckCircle size={12} />
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-tight font-['Outfit'] mb-4 text-[#f8fafc]">
            Convert Images in{" "}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">3 Simple Steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div
              key={i}
              className="text-center py-10 px-8 bg-[#1a1a2e] border border-white/8 rounded-[24px] relative overflow-hidden"
            >
              {/* Watermark */}
              <div className="absolute -top-5 -right-2.5 text-[100px] font-black font-['Outfit'] text-indigo-500/[0.04] leading-none select-none">
                {s.step}
              </div>
              <div className="text-[3rem] mb-5">{s.icon}</div>
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4] text-[0.75rem] font-extrabold text-white mb-4">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold leading-snug mb-3 text-[#f8fafc]">{s.title}</h3>
              <p className="text-[#cbd5e1] text-[0.9rem] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
