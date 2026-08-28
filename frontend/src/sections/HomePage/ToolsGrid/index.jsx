import Link from "next/link";
import { ArrowRight, FileImage, Sparkles, Layers, ShieldCheck, Cpu } from "lucide-react";
import Container from "@/components/Container";
import Card from "@/components/Card";

const popularConversions = [
  { id: "jpg-to-png", name: "JPG to PNG Converter", description: "Convert JPG photos to transparent PNG images with lossless clarity.", icon: "🔄", href: "/tools/jpg-to-png", color: "#6366f1", gradient: "linear-gradient(135deg, #6366f1, #818cf8)", tag: "Popular" },
  { id: "png-to-jpg", name: "PNG to JPG Converter", description: "Convert large PNG images into compact, web-friendly JPG files.", icon: "🖼️", href: "/tools/png-to-jpg", color: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4, #67e8f9)", tag: "Popular" },
  { id: "webp-converter", name: "WebP Converter", description: "Convert images to and from modern WebP format for fast web pages.", icon: "⚡", href: "/tools/webp-converter", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)", tag: "Essential" },
  { id: "png-to-webp", name: "PNG to WebP Converter", description: "Turn PNG graphics into lightweight WebP images while preserving transparency.", icon: "🌐", href: "/tools/png-to-webp", color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #34d399)", tag: "Web Speed" },
  { id: "webp-to-jpg", name: "WebP to JPG Converter", description: "Convert WebP images to standard universal JPG format for any viewer.", icon: "🔄", href: "/tools/webp-to-jpg", color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)", tag: "Popular" },
  { id: "heic-to-jpg", name: "HEIC to JPG Converter", description: "Convert Apple iPhone HEIC & HEIF photos to high-quality JPG instantly.", icon: "📱", href: "/tools/heic-to-jpg", color: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)", tag: "Apple Photos" },
];

const specializedTools = [
  { id: "image-compressor", name: "Image Compressor", description: "Reduce image file size by up to 90% without visible loss in visual quality.", icon: "🗜️", href: "/tools/image-compressor", color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #34d399)", tag: "Lossless" },
  { id: "image-resizer", name: "Image Resizer", description: "Resize images to custom width, height, aspect ratios, or percentages.", icon: "📐", href: "/tools/image-resizer", color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)", tag: "Precise" },
  { id: "crop-image", name: "Crop Image Tool", description: "Crop and trim photos to exact aspect ratios or freeform dimensions.", icon: "✂️", href: "/tools/crop-image", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #f87171)", tag: "Visual" },
  { id: "image-to-pdf", name: "Image to PDF Converter", description: "Merge single or multiple images into a clean, formatted PDF document.", icon: "📄", href: "/tools/image-to-pdf", color: "#f97316", gradient: "linear-gradient(135deg, #f97316, #fb923c)", tag: "Multi-Image" },
  { id: "pdf-to-image", name: "PDF to Image Converter", description: "Extract pages from PDF documents into high-resolution JPG or PNG images.", icon: "📑", href: "/tools/pdf-to-image", color: "#ec4899", gradient: "linear-gradient(135deg, #ec4899, #f472b6)", tag: "High-Res" },
];

const supportedFormatsGuide = [
  {
    format: "JPG / JPEG",
    type: "Lossy Compression",
    bestFor: "Photographs and complex multi-color images",
    details: "Standard web image format offering adjustable compression balance between small file size and high visual fidelity.",
  },
  {
    format: "PNG",
    type: "Lossless Compression",
    bestFor: "Graphics, screenshots, logos & transparent backgrounds",
    details: "Preserves crisp lines and alpha transparency without introducing compression artifacts.",
  },
  {
    format: "WebP",
    type: "Modern Next-Gen",
    bestFor: "Fast-loading web pages and digital platforms",
    details: "Developed by Google to deliver 25-34% smaller file sizes than comparable JPGs and PNGs with equivalent quality.",
  },
  {
    format: "HEIC / HEIF",
    type: "Apple High Efficiency",
    bestFor: "iPhone & iPad photography storage",
    details: "Modern mobile photo format offering superior compression, easily converted on ConvertGalaxy to universal JPG.",
  },
  {
    format: "GIF & BMP",
    type: "Graphics & Bitmaps",
    bestFor: "Simple animations, banners, and uncompressed raster art",
    details: "Classic image formats supported across legacy and modern platforms for direct conversion.",
  },
  {
    format: "PDF",
    type: "Document Standard",
    bestFor: "Multi-page visual documents and print-ready files",
    details: "Convert batches of images into unified PDF files or extract PDF pages into standalone image formats.",
  },
];

export default function ToolsGrid() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#13131f]">
      <Container>
        {/* Popular Image Conversions Section */}
        <div className="text-center max-w-[700px] mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-[0.78rem] font-semibold tracking-wider uppercase bg-indigo-500/15 text-[#818cf8] border border-indigo-500/30 mb-4">
            <FileImage size={12} />
            Image Conversion Hub
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-tight font-['Outfit'] mb-4 text-[#f8fafc]">
            Popular Image Conversions &amp;{" "}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">Free Tools</span>
          </h2>
          <p className="text-[#94a3b8] text-[1.05rem] leading-[1.7]">
            Convert between JPG, PNG, WebP, HEIC, and PDF with dedicated tools built for speed, privacy, and zero quality loss.
          </p>
        </div>

        {/* Primary Conversions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16">
          {popularConversions.map((tool, i) => (
            <Link key={tool.id} href={tool.href} aria-label={`Open ${tool.name}`} className="no-underline">
              <Card hover className="relative cursor-pointer h-full flex flex-col justify-between" style={{ animationDelay: `${i * 0.05}s` }}>
                <div>
                  {tool.tag && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold tracking-wider bg-indigo-500/15 text-[#818cf8] border border-indigo-500/30">
                      {tool.tag}
                    </span>
                  )}
                  <div
                    className="w-12 h-12 rounded-[12px] flex items-center justify-center text-xl mb-4 transition-all duration-300"
                    style={{ background: tool.gradient, boxShadow: `0 8px 24px ${tool.color}33` }}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="font-['Outfit'] font-bold text-[1.1rem] text-[#f8fafc] mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-[#cbd5e1] text-[0.875rem] leading-relaxed mb-4">
                    {tool.description}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1.5 text-[0.85rem] font-semibold"
                  style={{ color: tool.color }}
                >
                  Convert Now <ArrowRight size={14} />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Other Free Image Tools Subsection */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-[#f8fafc]">
                Other Free Image Tools
              </h2>
              <p className="text-[#94a3b8] text-[0.95rem] mt-1">
                Complement your image conversion workflows with local compression, resizing, cropping, and PDF creation.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#818cf8] hover:text-[#a5b4fc] transition-colors whitespace-nowrap no-underline"
            >
              View All Tools <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {specializedTools.map((tool, i) => (
              <Link key={tool.id} href={tool.href} aria-label={`Open ${tool.name}`} className="no-underline">
                <Card hover className="relative cursor-pointer h-full flex flex-col justify-between p-5" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div>
                    <div
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg mb-3"
                      style={{ background: tool.gradient }}
                    >
                      {tool.icon}
                    </div>
                    <h3 className="font-['Outfit'] font-bold text-[0.95rem] text-[#f8fafc] mb-1.5">
                      {tool.name}
                    </h3>
                    <p className="text-[#94a3b8] text-[0.8rem] leading-relaxed mb-3">
                      {tool.description}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1 text-[0.8rem] font-semibold"
                    style={{ color: tool.color }}
                  >
                    Use Tool <ArrowRight size={12} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Supported Image Formats & Capabilities Guide */}
        <div className="pt-6 border-t border-white/6">
          <div className="text-center max-w-[650px] mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-[0.78rem] font-semibold tracking-wider uppercase bg-cyan-500/15 text-[#67e8f9] border border-cyan-500/30 mb-3">
              <Layers size={12} />
              Format Guide
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.02em] font-['Outfit'] mb-3 text-[#f8fafc]">
              Supported Image Formats &amp;{" "}
              <span className="bg-gradient-to-r from-[#06b6d4] to-[#6366f1] bg-clip-text text-transparent">Conversion Capabilities</span>
            </h2>
            <p className="text-[#94a3b8] text-[0.95rem] leading-relaxed">
              ConvertGalaxy supports standard, modern, and camera RAW image formats with browser-level performance and lossless precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {supportedFormatsGuide.map((item, i) => (
              <div
                key={i}
                className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-['Outfit'] font-bold text-lg text-[#f8fafc]">
                      {item.format}
                    </h3>
                    <span className="text-[0.72rem] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-[#94a3b8] border border-white/10">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#818cf8] mb-2 uppercase tracking-wide">
                    Best for: {item.bestFor}
                  </p>
                  <p className="text-[0.875rem] text-[#cbd5e1] leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
