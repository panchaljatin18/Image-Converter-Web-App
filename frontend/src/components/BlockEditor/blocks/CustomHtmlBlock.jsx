import React, { useState, useRef, useEffect, useCallback } from "react";

/**
 * Gutenberg Disabled Component
 * Prevents any user interactions with elements inside the preview container
 * (e.g. clicking links, submitting forms, focusing inputs).
 */
function Disabled({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function disableAllInteractiveElements() {
      const selectors =
        "a, button, input, select, textarea, object, iframe, [tabindex], [contenteditable]";
      const elements = container.querySelectorAll(selectors);

      elements.forEach((element) => {
        const tagName = element.tagName ? element.tagName.toUpperCase() : "";
        if (["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(tagName)) {
          element.setAttribute("disabled", "true");
        }
        if (element.hasAttribute("href")) {
          element.removeAttribute("href"); // links non-clickable
        }
        element.setAttribute("tabindex", "-1"); // skip tab navigation
        if (element.hasAttribute("contenteditable")) {
          element.setAttribute("contenteditable", "false");
        }
      });

      // Pointer events disabled so click-through fails visually & functionally
      container.style.pointerEvents = "none";
    }

    disableAllInteractiveElements();

    // Observe DOM mutations inside preview pane to disable dynamically added elements
    const observer = new MutationObserver(() => disableAllInteractiveElements());
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, [children]);

  return (
    <div
      ref={containerRef}
      style={{ pointerEvents: "none", width: "100%", opacity: 1 }}
    >
      {children}
    </div>
  );
}

/**
 * WordPress Gutenberg "Custom HTML" Block Component (core/html)
 * Exact algorithm implementation
 */
function CustomHtmlBlock({ attributes = {}, onChange, isSelected, onSelect }) {
  const rawContent = attributes.content !== undefined ? attributes.content : (attributes.html || "");

  // Local editor session state for mode toggle (defaults to "HTML" mode on load, non-persisted)
  const isPreviewFromAttrs = attributes.mode === "preview";
  const [isPreviewLocal, setIsPreviewLocal] = useState(false);
  const isPreview = isPreviewFromAttrs || isPreviewLocal;

  const textareaRef = useRef(null);

  const handleContentChange = useCallback(
    (newVal) => {
      onChange({ content: newVal, html: newVal });
    },
    [onChange]
  );

  // Tab Key Interception: insert '\t' character at cursor position without losing focus
  const handleKeyDown = useCallback(
    (e) => {
      e.stopPropagation();

      if (e.key === "Tab") {
        e.preventDefault();
        const target = e.target;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const val = target.value;

        const newValue = val.substring(0, start) + "\t" + val.substring(end);
        handleContentChange(newValue);

        requestAnimationFrame(() => {
          if (target) {
            target.selectionStart = target.selectionEnd = start + 1;
          }
        });
      }
    },
    [handleContentChange]
  );

  return (
    <div
      className={`w-full my-2 transition-all rounded-xl border ${
        isSelected
          ? "border-indigo-500/80 ring-1 ring-indigo-500/50"
          : "border-white/10 hover:border-white/20"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {isPreview ? (
        /* Preview Mode — Disabled Sandboxed Render */
        <div className="w-full p-4 rounded-xl bg-[#090912] text-gray-200">
          {!rawContent.trim() ? (
            <div className="text-center py-6 text-xs text-gray-500 font-mono">
              (Empty HTML content)
            </div>
          ) : (
            <Disabled>
              <div
                className="block-library-html__preview-content font-sans text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: rawContent }}
              />
            </Disabled>
          )}
        </div>
      ) : (
        /* HTML Mode — Plain Textarea */
        <div className="w-full bg-[#070710] rounded-xl p-3">
          <textarea
            ref={textareaRef}
            value={rawContent}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write HTML…"
            aria-label="HTML"
            spellCheck={false}
            rows={6}
            className="block-library-html__textarea w-full bg-transparent text-xs text-indigo-100 caret-white outline-none placeholder:text-gray-600 resize-y min-h-[140px] leading-6 font-mono border-none p-0 selection:bg-indigo-500/40"
            style={{
              fontFamily: "Menlo, Consolas, monaco, monospace",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(CustomHtmlBlock);
