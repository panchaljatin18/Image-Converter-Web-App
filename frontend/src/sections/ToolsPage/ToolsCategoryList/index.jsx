import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import Card from "@/components/Card";

const categories = [
  {
    name: "Image Conversion",
    description: "Convert between popular image formats",
    tools: [
      {
        name: "HEIC to JPG",
        href: "/tools/heic-to-jpg",
        icon: "📱",
        desc: "Convert Apple HEIC photos to high-quality JPG images",
        color: "#06b6d4",
        gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
        tag: "New",
      },
      {
        name: "JPG to PNG",
        href: "/tools/jpg-to-png",
        icon: "🔄",
        desc: "Convert JPEG images to lossless PNG format",
        color: "#6366f1",
        gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
        tag: "Popular",
      },
      {
        name: "PNG to JPG",
        href: "/tools/png-to-jpg",
        icon: "🖼️",
        desc: "Convert PNG to compressed JPEG for smaller file sizes",
        color: "#06b6d4",
        gradient: "linear-gradient(135deg, #06b6d4, #67e8f9)",
        tag: "Popular",
      },
      {
        name: "WebP Converter",
        href: "/tools/webp-converter",
        icon: "⚡",
        desc: "Convert any image to/from WebP for modern web",
        color: "#f59e0b",
        gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
        tag: "New",
      },
      {
        name: "WebP to JPG",
        href: "/tools/webp-to-jpg",
        icon: "🖼️",
        desc: "Convert WebP images to compressed JPG format",
        color: "#ea580c",
        gradient: "linear-gradient(135deg, #ea580c, #f97316)",
        tag: "New",
      },
    ],
  },
  {
    name: "Image Optimization",
    description: "Reduce file size while maintaining quality",
    tools: [
      {
        name: "Image Compressor",
        href: "/tools/image-compressor",
        icon: "🗜️",
        desc: "Reduce file size up to 90% without visible quality loss",
        color: "#10b981",
        gradient: "linear-gradient(135deg, #10b981, #34d399)",
        tag: "Popular",
      },
      {
        name: "Image Resizer",
        href: "/tools/image-resizer",
        icon: "📐",
        desc: "Resize to exact pixels with social media presets",
        color: "#8b5cf6",
        gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
        tag: null,
      },
      {
        name: "Crop Image",
        href: "/tools/crop-image",
        icon: "✂️",
        desc: "Interactively crop to any size or aspect ratio",
        color: "#ef4444",
        gradient: "linear-gradient(135deg, #ef4444, #f87171)",
        tag: null,
      },
    ],
  },
  {
    name: "PDF Tools",
    description: "Convert between images and PDF documents",
    tools: [
      {
        name: "Image to PDF",
        href: "/tools/image-to-pdf",
        icon: "📄",
        desc: "Combine multiple images into a single PDF document",
        color: "#f97316",
        gradient: "linear-gradient(135deg, #f97316, #fb923c)",
        tag: null,
      },
      {
        name: "PDF to Image",
        href: "/tools/pdf-to-image",
        icon: "📑",
        desc: "Extract PDF pages as high-quality JPG or PNG images",
        color: "#ec4899",
        gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
        tag: "New",
      },
    ],
  },
];

export default function ToolsCategoryList() {
  return (
    <Container className="py-16">
      {categories.map((cat, ci) => (
        <div key={ci} className="mb-16">
          <div className="mb-7">
            <h2 className="font-['Outfit'] font-bold text-2xl text-[#f8fafc] mb-1.5">
              {cat.name}
            </h2>
            <p className="text-[#64748b] text-[0.9rem]">{cat.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cat.tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="no-underline">
                <Card className="cursor-pointer group relative">
                  {tool.tag && (
                    <span
                      className={`absolute top-4 right-4 py-1 px-2.5 rounded-full text-[0.7rem] font-bold tracking-wider border ${
                        tool.tag === "New"
                          ? "bg-emerald-500/15 text-[#34d399] border-emerald-500/30"
                          : "bg-indigo-500/15 text-[#818cf8] border-indigo-500/30"
                      }`}
                    >
                      {tool.tag}
                    </span>
                  )}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4.5 transition-all duration-300 group-hover:scale-108 group-hover:-rotate-3"
                    style={{
                      background: tool.gradient,
                      boxShadow: `0 8px 24px ${tool.color}33`,
                    }}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="font-['Outfit'] font-bold text-[1.05rem] mb-2 text-[#f8fafc]">
                    {tool.name}
                  </h3>
                  <p className="text-[#64748b] text-[0.875rem] leading-relaxed mb-4.5">
                    {tool.desc}
                  </p>
                  <div
                    className="flex items-center gap-1.5 text-[0.85rem] font-semibold"
                    style={{ color: tool.color }}
                  >
                    Open Tool
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </Container>
  );
}
