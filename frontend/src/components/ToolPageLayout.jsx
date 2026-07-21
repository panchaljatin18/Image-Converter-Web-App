import Link from "next/link";
import { ArrowLeft, Shield, Zap, Star } from "lucide-react";
import Container from "@/components/Container";
import SEO from "@/components/SEO";
import AdSenseUnit from "@/components/AdSenseUnit";

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
  toolPath,
  toolCategory,
  toolFaqs,
  uiDescription,
}) {
  return (
    <div className="pt-20 min-h-screen">
      {toolPath && toolCategory && (
        <SEO
          type="tool"
          tool={{
            name: title,
            path: toolPath,
            description: description,
            category: toolCategory,
            faqs: toolFaqs,
          }}
        />
      )}
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f0f1a] to-[#13131f] border-b border-white/6 py-12 relative overflow-hidden">
        {/* BG Glow */}
        <div
          className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          }}
        />
 
        <Container className="relative z-[1]">
          {/* Back Link */}
          <Link
            href="/tools"
            aria-label="Back to all image tools"
            className="inline-flex items-center gap-1.5 text-[#a5b4fc] no-underline text-[0.875rem] mb-6 transition-colors duration-200 hover:text-white"
          >
            <ArrowLeft size={14} />
            All Tools
          </Link>
 
          <div className="flex items-start gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-[28px] shrink-0"
              style={{
                background: gradient,
                boxShadow: `0 8px 32px ${color}40`,
              }}
            >
              {icon}
            </div>
            <div className="flex-1">
              <h1 className="font-['Outfit'] font-extrabold text-2xl md:text-4xl text-[#f8fafc] tracking-tight leading-tight mb-2.5">
                {title}
              </h1>
              <p className="text-[#cbd5e1] text-base leading-relaxed max-w-[560px] mb-5">
                {uiDescription || description}
              </p>

              {/* Trust Badges */}
              <div className="flex gap-2.5 flex-wrap">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.text}
                    className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[0.75rem] font-semibold bg-white/10 border border-white/15 text-[#cbd5e1]"
                  >
                    <span style={{ color }}>{badge.icon}</span>
                    {badge.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Tool Content */}
      <Container className="pt-16 pb-8 md:pt-20">
        {children}
        {/* High Performance AdSense Unit */}
        <AdSenseUnit adSlot="7641288079" className="mt-12 mb-4" />
      </Container>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="bg-[#13131f] border-t border-white/8 py-12">
          <Container>
            <h2 className="font-['Outfit'] font-bold text-xl text-[#f8fafc] mb-6">
              Related Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  aria-label={`Open ${tool.name} tool`}
                  className="flex items-center gap-3 py-3.5 px-4 bg-[#1a1a2e] border border-white/10 rounded-xl no-underline text-[#cbd5e1] text-[0.875rem] font-medium transition-all duration-200 hover:border-indigo-500 hover:text-[#f8fafc] hover:-translate-y-0.5"
                >
                  <span className="text-[1.2rem]">{tool.icon}</span>
                  {tool.name}
                </Link>
              ))}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
