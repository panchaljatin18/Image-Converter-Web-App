import React, { useState, useRef, useEffect, useCallback } from "react";
import { FileCode, MoreVertical, Copy, ChevronUp, ChevronDown, Trash2, Eye, Code2 } from "lucide-react";

/**
 * CustomHtmlBlock - WordPress Gutenberg Custom HTML Block (core/html)
 * Single Source of Truth: block.content.html
 */
function CustomHtmlBlock({
  block = {},
  attributes = {},
  onChange,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}) {
  // Mode: "html" (source code editor) or "preview" (sandboxed rendered HTML)
  const [mode, setMode] = useState(attributes.mode || "html");
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(120);

  const textareaRef = useRef(null);
  const iframeRef = useRef(null);

  // Extract raw HTML string from block.content.html (or fallback attributes)
  let rawHtml = "";
  if (typeof block?.content === "object" && block.content !== null && typeof block.content.html === "string") {
    rawHtml = block.content.html;
  } else if (typeof block?.content === "string") {
    rawHtml = block.content;
  } else if (typeof attributes?.html === "string") {
    rawHtml = attributes.html;
  } else if (typeof attributes?.content === "string") {
    rawHtml = attributes.content;
  }

  // Handle source HTML change
  const handleHtmlChange = useCallback(
    (newVal) => {
      if (onChange) {
        onChange({
          content: { html: newVal },
          html: newVal,
          attributes: {
            ...attributes,
            html: newVal,
            mode,
          },
        });
      }
    },
    [onChange, attributes, mode]
  );

  // Handle Mode Toggle (HTML <-> Preview)
  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (onChange) {
      onChange({
        content: { html: rawHtml },
        html: rawHtml,
        attributes: {
          ...attributes,
          html: rawHtml,
          mode: newMode,
        },
      });
    }
  };

  // Intercept Tab key for code editing inside textarea without losing focus
  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;

      const newValue = val.substring(0, start) + "  " + val.substring(end);
      handleHtmlChange(newValue);

      requestAnimationFrame(() => {
        if (target) {
          target.selectionStart = target.selectionEnd = start + 2;
        }
      });
    }
  };

  // Intercept paste inside textarea so raw plain text inserts directly without parent block-splitting
  const handlePaste = (e) => {
    e.stopPropagation();
  };

  // Listen for resize messages from Preview iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "custom-html-iframe-resize") {
        if (block?.id && event.data.blockId === block.id && event.data.height) {
          setIframeHeight(Math.max(event.data.height, 60));
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [block?.id]);

  // Copy HTML to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(rawHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowMenu(false);
  };

  // Construct srcDoc for sandboxed Preview iframe
  const previewSrcDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 12px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #e2e8f0;
      background: transparent;
      line-height: 1.5;
    }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  ${rawHtml}
  <script>
    function sendHeight() {
      const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, 40);
      window.parent.postMessage({ type: 'custom-html-iframe-resize', blockId: '${block?.id || "preview"}', height: h }, '*');
    }
    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);
    setTimeout(sendHeight, 50);
    setTimeout(sendHeight, 300);
  </script>
</body>
</html>`;

  return (
    <div
      className={`w-full my-3 rounded-xl border transition-all duration-200 overflow-hidden ${
        isSelected
          ? "border-indigo-500/80 ring-2 ring-indigo-500/30 shadow-[0_8px_25px_rgba(99,102,241,0.15)] bg-[#0a0a14]"
          : "border-white/10 hover:border-white/20 bg-[#080810]"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* WordPress Gutenberg Custom HTML Block Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121222] border-b border-white/10 font-['Outfit'] select-none">
        <div className="flex items-center gap-2">
          {onMoveUp && onMoveDown && (
            <div className="flex items-center text-gray-400">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp();
                }}
                className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                title="Move Up"
              >
                <ChevronUp size={13} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown();
                }}
                className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                title="Move Down"
              >
                <ChevronDown size={13} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <FileCode size={15} className="text-indigo-400" />
            <span>Custom HTML</span>
          </div>
        </div>

        {/* HTML / Preview Toggle Tabs & Options */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-[#070710] rounded-lg border border-white/10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleModeChange("html");
              }}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === "html"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Code2 size={12} />
              <span>HTML</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleModeChange("preview");
              }}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === "preview"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Eye size={12} />
              <span>Preview</span>
            </button>
          </div>

          {/* More Options Dropdown Menu (...) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Block Options"
            >
              <MoreVertical size={14} />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1 z-50 bg-[#161628] border border-white/15 rounded-xl p-1 shadow-2xl min-w-[150px] space-y-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyCode();
                  }}
                  className="w-full px-2.5 py-1.5 text-xs text-left text-gray-200 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Copy size={13} className="text-indigo-400" />
                  <span>{copied ? "Copied!" : "Copy HTML"}</span>
                </button>
                {onDuplicate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate();
                      setShowMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs text-left text-gray-200 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <FileCode size={13} className="text-cyan-400" />
                    <span>Duplicate</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete Block</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content Body */}
      <div className="w-full bg-[#06060e] p-3">
        {mode === "html" ? (
          /* HTML Source Mode — Raw Monospace Textarea */
          <div className="w-full relative group">
            <textarea
              ref={textareaRef}
              value={rawHtml}
              onChange={(e) => handleHtmlChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Write HTML…"
              aria-label="Custom HTML Source"
              spellCheck={false}
              rows={Math.max(4, rawHtml.split("\n").length)}
              className="w-full bg-transparent text-xs text-indigo-100 caret-white outline-none placeholder:text-gray-600 resize-y min-h-[110px] max-h-[600px] leading-relaxed font-mono border border-white/5 focus:border-indigo-500/40 rounded-lg p-3 selection:bg-indigo-500/40 whitespace-pre overflow-x-auto"
              style={{
                fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                tabSize: 2,
              }}
            />
          </div>
        ) : (
          /* Preview Mode — Sandboxed Frame */
          <div className="w-full rounded-lg bg-[#0a0a14] overflow-hidden border border-white/5">
            {!rawHtml || !rawHtml.trim() ? (
              <div className="text-center py-6 text-xs text-gray-500 font-mono select-none">
                HTML code is empty. Switch to HTML mode to enter code.
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                srcDoc={previewSrcDoc}
                title="Custom HTML Preview"
                sandbox="allow-scripts allow-forms allow-popups"
                className="w-full border-none block"
                style={{ height: `${iframeHeight}px`, transition: "height 0.15s ease" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(CustomHtmlBlock);

