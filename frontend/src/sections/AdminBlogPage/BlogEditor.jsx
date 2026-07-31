"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Trash, Check, AlertTriangle, Eye, Code, ArrowLeft, Loader2, UploadCloud, Minus } from "lucide-react";
import Link from "next/link";

// Custom client-side HTML-to-Markdown parser for saving
function htmlToMarkdown(html) {
  if (!html) return "";
  let md = html;
  
  // Replace bold
  md = md.replace(/<strong>(.*?)<\/strong>/g, "**$1**");
  md = md.replace(/<b>(.*?)<\/b>/g, "**$1**");
  
  // Replace italic
  md = md.replace(/<em>(.*?)<\/em>/g, "*$1*");
  md = md.replace(/<i>(.*?)<\/i>/g, "*$1*");
  
  // Replace headings
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/g, "\n\n#### $1\n\n");
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/g, "\n\n### $1\n\n");
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/g, "\n\n## $1\n\n");
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/g, "\n\n# $1\n\n");
  
  // Replace ordered lists (<ol> ... </ol>)
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (match, olContent) => {
    let index = 1;
    return "\n" + olContent.replace(/<li[^>]*>(.*?)<\/li>/g, (liMatch, liText) => {
      return `\n${index++}. ${liText}`;
    }) + "\n";
  });

  // Replace unordered lists (<ul> ... </ul>)
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, ulContent) => {
    return "\n" + ulContent.replace(/<li[^>]*>(.*?)<\/li>/g, "\n- $1") + "\n";
  });
  
  // Replace paragraphs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/g, "\n\n$1\n\n");
  
  // Replace links
  md = md.replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/g, "[$2]($1)");
  
  // Replace horizontal rules
  md = md.replace(/<hr[^>]*>/g, "\n\n---\n\n");

  // Replace line breaks
  md = md.replace(/<br\s*\/?>/g, "\n");
  
  // Clean up multiple newlines
  md = md.replace(/\n\n+/g, "\n\n");
  
  return md.trim();
}

// Custom client-side Markdown-to-HTML parser for loading
function markdownToHtml(md) {
  if (!md) return "";
  let html = md.replace(/\r\n/g, "\n");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Monospace
  html = html.replace(/`(.*?)`/g, '<code class="bg-white/5 px-1.5 py-0.5 rounded text-indigo-300">$1</code>');
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  const lines = html.split(/\n\n+/);
  const processed = [];
  let insideList = false; // can be false, "ul", or "ol"

  for (let block of lines) {
    block = block.trim();
    if (!block) continue;

    if (block.startsWith("#### ")) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push(`<h4>${block.slice(5)}</h4>`);
    } else if (block.startsWith("### ")) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push(`<h3>${block.slice(4)}</h3>`);
    } else if (block.startsWith("## ")) {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push(`<h2>${block.slice(3)}</h2>`);
    } else if (block.startsWith("- ")) {
      if (insideList && insideList !== "ul") {
        processed.push(`</${insideList}>`);
        insideList = false;
      }
      if (!insideList) {
        processed.push("<ul>");
        insideList = "ul";
      }
      const listItems = block.split(/\n- /);
      listItems.forEach(item => {
        let clean = item.trim();
        if (clean.startsWith("- ")) clean = clean.slice(2);
        if (clean) processed.push(`<li>${clean}</li>`);
      });
    } else if (/^\d+\.\s/.test(block)) {
      if (insideList && insideList !== "ol") {
        processed.push(`</${insideList}>`);
        insideList = false;
      }
      if (!insideList) {
        processed.push("<ol>");
        insideList = "ol";
      }
      const listItems = block.split(/\n\d+\.\s/);
      listItems.forEach(item => {
        let clean = item.trim();
        if (/^\d+\.\s/.test(clean)) {
          clean = clean.replace(/^\d+\.\s/, "");
        }
        if (clean) processed.push(`<li>${clean}</li>`);
      });
    } else if (block === "---") {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push('<hr class="border-t border-white/10 my-8" />');
    } else {
      if (insideList) { processed.push(`</${insideList}>`); insideList = false; }
      processed.push(`<p>${block.replace(/\n/g, "<br />")}</p>`);
    }
  }

  if (insideList) processed.push(`</${insideList}>`);
  return processed.join("\n");
}

const VisualEditorContainer = React.memo(({ initialHtml, editorRef }) => {
  return (
    <div
      ref={editorRef}
      className="editor-content-area text-left"
      contentEditable
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{ __html: initialHtml }}
    />
  );
}, (prevProps, nextProps) => {
  return prevProps.initialHtml === nextProps.initialHtml;
});

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
  
  // Editor mode: "visual" or "code" (markdown)
  const [editorMode, setEditorMode] = useState("visual");
  const [markdownContent, setMarkdownContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [initialHtmlContent, setInitialHtmlContent] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [localPreviewUrl, setLocalPreviewUrl] = useState(""); // instant local preview
  const fileInputRef = useRef(null);

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

  // Image Drag-Clamping utility
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

    // Horizontal limit
    let clampedX = x;
    if (renderedWidth >= containerWidth) {
      const minX = containerWidth - renderedWidth;
      clampedX = Math.min(0, Math.max(minX, x));
    } else {
      const limitX = containerWidth - renderedWidth;
      clampedX = Math.min(limitX, Math.max(0, x));
    }

    // Vertical limit
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

  // Dragging event handlers
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

  // Image Crop execution and upload
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
            if (!imageAlt) {
              setImageAlt(`${title || focusKeyword || "cover image"} illustration`);
            }
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
    if (!initialSlug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/-+/g, "-"); // Collapse multiple dashes
      setSlug(generated);
    }
  };

  // Fetch initial post data if editing
  useEffect(() => {
    if (initialSlug) {
      setLoading(true);
      fetch(`/api/admin/blog/${initialSlug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.post) {
            const { frontmatter, content, htmlContent: serverHtml } = data.post;
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
      // Set current date by default for new post
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [initialSlug]);

  // Sync content when switching modes
  const toggleEditorMode = () => {
    if (editorMode === "visual") {
      // Visual -> Code: parse HTML to markdown
      const currentHtml = editorRef.current ? editorRef.current.innerHTML : htmlContent;
      const parsedMd = htmlToMarkdown(currentHtml);
      setMarkdownContent(parsedMd);
      setEditorMode("code");
    } else {
      // Code -> Visual: parse markdown to HTML
      const parsedHtml = markdownToHtml(markdownContent);
      setHtmlContent(parsedHtml);
      setInitialHtmlContent(parsedHtml);
      setEditorMode("visual");
    }
  };

  // ContentEditable formatting commands
  const handleFormat = (command, value = null) => {
    if (editorMode !== "visual") return;
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const startLinkFlow = () => {
    if (editorMode !== "visual") return;
    
    // Save current selection range before focus moves to input box
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
    } else {
      setSavedRange(null);
    }
    
    setShowLinkInput(true);
  };

  const applyLink = () => {
    // Restore selection range
    if (savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
    } else if (editorRef.current) {
      editorRef.current.focus();
    }

    if (linkUrl.trim()) {
      document.execCommand("createLink", false, linkUrl.trim());
    }
    
    setLinkUrl("");
    setShowLinkInput(false);
    setSavedRange(null);
  };

  const cancelLink = () => {
    setLinkUrl("");
    setShowLinkInput(false);
    setSavedRange(null);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Form submission / save operation
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    let finalContent = markdownContent;
    if (editorMode === "visual" && editorRef.current) {
      finalContent = htmlToMarkdown(editorRef.current.innerHTML);
    }

    const payload = {
      slug,
      title,
      description,
      date,
      focusKeyword,
      relatedToolSlug: focusKeyword ? focusKeyword.toLowerCase().replace(/\s+/g, "-") : "",
      image: coverImage,
      imageAlt,
      imageTitle,
      author,
      status,
      content: finalContent,
    };

    try {
      const url = initialSlug ? `/api/admin/blog/${initialSlug}` : "/api/admin/blog";
      const method = initialSlug ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        setSuccessMsg(initialSlug ? "Changes saved successfully!" : "New blog post published successfully!");
        if (!initialSlug) {
          setTimeout(() => {
            router.push("/admin/blog");
          }, 1500);
        }
      } else {
        setErrorMsg(resData.error || "Failed to save the post.");
      }
    } catch (err) {
      setErrorMsg("Error submitting data to server.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Delete operation
  const handleDelete = async () => {
    if (!initialSlug) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/${initialSlug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
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

    // Check headings (in markdown, lines starting with #)
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/blog" className="inline-flex items-center gap-1 text-indigo-400 no-underline text-xs mb-2 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
          <h1 className="font-['Outfit'] font-black text-2xl md:text-3xl text-white">
            {initialSlug ? `Edit Post: ${initialSlug}` : "Create New Post"}
          </h1>
        </div>

        <div className="flex gap-3">
          {initialSlug && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="admin-btn admin-btn-danger"
              type="button"
            >
              <Trash size={16} /> Delete Post
            </button>
          )}
        </div>
      </div>

      {/* Alert Notices */}
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
                <label htmlFor="title" className="admin-label m-0">Post Title</label>
                <span className={`text-xs font-mono ${getTitleCounterClass()}`}>
                  {titleCharCount}/60
                </span>
              </div>
              <input
                id="title"
                type="text"
                placeholder="e.g. How to convert HEIC to JPG easily"
                value={title || ""}
                onChange={handleTitleChange}
                required
                className="admin-input"
              />
            </div>

            {/* Slug field */}
            <div>
              <label htmlFor="slug" className="admin-label">Slug Path</label>
              <input
                id="slug"
                type="text"
                placeholder="e.g. heic-to-jpg-guide"
                value={slug || ""}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                required
                disabled={!!initialSlug} // Lock slug modification on edit
                className="admin-input disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Content WYSIWYG Editor area */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="admin-label m-0">Article Content</label>
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
                  {/* Toolbar */}
                  <div className="editor-toolbar">
                    {!showLinkInput ? (
                      <>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("bold")} className="editor-btn" title="Bold text">
                          <Bold size={15} />
                        </button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("italic")} className="editor-btn" title="Italic text">
                          <Italic size={15} />
                        </button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("underline")} className="editor-btn" title="Underline text">
                          <Underline size={15} />
                        </button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("formatBlock", "<h2>")} className="editor-btn" title="Heading 2">
                          <Heading2 size={15} />
                        </button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("formatBlock", "<h3>")} className="editor-btn" title="Heading 3">
                          <Heading3 size={15} />
                        </button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("formatBlock", "<h4>")} className="editor-btn font-extrabold text-[10px]" title="Heading 4">
                          H4
                        </button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("insertUnorderedList")} className="editor-btn" title="Bullet List">
                          <List size={15} />
                        </button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("insertOrderedList")} className="editor-btn" title="Numbered List">
                          <ListOrdered size={15} />
                        </button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("insertHorizontalRule")} className="editor-btn" title="Horizontal Line">
                          <Minus size={15} />
                        </button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={startLinkFlow} className="editor-btn" title="Insert Link">
                          <LinkIcon size={15} />
                        </button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat("removeFormat")} className="editor-btn text-red-400" title="Clear format">
                          ✕
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 px-1 py-0.5 w-full max-w-lg">
                        <LinkIcon size={14} className="text-indigo-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Paste or type URL..."
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
                          Apply
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
                  {/* Visual Content Editable */}
                  <VisualEditorContainer 
                    initialHtml={initialHtmlContent} 
                    editorRef={editorRef} 
                  />
                </div>
              ) : (
                <textarea
                  className="editor-content-area font-mono text-sm leading-relaxed"
                  style={{ minHeight: "330px" }}
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  placeholder="# Write your raw markdown here..."
                />
              )}
            </div>

          </div>
        </div>

        {/* Settings Column (1/3 width) */}
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
                onChange={(e) => setStatus(e.target.value)}
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
                onChange={(e) => setDate(e.target.value)}
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
                onChange={(e) => setAuthor(e.target.value)}
                className="admin-input"
              />
            </div>

            {/* Save Buttons */}
            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary w-full justify-center"
              >
                {saving ? "Saving Changes..." : initialSlug ? "Save Blog Post" : "Publish Post"}
              </button>
              <Link href="/admin/blog" className="no-underline w-full">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary w-full justify-center"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </div>

          {/* SEO Metadata Card */}
          <div className="admin-card space-y-4">
            <h3 className="font-['Outfit'] font-bold text-base text-white border-b border-white/6 pb-2 mb-4">
              SEO Parameters
            </h3>             {/* Meta Description */}
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
                placeholder="Google index snippet snippet summary..."
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
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
                onChange={(e) => setFocusKeyword(e.target.value)}
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

            {/* Cover Image URL & Upload */}
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
                placeholder="e.g. custom-image-keyword-title"
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
                ) : (localPreviewUrl || uploadedImageSrc || coverImage) ? (
                  <div className="relative w-full h-full group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={localPreviewUrl || uploadedImageSrc || coverImage}
                      alt={imageAlt || "Cover Preview"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    {/* Hover Change Image overlay */}
                    <div 
                      onClick={handleImageUploadClick}
                      className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-150 cursor-pointer text-xs font-bold uppercase tracking-wider text-indigo-300"
                    >
                      <UploadCloud size={20} className="animate-bounce" />
                      <span>Change Image</span>
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
                placeholder="e.g. WhatsApp profile image size compressor tool cover description"
                value={imageAlt || ""}
                onChange={(e) => setImageAlt(e.target.value)}
                className="admin-input"
              />
            </div>
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

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#16161f] border border-[#2a2a38] rounded-3xl p-6 max-w-md w-full text-left space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-['Outfit'] font-extrabold text-xl text-white flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={22} />
              Confirm Post Deletion
            </h3>
            <p className="text-sm text-[#cbd5e1] leading-relaxed">
              Are you sure you want to delete the blog post **"{initialSlug}"**? This action will permanently remove the markdown file from the project directory.
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
            {/* Modal Header */}
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

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center gap-4 bg-[#0f0f1a]">
              {/* Crop Container Box */}
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
                {/* Aspect Grid Overlay */}
                <div className="absolute inset-0 border-2 border-indigo-500/30 pointer-events-none rounded-xl">
                  {/* Guides */}
                  <div className="absolute inset-x-0 top-1/3 border-t border-white/10" />
                  <div className="absolute inset-x-0 top-2/3 border-t border-white/10" />
                  <div className="absolute inset-y-0 left-1/3 border-l border-white/10" />
                  <div className="absolute inset-y-0 left-2/3 border-l border-white/10" />
                </div>
              </div>
              
              <span className="text-[10px] text-gray-400">💡 Drag the image inside the frame to adjust the position.</span>

              {/* Zoom Slider */}
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

            {/* Modal Footer */}
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
    </div>
  );
}
