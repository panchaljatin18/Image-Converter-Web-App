import React from "react";

export default function HeadingBlock({ attributes, onChange, isSelected }) {
  const { content = "", level = 2, align = "left", anchor = "", textColor = "#ffffff" } = attributes;

  const headingClasses = {
    1: "text-3xl font-extrabold tracking-tight font-['Outfit'] my-3",
    2: "text-2xl font-bold tracking-tight font-['Outfit'] my-2.5",
    3: "text-xl font-bold font-['Outfit'] my-2",
    4: "text-lg font-semibold font-['Outfit'] my-1.5",
    5: "text-base font-semibold font-['Outfit'] my-1",
    6: "text-sm font-bold uppercase tracking-wider font-['Outfit'] my-1",
  };

  const Tag = `h${Math.min(Math.max(level, 1), 6)}`;

  return (
    <div className="w-full relative group">
      <Tag
        id={anchor || undefined}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange({ content: e.currentTarget.innerHTML })}
        className={`outline-none transition-all ${headingClasses[level] || headingClasses[2]} text-${align} empty:before:content-['Heading_${level}...'] empty:before:text-gray-500/60 empty:before:italic`}
        style={{ color: textColor || "#ffffff" }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
