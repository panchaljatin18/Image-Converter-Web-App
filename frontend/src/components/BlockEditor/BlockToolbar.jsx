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
} from "lucide-react";
import { BLOCK_DEFINITIONS } from "./utils/blockTypes";

export default function BlockToolbar({
  block,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onChangeType,
  onChangeAttributes,
}) {
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [savedRange, setSavedRange] = useState(null);
  const [savedSelectedText, setSavedSelectedText] = useState("");
  const [activeAnchor, setActiveAnchor] = useState(null);

  if (!block) return null;

  const currentDef = BLOCK_DEFINITIONS.find((b) => b.type === block.type);

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
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

  return (
    <div className="absolute -top-12 left-0 z-40 bg-[#161622] border border-indigo-500/40 rounded-xl p-1 shadow-2xl flex items-center gap-1 text-xs text-white backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none">
      {/* Drag Handle */}
      <div className="p-1.5 text-gray-400 hover:text-white cursor-grab active:cursor-grabbing" title="Drag to reorder">
        <GripVertical size={14} />
      </div>

      {/* Up / Down Arrows */}
      <button
        type="button"
        onClick={onMoveUp}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        title="Move Up"
      >
        <ChevronUp size={14} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        title="Move Down"
      >
        <ChevronDown size={14} />
      </button>

      <div className="w-px h-4 bg-white/10 mx-0.5" />

      {/* Block Information Badge (No Dropdown) */}
      <div className="bg-[#0c0c16] text-indigo-300 font-bold font-['Outfit'] border border-white/10 rounded-lg px-2.5 py-1 text-xs select-none flex items-center gap-1.5 shrink-0">
        <span>
          {block.type === "heading"
            ? `Heading ${block.attributes?.level || 2}`
            : block.type === "list"
            ? (block.attributes?.listType === "ordered" || block.attributes?.ordered)
              ? "Numbered List"
              : "Bullet List"
            : block.type === "custom-html"
            ? "Custom HTML"
            : currentDef ? currentDef.name : block.type}
        </span>
      </div>

      {/* HTML / Preview Tab Toggle for Custom HTML Block */}
      {block.type === "custom-html" && (
        <>
          <div className="flex items-center gap-1 bg-[#090912] p-0.5 rounded-lg border border-white/10 mx-1">
            <button
              type="button"
              onClick={() => onChangeAttributes({ mode: "html" })}
              className={`px-2.5 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                (block.attributes?.mode || "html") === "html"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => onChangeAttributes({ mode: "preview" })}
              className={`px-2.5 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                block.attributes?.mode === "preview"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Preview
            </button>
          </div>
        </>
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

          {/* Bullet List Button */}
          <button
            type="button"
            onClick={() => {
              if (block.type === "list") {
                const isCurrentBullet = block.attributes?.listType !== "ordered" && !block.attributes?.ordered;
                if (isCurrentBullet) {
                  // UNSELECT: Toggle back to Paragraph!
                  const paragraphContent = (block.attributes?.items || []).join("<br>");
                  onChangeType("paragraph", { content: paragraphContent });
                } else {
                  // Switch from Numbered to Bullet
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
                  // UNSELECT: Toggle back to Paragraph!
                  const paragraphContent = (block.attributes?.items || []).join("<br>");
                  onChangeType("paragraph", { content: paragraphContent });
                } else {
                  // Switch from Bullet to Numbered
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
