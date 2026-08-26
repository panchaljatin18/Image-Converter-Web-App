import React, { useState } from "react";
import { Sliders, FileText, Image as ImageIcon, Sparkles, ChevronRight } from "lucide-react";
import { BLOCK_DEFINITIONS } from "./utils/blockTypes";

export default function BlockInspectorSidebar({
  selectedBlock,
  onChangeBlockAttributes,
  onClose,
  // Document props
  title,
  setTitle,
  slug,
  setSlug,
  status,
  setStatus,
  description,
  setDescription,
  focusKeyword,
  setFocusKeyword,
  tags,
  setTags,
  coverImage,
  setCoverImage,
  onOpenMediaModal,
}) {
  const [activeTab, setActiveTab] = useState("block"); // block, document

  const selectedDef = selectedBlock ? BLOCK_DEFINITIONS.find((b) => b.type === selectedBlock.type) : null;
  const attrs = selectedBlock?.attributes || {};

  return (
    <aside className="w-80 bg-[#12121e] border-l border-white/10 flex flex-col shrink-0 h-full overflow-y-auto select-none font-['Outfit']">
      {/* Dual Tab Header */}
      <div className="flex items-center border-b border-white/10 bg-[#161626] sticky top-0 z-20 px-1">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-indigo-600/20 hover:bg-gradient-to-tr hover:from-indigo-600 hover:to-purple-600 border border-indigo-500/30 text-indigo-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer ml-1 shrink-0 shadow-md hover:scale-110 active:scale-95"
            title="Collapse Inspector Sidebar"
          >
            <ChevronRight size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab("block")}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
            activeTab === "block"
              ? "border-indigo-500 text-indigo-300 bg-indigo-500/10"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Sliders size={14} /> Block
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("document")}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
            activeTab === "document"
              ? "border-indigo-500 text-indigo-300 bg-indigo-500/10"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <FileText size={14} /> Document
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5 space-y-6">
        {activeTab === "block" ? (
          !selectedBlock ? (
            <div className="py-12 text-center text-xs text-gray-500 italic">
              No block selected. Click any block in the canvas to customize settings.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <span className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
                  ⌨️
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{selectedDef?.name} Settings</h4>
                  <span className="text-[10px] text-gray-500 font-mono">ID: {selectedBlock.id}</span>
                </div>
              </div>

              {/* Heading Settings */}
              {selectedBlock.type === "heading" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1.5">Heading Level</label>
                    <div className="flex items-center gap-1 bg-[#0a0a14] p-1 rounded-xl border border-white/10">
                      {[1, 2, 3, 4, 5, 6].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => onChangeBlockAttributes({ level: lvl })}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            attrs.level === lvl ? "bg-indigo-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
                          }`}
                        >
                          H{lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1.5">HTML Anchor (ID)</label>
                    <input
                      type="text"
                      placeholder="e.g. section-1"
                      value={attrs.anchor || ""}
                      onChange={(e) => onChangeBlockAttributes({ anchor: e.target.value })}
                      className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Paragraph Settings */}
              {selectedBlock.type === "paragraph" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1.5">Font Size</label>
                    <select
                      value={attrs.fontSize || "normal"}
                      onChange={(e) => onChangeBlockAttributes({ fontSize: e.target.value })}
                      className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="small">Small</option>
                      <option value="normal">Normal</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="x-large">Extra Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1.5">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={attrs.textColor || "#ffffff"}
                        onChange={(e) => onChangeBlockAttributes({ textColor: e.target.value })}
                        className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-gray-400">{attrs.textColor || "#ffffff"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Button Settings */}
              {selectedBlock.type === "button" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1.5">Button Style Variant</label>
                    <select
                      value={attrs.variant || "primary"}
                      onChange={(e) => onChangeBlockAttributes({ variant: e.target.value })}
                      className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="primary">Primary (Filled)</option>
                      <option value="secondary">Secondary (Glass)</option>
                      <option value="outline">Outline</option>
                      <option value="gradient">Gradient Glow</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1.5">Button Link URL</label>
                    <input
                      type="text"
                      placeholder="https://example.com"
                      value={attrs.url || ""}
                      onChange={(e) => onChangeBlockAttributes({ url: e.target.value })}
                      className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Columns Settings */}
              {selectedBlock.type === "columns" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1.5">Number of Columns</label>
                    <div className="flex items-center gap-1 bg-[#0a0a14] p-1 rounded-xl border border-white/10">
                      {[2, 3, 4].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => onChangeBlockAttributes({ columnCount: count })}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            attrs.columnCount === count ? "bg-indigo-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {count} Columns
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Divider / Spacer Settings */}
              {selectedBlock.type === "divider" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1.5">Style</label>
                    <select
                      value={attrs.style || "line"}
                      onChange={(e) => onChangeBlockAttributes({ style: e.target.value })}
                      className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="line">Line Divider</option>
                      <option value="dots">Dots</option>
                      <option value="spacer">Spacer Gap</option>
                    </select>
                  </div>
                  {attrs.style === "spacer" && (
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1.5">Spacer Height ({attrs.height || 32}px)</label>
                      <input
                        type="range"
                        min="16"
                        max="120"
                        value={attrs.height || 32}
                        onChange={(e) => onChangeBlockAttributes({ height: parseInt(e.target.value, 10) })}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        ) : (
          /* Document Tab */
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Post Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Publish Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Cover Featured Image</label>
              {coverImage ? (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/10 group">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenMediaModal && onOpenMediaModal((url) => setCoverImage(url))}
                  className="w-full py-6 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white hover:border-indigo-500/40 transition-all cursor-pointer"
                >
                  <ImageIcon size={20} />
                  <span className="text-xs font-semibold">Select Cover Image</span>
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Meta Description (Excerpt)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl p-3 text-xs text-gray-300 outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Focus Keyword</label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
