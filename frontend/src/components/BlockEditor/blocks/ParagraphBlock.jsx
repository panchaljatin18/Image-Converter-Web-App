import React, { useRef, useEffect, useLayoutEffect } from "react";

function ParagraphBlock({
  attributes,
  onChange,
  isSelected,
  isSlashActive = false,
  onSelectSlashCommand,
  onEnterNextBlock,
  onMergeWithPreviousBlock,
  onDeleteEmptyBlock,
  onChangeType,
  onSlashQuery,
  onOpenInserter,
  focusPosition = "start",
}) {
  const { content = "", fontSize = "normal", align = "left", textColor = "#ffffff" } = attributes;
  const inputRef = useRef(null);

  // Synchronously initialize DOM innerHTML on layout mount
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.innerHTML = content || "";
    }
  }, []);

  // Sync innerHTML when content prop changes externally while not actively typing
  useEffect(() => {
    if (inputRef.current) {
      const isFocused = typeof document !== "undefined" && document.activeElement === inputRef.current;
      if (!isFocused && inputRef.current.innerHTML !== (content || "")) {
        inputRef.current.innerHTML = content || "";
      }
    }
  }, [content]);

  // Handle focus position when selected (start vs end of line)
  useEffect(() => {
    if (isSelected && inputRef.current) {
      const isFocused = typeof document !== "undefined" && document.activeElement === inputRef.current;
      if (!isFocused) {
        inputRef.current.focus();
        try {
          const range = document.createRange();
          const sel = window.getSelection();
          if (focusPosition === "end") {
            range.selectNodeContents(inputRef.current);
            range.collapse(false);
          } else {
            range.selectNodeContents(inputRef.current);
            range.collapse(true);
          }
          sel.removeAllRanges();
          sel.addRange(range);
        } catch (e) {}
      }
    }
  }, [isSelected, focusPosition]);

  const fontSizes = {
    small: "text-sm leading-normal",
    normal: "text-base leading-normal tracking-normal",
    medium: "text-lg leading-normal tracking-tight",
    large: "text-xl leading-snug font-medium",
    "x-large": "text-2xl leading-snug font-semibold",
  };

  const handleInput = (e) => {
    const rawText = inputRef.current ? inputRef.current.innerText : "";
    const htmlVal = e.currentTarget.innerHTML;

    // Check for Slash Command menu trigger
    if (onSlashQuery) {
      if (rawText.includes("/")) {
        const match = rawText.match(/\/([a-zA-Z0-9]*)$/);
        if (match) {
          const query = match[1];
          if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            onSlashQuery(query, { top: rect.bottom, left: rect.left });
          }
        } else {
          onSlashQuery(null, null);
        }
      } else {
        onSlashQuery(null, null);
      }
    }

    // Check for WordPress / Markdown auto-formatting triggers on space
    if (onChangeType && rawText) {
      if (/^######\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^######\s/, "").trim();
        onChangeType("heading", { level: 6, content: cleanContent });
        return;
      }
      if (/^#####\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^#####\s/, "").trim();
        onChangeType("heading", { level: 5, content: cleanContent });
        return;
      }
      if (/^####\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^####\s/, "").trim();
        onChangeType("heading", { level: 4, content: cleanContent });
        return;
      }
      if (/^###\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^###\s/, "").trim();
        onChangeType("heading", { level: 3, content: cleanContent });
        return;
      }
      if (/^##\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^##\s/, "").trim();
        onChangeType("heading", { level: 2, content: cleanContent });
        return;
      }
      if (/^#\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^#\s/, "").trim();
        onChangeType("heading", { level: 1, content: cleanContent });
        return;
      }
      if (/^>\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^>\s/, "").trim();
        onChangeType("quote", { content: cleanContent });
        return;
      }
      if (/^(-|\*)\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^(-|\*)\s/, "").trim();
        onChangeType("list", { ordered: false, items: [cleanContent] });
        return;
      }
      if (/^\d+\.\s/.test(rawText)) {
        const cleanContent = rawText.replace(/^\d+\.\s/, "").trim();
        onChangeType("list", { ordered: true, items: [cleanContent] });
        return;
      }
    }

    onChange({ content: htmlVal });
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === "Tab") && isSlashActive) {
      e.preventDefault();
      if (onSelectSlashCommand) onSelectSlashCommand();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const selection = window.getSelection();
      let textAfter = "";

      if (selection && selection.rangeCount > 0 && inputRef.current) {
        const range = selection.getRangeAt(0);

        const postRange = document.createRange();
        postRange.selectNodeContents(inputRef.current);
        postRange.setStart(range.endContainer, range.endOffset);
        textAfter = postRange.toString();

        if (textAfter && textAfter.trim()) {
          const fragment = range.extractContents();
          const div = document.createElement("div");
          div.appendChild(fragment);
          const splitHtml = div.innerHTML;

          const currentHeadHtml = inputRef.current.innerHTML;
          onChange({ content: currentHeadHtml });

          if (onEnterNextBlock) onEnterNextBlock(splitHtml);
          return;
        }
      }

      if (onEnterNextBlock) onEnterNextBlock("");
    } else if (e.key === "Backspace") {
      const selection = window.getSelection();

      // If user highlighted text (Ctrl+A or text selection), let native backspace delete the text
      if (selection && !selection.isCollapsed && selection.toString().length > 0) {
        return;
      }

      let isAtStart = false;

      if (selection && selection.rangeCount > 0 && inputRef.current) {
        const range = selection.getRangeAt(0);
        const preRange = document.createRange();
        preRange.selectNodeContents(inputRef.current);
        preRange.setEnd(range.startContainer, range.startOffset);
        if (preRange.toString().length === 0) {
          isAtStart = true;
        }
      }

      if (isAtStart) {
        e.preventDefault();
        const currentHtml = inputRef.current ? inputRef.current.innerHTML : "";
        if (onMergeWithPreviousBlock) {
          onMergeWithPreviousBlock(currentHtml);
        } else if (onDeleteEmptyBlock) {
          onDeleteEmptyBlock();
        }
      }
    }
  };

  const isEmpty = !content || content.replace(/<[^>]*>/g, "").trim() === "";

  return (
    <div className="w-full relative flex items-center group">
      <div
        ref={inputRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={(e) => onChange({ content: e.currentTarget.innerHTML })}
        onKeyDown={handleKeyDown}
        className={`w-full max-w-full min-w-0 break-words whitespace-pre-wrap [overflow-wrap:anywhere] outline-none transition-all ${fontSizes[fontSize] || fontSizes.normal} text-${align} empty:before:content-['Type_/_to_choose_a_block...'] empty:before:text-gray-500/50 empty:before:not-italic`}
        style={{ color: textColor || "#ffffff" }}
      />
    </div>
  );
}

export default React.memo(ParagraphBlock);
