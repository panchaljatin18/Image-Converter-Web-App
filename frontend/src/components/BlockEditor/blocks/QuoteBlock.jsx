import React from "react";
import { Quote } from "lucide-react";

export default function QuoteBlock({ attributes, onChange, isSelected }) {
  const { content = "Quote text...", citation = "", style = "default", textColor = "#e0e7ff" } = attributes;

  const isLarge = style === "large";

  return (
    <blockquote className={`my-4 pl-5 border-l-4 border-indigo-500 relative w-full max-w-full min-w-0 break-words ${isLarge ? "py-4 text-lg font-serif italic" : "py-2 text-sm italic"}`}>
      <Quote className="absolute -top-3 -left-3 text-indigo-500/20" size={32} />
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange({ content: e.currentTarget.innerHTML })}
        className="w-full max-w-full min-w-0 break-words whitespace-pre-wrap [overflow-wrap:anywhere] outline-none leading-relaxed"
        style={{ color: textColor }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange({ citation: e.currentTarget.innerText })}
        className="w-full max-w-full min-w-0 break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-xs text-indigo-300 not-italic mt-2 outline-none font-sans font-semibold empty:before:content-['—_Add_citation...'] empty:before:text-gray-500"
        dangerouslySetInnerHTML={{ __html: citation ? `— ${citation}` : "" }}
      />
    </blockquote>
  );
}
