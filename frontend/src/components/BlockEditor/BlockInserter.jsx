import React, { useState } from "react";
import {
  Search,
  X,
  Type,
  Heading,
  List,
  Quote,
  Code,
  Image as ImageIcon,
  Grid,
  Video,
  MousePointer,
  FileCode,
  Columns,
  Minus,
} from "lucide-react";
import { BLOCK_CATEGORIES, BLOCK_DEFINITIONS } from "./utils/blockTypes";

export default function BlockInserter({ isOpen, onClose, onSelectBlock }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  if (!isOpen) return null;

  const iconMap = {
    Type,
    Heading,
    List,
    Quote,
    Code,
    Image: ImageIcon,
    Grid,
    Video,
    MousePointer,
    FileCode,
    Columns,
    Minus,
  };

  const filteredBlocks = BLOCK_DEFINITIONS.filter((def) => {
    const matchesCategory = activeCategory === "all" || def.category === activeCategory;
    const matchesSearch =
      def.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      def.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#12121e] border border-indigo-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#171728]">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">+</span>
            Add a Block
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/5 bg-[#0e0e18]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search blocks (e.g. Image, Button, Heading)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#161626] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-all font-['Outfit']"
              autoFocus
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#0e0e18] border-b border-white/5 overflow-x-auto select-none">
          {BLOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Blocks Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredBlocks.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 text-xs italic">
              No matching blocks found for "{searchTerm}".
            </div>
          ) : (
            filteredBlocks.map((def) => {
              const IconComp = iconMap[def.icon] || Type;
              return (
                <button
                  key={def.type}
                  type="button"
                  onClick={() => {
                    onSelectBlock(def.type);
                    onClose();
                  }}
                  className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/5 bg-[#161626] hover:bg-indigo-600/20 hover:border-indigo-500/40 transition-all cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <IconComp size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors font-['Outfit']">
                      {def.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 group-hover:text-gray-300 leading-snug mt-0.5 line-clamp-2">
                      {def.description}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
