import React, { useRef, useEffect, useLayoutEffect } from "react";

function HeadingBlock({
  attributes,
  onChange,
  isSelected,
  onEnterNextBlock,
  onDeleteEmptyBlock,
  onChangeType,
}) {
  const { content = "", level = 2, align = "left", anchor = "", textColor = "#ffffff" } = attributes;
  const inputRef = useRef(null);

  // Synchronously initialize DOM innerHTML on layout mount or when heading level changes
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.innerHTML = content || "";
    }
  }, [level]);

  // Sync innerHTML when content prop changes externally while not actively typing
  useEffect(() => {
    if (inputRef.current) {
      const isFocused = typeof document !== "undefined" && document.activeElement === inputRef.current;
      if (!isFocused && inputRef.current.innerHTML !== (content || "")) {
        inputRef.current.innerHTML = content || "";
      }
    }
  }, [content]);

  useEffect(() => {
    if (isSelected && inputRef.current) {
      const isFocused = typeof document !== "undefined" && document.activeElement === inputRef.current;
      if (!isFocused) {
        inputRef.current.focus();
        try {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(inputRef.current);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        } catch (e) {}
      }
    }
  }, [isSelected]);

  const headingClasses = {
    1: "text-3xl font-extrabold tracking-tight font-['Outfit'] mt-4 mb-1.5",
    2: "text-2xl font-bold tracking-tight font-['Outfit'] mt-3.5 mb-1.5",
    3: "text-xl font-bold font-['Outfit'] mt-3 mb-1",
    4: "text-lg font-semibold font-['Outfit'] mt-2.5 mb-1",
    5: "text-base font-semibold font-['Outfit'] mt-2 mb-1",
    6: "text-sm font-bold tracking-wider font-['Outfit'] mt-2 mb-1",
  };

  const handleInput = (e) => {
    const rawText = inputRef.current ? inputRef.current.innerText : "";
    const htmlVal = e.currentTarget.innerHTML;

    if (onChangeType && rawText) {
      if (/^######\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^######\s/, "").trim();
        onChange({ level: 6, content: cleanContent });
        return;
      }
      if (/^#####\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^#####\s/, "").trim();
        onChange({ level: 5, content: cleanContent });
        return;
      }
      if (/^####\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^####\s/, "").trim();
        onChange({ level: 4, content: cleanContent });
        return;
      }
      if (/^###\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^###\s/, "").trim();
        onChange({ level: 3, content: cleanContent });
        return;
      }
      if (/^##\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^##\s/, "").trim();
        onChange({ level: 2, content: cleanContent });
        return;
      }
      if (/^#\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^#\s/, "").trim();
        onChange({ level: 1, content: cleanContent });
        return;
      }
    }

    onChange({ content: htmlVal });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (onEnterNextBlock) onEnterNextBlock("");
    } else if (e.key === "Backspace") {
      const selection = typeof window !== "undefined" ? window.getSelection() : null;
      if (selection && !selection.isCollapsed && selection.toString().length > 0) {
        return;
      }
      const text = inputRef.current ? inputRef.current.innerText.replace(/\n/g, "").trim() : "";
      if (!text || text === "") {
        e.preventDefault();
        if (onChangeType) {
          onChangeType("paragraph", { content: "" });
        } else if (onDeleteEmptyBlock) {
          onDeleteEmptyBlock();
        }
      }
    }
  };

  const Tag = `h${Math.min(Math.max(level, 1), 6)}`;

  return (
    <div className="w-full relative group">
      <Tag
        ref={inputRef}
        id={anchor || undefined}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={(e) => onChange({ content: e.currentTarget.innerHTML })}
        onKeyDown={handleKeyDown}
        className={`w-full max-w-full min-w-0 break-words whitespace-pre-wrap [overflow-wrap:anywhere] outline-none transition-all ${headingClasses[level] || headingClasses[2]} text-${align} empty:before:content-['Heading_${level}...'] empty:before:text-gray-500/60 empty:before:italic`}
        style={{ color: textColor || "#ffffff" }}
      />
    </div>
  );
}

export default React.memo(HeadingBlock);
