import React from "react";

export default function DividerBlock({ attributes, onChange, isSelected }) {
  const { style = "line", height = 32 } = attributes;

  if (style === "spacer") {
    return (
      <div className="w-full relative my-2 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]" style={{ height: `${height}px` }}>
        <span className="text-[10px] text-gray-500 font-mono select-none">Spacer ({height}px)</span>
      </div>
    );
  }

  if (style === "dots") {
    return (
      <div className="my-6 flex items-center justify-center gap-3 text-gray-500 select-none">
        <span>•</span>
        <span>•</span>
        <span>•</span>
      </div>
    );
  }

  return (
    <div className="my-6 w-full flex items-center">
      <hr className="w-full border-t border-white/10" />
    </div>
  );
}
