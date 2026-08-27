"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import BlockEditorContainer from "@/components/BlockEditor/BlockEditorContainer";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Heading2, 
  Heading3, 
  Heading4, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Trash, 
  Check, 
  AlertTriangle, 
  Eye, 
  Code, 
  ArrowLeft, 
  Loader2, 
  UploadCloud, 
  Minus,
  Image as ImageIcon,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Table,
  Sparkles,
  HelpCircle,
  FileText,
  RotateCcw,
  Clock,
  CheckCircle2,
  Trash2,
  FileCode
} from "lucide-react";
import Link from "next/link";

// Custom client-side HTML-to-Markdown parser for saving & code-mode sync
function htmlToMarkdown(html) {
  if (!html) return "";
  let md = html;
  
  // Protect raw script tags and custom HTML blocks from markdown conversion
  const protectedRawBlocks = [];
  md = md.replace(/<div[^>]*class="[^"]*wp-block-custom-html[^"]*"[^>]*>[\s\S]*?<textarea[^>]*>([\s\S]*?)<\/textarea>[\s\S]*?<\/div>/gi, (m, code) => {
    const unescapedCode = code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();
    protectedRawBlocks.push(unescapedCode);
    return `___PROTECTED_RAW_${protectedRawBlocks.length - 1}___`;
  });
  md = md.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, (m) => {
    protectedRawBlocks.push(m);
    return `___PROTECTED_RAW_${protectedRawBlocks.length - 1}___`;
  });
  md = md.replace(/<div class="(?:wp-custom-html-card|custom-html-block|wp-block-html|faq-container|faq-schema-block)"[^>]*>([\s\S]*?)<\/div>/gi, (m) => {
    protectedRawBlocks.push(m);
    return `___PROTECTED_RAW_${protectedRawBlocks.length - 1}___`;
  });
  md = md.replace(/<details[^>]*>[\s\S]*?<\/details>/gi, (m) => {
    protectedRawBlocks.push(m);
    return `___PROTECTED_RAW_${protectedRawBlocks.length - 1}___`;
  });

  // Replace inline body images / figures
  md = md.replace(/<figure[^>]*>\s*<img[^>]*src="(.*?)"[^>]*alt="(.*?)"[^>]*>\s*(?:<figcaption[^>]*>(.*?)<\/figcaption>)?\s*<\/figure>/gi, (m, src, alt, cap) => {
    return `\n\n![${cap || alt || "Image"}](${src})\n\n`;
  });
  md = md.replace(/<img[^>]*src="(.*?)"[^>]*alt="(.*?)"[^>]*\/?>/gi, (m, src, alt) => {
    return `\n\n![${alt || "Image"}](${src})\n\n`;
  });

  // Callout Box (<div class="callout-box">...</div>)
  md = md.replace(/<div class="callout-box"[^>]*>([\s\S]*?)<\/div>/gi, (m, text) => {
    const cleanText = text.replace(/<span[^>]*>.*?<\/span>/gi, "").replace(/<br\s*\/?>/gi, " ").trim();
    return `\n\n> 💡 ${cleanText}\n\n`;
  });

  // Blockquote
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (m, text) => {
    const cleanText = text.replace(/<br\s*\/?>/gi, "\n> ").trim();
    return `\n\n> ${cleanText}\n\n`;
  });

  // Code Block (<pre><code>...</code></pre>)
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (m, code) => {
    return `\n\n\`\`\`\n${code}\n\`\`\`\n\n`;
  });

  // Bold
  md = md.replace(/<strong>(.*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b>(.*?)<\/b>/gi, "**$1**");
  
  // Italic
  md = md.replace(/<em>(.*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i>(.*?)<\/i>/gi, "*$1*");

  // Strikethrough
  md = md.replace(/<del[^>]*>(.*?)<\/del>/gi, "~~$1~~");
  md = md.replace(/<s[^>]*>(.*?)<\/s>/gi, "~~$1~~");

  // Highlight
  md = md.replace(/<mark[^>]*>(.*?)<\/mark>/gi, "==$1==");

  // Monospace inline
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  
  // Headings
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n\n#### $1\n\n");
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n\n### $1\n\n");
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n\n## $1\n\n");
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n\n# $1\n\n");
  
  // Ordered lists (<ol> ... </ol>)
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, olContent) => {
    let index = 1;
    const items = [];
    olContent.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (liMatch, liText) => {
      const clean = liText.trim();
      if (clean) items.push(`${index++}. ${clean}`);
    });
    return "\n\n" + items.join("\n") + "\n\n";
  });

  // Unordered lists (<ul> ... </ul>)
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, ulContent) => {
    const items = [];
    ulContent.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (liMatch, liText) => {
      const clean = liText.trim();
      if (clean) items.push(`- ${clean}`);
    });
    return "\n\n" + items.join("\n") + "\n\n";
  });
  
  // Paragraphs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, "\n\n$1\n\n");
  
  // Links
  md = md.replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  
  // Horizontal rules
  md = md.replace(/<hr[^>]*>/gi, "\n\n---\n\n");

  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, "\n");
  
  // Clean up multiple newlines
  md = md.replace(/\n\n+/g, "\n\n");

  // Restore protected raw blocks
  md = md.replace(/___PROTECTED_RAW_(\d+)___/g, (match, p1) => {
    const idx = parseInt(p1, 10);
    return `\n\n${protectedRawBlocks[idx]}\n\n`;
  });
  
  return md.trim();
}

// Real-time client-side HTML and JSON-LD syntax validator & linter for Blog Editor
function validateHtmlSnippet(html) {
  if (!html || !html.trim()) {
    return { isValid: true, errors: [], warnings: [] };
  }

  const errors = [];
  const warnings = [];

  const VOID_TAGS = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr"
  ]);

  // 1. Validate JSON-LD script syntax
  const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    const attrs = scriptMatch[1];
    const content = scriptMatch[2];
    if (attrs.includes('type="application/ld+json"') || attrs.includes("application/ld+json")) {
      try {
        JSON.parse(content.trim());
      } catch (err) {
        errors.push(`JSON-LD Schema Error: Invalid JSON syntax inside <script> tag (${err.message})`);
      }
    }
  }

  // 2. Check for tag stack balancing (unclosed or mismatched tags)
  const tagRegex = /<!--[\s\S]*?-->|<(\/)?([a-zA-Z0-9-]+)([^>]*)>/gi;
  const stack = [];
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const fullMatch = match[0];
    const isClosing = Boolean(match[1]);
    const tagName = match[2] ? match[2].toLowerCase() : "";
    const isSelfClosing = fullMatch.endsWith("/>") || VOID_TAGS.has(tagName);

    if (fullMatch.startsWith("<!--") || !tagName) continue;
    if (VOID_TAGS.has(tagName) || isSelfClosing) continue;

    if (!isClosing) {
      stack.push({ name: tagName, raw: fullMatch });
    } else {
      const stackIndex = stack.map((item) => item.name).lastIndexOf(tagName);
      if (stackIndex !== -1) {
        if (stackIndex !== stack.length - 1) {
          const unclosedNames = stack.slice(stackIndex + 1).map((item) => `<${item.name}>`).join(", ");
          warnings.push(`Tag Mismatch: </${tagName}> closed while ${unclosedNames} were still open.`);
        }
        stack.length = stackIndex;
      } else {
        errors.push(`Orphan Closing Tag: </${tagName}> has no matching opening <${tagName}>.`);
      }
    }
  }

  if (stack.length > 0) {
    const openTagsList = stack.map((item) => `<${item.name}>`).join(", ");
    errors.push(`Unclosed HTML Tag(s): ${openTagsList} missing matching closing tag.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Custom client-side Markdown-to-HTML parser for loading into Visual Editor
function markdownToHtml(md) {
  if (!md) return "";
  let html = md.replace(/\r\n/g, "\n");

  // Extract and protect raw HTML & Script blocks (e.g. JSON-LD FAQ Schema, custom HTML blocks, details)
  const rawHtmlBlocks = [];

  const createWpBlockCard = (codeText) => {
    const escapedText = codeText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const blockId = "wp_html_" + Math.random().toString(36).substring(2, 9);
    const valResult = validateHtmlSnippet(codeText);
    const initialStatusHtml = valResult.isValid
      ? `<div class="wp-block-validation-status mt-2 p-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2"><span>✅ HTML Syntax Valid</span></div>`
      : `<div class="wp-block-validation-status mt-2 p-2.5 px-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2"><span class="text-rose-400 shrink-0 font-bold">⚠️ HTML Mistake:</span><span>${valResult.errors.join("; ")}</span></div>`;

    return `<div id="${blockId}" class="wp-block-custom-html my-6 rounded-2xl border border-indigo-500/30 bg-[#0d0d18] overflow-hidden shadow-2xl" contenteditable="false" data-wp-block="true">
  <div class="wp-block-header flex items-center justify-between px-4 py-2.5 bg-[#141424] border-b border-indigo-500/20 font-['Outfit'] select-none">
    <div class="flex items-center gap-2 text-xs font-bold text-indigo-300">
      <span>&lt;/&gt; Custom HTML / FAQ Schema Block</span>
    </div>
    <div class="flex items-center gap-1.5 bg-[#090912] p-1 rounded-lg border border-white/5">
      <button type="button" data-tab-btn="html" class="wp-block-tab-btn active px-3 py-1 text-xs font-bold rounded-md bg-indigo-600 text-white shadow-sm transition-all cursor-pointer">HTML</button>
      <button type="button" data-tab-btn="preview" class="wp-block-tab-btn px-3 py-1 text-xs font-bold rounded-md text-[#9494a3] hover:text-white transition-all cursor-pointer">Preview</button>
    </div>
  </div>
  <div class="wp-block-editor-pane p-4">
    <textarea class="wp-block-textarea w-full bg-[#090912] border border-white/10 rounded-xl p-3 text-xs font-mono text-cyan-300 outline-none focus:border-indigo-500 transition-colors leading-relaxed" rows="7" placeholder="Paste or write HTML code or FAQ schema here...">${escapedText}</textarea>
    ${initialStatusHtml}
  </div>
  <div class="wp-block-preview-pane p-4 hidden">
    <div class="wp-block-preview-content text-left text-white text-sm"></div>
  </div>
</div>`;
  };

  // 1. Script tags (including <script type="application/ld+json">)
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, (match) => {
    rawHtmlBlocks.push(createWpBlockCard(match));
    return `\n\n___RAW_HTML_BLOCK_${rawHtmlBlocks.length - 1}___\n\n`;
  });

  // 2. Custom HTML wrapper divs
  html = html.replace(/<div class="(?:custom-html-block|wp-custom-html-card|wp-block-html|faq-container)[^>]*">[\s\S]*?<\/div>/gi, (match) => {
    rawHtmlBlocks.push(createWpBlockCard(match));
    return `\n\n___RAW_HTML_BLOCK_${rawHtmlBlocks.length - 1}___\n\n`;
  });

  // 3. HTML details / accordions
  html = html.replace(/<details[^>]*>[\s\S]*?<\/details>/gi, (match) => {
    rawHtmlBlocks.push(createWpBlockCard(match));
    return `\n\n___RAW_HTML_BLOCK_${rawHtmlBlocks.length - 1}___\n\n`;
  });

  // Fenced Code blocks
  html = html.replace(/```(?:\w+)?\n([\s\S]*?)```/g, (match, code) => {
    const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre><code>${escaped}</code></pre>`;
  });

  // Inline images ![alt](url)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");

  // Highlight
  html = html.replace(/==(.*?)==/g, "<mark>$1</mark>");

  // Monospace inline
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  const lines = html.split(/\n\n+/);
  const processed = [];
  let insideList = false;

  for (let block of lines) {
    block = block.trim();
    if (!block) continue;

    // Check for protected raw HTML block placeholder
    if (/^___RAW_HTML_BLOCK_\d+___$/.test(block)) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      const idx = parseInt(block.replace("___RAW_HTML_BLOCK_", "").replace("___", ""), 10);
      if (!isNaN(idx) && rawHtmlBlocks[idx] !== undefined) {
        processed.push(rawHtmlBlocks[idx]);
      }
      continue;
    }

    // Pass through un-wrapped raw HTML / script blocks if block starts with tag
    if (
      block.startsWith("<script") ||
      block.startsWith("<iframe") ||
      block.startsWith("<style") ||
      block.startsWith("<details") ||
      block.startsWith("<div") ||
      block.startsWith("<table") ||
      block.startsWith("<!--")
    ) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push(block);
      continue;
    }

    if (block.startsWith("<pre") || block.startsWith("<img")) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push(block);
    } else if (block.startsWith("> 💡") || block.startsWith("> [!NOTE]") || block.startsWith("> 📌")) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      const clean = block.replace(/^>\s*(\[!(NOTE|TIP|IMPORTANT)\]|💡|📌)?\s*/g, "");
      processed.push(`<div class="callout-box"><span>💡</span><div>${clean}</div></div>`);
    } else if (block.startsWith("> ")) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      const clean = block.replace(/^>\s*/gm, "");
      processed.push(`<blockquote>${clean}</blockquote>`);
    } else if (block.startsWith("#### ")) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push(`<h4>${block.slice(5)}</h4>`);
    } else if (block.startsWith("### ")) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push(`<h3>${block.slice(4)}</h3>`);
    } else if (block.startsWith("## ")) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push(`<h2>${block.slice(3)}</h2>`);
    } else if (block.startsWith("# ")) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push(`<h1>${block.slice(2)}</h1>`);
    } else if (block.startsWith("- ") || block.startsWith("* ")) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      const listLines = block.split("\n");
      const liElements = [];
      listLines.forEach(line => {
        const cleanLine = line.trim();
        if (cleanLine.startsWith("- ") || cleanLine.startsWith("* ")) {
          const itemText = cleanLine.substring(2).trim();
          if (itemText) liElements.push(`<li>${itemText}</li>`);
        } else if (cleanLine) {
          liElements.push(`<li>${cleanLine}</li>`);
        }
      });
      processed.push(`<ul>\n${liElements.join("\n")}\n</ul>`);
      continue;
    } else if (/^\d+\.\s/.test(block)) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      const listLines = block.split("\n");
      const liElements = [];
      listLines.forEach(line => {
        const cleanLine = line.trim();
        if (/^\d+\.\s/.test(cleanLine)) {
          const itemText = cleanLine.replace(/^\d+\.\s/, "").trim();
          if (itemText) liElements.push(`<li>${itemText}</li>`);
        } else if (cleanLine) {
          liElements.push(`<li>${cleanLine}</li>`);
        }
      });
      processed.push(`<ol>\n${liElements.join("\n")}\n</ol>`);
      continue;
    } else if (block === "---") {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push("<hr />");
    } else {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push(`<p>${block.replace(/\n/g, "<br />")}</p>`);
    }
  }

  if (insideList) processed.push(`</${insideList}>`);
  return processed.join("\n");
}

const VisualEditorContainer = React.memo(({ initialHtml, editorRef, onContentChange, onKeyDown, onClick, onSelect }) => {
  const isLoadedRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const isFocused = typeof document !== "undefined" && document.activeElement === editorRef.current;
      if (!isFocused && (isLoadedRef.current === null || isLoadedRef.current !== initialHtml)) {
        if (editorRef.current.innerHTML !== (initialHtml || "")) {
          editorRef.current.innerHTML = initialHtml || "";
        }
        isLoadedRef.current = initialHtml;
      }
    }
  }, [initialHtml, editorRef]);

  return (
    <div
      ref={editorRef}
      className="editor-content-area text-left"
      contentEditable
      suppressContentEditableWarning
      onInput={onContentChange}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onMouseUp={onSelect}
      onKeyUp={onSelect}
    />
  );
});

VisualEditorContainer.displayName = "VisualEditorContainer";

export default function BlogEditor({ initialSlug = null }) {
  const router = useRouter();
  const editorRef = useRef(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("Convert Galaxy Team");
  const [status, setStatus] = useState("Draft");

  // Inline Link flow states
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [savedRange, setSavedRange] = useState(null);

  // Floating WordPress Selection Toolbar States (on text highlight)
  const [showSelectionToolbar, setShowSelectionToolbar] = useState(false);
  const [selectionToolbarPos, setSelectionToolbarPos] = useState({ top: 0, left: 0 });
  const [isInlineLinkInputOpen, setIsInlineLinkInputOpen] = useState(false);
  const [inlineLinkUrl, setInlineLinkUrl] = useState("");

  const handleSelectionChange = () => {
    if (editorMode !== "visual") return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !editorRef.current) {
      if (!isInlineLinkInputOpen) {
        setShowSelectionToolbar(false);
      }
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      setShowSelectionToolbar(false);
      return;
    }

    setSavedRange(range);

    const rect = range.getBoundingClientRect();
    const containerRect = editorRef.current.getBoundingClientRect();

    const top = Math.max(10, rect.top - containerRect.top - 50);
    const left = Math.max(10, Math.min(containerRect.width - 340, rect.left - containerRect.left + (rect.width / 2) - 170));

    setSelectionToolbarPos({ top, left });
    setShowSelectionToolbar(true);
  };

  const applyInlineSelectionLink = (urlToApply) => {
    if (savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }

    if (urlToApply && urlToApply.trim()) {
      let finalUrl = urlToApply.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith("/") && !finalUrl.startsWith("#")) {
        finalUrl = "https://" + finalUrl;
      }
      document.execCommand("createLink", false, finalUrl);
    }

    setInlineLinkUrl("");
    setIsInlineLinkInputOpen(false);
    setShowSelectionToolbar(false);
    handleEditorInput();
  };

  // Floating WordPress Link Popover States
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [selectedLinkElement, setSelectedLinkElement] = useState(null);
  const [linkPopoverPos, setLinkPopoverPos] = useState({ top: 0, left: 0 });
  const [isEditingLinkPopover, setIsEditingLinkPopover] = useState(false);

  const handleInlineImageFileChange = async (fileInput) => {
    const file = fileInput.files?.[0];
    if (!file) return;

    const blockCard = fileInput.closest(".wp-block-image-card");
    if (!blockCard) return;

    blockCard.innerHTML = `<div class="p-8 text-center text-indigo-300 font-bold text-xs font-['Outfit'] flex items-center justify-center gap-3 bg-[#090912] rounded-2xl border border-indigo-500/30">
      <span class="animate-spin text-lg">⏳</span>
      <span>Uploading image file directly into article flow...</span>
    </div>`;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        const altText = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        const figureHtml = `<figure class="wp-inline-image-figure my-6 text-center font-['Outfit']" contenteditable="false"><div class="wp-image-wrapper relative inline-block rounded-2xl overflow-hidden border border-white/10 shadow-2xl"><img src="${data.url}" alt="${altText}" class="max-w-full h-auto rounded-2xl block mx-auto" /></div><figcaption contenteditable="true" class="text-xs text-gray-400 mt-2 italic outline-none">${altText}</figcaption></figure><p><br></p>`;
        blockCard.outerHTML = figureHtml;
        handleEditorInput();
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    }
  };

  const handleInlineImageUrlSubmit = (urlInput) => {
    const url = urlInput.value.trim();
    if (!url) return;

    const blockCard = urlInput.closest(".wp-block-image-card");
    if (!blockCard) return;

    const figureHtml = `<figure class="wp-inline-image-figure my-6 text-center font-['Outfit']" contenteditable="false"><div class="wp-image-wrapper relative inline-block rounded-2xl overflow-hidden border border-white/10 shadow-2xl"><img src="${url}" alt="Article Image" class="max-w-full h-auto rounded-2xl block mx-auto" /></div><figcaption contenteditable="true" class="text-xs text-gray-400 mt-2 italic outline-none">Add image caption...</figcaption></figure><p><br></p>`;
    blockCard.outerHTML = figureHtml;
    handleEditorInput();
  };

  const handleEditorClick = (e) => {
    // Handle inline image file selection
    const fileInput = e.target.closest("input[data-wp-image-input='file']");
    if (fileInput) {
      fileInput.onchange = () => handleInlineImageFileChange(fileInput);
    }

    // Handle inline image URL keydown
    const urlInput = e.target.closest("input[data-wp-image-input='url']");
    if (urlInput) {
      urlInput.onkeydown = (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          handleInlineImageUrlSubmit(urlInput);
        }
      };
    }

    // Handle WordPress Custom HTML block tab switching (HTML vs Preview)
    const tabBtn = e.target.closest("button[data-tab-btn]");
    if (tabBtn && editorRef.current?.contains(tabBtn)) {
      e.preventDefault();
      e.stopPropagation();

      const blockCard = tabBtn.closest(".wp-block-custom-html");
      if (blockCard) {
        const tabType = tabBtn.getAttribute("data-tab-btn");
        const allTabBtns = blockCard.querySelectorAll("button[data-tab-btn]");
        const editorPane = blockCard.querySelector(".wp-block-editor-pane");
        const previewPane = blockCard.querySelector(".wp-block-preview-pane");
        const previewContent = blockCard.querySelector(".wp-block-preview-content");
        const textarea = blockCard.querySelector("textarea.wp-block-textarea");

        allTabBtns.forEach(btn => {
          if (btn === tabBtn) {
            btn.classList.add("active", "bg-indigo-600", "text-white", "shadow-sm");
            btn.classList.remove("text-[#9494a3]");
          } else {
            btn.classList.remove("active", "bg-indigo-600", "text-white", "shadow-sm");
            btn.classList.add("text-[#9494a3]");
          }
        });

        if (tabType === "html") {
          editorPane?.classList.remove("hidden");
          previewPane?.classList.add("hidden");
        } else if (tabType === "preview") {
          const rawCode = textarea?.value || "";
          const valResult = validateHtmlSnippet(rawCode);
          const errorNotice = valResult.isValid ? "" : `
            <div style="padding:10px 12px;margin-bottom:12px;background:rgba(244,63,94,0.15);border:1px solid rgba(244,63,94,0.4);border-radius:10px;color:#fda4af;font-family:sans-serif;font-size:0.75rem;">
              <strong style="color:#ffffff;display:block;margin-bottom:2px;">⚠️ HTML Code Mistake Detected:</strong>
              <span>${valResult.errors.join("; ")}</span>
            </div>`;

          if (previewContent) {
            if (rawCode.includes('type="application/ld+json"')) {
              previewContent.innerHTML = errorNotice + `
                <div style="padding:12px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:12px;color:#fcd34d;font-family:monospace;font-size:0.75rem;">
                  <strong style="color:#ffffff;display:block;margin-bottom:4px;">⚡ Valid JSON-LD FAQ Schema Tag Active</strong>
                  <span>Google Search engines will process this structured data automatically for search FAQ snippets.</span>
                </div>
              `;
            } else {
              previewContent.innerHTML = errorNotice + rawCode;
            }
          }
          editorPane?.classList.add("hidden");
          previewPane?.classList.remove("hidden");
        }
      }
      return;
    }

    const targetLink = e.target.closest("a");
    if (targetLink && editorRef.current?.contains(targetLink)) {
      e.preventDefault();
      const href = targetLink.getAttribute("href") || "";
      setSelectedLinkElement(targetLink);
      setLinkUrl(href);
      setIsEditingLinkPopover(false);

      const rect = targetLink.getBoundingClientRect();
      const containerRect = editorRef.current.getBoundingClientRect();

      setLinkPopoverPos({
        top: rect.bottom - containerRect.top + 8,
        left: Math.max(10, rect.left - containerRect.left),
      });
      setShowLinkPopover(true);
    } else {
      setShowLinkPopover(false);
      setSelectedLinkElement(null);
      setIsEditingLinkPopover(false);
    }
  };

  const handleRemoveLink = () => {
    if (selectedLinkElement) {
      const parent = selectedLinkElement.parentNode;
      while (selectedLinkElement.firstChild) {
        parent.insertBefore(selectedLinkElement.firstChild, selectedLinkElement);
      }
      parent.removeChild(selectedLinkElement);
      setShowLinkPopover(false);
      setSelectedLinkElement(null);
      setIsEditingLinkPopover(false);
      handleEditorInput();
    }
  };

  const handleUpdateLinkUrl = (newUrl) => {
    if (selectedLinkElement && newUrl.trim()) {
      let finalUrl = newUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith("/") && !finalUrl.startsWith("#")) {
        finalUrl = "https://" + finalUrl;
      }
      selectedLinkElement.setAttribute("href", finalUrl);
      setShowLinkPopover(false);
      setSelectedLinkElement(null);
      setIsEditingLinkPopover(false);
      handleEditorInput();
    }
  };

  // Inline Media (Body Image) insertion flow states
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [bodyImageUrl, setBodyImageUrl] = useState("");
  const [bodyImageAlt, setBodyImageAlt] = useState("");
  const [uploadingBodyImage, setUploadingBodyImage] = useState(false);
  const bodyFileInputRef = useRef(null);

  // Cover image title & preview persist states
  const [imageTitle, setImageTitle] = useState("");
  const [uploadedImageSrc, setUploadedImageSrc] = useState("");

  // Visual Aspect Ratio 16:9 Image Cropper States
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [cropScale, setCropScale] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const cropImgRef = useRef(null);

  // WordPress Style Table Builder Modal States
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHasHeader, setTableHasHeader] = useState(true);

  // WordPress Custom HTML & FAQ Schema Builder Modal States
  const [showCustomHtmlModal, setShowCustomHtmlModal] = useState(false);
  const [customHtmlCode, setCustomHtmlCode] = useState("");
  const [customHtmlTab, setCustomHtmlTab] = useState("faq-json");
  const [customHtmlPreview, setCustomHtmlPreview] = useState(false);

  // WordPress "/" Slash Command Inserter States
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);

  const allSlashCommands = [
    { id: "ul", label: "Bullet List", desc: "Unordered list of items", icon: "•", type: "list-ul", keywords: ["l", "list", "bullet", "ul"] },
    { id: "ol", label: "Numbered List", desc: "Ordered numbered list", icon: "1.", type: "list-ol", keywords: ["l", "list", "numbered", "ol", "number"] },
    { id: "h1", label: "Heading 1", desc: "Main heading level 1", icon: "H1", type: "heading1", keywords: ["h1", "heading1", "title", "heading", "h"] },
    { id: "h2", label: "Heading 2", desc: "Section heading level 2", icon: "H2", type: "heading2", keywords: ["h2", "heading2", "title", "heading", "h"] },
    { id: "h3", label: "Heading 3", desc: "Subheading level 3", icon: "H3", type: "heading3", keywords: ["h3", "subheading", "subtitle", "heading", "h"] },
    { id: "h4", label: "Heading 4", desc: "Minor heading level 4", icon: "H4", type: "heading4", keywords: ["h4", "subheading", "heading", "h"] },
    { id: "html", label: "Custom HTML / FAQ Schema", desc: "Embed raw HTML or Google FAQ Schema JSON-LD", icon: "</>", type: "html", keywords: ["html", "faq", "schema", "code", "accordion"] },
    { id: "table", label: "Table", desc: "Create structured grid table", icon: "📊", type: "table", keywords: ["table", "grid", "data", "rows"] },
    { id: "callout", label: "Pro Tip / Callout Box", desc: "Highlighted tip card with icon", icon: "💡", type: "callout", keywords: ["callout", "tip", "box", "note", "alert", "pro"] },
    { id: "code", label: "Code Snippet", desc: "Display formatted code snippet", icon: "💻", type: "code", keywords: ["code", "snippet", "js", "python", "pre"] },
    { id: "image", label: "Image / Media", desc: "Upload or select images", icon: "🖼️", type: "image", keywords: ["image", "media", "photo", "pic", "upload"] },
    { id: "quote", label: "Blockquote", desc: "Quote callout text", icon: "💬", type: "quote", keywords: ["quote", "blockquote", "cite"] },
    { id: "divider", label: "Divider Line", desc: "Horizontal separator rule", icon: "➖", type: "divider", keywords: ["divider", "hr", "line", "rule", "separator"] },
  ];

  const filteredSlashCommands = useMemo(() => {
    if (!slashQuery) return allSlashCommands;
    const q = slashQuery.toLowerCase().trim();

    return [...allSlashCommands]
      .map((cmd) => {
        let score = 0;

        // Exact match on id or keyword (e.g. "l" matches "l" keyword in Bullet List & Numbered List)
        if (cmd.id === q || cmd.keywords.includes(q)) {
          score += 1000;
        }

        // Prefix match on ID, label, label words or keywords
        if (cmd.id.startsWith(q)) score += 500;
        if (cmd.label.toLowerCase().startsWith(q)) score += 400;

        const labelWords = cmd.label.toLowerCase().split(/\s+/);
        if (labelWords.some((w) => w.startsWith(q))) score += 300;

        if (cmd.keywords.some((k) => k.startsWith(q))) score += 200;

        // Substring match on label or keywords
        if (cmd.label.toLowerCase().includes(q)) score += 50;
        if (cmd.keywords.some((k) => k.includes(q))) score += 20;

        return { cmd, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.cmd);
  }, [slashQuery]);

  const handleInsertCustomHtml = () => {
    if (!customHtmlCode.trim()) return;
    editorRef.current?.focus();
    const isScript = customHtmlCode.includes('type="application/ld+json"');

    let blockHtml = "";

    if (isScript) {
      let faqItems = [];
      try {
        const jsonMatch = customHtmlCode.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        const jsonText = jsonMatch ? jsonMatch[1] : customHtmlCode;
        const parsed = JSON.parse(jsonText.trim());
        if (parsed.mainEntity && Array.isArray(parsed.mainEntity)) {
          faqItems = parsed.mainEntity.map((item) => ({
            q: item.name || item.question || "",
            a: item.acceptedAnswer?.text || item.answer || ""
          }));
        }
      } catch (e) {
        console.warn("Could not parse FAQ JSON preview:", e);
      }

      const previewList = faqItems.length > 0
        ? faqItems.map((item) => `<div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.05);"><strong style="color:#fbbf24;">Q: ${item.q}</strong><br/><span style="color:#cbd5e1;font-size:0.85rem;">A: ${item.a}</span></div>`).join("")
        : `<div style="font-size:0.85rem;color:#cbd5e1;">Structured FAQ Schema JSON-LD script active for Google Search engines.</div>`;

      blockHtml = `<div class="faq-schema-block" style="background:#0d0d18;border:1px solid rgba(245,158,11,0.4);border-radius:14px;padding:16px;margin:24px 0;box-shadow:0 8px 24px rgba(0,0,0,0.4);" data-raw-schema="true">
  <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(245,158,11,0.25);padding-bottom:8px;margin-bottom:12px;color:#fbbf24;font-weight:700;font-size:0.85rem;font-family:'Outfit',sans-serif;">
    <span>⚡ FAQ Schema (JSON-LD) - Active for Google Search</span>
    <span style="font-size:0.7rem;background:rgba(245,158,11,0.2);padding:2px 8px;border-radius:20px;color:#fbbf24;">SEO Schema</span>
  </div>
  <div style="font-size:0.85rem;color:#e2e8f0;font-family:'Outfit',sans-serif;">
    ${previewList}
  </div>
  ${customHtmlCode.trim()}
</div><p><br></p>`;
    } else {
      blockHtml = `${customHtmlCode.trim()}<p><br></p>`;
    }

    document.execCommand("insertHTML", false, blockHtml);
    setShowCustomHtmlModal(false);
    setCustomHtmlCode("");
    handleEditorInput();
  };

  const handlePrefillFaqJson = () => {
    setCustomHtmlTab("faq-json");
    setCustomHtmlCode(`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "What is Converter Galaxy?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Converter Galaxy is a free online platform providing tools to convert, compress, and resize images locally in your browser."\n      }\n    },\n    {\n      "@type": "Question",\n      "name": "Is my data private and secure?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Yes, 100% of processing occurs locally on your machine. No files are uploaded to remote servers."\n      }\n    }\n  ]\n}\n</script>`);
  };

  const handlePrefillFaqAccordion = () => {
    setCustomHtmlTab("custom-html");
    setCustomHtmlCode(`<div class="faq-container my-8 space-y-4">\n  <details class="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 cursor-pointer text-indigo-200">\n    <summary class="font-bold text-white text-base font-['Outfit']">What image formats are supported?</summary>\n    <p class="mt-2 text-sm text-[#cbd5e1] leading-relaxed">We support JPG, PNG, WebP, GIF, SVG, AVIF, TIFF, and PDF.</p>\n  </details>\n  <details class="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 cursor-pointer text-indigo-200">\n    <summary class="font-bold text-white text-base font-['Outfit']">Are there any file size limits?</summary>\n    <p class="mt-2 text-sm text-[#cbd5e1] leading-relaxed">No strict server limits because processing happens in your browser!</p>\n  </details>\n</div>`);
  };

  const handlePrefillCodeSnippet = () => {
    setCustomHtmlTab("code-snippet");
    setCustomHtmlCode(`<pre><code class="language-javascript">// Paste or write your code snippet here\nfunction example() {\n  console.log("Hello from ConvertGalaxy!");\n}</code></pre>`);
  };
  
  // Editor mode: "visual" or "code" (markdown)
  const [editorMode, setEditorMode] = useState("visual");
  const [markdownContent, setMarkdownContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [initialHtmlContent, setInitialHtmlContent] = useState("");

  // Live HTML & Schema Validation States
  const customHtmlModalValidation = useMemo(() => {
    return validateHtmlSnippet(customHtmlCode);
  }, [customHtmlCode]);

  const articleHtmlValidation = useMemo(() => {
    const codeToValidate = editorMode === "visual" ? htmlContent : markdownContent;
    return validateHtmlSnippet(codeToValidate);
  }, [htmlContent, markdownContent, editorMode]);

  // Live Stats State
  const [stats, setStats] = useState({ words: 0, chars: 0, readTime: 1 });

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Auto-dismiss error and success toasts after 4 seconds
  useEffect(() => {
    if (!errorMsg) return;
    const t = setTimeout(() => setErrorMsg(""), 4000);
    return () => clearTimeout(t);
  }, [errorMsg]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 4000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const fileInputRef = useRef(null);

  // Calculate live stats (word count, char count, reading time)
  const calculateStats = (text) => {
    if (!text) {
      setStats({ words: 0, chars: 0, readTime: 1 });
      return;
    }
    const cleanText = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const words = cleanText ? cleanText.split(/\s+/).length : 0;
    const chars = cleanText.length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    setStats({ words, chars, readTime });
  };

  // LocalStorage draft key and auto-persistence logic
  const DRAFT_KEY = initialSlug ? `blog_editor_draft_${initialSlug}` : "blog_editor_draft_new";
  const [draftNotice, setDraftNotice] = useState("");
  const [availableDraft, setAvailableDraft] = useState(null);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState("");

  const saveDraftToLocalStorage = (overrideData = {}) => {
    if (typeof window === "undefined") return;
    try {
      const currentHtml = editorRef.current ? editorRef.current.innerHTML : htmlContent;
      const currentMd = editorMode === "visual" ? htmlToMarkdown(currentHtml) : markdownContent;
      const now = Date.now();
      const draftData = {
        title: overrideData.title !== undefined ? overrideData.title : title,
        slug: overrideData.slug !== undefined ? overrideData.slug : slug,
        description: overrideData.description !== undefined ? overrideData.description : description,
        focusKeyword: overrideData.focusKeyword !== undefined ? overrideData.focusKeyword : focusKeyword,
        tags: overrideData.tags !== undefined ? overrideData.tags : tags,
        coverImage: overrideData.coverImage !== undefined ? overrideData.coverImage : coverImage,
        imageAlt: overrideData.imageAlt !== undefined ? overrideData.imageAlt : imageAlt,
        imageTitle: overrideData.imageTitle !== undefined ? overrideData.imageTitle : imageTitle,
        date: overrideData.date !== undefined ? overrideData.date : date,
        author: overrideData.author !== undefined ? overrideData.author : author,
        status: overrideData.status !== undefined ? overrideData.status : status,
        markdownContent: overrideData.markdownContent !== undefined ? overrideData.markdownContent : currentMd,
        htmlContent: overrideData.htmlContent !== undefined ? overrideData.htmlContent : currentHtml,
        content_blocks: overrideData.content_blocks !== undefined ? overrideData.content_blocks : initialBlocks,
        editorMode: overrideData.editorMode !== undefined ? overrideData.editorMode : editorMode,
        timestamp: now,
      };
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      const timeStr = new Date(now).toLocaleTimeString();
      setLastAutoSaveTime(timeStr);
    } catch (e) {
      console.warn("Failed to save draft to localStorage:", e);
    }
  };

  const handleRestoreDraft = (draftToRestore = null) => {
    const targetDraft = draftToRestore || availableDraft;
    if (!targetDraft) return;

    if (targetDraft.title !== undefined) setTitle(targetDraft.title);
    if (!initialSlug && targetDraft.slug !== undefined) setSlug(targetDraft.slug);
    if (targetDraft.description !== undefined) setDescription(targetDraft.description);
    if (targetDraft.focusKeyword !== undefined) setFocusKeyword(targetDraft.focusKeyword);
    if (targetDraft.tags !== undefined) setTags(targetDraft.tags);
    if (targetDraft.coverImage !== undefined) {
      setCoverImage(targetDraft.coverImage);
      setUploadedImageSrc(targetDraft.coverImage);
    }
    if (targetDraft.imageAlt !== undefined) setImageAlt(targetDraft.imageAlt);
    if (targetDraft.imageTitle !== undefined) setImageTitle(targetDraft.imageTitle);
    if (targetDraft.date !== undefined) setDate(targetDraft.date);
    if (targetDraft.author !== undefined) setAuthor(targetDraft.author);
    if (targetDraft.status !== undefined) setStatus(targetDraft.status);

    const activeMd = targetDraft.markdownContent || "";
    setMarkdownContent(activeMd);
    const activeHtml = targetDraft.htmlContent || markdownToHtml(activeMd);
    setHtmlContent(activeHtml);
    setInitialHtmlContent(activeHtml);
    if (targetDraft.editorMode) setEditorMode(targetDraft.editorMode);
    calculateStats(activeMd);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = activeHtml;
      }
    }, 0);

    const savedTimeString = targetDraft.timestamp
      ? new Date(targetDraft.timestamp).toLocaleTimeString()
      : "";
    setDraftNotice(`Restored unsaved draft${savedTimeString ? ` auto-saved at ${savedTimeString}` : ""}.`);
    setAvailableDraft(null);
  };

  const handleManualSaveDraft = (e) => {
    if (e) e.preventDefault();
    savePostToServer("Draft", false);
  };

  const clearDraft = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(DRAFT_KEY);
    setDraftNotice("");
    setAvailableDraft(null);
    setLastAutoSaveTime("");
    if (initialSlug) {
      window.location.reload();
    } else {
      setTitle("");
      setSlug("");
      setDescription("");
      setFocusKeyword("");
      setTags("");
      setCoverImage("");
      setUploadedImageSrc("");
      setImageAlt("");
      setImageTitle("");
      setDate(new Date().toISOString().split("T")[0]);
      setAuthor("Convert Galaxy Team");
      setStatus("Draft");
      setMarkdownContent("");
      setHtmlContent("");
      setInitialHtmlContent("");
      if (editorRef.current) editorRef.current.innerHTML = "";
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      calculateStats(editorRef.current.innerText);
      setHtmlContent(currentHtml);
      const parsedMd = htmlToMarkdown(currentHtml);
      setMarkdownContent(parsedMd);
      saveDraftToLocalStorage({ htmlContent: currentHtml, markdownContent: parsedMd });

      // Real-time syntax validation for any Custom HTML textareas inside editor
      const blockTextareas = editorRef.current.querySelectorAll("textarea.wp-block-textarea");
      blockTextareas.forEach((ta) => {
        ta.textContent = ta.value;
        const blockCard = ta.closest(".wp-block-custom-html");
        if (blockCard) {
          let statusDiv = blockCard.querySelector(".wp-block-validation-status");
          if (!statusDiv) {
            statusDiv = document.createElement("div");
            blockCard.querySelector(".wp-block-editor-pane")?.appendChild(statusDiv);
          }
          const valResult = validateHtmlSnippet(ta.value);
          if (valResult.isValid) {
            statusDiv.className = "wp-block-validation-status mt-2 p-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2";
            statusDiv.innerHTML = `<span>✅ HTML Syntax Valid</span>`;
          } else {
            statusDiv.className = "wp-block-validation-status mt-2 p-2.5 px-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2";
            statusDiv.innerHTML = `<span class="text-rose-400 shrink-0 font-bold">⚠️ HTML Mistake:</span><span>${valResult.errors.join("; ")}</span>`;
          }
        }
      });

      // Check for WordPress "/" Slash Command trigger
      if (editorMode === "visual" && typeof window !== "undefined") {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && selection.anchorNode && editorRef.current?.contains(selection.anchorNode)) {
          const range = selection.getRangeAt(0);
          const node = selection.anchorNode;
          const offset = selection.anchorOffset;
          if (node) {
            const textContent = node.nodeValue || node.textContent || "";
            const textBeforeCaret = textContent.substring(0, offset);
            const match = textBeforeCaret.match(/\/([a-zA-Z0-9-]*)$/);

            if (match) {
              const query = match[1].toLowerCase();
              setSlashQuery(query);
              setSlashSelectedIndex(0);

              const rect = range.getBoundingClientRect();
              const editorRect = editorRef.current.getBoundingClientRect();
              if (rect && editorRect) {
                setSlashMenuPos({
                  top: Math.max(10, rect.bottom - editorRect.top + 6),
                  left: Math.max(10, Math.min(rect.left - editorRect.left, editorRect.width - 290)),
                });
                setShowSlashMenu(true);
              }
            } else {
              setShowSlashMenu(false);
            }
          }
        } else {
          setShowSlashMenu(false);
        }
      }
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUploadChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setCropScale(1);
      setCropOffset({ x: 0, y: 0 });
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Image Drag-Clamping utility for cover cropper
  const clampOffset = (x, y, currentScale) => {
    if (!containerRef.current || !cropImgRef.current) return { x, y };
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const naturalRatio = cropImgRef.current.naturalWidth / cropImgRef.current.naturalHeight;

    let baseWidth, baseHeight;
    if (naturalRatio > 16/9) {
      baseHeight = containerHeight;
      baseWidth = baseHeight * naturalRatio;
    } else {
      baseWidth = containerWidth;
      baseHeight = baseWidth / naturalRatio;
    }

    const renderedWidth = baseWidth * currentScale;
    const renderedHeight = baseHeight * currentScale;

    let clampedX = x;
    if (renderedWidth >= containerWidth) {
      const minX = containerWidth - renderedWidth;
      clampedX = Math.min(0, Math.max(minX, x));
    } else {
      const limitX = containerWidth - renderedWidth;
      clampedX = Math.min(limitX, Math.max(0, x));
    }

    let clampedY = y;
    if (renderedHeight >= containerHeight) {
      const minY = containerHeight - renderedHeight;
      clampedY = Math.min(0, Math.max(minY, y));
    } else {
      const limitY = containerHeight - renderedHeight;
      clampedY = Math.min(limitY, Math.max(0, y));
    }

    return { x: clampedX, y: clampedY };
  };

  const handleCropMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingCrop(true);
    setDragStart({
      x: e.clientX - cropOffset.x,
      y: e.clientY - cropOffset.y,
    });
  };

  const handleCropMouseMove = (e) => {
    if (!isDraggingCrop) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    const clamped = clampOffset(newX, newY, cropScale);
    setCropOffset(clamped);
  };

  const handleCropMouseUp = () => {
    setIsDraggingCrop(false);
  };

  const handleScaleChange = (newScale) => {
    setCropScale(newScale);
    setCropOffset((prev) => clampOffset(prev.x, prev.y, newScale));
  };

  const handleCropSubmit = async () => {
    if (!containerRef.current || !cropImgRef.current) return;
    setUploadingImage(true);
    setShowCropModal(false);
    setErrorMsg("");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 675; // 16:9 Aspect ratio
      const ctx = canvas.getContext("2d");

      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = cropImgRef.current.getBoundingClientRect();

      const relativeX = imgRect.left - containerRect.left;
      const relativeY = imgRect.top - containerRect.top;
      const scaleCanvas = 1200 / containerRect.width;

      ctx.drawImage(
        cropImgRef.current,
        relativeX * scaleCanvas,
        relativeY * scaleCanvas,
        imgRect.width * scaleCanvas,
        imgRect.height * scaleCanvas
      );

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setErrorMsg("Failed to generate cropped image.");
          setUploadingImage(false);
          return;
        }

        const croppedFile = new File([blob], "cover-image.png", { type: "image/png" });
        const formData = new FormData();
        formData.append("file", croppedFile);

        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.success && data.url) {
            setCoverImage(data.url);
            setUploadedImageSrc(data.url);
            let nextAlt = imageAlt;
            if (!imageAlt) {
              nextAlt = `${title || focusKeyword || "cover image"} illustration`;
              setImageAlt(nextAlt);
            }
            saveDraftToLocalStorage({ coverImage: data.url, imageAlt: nextAlt });
          } else {
            setErrorMsg(data.error || "File upload failed.");
          }
        } catch (err) {
          setErrorMsg("Error uploading cropped image.");
        } finally {
          setUploadingImage(false);
        }
      }, "image/png");

    } catch (err) {
      setErrorMsg("Failed to crop image.");
      setUploadingImage(false);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    let newSlug = slug;
    if (!initialSlug) {
      newSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(newSlug);
    }
    saveDraftToLocalStorage({ title: val, slug: newSlug });
  };

  // Fetch initial post data if editing and load saved draft if present
  useEffect(() => {
    const currentDraftKey = initialSlug ? `blog_editor_draft_${initialSlug}` : "blog_editor_draft_new";
    let savedDraft = null;
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(currentDraftKey);
        if (raw) savedDraft = JSON.parse(raw);
      } catch (e) {
        console.warn("Failed to parse local draft", e);
      }
    }

    if (initialSlug) {
      setLoading(true);
      fetch(`/api/admin/blog/${initialSlug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.post) {
            const { frontmatter, content, htmlContent: serverHtml } = data.post;
            
            // If local draft exists and is not corrupted, prioritize restored draft
            const isDraftCorrupted = savedDraft && (JSON.stringify(savedDraft).includes("wp-block-preview-pane") || JSON.stringify(savedDraft).includes("___PROTECTED_RAW"));
            if (savedDraft && savedDraft.timestamp && !isDraftCorrupted) {
              setTitle(savedDraft.title !== undefined ? savedDraft.title : (frontmatter.title || ""));
              setSlug(initialSlug);
              setDescription(savedDraft.description !== undefined ? savedDraft.description : (frontmatter.description || ""));
              setFocusKeyword(savedDraft.focusKeyword !== undefined ? savedDraft.focusKeyword : (frontmatter.focusKeyword || ""));
              setTags(savedDraft.tags !== undefined ? savedDraft.tags : (frontmatter.tags || ""));
              setCoverImage(savedDraft.coverImage !== undefined ? savedDraft.coverImage : (frontmatter.image || ""));
              setUploadedImageSrc(savedDraft.coverImage !== undefined ? savedDraft.coverImage : (frontmatter.image || ""));
              setImageAlt(savedDraft.imageAlt !== undefined ? savedDraft.imageAlt : (frontmatter.imageAlt || ""));
              setImageTitle(savedDraft.imageTitle !== undefined ? savedDraft.imageTitle : (frontmatter.imageTitle || ""));
              setDate(savedDraft.date !== undefined ? savedDraft.date : (frontmatter.date || ""));
              setAuthor(savedDraft.author !== undefined ? savedDraft.author : (frontmatter.author || "Convert Galaxy Team"));
              setStatus(savedDraft.status !== undefined ? savedDraft.status : (frontmatter.status || "Draft"));
              
              const activeMd = savedDraft.markdownContent || content || "";
              setMarkdownContent(activeMd);
              const activeHtml = savedDraft.htmlContent || serverHtml || markdownToHtml(activeMd);
              setHtmlContent(activeHtml);
              setInitialHtmlContent(activeHtml);
              if (savedDraft.content_blocks) {
                setInitialBlocks(savedDraft.content_blocks);
              } else if (data.post && data.post.content_blocks) {
                setInitialBlocks(data.post.content_blocks);
              }
              if (savedDraft.editorMode) setEditorMode(savedDraft.editorMode);
              calculateStats(activeMd);
              setDraftNotice("Restored unsaved draft from local storage.");
            } else {
              setTitle(frontmatter.title || "");
              setSlug(initialSlug);
              setDescription(frontmatter.description || "");
              setFocusKeyword(frontmatter.focusKeyword || "");
              setTags(frontmatter.tags || "");
              setCoverImage(frontmatter.image || "");
              setUploadedImageSrc(frontmatter.image || "");
              setImageAlt(frontmatter.imageAlt || "");
              setImageTitle(frontmatter.imageTitle || "");
              setDate(frontmatter.date || "");
              setAuthor(frontmatter.author || "Convert Galaxy Team");
              setStatus(frontmatter.status || "Draft");
              setMarkdownContent(content || "");
              const loadedHtml = serverHtml || markdownToHtml(content);
              setHtmlContent(loadedHtml);
              setInitialHtmlContent(loadedHtml);
              if (data.post.content_blocks) {
                setInitialBlocks(data.post.content_blocks);
              }
              calculateStats(content);
            }
          } else {
            setErrorMsg("Failed to load blog post details.");
          }
        })
        .catch((err) => {
          setErrorMsg("Error loading post data.");
          console.error(err);
        })
        .finally(() => setLoading(false));
    } else {
      if (savedDraft) {
        setTitle(savedDraft.title || "");
        setSlug(savedDraft.slug || "");
        setDescription(savedDraft.description || "");
        setFocusKeyword(savedDraft.focusKeyword || "");
        setCoverImage(savedDraft.coverImage || "");
        setUploadedImageSrc(savedDraft.coverImage || "");
        setImageAlt(savedDraft.imageAlt || "");
        setImageTitle(savedDraft.imageTitle || "");
        setDate(savedDraft.date || new Date().toISOString().split("T")[0]);
        setAuthor(savedDraft.author || "Convert Galaxy Team");
        setStatus(savedDraft.status || "Draft");
        setMarkdownContent(savedDraft.markdownContent || "");
        setHtmlContent(savedDraft.htmlContent || "");
        setInitialHtmlContent(savedDraft.htmlContent || "");
        if (savedDraft.editorMode) setEditorMode(savedDraft.editorMode);
        calculateStats(savedDraft.markdownContent || "");
        setDraftNotice("Restored unsaved draft from local storage.");
      } else {
        setDate(new Date().toISOString().split("T")[0]);
      }
    }
  }, [initialSlug]);

  // Sync content when switching modes (Visual <-> Code)
  const toggleEditorMode = () => {
    if (editorMode === "visual") {
      const currentHtml = editorRef.current ? editorRef.current.innerHTML : htmlContent;
      const parsedMd = htmlToMarkdown(currentHtml);
      setMarkdownContent(parsedMd);
      setEditorMode("code");
      saveDraftToLocalStorage({ editorMode: "code", markdownContent: parsedMd, htmlContent: currentHtml });
    } else {
      const parsedHtml = markdownToHtml(markdownContent);
      setHtmlContent(parsedHtml);
      setInitialHtmlContent(parsedHtml);
      setEditorMode("visual");
      saveDraftToLocalStorage({ editorMode: "visual", htmlContent: parsedHtml, markdownContent });
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = parsedHtml;
        }
      }, 0);
    }
  };

  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  const executeSlashCommand = (cmd) => {
    setShowSlashMenu(false);
    if (!cmd) return;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && selection.anchorNode) {
      const node = selection.anchorNode;
      const offset = selection.anchorOffset;
      if (node) {
        const textContent = node.nodeValue || node.textContent || "";
        const match = textContent.substring(0, offset).match(/\/([a-zA-Z0-9-]*)$/);

        if (match) {
          const slashStart = offset - match[0].length;
          if (node.nodeType === 3) {
            node.nodeValue = textContent.substring(0, slashStart) + textContent.substring(offset);
          }
        }
      }
    }

    if (cmd.type === "html") {
      insertCustomHtmlBlock();
    } else if (cmd.type === "code") {
      insertCustomHtmlBlock(`<pre><code class="language-javascript">// Write your code snippet here\nfunction example() {\n  console.log("Hello from ConvertGalaxy!");\n}</code></pre>`);
    } else if (cmd.type === "table") {
      setShowTableModal(true);
    } else if (cmd.type === "callout") {
      insertCalloutBox();
    } else if (cmd.type === "image") {
      insertInlineImageBlock();
    } else if (cmd.type === "heading1") {
      handleFormat("formatBlock", "<h1>");
    } else if (cmd.type === "heading" || cmd.type === "heading2") {
      handleFormat("formatBlock", "<h2>");
    } else if (cmd.type === "subheading" || cmd.type === "heading3") {
      handleFormat("formatBlock", "<h3>");
    } else if (cmd.type === "heading4") {
      handleFormat("formatBlock", "<h4>");
    } else if (cmd.type === "quote") {
      handleFormat("formatBlock", "<blockquote>");
    } else if (cmd.type === "divider") {
      document.execCommand("insertHorizontalRule", false, null);
    } else if (cmd.type === "list-ul") {
      handleFormat("insertUnorderedList");
    } else if (cmd.type === "list-ol") {
      handleFormat("insertOrderedList");
    }
    handleEditorInput();
  };

  // WordPress Keyboard Shortcuts Listener
  const handleKeyDown = (e) => {
    const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    // Alt + Shift + Z or Cmd + Alt + Z: Remove Current Block (WordPress Shortcut)
    if (
      (e.altKey && e.shiftKey && (e.key === "z" || e.key === "Z" || e.code === "KeyZ")) ||
      (modKey && e.altKey && (e.key === "z" || e.key === "Z" || e.code === "KeyZ"))
    ) {
      e.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let node = range.commonAncestorContainer;
        if (node.nodeType === 3) node = node.parentNode;

        const targetBlock = node.closest
          ? node.closest(".wp-block-custom-html, table, .callout-box, blockquote, figure, .wp-custom-html-card, h1, h2, h3, h4, ul, ol, p, hr")
          : null;

        if (targetBlock && editorRef.current && editorRef.current.contains(targetBlock)) {
          if (targetBlock.tagName === "P" && editorRef.current.children.length <= 1) {
            targetBlock.innerHTML = "<br>";
          } else {
            targetBlock.remove();
          }
          handleEditorInput();
        }
      }
      return;
    }

    // Slash menu navigation when open
    if (showSlashMenu) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashSelectedIndex((prev) => (filteredSlashCommands.length ? (prev + 1) % filteredSlashCommands.length : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashSelectedIndex((prev) => (filteredSlashCommands.length ? (prev - 1 + filteredSlashCommands.length) % filteredSlashCommands.length : 0));
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (filteredSlashCommands[slashSelectedIndex]) {
          executeSlashCommand(filteredSlashCommands[slashSelectedIndex]);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowSlashMenu(false);
        return;
      }
    }

    // Ctrl + S / Cmd + S: Save Article
    if (modKey && (e.key === "s" || e.key === "S" || e.code === "KeyS")) {
      e.preventDefault();
      handleSave(e);
      return;
    }

    // Ctrl + K / Cmd + K: Link Insertion
    if (modKey && (e.key === "k" || e.key === "K" || e.code === "KeyK")) {
      e.preventDefault();
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && editorRef.current && editorRef.current.contains(selection.getRangeAt(0).commonAncestorContainer)) {
        handleSelectionChange();
        setIsInlineLinkInputOpen(true);
        setInlineLinkUrl("");
      } else {
        startLinkFlow();
      }
      return;
    }

    // Shortcuts below apply to Visual Mode only
    if (editorMode !== "visual") return;

    // Ctrl + B / Cmd + B: Bold
    if (modKey && !e.shiftKey && !e.altKey && (e.key === "b" || e.key === "B" || e.code === "KeyB")) {
      e.preventDefault();
      handleFormat("bold");
      return;
    }

    // Ctrl + I / Cmd + I: Italic
    if (modKey && !e.shiftKey && !e.altKey && (e.key === "i" || e.key === "I" || e.code === "KeyI")) {
      e.preventDefault();
      handleFormat("italic");
      return;
    }

    // Ctrl + U / Cmd + U: Underline
    if (modKey && !e.shiftKey && !e.altKey && (e.key === "u" || e.key === "U" || e.code === "KeyU")) {
      e.preventDefault();
      handleFormat("underline");
      return;
    }

    // Ctrl + Shift + X or Alt + Shift + D: Strikethrough
    if (
      (modKey && e.shiftKey && (e.key === "x" || e.key === "X" || e.code === "KeyX")) ||
      (e.altKey && e.shiftKey && (e.key === "d" || e.key === "D" || e.code === "KeyD" || e.key === "x" || e.key === "X" || e.code === "KeyX"))
    ) {
      e.preventDefault();
      handleFormat("strikeThrough");
      return;
    }

    // Auto-Formatting Markdown Shortcuts on Space (# , ## , ### , #### , > , - , 1. )
    if (e.key === " " && editorMode === "visual") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && selection.anchorNode && editorRef.current?.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        const node = selection.anchorNode;
        const offset = selection.anchorOffset;
        const textContent = node.nodeValue || node.textContent || "";
        const textBeforeCaret = textContent.substring(0, offset).replace(/\u00a0/g, " ").trim();

        const removeTriggerText = () => {
          try {
            if (node.nodeType === 3) {
              const r = document.createRange();
              r.setStart(node, 0);
              r.setEnd(node, offset);
              r.deleteContents();
            }
          } catch (err) {
            console.warn("Could not delete trigger text:", err);
          }
        };

        if (textBeforeCaret === "#") {
          e.preventDefault();
          removeTriggerText();
          handleFormat("formatBlock", "<h1>");
          return;
        }
        if (textBeforeCaret === "##") {
          e.preventDefault();
          removeTriggerText();
          handleFormat("formatBlock", "<h2>");
          return;
        }
        if (textBeforeCaret === "###") {
          e.preventDefault();
          removeTriggerText();
          handleFormat("formatBlock", "<h3>");
          return;
        }
        if (textBeforeCaret === "####") {
          e.preventDefault();
          removeTriggerText();
          handleFormat("formatBlock", "<h4>");
          return;
        }
        if (textBeforeCaret === ">") {
          e.preventDefault();
          removeTriggerText();
          handleFormat("formatBlock", "<blockquote>");
          return;
        }
        if (textBeforeCaret === "-" || textBeforeCaret === "*") {
          e.preventDefault();
          removeTriggerText();
          handleFormat("insertUnorderedList");
          return;
        }
        if (textBeforeCaret === "1.") {
          e.preventDefault();
          removeTriggerText();
          handleFormat("insertOrderedList");
          return;
        }
      }
    }

    // Alt + Shift + 1/2/3/4/U/O/Q/P/C/T/M/L or Ctrl + Shift + 1/2/3/4/U/O/Q/P/C/T/M/L: Headings, Blocks & Lists
    if ((modKey || e.altKey) && e.shiftKey) {
      if (e.code === "Digit1" || e.key === "1" || e.key === "!") {
        e.preventDefault();
        handleFormat("formatBlock", "<h1>");
        return;
      }
      if (e.code === "Digit2" || e.key === "2" || e.key === "@") {
        e.preventDefault();
        handleFormat("formatBlock", "<h2>");
        return;
      }
      if (e.code === "Digit3" || e.key === "3" || e.key === "#") {
        e.preventDefault();
        handleFormat("formatBlock", "<h3>");
        return;
      }
      if (e.code === "Digit4" || e.key === "4" || e.key === "$") {
        e.preventDefault();
        handleFormat("formatBlock", "<h4>");
        return;
      }
      if (e.code === "Digit7" || e.code === "KeyO" || e.key === "7" || e.key === "o" || e.key === "O") {
        e.preventDefault();
        handleFormat("insertOrderedList");
        return;
      }
      if (e.code === "Digit8" || e.code === "KeyU" || e.code === "KeyL" || e.key === "8" || e.key === "u" || e.key === "U" || e.key === "l" || e.key === "L") {
        e.preventDefault();
        handleFormat("insertUnorderedList");
        return;
      }
      if (e.code === "KeyQ" || e.key === "q" || e.key === "Q") {
        e.preventDefault();
        handleFormat("formatBlock", "blockquote");
        return;
      }
      if (e.code === "KeyP" || e.key === "p" || e.key === "P") {
        e.preventDefault();
        handleFormat("formatBlock", "p");
        return;
      }
      if (e.code === "KeyC" || e.key === "c" || e.key === "C") {
        e.preventDefault();
        insertCustomHtmlBlock(`<pre><code class="language-javascript">// Write your code snippet here\nfunction example() {\n  console.log("Hello from ConvertGalaxy!");\n}</code></pre>`);
        return;
      }
      if (e.code === "KeyT" || e.key === "t" || e.key === "T") {
        e.preventDefault();
        setShowTableModal(true);
        return;
      }
      if (e.code === "KeyM" || e.key === "m" || e.key === "M") {
        e.preventDefault();
        insertInlineImageBlock();
        return;
      }
      if (e.code === "KeyH" || e.key === "h" || e.key === "H") {
        e.preventDefault();
        setShowShortcutsModal(true);
        return;
      }
    }
  };

  // ContentEditable formatting commands
  const handleFormat = (command, value = null) => {
    if (editorMode !== "visual") return;
    editorRef.current?.focus();
    if (command === "formatBlock") {
      const cleanTag = (value || "p").replace(/[<>]/g, "").toLowerCase();
      try {
        document.execCommand("formatBlock", false, `<${cleanTag}>`);
      } catch (err) {
        document.execCommand("formatBlock", false, cleanTag);
      }
    } else {
      document.execCommand(command, false, value);
    }
    handleEditorInput();
  };

  // Change block type from dropdown (Paragraph, H1, H2, H3, H4, Quote, Callout, Code)
  const handleBlockTypeChange = (e) => {
    const blockType = e.target.value;
    if (!blockType) return;
    
    if (blockType === "callout") {
      insertCalloutBox();
    } else if (blockType === "codeblock") {
      insertCodeBlock();
    } else {
      handleFormat("formatBlock", `<${blockType}>`);
    }
    e.target.value = "";
  };

  // WordPress "+ Add Block" quick insertions
  const insertBlock = (type) => {
    if (editorMode !== "visual") return;
    editorRef.current?.focus();

    switch (type) {
      case "heading":
        document.execCommand("formatBlock", false, "<h2>");
        break;
      case "subheading":
        document.execCommand("formatBlock", false, "<h3>");
        break;
      case "paragraph":
        document.execCommand("formatBlock", false, "<p>");
        break;
      case "quote":
        document.execCommand("formatBlock", false, "<blockquote>");
        break;
      case "callout":
        insertCalloutBox();
        break;
      case "code":
        insertCustomHtmlBlock(`<pre><code class="language-javascript">// Paste or write your code snippet here\nfunction example() {\n  console.log("Hello from ConvertGalaxy!");\n}</code></pre>`);
        break;
      case "html":
      case "faq-schema":
        insertCustomHtmlBlock();
        break;
      case "table":
        insertTable();
        break;
      case "divider":
        document.execCommand("insertHorizontalRule", false, null);
        break;
      case "image":
        insertInlineImageBlock();
        break;
      default:
        break;
    }
    handleEditorInput();
  };

  const insertInlineImageBlock = () => {
    if (editorMode !== "visual") return;
    editorRef.current?.focus();

    const blockId = "wp_img_" + Date.now();
    const blockHtml = `<div id="${blockId}" class="wp-block-image-card my-6 rounded-2xl border border-indigo-500/30 bg-[#0d0d18] p-5 shadow-2xl overflow-hidden select-none" contenteditable="false" data-wp-block="true">
  <div class="flex flex-col items-center justify-center border-2 border-dashed border-indigo-500/30 rounded-xl p-6 bg-[#090912] hover:border-indigo-500/60 transition-all text-center">
    <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3 font-bold text-xl">🖼️</div>
    <h4 class="font-['Outfit'] font-bold text-sm text-white mb-1">WordPress Inline Image Block</h4>
    <p class="text-xs text-gray-400 mb-4">Upload an image file or paste an image URL directly into your article flow</p>
    <div class="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
      <label class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-lg flex items-center gap-2">
        ☁️ Choose Image File
        <input type="file" accept="image/*" class="hidden" data-wp-image-input="file" />
      </label>
      <span class="text-xs text-gray-500 font-semibold">OR</span>
      <input type="text" data-wp-image-input="url" placeholder="Paste Image URL & Press Enter..." class="flex-1 bg-[#141424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500" />
    </div>
  </div>
</div><p><br></p>`;

    document.execCommand("insertHTML", false, blockHtml);
    handleEditorInput();
  };

  const insertCalloutBox = () => {
    const calloutHtml = `<div class="callout-box"><span>💡</span><div><strong>Pro Tip:</strong> Enter your key takeaway or important advice here.</div></div><p><br></p>`;
    document.execCommand("insertHTML", false, calloutHtml);
  };

  const insertCustomHtmlBlock = (defaultCode = "") => {
    if (editorMode !== "visual") return;
    editorRef.current?.focus();

    const placeholderCode = defaultCode || "";

    const blockId = "wp_html_" + Date.now();
    const blockHtml = `<div id="${blockId}" class="wp-block-custom-html my-6 rounded-2xl border border-indigo-500/30 bg-[#0d0d18] overflow-hidden shadow-2xl" contenteditable="false" data-wp-block="true">
  <div class="wp-block-header flex items-center justify-between px-4 py-2.5 bg-[#141424] border-b border-indigo-500/20 font-['Outfit'] select-none">
    <div class="flex items-center gap-2 text-xs font-bold text-indigo-300">
      <span>&lt;/&gt; Custom HTML / FAQ Schema Block</span>
    </div>
    <div class="flex items-center gap-1.5 bg-[#090912] p-1 rounded-lg border border-white/5">
      <button type="button" data-tab-btn="html" class="wp-block-tab-btn active px-3 py-1 text-xs font-bold rounded-md bg-indigo-600 text-white shadow-sm transition-all cursor-pointer">HTML</button>
      <button type="button" data-tab-btn="preview" class="wp-block-tab-btn px-3 py-1 text-xs font-bold rounded-md text-[#9494a3] hover:text-white transition-all cursor-pointer">Preview</button>
    </div>
  </div>
  <div class="wp-block-editor-pane p-4">
    <textarea class="wp-block-textarea w-full bg-[#090912] border border-white/10 rounded-xl p-3 text-xs font-mono text-cyan-300 outline-none focus:border-indigo-500 transition-colors leading-relaxed" rows="7" placeholder="Paste or write HTML code or FAQ schema here...">${placeholderCode}</textarea>
  </div>
  <div class="wp-block-preview-pane p-4 hidden">
    <div class="wp-block-preview-content text-left text-white text-sm"></div>
  </div>
</div><p><br></p>`;

    document.execCommand("insertHTML", false, blockHtml);
    handleEditorInput();
  };

  const insertTable = () => {
    setShowTableModal(true);
  };

  const handleCreateTable = () => {
    const rowsCount = Math.max(1, Math.min(20, parseInt(tableRows, 10) || 3));
    const colsCount = Math.max(1, Math.min(10, parseInt(tableCols, 10) || 3));

    let tableHtml = `<table class="admin-blog-table">`;

    if (tableHasHeader) {
      tableHtml += `<thead><tr>`;
      for (let c = 1; c <= colsCount; c++) {
        tableHtml += `<th>Header ${c}</th>`;
      }
      tableHtml += `</tr></thead>`;
    }

    tableHtml += `<tbody>`;
    const startRow = tableHasHeader ? 1 : 0;
    for (let r = startRow; r < rowsCount; r++) {
      tableHtml += `<tr>`;
      for (let c = 1; c <= colsCount; c++) {
        tableHtml += `<td>Row ${r + 1} Col ${c}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table><p><br></p>`;

    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand("insertHTML", false, tableHtml);
    setShowTableModal(false);
    handleEditorInput();
  };

  // Body Image Uploader inside editor content
  const handleBodyImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBodyImage(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setBodyImageUrl(data.url);
      } else {
        setErrorMsg(data.error || "Failed to upload image.");
      }
    } catch (err) {
      setErrorMsg("Error uploading body image.");
    } finally {
      setUploadingBodyImage(false);
    }
  };

  const confirmInsertBodyImage = () => {
    if (!bodyImageUrl.trim()) return;
    
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const imgHtml = `<figure class="my-6 text-center"><img src="${bodyImageUrl.trim()}" alt="${bodyImageAlt || "Article Illustration"}" /><figcaption class="text-center text-xs text-[#9494a3] mt-2 font-mono">${bodyImageAlt || ""}</figcaption></figure><p><br></p>`;
    document.execCommand("insertHTML", false, imgHtml);

    setBodyImageUrl("");
    setBodyImageAlt("");
    setShowMediaModal(false);
    handleEditorInput();
  };

  // Inline link logic
  const startLinkFlow = () => {
    if (editorMode !== "visual") return;
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
    } else {
      setSavedRange(null);
    }
    setShowLinkInput(true);
  };

  const applyLink = () => {
    if (savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
    } else if (editorRef.current) {
      editorRef.current.focus();
    }

    if (linkUrl.trim()) {
      let finalUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith("/") && !finalUrl.startsWith("#")) {
        finalUrl = "https://" + finalUrl;
      }
      document.execCommand("createLink", false, finalUrl);
    }
    
    setLinkUrl("");
    setShowLinkInput(false);
    setSavedRange(null);
    handleEditorInput();
  };

  const cancelLink = () => {
    setLinkUrl("");
    setShowLinkInput(false);
    setSavedRange(null);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const activeSlugRef = useRef(initialSlug || "");
  const autoSaveTimeoutRef = useRef(null);

  // Server save operation (handles manual Draft/Publish clicks & background auto-saves)
  const savePostToServer = async (targetStatus = "Draft", isAutoSave = false) => {
    if (!title || !title.trim()) return;

    if (!isAutoSave) {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");
    }

    let finalContent = markdownContent;
    if (editorMode === "visual" && editorRef.current) {
      finalContent = htmlToMarkdown(editorRef.current.innerHTML);
    }

    const currentSlug = slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    const slugToUse = activeSlugRef.current || currentSlug;

    const payload = {
      slug: currentSlug,
      title,
      description: description || "",
      date: date || new Date().toISOString().split("T")[0],
      focusKeyword: focusKeyword || "",
      tags: tags || "",
      relatedToolSlug: focusKeyword ? focusKeyword.toLowerCase().replace(/\s+/g, "-") : "",
      image: coverImage || "",
      imageAlt: imageAlt || "",
      imageTitle: imageTitle || "",
      author: author || "Convert Galaxy Team",
      status: targetStatus,
      content: finalContent || "",
    };

    try {
      const url = slugToUse ? `/api/admin/blog/${slugToUse}` : "/api/admin/blog";
      const method = slugToUse ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        const nextSlug = resData.slug || currentSlug;
        activeSlugRef.current = nextSlug;

        if (typeof window !== "undefined") {
          window.localStorage.removeItem(DRAFT_KEY);
        }
        setAvailableDraft(null);
        setDraftNotice("");

        const timeStr = new Date().toLocaleTimeString();
        setLastAutoSaveTime(timeStr);

        if (!isAutoSave) {
          if (targetStatus === "Draft") {
            setStatus("Draft");
            setSuccessMsg(`Article saved as Draft to database at ${timeStr}!`);
          } else {
            setStatus(targetStatus);
            setSuccessMsg(initialSlug ? "Changes saved successfully!" : "Blog post published successfully!");
            setTimeout(() => {
              router.push("/admin/blog");
            }, 1500);
          }
        }
      } else if (!isAutoSave) {
        setErrorMsg(resData.error || "Failed to save post.");
      }
    } catch (err) {
      if (!isAutoSave) {
        setErrorMsg("Error submitting post to server.");
      }
      console.error("Server auto-save error:", err);
    } finally {
      if (!isAutoSave) setSaving(false);
    }
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    savePostToServer(status || "Published", false);
  };

  // Background Auto-Save to Server as Draft (triggers 4s after typing stops)
  useEffect(() => {
    if (!title || title.trim().length < 3) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      // Auto-save always preserves or sets "Draft" status (NEVER auto-publishes)
      const currentStatus = status === "Published" ? "Published" : "Draft";
      savePostToServer(currentStatus, true);
    }, 4000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, slug, description, focusKeyword, coverImage, imageAlt, date, author, status, markdownContent, htmlContent]);

  // Delete operation
  const handleDelete = async () => {
    if (!initialSlug) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/${initialSlug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(DRAFT_KEY);
        }
        router.push("/admin/blog");
      } else {
        setErrorMsg(data.error || "Failed to delete the post.");
        setShowDeleteModal(false);
      }
    } catch (err) {
      setErrorMsg("Error deleting post from server.");
      setShowDeleteModal(false);
    } finally {
      setSaving(false);
    }
  };

  // Character limit levels
  const titleCharCount = title.length;
  const descCharCount = description.length;

  const getTitleCounterClass = () => {
    if (titleCharCount > 60) return "counter-error";
    if (titleCharCount >= 50) return "counter-warn";
    return "counter-ok";
  };

  const getDescCounterClass = () => {
    if (descCharCount > 160) return "counter-error";
    if (descCharCount >= 145) return "counter-warn";
    return "counter-ok";
  };

  // Yoast/RankMath SEO content checklist analyzer
  const getSeoAnalysis = () => {
    if (!focusKeyword.trim()) return [];

    const keyword = focusKeyword.toLowerCase().trim();
    const cleanKeywordForSlug = keyword.replace(/\s+/g, "-");

    let finalContent = markdownContent;
    if (editorMode === "visual" && editorRef.current) {
      finalContent = htmlToMarkdown(editorRef.current.innerHTML);
    }
    const contentLower = finalContent.toLowerCase();

    const lines = finalContent.split("\n");
    const headings = lines.filter(l => l.trim().startsWith("#"));
    const headingHasKeyword = headings.some(h => h.toLowerCase().includes(keyword));

    return [
      {
        label: "Keyword in Title",
        pass: title.toLowerCase().includes(keyword),
        feedback: "Title should contain the focus keyword."
      },
      {
        label: "Keyword in Slug URL",
        pass: slug.toLowerCase().includes(cleanKeywordForSlug),
        feedback: "URL slug should contain the focus keyword."
      },
      {
        label: "Keyword in Meta Description",
        pass: description.toLowerCase().includes(keyword),
        feedback: "Meta description should contain the focus keyword."
      },
      {
        label: "Keyword in Article Body",
        pass: contentLower.includes(keyword),
        feedback: "The focus keyword should appear in the article text."
      },
      {
        label: "Keyword in Headings",
        pass: headingHasKeyword,
        feedback: "At least one heading (H2/H3/H4) should contain the focus keyword."
      }
    ];
  };

  const [initialBlocks, setInitialBlocks] = useState(null);

  const handleBlockSave = async (htmlOutput, blocksJson, targetStatus = "Draft") => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const currentSlug = slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    const slugToUse = activeSlugRef.current || currentSlug;

    const payload = {
      slug: currentSlug,
      title,
      description: description || "",
      date: date || new Date().toISOString().split("T")[0],
      focusKeyword: focusKeyword || "",
      tags: tags || "",
      relatedToolSlug: focusKeyword ? focusKeyword.toLowerCase().replace(/\s+/g, "-") : "",
      image: coverImage || "",
      imageAlt: imageAlt || "",
      imageTitle: imageTitle || "",
      author: author || "Convert Galaxy Team",
      status: targetStatus,
      content: htmlOutput || "",
      editorHtml: htmlOutput || "",
      content_blocks: blocksJson || [],
    };

    try {
      const url = slugToUse ? `/api/admin/blog/${slugToUse}` : "/api/admin/blog";
      const method = slugToUse ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        const nextSlug = resData.slug || currentSlug;
        activeSlugRef.current = nextSlug;
        if (blocksJson) setInitialBlocks(blocksJson);
        setSuccessMsg(`Post saved successfully as ${targetStatus}!`);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(resData.error || "Failed to save post.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error saving post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-sm text-[#cbd5e1] font-medium font-['Outfit']">Retrieving article metadata...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-[#090912] overflow-hidden">
      {errorMsg && (
        <div
          className="fixed top-4 right-4 z-50 p-4 bg-rose-600 text-white rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold font-['Outfit'] animate-in slide-in-from-top-2 fade-in duration-300 cursor-pointer"
          onClick={() => setErrorMsg("")}
          title="Click to dismiss"
        >
          <AlertTriangle size={16} /> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div
          className="fixed top-4 right-4 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold font-['Outfit'] animate-in slide-in-from-top-2 fade-in duration-300 cursor-pointer"
          onClick={() => setSuccessMsg("")}
          title="Click to dismiss"
        >
          <Check size={16} /> {successMsg}
        </div>
      )}

      <BlockEditorContainer
        initialHtml={htmlContent}
        initialBlocks={initialBlocks}
        onSave={handleBlockSave}
        saving={saving}
        postTitle={title}
        setPostTitle={setTitle}
        postSlug={slug}
        setPostSlug={setSlug}
        postStatus={status}
        setPostStatus={setStatus}
        description={description}
        setDescription={setDescription}
        focusKeyword={focusKeyword}
        setFocusKeyword={setFocusKeyword}
        tags={tags}
        setTags={setTags}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        imageAlt={imageAlt}
        setImageAlt={setImageAlt}
        imageTitle={imageTitle}
        setImageTitle={setImageTitle}
      />
    </div>
  );
}
