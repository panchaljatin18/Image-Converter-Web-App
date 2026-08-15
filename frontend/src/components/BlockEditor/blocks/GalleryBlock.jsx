import React from "react";
import { Grid, Plus, Trash2 } from "lucide-react";

export default function GalleryBlock({ attributes, onChange, isSelected, onOpenMediaModal }) {
  const { images = [], columns = 3, gap = 16 } = attributes;

  const handleAddImage = () => {
    if (onOpenMediaModal) {
      onOpenMediaModal((url) => {
        onChange({ images: [...images, { url, alt: "Gallery Image", caption: "" }] });
      });
    } else {
      const url = prompt("Enter image URL:");
      if (url) {
        onChange({ images: [...images, { url, alt: "Gallery Image", caption: "" }] });
      }
    }
  };

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange({ images: updated });
  };

  if (images.length === 0) {
    return (
      <div className="my-4 p-6 bg-[#090914] border-2 border-dashed border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <Grid size={20} />
        </div>
        <h4 className="text-sm font-bold text-white font-['Outfit']">Image Gallery</h4>
        <button
          type="button"
          onClick={handleAddImage}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus size={14} /> Add Images to Gallery
        </button>
      </div>
    );
  }

  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns] || "grid-cols-3";

  return (
    <div className="my-4 space-y-3">
      <div className={`grid ${gridColsClass}`} style={{ gap: `${gap}px` }}>
        {images.map((img, idx) => (
          <div key={idx} className="relative group/gal border border-white/10 rounded-2xl overflow-hidden bg-[#090912] aspect-square">
            <img src={img.url} alt={img.alt || "Gallery Item"} className="w-full h-full object-cover rounded-2xl" />
            {isSelected && (
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-rose-600/90 text-white rounded-lg text-xs opacity-0 group-hover/gal:opacity-100 transition-all cursor-pointer shadow-lg"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>
      {isSelected && (
        <button
          type="button"
          onClick={handleAddImage}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-indigo-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10 cursor-pointer"
        >
          <Plus size={14} /> Add More Images
        </button>
      )}
    </div>
  );
}
