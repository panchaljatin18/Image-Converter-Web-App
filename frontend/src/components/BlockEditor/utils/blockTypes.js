// Block Types Registry for WordPress Gutenberg-style Block Editor

export const BLOCK_CATEGORIES = [
  { id: "all", label: "All Blocks" },
  { id: "text", label: "Text" },
  { id: "media", label: "Media" },
  { id: "layout", label: "Layout" },
  { id: "widgets", label: "Widgets" },
];

export const BLOCK_DEFINITIONS = [
  {
    type: "paragraph",
    name: "Paragraph",
    category: "text",
    icon: "Type",
    description: "Start with plain text and rich inline formatting.",
    defaultAttributes: {
      content: "",
      fontSize: "normal", // small, normal, medium, large, x-large
      align: "left", // left, center, right, justify
      textColor: "#ffffff",
      bgColor: "transparent",
      dropCap: false,
    },
  },
  {
    type: "heading",
    name: "Heading",
    category: "text",
    icon: "Heading",
    description: "Introduce new sections and organize your content hierarchy.",
    defaultAttributes: {
      content: "",
      level: 2, // 1 to 6
      align: "left",
      anchor: "",
      textColor: "#ffffff",
    },
  },
  {
    type: "list",
    name: "List",
    category: "text",
    icon: "List",
    description: "Create a bulleted or numbered list.",
    defaultAttributes: {
      listType: "unordered", // unordered, ordered
      items: [""],
      textColor: "#ffffff",
    },
  },
  {
    type: "quote",
    name: "Quote",
    category: "text",
    icon: "Quote",
    description: "Give special visual emphasis to a quotation or testimonial.",
    defaultAttributes: {
      content: "Add quote text here...",
      citation: "Citation / Author",
      style: "default", // default, large
      textColor: "#e0e7ff",
    },
  },
  {
    type: "code",
    name: "Code",
    category: "text",
    icon: "Code",
    description: "Display code snippets with clean monospace formatting.",
    defaultAttributes: {
      code: "// Write code snippet here\nfunction hello() {\n  console.log('Hello World');\n}",
      language: "javascript",
    },
  },
  {
    type: "table",
    name: "Table",
    category: "text",
    icon: "Table",
    description: "Insert a structured table for data, comparisons, or specifications.",
    defaultAttributes: {
      hasHeader: true,
      hasFooter: false,
      striped: true,
      head: ["Column 1", "Column 2", "Column 3"],
      rows: [
        ["Item 1", "Description 1", "Value 1"],
        ["Item 2", "Description 2", "Value 2"],
      ],
      foot: [],
    },
  },
  {
    type: "image",
    name: "Image",
    category: "media",
    icon: "Image",
    description: "Insert an image file from device, media library, or URL.",
    defaultAttributes: {
      url: "",
      alt: "",
      caption: "",
      align: "center", // left, center, right, wide, full
      aspectRatio: "auto",
      width: "100%",
    },
  },
  {
    type: "gallery",
    name: "Gallery",
    category: "media",
    icon: "Grid",
    description: "Display multiple images in an interactive grid layout.",
    defaultAttributes: {
      images: [], // array of { url, alt, caption }
      columns: 3,
      gap: 16,
      cropImages: true,
    },
  },
  {
    type: "embed",
    name: "Video / Embed",
    category: "media",
    icon: "Video",
    description: "Embed videos from YouTube, Vimeo, or custom iframe URLs.",
    defaultAttributes: {
      url: "",
      provider: "youtube", // youtube, vimeo, iframe
      aspectRatio: "16:9",
      caption: "",
    },
  },
  {
    type: "button",
    name: "Button",
    category: "widgets",
    icon: "MousePointer",
    description: "Prompt visitors to take action with a styled link button.",
    defaultAttributes: {
      text: "Click Here",
      url: "#",
      variant: "primary", // primary, secondary, outline, gradient
      align: "left",
      size: "medium", // small, medium, large
      targetBlank: true,
    },
  },
  {
    type: "custom-html",
    name: "Custom HTML",
    category: "widgets",
    icon: "FileCode",
    description: "Add custom HTML code and preview it as you edit.",
    keywords: ["embed"],
    attributes: {
      content: {
        type: "string",
        source: "raw",
      },
    },
    supports: {
      customClassName: false,
      className: false,
      html: false,
      reusable: true,
      multiple: true,
    },
    defaultAttributes: {
      content: "",
    },
  },
  {
    type: "html",
    name: "Custom HTML",
    category: "widgets",
    icon: "FileCode",
    description: "Add custom HTML code and preview it as you edit.",
    keywords: ["embed"],
    attributes: {
      content: {
        type: "string",
        source: "raw",
      },
    },
    supports: {
      customClassName: false,
      className: false,
      html: false,
      reusable: true,
      multiple: true,
    },
    defaultAttributes: {
      content: "",
    },
  },
  {
    type: "columns",
    name: "Columns",
    category: "layout",
    icon: "Columns",
    description: "Add a multi-column layout for side-by-side content.",
    defaultAttributes: {
      layout: "50-50", // 50-50, 33-33-33, 30-70, 70-30, 25-25-25-25
      columnCount: 2,
    },
  },
  {
    type: "divider",
    name: "Separator & Spacer",
    category: "layout",
    icon: "Minus",
    description: "Create visual space or a line divider between sections.",
    defaultAttributes: {
      style: "line", // line, dots, spacer
      height: 32,
      color: "rgba(255,255,255,0.1)",
    },
  },
];

let idCounter = 0;
export function generateBlockId() {
  idCounter = (idCounter + 1) % 1000000;
  return "block_" + Date.now().toString(36) + "_" + idCounter.toString(36) + "_" + Math.random().toString(36).substring(2, 6);
}

/**
 * Normalizes an individual block into the standard structured representation
 */
export function normalizeBlock(block) {
  if (!block || typeof block !== "object") {
    return createBlock("paragraph", { content: "" });
  }

  const rawType = (block.type || "paragraph").toLowerCase();
  const type = rawType === "html" ? "custom-html" : rawType;

  const rawAttrs = block.attrs || block.attributes || {};
  const attrs = { ...rawAttrs };

  let htmlStr = "";
  if (typeof block.content === "object" && block.content !== null && typeof block.content.html === "string") {
    htmlStr = block.content.html;
  } else if (typeof block.content === "string") {
    htmlStr = block.content;
  } else if (typeof attrs.html === "string") {
    htmlStr = attrs.html;
  } else if (typeof attrs.content === "string") {
    htmlStr = attrs.content;
  }

  let content = block.content;
  if (type === "custom-html" || type === "html") {
    content = { html: htmlStr };
    attrs.html = htmlStr;
    attrs.content = htmlStr;
  } else if (type === "code") {
    if (typeof content !== "string") content = attrs.code !== undefined ? attrs.code : (attrs.content || "");
    attrs.code = content;
    attrs.content = content;
  } else {
    if (content === undefined && attrs.content !== undefined) content = attrs.content;
    attrs.content = content;
  }

  const children = Array.isArray(block.children)
    ? block.children.map((c) => (Array.isArray(c) ? c.map(normalizeBlock) : normalizeBlock(c)))
    : Array.isArray(block.innerBlocks)
    ? block.innerBlocks.map(normalizeBlock)
    : [];

  return {
    id: block.id || generateBlockId(),
    type: type === "html" ? "custom-html" : type,
    attrs,
    attributes: attrs,
    content,
    children,
  };
}

/**
 * Normalizes full post structured block state: { version: 1, blocks: [...] }
 */
export function normalizeBlockState(raw) {
  if (!raw) return { version: 1, blocks: [] };

  if (Array.isArray(raw)) {
    return { version: 1, blocks: raw.map(normalizeBlock) };
  }

  if (typeof raw === "object") {
    if (Array.isArray(raw.blocks)) {
      return {
        version: raw.version || 1,
        blocks: raw.blocks.map(normalizeBlock),
      };
    }
    // If raw was a single block object
    if (raw.type) {
      return { version: 1, blocks: [normalizeBlock(raw)] };
    }
  }

  return { version: 1, blocks: [] };
}

export function createBlock(type, attributes = {}, children = [], customId = null) {
  const normType = (type === "html" || type === "custom-html") ? "custom-html" : type;
  const def = BLOCK_DEFINITIONS.find((b) => b.type === normType || b.type === type);
  const defAttrs = def?.defaultAttributes || {};
  const mergedAttrs = { ...defAttrs, ...attributes };

  let htmlStr = "";
  if (typeof attributes.content === "object" && attributes.content !== null && typeof attributes.content.html === "string") {
    htmlStr = attributes.content.html;
  } else if (typeof attributes.content === "string") {
    htmlStr = attributes.content;
  } else if (typeof attributes.html === "string") {
    htmlStr = attributes.html;
  } else if (typeof mergedAttrs.html === "string") {
    htmlStr = mergedAttrs.html;
  } else if (typeof mergedAttrs.content === "string") {
    htmlStr = mergedAttrs.content;
  }

  let content = attributes.content;
  if (normType === "custom-html") {
    content = { html: htmlStr };
    mergedAttrs.html = htmlStr;
    mergedAttrs.content = htmlStr;
  } else if (normType === "code") {
    if (typeof content !== "string") content = mergedAttrs.code || mergedAttrs.content || "";
    mergedAttrs.code = content;
    mergedAttrs.content = content;
  } else {
    if (content === undefined) content = mergedAttrs.content || "";
    mergedAttrs.content = content;
  }

  const id = customId || generateBlockId();

  return {
    id,
    type: normType,
    attrs: mergedAttrs,
    attributes: mergedAttrs,
    content,
    children: children || [],
  };
}
