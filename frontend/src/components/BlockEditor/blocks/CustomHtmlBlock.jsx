import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { AlertTriangle, RefreshCw, Code, Eye, Sun, Moon } from "lucide-react";

/* ─── Sandboxed Preview (renders HTML with ConvertGalaxy Blog Typography & Dark Theme) ─── */
const SandboxedPreview = React.memo(function SandboxedPreview({ html, theme = "dark", onSelect }) {
  const iframeRef = useRef(null);
  const [height, setHeight] = useState(0);
  const lastHtmlRef = useRef("");

  const updateIframeContent = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Skip redundant doc.write if HTML and theme haven't changed
    const currentKey = `${theme}::${html}`;
    if (lastHtmlRef.current === currentKey) return;
    lastHtmlRef.current = currentKey;

    doc.open();
    doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  /* Base Reset */
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: transparent;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 15px;
    line-height: 1.7;
    color: ${theme === "dark" ? "#cbd5e1" : "#212529"};
    width: 100%;
    overflow-x: auto;
  }

  /* Contain images & media */
  img, video, iframe, embed, object {
    max-width: 100% !important;
    height: auto;
    border-radius: 0.75rem;
  }

  /* Sleek Scrollbar */
  ::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.35);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.6);
  }

  ${
    theme === "dark"
      ? `
  /* ─── ConvertGalaxy Blog Dark Prose Design (WordPress Gutenberg standard) ─── */
  .preview-wrapper {
    width: 100%;
    color: #cbd5e1;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  /* Table styling */
  table,
  table[style] {
    width: 100% !important;
    max-width: 100% !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
    margin: 0.75rem 0 !important;
    background-color: #12121e !important;
    border-radius: 0.875rem !important;
    border: 1px solid rgba(99, 102, 241, 0.25) !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
    overflow: hidden !important;
    display: table !important;
    table-layout: auto !important;
  }

  thead, thead[style] {
    background-color: rgba(99, 102, 241, 0.18) !important;
  }

  th,
  th[style] {
    background-color: rgba(99, 102, 241, 0.18) !important;
    color: #a5b4fc !important;
    font-weight: 700 !important;
    font-family: 'Outfit', sans-serif !important;
    text-align: left !important;
    padding: 0.875rem 1.125rem !important;
    border-bottom: 1px solid rgba(99, 102, 241, 0.25) !important;
    border-right: 1px solid rgba(99, 102, 241, 0.1) !important;
    border-top: none !important;
    border-left: none !important;
    font-size: 0.95rem !important;
    letter-spacing: 0.01em !important;
    line-height: 1.4 !important;
  }
  th:last-child {
    border-right: none !important;
  }

  td,
  td[style] {
    padding: 0.875rem 1.125rem !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.03) !important;
    border-top: none !important;
    border-left: none !important;
    color: #cbd5e1 !important;
    background-color: transparent !important;
    font-size: 0.925rem !important;
    line-height: 1.6 !important;
    vertical-align: top !important;
    word-break: break-word !important;
    overflow-wrap: anywhere !important;
  }
  td:last-child {
    border-right: none !important;
  }

  tr:last-child td {
    border-bottom: none !important;
  }

  tr:nth-child(even) td {
    background-color: rgba(255, 255, 255, 0.02) !important;
  }

  tr:hover td {
    background-color: rgba(99, 102, 241, 0.06) !important;
  }

  /* Code pills */
  code,
  code[style] {
    background-color: rgba(99, 102, 241, 0.15) !important;
    color: #c7d2fe !important;
    padding: 0.2rem 0.5rem !important;
    border-radius: 0.375rem !important;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
    font-size: 0.85em !important;
    border: 1px solid rgba(99, 102, 241, 0.25) !important;
    word-break: break-all !important;
    display: inline-block !important;
    margin: 0.15rem 0 !important;
  }

  /* Pre blocks */
  pre,
  pre[style] {
    background-color: #0c0c18 !important;
    border: 1px solid rgba(99, 102, 241, 0.25) !important;
    border-radius: 0.75rem !important;
    padding: 1rem !important;
    overflow-x: auto !important;
    color: #38bdf8 !important;
    margin: 0.75rem 0 !important;
  }
  pre code {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    color: inherit !important;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Outfit', sans-serif !important;
    color: #ffffff !important;
    font-weight: 700 !important;
    margin: 1rem 0 0.5rem 0 !important;
  }

  /* Paragraphs */
  p {
    margin-bottom: 0.75rem !important;
    color: #cbd5e1 !important;
    line-height: 1.7 !important;
  }
  strong, b {
    color: #ffffff !important;
    font-weight: 700 !important;
  }
  em, i {
    color: #e2e8f0 !important;
  }
  a {
    color: #818cf8 !important;
    text-decoration: underline !important;
  }

  /* Lists */
  ul, ol {
    margin: 0.5rem 0 0.75rem 1.5rem !important;
    color: #cbd5e1 !important;
  }
  li {
    margin-bottom: 0.35rem !important;
  }

  /* Blockquote */
  blockquote {
    border-left: 4px solid #6366f1 !important;
    background: rgba(99, 102, 241, 0.08) !important;
    padding: 0.75rem 1rem !important;
    border-radius: 0 0.75rem 0.75rem 0 !important;
    color: #e2e8f0 !important;
    margin: 0.75rem 0 !important;
    font-style: italic !important;
  }
`
      : `
  /* ─── Raw / Light Default Styles ─── */
  .preview-wrapper {
    width: 100%;
    color: #212529;
    background: #ffffff;
    padding: 0.75rem;
    border-radius: 0.75rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0;
    display: table;
    table-layout: auto;
  }
  th, td {
    padding: 0.65rem 0.85rem;
    border: 1px solid #dee2e6;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  th {
    background: #f8f9fa;
    color: #212529;
    font-weight: 700;
  }
  td {
    color: #212529;
    background: #ffffff;
  }
  code {
    background: #e9ecef;
    color: #212529;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-size: 0.88em;
  }
`
  }
</style>
</head>
<body>
  <div class="preview-wrapper">
    ${html}
  </div>
</body>
</html>`);
    doc.close();

    /* Click listener on doc to maintain selection & prevent link navigation inside editor */
    doc.body.addEventListener("click", (e) => {
      const a = e.target.closest ? e.target.closest("a") : null;
      if (a) {
        e.preventDefault();
      }
      onSelect?.();
    });

    /* Resize iframe dynamically to content without infinite loop feedback */
    const updateHeight = () => {
      try {
        if (doc && doc.body) {
          const wrapper = doc.querySelector(".preview-wrapper") || doc.body;
          const rectHeight = Math.ceil(wrapper.getBoundingClientRect().height || doc.body.offsetHeight || 0);
          if (rectHeight > 0) {
            setHeight((prev) => (Math.abs(prev - rectHeight) > 2 ? rectHeight : prev));
          }
        }
      } catch (_) {}
    };

    updateHeight();

    let ro = null;
    try {
      if (iframe.contentWindow && iframe.contentWindow.ResizeObserver) {
        ro = new iframe.contentWindow.ResizeObserver(updateHeight);
        const wrapper = doc.querySelector(".preview-wrapper") || doc.body;
        if (wrapper) ro.observe(wrapper);
      }
    } catch (_) {}

    iframe.onload = updateHeight;
    const t1 = setTimeout(updateHeight, 50);
    const t2 = setTimeout(updateHeight, 200);

    return () => {
      if (ro) ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [html, theme, onSelect]);

  useEffect(() => {
    const cleanup = updateIframeContent();
    return cleanup;
  }, [updateIframeContent]);

  return (
    <iframe
      ref={iframeRef}
      title="Custom HTML Preview"
      sandbox="allow-scripts allow-same-origin"
      scrolling="no"
      style={{
        width: "100%",
        height: height > 0 ? `${height}px` : "auto",
        minHeight: "32px",
        border: "none",
        background: "transparent",
        display: "block",
        overflow: "hidden",
      }}
    />
  );
});

/* ─── Main Custom HTML Block ─── */
function CustomHtmlBlock({ attributes = {}, onChange, isSelected, onSelect }) {
  const { html = "", content = "", mode = "html", isCorrupted = false } = attributes;
  const currentHtml = html || content || "";
  const activeMode = mode || "html";

  const [previewTheme, setPreviewTheme] = useState("dark");
  const [tabTrapEnabled, setTabTrapEnabled] = useState(false);
  const lineNumbersRef = useRef(null);
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const scrollRafRef = useRef(null);

  const handleChange = useCallback(
    (val) => {
      onChange({ html: val, content: val });
    },
    [onChange]
  );

  const handleScroll = useCallback((e) => {
    const top = e.target.scrollTop;
    const left = e.target.scrollLeft;

    if (scrollRafRef.current) {
      cancelAnimationFrame(scrollRafRef.current);
    }

    scrollRafRef.current = requestAnimationFrame(() => {
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = top;
      }
      if (preRef.current) {
        preRef.current.scrollTop = top;
        preRef.current.scrollLeft = left;
      }
    });
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      e.stopPropagation();

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        setTabTrapEnabled((prev) => !prev);
        return;
      }

      if (e.key === "Tab" && tabTrapEnabled) {
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const val = e.target.value;
        const newValue = val.substring(0, start) + "  " + val.substring(end);
        handleChange(newValue);
        setTimeout(() => {
          if (e.target) e.target.selectionStart = e.target.selectionEnd = start + 2;
        }, 0);
      }
    },
    [tabTrapEnabled, handleChange]
  );

  /* Memoize line count and syntax highlighting to prevent regex recalculation on every render */
  const { lineCount, highlightedCode } = useMemo(() => {
    const lines = Math.max(1, currentHtml.split("\n").length);
    if (!currentHtml) return { lineCount: lines, highlightedCode: "" };

    let escaped = currentHtml
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    escaped = escaped.replace(
      /(&lt;!--[\s\S]*?--&gt;)/g,
      '<span class="text-gray-500 italic opacity-80">$1</span>'
    );

    escaped = escaped.replace(
      /(&lt;\/?[a-z0-9-]+)([\s\S]*?)(&gt;)/gi,
      (match, tagOpen, attrs, tagClose) => {
        let highlightedAttrs = attrs.replace(
          /([a-z0-9-]+)=("[^"]*"|'[^']*')/gi,
          ' <span class="text-cyan-300">$1</span>=<span class="text-amber-300">$2</span>'
        );
        return `<span class="text-indigo-400 font-semibold">${tagOpen}</span>${highlightedAttrs}<span class="text-indigo-400 font-semibold">${tagClose}</span>`;
      }
    );

    return { lineCount: lines, highlightedCode: escaped };
  }, [currentHtml]);

  /* ── Corrupted Block Recovery Banner ── */
  if (isCorrupted) {
    return (
      <div className="w-full my-3 p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 text-amber-200 font-['Outfit'] select-none">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
          <div className="flex-1 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                This block contains unexpected or invalid content.
              </h4>
              <p className="text-xs text-amber-300/80 mt-1">
                The content could not be matched with standard block structure.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange({ isCorrupted: false, mode: "html" })}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw size={13} /> Attempt Block Recovery
              </button>
              <button
                type="button"
                onClick={() => onChange({ isCorrupted: false, mode: "html" })}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-xs transition-all cursor-pointer"
              >
                Edit as HTML
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main Block Layout (WordPress Gutenberg 1:1 style) ── */
  if (activeMode === "preview") {
    return (
      <div
        className={`w-full my-2 transition-all ${
          isSelected ? "ring-1 ring-indigo-500/50 rounded-lg" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
      >
        {!currentHtml.trim() ? (
          <div className="w-full p-6 rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-center font-['Outfit'] select-none">
            <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
              <Code size={20} />
            </div>
            <div className="text-sm font-bold text-gray-200">Custom HTML</div>
            <div className="text-xs text-gray-400 mt-1">
              Add custom HTML code and preview how it looks.
            </div>
          </div>
        ) : (
          <SandboxedPreview html={currentHtml} theme={previewTheme} onSelect={onSelect} />
        )}
      </div>
    );
  }

  /* ── HTML Edit Mode (Code Editor Box) ── */
  return (
    <div
      className={`w-full my-2 rounded-xl transition-all overflow-hidden bg-[#070710] border ${
        isSelected
          ? "border-indigo-500/80 ring-1 ring-indigo-500/50"
          : "border-white/10 hover:border-white/20"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      <div className="relative flex h-[220px] max-h-[380px] overflow-hidden">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          className="select-none py-3 px-3 text-right text-xs font-mono text-gray-600 bg-[#05050c] border-r border-white/10 shrink-0 min-w-[44px] leading-6 overflow-hidden"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-6 leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Syntax Highlight Layer + Textarea */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 p-3 m-0 text-[13px] font-mono leading-6 whitespace-pre-wrap break-words pointer-events-none overflow-hidden text-cyan-200"
            dangerouslySetInnerHTML={{ __html: highlightedCode + "\n" }}
          />
          <textarea
            ref={textareaRef}
            value={currentHtml}
            onChange={(e) => handleChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            placeholder="Write HTML…"
            spellCheck={false}
            className="relative w-full h-full bg-transparent text-[13px] font-mono text-transparent caret-white outline-none placeholder:text-gray-600 leading-6 p-3 border-none selection:bg-indigo-500/40 resize-none overflow-y-auto whitespace-pre-wrap break-words"
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(CustomHtmlBlock);
