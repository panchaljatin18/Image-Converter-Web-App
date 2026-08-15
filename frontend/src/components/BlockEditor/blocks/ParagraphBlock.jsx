import React from "react";

export default function ParagraphBlock({ attributes, onChange, isSelected }) {
  const { content = "", fontSize = "normal", align = "left", textColor = "#ffffff" } = attributes;

  const fontSizes = {
    small: "text-xs leading-relaxed",
    normal: "text-sm leading-relaxed",
    medium: "text-base leading-relaxed",
    large: "text-lg leading-relaxed",
    "x-large": "text-xl leading-relaxed font-medium",
  };

  return (
    <div className="w-full relative group">
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange({ content: e.currentTarget.innerHTML })}
        className={`outline-none transition-all ${fontSizes[fontSize] || fontSizes.normal} text-${align} empty:before:content-['Type_/_to_choose_a_block...'] empty:before:text-gray-500/60 empty:before:italic`}
        style={{ color: textColor || "#ffffff" }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
