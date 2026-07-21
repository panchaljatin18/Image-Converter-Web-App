"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Search } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";

const toolsList = [
  {
    name: "HEIC to JPG Converter",
    category: "Image Conversion",
    href: "/tools/heic-to-jpg",
    icon: "📱",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    badge: "Apple Photos",
    desc: "Convert iPhone & iPad HEIC/HEIF photos to universally compatible JPG images.",
    useCase: "Ideal for Mac, iPhone, and Windows users who need to upload photos to portals, job applications, or view them on non-Apple devices.",
    features: [
      "Retains high resolution and image clarity",
      "Optionally keeps original EXIF camera metadata",
      "Auto-orients vertical/horizontal phone shots",
      "Processes files locally in browser without server upload"
    ],
  },
  {
    name: "JPG to PNG Converter",
    category: "Image Conversion",
    href: "/tools/jpg-to-png",
    icon: "🔄",
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
    badge: "Lossless",
    desc: "Convert compressed JPEG images to lossless PNG format with transparency support.",
    useCase: "Perfect for digital designs, logos, screenshots, and graphics where you need to preserve pixel-sharp text or prepare layers for transparent backgrounds.",
    features: [
      "Restores alpha channel (transparency) capability",
      "Preserves high-contrast details and text lines",
      "No compression artifacts or pixel degradation",
      "Runs 100% locally in your web browser"
    ],
  },
  {
    name: "PNG to JPG Converter",
    category: "Image Conversion",
    href: "/tools/png-to-jpg",
    icon: "🖼️",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4, #67e8f9)",
    badge: "High Compression",
    desc: "Convert lossless PNG images to highly compressed JPEG files to reduce page weights.",
    useCase: "Ideal for large photographs and complex artwork where PNG file sizes are unnecessarily massive, helping speed up website loading and email attachments.",
    features: [
      "Drastic reduction in file size (up to 80%)",
      "Adjustable quality factor for custom compression",
      "Maintains original aspect ratio and dimensions",
      "Converts complex transparency into clean backgrounds"
    ],
  },
  {
    name: "WebP Converter",
    category: "Image Conversion",
    href: "/tools/webp-converter",
    icon: "⚡",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    badge: "Modern Web",
    desc: "Convert images to and from WebP, Google's next-gen high-efficiency format.",
    useCase: "Crucial for modern web development, SEO, and optimization. WebP delivers smaller file sizes than JPG/PNG while supporting transparent backgrounds.",
    features: [
      "Up to 30% smaller footprint than JPG and PNG",
      "Supports both lossy and lossless compression modes",
      "Translates transparent alpha layers seamlessly",
      "Improves page speed scores (Core Web Vitals)"
    ],
  },
  {
    name: "WebP to JPG Converter",
    category: "Image Conversion",
    href: "/tools/webp-to-jpg",
    icon: "🖼️",
    color: "#ea580c",
    gradient: "linear-gradient(135deg, #ea580c, #f97316)",
    badge: "Universal",
    desc: "Convert WebP images to universally compatible JPG format in your browser.",
    useCase: "Perfect for uploading images to legacy websites, email systems, or viewing on older operating systems and platforms that do not support modern WebP.",
    features: [
      "Fills transparent background layers with custom solid colors",
      "Granular compression control with standard quality percentage slider",
      "Drastically improved load and run compatibility across older devices",
      "100% private and offline browser-first file conversion"
    ],
  },
  {
    name: "Image Compressor",
    category: "Image Optimization",
    href: "/tools/image-compressor",
    icon: "🗜️",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
    badge: "Optimize Speed",
    desc: "Compress images locally to minimize file size while retaining excellent visual quality.",
    useCase: "Essential optimization step before publishing images to WordPress, Shopify, blogs, email newsletters, or uploading to storage-limited platforms.",
    features: [
      "Advanced quantization algorithms reduce size by up to 90%",
      "Side-by-side compression preview comparing quality",
      "Smooth quality adjustment slider",
      "Batch compression for multiple uploads at once"
    ],
  },
  {
    name: "Image Resizer",
    category: "Image Optimization",
    href: "/tools/image-resizer",
    icon: "📐",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    badge: "Precise Layout",
    desc: "Scale your images to exact pixel measurements or percentage sizes easily.",
    useCase: "Tailoring images to fit specific website layouts, headers, blog post covers, or conforming to rigid upload dimension requirements.",
    features: [
      "Aspect ratio lock to prevent stretched images",
      "Custom dimension input in pixels or percentage",
      "Predefined social media canvas presets (Instagram, FB, etc.)",
      "High-fidelity scaling filters to prevent blurriness"
    ],
  },
  {
    name: "Crop Image",
    category: "Image Optimization",
    href: "/tools/crop-image",
    icon: "✂️",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #f87171)",
    badge: "Interactive",
    desc: "Trim outer borders or crop specific areas of your images using visual handles.",
    useCase: "Removing clutter from edges, changing composition focus, or cutting images into standard shapes like square profiles and landscape banners.",
    features: [
      "Interactive visual crop canvas with drag handles",
      "Preset aspect ratios (1:1, 16:9, 4:3, 2:3, etc.)",
      "Rotation, flipping, and scaling before outputting",
      "Instant client-side rendering for quick downloads"
    ],
  },
  {
    name: "Image to PDF Converter",
    category: "PDF Tools",
    href: "/tools/image-to-pdf",
    icon: "📄",
    color: "#f97316",
    gradient: "linear-gradient(135deg, #f97316, #fb923c)",
    badge: "Document Pack",
    desc: "Merge one or multiple JPG, PNG, or WebP images into a single PDF document.",
    useCase: "Assembling scanned document pages, receipts, portfolio designs, or photo series into a single, professional PDF for formal emailing or printing.",
    features: [
      "Drag-and-drop ordering to organize pages",
      "Custom margins, page orientations, and page sizes",
      "No server upload - processes local images securely",
      "Combines mixed format inputs (PNG, JPG, WebP) together"
    ],
  },
  {
    name: "PDF to Image Converter",
    category: "PDF Tools",
    href: "/tools/pdf-to-image",
    icon: "📑",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
    badge: "Extract Pages",
    desc: "Deconstruct any PDF document to extract each page as a standalone image.",
    useCase: "Converting document slides, text reports, or visual pages into standard image formats (PNG/JPG) for presentation, web integration, or social media sharing.",
    features: [
      "Extracts high-resolution images from multi-page PDFs",
      "Supports downloading individual pages or all pages as a ZIP",
      "Adjustable rendering DPI for crisp vector layouts",
      "Entirely runs in-browser ensuring document privacy"
    ],
  }
];

const categories = ["All Tools", "Image Conversion", "Image Optimization", "PDF Tools"];

export default function BlogGrid() {
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get("q") : null;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Tools");

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  const filteredTools = toolsList.filter((tool) => {
    const matchesCategory = selectedCategory === "All Tools" || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <Container className="py-16">
      {/* Search and Filters */}
      <div className="mb-12">
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
          <input
            type="text"
            placeholder="Search tools, features, or use cases..."
            aria-label="Search tools, features, or use cases"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-[#131325]/70 border border-white/10 rounded-2xl text-white placeholder-[#94a3b8] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-[0.95rem] shadow-inner"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-label={`Filter by ${cat}`}
              aria-pressed={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-[0.85rem] font-semibold transition-all duration-200 border cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#6366f1] to-[#06b6d4] text-white border-transparent shadow-[0_4px_12px_rgba(99,102,241,0.25)] scale-102"
                  : "bg-white/5 text-[#cbd5e1] border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List of Tools */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool) => (
            <div
              key={tool.name}
              className="bg-[#131325]/80 border border-white/8 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col hover:border-indigo-500/50 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(99,102,241,0.12)] group"
            >
              {/* Header Visual with Icon and Gradient */}
              <div
                className="w-full h-[150px] flex items-center justify-center text-[4rem] relative select-none"
                style={{ background: `linear-gradient(135deg, ${tool.color}15, ${tool.color}03)` }}
              >
                <div
                  className="w-18 h-18 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2"
                  style={{
                    background: tool.gradient,
                    boxShadow: `0 8px 24px ${tool.color}35`,
                  }}
                >
                  {tool.icon}
                </div>
                {tool.badge && (
                  <span
                    className="absolute top-4 right-4 py-1 px-3 rounded-full text-[0.7rem] font-bold uppercase tracking-wider border"
                    style={{
                      backgroundColor: `${tool.color}12`,
                      color: tool.color,
                      borderColor: `${tool.color}25`,
                    }}
                  >
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Card Contents */}
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-[#a5b4fc] text-[0.75rem] font-semibold uppercase tracking-wider mb-1.5 block">
                  {tool.category}
                </span>
                <h3 className="text-xl font-bold font-['Outfit'] text-[#f8fafc] mb-3">
                  {tool.name}
                </h3>
                
                <p className="text-[#e2e8f0] text-[0.9rem] leading-relaxed mb-4">
                  {tool.desc}
                </p>

                {/* When to Use Segment */}
                <div className="mb-5 bg-white/3 border border-white/5 rounded-2xl p-4 flex-1">
                  <span className="text-xs font-bold text-[#818cf8] uppercase tracking-wider block mb-1.5">
                    💡 When to Use
                  </span>
                  <p className="text-[#cbd5e1] text-[0.82rem] leading-relaxed">
                    {tool.useCase}
                  </p>
                </div>

                {/* Key Features Bullet List */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-[#a5b4fc] uppercase tracking-wider block mb-2">
                    Key Features
                  </span>
                  <ul className="space-y-2">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[0.8rem] text-[#cbd5e1] leading-normal">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Link Button */}
                <Link href={tool.href} aria-label={`Launch ${tool.name}`} className="no-underline w-full mt-auto block">
                  <Button variant="secondary" className="w-full justify-center group/btn text-[0.9rem] py-2.5">
                    Launch Tool
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[#64748b] text-[1.1rem]">No tools found matching your search criteria.</p>
        </div>
      )}
    </Container>
  );
}

