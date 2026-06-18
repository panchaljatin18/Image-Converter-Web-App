import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d1f] text-slate-100 px-4 relative pt-[90px] pb-10">
      {/* Subtle background glow */}
      <div className="absolute top-[15%] left-[25%] w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-purple-700/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card — matches image 1 exactly */}
      <div className="w-full max-w-[900px] bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-[#2e2e50] grid grid-cols-1 md:grid-cols-2 z-10">

        {/* ── Left column: Image Panel ── */}
        <div
          className="hidden md:flex relative overflow-hidden bg-cover bg-center min-h-[520px] flex-col justify-between p-8 rounded-l-2xl"
          style={{ backgroundImage: "url('/auth-bg.png')" }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none rounded-l-2xl" />

          {/* Logo top-left */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="text-white font-bold text-lg tracking-wide">
              AMU
            </span>
          </div>

          {/* Back to website — top right */}
          <Link
            href="/"
            className="absolute top-7 right-7 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition duration-200 flex items-center gap-1.5 border border-white/10 z-10"
          >
            Back to website <ArrowRight className="w-3 h-3" />
          </Link>

          {/* Bottom text */}
          <div className="relative z-10 space-y-3 mt-auto">
            <h2 className="text-xl font-bold text-white leading-snug">
              Capturing Moments,<br />Creating Memories
            </h2>
            {/* Slider dots */}
            <div className="flex gap-2 pt-1">
              <span className="w-8 h-[3px] rounded-full bg-white/40" />
              <span className="w-8 h-[3px] rounded-full bg-white/40" />
              <span className="w-8 h-[3px] rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* ── Right column: Form ── */}
        <div className="flex flex-col justify-center px-10 py-10 bg-[#1a1a2e]">
          <div className="w-full">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
