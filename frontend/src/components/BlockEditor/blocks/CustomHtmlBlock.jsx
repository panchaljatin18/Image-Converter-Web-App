import React, { useState } from "react";

export default function CustomHtmlBlock({ attributes, onChange, isSelected }) {
  const { html = "" } = attributes;
  const [activeTab, setActiveTab] = useState("html"); // html, preview

  return (
    <div className="my-4 rounded-2xl border border-indigo-500/30 bg-[#0d0d18] overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141424] border-b border-indigo-500/20 font-['Outfit'] select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
          <span>&lt;/&gt; Custom HTML / Schema Block</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#090912] p-1 rounded-lg border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab("html")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === "html" ? "bg-indigo-600 text-white shadow-sm" : "text-[#9494a3] hover:text-white"
            }`}
          >
            HTML
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === "preview" ? "bg-indigo-600 text-white shadow-sm" : "text-[#9494a3] hover:text-white"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {activeTab === "html" ? (
        <div className="p-4">
          <textarea
            value={html}
            onChange={(e) => onChange({ html: e.target.value })}
            placeholder="Write HTML, CSS, or FAQ Schema markup here..."
            rows={7}
            className="w-full bg-[#090912] border border-white/10 rounded-xl p-3 text-xs font-mono text-cyan-300 outline-none focus:border-indigo-500 transition-colors leading-relaxed"
          />
        </div>
      ) : (
        <div className="p-4 text-white text-sm bg-white/5">
          {html.includes('type="application/ld+json"') ? (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 font-mono text-xs mb-3">
              ⚡ Valid JSON-LD FAQ Schema Tag Active
            </div>
          ) : null}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}
    </div>
  );
}
