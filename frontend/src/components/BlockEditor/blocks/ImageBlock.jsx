import React, { useState } from "react";
import { Image as ImageIcon, UploadCloud, Link as LinkIcon, Trash2 } from "lucide-react";

export default function ImageBlock({ attributes, onChange, isSelected, onOpenMediaModal }) {
  const { url = "", alt = "", caption = "", align = "center", width = "100%" } = attributes;
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        onChange({
          url: data.url,
          alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "),
        });
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange({ url: urlInput.trim() });
      setShowUrlInput(false);
    }
  };

  const alignClasses = {
    left: "text-left mx-0 float-left mr-6 max-w-md",
    center: "text-center mx-auto",
    right: "text-right ml-auto float-right ml-6 max-w-md",
    wide: "text-center -mx-8 max-w-none",
    full: "text-center -mx-16 max-w-none",
  };

  if (!url) {
    return (
      <div className="my-4 p-6 bg-[#090914] border-2 border-dashed border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <ImageIcon size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white font-['Outfit']">Add Image</h4>
          <p className="text-xs text-gray-400">Upload a photo, pick from media library, or paste a URL.</p>
        </div>

        {uploading ? (
          <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium">
            <span className="animate-spin">⏳</span> Uploading image file...
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-600/20">
              <UploadCloud size={14} /> Upload File
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {onOpenMediaModal && (
              <button
                type="button"
                onClick={() => onOpenMediaModal((selectedUrl) => onChange({ url: selectedUrl }))}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border border-white/10"
              >
                <ImageIcon size={14} /> Media Library
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border border-white/10"
            >
              <LinkIcon size={14} /> Insert from URL
            </button>
          </div>
        )}

        {showUrlInput && (
          <form onSubmit={handleUrlSubmit} className="flex items-center gap-2 w-full max-w-md mt-2">
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 bg-[#141424] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
            />
            <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer">
              Apply
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <figure className={`my-4 relative group ${alignClasses[align] || alignClasses.center}`}>
      <div className="relative inline-block max-w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group/img">
        <img src={url} alt={alt || "Image"} className="max-w-full h-auto block rounded-2xl" style={{ width }} />
        {isSelected && (
          <button
            type="button"
            onClick={() => onChange({ url: "", alt: "", caption: "" })}
            className="absolute top-3 right-3 p-2 bg-rose-600/90 text-white rounded-xl text-xs opacity-0 group-hover/img:opacity-100 transition-all cursor-pointer shadow-lg"
            title="Replace Image"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <figcaption
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange({ caption: e.currentTarget.innerHTML })}
        className="text-xs text-gray-400 mt-2 italic text-center outline-none empty:before:content-['Add_caption...'] empty:before:text-gray-600"
        dangerouslySetInnerHTML={{ __html: caption }}
      />
    </figure>
  );
}
