import React from "react";
import Link from "next/link";
import { Shield, Zap, Sparkles, Cpu } from "lucide-react";

export default function AboutContent() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16">
      <div className="max-w-[760px] mx-auto">
        
        {/* Intro Section */}
        <div className="mb-12">
          <h2 className="font-['Outfit'] font-bold text-[1.5rem] text-[#f8fafc] mb-4">
            Who We Are
          </h2>
          <p className="text-[#94a3b8] text-[0.95rem] leading-relaxed mb-6">
            ConvertGalaxy is a modern web application dedicated to offering premium-grade image processing tools completely free of charge. Born out of the frustration of slow, ad-ridden online converters that require uploading confidential files to remote servers, we designed ConvertGalaxy to be local-first, highly secure, and instant.
          </p>
          <p className="text-[#94a3b8] text-[0.95rem] leading-relaxed">
            By running all conversion, compression, resizing, and processing logic inside your browser using the HTML5 Canvas API and WebAssembly, your raw images never leave your computer. You get server-level speeds without sacrificing data security.
          </p>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="font-['Outfit'] font-bold text-[1.5rem] text-[#f8fafc] mb-6">
            Our Core Principles
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 bg-white/3 border border-white/6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-[#818cf8] mb-4">
                <Shield size={20} />
              </div>
              <h3 className="font-['Outfit'] font-bold text-[1.1rem] text-[#f8fafc] mb-2">
                100% Privacy-First
              </h3>
              <p className="text-[#64748b] text-[0.875rem] leading-relaxed">
                Zero uploads, zero cookies, zero tracing of your confidential image files. All conversions are processed completely client-side in your local browser sandbox.
              </p>
            </div>

            <div className="p-5 bg-white/3 border border-white/6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#22d3ee] mb-4">
                <Zap size={20} />
              </div>
              <h3 className="font-['Outfit'] font-bold text-[1.1rem] text-[#f8fafc] mb-2">
                Instant Execution
              </h3>
              <p className="text-[#64748b] text-[0.875rem] leading-relaxed">
                No waiting in server queues or uploading massive files. Conversions trigger the millisecond you click save.
              </p>
            </div>

            <div className="p-5 bg-white/3 border border-white/6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#34d399] mb-4">
                <Cpu size={20} />
              </div>
              <h3 className="font-['Outfit'] font-bold text-[1.1rem] text-[#f8fafc] mb-2">
                Modern Technologies
              </h3>
              <p className="text-[#64748b] text-[0.875rem] leading-relaxed">
                Powered by next-gen browser tools including JavaScript Canvas API, WebAssembly modules, and modern web frameworks to ensure a premium UI/UX.
              </p>
            </div>

            <div className="p-5 bg-white/3 border border-white/6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-[#f43f5e] mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="font-['Outfit'] font-bold text-[1.1rem] text-[#f8fafc] mb-2">
                No Limits, Free Forever
              </h3>
              <p className="text-[#64748b] text-[0.875rem] leading-relaxed">
                Convert as many images as you need with no file count limits or paywalls. No registrations, subscriptions, or hidden costs.
              </p>
            </div>
          </div>
        </div>

        {/* Security and Standards */}
        <div>
          <h2 className="font-['Outfit'] font-bold text-[1.5rem] text-[#f8fafc] mb-4">
            Security and Standards
          </h2>
          <p className="text-[#94a3b8] text-[0.95rem] leading-relaxed mb-4">
            Security is the cornerstone of ConvertGalaxy. Because typical online utilities pose data privacy risks by processing your documents on third-party remote nodes, we take full advantage of client-side architecture to bypass cloud transmission entirely.
          </p>
          <p className="text-[#94a3b8] text-[0.95rem] leading-relaxed">
            If you have any suggestions, feedback, or would like to partner with us, please reach out via our <Link href="/contact" className="text-[#818cf8] hover:underline" title="Go to Contact Page">Contact page</Link> or email us at <a href="mailto:hello@convertgalaxy.pro" className="text-[#818cf8] hover:underline" title="Email ConvertGalaxy Support">hello@convertgalaxy.pro</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
