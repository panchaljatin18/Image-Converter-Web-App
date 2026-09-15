import React, { useRef, useEffect, useLayoutEffect } from "react";

function HeadingBlock({
  attributes,
  onChange,
  isSelected,
  onEnterNextBlock,
  onDeleteEmptyBlock,
  onChangeType,
  onNavigateBlock,
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
    1: "text-[clamp(1.65rem,4vw,2.5rem)] leading-[1.25] font-extrabold tracking-tight font-['Outfit'] mt-4 mb-2",
    2: "text-[clamp(1.35rem,3vw,1.85rem)] leading-[1.3] font-bold tracking-tight font-['Outfit'] mt-3.5 mb-2 pb-1.5 border-b border-indigo-500/20",
    3: "text-[clamp(1.15rem,2.4vw,1.45rem)] leading-[1.35] font-bold font-['Outfit'] mt-3 mb-1.5",
    4: "text-[clamp(1.02rem,2vw,1.2rem)] leading-[1.4] font-semibold font-['Outfit'] mt-2.5 mb-1",
    5: "text-[clamp(0.95rem,1.8vw,1.1rem)] leading-[1.4] font-semibold font-['Outfit'] mt-2 mb-1",
    6: "text-[clamp(0.875rem,1.5vw,1rem)] leading-[1.4] font-bold tracking-wider uppercase font-['Outfit'] mt-2 mb-1 text-indigo-300",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
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

    const cleanHtml = htmlVal.replace(/^(#{1,6}\s+|&nbsp;)+/i, "");
    onChange({ content: cleanHtml });
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" && onNavigateBlock) {
      const selection = typeof window !== "undefined" ? window.getSelection() : null;
      if (selection && selection.rangeCount > 0 && inputRef.current) {
        const range = selection.getRangeAt(0);
        const preRange = document.createRange();
        preRange.selectNodeContents(inputRef.current);
        preRange.setEnd(range.startContainer, range.startOffset);
        const preText = preRange.toString();
        if (!preText.includes("\n") && preText.length === 0) {
          e.preventDefault();
          onNavigateBlock("up", "end");
          return;
        }
      }
    } else if (e.key === "ArrowDown" && onNavigateBlock) {
      const selection = typeof window !== "undefined" ? window.getSelection() : null;
      if (selection && selection.rangeCount > 0 && inputRef.current) {
        const range = selection.getRangeAt(0);
        const postRange = document.createRange();
        postRange.selectNodeContents(inputRef.current);
        postRange.setStart(range.endContainer, range.endOffset);
        const postText = postRange.toString();
        if (!postText.includes("\n") && postText.length === 0) {
          e.preventDefault();
          onNavigateBlock("down", "start");
          return;
        }
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const selection = typeof window !== "undefined" ? window.getSelection() : null;

      if (selection && selection.rangeCount > 0 && inputRef.current) {
        const range = selection.getRangeAt(0);
        const ancestor = range.commonAncestorContainer.nodeType === 3
          ? range.commonAncestorContainer.parentNode
          : range.commonAncestorContainer;

        if (inputRef.current.contains(ancestor) || inputRef.current === ancestor) {
          if (!range.collapsed) {
            range.deleteContents();
          }

          const postRange = document.createRange();
          postRange.selectNodeContents(inputRef.current);
          postRange.setStart(range.endContainer, range.endOffset);

          const fragment = postRange.extractContents();
          const div = document.createElement("div");
          div.appendChild(fragment);

          let splitHtml = div.innerHTML.replace(/^(\s*<br\s*\/?>|\s)+/i, "");
          let currentHeadHtml = inputRef.current.innerHTML.replace(/(\s*<br\s*\/?>\s*)+$/i, "");

          const isSplitEmpty = !splitHtml || splitHtml.replace(/<[^>]*>/g, "").trim() === "";
          const finalSplitHtml = isSplitEmpty ? "" : splitHtml;

          const isHeadEmpty = !currentHeadHtml || currentHeadHtml.replace(/<[^>]*>/g, "").trim() === "";
          const finalHeadHtml = isHeadEmpty ? "" : currentHeadHtml;

          inputRef.current.innerHTML = finalHeadHtml;

          if (onEnterNextBlock) {
            onEnterNextBlock(finalSplitHtml, finalHeadHtml);
          }
          return;
        }
      }

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
        className={`w-full max-w-full min-w-0 break-words whitespace-pre-wrap [overflow-wrap:anywhere] outline-none transition-all ${headingClasses[level] || headingClasses[2]} ${alignClasses[align] || "text-left"} empty:before:content-['Heading_${level}...'] empty:before:text-gray-500/60 empty:before:italic`}
        style={{ color: textColor || "#ffffff" }}
      />
    </div>
  );
}

export default React.memo(HeadingBlock);
