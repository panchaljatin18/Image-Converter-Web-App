import React, { useEffect, useRef } from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  AlignLeft,
  List,
  ListOrdered,
  Quote,
  Code,
  FileCode,
  Table,
  Image as ImageIcon,
  Sparkles,
  Minus,
} from "lucide-react";

export const SLASH_COMMANDS = [
  { id: "p", label: "Paragraph", desc: "Start writing with plain text", icon: <AlignLeft size={16} />, type: "paragraph", keywords: ["p", "paragraph", "text"] },
  { id: "h1", label: "Heading 1", desc: "Main section heading level 1", icon: <Heading1 size={16} />, type: "heading", extra: { level: 1 }, keywords: ["h1", "heading1", "title"] },
  { id: "h2", label: "Heading 2", desc: "Sub section heading level 2", icon: <Heading2 size={16} />, type: "heading", extra: { level: 2 }, keywords: ["h2", "heading2", "heading", "h"] },
  { id: "h3", label: "Heading 3", desc: "Subheading level 3", icon: <Heading3 size={16} />, type: "heading", extra: { level: 3 }, keywords: ["h3", "heading3", "subheading"] },
  { id: "h4", label: "Heading 4", desc: "Minor heading level 4", icon: <Heading4 size={16} />, type: "heading", extra: { level: 4 }, keywords: ["h4", "heading4"] },
  { id: "ul", label: "Bullet List", desc: "Unordered bullet point list", icon: <List size={16} />, type: "list", extra: { ordered: false }, keywords: ["ul", "list", "bullet", "points"] },
  { id: "ol", label: "Numbered List", desc: "Ordered numbered list", icon: <ListOrdered size={16} />, type: "list", extra: { ordered: true }, keywords: ["ol", "list", "numbered", "number"] },
  { id: "quote", label: "Quote Box", desc: "Highlight a quote or citation", icon: <Quote size={16} />, type: "quote", keywords: ["quote", "blockquote", "cite"] },
  { id: "code", label: "Code Snippet", desc: "Syntax-highlighted code block", icon: <Code size={16} />, type: "code", keywords: ["code", "snippet", "js", "python"] },
  { id: "html", label: "Custom HTML / FAQ Schema", desc: "Embed raw HTML code or FAQ schema", icon: <FileCode size={16} />, type: "html", keywords: ["html", "faq", "schema", "code"] },
  { id: "table", label: "Table Grid", desc: "Create structured data table", icon: <Table size={16} />, type: "table", keywords: ["table", "grid", "data"] },
  { id: "image", label: "Image / Media", desc: "Upload or select image media", icon: <ImageIcon size={16} />, type: "image", keywords: ["image", "media", "photo", "pic"] },
  { id: "divider", label: "Divider Line", desc: "Horizontal rule section separator", icon: <Minus size={16} />, type: "divider", keywords: ["divider", "hr", "line"] },
];

export default function SlashMenuPopover({
  query = "",
  position = { top: 0, left: 0 },
  onSelect,
  onClose,
  selectedIndex = 0,
  setSelectedIndex,
}) {
  const popoverRef = useRef(null);

  const filtered = SLASH_COMMANDS.filter((cmd) => {
    if (!query) return true;
    const q = query.toLowerCase().trim();
    return (
      cmd.id.startsWith(q) ||
      cmd.label.toLowerCase().includes(q) ||
      cmd.keywords.some((k) => k.startsWith(q))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, setSelectedIndex]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  if (filtered.length === 0) return null;

  return (
    <div
      ref={popoverRef}
      style={{ top: position.top + 28, left: position.left }}
      className="fixed z-50 bg-[#141424] border border-indigo-500/40 rounded-2xl p-2 shadow-2xl w-72 max-h-80 overflow-y-auto font-['Outfit'] select-none backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="px-2 py-1 mb-1 border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center justify-between">
        <span>WordPress Gutenberg Blocks</span>
        <span className="font-mono text-[#9494a3]">{filtered.length} found</span>
      </div>

      <div className="space-y-1">
        {filtered.map((cmd, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <div
              key={cmd.id}
              onClick={() => onSelect(cmd)}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-[#cbd5e1] hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected ? "bg-white/20 text-white" : "bg-indigo-500/15 text-indigo-300"
                }`}
              >
                {cmd.icon}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs leading-tight">{cmd.label}</span>
                <span
                  className={`text-[10px] truncate ${
                    isSelected ? "text-indigo-100" : "text-[#9494a3]"
                  }`}
                >
                  {cmd.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
