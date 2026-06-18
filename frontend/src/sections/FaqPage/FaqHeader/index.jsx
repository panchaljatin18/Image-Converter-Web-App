import React from "react";
import Container from "@/components/Container";

export default function FaqHeader() {
  return (
    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#13131f] border-b border-white/6 py-16 text-center relative overflow-hidden">
      <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />
      <Container className="relative z-[1]">
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-[#818cf8] font-semibold text-[0.78rem] tracking-wider uppercase mb-5">❓ FAQ</span>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight font-['Outfit'] tracking-tight mb-4 text-[#f8fafc]">
          Frequently Asked <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">Questions</span>
        </h1>
        <p className="text-[#94a3b8] text-[1.1rem] max-w-[520px] mx-auto">
          Everything you need to know about ImageToolkit — privacy, formats, limits, and more.
        </p>
      </Container>
    </div>
  );
}
