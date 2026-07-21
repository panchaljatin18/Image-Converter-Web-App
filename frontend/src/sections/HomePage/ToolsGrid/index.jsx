import Link from "next/link";
import { ArrowRight, FileImage } from "lucide-react";
import Container from "@/components/Container";
import Card from "@/components/Card";

const tools = [
  { id: "heic-to-jpg", name: "HEIC to JPG", description: "Convert Apple HEIC & HEIF photos to high-quality JPG instantly", icon: "📱", href: "/tools/heic-to-jpg", color: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)", tag: "New" },
  { id: "jpg-to-png", name: "JPG to PNG", description: "Convert JPEG images to transparent-friendly PNG format instantly", icon: "🔄", href: "/tools/jpg-to-png", color: "#6366f1", gradient: "linear-gradient(135deg, #6366f1, #818cf8)", tag: "Popular" },
  { id: "png-to-jpg", name: "PNG to JPG", description: "Convert PNG files to compressed JPEG for smaller file sizes", icon: "🖼️", href: "/tools/png-to-jpg", color: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4, #67e8f9)", tag: "Popular" },
  { id: "webp-converter", name: "WebP Converter", description: "Convert images to and from WebP for modern web performance", icon: "⚡", href: "/tools/webp-converter", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)", tag: "New" },
  { id: "image-compressor", name: "Image Compressor", description: "Reduce image file size without visible quality loss", icon: "🗜️", href: "/tools/image-compressor", color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #34d399)", tag: "Popular" },
  { id: "image-resizer", name: "Image Resizer", description: "Resize images to exact pixels, percentages, or custom dimensions", icon: "📐", href: "/tools/image-resizer", color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)", tag: null },
  { id: "crop-image", name: "Crop Image", description: "Crop images to any aspect ratio or custom selection area", icon: "✂️", href: "/tools/crop-image", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #f87171)", tag: null },
  { id: "image-to-pdf", name: "Image to PDF", description: "Combine one or multiple images into a single PDF document", icon: "📄", href: "/tools/image-to-pdf", color: "#f97316", gradient: "linear-gradient(135deg, #f97316, #fb923c)", tag: null },
  { id: "pdf-to-image", name: "PDF to Image", description: "Extract PDF pages as high-quality JPG or PNG images", icon: "📑", href: "/tools/pdf-to-image", color: "#ec4899", gradient: "linear-gradient(135deg, #ec4899, #f472b6)", tag: "New" },
];

export default function ToolsGrid() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#13131f]">
      <Container>
        <div className="text-center max-w-[650px] mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-[0.78rem] font-semibold tracking-wider uppercase bg-indigo-500/15 text-[#818cf8] border border-indigo-500/30 mb-4">
            <FileImage size={12} />
            All Tools
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-tight font-['Outfit'] mb-4 text-[#f8fafc]">
            Powerful Image Tools,{" "}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">Zero Complexity</span>
          </h2>
          <p className="text-[#94a3b8] text-[1.1rem] leading-[1.7]">
            Eight professional-grade image processing tools, all running directly in your browser for maximum privacy and speed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {tools.map((tool, i) => (
            <Link key={tool.id} href={tool.href} className="no-underline">
              <Card hover className="relative cursor-pointer h-full flex flex-col justify-between" style={{ animationDelay: `${i * 0.05}s` }}>
                <div>
                  {tool.tag && (
                    <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold tracking-wider ${tool.tag === "New" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-indigo-500/15 text-[#818cf8] border border-indigo-500/30"}`}>
                      {tool.tag}
                    </span>
                  )}
                  <div
                    className="w-14 h-14 rounded-[14px] flex items-center justify-center text-2xl mb-4.5 transition-all duration-300"
                    style={{ background: tool.gradient, boxShadow: `0 8px 24px ${tool.color}33` }}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="font-['Outfit'] font-bold text-[1.05rem] text-[#f8fafc] mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-[#64748b] text-[0.875rem] leading-relaxed mb-4.5">
                    {tool.description}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1.5 text-[0.85rem] font-semibold"
                  style={{ color: tool.color }}
                >
                  Use Tool <ArrowRight size={14} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
