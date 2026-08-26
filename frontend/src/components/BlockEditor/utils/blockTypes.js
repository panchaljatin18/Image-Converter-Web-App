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
    description: "Add raw HTML, CSS, or FAQ Schema markup with live preview.",
    defaultAttributes: {
      html: '<div class="faq-container">\n  <h3>Frequently Asked Questions</h3>\n  <p>Your custom HTML code here...</p>\n</div>',
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

export function createBlock(type, attributes = {}, children = [], customId = null) {
  const def = BLOCK_DEFINITIONS.find((b) => b.type === type);
  return {
    id: customId || generateBlockId(),
    type,
    attributes: { ...def?.defaultAttributes, ...attributes },
    children: children || [],
  };
}
