import React, { useState, useEffect } from "react";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  Unlink,
  List,
  ListOrdered,
  Type,
  Heading as HeadingIcon,
  Quote,
  Code as CodeIcon,
  Table as TableIcon,
  FileCode,
  MoreVertical,
  Copy,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { BLOCK_DEFINITIONS } from "./utils/blockTypes";

export default function BlockToolbar({
  block,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onInsertBefore,
  onInsertAfter,
  onChangeType,
  onChangeAttributes,
  isTopToolbar = false,
}) {
  const [showTypeSwitcher, setShowTypeSwitcher] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [savedRange, setSavedRange] = useState(null);
  const [savedSelectedText, setSavedSelectedText] = useState("");
  const [activeAnchor, setActiveAnchor] = useState(null);

  if (!block) return null;

  const currentDef = BLOCK_DEFINITIONS.find((b) => b.type === block.type);

  const iconMap = {
    paragraph: Type,
    heading: HeadingIcon,
    list: List,
    quote: Quote,
    code: CodeIcon,
    table: TableIcon,
    "custom-html": FileCode,
    html: FileCode,
  };

  const CurrentTypeIcon = iconMap[block.type] || Type;

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleInlineCode = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    let parent = range.commonAncestorContainer;
    if (parent.nodeType === 3) parent = parent.parentNode;
    const codeEl = parent.closest ? parent.closest("code") : null;
    if (codeEl) {
      const textNode = document.createTextNode(codeEl.textContent);
      codeEl.parentNode.replaceChild(textNode, codeEl);
    } else {
      const selectedText = selection.toString();
      if (selectedText) {
        const codeNode = document.createElement("code");
        codeNode.className = "bg-white/10 text-indigo-300 px-1 py-0.5 rounded font-mono text-[0.9em]";
        codeNode.textContent = selectedText;
        range.deleteContents();
        range.insertNode(codeNode);
      }
    }
  };

  const handleToggleLinkPopover = () => {
    if (showLinkPopover) {
      setShowLinkPopover(false);
      return;
    }

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSavedRange(range.cloneRange());
      setSavedSelectedText(selection.toString() || "");

      let parentAnchor = range.commonAncestorContainer;
      if (parentAnchor.nodeType === 3) parentAnchor = parentAnchor.parentNode;
      const existingLink = parentAnchor.closest ? parentAnchor.closest("a") : null;

      if (existingLink) {
        setActiveAnchor(existingLink);
        setLinkUrl(existingLink.getAttribute("href") || "");
        setOpenInNewTab(existingLink.getAttribute("target") === "_blank");
      } else {
        setActiveAnchor(null);
        setLinkUrl("");
        setOpenInNewTab(false);
      }
    }
    setShowLinkPopover(true);
  };

  const handleApplyLink = (e) => {
    e?.preventDefault();
    if (!linkUrl.trim()) return;

    let finalUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith("/") && !finalUrl.startsWith("#")) {
      finalUrl = "https://" + finalUrl;
    }

    if (activeAnchor) {
      activeAnchor.setAttribute("href", finalUrl);
      if (openInNewTab) {
        activeAnchor.setAttribute("target", "_blank");
        activeAnchor.setAttribute("rel", "noopener noreferrer");
      } else {
        activeAnchor.removeAttribute("target");
        activeAnchor.removeAttribute("rel");
      }
    } else {
      if (savedRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }

      const targetText = savedSelectedText ? savedSelectedText : finalUrl;
      const targetAttr = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";
      const linkHtml = `<a href="${finalUrl}"${targetAttr}>${targetText}</a>`;

      document.execCommand("insertHTML", false, linkHtml);
    }

    setShowLinkPopover(false);
    setLinkUrl("");
    setActiveAnchor(null);
    setSavedRange(null);
    setSavedSelectedText("");
  };

  const handleRemoveLink = () => {
    if (activeAnchor) {
      const parent = activeAnchor.parentNode;
      if (parent) {
        while (activeAnchor.firstChild) {
          parent.insertBefore(activeAnchor.firstChild, activeAnchor);
        }
        parent.removeChild(activeAnchor);
      }
    } else if (savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
      document.execCommand("unlink", false, null);
    }
    setShowLinkPopover(false);
    setLinkUrl("");
    setActiveAnchor(null);
    setSavedRange(null);
  };

  const handleTransformBlock = (newType) => {
    setShowTypeSwitcher(false);
    if (newType === block.type) return;

    const currentContent = block.attributes?.content || block.attributes?.code || "";
    let extraAttrs = {};

    if (newType === "paragraph") {
      if (block.type === "list") {
        extraAttrs = { content: (block.attributes?.items || []).join("<br>") };
      } else {
        extraAttrs = { content: currentContent };
      }
    } else if (newType === "heading") {
      extraAttrs = { content: currentContent, level: 2 };
    } else if (newType === "list") {
      let items = [""];
      if (currentContent) {
        const clean = currentContent.replace(/<[^>]*>/g, "").trim();
        const lines = clean.split(/\n+/).filter(Boolean);
        items = lines.length > 0 ? lines : [clean];
      }
      extraAttrs = { items, listType: "unordered", ordered: false };
    } else if (newType === "quote") {
      extraAttrs = { content: currentContent, citation: "" };
    } else if (newType === "code") {
      const rawText = currentContent.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "");
      extraAttrs = { code: rawText, language: "javascript" };
    } else if (newType === "table") {
      extraAttrs = {
        hasHeader: true,
        striped: true,
        head: ["Header 1", "Header 2", "Header 3"],
        rows: [
          ["Data 1", "Data 2", "Data 3"],
          ["Data 4", "Data 5", "Data 6"],
        ],
      };
    } else if (newType === "custom-html" || newType === "html") {
      extraAttrs = { content: currentContent, mode: "html" };
    }

    onChangeType(newType, extraAttrs);
  };

  const handleCopyBlockHtml = () => {
    const el = document.querySelector(`[data-block-id="${block.id}"]`);
    if (el) {
      navigator.clipboard.writeText(el.outerHTML);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
    setShowMoreMenu(false);
  };

  const transformOptions = [
    { type: "paragraph", name: "Paragraph", icon: Type },
    { type: "heading", name: "Heading", icon: HeadingIcon },
    { type: "list", name: "List", icon: List },
    { type: "quote", name: "Quote", icon: Quote },
    { type: "code", name: "Code", icon: CodeIcon },
    { type: "table", name: "Table", icon: TableIcon },
    { type: "custom-html", name: "Custom HTML", icon: FileCode },
  ];

  return (
    <div
      className={`${
        isTopToolbar
          ? "w-full border-b border-white/10 bg-[#161622] px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto shadow-md"
          : "absolute -top-11 left-0 z-40 bg-[#161622] border border-indigo-500/40 rounded-xl p-1 shadow-2xl flex items-center gap-1 text-xs text-white backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none"
      }`}
    >
      {/* Drag Handle */}
      {!isTopToolbar && (
        <div className="p-1.5 text-gray-400 hover:text-white cursor-grab active:cursor-grabbing" title="Drag to reorder">
          <GripVertical size={14} />
        </div>
      )}

      {/* Up / Down Arrows */}
      <button
        type="button"
        onClick={onMoveUp}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        title="Move Up (Ctrl+Shift+Up)"
      >
        <ChevronUp size={14} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        title="Move Down (Ctrl+Shift+Down)"
      >
        <ChevronDown size={14} />
      </button>

      <div className="w-px h-4 bg-white/10 mx-0.5" />

      {/* WordPress Block Switcher Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowTypeSwitcher(!showTypeSwitcher);
            setShowHeadingMenu(false);
            setShowMoreMenu(false);
          }}
          className="bg-[#0c0c16] hover:bg-white/10 text-indigo-300 hover:text-white font-bold font-['Outfit'] border border-white/10 rounded-lg px-2.5 py-1 text-xs select-none flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          title="Transform block type"
        >
          <CurrentTypeIcon size={14} className="text-indigo-400" />
          <span>
            {block.type === "heading"
              ? `Heading ${block.attributes?.level || 2}`
              : block.type === "list"
              ? (block.attributes?.listType === "ordered" || block.attributes?.ordered)
                ? "Numbered List"
                : "Bullet List"
              : (block.type === "custom-html" || block.type === "html")
              ? "Custom HTML"
              : currentDef ? currentDef.name : block.type}
          </span>
          <ChevronDown size={12} className="text-gray-400" />
        </button>

        {showTypeSwitcher && (
          <div className="absolute top-full left-0 mt-1.5 z-50 bg-[#161626] border border-white/15 rounded-xl p-1.5 shadow-2xl min-w-[170px] font-['Outfit'] space-y-0.5">
            <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Transform To
            </div>
            {transformOptions.map((opt) => {
              const OptIcon = opt.icon;
              const isCurrent =
                block.type === opt.type ||
                (opt.type === "custom-html" && block.type === "html");
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => handleTransformBlock(opt.type)}
                  className={`w-full px-2.5 py-1.5 text-xs text-left rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isCurrent
                      ? "bg-indigo-600/30 text-indigo-200 font-bold"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <OptIcon size={13} className="text-indigo-400" />
                    {opt.name}
                  </span>
                  {isCurrent && <Check size={13} className="text-indigo-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* WordPress Heading Level Selector (When block is a Heading) */}
      {block.type === "heading" && (
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowHeadingMenu(!showHeadingMenu);
              setShowTypeSwitcher(false);
              setShowMoreMenu(false);
            }}
            className="px-2 py-1 bg-[#0c0c16] hover:bg-white/10 text-indigo-300 font-bold rounded-lg border border-white/10 flex items-center gap-1 text-xs cursor-pointer transition-colors"
            title="Change Heading Level"
          >
            <span>H{block.attributes?.level || 2}</span>
            <ChevronDown size={11} className="text-gray-400" />
          </button>

          {showHeadingMenu && (
            <div className="absolute top-full left-0 mt-1.5 z-50 bg-[#161626] border border-white/15 rounded-xl p-1 shadow-2xl flex items-center gap-1 font-['Outfit']">
              {[1, 2, 3, 4, 5, 6].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    onChangeAttributes({ level: lvl });
                    setShowHeadingMenu(false);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    (block.attributes?.level || 2) === lvl
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  H{lvl}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HTML / Preview Tab Toggle for Custom HTML Block */}
      {(block.type === "custom-html" || block.type === "html") && (
        <div className="flex items-center gap-1 bg-[#090912] p-0.5 rounded-lg border border-white/10 mx-1 select-none" role="tablist">
          <button
            role="tab"
            aria-selected={(block.attributes?.mode || "html") === "html"}
            type="button"
            onClick={() => onChangeAttributes({ mode: "html" })}
            className={`px-2.5 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer font-['Outfit'] ${
              (block.attributes?.mode || "html") === "html"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            HTML
          </button>
          <button
            role="tab"
            aria-selected={block.attributes?.mode === "preview"}
            type="button"
            onClick={() => onChangeAttributes({ mode: "preview" })}
            className={`px-2.5 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer font-['Outfit'] ${
              block.attributes?.mode === "preview"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Preview
          </button>
        </div>
      )}

      <div className="w-px h-4 bg-white/10 mx-0.5" />

      {/* Rich Text Formatting + Bullet & Numbered List Controls */}
      {["paragraph", "heading", "list", "quote"].includes(block.type) && (
        <>
          <button
            type="button"
            onClick={() => applyFormat("bold")}
            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer font-bold"
            title="Bold (Ctrl+B)"
          >
            <Bold size={13} />
          </button>

          <button
            type="button"
            onClick={() => applyFormat("italic")}
            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer italic"
            title="Italic (Ctrl+I)"
          >
            <Italic size={13} />
          </button>

          <button
            type="button"
            onClick={() => applyFormat("underline")}
            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer underline"
            title="Underline (Ctrl+U)"
          >
            <Underline size={13} />
          </button>

          <button
            type="button"
            onClick={() => applyFormat("strikeThrough")}
            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Strikethrough"
          >
            <Strikethrough size={13} />
          </button>

          {/* Inline Code Formatting Button */}
          <button
            type="button"
            onClick={handleInlineCode}
            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer font-mono"
            title="Inline Code (<code>)"
          >
            <CodeIcon size={13} />
          </button>

          {/* Bullet List Button */}
          <button
            type="button"
            onClick={() => {
              if (block.type === "list") {
                const isCurrentBullet = block.attributes?.listType !== "ordered" && !block.attributes?.ordered;
                if (isCurrentBullet) {
                  const paragraphContent = (block.attributes?.items || []).join("<br>");
                  onChangeType("paragraph", { content: paragraphContent });
                } else {
                  onChangeAttributes({ listType: "unordered", ordered: false });
                }
              } else {
                onChangeType("list", { listType: "unordered", ordered: false });
              }
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              block.type === "list" && (block.attributes?.listType !== "ordered" && !block.attributes?.ordered)
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
            title="Bullet List (Unordered)"
          >
            <List size={13} />
          </button>

          {/* Numbered List Button */}
          <button
            type="button"
            onClick={() => {
              if (block.type === "list") {
                const isCurrentNumbered = block.attributes?.listType === "ordered" || block.attributes?.ordered;
                if (isCurrentNumbered) {
                  const paragraphContent = (block.attributes?.items || []).join("<br>");
                  onChangeType("paragraph", { content: paragraphContent });
                } else {
                  onChangeAttributes({ listType: "ordered", ordered: true });
                }
              } else {
                onChangeType("list", { listType: "ordered", ordered: true });
              }
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              block.type === "list" && (block.attributes?.listType === "ordered" || block.attributes?.ordered)
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
            title="Numbered List (Ordered)"
          >
            <ListOrdered size={13} />
          </button>

          {/* WordPress Link Insertion Button */}
          <button
            type="button"
            data-action="link-btn"
            onClick={handleToggleLinkPopover}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              showLinkPopover ? "bg-indigo-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
            title="Insert / Edit Link (Ctrl+K)"
          >
            <LinkIcon size={13} />
          </button>

          <div className="w-px h-4 bg-white/10 mx-0.5" />
        </>
      )}

      {/* Alignment Controls */}
      {["paragraph", "heading", "image", "button"].includes(block.type) && (
        <>
          <button
            type="button"
            onClick={() => onChangeAttributes({ align: "left" })}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              block.attributes?.align === "left" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
            title="Align Left"
          >
            <AlignLeft size={13} />
          </button>
          <button
            type="button"
            onClick={() => onChangeAttributes({ align: "center" })}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              block.attributes?.align === "center" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
            title="Align Center"
          >
            <AlignCenter size={13} />
          </button>
          <button
            type="button"
            onClick={() => onChangeAttributes({ align: "right" })}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              block.attributes?.align === "right" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
            title="Align Right"
          >
            <AlignRight size={13} />
          </button>

          <div className="w-px h-4 bg-white/10 mx-0.5" />
        </>
      )}

      {/* WordPress More Options Menu (...) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowMoreMenu(!showMoreMenu);
            setShowTypeSwitcher(false);
            setShowHeadingMenu(false);
          }}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="More options (Options menu)"
        >
          <MoreVertical size={13} />
        </button>

        {showMoreMenu && (
          <div className="absolute right-0 top-full mt-1.5 z-50 bg-[#161626] border border-white/15 rounded-xl p-1.5 shadow-2xl min-w-[180px] font-['Outfit'] space-y-0.5">
            {onDuplicate && (
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onDuplicate();
                }}
                className="w-full px-2.5 py-1.5 text-xs text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Copy size={12} className="text-gray-400" /> Duplicate
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Ctrl+Shift+D</span>
              </button>
            )}

            {onInsertBefore && (
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onInsertBefore();
                }}
                className="w-full px-2.5 py-1.5 text-xs text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Plus size={12} className="text-gray-400" /> Insert Before
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Ctrl+Alt+T</span>
              </button>
            )}

            {onInsertAfter && (
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onInsertAfter();
                }}
                className="w-full px-2.5 py-1.5 text-xs text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Plus size={12} className="text-gray-400" /> Insert After
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Ctrl+Alt+Y</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyBlockHtml}
              className="w-full px-2.5 py-1.5 text-xs text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <CodeIcon size={12} className="text-gray-400" /> Copy Block HTML
              </span>
            </button>

            <div className="w-full h-px bg-white/10 my-1" />

            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onDelete();
                }}
                className="w-full px-2.5 py-1.5 text-xs text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Trash2 size={12} /> Delete Block
                </span>
                <span className="text-[10px] text-rose-400/60 font-mono">Shift+Alt+Z</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Copy Notification Toast */}
      {copiedNotification && (
        <div className="absolute -bottom-8 right-0 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-lg animate-in fade-in duration-200">
          HTML Copied!
        </div>
      )}

      {/* WordPress Floating Link Popover Box */}
      {showLinkPopover && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-[#12121f] border border-indigo-500/40 rounded-xl p-3 shadow-2xl w-80 font-['Outfit'] select-none">
          <form onSubmit={handleApplyLink} className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <LinkIcon size={14} /> WordPress Link Settings
              </span>
              <button
                type="button"
                onClick={() => setShowLinkPopover(false)}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Paste URL (https://... or /tools/pdf-to-image)..."
                className="w-full bg-[#080812] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500 font-mono"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-[11px] text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="rounded border-white/20 bg-[#080812] text-indigo-600 focus:ring-0 cursor-pointer"
                />
                Open in new tab
              </label>

              <div className="flex items-center gap-1.5">
                {linkUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLink}
                    className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    title="Remove Link"
                  >
                    <Unlink size={12} /> Unlink
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Apply
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
