import React from "react";
import { Plus } from "lucide-react";
import { createBlock } from "../utils/blockTypes";

export default function ColumnsBlock({ attributes, children = [], onChange, isSelected, renderBlockComponent }) {
  const { columnCount = 2, layout = "50-50" } = attributes;

  // Ensure children has arrays for each column
  const columnsData = [];
  for (let i = 0; i < columnCount; i++) {
    columnsData.push(children[i] || []);
  }

  const handleAddBlockToColumn = (colIdx) => {
    const newBlock = createBlock("paragraph", { content: "" });
    const updatedChildren = [...columnsData];
    updatedChildren[colIdx] = [...(updatedChildren[colIdx] || []), newBlock];
    onChange({}, updatedChildren);
  };

  const gridClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }[columnCount] || "grid-cols-1 md:grid-cols-2";

  return (
    <div className={`my-4 grid ${gridClass} gap-4 p-4 rounded-2xl border border-indigo-500/20 bg-[#090912]/60`}>
      {columnsData.map((colBlocks, colIdx) => (
        <div key={colIdx} className="min-h-[100px] p-3 rounded-xl border border-white/5 bg-[#0f0f1c] space-y-3">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Column {colIdx + 1}</div>
          {colBlocks.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-600 italic">Empty column</div>
          ) : (
            colBlocks.map((childBlock, bIdx) => (
              <div key={childBlock.id}>
                {renderBlockComponent ? renderBlockComponent(childBlock, (newAttrs) => {
                  const updatedCol = [...colBlocks];
                  updatedCol[bIdx] = { ...childBlock, attributes: { ...childBlock.attributes, ...newAttrs } };
                  const updatedChildren = [...columnsData];
                  updatedChildren[colIdx] = updatedCol;
                  onChange({}, updatedChildren);
                }) : null}
              </div>
            ))
          )}

          {isSelected && (
            <button
              type="button"
              onClick={() => handleAddBlockToColumn(colIdx)}
              className="w-full py-1.5 rounded-lg border border-dashed border-white/10 hover:border-indigo-500/40 text-gray-400 hover:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Plus size={13} /> Add Block
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
