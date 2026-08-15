import React from "react";
import { X, Layers, Trash2 } from "lucide-react";
import { BLOCK_DEFINITIONS } from "./utils/blockTypes";

export default function BlockOutlineDrawer({ isOpen, onClose, blocks = [], selectedBlockId, onSelectBlock, onDeleteBlock }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[#12121e] border-r border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200 font-['Outfit']">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#171728]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="text-indigo-400" size={16} /> Block Outline Structure
        </h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
        {blocks.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500 italic">No blocks added yet.</div>
        ) : (
          blocks.map((block, idx) => {
            const def = BLOCK_DEFINITIONS.find((b) => b.type === block.type);
            const isSelected = block.id === selectedBlockId;
            const snippet =
              block.attributes?.content || block.attributes?.html || block.attributes?.code || block.type;

            return (
              <div
                key={block.id}
                onClick={() => onSelectBlock(block.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "bg-indigo-600/30 border-indigo-500/50 text-white font-semibold"
                    : "bg-[#181828] border-white/5 text-gray-300 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-indigo-300 shrink-0">{def?.name || block.type}</span>
                  <span className="text-[11px] text-gray-500 truncate italic">
                    {typeof snippet === "string" ? snippet.replace(/<[^>]*>?/gm, "").substring(0, 20) : ""}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBlock(block.id);
                  }}
                  className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
