import React from "react";
import { ExternalLink } from "lucide-react";

export default function ButtonBlock({ attributes, onChange, isSelected }) {
  const { text = "Click Here", url = "#", variant = "primary", align = "left" } = attributes;

  const variantClasses = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30",
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10",
    outline: "bg-transparent hover:bg-indigo-600/10 text-indigo-300 border-2 border-indigo-500",
    gradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl",
  };

  const alignClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[align] || "justify-start";

  return (
    <div className={`my-4 flex ${alignClass}`}>
      <div className="inline-flex items-center gap-2">
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange({ text: e.currentTarget.innerText })}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all outline-none ${variantClasses[variant] || variantClasses.primary}`}
          dangerouslySetInnerHTML={{ __html: text }}
        />
        {isSelected && (
          <input
            type="text"
            placeholder="Link URL (e.g. https://example.com)"
            value={url}
            onChange={(e) => onChange({ url: e.target.value })}
            className="bg-[#141424] border border-indigo-500/30 rounded-xl px-3 py-1.5 text-xs text-cyan-300 outline-none w-56 font-mono"
          />
        )}
      </div>
    </div>
  );
}
