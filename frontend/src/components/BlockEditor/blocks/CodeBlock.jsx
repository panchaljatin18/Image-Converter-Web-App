import React from "react";

export default function CodeBlock({ attributes, onChange, isSelected }) {
  const { code = "", language = "javascript" } = attributes;

  const languages = ["javascript", "html", "css", "json", "python", "bash", "typescript"];

  return (
    <div className="my-4 rounded-2xl border border-white/10 bg-[#090912] overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-[#121220] border-b border-white/5 font-mono text-xs text-gray-400 select-none">
        <span className="font-bold text-indigo-400">code snippet</span>
        {isSelected && (
          <select
            value={language}
            onChange={(e) => onChange({ language: e.target.value })}
            className="bg-[#090912] border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-300 outline-none"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        )}
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange({ code: e.target.value })}
        placeholder="// Write code here..."
        rows={6}
        className="w-full bg-transparent p-4 text-xs font-mono text-cyan-300 outline-none resize-y leading-relaxed"
      />
    </div>
  );
}
