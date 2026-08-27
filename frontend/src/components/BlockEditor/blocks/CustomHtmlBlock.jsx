import React, { useState, useRef, useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/* ─── Sandboxed Preview (renders HTML inside an iframe sized to content, exact WordPress behavior) ─── */
function SandboxedPreview({ html }) {
  const iframeRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  /* Reset */
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    background: transparent;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: #e2e8f0;
    overflow-x: hidden;
    overflow-y: hidden;
    width: 100%;
  }
  /* Contain all elements within iframe width */
  body > * { max-width: 100% !important; }
  img, video, iframe, embed, object, table { max-width: 100% !important; }
  table { display: block; overflow-x: auto; width: 100%; }
  pre { overflow-x: auto; }
  /* Prevent absolutely positioned elements from blowing past container */
  body { position: relative; }
</style>
</head>
<body>${html}</body>
</html>`);
    doc.close();

    /* Auto-size iframe to fit content height */
    const resize = () => {
      try {
        const body = iframe.contentDocument?.body;
        if (body) {
          const h = body.scrollHeight;
          setHeight(h);
        }
      } catch (_) {}
    };

    iframe.onload = resize;
    // Also resize after a small delay for scripts/images that load after onload
    const t1 = setTimeout(resize, 150);
    const t2 = setTimeout(resize, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      title="Custom HTML Preview"
      sandbox="allow-scripts allow-same-origin"
      scrolling="no"
      style={{
        width: "100%",
        height: height > 0 ? `${height}px` : "auto",
        minHeight: "40px",
        border: "none",
        background: "transparent",
        display: "block",
        /* Let clicks fall through to parent so block stays selected */
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Main Custom HTML Block ─── */
export default function CustomHtmlBlock({ attributes = {}, onChange, isSelected, onSelect }) {
  const { html = "", content = "", mode = "html", isCorrupted = false } = attributes;
  const currentHtml = html || content || "";
  const activeMode = mode || "html";

  const [tabTrapEnabled, setTabTrapEnabled] = useState(false);
  const lineNumbersRef = useRef(null);
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  const handleChange = (val) => {
    onChange({ html: val, content: val });
  };

  const handleScroll = (e) => {
    const top = e.target.scrollTop;
    const left = e.target.scrollLeft;
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = top;
    }
    if (preRef.current) {
      preRef.current.scrollTop = top;
      preRef.current.scrollLeft = left;
    }
  };

  const handleKeyDown = (e) => {
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
  };

  const lineCount = Math.max(1, currentHtml.split("\n").length);

  const getHighlightedCode = (code) => {
    if (!code) return "";
    let escaped = code
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

    return escaped;
  };

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

  /* ── PREVIEW MODE: Sandboxed iframe exactly filling the block's column width ── */
  if (activeMode === "preview") {
    if (!currentHtml.trim()) {
      return (
        <div
          className="py-6 text-center text-gray-500 text-xs font-['Outfit'] select-none"
          onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
        >
          HTML preview will appear here once you add code.
        </div>
      );
    }
    return (
      /*
        Relative wrapper catches all click events so block stays selected.
        The iframe has pointerEvents:none so clicks pass through to this div.
      */
      <div
        className="w-full my-0 relative"
        onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      >
        <SandboxedPreview html={currentHtml} />
      </div>
    );
  }

  /* ── HTML EDIT MODE ── */
  return (
    <div
      className={`w-full my-3 rounded-xl transition-all duration-200 overflow-hidden shadow-xl ${
        isSelected
          ? "ring-2 ring-indigo-500/50 border border-indigo-500/60"
          : "border border-white/10 hover:border-white/20"
      } bg-[#0c0c16]`}
    >
      <div className="relative flex bg-[#070710] h-[220px] max-h-[340px] overflow-hidden">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          className="select-none py-3 px-3 text-right text-xs font-mono text-gray-600 bg-[#05050c] border-r border-white/10 shrink-0 min-w-[44px] leading-6 overflow-hidden"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-6 leading-6">{i + 1}</div>
          ))}
        </div>

        {/* Syntax Highlight Layer + Textarea */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 p-3 m-0 text-[13px] font-mono leading-6 whitespace-pre-wrap break-words pointer-events-none overflow-hidden text-cyan-200"
            dangerouslySetInnerHTML={{ __html: getHighlightedCode(currentHtml) + "\n" }}
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
