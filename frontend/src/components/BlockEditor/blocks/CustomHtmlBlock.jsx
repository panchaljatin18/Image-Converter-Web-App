import React from "react";

export default function CustomHtmlBlock({ attributes, onChange, isSelected }) {
  const { html = "", content = "", mode = "html" } = attributes;
  const currentHtml = html || content || "";

  const handleChange = (val) => {
    onChange({ html: val, content: val });
  };

  const activeMode = mode || "html";

  return (
    <div
      className={`w-full my-2 rounded-xl transition-all duration-200 overflow-hidden ${
        isSelected ? "ring-2 ring-indigo-500/40 border border-indigo-500/50" : "border border-white/10"
      } bg-[#0c0c16]`}
    >
      {activeMode === "html" ? (
        <textarea
          value={currentHtml}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Tab") {
              e.preventDefault();
              const start = e.target.selectionStart;
              const end = e.target.selectionEnd;
              const val = e.target.value;
              const newValue = val.substring(0, start) + "  " + val.substring(end);
              handleChange(newValue);
              setTimeout(() => {
                if (e.target) {
                  e.target.selectionStart = e.target.selectionEnd = start + 2;
                }
              }, 0);
            }
          }}
          placeholder="Write HTML…"
          rows={6}
          className="w-full bg-transparent text-xs font-mono text-cyan-200 outline-none placeholder-gray-600 resize-y leading-relaxed p-4 border-none"
        />
      ) : (
        <div className="p-4 min-h-[100px] text-white">
          {!currentHtml.trim() ? (
            <div className="py-6 text-center text-gray-500 text-xs font-['Outfit'] select-none">
              HTML preview will appear here once you add code.
            </div>
          ) : (
            <div className="w-full break-words text-xs">
              <div dangerouslySetInnerHTML={{ __html: currentHtml }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
