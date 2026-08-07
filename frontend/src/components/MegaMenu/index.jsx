"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  FileText,
  Video as VideoIcon,
  Music,
  Archive as ArchiveIcon,
  Type,
  BookOpen,
  Presentation as PresentationIcon,
  Table,
  Terminal,
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  CornerDownRight,
  HelpCircle,
  Code
} from "lucide-react";

// 1. DATASET DEFINITIONS
const CATEGORIES = [
  {
    id: "images",
    title: "Images",
    icon: ImageIcon,
    color: "#6366f1",
    glow: "rgba(99,102,241,0.25)",
    count: 24,
    formats: ["PNG", "JPG", "WEBP", "SVG", "GIF", "BMP", "AVIF", "HEIC", "ICO", "RAW"]
  },
  {
    id: "documents",
    title: "Documents",
    icon: FileText,
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.25)",
    count: 14,
    formats: ["PDF", "DOCX", "DOC", "TXT", "RTF", "ODT", "HTML"]
  },
  {
    id: "video",
    title: "Video",
    icon: VideoIcon,
    color: "#ec4899",
    glow: "rgba(236,72,153,0.25)",
    count: 12,
    formats: ["MP4", "WEBM", "AVI", "MOV", "MKV", "FLV", "GIF"]
  },
  {
    id: "audio",
    title: "Audio",
    icon: Music,
    color: "#10b981",
    glow: "rgba(16,185,129,0.25)",
    count: 9,
    formats: ["MP3", "WAV", "M4A", "FLAC", "OGG", "WMA", "AAC"]
  },
  {
    id: "archive",
    title: "Archive",
    icon: ArchiveIcon,
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.25)",
    count: 6,
    formats: ["ZIP", "RAR", "7Z", "TAR", "GZ"]
  },
  {
    id: "font",
    title: "Font",
    icon: Type,
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.25)",
    count: 8,
    formats: ["TTF", "OTF", "WOFF", "WOFF2", "EOT"]
  },
  {
    id: "ebook",
    title: "Ebook",
    icon: BookOpen,
    color: "#ef4444",
    glow: "rgba(239,68,68,0.25)",
    count: 10,
    formats: ["EPUB", "MOBI", "AZW3", "PDF", "TXT"]
  },
  {
    id: "presentation",
    title: "Presentation",
    icon: PresentationIcon,
    color: "#f97316",
    glow: "rgba(249,115,22,0.25)",
    count: 6,
    formats: ["PPTX", "PPT", "ODP", "PDF"]
  },
  {
    id: "spreadsheet",
    title: "Spreadsheet",
    icon: Table,
    color: "#14b8a6",
    glow: "rgba(20,184,166,0.25)",
    count: 8,
    formats: ["XLSX", "XLS", "CSV", "ODS", "PDF"]
  },
  {
    id: "developer",
    title: "Developer",
    icon: Terminal,
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.25)",
    count: 12,
    formats: ["JSON", "XML", "YAML", "CSV", "SQL", "JS"]
  }
];

const FORMAT_CONVERSIONS = {
  // Images
  "PNG": ["JPG", "WEBP", "AVIF", "SVG", "ICO", "PDF", "GIF", "BMP"],
  "JPG": ["PNG", "WEBP", "AVIF", "SVG", "ICO", "PDF", "GIF", "BMP"],
  "WEBP": ["JPG", "PNG", "AVIF", "SVG", "ICO", "PDF", "GIF"],
  "SVG": ["PNG", "JPG", "WEBP", "PDF"],
  "GIF": ["MP4", "WEBP", "PNG", "JPG", "APNG"],
  "BMP": ["PNG", "JPG", "WEBP", "PDF"],
  "AVIF": ["JPG", "PNG", "WEBP", "PDF"],
  "HEIC": ["JPG", "PNG", "PDF", "WEBP"],
  "ICO": ["PNG", "JPG", "WEBP"],
  "RAW": ["JPG", "PNG", "WEBP", "TIFF"],

  // Documents
  "PDF": ["DOCX", "DOC", "TXT", "HTML", "JPG", "PNG"],
  "DOCX": ["PDF", "TXT", "HTML", "ODT", "RTF"],
  "DOC": ["PDF", "DOCX", "TXT"],
  "TXT": ["PDF", "DOCX", "HTML"],
  "RTF": ["PDF", "DOCX", "TXT"],
  "ODT": ["PDF", "DOCX"],
  "HTML": ["PDF", "TXT", "PNG", "JPG"],

  // Videos
  "MP4": ["WEBM", "AVI", "MOV", "GIF", "MP3", "WAV"],
  "WEBM": ["MP4", "AVI", "GIF", "MP3"],
  "AVI": ["MP4", "WEBM", "MOV", "GIF"],
  "MOV": ["MP4", "WEBM", "GIF"],
  "MKV": ["MP4", "WEBM", "AVI"],
  "FLV": ["MP4", "WEBM"],

  // Audio
  "MP3": ["WAV", "M4A", "FLAC", "OGG", "AAC"],
  "WAV": ["MP3", "FLAC", "M4A", "OGG"],
  "M4A": ["MP3", "WAV", "FLAC"],
  "FLAC": ["MP3", "WAV"],
  "OGG": ["MP3", "WAV"],
  "WMA": ["MP3", "WAV"],
  "AAC": ["MP3", "WAV"],

  // Archives
  "ZIP": ["TAR", "7Z", "TAR.GZ"],
  "RAR": ["ZIP", "7Z"],
  "7Z": ["ZIP", "TAR"],
  "TAR": ["ZIP", "7Z"],
  "GZ": ["ZIP"],

  // Fonts
  "TTF": ["WOFF", "WOFF2", "OTF", "EOT"],
  "OTF": ["TTF", "WOFF", "WOFF2"],
  "WOFF": ["TTF", "WOFF2", "OTF"],
  "WOFF2": ["TTF", "WOFF", "OTF"],
  "EOT": ["TTF", "WOFF2"],

  // Ebooks
  "EPUB": ["MOBI", "PDF", "TXT", "AZW3"],
  "MOBI": ["EPUB", "PDF"],
  "AZW3": ["EPUB", "PDF"],

  // Presentations
  "PPTX": ["PDF", "PPT", "ODP", "JPG", "PNG"],
  "PPT": ["PDF", "PPTX"],
  "ODP": ["PDF", "PPTX"],

  // Spreadsheets
  "XLSX": ["PDF", "CSV", "XLS", "ODS", "HTML"],
  "XLS": ["XLSX", "PDF", "CSV"],
  "CSV": ["XLSX", "PDF", "JSON", "XML"],
  "ODS": ["XLSX", "PDF", "CSV"],

  // Developer
  "JSON": ["XML", "YAML", "CSV", "SQL"],
  "XML": ["JSON", "YAML"],
  "YAML": ["JSON", "XML"],
  "SQL": ["CSV", "JSON", "XML"],
  "JS": ["TS", "JSON"]
};

// Custom previews mapping
const PREVIEW_DETAILS = {
  default: {
    title: "ConvertGalaxy Converter",
    desc: "Lightning fast file conversions directly in your browser. Complete privacy with zero server uploads for image operations.",
    features: ["🔒 100% Secure & Private", "⚡ Instant Client-side Rendering", "🛠️ Customizable Settings", "📦 Batch Downloads"],
    icon: Zap,
    gradient: "from-indigo-600 via-purple-600 to-pink-600"
  },
  "PNG": {
    desc: "Lossless compression image format. Best for graphic design, logos, and images with transparent backgrounds.",
    features: ["Alpha Transparency Support", "Lossless Compression", "Crisp Text & Shapes", "Universal Browser Compatibility"]
  },
  "JPG": {
    desc: "Joint Photographic Groups format. Ideal for realistic photographs and complex images with rich colors.",
    features: ["Adjustable Compression Ratios", "Compact File Sizes", "Standard EXIF Metadata", "Global Compatibility"]
  },
  "WEBP": {
    desc: "Modern web image format developed by Google. Delivers up to 30% smaller file sizes than JPEG and PNG.",
    features: ["Superb Quality-to-Size Ratio", "Supports Transparency & Animation", "Faster Web Load Speeds", "SEO Ranking Advantage"]
  },
  "SVG": {
    desc: "Scalable Vector Graphics. Infinite resolution that scales perfectly to any size without pixelation.",
    features: ["XML Vector Markup", "Infinite Scale Resolution", "Perfect for Icons & Graphics", "Editable with CSS & JS"]
  },
  "PDF": {
    desc: "Portable Document Format. Maintains document layout, typography, and elements consistently across all devices.",
    features: ["Read-only formatting", "Cross-platform consistency", "Supports encryption & signatures", "Print-ready layout"]
  }
};

function getToolRoute(from, to) {
  const f = from.toUpperCase();
  const t = to.toUpperCase();
  
  if (f === "HEIC" && t === "JPG") return "/tools/heic-to-jpg";
  if (f === "JPG" && t === "PNG") return "/tools/jpg-to-png";
  if (f === "PNG" && t === "JPG") return "/tools/png-to-jpg";
  if (f === "WEBP" && t === "JPG") return "/tools/webp-to-jpg";
  
  const imageFormats = ["PNG", "JPG", "JPEG", "WEBP", "BMP", "AVIF", "HEIC", "RAW", "TIFF", "GIF"];
  if (imageFormats.includes(f) && t === "PDF") return "/tools/image-to-pdf";
  if (f === "PDF" && (t === "JPG" || t === "PNG")) return "/tools/pdf-to-image";
  
  if (imageFormats.includes(f) && t === "WEBP") {
    if (f !== "WEBP") return "/tools/webp-converter";
  }
  if (f === "WEBP" && ["PNG", "AVIF", "GIF", "BMP"].includes(t)) return "/tools/webp-converter";
  
  return null;
}

export default function MegaMenu() {
  const router = useRouter();

  const activeCategories = useMemo(() => {
    return CATEGORIES.map(cat => {
      const formats = cat.formats.filter(fmt => {
        const targets = FORMAT_CONVERSIONS[fmt] || [];
        return targets.some(target => getToolRoute(fmt, target) !== null);
      });
      return {
        ...cat,
        activeFormats: formats,
        activeCount: formats.reduce((acc, fmt) => {
          const targets = FORMAT_CONVERSIONS[fmt] || [];
          return acc + targets.filter(target => getToolRoute(fmt, target) !== null).length;
        }, 0)
      };
    }).filter(cat => cat.activeFormats.length > 0);
  }, []);

  const [activeCategory, setActiveCategory] = useState(activeCategories[0]?.id || "");
  const [hoverCategory, setHoverCategory] = useState(null);
  
  const currentCategory = useMemo(() => {
    return activeCategories.find(c => c.id === (hoverCategory || activeCategory)) || activeCategories[0];
  }, [hoverCategory, activeCategory, activeCategories]);

  const [activeFormat, setActiveFormat] = useState(currentCategory?.activeFormats[0] || "");
  const [hoverFormat, setHoverFormat] = useState(null);

  const currentFormat = useMemo(() => {
    return hoverFormat || activeFormat || currentCategory?.activeFormats[0] || "";
  }, [hoverFormat, activeFormat, currentCategory]);

  // Sync active format when active category changes
  useEffect(() => {
    if (currentCategory?.activeFormats.length > 0) {
      setActiveFormat(currentCategory.activeFormats[0]);
    }
  }, [currentCategory]);

  const conversions = useMemo(() => {
    if (!currentFormat) return [];
    const list = FORMAT_CONVERSIONS[currentFormat] || [];
    return list.map(target => {
      const route = getToolRoute(currentFormat, target);
      if (!route) return null;
      return {
        from: currentFormat,
        to: target,
        route
      };
    }).filter(Boolean);
  }, [currentFormat]);

  const [activeConversion, setActiveConversion] = useState(conversions[0] || null);
  const [hoverConversion, setHoverConversion] = useState(null);

  const currentConversion = useMemo(() => {
    return hoverConversion || activeConversion || conversions[0] || null;
  }, [hoverConversion, activeConversion, conversions]);

  // Sync active conversion when conversions list changes
  useEffect(() => {
    if (conversions.length > 0) {
      setActiveConversion(conversions[0]);
    } else {
      setActiveConversion(null);
    }
  }, [conversions]);

  // Search logic
  const [searchQuery, setSearchQuery] = useState("");
  const filteredSearchConversions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    
    const matches = [];
    Object.entries(FORMAT_CONVERSIONS).forEach(([from, targets]) => {
      targets.forEach(to => {
        const route = getToolRoute(from, to);
        if (!route) return;

        const routeName = `${from.toLowerCase()}-to-${to.toLowerCase()}`;
        if (
          from.toLowerCase().includes(query) ||
          to.toLowerCase().includes(query) ||
          routeName.includes(query) ||
          `${from} to ${to}`.toLowerCase().includes(query)
        ) {
          matches.push({ from, to, route });
        }
      });
    });
    return matches.slice(0, 30);
  }, [searchQuery]);

  // Keyboard navigation refs
  const searchInputRef = useRef(null);
  const [kbFocusedColumn, setKbFocusedColumn] = useState(0); // 0: Search, 1: Category, 2: Format, 3: Conversion
  const [kbFocusedIndex, setKbFocusedIndex] = useState(-1);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setKbFocusedColumn(0);
    setKbFocusedIndex(-1);
  };

  // Keyboard Navigation Handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSearchQuery("");
        searchInputRef.current?.blur();
        setKbFocusedColumn(0);
        setKbFocusedIndex(-1);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (searchQuery.trim()) {
          setKbFocusedIndex(prev => Math.min(prev + 1, filteredSearchConversions.length - 1));
        } else {
          if (kbFocusedColumn === 1) {
            setKbFocusedIndex(prev => Math.min(prev + 1, activeCategories.length - 1));
          } else if (kbFocusedColumn === 2) {
            setKbFocusedIndex(prev => Math.min(prev + 1, (currentCategory?.activeFormats.length || 1) - 1));
          } else if (kbFocusedColumn === 3) {
            setKbFocusedIndex(prev => Math.min(prev + 1, conversions.length - 1));
          } else {
            setKbFocusedColumn(1);
            setKbFocusedIndex(0);
          }
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (searchQuery.trim()) {
          setKbFocusedIndex(prev => Math.max(prev - 1, 0));
        } else {
          if (kbFocusedColumn === 1) {
            setKbFocusedIndex(prev => Math.max(prev - 1, 0));
          } else if (kbFocusedColumn === 2) {
            setKbFocusedIndex(prev => Math.max(prev - 1, 0));
          } else if (kbFocusedColumn === 3) {
            setKbFocusedIndex(prev => Math.max(prev - 1, 0));
          }
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (!searchQuery.trim()) {
          if (kbFocusedColumn < 3) {
            setKbFocusedColumn(prev => prev + 1);
            setKbFocusedIndex(0);
          }
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!searchQuery.trim()) {
          if (kbFocusedColumn > 1) {
            setKbFocusedColumn(prev => prev - 1);
            setKbFocusedIndex(0);
          }
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (searchQuery.trim() && kbFocusedIndex >= 0) {
          const match = filteredSearchConversions[kbFocusedIndex];
          if (match) {
            router.push(match.route);
          }
        } else if (kbFocusedColumn === 3 && kbFocusedIndex >= 0) {
          const conv = conversions[kbFocusedIndex];
          if (conv) {
            router.push(conv.route);
          }
        }
      }
    };

    if (kbFocusedIndex >= 0) {
      if (searchQuery.trim()) {
        const item = filteredSearchConversions[kbFocusedIndex];
        if (item) {
          setHoverConversion(item);
        }
      } else {
        if (kbFocusedColumn === 1) {
          const cat = activeCategories[kbFocusedIndex];
          if (cat) setActiveCategory(cat.id);
        } else if (kbFocusedColumn === 2) {
          const fmt = currentCategory?.activeFormats[kbFocusedIndex];
          if (fmt) setActiveFormat(fmt);
        } else if (kbFocusedColumn === 3) {
          const conv = conversions[kbFocusedIndex];
          if (conv) setActiveConversion(conv);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [kbFocusedColumn, kbFocusedIndex, activeCategories, currentCategory, conversions, searchQuery, filteredSearchConversions, router]);

  // Preview properties
  const preview = useMemo(() => {
    if (!currentConversion) return PREVIEW_DETAILS.default;
    const targetInfo = PREVIEW_DETAILS[currentConversion.to] || PREVIEW_DETAILS[currentConversion.from] || PREVIEW_DETAILS.default;
    
    // Icon selection based on category
    let IconComponent = currentCategory.icon;
    if (currentCategory.id === "developer") IconComponent = Code;

    return {
      title: `${currentConversion.from} to ${currentConversion.to} Converter`,
      desc: targetInfo.desc || `Convert ${currentConversion.from} files to ${currentConversion.to} format instantly inside your browser.`,
      features: targetInfo.features || ["⚡ High-Speed Pipeline", "🎨 Quality Adjustments", "🔒 Offline Local Processing", "📱 Fully Mobile Responsive"],
      icon: IconComponent,
      gradient: currentCategory.color
    };
  }, [currentConversion, currentCategory]);

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8">
      {/* Search Console Header */}
      <div className="relative mb-6 z-10">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
          <Search size={18} className="animate-pulse" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Type format to search (e.g. 'png', 'pdf', 'zip'...) or navigate with Arrow keys..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gradient-to-r from-[#0d0e1b] to-[#121324] border border-indigo-500/20 text-[#f8fafc] placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.05)] transition-all text-sm md:text-base font-['Outfit']"
          aria-label="Search all tools and formats"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* RENDER SEARCH LAYOUT IF SEARCH QUERY ACTIVE */}
      <AnimatePresence mode="wait">
        {searchQuery.trim() ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.18 }}
            className="w-full min-h-[500px] max-h-[700px] overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-[#0e0e1e]/98 to-[#0a0a16]/98 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] grid grid-cols-1 md:grid-cols-3"
          >
            {/* Search results list */}
            <div className="md:col-span-2 border-r border-white/5 flex flex-col h-full overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-['Inter']">Search Results</span>
                <span className="text-[11px] text-slate-500 font-medium font-['Outfit']">{filteredSearchConversions.length} matching operations</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {filteredSearchConversions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-3">
                    <HelpCircle size={32} className="text-slate-600 animate-bounce" />
                    <p className="text-sm font-medium font-['Outfit']">No matching conversion paths found.</p>
                  </div>
                ) : (
                  filteredSearchConversions.map((conv, idx) => {
                    const isFocused = kbFocusedIndex === idx;
                    const isHovered = hoverConversion?.from === conv.from && hoverConversion?.to === conv.to;
                    const isActive = isFocused || isHovered;

                    return (
                      <Link
                        href={conv.route}
                        key={`${conv.from}-${conv.to}`}
                        onMouseEnter={() => setHoverConversion(conv)}
                        className="no-underline block"
                      >
                        <div
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 group cursor-pointer ${
                            isActive
                              ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                              : "bg-[#0b0c16]/50 border-white/5 hover:border-indigo-500/20"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white tracking-wide">{conv.from}</span>
                              <ArrowRight size={12} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                              <span className="text-sm font-bold text-indigo-300 tracking-wide">{conv.to}</span>
                            </div>
                            <span className="hidden sm:inline text-xs text-slate-500 font-['Outfit']">• Instant client-side converter</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Launch Tool</span>
                            <CornerDownRight size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Preview for Search */}
            <div className="hidden md:block bg-gradient-to-br from-indigo-950/20 via-black/45 to-[#0b0c16] p-6 flex flex-col justify-between h-full">
              {currentConversion ? (
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                        {React.createElement(preview.icon || Zap, { size: 22 })}
                      </div>
                      <div>
                        <h3 className="font-['Outfit'] font-bold text-lg text-white leading-tight">{preview.title}</h3>
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Browser Sandbox</span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400 font-['Outfit']">{preview.desc}</p>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Supported Features</span>
                      <ul className="space-y-2 list-none p-0 m-0">
                        {preview.features.map((feat, idx) => (
                           <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-300 font-medium font-['Outfit']">
                            <span className="text-[10px] text-indigo-400">⚡</span>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Link href={currentConversion.route} className="no-underline block w-full mt-4">
                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-150">
                      Convert File Now
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-600 space-y-3">
                  <Zap size={36} className="text-slate-800 animate-spin-slow" />
                  <p className="text-xs font-semibold uppercase tracking-wider font-['Outfit']">Select conversion path to preview</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* STANDARD 4-COLUMN FLOATING MEGA MENU */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.18 }}
            className="w-full min-h-[550px] max-h-[700px] rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-[#0e0e1e]/98 to-[#0a0a16]/98 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row"
          >
            {/* COLUMN 1: Categories */}
            <div className="hidden md:block w-1/4 min-w-[200px] border-r border-white/5 flex flex-col h-full overflow-hidden bg-[#0a0a13]/65">
              <div className="px-5 py-3 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-['Inter']">Category</span>
                <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">{activeCategories.length} Suites</span>
              </div>
              <div
                className="flex-1 overflow-y-auto p-2.5 space-y-1.25 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                onMouseLeave={() => setHoverCategory(null)}
              >
                {activeCategories.map((cat, idx) => {
                  const Icon = cat.icon;
                  const isSelected = activeCategory === cat.id;
                  const isHovered = hoverCategory === cat.id;
                  const isActive = isHovered || isSelected;

                  return (
                    <button
                      key={cat.id}
                      onMouseEnter={() => {
                        setHoverCategory(cat.id);
                        setActiveCategory(cat.id);
                      }}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-150 group text-left cursor-pointer ${
                        isActive
                          ? "bg-indigo-500/10 border-indigo-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          : "bg-transparent border-transparent hover:bg-white/3"
                      }`}
                      style={{ outline: "none" }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-108"
                          style={{
                            background: isActive ? `${cat.color}15` : "rgba(255,255,255,0.03)",
                            border: isActive ? `1px solid ${cat.color}35` : "1px solid rgba(255,255,255,0.05)",
                            color: isActive ? cat.color : "#94a3b8"
                          }}
                        >
                          <Icon size={16} />
                        </span>
                        <span className={`text-xs font-semibold font-['Outfit'] transition-all ${isActive ? "text-white translate-x-1" : "text-slate-400"}`}>
                          {cat.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-600 font-bold font-['Outfit'] group-hover:text-indigo-400/70 transition-colors">
                          {cat.activeCount}
                        </span>
                        <ArrowRight
                          size={10}
                          className={`text-slate-700 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400 transition-all ${
                            isActive ? "translate-x-0" : "-translate-x-1"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2: Formats */}
            <div className="hidden md:block w-1/5 min-w-[150px] border-r border-white/5 flex flex-col h-full overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 bg-white/2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-['Inter']">Source Format</span>
              </div>
              <div
                className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                onMouseLeave={() => setHoverFormat(null)}
              >
                {currentCategory?.activeFormats.map((fmt, idx) => {
                  const isSelected = activeFormat === fmt;
                  const isHovered = hoverFormat === fmt;
                  const isActive = isHovered || isSelected;

                  return (
                    <button
                      key={fmt}
                      onMouseEnter={() => {
                        setHoverFormat(fmt);
                        setActiveFormat(fmt);
                      }}
                      onClick={() => setActiveFormat(fmt)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        isActive
                          ? "bg-indigo-500/8 border-indigo-500/15"
                          : "bg-transparent border-transparent hover:bg-white/2 text-slate-400 hover:text-white"
                      }`}
                      style={{ outline: "none" }}
                    >
                      <span className={`text-[11px] font-bold tracking-wider font-['Outfit'] uppercase ${isActive ? "text-indigo-300" : "text-slate-400"}`}>
                        {fmt}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors" style={{ background: isActive ? currentCategory.color : "transparent" }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 3: Available Conversions */}
            <div className="hidden md:block w-1/4 min-w-[220px] border-r border-white/5 flex flex-col h-full overflow-hidden bg-[#07070d]/35">
              <div className="px-5 py-3 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-['Inter']">Available Tools</span>
                <span className="text-[10px] text-slate-500 font-bold">{conversions.length} targets</span>
              </div>
              <div
                className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                onMouseLeave={() => setHoverConversion(null)}
              >
                {conversions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-600 text-xs font-['Outfit']">
                    No conversion targets found
                  </div>
                ) : (
                  conversions.map((conv, idx) => {
                    const isSelected = activeConversion?.from === conv.from && activeConversion?.to === conv.to;
                    const isHovered = hoverConversion?.from === conv.from && hoverConversion?.to === conv.to;
                    const isActive = isHovered || isSelected;

                    return (
                      <Link
                        href={conv.route}
                        key={`${conv.from}-${conv.to}`}
                        onMouseEnter={() => {
                          setHoverConversion(conv);
                          setActiveConversion(conv);
                        }}
                        className="no-underline block"
                      >
                        <div
                          className={`p-3 rounded-xl border transition-all duration-150 group cursor-pointer ${
                            isActive
                              ? "bg-indigo-500/10 border-indigo-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_20px_rgba(0,0,0,0.4)]"
                              : "bg-[#0b0c16]/30 border-white/5 hover:border-indigo-500/15"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white tracking-wide uppercase">{conv.from}</span>
                              <ArrowRight size={10} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                              <span className="text-xs font-bold text-indigo-300 tracking-wide uppercase">{conv.to}</span>
                            </div>
                            <CornerDownRight size={12} className="text-slate-600 opacity-40 group-hover:opacity-100 group-hover:text-indigo-400 transition-all" />
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUMN 4: Tool Preview */}
            <div className="hidden md:block w-3/10 min-w-[280px] p-6 flex flex-col justify-between h-full bg-[#090a12]/75">
              {currentConversion ? (
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all"
                        style={{
                          background: `${currentCategory.color}15`,
                          borderColor: `${currentCategory.color}35`,
                          color: currentCategory.color,
                          boxShadow: `0 0 15px ${currentCategory.glow}`
                        }}
                      >
                        {React.createElement(preview.icon, { size: 22 })}
                      </div>
                      <div>
                        <h3 className="font-['Outfit'] font-bold text-base text-white leading-tight uppercase tracking-wider">{preview.title}</h3>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest mt-1 inline-block">100% Secure Sandbox</span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400 font-['Outfit']">{preview.desc}</p>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Available Features</span>
                      <ul className="space-y-2 list-none p-0 m-0">
                        {preview.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-300 font-medium font-['Outfit']">
                            <span className="text-[10px] text-indigo-400">⚡</span>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Link href={currentConversion.route} className="no-underline block w-full mt-4">
                    <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-150">
                      Convert File Now
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-600 space-y-3">
                  <Zap size={36} className="text-slate-800 animate-spin-slow" />
                  <p className="text-xs font-semibold uppercase tracking-wider font-['Outfit']">Hover operations to preview info</p>
                </div>
              )}
            </div>

            {/* ADAPTIVE TABLET LAYOUT (2-columns) */}
            <div className="hidden sm:block md:hidden w-full h-[550px] overflow-hidden flex flex-row">
              {/* Left Column: Categories + Formats */}
              <div className="w-1/2 border-r border-white/5 flex flex-col h-full">
                <div className="px-5 py-3 border-b border-white/5 bg-white/2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-['Inter']">Category</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {activeCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        if (cat.activeFormats.length > 0) setActiveFormat(cat.activeFormats[0]);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer ${
                        activeCategory === cat.id ? "bg-indigo-500/10 border-indigo-500/20" : "bg-transparent border-transparent"
                      }`}
                    >
                      <span className="text-xs font-semibold text-white">{cat.title}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{cat.activeCount} files</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Active formats + conversions targeting that category */}
              <div className="w-1/2 flex flex-col h-full bg-[#0a0a14]/65">
                <div className="px-5 py-3 border-b border-white/5 bg-white/2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-['Inter']">Conversions</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {currentCategory?.activeFormats.map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => setActiveFormat(fmt)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-colors ${
                          activeFormat === fmt ? "bg-indigo-500/20 border-indigo-500/35 text-indigo-300" : "bg-white/3 border-white/5 text-slate-400"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {conversions.map(conv => (
                      <Link
                        href={conv.route}
                        key={`${conv.from}-${conv.to}`}
                        className="no-underline block"
                      >
                        <div className="p-3 rounded-xl bg-white/3 border border-white/5 hover:border-indigo-500/20 flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase">{conv.from} → {conv.to}</span>
                          <ArrowRight size={12} className="text-indigo-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE SHEET ACCORDION VIEW */}
            <div className="block sm:hidden w-full h-[550px] overflow-y-auto p-4 space-y-4">
              {activeCategories.map(cat => {
                const isSelected = activeCategory === cat.id;
                const Icon = cat.icon;
                
                return (
                  <div key={cat.id} className="border border-white/5 rounded-2xl bg-white/2 overflow-hidden transition-all">
                    <button
                      onClick={() => setActiveCategory(isSelected ? null : cat.id)}
                      className="w-full flex items-center justify-between p-4 bg-transparent border-none text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}15`, color: cat.color }}>
                          <Icon size={16} />
                        </span>
                        <span className="text-sm font-semibold text-white">{cat.title}</span>
                      </div>
                      <span className="text-xs text-slate-500">{cat.activeCount} converters</span>
                    </button>

                    {isSelected && (
                      <div className="border-t border-white/5 bg-black/20 p-4 space-y-4">
                        <div className="flex flex-wrap gap-1.5">
                          {cat.activeFormats.map(fmt => (
                            <button
                              key={fmt}
                              onClick={() => {
                                setActiveFormat(fmt);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border ${
                                activeFormat === fmt ? "bg-indigo-500/20 border-indigo-500/35 text-indigo-300" : "bg-white/3 border-white/5 text-slate-400"
                              }`}
                            >
                              {fmt}
                            </button>
                          ))}
                        </div>
                        <div className="space-y-2">
                          {conversions.map(conv => (
                            <Link
                              href={conv.route}
                              key={`${conv.from}-${conv.to}`}
                              className="no-underline block"
                            >
                              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between active:bg-indigo-500/10">
                                <span className="text-xs font-bold text-white uppercase">{conv.from} → {conv.to}</span>
                                <ArrowRight size={12} className="text-indigo-400" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
