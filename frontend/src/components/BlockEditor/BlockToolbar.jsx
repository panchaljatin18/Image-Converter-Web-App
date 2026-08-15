import React from "react";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
} from "lucide-react";
import { BLOCK_DEFINITIONS } from "./utils/blockTypes";

export default function BlockToolbar({
  block,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onChangeType,
  onChangeAttributes,
}) {
  if (!block) return null;

  const currentDef = BLOCK_DEFINITIONS.find((b) => b.type === block.type);

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="absolute -top-12 left-0 z-40 bg-[#161622] border border-indigo-500/40 rounded-xl p-1 shadow-2xl flex items-center gap-1 text-xs text-white backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none">
      {/* Drag Handle */}
      <div className="p-1.5 text-gray-400 hover:text-white cursor-grab active:cursor-grabbing" title="Drag to reorder">
        <GripVertical size={14} />
      </div>

      {/* Up / Down Arrows */}
      <button
        type="button"
        onClick={onMoveUp}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        title="Move Up"
      >
        <ChevronUp size={14} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        title="Move Down"
      >
        <ChevronDown size={14} />
      </button>

      <div className="w-px h-4 bg-white/10 mx-0.5" />

      {/* Block Type Switcher */}
      <select
        value={block.type}
        onChange={(e) => onChangeType(e.target.value)}
        className="bg-[#0c0c16] text-indigo-300 font-bold font-['Outfit'] border border-white/10 rounded-lg px-2 py-1 text-xs outline-none cursor-pointer"
      >
        {BLOCK_DEFINITIONS.map((def) => (
          <option key={def.type} value={def.type}>
            {def.name}
          </option>
        ))}
      </select>

      <div className="w-px h-4 bg-white/10 mx-0.5" />

      {/* Rich Text Formatting (for paragraph, heading, list, quote) */}
      {["paragraph", "heading", "list", "quote"].includes(block.type) && (
        <>
          <button
            type="button"
            onClick={() => applyFormat("bold")}
            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer font-bold"
            title="Bold (Ctrl+B)"
          >
            <Bold size={13} />
          </button>
          <button
            type="button"
            onClick={() => applyFormat("italic")}
            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer italic"
            title="Italic (Ctrl+I)"
          >
            <Italic size={13} />
          </button>
          <button
            type="button"
            onClick={() => applyFormat("underline")}
            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer underline"
            title="Underline (Ctrl+U)"
          >
            <Underline size={13} />
          </button>

          <div className="w-px h-4 bg-white/10 mx-0.5" />
        </>
      )}

      {/* Alignment Controls */}
      {["paragraph", "heading", "image", "button"].includes(block.type) && (
        <>
          <button
            type="button"
            onClick={() => onChangeAttributes({ align: "left" })}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              block.attributes?.align === "left" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
            title="Align Left"
          >
            <AlignLeft size={13} />
          </button>
          <button
            type="button"
            onClick={() => onChangeAttributes({ align: "center" })}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              block.attributes?.align === "center" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
            title="Align Center"
          >
            <AlignCenter size={13} />
          </button>
          <button
            type="button"
            onClick={() => onChangeAttributes({ align: "right" })}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              block.attributes?.align === "right" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
            title="Align Right"
          >
            <AlignRight size={13} />
          </button>

          <div className="w-px h-4 bg-white/10 mx-0.5" />
        </>
      )}

      {/* Duplicate & Delete */}
      <button
        type="button"
        onClick={onDuplicate}
        className="p-1.5 text-gray-400 hover:text-indigo-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        title="Duplicate Block"
      >
        <Copy size={13} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
        title="Delete Block"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
