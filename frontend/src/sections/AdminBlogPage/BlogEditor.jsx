"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  md = md.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, (m) => {
    protectedRawBlocks.push(m);
    return `___PROTECTED_RAW_${protectedRawBlocks.length - 1}___`;
  });
  md = md.replace(/<div class="(?:wp-custom-html-card|custom-html-block|wp-block-html|faq-container)"[^>]*>([\s\S]*?)<\/div>/gi, (m) => {
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

// Custom client-side Markdown-to-HTML parser for loading into Visual Editor
function markdownToHtml(md) {
  if (!md) return "";
  let html = md.replace(/\r\n/g, "\n");

  // Extract and protect raw HTML & Script blocks (e.g. JSON-LD FAQ Schema, custom HTML blocks, details)
  const rawHtmlBlocks = [];

  // 1. Script tags (including <script type="application/ld+json">)
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, (match) => {
    rawHtmlBlocks.push(match);
    return `\n\n___RAW_HTML_BLOCK_${rawHtmlBlocks.length - 1}___\n\n`;
  });

  // 2. Custom HTML wrapper divs
  html = html.replace(/<div class="(?:custom-html-block|wp-custom-html-card|wp-block-html|faq-container)[^>]*">[\s\S]*?<\/div>/gi, (match) => {
    rawHtmlBlocks.push(match);
    return `\n\n___RAW_HTML_BLOCK_${rawHtmlBlocks.length - 1}___\n\n`;
  });

  // 3. HTML details / accordions
  html = html.replace(/<details[^>]*>[\s\S]*?<\/details>/gi, (match) => {
    rawHtmlBlocks.push(match);
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

  const handleEditorClick = (e) => {
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

  const handleInsertCustomHtml = () => {
    if (!customHtmlCode.trim()) return;
    editorRef.current?.focus();
    const isScript = customHtmlCode.includes('type="application/ld+json"');
    const escapedCode = customHtmlCode.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const blockHtml = `<div class="wp-custom-html-card" data-custom-html="true"><div class="wp-custom-html-header"><span>${isScript ? '⚡ FAQ Schema (JSON-LD)' : '&lt;/&gt; Custom HTML Block'}</span></div><pre class="wp-custom-html-code"><code>${escapedCode}</code></pre></div><p><br></p>`;
    
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
  
  // Editor mode: "visual" or "code" (markdown)
  const [editorMode, setEditorMode] = useState("visual");
  const [markdownContent, setMarkdownContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [initialHtmlContent, setInitialHtmlContent] = useState("");

  // Live Stats State
  const [stats, setStats] = useState({ words: 0, chars: 0, readTime: 1 });

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        coverImage: overrideData.coverImage !== undefined ? overrideData.coverImage : coverImage,
        imageAlt: overrideData.imageAlt !== undefined ? overrideData.imageAlt : imageAlt,
        imageTitle: overrideData.imageTitle !== undefined ? overrideData.imageTitle : imageTitle,
        date: overrideData.date !== undefined ? overrideData.date : date,
        author: overrideData.author !== undefined ? overrideData.author : author,
        status: overrideData.status !== undefined ? overrideData.status : status,
        markdownContent: overrideData.markdownContent !== undefined ? overrideData.markdownContent : currentMd,
        htmlContent: overrideData.htmlContent !== undefined ? overrideData.htmlContent : currentHtml,
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
            
            // If local draft exists, prioritize restored draft so user edits are never lost on compilation
            if (savedDraft && savedDraft.timestamp) {
              setTitle(savedDraft.title !== undefined ? savedDraft.title : (frontmatter.title || ""));
              setSlug(initialSlug);
              setDescription(savedDraft.description !== undefined ? savedDraft.description : (frontmatter.description || ""));
              setFocusKeyword(savedDraft.focusKeyword !== undefined ? savedDraft.focusKeyword : (frontmatter.focusKeyword || ""));
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
              if (savedDraft.editorMode) setEditorMode(savedDraft.editorMode);
              calculateStats(activeMd);
              setDraftNotice("Restored unsaved draft from local storage.");
            } else {
              setTitle(frontmatter.title || "");
              setSlug(initialSlug);
              setDescription(frontmatter.description || "");
              setFocusKeyword(frontmatter.focusKeyword || "");
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

  // WordPress Keyboard Shortcuts Listener
  const handleKeyDown = (e) => {
    const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    // Ctrl + S / Cmd + S: Save Article
    if (modKey && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      handleSave(e);
      return;
    }

    // Ctrl + K / Cmd + K: Link Insertion
    if (modKey && (e.key === "k" || e.key === "K")) {
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
    if (modKey && !e.shiftKey && (e.key === "b" || e.key === "B")) {
      e.preventDefault();
      handleFormat("bold");
      return;
    }

    // Ctrl + I / Cmd + I: Italic
    if (modKey && !e.shiftKey && (e.key === "i" || e.key === "I")) {
      e.preventDefault();
      handleFormat("italic");
      return;
    }

    // Ctrl + U / Cmd + U: Underline
    if (modKey && !e.shiftKey && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      handleFormat("underline");
      return;
    }

    // Ctrl + Shift + X or Alt + Shift + D: Strikethrough
    if ((modKey && e.shiftKey && (e.key === "x" || e.key === "X")) || (e.altKey && e.shiftKey && (e.key === "d" || e.key === "D"))) {
      e.preventDefault();
      handleFormat("strikeThrough");
      return;
    }

    // Alt + Shift + 1/2/3/4 or Ctrl + Shift + 1/2/3/4: Headings & Lists
    if ((modKey || e.altKey) && e.shiftKey) {
      if (e.key === "1") {
        e.preventDefault();
        handleFormat("formatBlock", "<h1>");
        return;
      }
      if (e.key === "2") {
        e.preventDefault();
        handleFormat("formatBlock", "<h2>");
        return;
      }
      if (e.key === "3") {
        e.preventDefault();
        handleFormat("formatBlock", "<h3>");
        return;
      }
      if (e.key === "4") {
        e.preventDefault();
        handleFormat("formatBlock", "<h4>");
        return;
      }
      if (e.key === "7" || e.key === "o" || e.key === "O") {
        e.preventDefault();
        handleFormat("insertOrderedList");
        return;
      }
      if (e.key === "8" || e.key === "u" || e.key === "U") {
        e.preventDefault();
        handleFormat("insertUnorderedList");
        return;
      }
      if (e.key === "q" || e.key === "Q") {
        e.preventDefault();
        handleFormat("formatBlock", "<blockquote>");
        return;
      }
    }
  };

  // ContentEditable formatting commands
  const handleFormat = (command, value = null) => {
    if (editorMode !== "visual") return;
    editorRef.current?.focus();
    document.execCommand(command, false, value);
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
        insertCodeBlock();
        break;
      case "html":
      case "faq-schema":
        setShowCustomHtmlModal(true);
        break;
      case "table":
        insertTable();
        break;
      case "divider":
        document.execCommand("insertHorizontalRule", false, null);
        break;
      case "image":
        setShowMediaModal(true);
        break;
      default:
        break;
    }
    handleEditorInput();
  };

  const insertCalloutBox = () => {
    const calloutHtml = `<div class="callout-box"><span>💡</span><div><strong>Pro Tip:</strong> Enter your key takeaway or important advice here.</div></div><p><br></p>`;
    document.execCommand("insertHTML", false, calloutHtml);
  };

  const insertCodeBlock = () => {
    const codeHtml = `<pre><code>// Write your code snippet here</code></pre><p><br></p>`;
    document.execCommand("insertHTML", false, codeHtml);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-sm text-[#cbd5e1] font-medium font-['Outfit']">Retrieving article metadata...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161622] p-5 rounded-2xl border border-[#2a2a38] shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <Link href="/admin/blog" className="inline-flex items-center gap-1 text-indigo-400 no-underline text-xs hover:text-white transition-colors">
              <ArrowLeft size={14} /> Back to dashboard
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.6)] border border-indigo-400/50">
              <Sparkles size={12} className="animate-pulse text-amber-300" /> Blog Editor
            </span>
          </div>
          <h1 className="font-['Outfit'] font-black text-2xl md:text-3xl text-white">
            {initialSlug ? `Edit Article: ${title || initialSlug}` : "Write New Blog Article"}
          </h1>
        </div>

        {/* Quick Action Header Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleManualSaveDraft}
            className="px-3.5 py-2 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Save current state as a local draft"
          >
            💾 Save Draft
          </button>

          {availableDraft && (
            <button
              type="button"
              onClick={() => handleRestoreDraft()}
              className="px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 animate-pulse"
              title="Restore previous auto-saved draft"
            >
              <RotateCcw size={13} /> Restore Draft
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
          >
            {saving ? "Saving..." : initialSlug ? "Save Article" : "Publish Article"}
          </button>
        </div>
      </div>

      {/* Alert Notices */}
      {availableDraft && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                💾 Auto-Saved Draft Detected
              </div>
              <div className="text-xs text-amber-200/80 mt-0.5">
                Saved on {new Date(availableDraft.timestamp).toLocaleString()} ({availableDraft.title || "Untitled Article"})
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleRestoreDraft()}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw size={14} /> Restore Draft
            </button>
            <button
              type="button"
              onClick={clearDraft}
              className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-red-400 hover:text-red-300 rounded-xl font-semibold text-xs flex items-center gap-1 cursor-pointer transition-all"
            >
              <Trash2 size={13} /> Discard
            </button>
          </div>
        </div>
      )}


      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-start gap-3">
          <Check size={18} className="shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* Main Form container */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Form Columns (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card space-y-6">
            
            {/* Title Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="title" className="admin-label m-0 font-bold text-white">Post Title</label>
                <span className={`text-xs font-mono ${getTitleCounterClass()}`}>
                  {titleCharCount}/60
                </span>
              </div>
              <input
                id="title"
                type="text"
                placeholder="e.g. How to Convert HEIC to JPG Easily in 2026"
                value={title || ""}
                onChange={handleTitleChange}
                required
                className="admin-input text-lg font-bold"
              />
            </div>

            {/* URL field */}
            <div>
              <label htmlFor="slug" className="admin-label font-bold text-white">URL</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6b6b7a] font-mono shrink-0">/blog/</span>
                <input
                  id="slug"
                  type="text"
                  placeholder="e.g. heic-to-jpg-guide"
                  value={slug || ""}
                  onChange={(e) => {
                    const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                    setSlug(newSlug);
                    saveDraftToLocalStorage({ slug: newSlug });
                  }}
                  required
                  className="admin-input font-mono text-xs"
                />
              </div>
            </div>

            {/* Content WYSIWYG Editor area */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="admin-label m-0 font-bold text-white flex items-center gap-1.5">
                  Article Body & Content
                </label>
                <button
                  type="button"
                  onClick={toggleEditorMode}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-indigo-300 hover:bg-white/10 transition-all cursor-pointer"
                >
                  {editorMode === "visual" ? (
                    <>
                      <Code size={13} /> Edit Markdown Code
                    </>
                  ) : (
                    <>
                      <Eye size={13} /> Use Visual Editor
                    </>
                  )}
                </button>
              </div>

              {editorMode === "visual" ? (
                <div>
                  {/* WordPress Classic & Gutenberg Style Toolbar */}
                  <div className="editor-toolbar">
                    {!showLinkInput ? (
                      <>
                        {/* Group 1: Block Type Selector Dropdown */}
                        <div className="editor-toolbar-group">
                          <select 
                            className="editor-select"
                            defaultValue=""
                            onChange={handleBlockTypeChange}
                            title="Choose text formatting block"
                          >
                            <option value="" disabled>Block Style...</option>
                            <option value="p">Paragraph</option>
                            <option value="h2">Heading 2 (H2)</option>
                            <option value="h3">Heading 3 (H3)</option>
                            <option value="h4">Heading 4 (H4)</option>
                            <option value="blockquote">Quote Block</option>
                            <option value="callout">💡 Callout Tip Box</option>
                            <option value="codeblock">💻 Code Snippet</option>
                          </select>
                        </div>

                        <div className="editor-toolbar-divider" />

                        {/* Group 2: Text Styling */}
                        <div className="editor-toolbar-group">
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("bold")} className="editor-btn" title="Bold (Ctrl+B)">
                            <Bold size={14} />
                          </button>
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("italic")} className="editor-btn" title="Italic (Ctrl+I)">
                            <Italic size={14} />
                          </button>
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("underline")} className="editor-btn" title="Underline (Ctrl+U)">
                            <Underline size={14} />
                          </button>
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("strikeThrough")} className="editor-btn" title="Strikethrough">
                            <Strikethrough size={14} />
                          </button>
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("hiliteColor", "#f59e0b40")} className="editor-btn text-amber-400" title="Highlight Text">
                            <Sparkles size={14} />
                          </button>
                        </div>

                        <div className="editor-toolbar-divider" />

                        {/* Group 3: Alignment */}
                        <div className="editor-toolbar-group">
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("justifyLeft")} className="editor-btn" title="Align Left">
                            <AlignLeft size={14} />
                          </button>
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("justifyCenter")} className="editor-btn" title="Align Center">
                            <AlignCenter size={14} />
                          </button>
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("justifyRight")} className="editor-btn" title="Align Right">
                            <AlignRight size={14} />
                          </button>
                        </div>

                        <div className="editor-toolbar-divider" />

                        {/* Group 4: Lists & Dividers */}
                        <div className="editor-toolbar-group">
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("insertUnorderedList")} className="editor-btn" title="Bullet List">
                            <List size={14} />
                          </button>
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("insertOrderedList")} className="editor-btn" title="Numbered List">
                            <ListOrdered size={14} />
                          </button>
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("insertHorizontalRule")} className="editor-btn" title="Horizontal Divider Line">
                            <Minus size={14} />
                          </button>
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={startLinkFlow} className="editor-btn" title="Insert Link">
                            <LinkIcon size={14} />
                          </button>
                        </div>

                        <div className="editor-toolbar-divider" />

                        {/* Group 5: WordPress Media & Special Blocks */}
                        <div className="editor-toolbar-group">
                          <button 
                            type="button" 
                            onClick={() => setShowMediaModal(true)} 
                            className="editor-btn text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/40"
                            title="Add Image to Content Body"
                          >
                            <ImageIcon size={14} className="mr-1" /> Add Media
                          </button>
                          <button type="button" onClick={() => insertBlock("callout")} className="editor-btn text-amber-300" title="Add Callout Box">
                            💡 Tip Box
                          </button>
                          <button type="button" onClick={() => insertBlock("table")} className="editor-btn" title="Insert Comparison Table">
                            <Table size={14} />
                          </button>
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("removeFormat")} className="editor-btn text-red-400" title="Clear Formatting">
                            ✕
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 px-1 py-0.5 w-full max-w-lg">
                        <LinkIcon size={14} className="text-indigo-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Paste or type URL (e.g. https://convertgalaxy.com)..."
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          className="bg-[#1e1e2a] border border-white/10 rounded px-2.5 py-1 text-xs text-white placeholder-white/35 flex-grow outline-none focus:border-indigo-500 transition-all"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              applyLink();
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              cancelLink();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={applyLink}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold cursor-pointer transition-all shrink-0"
                        >
                          Apply Link
                        </button>
                        <button
                          type="button"
                          onClick={cancelLink}
                          className="text-[#9494a3] hover:text-white text-xs px-2 py-1 cursor-pointer transition-all shrink-0"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Gutenberg Quick Action Block Inserter Bar */}
                  <div className="block-inserter-bar">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b6b7a] mr-1 shrink-0">
                      + Quick Blocks:
                    </span>
                    <button type="button" onClick={() => insertBlock("heading")} className="block-chip">
                      <Heading2 size={12} className="text-indigo-400" /> Heading 2
                    </button>
                    <button type="button" onClick={() => insertBlock("subheading")} className="block-chip">
                      <Heading3 size={12} className="text-indigo-400" /> Heading 3
                    </button>
                    <button type="button" onClick={() => insertBlock("image")} className="block-chip">
                      <ImageIcon size={12} className="text-emerald-400" /> In-Body Image
                    </button>
                    <button type="button" onClick={() => insertBlock("quote")} className="block-chip">
                      <Quote size={12} className="text-purple-400" /> Quote
                    </button>
                    <button type="button" onClick={() => insertBlock("callout")} className="block-chip">
                      <span>💡</span> Tip Box
                    </button>
                    <button type="button" onClick={() => insertBlock("table")} className="block-chip">
                      <Table size={12} className="text-cyan-400" /> Table
                    </button>
                    <button type="button" onClick={() => insertBlock("code")} className="block-chip">
                      <Code size={12} className="text-amber-400" /> Code Snippet
                    </button>
                    <button type="button" onClick={() => insertBlock("faq-schema")} className="block-chip border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20">
                      <FileCode size={12} className="text-amber-400" /> HTML / FAQ Schema
                    </button>
                    <button type="button" onClick={() => insertBlock("divider")} className="block-chip">
                      <Minus size={12} className="text-gray-400" /> Divider
                    </button>
                    <button type="button" onClick={() => setShowShortcutsModal(true)} className="block-chip bg-indigo-500/10 text-indigo-300 border-indigo-500/30 ml-auto cursor-pointer">
                      ⌨️ Shortcuts
                    </button>
                  </div>

                  {/* Visual Content Editable */}
                  <div className="relative">
                    {/* Floating WordPress Selection Toolbar (appears on highlighting text) */}
                    {showSelectionToolbar && (
                      <div 
                        className="absolute z-40 bg-[#161622] border border-indigo-500/40 rounded-xl p-1.5 shadow-2xl flex items-center gap-1 text-xs text-white backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                        style={{ top: `${selectionToolbarPos.top}px`, left: `${selectionToolbarPos.left}px` }}
                      >
                        {isInlineLinkInputOpen ? (
                          <div className="flex items-center gap-1.5 p-0.5">
                            <input
                              type="text"
                              value={inlineLinkUrl}
                              onChange={(e) => setInlineLinkUrl(e.target.value)}
                              placeholder="Paste or type URL..."
                              className="bg-[#1e1e2a] border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-indigo-500 w-60 font-mono"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  applyInlineSelectionLink(inlineLinkUrl);
                                } else if (e.key === "Escape") {
                                  e.preventDefault();
                                  setIsInlineLinkInputOpen(false);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => applyInlineSelectionLink(inlineLinkUrl)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-[11px] cursor-pointer"
                            >
                              Apply Link
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsInlineLinkInputOpen(false)}
                              className="px-2 py-1 text-[#9494a3] hover:text-white text-[11px] cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleFormat("bold")}
                              className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white font-bold cursor-pointer min-w-[28px]"
                              title="Bold (Ctrl+B)"
                            >
                              B
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFormat("italic")}
                              className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white italic cursor-pointer min-w-[28px]"
                              title="Italic (Ctrl+I)"
                            >
                              I
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFormat("underline")}
                              className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white underline cursor-pointer min-w-[28px]"
                              title="Underline (Ctrl+U)"
                            >
                              U
                            </button>
                            <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
                            <button
                              type="button"
                              onClick={() => {
                                setIsInlineLinkInputOpen(true);
                                setInlineLinkUrl("");
                              }}
                              className="p-1.5 hover:bg-indigo-500/20 text-indigo-300 hover:text-white rounded flex items-center gap-1 font-medium cursor-pointer"
                              title="Add Hyperlink (Ctrl+K)"
                            >
                              <LinkIcon size={13} /> Link
                            </button>
                            <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
                            <button
                              type="button"
                              onClick={() => handleFormat("formatBlock", "<h2>")}
                              className="p-1.5 hover:bg-white/10 rounded text-indigo-400 hover:text-white font-bold cursor-pointer text-[11px]"
                              title="Heading 2"
                            >
                              H2
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFormat("formatBlock", "<h3>")}
                              className="p-1.5 hover:bg-white/10 rounded text-indigo-400 hover:text-white font-bold cursor-pointer text-[11px]"
                              title="Heading 3"
                            >
                              H3
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFormat("strikeThrough")}
                              className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white line-through cursor-pointer text-[11px]"
                              title="Strikethrough"
                            >
                              S
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFormat("removeFormat")}
                              className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white cursor-pointer text-[11px]"
                              title="Clear Format"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    <VisualEditorContainer 
                      initialHtml={initialHtmlContent} 
                      editorRef={editorRef} 
                      onContentChange={handleEditorInput}
                      onKeyDown={handleKeyDown}
                      onClick={handleEditorClick}
                      onSelect={handleSelectionChange}
                    />

                    {/* Floating WordPress Inline Link Popover */}
                    {showLinkPopover && (
                      <div 
                        className="absolute z-30 bg-[#161622] border border-indigo-500/40 rounded-xl p-2 shadow-2xl flex items-center gap-2 text-xs text-white backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                        style={{ top: `${linkPopoverPos.top}px`, left: `${linkPopoverPos.left}px` }}
                      >
                        {isEditingLinkPopover ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={linkUrl}
                              onChange={(e) => setLinkUrl(e.target.value)}
                              placeholder="Paste or type URL..."
                              className="bg-[#1e1e2a] border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-indigo-500 w-56"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleUpdateLinkUrl(linkUrl);
                                } else if (e.key === "Escape") {
                                  e.preventDefault();
                                  setIsEditingLinkPopover(false);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateLinkUrl(linkUrl)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold text-[11px] cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEditingLinkPopover(false)}
                              className="px-2 py-1 text-[#9494a3] hover:text-white text-[11px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-indigo-300 font-mono text-[11px] max-w-[180px] truncate underline">
                              {linkUrl}
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEditingLinkPopover(true)}
                              className="px-2 py-1 hover:bg-white/10 rounded text-indigo-300 hover:text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                              title="Edit Link URL"
                            >
                              ✏️ Edit
                            </button>
                            <a
                              href={linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 hover:bg-white/10 rounded text-cyan-300 hover:text-white font-semibold text-[11px] no-underline flex items-center gap-1 cursor-pointer"
                              title="Open Link in New Tab"
                            >
                              ↗️ Open
                            </a>
                            <button
                              type="button"
                              onClick={handleRemoveLink}
                              className="px-2 py-1 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                              title="Remove Link (Unlink)"
                            >
                              🗑️ Unlink
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Word Count & Reading Stats Bar */}
                  <div className="flex items-center justify-between px-3 py-2 bg-[#12121c] border border-t-0 border-[#2a2a38] rounded-b-xl text-xs text-[#9494a3]">
                    <div className="flex items-center gap-4">
                      <span>📝 <strong>{stats.words}</strong> words</span>
                      <span>🔤 <strong>{stats.chars}</strong> characters</span>
                      <span>⏱️ <strong>~{stats.readTime}</strong> min read</span>
                    </div>
                    <span className="text-[10px] text-[#6b6b7a]">Blog Editor Engine Active</span>
                  </div>
                </div>
              ) : (
                <div>
                  <textarea
                    className="editor-content-area font-mono text-sm leading-relaxed"
                    style={{ minHeight: "420px" }}
                    value={markdownContent}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMarkdownContent(val);
                      calculateStats(val);
                      const parsedHtml = markdownToHtml(val);
                      setHtmlContent(parsedHtml);
                      setInitialHtmlContent(parsedHtml);
                      saveDraftToLocalStorage({ markdownContent: val, htmlContent: parsedHtml });
                    }}
                    placeholder="# Write your raw markdown here..."
                  />
                  <div className="flex items-center justify-between px-3 py-2 bg-[#12121c] border border-t-0 border-[#2a2a38] rounded-b-xl text-xs text-[#9494a3]">
                    <div className="flex items-center gap-4">
                      <span>📝 <strong>{stats.words}</strong> words</span>
                      <span>🔤 <strong>{stats.chars}</strong> characters</span>
                      <span>⏱️ <strong>~{stats.readTime}</strong> min read</span>
                    </div>
                    <span className="text-[10px] text-[#6b6b7a]">Raw Markdown Code Mode</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Settings Column (1/3 width) - WordPress Document Settings */}
        <div className="space-y-6">
          
          {/* Action Panel */}
          <div className="admin-card space-y-4">
            <h3 className="font-['Outfit'] font-bold text-base text-white border-b border-white/6 pb-2 mb-4">
              Publish Settings
            </h3>

            {/* Status Selector */}
            <div>
              <label htmlFor="status" className="admin-label">Publish Status</label>
              <select
                id="status"
                value={status || "Draft"}
                onChange={(e) => {
                  setStatus(e.target.value);
                  saveDraftToLocalStorage({ status: e.target.value });
                }}
                className="admin-select"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            {/* Date Field */}
            <div>
              <label htmlFor="date" className="admin-label">Publish Date</label>
              <input
                id="date"
                type="date"
                value={date || ""}
                onChange={(e) => {
                  setDate(e.target.value);
                  saveDraftToLocalStorage({ date: e.target.value });
                }}
                required
                className="admin-input"
              />
            </div>

            {/* Author Field */}
            <div>
              <label htmlFor="author" className="admin-label">Author Name</label>
              <input
                id="author"
                type="text"
                placeholder="Convert Galaxy Team"
                value={author || ""}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  saveDraftToLocalStorage({ author: e.target.value });
                }}
                className="admin-input"
              />
            </div>

            {/* Live Auto-Save Status */}
            <div className="flex items-center justify-between text-xs text-[#9494a3] bg-white/5 p-2.5 rounded-xl border border-white/10 my-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{lastAutoSaveTime ? `Auto-saved at ${lastAutoSaveTime}` : "Auto-save active"}</span>
              </div>
              {availableDraft && (
                <button
                  type="button"
                  onClick={() => handleRestoreDraft()}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline text-[11px] cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw size={11} /> Restore
                </button>
              )}
            </div>

            {/* Save & Draft Buttons */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary w-full justify-center py-2.5 text-xs font-bold cursor-pointer"
              >
                {saving ? "Saving Article..." : initialSlug ? "Save / Publish Article" : "Publish Article"}
              </button>

              <button
                type="button"
                onClick={handleManualSaveDraft}
                className="w-full py-2 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                💾 Save Draft
              </button>

              {availableDraft && (
                <button
                  type="button"
                  onClick={() => handleRestoreDraft()}
                  className="w-full py-2 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 animate-pulse"
                >
                  <RotateCcw size={13} /> Restore Draft
                </button>
              )}

              <Link href="/admin/blog" className="no-underline w-full">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary w-full justify-center py-2 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </div>

          {/* Featured Cover Image Card */}
          <div className="admin-card space-y-4">
            <h3 className="font-['Outfit'] font-bold text-base text-white border-b border-white/6 pb-2 mb-4">
              Featured Cover Image
            </h3>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="imageTitle" className="admin-label m-0">SEO Image Title</label>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUploadChange}
                accept="image/*"
                className="hidden"
              />
              <input
                id="imageTitle"
                type="text"
                placeholder="e.g. heic-converter-guide-cover"
                value={imageTitle || ""}
                onChange={(e) => setImageTitle(e.target.value)}
                className="admin-input text-xs mb-3"
              />
              
              {/* Cover Image Preview (16:9 Aspect Ratio) */}
              <div className="relative aspect-[16/9] w-full rounded-xl border border-white/5 bg-[#090915] overflow-hidden flex items-center justify-center select-none">
                {uploadingImage ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-[#cbd5e1] space-y-2">
                    <Loader2 className="animate-spin text-[#8b5cf6]" size={20} />
                    <span className="text-[10px] font-semibold tracking-wider uppercase font-['Outfit']">Uploading Cover Image...</span>
                  </div>
                ) : (uploadedImageSrc || coverImage) ? (
                  <div className="relative w-full h-full group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadedImageSrc || coverImage}
                      alt={imageAlt || "Cover Preview"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div 
                      onClick={handleImageUploadClick}
                      className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-150 cursor-pointer text-xs font-bold uppercase tracking-wider text-indigo-300"
                    >
                      <UploadCloud size={20} className="animate-bounce" />
                      <span>Change Cover Image</span>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={handleImageUploadClick}
                    className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-[#6b6b7a] hover:text-indigo-400 hover:bg-white/[0.01] border border-dashed border-[#2a2a38] rounded-xl cursor-pointer space-y-2 group transition-all duration-150"
                  >
                    <UploadCloud size={22} className="text-[#8b5cf6] group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase font-['Outfit'] block">Upload Cover Image</span>
                      <span className="text-[8px] text-[#6b6b7a] block mt-0.5">Supports PNG, JPG, WebP, HEIC</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Alt Text */}
            <div>
              <label htmlFor="imageAlt" className="admin-label">Image Alt Text (SEO Alt Tag)</label>
              <input
                id="imageAlt"
                type="text"
                placeholder="e.g. Step-by-step HEIC image conversion screenshot"
                value={imageAlt || ""}
                onChange={(e) => {
                  setImageAlt(e.target.value);
                  saveDraftToLocalStorage({ imageAlt: e.target.value });
                }}
                className="admin-input"
              />
            </div>
          </div>

          {/* SEO Metadata Card */}
          <div className="admin-card space-y-4">
            <h3 className="font-['Outfit'] font-bold text-base text-white border-b border-white/6 pb-2 mb-4">
              SEO Parameters
            </h3>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="description" className="admin-label m-0">Meta Description</label>
                <span className={`text-xs font-mono ${getDescCounterClass()}`}>
                  {descCharCount}/160
                </span>
              </div>
              <textarea
                id="description"
                rows={3}
                placeholder="Google index snippet summary for readers..."
                value={description || ""}
                onChange={(e) => {
                  setDescription(e.target.value);
                  saveDraftToLocalStorage({ description: e.target.value });
                }}
                required
                className="admin-input text-xs"
              />
            </div>

            {/* Focus Keyword */}
            <div>
              <label htmlFor="focusKeyword" className="admin-label">Focus Keyword</label>
              <input
                id="focusKeyword"
                type="text"
                placeholder="e.g. heic to jpg"
                value={focusKeyword || ""}
                onChange={(e) => {
                  setFocusKeyword(e.target.value);
                  saveDraftToLocalStorage({ focusKeyword: e.target.value });
                }}
                className="admin-input"
              />
            </div>

            {/* Yoast/RankMath-like SEO content score analysis */}
            {focusKeyword.trim() && (
              <div className="p-3.5 bg-white/[0.02] border border-[#2a2a38] rounded-xl space-y-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-1.5">
                  🔍 SEO Content Score
                </h4>
                <div className="space-y-2 text-xs">
                  {getSeoAnalysis().map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className={`shrink-0 mt-0.5 font-bold ${item.pass ? "text-emerald-500" : "text-[#6b6b7a]"}`}>
                        {item.pass ? "✓" : "○"}
                      </span>
                      <span className={item.pass ? "text-[#f8fafc]" : "text-[#9494a3]"}>
                        {item.label} {!item.pass && <span className="text-[10px] text-[#6b6b7a] block mt-0.5">{item.feedback}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Google SERP Preview Widget */}
          <div className="admin-card space-y-3">
            <h3 className="font-['Outfit'] font-bold text-base text-white border-b border-white/6 pb-2 mb-3">
              Google SERP Simulator
            </h3>
            <div className="seo-preview-card text-left">
              <div className="seo-preview-url">
                https://www.convertgalaxy.com/blog/{slug || "new-guide"}
              </div>
              <div className="seo-preview-title">
                {title || "Dynamic SEO Preview Title"}
              </div>
              <div className="seo-preview-desc">
                {description || "Meta description index content preview snippet. Write a rich explanation detailing target tools to attract page-click counts."}
              </div>
            </div>
          </div>

        </div>
      </form>

      {/* INSERT MEDIA / INLINE BODY IMAGE MODAL */}
      {showMediaModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#16161f] border border-[#2a2a38] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-left space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
              <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <ImageIcon className="text-indigo-400" size={18} />
                Insert Image into Article
              </h3>
              <button 
                type="button" 
                onClick={() => setShowMediaModal(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* File Upload Option */}
              <div>
                <label className="admin-label">Option A: Upload Image File</label>
                <input
                  type="file"
                  ref={bodyFileInputRef}
                  onChange={handleBodyImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => bodyFileInputRef.current?.click()}
                  disabled={uploadingBodyImage}
                  className="w-full py-2.5 px-4 bg-white/5 border border-dashed border-[#2a2a38] hover:border-indigo-500 rounded-xl text-xs font-semibold text-indigo-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {uploadingBodyImage ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Uploading Image...
                    </>
                  ) : (
                    <>
                      <UploadCloud size={16} /> Choose Image File to Upload
                    </>
                  )}
                </button>
              </div>

              {/* Or Paste URL */}
              <div>
                <label htmlFor="bodyImageUrl" className="admin-label">Option B: Image URL</label>
                <input
                  id="bodyImageUrl"
                  type="text"
                  placeholder="https://example.com/image.png"
                  value={bodyImageUrl}
                  onChange={(e) => setBodyImageUrl(e.target.value)}
                  className="admin-input text-xs"
                />
              </div>

              {/* Image Alt / Caption */}
              <div>
                <label htmlFor="bodyImageAlt" className="admin-label">Image Alt & Caption</label>
                <input
                  id="bodyImageAlt"
                  type="text"
                  placeholder="e.g. Screenshot of the tool interface"
                  value={bodyImageAlt}
                  onChange={(e) => setBodyImageAlt(e.target.value)}
                  className="admin-input text-xs"
                />
              </div>

              {/* Image Preview if available */}
              {bodyImageUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bodyImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#2a2a38]">
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="admin-btn admin-btn-secondary py-1.5 px-4 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmInsertBodyImage}
                disabled={!bodyImageUrl}
                className="admin-btn admin-btn-primary py-1.5 px-4 text-xs"
              >
                Insert into Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WORDPRESS STYLE INSERT TABLE MODAL */}
      {showTableModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#16161f] border border-[#2a2a38] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-left space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
              <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Table className="text-cyan-400" size={18} />
                Create Table (WordPress Style)
              </h3>
              <button 
                type="button" 
                onClick={() => setShowTableModal(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Columns Input */}
                <div>
                  <label htmlFor="tableCols" className="admin-label font-bold text-white">Columns Count</label>
                  <input
                    id="tableCols"
                    type="number"
                    min="1"
                    max="10"
                    value={tableCols}
                    onChange={(e) => setTableCols(e.target.value)}
                    className="admin-input font-mono text-sm"
                  />
                </div>

                {/* Rows Input */}
                <div>
                  <label htmlFor="tableRows" className="admin-label font-bold text-white">Rows Count</label>
                  <input
                    id="tableRows"
                    type="number"
                    min="1"
                    max="20"
                    value={tableRows}
                    onChange={(e) => setTableRows(e.target.value)}
                    className="admin-input font-mono text-sm"
                  />
                </div>
              </div>

              {/* Include Header Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  id="tableHasHeader"
                  type="checkbox"
                  checked={tableHasHeader}
                  onChange={(e) => setTableHasHeader(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="tableHasHeader" className="text-xs font-semibold text-[#cbd5e1] cursor-pointer">
                  Include Table Header Row (&lt;th&gt;)
                </label>
              </div>

              {/* Table Live Preview Grid */}
              <div className="p-3 bg-[#0c0c14] border border-white/5 rounded-xl text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#6b6b7a] tracking-wider block mb-1">
                  Grid Matrix Preview ({tableRows || 3} Rows × {tableCols || 3} Cols)
                </span>
                <div className="overflow-hidden border border-white/10 rounded-lg max-h-32">
                  <table className="w-full border-collapse text-[10px] text-gray-400">
                    {tableHasHeader && (
                      <thead className="bg-indigo-500/20 text-indigo-300 border-b border-white/10">
                        <tr>
                          {Array.from({ length: Math.min(6, parseInt(tableCols, 10) || 3) }).map((_, c) => (
                            <th key={c} className="p-1 border-r border-white/10">Header {c + 1}</th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {Array.from({ length: Math.min(3, parseInt(tableRows, 10) || 3) }).map((_, r) => (
                        <tr key={r} className="border-b border-white/5">
                          {Array.from({ length: Math.min(6, parseInt(tableCols, 10) || 3) }).map((_, c) => (
                            <td key={c} className="p-1 border-r border-white/5">Cell {r + 1}-{c + 1}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#2a2a38]">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="admin-btn admin-btn-secondary py-1.5 px-4 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTable}
                className="admin-btn admin-btn-primary py-1.5 px-4 text-xs cursor-pointer"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#16161f] border border-[#2a2a38] rounded-3xl p-6 max-w-md w-full text-left space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-['Outfit'] font-extrabold text-xl text-white flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={22} />
              Confirm Post Deletion
            </h3>
            <p className="text-sm text-[#cbd5e1] leading-relaxed">
              Are you sure you want to delete the blog post **"{initialSlug}"**? This action will permanently remove the article from the database.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="admin-btn admin-btn-secondary"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="admin-btn bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {saving ? "Deleting..." : "Yes, Delete File"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CROP COVER IMAGE MODAL (16:9) */}
      {showCropModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#16161f] border border-[#2a2a38] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-[#2a2a38] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">Crop Cover Image (16:9)</h3>
              <button 
                type="button" 
                onClick={() => setShowCropModal(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex flex-col items-center gap-4 bg-[#0f0f1a]">
              <div 
                ref={containerRef}
                className="relative w-full aspect-[16/9] bg-[#090912] border border-white/5 rounded-xl overflow-hidden cursor-grab select-none"
                onMouseDown={handleCropMouseDown}
                onMouseMove={handleCropMouseMove}
                onMouseUp={handleCropMouseUp}
                onMouseLeave={handleCropMouseUp}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={cropImgRef}
                  src={cropImageSrc}
                  alt="To Crop"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    transform: `translate(${cropOffset.x}px, ${cropOffset.y}px) scale(${cropScale})`,
                    transformOrigin: "top left",
                    transition: isDraggingCrop ? "none" : "transform 0.1s ease-out",
                    maxWidth: "none",
                  }}
                  draggable={false}
                  onLoad={() => {
                    if (cropImgRef.current && containerRef.current) {
                      const containerWidth = containerRef.current.clientWidth;
                      const containerHeight = containerRef.current.clientHeight;
                      const img = cropImgRef.current;
                      const naturalRatio = img.naturalWidth / img.naturalHeight;
                      
                      let startWidth, startHeight;
                      if (naturalRatio > 16/9) {
                        startHeight = containerHeight;
                        startWidth = startHeight * naturalRatio;
                      } else {
                        startWidth = containerWidth;
                        startHeight = startWidth / naturalRatio;
                      }
                      
                      img.style.width = `${startWidth}px`;
                      img.style.height = `${startHeight}px`;
                      
                      const initialX = (containerWidth - startWidth) / 2;
                      const initialY = (containerHeight - startHeight) / 2;
                      setCropOffset({ x: initialX, y: initialY });
                    }
                  }}
                />
                <div className="absolute inset-0 border-2 border-indigo-500/30 pointer-events-none rounded-xl">
                  <div className="absolute inset-x-0 top-1/3 border-t border-white/10" />
                  <div className="absolute inset-x-0 top-2/3 border-t border-white/10" />
                  <div className="absolute inset-y-0 left-1/3 border-l border-white/10" />
                  <div className="absolute inset-y-0 left-2/3 border-l border-white/10" />
                </div>
              </div>
              
              <span className="text-[10px] text-gray-400">💡 Drag the image inside the frame to adjust the position.</span>

              <div className="w-full flex items-center gap-3 mt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase font-['Outfit']">Zoom</span>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.05"
                  value={cropScale}
                  onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                  className="flex-1 accent-[#8b5cf6] cursor-ew-resize bg-white/10 h-1 rounded-lg outline-none"
                />
                <span className="text-[10px] font-bold text-gray-300 font-mono w-8 text-right">
                  {Math.round(cropScale * 100)}%
                </span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#2a2a38] flex items-center justify-end gap-3 bg-[#16161f]">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 border border-white/10 text-xs font-semibold text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropSubmit}
                className="px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-xs font-bold text-white rounded-lg transition-colors shadow-lg cursor-pointer"
              >
                Crop & Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KEYBOARD SHORTCUTS MODAL */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#16161f] border border-[#2a2a38] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-left space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
              <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                ⌨️ WordPress Keyboard Shortcuts
              </h3>
              <button 
                type="button" 
                onClick={() => setShowShortcutsModal(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Bold</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Ctrl + B</kbd></div>
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Italic</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Ctrl + I</kbd></div>
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Underline</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Ctrl + U</kbd></div>
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Insert Link</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Ctrl + K</kbd></div>
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Strikethrough</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Ctrl+Shift+X</kbd></div>
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Save Article</span> <kbd className="bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded font-mono text-[10px]">Ctrl + S</kbd></div>
              </div>

              <h4 className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider pt-2">Structure & Headings</h4>
              <div className="grid grid-cols-2 gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Heading 1</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Alt+Shift+1</kbd></div>
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Heading 2</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Alt+Shift+2</kbd></div>
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Heading 3</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Alt+Shift+3</kbd></div>
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Heading 4</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Alt+Shift+4</kbd></div>
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Bullet List</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Alt+Shift+U</kbd></div>
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Numbered List</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Alt+Shift+O</kbd></div>
                <div className="flex justify-between items-center text-white"><span className="text-[#9494a3]">Quote Block</span> <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">Alt+Shift+Q</kbd></div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#2a2a38]">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="admin-btn admin-btn-primary py-1.5 px-4 text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WORDPRESS CUSTOM HTML & FAQ SCHEMA (JSON-LD) MODAL */}
      {showCustomHtmlModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161622] border border-indigo-500/30 rounded-3xl p-6 max-w-2xl w-full text-left space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-['Outfit'] font-extrabold text-xl text-white flex items-center gap-2">
                <FileCode className="text-amber-400" size={22} />
                WordPress Custom HTML / FAQ Schema (JSON-LD)
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomHtmlModal(false)}
                className="text-[#9494a3] hover:text-white transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Quick Templates & Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0d0d18] p-2.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrefillFaqJson}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    customHtmlTab === "faq-json"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white/5 text-[#cbd5e1] hover:bg-white/10"
                  }`}
                >
                  ⚡ FAQ Schema (JSON-LD)
                </button>
                <button
                  type="button"
                  onClick={handlePrefillFaqAccordion}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    customHtmlTab === "custom-html"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white/5 text-[#cbd5e1] hover:bg-white/10"
                  }`}
                >
                  📋 HTML Accordion FAQ
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomHtmlPreview(false)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    !customHtmlPreview ? "bg-white/15 text-white" : "text-[#9494a3] hover:text-white"
                  }`}
                >
                  HTML Code
                </button>
                <button
                  type="button"
                  onClick={() => setCustomHtmlPreview(true)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    customHtmlPreview ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-[#9494a3] hover:text-white"
                  }`}
                >
                  👁️ Live Preview
                </button>
              </div>
            </div>

            {/* Content Editor / Live Preview Box */}
            {!customHtmlPreview ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9494a3] flex items-center justify-between">
                  <span>Enter Raw HTML or JSON-LD Script tag:</span>
                  <span className="text-[11px] text-amber-400">Allowed: &lt;script type="application/ld+json"&gt;, &lt;details&gt;, &lt;div&gt;, &lt;iframe&gt;</span>
                </label>
                <textarea
                  rows={10}
                  value={customHtmlCode}
                  onChange={(e) => setCustomHtmlCode(e.target.value)}
                  placeholder="Paste or write your HTML code or JSON-LD FAQ schema script here..."
                  className="w-full bg-[#090912] border border-indigo-500/20 rounded-xl p-4 text-xs font-mono text-cyan-300 outline-none focus:border-indigo-500 transition-colors leading-relaxed shadow-inner"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-emerald-400 block">Live Preview Output:</span>
                <div className="bg-[#090912] border border-white/10 rounded-xl p-4 max-h-60 overflow-y-auto">
                  {customHtmlCode.includes('type="application/ld+json"') ? (
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs font-mono">
                      <span className="font-bold text-white block mb-1">⚡ Valid JSON-LD FAQ Schema Tag Detected</span>
                      <span>Googlebot will execute this structured data tag automatically for search result FAQ snippets.</span>
                    </div>
                  ) : (
                    <div
                      className="text-left text-white text-sm"
                      dangerouslySetInnerHTML={{ __html: customHtmlCode }}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-[#2a2a38]">
              <button
                type="button"
                onClick={() => setShowCustomHtmlModal(false)}
                className="admin-btn admin-btn-secondary py-1.5 px-4 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertCustomHtml}
                disabled={!customHtmlCode.trim()}
                className="admin-btn admin-btn-primary py-1.5 px-4 text-xs cursor-pointer disabled:opacity-50"
              >
                Insert Block into Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
