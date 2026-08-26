// Block JSON <-> Semantic HTML Serializer & Parser

import { createBlock } from "./blockTypes";

/**
 * Converts a structured JSON blocks array into clean semantic HTML for public rendering
 */
export function blocksToHtml(blocks = []) {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";

  return blocks
    .map((block) => {
      const { type, attributes = {}, children = [] } = block;

      switch (type) {
        case "paragraph": {
          const { content = "", fontSize = "normal", align = "left", textColor = "" } = attributes;
          if (!content.trim()) return "";
          const styleAttr = `text-align: ${align};${textColor ? ` color: ${textColor};` : ""}`;
          const classAttr = fontSize !== "normal" ? ` class="text-${fontSize}"` : "";
          return `<p style="${styleAttr}"${classAttr}>${content}</p>`;
        }

        case "heading": {
          const { content = "", level = 2, align = "left", anchor = "", textColor = "" } = attributes;
          if (!content.trim()) return "";
          const hTag = `h${Math.min(Math.max(level, 1), 6)}`;
          const idAttr = anchor ? ` id="${anchor}"` : "";
          const styleAttr = `text-align: ${align};${textColor ? ` color: ${textColor};` : ""}`;
          return `<${hTag}${idAttr} style="${styleAttr}">${content}</${hTag}>`;
        }

        case "list": {
          const { listType = "unordered", items = [], textColor = "" } = attributes;
          if (!items || items.length === 0) return "";
          const tag = listType === "ordered" ? "ol" : "ul";
          const styleAttr = textColor ? ` style="color: ${textColor};"` : "";
          const listItems = items.map((item) => `<li>${item}</li>`).join("");
          return `<${tag}${styleAttr}>${listItems}</${tag}>`;
        }

        case "quote": {
          const { content = "", citation = "", style = "default", textColor = "" } = attributes;
          const styleAttr = textColor ? ` style="color: ${textColor};"` : "";
          const classAttr = style === "large" ? ' class="quote-large"' : "";
          const citeHtml = citation ? `<cite>— ${citation}</cite>` : "";
          return `<blockquote${classAttr}${styleAttr}><p>${content}</p>${citeHtml}</blockquote>`;
        }

        case "code": {
          const { code = "", language = "javascript" } = attributes;
          const escaped = (code || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          return `<pre><code class="language-${language}">${escaped}</code></pre>`;
        }

        case "image": {
          const { url = "", alt = "", caption = "", align = "center", width = "100%" } = attributes;
          if (!url) return "";
          const alignClass = align !== "center" ? ` align-${align}` : "";
          const capHtml = caption ? `<figcaption>${caption}</figcaption>` : "";
          return `<figure class="wp-block-image${alignClass}"><img src="${url}" alt="${alt || "Image"}" style="max-width:${width};height:auto;" />${capHtml}</figure>`;
        }

        case "gallery": {
          const { images = [], columns = 3, gap = 16 } = attributes;
          if (!images || images.length === 0) return "";
          const imgItems = images
            .map(
              (img) => `<figure><img src="${img.url}" alt="${img.alt || ""}" />${img.caption ? `<figcaption>${img.caption}</figcaption>` : ""}</figure>`
            )
            .join("");
          return `<div class="wp-block-gallery columns-${columns}" style="gap:${gap}px;">${imgItems}</div>`;
        }

        case "embed": {
          const { url = "", provider = "youtube", caption = "" } = attributes;
          if (!url) return "";
          let embedSrc = url;
          if (provider === "youtube" && url.includes("watch?v=")) {
            const videoId = url.split("watch?v=")[1]?.split("&")[0];
            embedSrc = `https://www.youtube.com/embed/${videoId}`;
          } else if (provider === "vimeo" && !url.includes("player.vimeo.com")) {
            const vimeoId = url.split("/").pop();
            embedSrc = `https://player.vimeo.com/video/${vimeoId}`;
          }
          const capHtml = caption ? `<figcaption>${caption}</figcaption>` : "";
          return `<figure class="wp-block-embed"><div class="aspect-video-wrapper"><iframe src="${embedSrc}" frameborder="0" allowfullscreen></iframe></div>${capHtml}</figure>`;
        }

        case "button": {
          const { text = "Click", url = "#", variant = "primary", align = "left", targetBlank = true } = attributes;
          const targetAttr = targetBlank ? ' target="_blank" rel="noopener noreferrer"' : "";
          return `<div class="wp-block-button align-${align}"><a href="${url}" class="wp-btn btn-${variant}"${targetAttr}>${text}</a></div>`;
        }

        case "custom-html": {
          const { html = "" } = attributes;
          if (!html.trim()) return "";
          return `<!-- wp:html -->\n${html.trim()}\n<!-- /wp:html -->`;
        }

        case "columns": {
          const { layout = "50-50" } = attributes;
          // Render each column's child blocks
          const colHtmls = (children || []).map((colBlocks) => {
            const innerHtml = blocksToHtml(colBlocks);
            return `<div class="wp-block-column">${innerHtml}</div>`;
          }).join("");
          return `<div class="wp-block-columns layout-${layout}">${colHtmls}</div>`;
        }

        case "divider": {
          const { style = "line", height = 32 } = attributes;
          if (style === "spacer") {
            return `<div class="wp-block-spacer" style="height:${height}px;"></div>`;
          }
          return `<hr class="wp-block-separator style-${style}" />`;
        }

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Extract raw code from custom-html wrapper nodes if present
 */
function extractRawHtmlFromNode(node) {
  if (!node) return "";

  // If node is a wp-block-custom-html wrapper card, extract the inner textarea content
  const textarea = node.querySelector ? node.querySelector("textarea") : null;
  if (textarea) {
    return (textarea.value || textarea.textContent || "").trim();
  }

  // If node is a script tag, details, style tag, or div, return outerHTML
  return node.outerHTML || node.textContent || "";
}

/**
 * Sanitizes and unwraps any corrupted <p class="text-[#cbd5e1]"> tags wrapping CSS rules or HTML code
 */
function sanitizeCorruptedCode(htmlStr = "") {
  if (!htmlStr) return "";
  let clean = htmlStr;

  // 1. Strip all leftover preview pane container elements and raw placeholders
  clean = clean.replace(/<div[^>]*class="[^"]*wp-block-preview-pane[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  clean = clean.replace(/<div[^>]*class="[^"]*wp-block-preview-content[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  clean = clean.replace(/___PROTECTED_RAW_\d+___/gi, "");

  // 2. Unwrap outer wp-block-custom-html wrappers if whole string is wrapped
  clean = clean.replace(/<div[^>]*class="[^"]*wp-block-custom-html[^"]*"[^>]*>[\s\S]*?<textarea[^>]*>([\s\S]*?)<\/textarea>[\s\S]*?<\/div>/gi, (m, rawCode) => {
    return rawCode.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();
  });

  // 3. Unwrap corrupted <p class="text-[#cbd5e1]"> tags wrapping CSS rules or HTML code
  clean = clean.replace(/<p[^>]*class="[^"]*text-\[#cbd5e1\][^"]*"[^>]*>([\s\S]*?)<\/p>/gi, (m, content) => {
    if (
      content.includes("summary") ||
      content.includes("faq") ||
      content.includes("{") ||
      content.includes("padding:") ||
      content.includes("font-size:") ||
      content.includes("min-height:") ||
      content.includes("<style") ||
      content.includes("<div")
    ) {
      return content.replace(/<br\s*\/?>/gi, "\n").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    }
    return m;
  });

  return clean;
}

/**
 * Parses raw HTML / Markdown into structured JSON block cards
 */
export function htmlToBlocks(html = "") {
  if (!html || !html.trim()) {
    return [createBlock("paragraph", { content: "" })];
  }

  const cleanHtml = sanitizeCorruptedCode(html);

  // 1. IF HTML CONTAINS GUTENBERG BLOCK MARKERS (<!-- wp:html --> etc.)
  if (cleanHtml.includes("<!-- wp:")) {
    const blocks = [];
    const wpBlockRegex = /<!-- wp:(\w+)(?:\s+({[\s\S]*?}))?\s*-->([\s\S]*?)<!-- \/wp:\1 -->/g;
    let match;

    while ((match = wpBlockRegex.exec(cleanHtml)) !== null) {
      const type = match[1];
      const rawAttrs = match[2];
      const content = match[3] ? match[3].trim() : "";

      let attributes = {};
      if (rawAttrs) {
        try {
          attributes = JSON.parse(rawAttrs);
        } catch (e) {}
      }

      if (type === "html") {
        blocks.push(createBlock("custom-html", { html: content }));
      } else if (type === "paragraph") {
        const innerText = content.replace(/^<p[^>]*>/, "").replace(/<\/p>$/, "").trim();
        blocks.push(createBlock("paragraph", { ...attributes, content: innerText || content }));
      } else if (type === "heading") {
        const levelMatch = content.match(/<h([1-6])/i);
        const level = levelMatch ? parseInt(levelMatch[1], 10) : attributes.level || 2;
        const innerText = content.replace(/^<h[1-6][^>]*>/, "").replace(/<\/h[1-6]>$/, "").trim();
        blocks.push(createBlock("heading", { ...attributes, level, content: innerText || content }));
      } else if (type === "code") {
        const codeMatch = content.match(/<code[^>]*>([\s\S]*?)<\/code>/i);
        const codeText = codeMatch ? codeMatch[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">") : content;
        blocks.push(createBlock("code", { ...attributes, code: codeText }));
      } else {
        blocks.push(createBlock("custom-html", { html: content }));
      }
    }

    if (blocks.length > 0) {
      return blocks;
    }
  }

  // 2. FALLBACK FOR DOM NODES (Legacy / Plain HTML)
  const blocks = [];
  const container = typeof document !== "undefined" ? document.createElement("div") : null;

  if (!container) {
    return [createBlock("custom-html", { html: cleanHtml })];
  }

  container.innerHTML = cleanHtml;
  const childNodes = Array.from(container.children);

  if (childNodes.length === 0) {
    return [createBlock("paragraph", { content: cleanHtml.trim() })];
  }

  childNodes.forEach((node) => {
    const tagName = node.tagName.toLowerCase();

    // Check if node is an explicit custom-html block (style, script, accordion details, table, or custom-html card)
    const isExplicitCustomHtmlClass =
      node.classList.contains("wp-block-custom-html") ||
      node.classList.contains("faq-container") ||
      node.classList.contains("faq-schema-block") ||
      node.classList.contains("custom-html-block") ||
      node.classList.contains("wp-custom-html-card") ||
      node.classList.contains("format-table");

    const isCustomHtmlTag =
      tagName === "script" ||
      tagName === "style" ||
      tagName === "details" ||
      tagName === "table";

    const isCustomHtmlNode = isExplicitCustomHtmlClass || isCustomHtmlTag;

    // Check if paragraph or div contains CSS rules mistakenly wrapped
    const isCorruptedCss =
      ((node.innerHTML.includes("{") && node.innerHTML.includes("}")) || node.innerHTML.includes("<style>")) &&
      (node.innerHTML.includes("margin") ||
        node.innerHTML.includes("padding") ||
        node.innerHTML.includes("font-size") ||
        node.innerHTML.includes("summary") ||
        node.innerHTML.includes("faq"));

    if (isCorruptedCss) {
      const codeText = node.innerHTML
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");

      blocks.push(createBlock("custom-html", { html: codeText }));
      return;
    }

    if (isCustomHtmlNode) {
      const rawCode = extractRawHtmlFromNode(node);
      const lastBlock = blocks[blocks.length - 1];
      // Only merge if last block is a <style> tag and current node is a <div> belonging to the same snippet
      if (lastBlock && lastBlock.type === "custom-html" && lastBlock.attributes.html.startsWith("<style") && !lastBlock.attributes.html.includes("<div")) {
        lastBlock.attributes.html = (lastBlock.attributes.html + "\n\n" + rawCode).trim();
      } else {
        blocks.push(createBlock("custom-html", { html: rawCode }));
      }
    } else if (/^h[1-6]$/.test(tagName)) {
      const level = parseInt(tagName.replace("h", ""), 10);
      blocks.push(
        createBlock("heading", {
          level,
          content: node.innerHTML,
          anchor: node.id || "",
        })
      );
    } else if (tagName === "p" || tagName === "div" || tagName === "span" || tagName === "article" || tagName === "section") {
      // Check if node contains an <img> element
      const img = node.querySelector("img");
      if (img || tagName === "img") {
        const targetImg = img || node;
        const cap = node.querySelector("figcaption");
        blocks.push(
          createBlock("image", {
            url: targetImg.getAttribute("src") || "",
            alt: targetImg.getAttribute("alt") || "",
            caption: cap ? cap.innerHTML : "",
          })
        );
      } else {
        // Standard text paragraph
        const textContent = node.innerHTML.trim();
        const strippedText = textContent.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
        if (strippedText.length > 0 || node.querySelector("img") || node.querySelector("iframe")) {
          blocks.push(createBlock("paragraph", { content: textContent }));
        }
      }
    } else if (tagName === "ul" || tagName === "ol") {
      const items = Array.from(node.querySelectorAll("li"))
        .map((li) => li.innerHTML.trim())
        .filter((item) => item.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0);
      blocks.push(
        createBlock("list", {
          listType: tagName === "ol" ? "ordered" : "unordered",
          ordered: tagName === "ol",
          items: items.length > 0 ? items : [""],
        })
      );
    } else if (tagName === "blockquote") {
      const p = node.querySelector("p");
      const cite = node.querySelector("cite");
      blocks.push(
        createBlock("quote", {
          content: p ? p.innerHTML : node.innerHTML,
          citation: cite ? cite.innerText.replace(/^—\s*/, "") : "",
        })
      );
    } else if (tagName === "pre") {
      const code = node.querySelector("code");
      blocks.push(
        createBlock("code", {
          code: code ? code.innerText : node.innerText,
          language: "javascript",
        })
      );
    } else if (tagName === "figure" && node.querySelector("img")) {
      const img = node.querySelector("img");
      const cap = node.querySelector("figcaption");
      blocks.push(
        createBlock("image", {
          url: img.getAttribute("src") || "",
          alt: img.getAttribute("alt") || "",
          caption: cap ? cap.innerHTML : "",
        })
      );
    } else if (node.classList.contains("wp-block-button")) {
      const a = node.querySelector("a");
      blocks.push(
        createBlock("button", {
          text: a ? a.innerText : "Button",
          url: a ? a.getAttribute("href") : "#",
        })
      );
    } else if (tagName === "hr") {
      blocks.push(createBlock("divider", { style: "line" }));
    } else {
      const textContent = node.innerHTML ? node.innerHTML.trim() : "";
      const strippedText = textContent.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
      if (strippedText.length > 0) {
        blocks.push(createBlock("paragraph", { content: textContent }));
      }
    }
  });

  // Post-process: Consolidate any consecutive custom-html blocks into 1 single custom-html block!
  const consolidated = [];
  blocks.forEach((b) => {
    const last = consolidated[consolidated.length - 1];
    if (b.type === "custom-html" && last && last.type === "custom-html") {
      last.attributes.html = (last.attributes.html + "\n\n" + b.attributes.html).trim();
    } else {
      consolidated.push(b);
    }
  });

  return consolidated.length > 0 ? consolidated : [createBlock("paragraph", { content: "" })];
}
