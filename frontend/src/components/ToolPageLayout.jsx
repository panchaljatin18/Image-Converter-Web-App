import Link from "next/link";
import { ArrowLeft, Shield, Zap, Star, Layers, FileImage, Sparkles, HelpCircle } from "lucide-react";
import Container from "@/components/Container";
import SEO from "@/components/SEO";
import AdSenseUnit from "@/components/AdSenseUnit";
import { toolContentMap } from "@/lib/toolContentData";
import FaqAccordion from "@/components/FaqAccordion";
import { getRelatedBlogPosts } from "@/lib/blog";
import Image from "next/image";

const ICON_MAP = {
  Shield,
  Zap,
  Sparkles: Star,
  Star,
  Layers,
  FileImage,
};

const trustBadges = [
  { icon: <Shield size={14} />, text: "100% Private" },
  { icon: <Zap size={14} />, text: "Browser-Based" },
  { icon: <Star size={14} />, text: "Free Forever" },
];

export default async function ToolPageLayout({
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
  const toolKey = toolPath ? toolPath.replace("tools/", "") : null;
  const richContent = toolKey ? toolContentMap[toolKey] : null;
  const displayFaqs = toolFaqs || (richContent && richContent.faqs) || [];
  const relatedPosts = toolKey ? await getRelatedBlogPosts(toolKey) : [];

  return (
    <div className="pt-[64px] min-h-screen">
      {toolPath && toolCategory && (
        <SEO
          type="tool"
          tool={{
            name: title,
            path: toolPath,
            description: description,
            category: toolCategory,
            faqs: displayFaqs,
            steps: richContent?.howToUseSteps,
            image: toolKey ? `https://www.convertgalaxy.com/${toolKey}.webp` : undefined,
          }}
        />
      )}
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f0f1a] to-[#13131f] border-b border-white/6 py-8 md:py-10 relative overflow-hidden">
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
              <p className="text-[#cbd5e1] text-[0.875rem] leading-relaxed max-w-[560px] mb-5">
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

      {/* Rich Educational Content */}
      {richContent && (
        <div className="border-t border-white/8 bg-[#0f0f1a] py-16 md:py-24">
          <Container className="flex flex-col gap-16">
            
            {/* Premium Discover Featured Image in Post Guide */}
            {toolKey && (
              <div className="max-w-[800px] mx-auto w-full border border-white/8 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <img
                  src={`/${toolKey}.webp`}
                  alt={`How to use ${title} tool guide`}
                  className="w-full h-auto object-cover aspect-[16/9]"
                  loading="lazy"
                />
              </div>
            )}

            {/* Step by Step Guide */}
            {richContent.howToUseSteps && (
              <div>
                <h2 className="font-['Outfit'] font-extrabold text-2xl md:text-3xl text-[#f8fafc] tracking-tight mb-8 text-center">
                  How to Use {title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {richContent.howToUseSteps.map((step, idx) => (
                    <div key={idx} className="relative p-6 bg-[#1a1a2e] border border-white/6 rounded-2xl flex flex-col gap-3">
                      <div className="absolute top-4 right-6 text-4xl font-black text-white/5 font-sans pointer-events-none select-none">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <h3 className="font-bold text-[1.1rem] text-[#f8fafc] pr-10">
                        {step.title}
                      </h3>
                      <p className="text-[#cbd5e1] text-[0.875rem] leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits Grid */}
            {richContent.benefits && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {richContent.benefits.map((benefit, idx) => {
                  const Icon = ICON_MAP[benefit.icon] || Shield;

                  return (
                    <div key={idx} className="p-6 bg-gradient-to-br from-[#1a1a2e] to-[#141426] border border-white/6 rounded-2xl flex gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: `radial-gradient(circle, ${color}22 0%, ${color}0c 100%)`,
                          border: `1px solid ${color}33`,
                          color: color
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h4 className="font-bold text-[1rem] text-[#f8fafc]">
                          {benefit.title}
                        </h4>
                        <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
                          {benefit.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Technical Comparison Table */}
            {richContent.comparisonTable && (
              <div className="max-w-[800px] mx-auto w-full">
                <h3 className="font-['Outfit'] font-extrabold text-xl md:text-2xl text-[#f8fafc] mb-6 text-center">
                  {richContent.comparisonTable.title}
                </h3>
                <div className="overflow-x-auto border border-white/8 rounded-2xl bg-[#141426]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/8 bg-[#1a1a2e]">
                        {richContent.comparisonTable.headers.map((header, i) => (
                          <th key={i} className="py-4 px-6 text-[0.875rem] font-bold text-[#f8fafc] border-r border-white/6 last:border-r-0">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {richContent.comparisonTable.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-white/4 last:border-b-0 hover:bg-white/[0.01]">
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className="py-4 px-6 text-[0.875rem] text-[#cbd5e1] border-r border-white/6 last:border-r-0">
                              {cellIdx === 0 ? <strong className="text-[#f8fafc]">{cell}</strong> : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Technical details description */}
            {richContent.technicalDescription && (
              <div className="max-w-[800px] mx-auto w-full p-6 md:p-8 bg-[#1a1a2e]/50 border border-white/6 rounded-2xl">
                <h3 className="font-['Outfit'] font-bold text-[1.2rem] text-[#f8fafc] mb-4">
                  Technical Specifications & Insights
                </h3>
                <p className="text-[#cbd5e1] text-[0.925rem] leading-[1.8]">
                  {richContent.technicalDescription}
                </p>
              </div>
            )}

            {/* FAQs Accordion */}
            {displayFaqs && displayFaqs.length > 0 && (
              <div className="max-w-[800px] mx-auto w-full">
                <h2 className="font-['Outfit'] font-extrabold text-2xl md:text-3xl text-[#f8fafc] tracking-tight mb-8 text-center flex items-center justify-center gap-2">
                  <HelpCircle className="text-[#a5b4fc]" size={24} />
                  Frequently Asked Questions
                </h2>
                <FaqAccordion faqs={displayFaqs} />
              </div>
            )}

          </Container>
        </div>
      )}

      {/* Related Guides Section */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="bg-[#0f0f1a] border-t border-white/8 py-12">
          <Container>
            <h2 className="font-['Outfit'] font-bold text-xl text-[#f8fafc] mb-6">
              Related Guides & Tips
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-[#1a1a2e] border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500 transition-all flex flex-col group no-underline text-left"
                >
                  {post.frontmatter.image && (
                    <div className="relative h-44 w-full overflow-hidden bg-black">
                      <Image
                        src={post.frontmatter.image}
                        alt={post.frontmatter.title}
                        fill
                        className="object-cover group-hover:scale-103 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs text-indigo-400 font-semibold mb-2 block">{post.frontmatter.date}</span>
                    <h3 className="font-bold text-base text-[#f8fafc] group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2">
                      {post.frontmatter.title}
                    </h3>
                    <p className="text-xs text-[#cbd5e1] line-clamp-3 leading-relaxed mb-4">
                      {post.frontmatter.description}
                    </p>
                    <span className="text-xs text-indigo-400 font-semibold mt-auto flex items-center gap-1">
                      Read Guide →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </div>
      )}

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
