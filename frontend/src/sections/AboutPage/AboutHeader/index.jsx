import React from "react";
import Container from "@/components/Container";

export default function AboutHeader() {
  return (
    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#13131f] border-b border-white/6 py-16 relative overflow-hidden">
      <div className="absolute -top-[80px] -right-[80px] w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[80px]" />
      <Container className="relative z-[1]">
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-[#818cf8] font-semibold text-[0.78rem] tracking-wider uppercase mb-5">✨ Our Story</span>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight font-['Outfit'] tracking-tight mb-3">About ImageToolkit</h1>
        <p className="text-[#64748b] text-[0.9rem] max-w-2xl">
          We build tools that put your privacy and convenience first. Simple, extremely fast, browser-only file converters.
        </p>
      </Container>
    </div>
  );
}
