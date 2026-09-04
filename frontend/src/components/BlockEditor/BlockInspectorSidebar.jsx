import React, { useState, useRef } from "react";
import { Sliders, FileText, Image as ImageIcon, Sparkles, ChevronRight, Upload, Loader2, Trash2 } from "lucide-react";
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
  imageAlt = "",
  setImageAlt,
  imageTitle = "",
  setImageTitle,
  onOpenMediaModal,
}) {
  const [activeTab, setActiveTab] = useState("block"); // block, document
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const selectedDef = selectedBlock
    ? BLOCK_DEFINITIONS.find(
        (b) =>
          b.type === selectedBlock.type ||
          (selectedBlock.type === "html" && b.type === "custom-html") ||
          (selectedBlock.type === "custom-html" && b.type === "html")
      )
    : null;
  const attrs = selectedBlock?.attrs || selectedBlock?.attributes || {};

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setCoverImage(data.url);
        // If imageAlt is empty, auto-generate SEO friendly alt text based on post title or focus keyword
        if (!imageAlt && setImageAlt) {
          const autoAlt = focusKeyword ? `${focusKeyword} guide illustration` : `${title || "Featured image"} - ConvertGalaxy`;
          setImageAlt(autoAlt);
        }
        if (!imageTitle && setImageTitle) {
          setImageTitle(title || file.name.replace(/\.[^/.]+$/, ""));
        }
      } else {
        setUploadError(data.error || "Image upload failed.");
      }
    } catch (err) {
      setUploadError("Error uploading image to server.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAutoGenerateAlt = () => {
    if (setImageAlt) {
      const autoAlt = focusKeyword ? `${focusKeyword} - ${title || "ConvertGalaxy"}` : `${title || "Featured image"} illustration`;
      setImageAlt(autoAlt);
    }
  };

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
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Post Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title..."
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-slug-example"
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

            {/* Featured Cover Image Section */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon size={13} className="text-indigo-400" /> Featured Cover Image
                </span>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage("");
                      if (setImageAlt) setImageAlt("");
                      if (setImageTitle) setImageTitle("");
                    }}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer text-xs"
                    title="Remove Cover Image"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </label>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />

              {uploadError && (
                <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-[11px] font-medium">
                  {uploadError}
                </div>
              )}

              {coverImage ? (
                <div className="space-y-3">
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/15 bg-[#0a0a14] group">
                    <img src={coverImage} alt={imageAlt || "Cover"} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
                      >
                        <Upload size={12} /> Replace Image
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Alt Text (SEO)</label>
                      <button
                        type="button"
                        onClick={handleAutoGenerateAlt}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                      >
                        Auto-Fill
                      </button>
                    </div>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => setImageAlt && setImageAlt(e.target.value)}
                      placeholder="SEO description for search engines..."
                      className="w-full bg-[#0a0a14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Title / Caption</label>
                    <input
                      type="text"
                      value={imageTitle}
                      onChange={(e) => setImageTitle && setImageTitle(e.target.value)}
                      placeholder="Image title attribute..."
                      className="w-full bg-[#0a0a14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full py-6 border-2 border-dashed border-white/15 hover:border-indigo-500/40 bg-[#0a0a14]/60 hover:bg-indigo-500/5 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white transition-all cursor-pointer group"
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={20} className="animate-spin text-indigo-400" />
                        <span className="text-xs font-semibold text-indigo-300">Uploading & Optimizing...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={22} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold">Select Cover Image</span>
                        <span className="text-[10px] text-gray-500">Auto-converts to optimized WebP</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Meta Description (Excerpt)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="150-160 character description for Google snippet..."
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl p-3 text-xs text-gray-300 outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Focus Keyword</label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. png to jpg"
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
