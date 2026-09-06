// Block JSON <-> Semantic HTML Serializer & Parser
import { createBlock, normalizeBlock, normalizeBlockState } from "./blockTypes.js";

/**
 * Sanitizes and unwraps any corrupted leftover preview pane elements or raw placeholders
 */
export function sanitizeCorruptedCode(htmlStr = "") {
  if (!htmlStr) return "";
  let clean = htmlStr;

  // 1. Strip all leftover preview pane container elements and raw placeholders
  clean = clean.replace(/<div[^>]*class="[^"]*wp-block-preview-pane[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  clean = clean.replace(/<div[^>]*class="[^"]*wp-block-preview-content[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  clean = clean.replace(/___PROTECTED_RAW_\d+___/gi, "");

  // 2. Unwrap outer wp-block-custom-html wrappers if whole string was wrapped in legacy editor
  clean = clean.replace(/<div[^>]*class="[^"]*wp-block-custom-html[^"]*"[^>]*>[\s\S]*?<textarea[^>]*>([\s\S]*?)<\/textarea>[\s\S]*?<\/div>/gi, (m, rawCode) => {
    return rawCode.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();
  });

  return clean;
}

/**
 * Converts a structured JSON blocks array into semantic HTML.
 * When includeDelimiters is true (default), wraps each block in explicit delimiters:
 * <!-- block:type {attrs} --> ... <!-- /block:type -->
 * When forPublic is true, omits delimiters for public frontend rendering.
 */
export function blocksToHtml(blocks = [], options = {}) {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";
  const includeDelimiters = options.includeDelimiters !== false && !options.forPublic;

  return blocks
    .map((rawBlock) => {
      const block = normalizeBlock(rawBlock);
      const { type, attrs = {}, children = [] } = block;

      switch (type) {
        case "paragraph": {
          const content = block.content !== undefined ? block.content : (attrs.content || "");
          const { fontSize = "normal", align = "left", textColor = "" } = attrs;
          const styleAttr = `text-align: ${align};${textColor ? ` color: ${textColor};` : ""}`;
          const classAttr = fontSize !== "normal" ? ` class="text-${fontSize}"` : "";
          const pHtml = `<p style="${styleAttr}"${classAttr}>${content}</p>`;

          if (!includeDelimiters) return pHtml;
          const hasCustomAttrs = fontSize !== "normal" || align !== "left" || Boolean(textColor);
          const meta = hasCustomAttrs ? ` ${JSON.stringify({ fontSize, align, textColor })}` : "";
          return `<!-- block:paragraph${meta} -->\n${pHtml}\n<!-- /block:paragraph -->`;
        }

        case "heading": {
          const content = block.content !== undefined ? block.content : (attrs.content || "");
          const { level = 2, align = "left", anchor = "", textColor = "" } = attrs;
          const hTag = `h${Math.min(Math.max(level, 1), 6)}`;
          const idAttr = anchor ? ` id="${anchor}"` : "";
          const styleAttr = `text-align: ${align};${textColor ? ` color: ${textColor};` : ""}`;
          const hHtml = `<${hTag}${idAttr} style="${styleAttr}">${content}</${hTag}>`;

          if (!includeDelimiters) return hHtml;
          const meta = ` ${JSON.stringify({ level, align, anchor, textColor })}`;
          return `<!-- block:heading${meta} -->\n${hHtml}\n<!-- /block:heading -->`;
        }

        case "html":
        case "custom-html": {
          const rawHtml = block.content !== undefined ? block.content : (attrs.html || attrs.content || "");
          if (!includeDelimiters) return rawHtml;
          return `<!-- block:html -->\n${rawHtml}\n<!-- /block:html -->`;
        }

        case "code": {
          const code = block.content !== undefined ? block.content : (attrs.code || "");
          const { language = "javascript" } = attrs;
          const escaped = (code || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          const codeHtml = `<pre><code class="language-${language}">${escaped}</code></pre>`;

          if (!includeDelimiters) return codeHtml;
          const meta = ` ${JSON.stringify({ language })}`;
          return `<!-- block:code${meta} -->\n${codeHtml}\n<!-- /block:code -->`;
        }

        case "list": {
          const { listType = "unordered", items = [], textColor = "" } = attrs;
          const isOrdered = listType === "ordered" || attrs.ordered;
          const tag = isOrdered ? "ol" : "ul";
          const styleAttr = textColor ? ` style="color: ${textColor};"` : "";
          const listItems = (items && items.length > 0 ? items : [""])
            .map((item) => `<li>${item}</li>`)
            .join("");
          const listHtml = `<${tag}${styleAttr}>${listItems}</${tag}>`;

          if (!includeDelimiters) return listHtml;
          const meta = ` ${JSON.stringify({ listType: isOrdered ? "ordered" : "unordered", ordered: isOrdered, textColor })}`;
          return `<!-- block:list${meta} -->\n${listHtml}\n<!-- /block:list -->`;
        }

        case "quote": {
          const { citation = "", style = "default", textColor = "" } = attrs;
          const content = block.content !== undefined ? block.content : (attrs.content || "");
          const styleAttr = textColor ? ` style="color: ${textColor};"` : "";
          const classAttr = style === "large" ? ' class="quote-large"' : "";
          const citeHtml = citation ? `<cite>— ${citation}</cite>` : "";
          const quoteHtml = `<blockquote${classAttr}${styleAttr}><p>${content}</p>${citeHtml}</blockquote>`;

          if (!includeDelimiters) return quoteHtml;
          const meta = ` ${JSON.stringify({ citation, style, textColor })}`;
          return `<!-- block:quote${meta} -->\n${quoteHtml}\n<!-- /block:quote -->`;
        }

        case "image": {
          const { url = "", alt = "", caption = "", align = "center", width = "100%" } = attrs;
          if (!url && !includeDelimiters) return "";
          const alignClass = align !== "center" ? ` align-${align}` : "";
          const capHtml = caption ? `<figcaption>${caption}</figcaption>` : "";
          const imgHtml = `<figure class="wp-block-image${alignClass}"><img src="${url}" alt="${alt || "Image"}" style="max-width:${width};height:auto;" />${capHtml}</figure>`;

          if (!includeDelimiters) return imgHtml;
          const meta = ` ${JSON.stringify({ url, alt, caption, align, width })}`;
          return `<!-- block:image${meta} -->\n${imgHtml}\n<!-- /block:image -->`;
        }

        case "gallery": {
          const { images = [], columns = 3, gap = 16 } = attrs;
          if ((!images || images.length === 0) && !includeDelimiters) return "";
          const imgItems = (images || [])
            .map(
              (img) => `<figure><img src="${img.url}" alt="${img.alt || ""}" />${img.caption ? `<figcaption>${img.caption}</figcaption>` : ""}</figure>`
            )
            .join("");
          const galHtml = `<div class="wp-block-gallery columns-${columns}" style="gap:${gap}px;">${imgItems}</div>`;

          if (!includeDelimiters) return galHtml;
          const meta = ` ${JSON.stringify({ columns, gap })}`;
          return `<!-- block:gallery${meta} -->\n${galHtml}\n<!-- /block:gallery -->`;
        }

        case "embed": {
          const { url = "", provider = "youtube", caption = "" } = attrs;
          if (!url && !includeDelimiters) return "";
          let embedSrc = url;
          if (provider === "youtube" && url.includes("watch?v=")) {
            const videoId = url.split("watch?v=")[1]?.split("&")[0];
            embedSrc = `https://www.youtube.com/embed/${videoId}`;
          } else if (provider === "vimeo" && !url.includes("player.vimeo.com")) {
            const vimeoId = url.split("/").pop();
            embedSrc = `https://player.vimeo.com/video/${vimeoId}`;
          }
          const capHtml = caption ? `<figcaption>${caption}</figcaption>` : "";
          const embHtml = `<figure class="wp-block-embed"><div class="aspect-video-wrapper"><iframe src="${embedSrc}" frameborder="0" allowfullscreen></iframe></div>${capHtml}</figure>`;

          if (!includeDelimiters) return embHtml;
          const meta = ` ${JSON.stringify({ url, provider, caption })}`;
          return `<!-- block:embed${meta} -->\n${embHtml}\n<!-- /block:embed -->`;
        }

        case "button": {
          const { text = "Click", url = "#", variant = "primary", align = "left", targetBlank = true } = attrs;
          const targetAttr = targetBlank ? ' target="_blank" rel="noopener noreferrer"' : "";
          const btnHtml = `<div class="wp-block-button align-${align}"><a href="${url}" class="wp-btn btn-${variant}"${targetAttr}>${text}</a></div>`;

          if (!includeDelimiters) return btnHtml;
          const meta = ` ${JSON.stringify({ text, url, variant, align, targetBlank })}`;
          return `<!-- block:button${meta} -->\n${btnHtml}\n<!-- /block:button -->`;
        }

        case "columns": {
          const { layout = "50-50" } = attrs;
          const colHtmls = (children || []).map((colBlocks) => {
            const innerHtml = blocksToHtml(Array.isArray(colBlocks) ? colBlocks : [colBlocks], options);
            return `<div class="wp-block-column">${innerHtml}</div>`;
          }).join("");
          const colsHtml = `<div class="wp-block-columns layout-${layout}">${colHtmls}</div>`;

          if (!includeDelimiters) return colsHtml;
          const meta = ` ${JSON.stringify({ layout })}`;
          return `<!-- block:columns${meta} -->\n${colsHtml}\n<!-- /block:columns -->`;
        }

        case "table": {
          const {
            hasHeader = true,
            hasFooter = false,
            striped = true,
            head = [],
            rows = [],
            foot = [],
          } = attrs;

          const colCount = Math.max(
            Array.isArray(head) ? head.length : 0,
            ...(Array.isArray(rows) ? rows.map((r) => (Array.isArray(r) ? r.length : 0)) : [0]),
            Array.isArray(foot) ? foot.length : 0,
            1
          );

          let tableInner = "";

          if (hasHeader && Array.isArray(head) && head.length > 0) {
            tableInner += "<thead><tr>";
            for (let c = 0; c < colCount; c++) {
              tableInner += `<th>${head[c] !== undefined ? head[c] : ""}</th>`;
            }
            tableInner += "</tr></thead>";
          }

          if (Array.isArray(rows) && rows.length > 0) {
            tableInner += "<tbody>";
            for (const row of rows) {
              tableInner += "<tr>";
              for (let c = 0; c < colCount; c++) {
                const cellVal = Array.isArray(row) && row[c] !== undefined ? row[c] : "";
                tableInner += `<td>${cellVal}</td>`;
              }
              tableInner += "</tr>";
            }
            tableInner += "</tbody>";
          }

          if (hasFooter && Array.isArray(foot) && foot.length > 0) {
            tableInner += "<tfoot><tr>";
            for (let c = 0; c < colCount; c++) {
              tableInner += `<td>${foot[c] !== undefined ? foot[c] : ""}</td>`;
            }
            tableInner += "</tr></tfoot>";
          }

          const figClass = `wp-block-table${striped ? " is-style-stripes" : ""}`;
          const tableHtml = `<figure class="${figClass}"><table>${tableInner}</table></figure>`;

          if (!includeDelimiters) return tableHtml;
          const meta = ` ${JSON.stringify({ hasHeader, hasFooter, striped, head, rows, foot })}`;
          return `<!-- block:table${meta} -->\n${tableHtml}\n<!-- /block:table -->`;
        }

        case "divider": {
          const { style = "line", height = 32 } = attrs;
          const divHtml = style === "spacer"
            ? `<div class="wp-block-spacer" style="height:${height}px;"></div>`
            : `<hr class="wp-block-separator style-${style}" />`;

          if (!includeDelimiters) return divHtml;
          const meta = ` ${JSON.stringify({ style, height })}`;
          return `<!-- block:divider${meta} -->\n${divHtml}\n<!-- /block:divider -->`;
        }

        default: {
          const rawContent = block.content !== undefined ? block.content : "";
          if (!includeDelimiters) return rawContent;
          return `<!-- block:${type} -->\n${rawContent}\n<!-- /block:${type} -->`;
        }
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Fallback parser for legacy content without explicit block delimiters.
 * Ensures HTML tags (like <div> or <p>) are never used to mistakenly convert paragraphs to HTML blocks.
 */
export function parseLegacyHtmlToBlocks(rawHtml = "") {
  const cleanHtml = sanitizeCorruptedCode(rawHtml);
  if (!cleanHtml.trim()) return [];

  // Browser DOM parser
  if (typeof document !== "undefined") {
    const container = document.createElement("div");
    container.innerHTML = cleanHtml;
    const childNodes = Array.from(container.children);

    if (childNodes.length === 0) {
      return [createBlock("paragraph", { content: cleanHtml.trim() })];
    }

    const blocks = [];
    childNodes.forEach((node) => {
      const tagName = node.tagName.toLowerCase();

      // Heading elements
      if (/^h[1-6]$/.test(tagName)) {
        const level = parseInt(tagName.replace("h", ""), 10);
        blocks.push(
          createBlock("heading", {
            level,
            content: node.innerHTML.trim(),
            anchor: node.id || "",
          })
        );
        return;
      }

      // Paragraph elements
      if (tagName === "p") {
        const img = node.querySelector("img");
        if (img && node.childNodes.length === 1) {
          blocks.push(
            createBlock("image", {
              url: img.getAttribute("src") || "",
              alt: img.getAttribute("alt") || "",
              caption: "",
            })
          );
        } else {
          blocks.push(createBlock("paragraph", { content: node.innerHTML.trim() }));
        }
        return;
      }

      // Pre / Code blocks
      if (tagName === "pre") {
        const code = node.querySelector("code");
        const langMatch = (code?.className || "").match(/language-([a-z0-9_-]+)/i);
        blocks.push(
          createBlock("code", {
            code: code ? code.innerText : node.innerText,
            content: code ? code.innerText : node.innerText,
            language: langMatch ? langMatch[1] : "javascript",
          })
        );
        return;
      }

      // Lists
      if (tagName === "ul" || tagName === "ol") {
        const items = Array.from(node.querySelectorAll("li"))
          .map((li) => li.innerHTML.trim())
          .filter(Boolean);
        blocks.push(
          createBlock("list", {
            listType: tagName === "ol" ? "ordered" : "unordered",
            ordered: tagName === "ol",
            items: items.length > 0 ? items : [""],
          })
        );
        return;
      }

      // Blockquotes
      if (tagName === "blockquote") {
        const p = node.querySelector("p");
        const cite = node.querySelector("cite");
        blocks.push(
          createBlock("quote", {
            content: p ? p.innerHTML.trim() : node.innerHTML.trim(),
            citation: cite ? cite.innerText.replace(/^—\s*/, "").trim() : "",
          })
        );
        return;
      }

      // Figures with images
      if (tagName === "figure" && node.querySelector("img")) {
        const img = node.querySelector("img");
        const cap = node.querySelector("figcaption");
        blocks.push(
          createBlock("image", {
            url: img.getAttribute("src") || "",
            alt: img.getAttribute("alt") || "",
            caption: cap ? cap.innerHTML.trim() : "",
          })
        );
        return;
      }

      // Horizontal dividers
      if (tagName === "hr") {
        blocks.push(createBlock("divider", { style: "line" }));
        return;
      }

      // Buttons
      if (node.classList && (node.classList.contains("wp-block-button") || node.classList.contains("wp-block-buttons"))) {
        const a = node.querySelector("a");
        blocks.push(
          createBlock("button", {
            text: a ? a.innerText.trim() : "Button",
            url: a ? a.getAttribute("href") : "#",
          })
        );
        return;
      }

      // Table handling (WordPress Gutenberg core/table)
      const tableEl = tagName === "table" ? node : (node.querySelector ? node.querySelector("table") : null);
      if (tableEl) {
        const thead = tableEl.querySelector("thead");
        const tbody = tableEl.querySelector("tbody");
        const tfoot = tableEl.querySelector("tfoot");

        let head = [];
        if (thead) {
          const ths = thead.querySelectorAll("th, td");
          head = Array.from(ths).map((th) => th.innerHTML.trim());
        }

        let rows = [];
        const trs = tbody ? tbody.querySelectorAll("tr") : tableEl.querySelectorAll("tr");
        trs.forEach((tr, rIdx) => {
          if (!thead && rIdx === 0 && tr.querySelector("th")) {
            head = Array.from(tr.querySelectorAll("th, td")).map((c) => c.innerHTML.trim());
            return;
          }
          if (thead && tr.closest("thead")) return;
          if (tfoot && tr.closest("tfoot")) return;

          const cells = Array.from(tr.querySelectorAll("td, th")).map((td) => td.innerHTML.trim());
          if (cells.length > 0) {
            rows.push(cells);
          }
        });

        let foot = [];
        if (tfoot) {
          const fds = tfoot.querySelectorAll("th, td");
          foot = Array.from(fds).map((f) => f.innerHTML.trim());
        }

        const isStriped =
          (node.classList && node.classList.contains("is-style-stripes")) ||
          (tableEl.classList && tableEl.classList.contains("is-style-stripes"));

        blocks.push(
          createBlock("table", {
            hasHeader: head.length > 0,
            hasFooter: foot.length > 0,
            striped: isStriped,
            head: head.length > 0 ? head : ["Column 1", "Column 2"],
            rows: rows.length > 0 ? rows : [["Cell 1", "Cell 2"]],
            foot,
          })
        );
        return;
      }

      // For any complex custom HTML, widgets, scripts, styles, forms, preserve as HTML block
      const outer = node.outerHTML || node.innerHTML || "";
      if (outer.trim()) {
        blocks.push(createBlock("html", { html: outer.trim(), content: outer.trim() }));
      }
    });

    return blocks.length > 0 ? blocks : [createBlock("paragraph", { content: cleanHtml.trim() })];
  }

  // Server-side / Node fallback parser (without DOM)
  const blocks = [];
  const topTagRegex = /<(p|h[1-6]|pre|ul|ol|blockquote|figure|div|hr|section|table)([^>]*)>([\s\S]*?)<\/\1>|<(hr|img)([^>]*)\/?>/gi;
  let match;
  let lastIndex = 0;
  let foundTags = false;

  while ((match = topTagRegex.exec(cleanHtml)) !== null) {
    foundTags = true;
    const interText = cleanHtml.slice(lastIndex, match.index).trim();
    if (interText) {
      blocks.push(createBlock("paragraph", { content: interText }));
    }
    lastIndex = topTagRegex.lastIndex;

    const fullMatch = match[0];
    const tagName = (match[1] || match[4] || "").toLowerCase();
    const innerContent = match[3] !== undefined ? match[3].trim() : "";

    if (tagName === "p") {
      const imgMatch = innerContent.match(/^<img[^>]*src="([^"]*)"[^>]*\/?>$/i);
      if (imgMatch) {
        blocks.push(createBlock("image", { url: imgMatch[1], alt: "", caption: "" }));
      } else {
        blocks.push(createBlock("paragraph", { content: innerContent }));
      }
    } else if (/^h[1-6]$/.test(tagName)) {
      const level = parseInt(tagName.replace("h", ""), 10);
      blocks.push(createBlock("heading", { level, content: innerContent }));
    } else if (tagName === "pre") {
      const codeMatch = innerContent.match(/<code(?: class="language-([^"]+)")?[^>]*>([\s\S]*?)<\/code>/i);
      const codeText = codeMatch
        ? codeMatch[2].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
        : innerContent;
      const lang = codeMatch ? codeMatch[1] : "javascript";
      blocks.push(createBlock("code", { language: lang || "javascript", code: codeText, content: codeText }));
    } else if (tagName === "ul" || tagName === "ol") {
      const items = [];
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liM;
      while ((liM = liRegex.exec(innerContent)) !== null) {
        items.push(liM[1].trim());
      }
      blocks.push(
        createBlock("list", {
          listType: tagName === "ol" ? "ordered" : "unordered",
          ordered: tagName === "ol",
          items: items.length > 0 ? items : [""],
        })
      );
    } else if (tagName === "blockquote") {
      const pMatch = innerContent.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      const text = pMatch ? pMatch[1].trim() : innerContent;
      blocks.push(createBlock("quote", { content: text }));
    } else if (tagName === "hr") {
      blocks.push(createBlock("divider", { style: "line" }));
    } else if (tagName === "table") {
      const theadMatch = innerContent.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
      let head = [];
      if (theadMatch) {
        const thMatches = [...theadMatch[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)];
        head = thMatches.map((m) => m[1].trim());
      }
      const tbodyMatch = innerContent.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
      const rowSource = tbodyMatch ? tbodyMatch[1] : innerContent.replace(/<thead[^>]*>[\s\S]*?<\/thead>/i, "").replace(/<tfoot[^>]*>[\s\S]*?<\/tfoot>/i, "");
      const rowMatches = [...rowSource.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      const rows = [];
      rowMatches.forEach((rm, rIdx) => {
        const cellMatches = [...rm[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)];
        const cells = cellMatches.map((m) => m[1].trim());
        if (!head.length && rIdx === 0 && rm[1].includes("<th")) {
          head = cells;
        } else if (cells.length > 0) {
          rows.push(cells);
        }
      });
      blocks.push(
        createBlock("table", {
          hasHeader: head.length > 0,
          hasFooter: false,
          striped: true,
          head: head.length > 0 ? head : ["Column 1", "Column 2"],
          rows: rows.length > 0 ? rows : [["Cell 1", "Cell 2"]],
          foot: [],
        })
      );
    } else {
      // Complex tags: div, section, etc. preserved as HTML block
      blocks.push(createBlock("html", { html: fullMatch.trim(), content: fullMatch.trim() }));
    }
  }

  const trailingText = cleanHtml.slice(lastIndex).trim();
  if (trailingText) {
    blocks.push(createBlock("paragraph", { content: trailingText }));
  }

  if (!foundTags) {
    const lines = cleanHtml.split(/\n\s*\n+/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed) {
        blocks.push(createBlock("paragraph", { content: trimmed }));
      }
    }
  }

  return blocks.length > 0 ? blocks : [createBlock("paragraph", { content: cleanHtml.trim() })];
}


/**
 * Parses HTML into structured JSON blocks.
 * Uses explicit block delimiters (<!-- block:type --> or <!-- wp:type -->) as primary source of truth.
 * Falls back to legacy parsing only when no delimiters are present.
 */
export function htmlToBlocks(html = "") {
  if (!html || !html.trim()) {
    return [createBlock("paragraph", { content: "" })];
  }

  const cleanHtml = sanitizeCorruptedCode(html);

  // 1. PRIMARY PATH: Explicit block delimiters
  const hasBlockDelimiters = /<!--\s*(?:block|wp):([\w-]+)/i.test(cleanHtml);

  if (hasBlockDelimiters) {
    const blocks = [];
    const blockRegex = /<!--\s*(?:block|wp):([\w-]+)(?:\s+({[\s\S]*?}))?\s*-->([\s\S]*?)<!--\s*\/(?:block|wp):\1\s*-->/gi;
    let match;
    let lastIndex = 0;

    while ((match = blockRegex.exec(cleanHtml)) !== null) {
      // Capture any un-delimited content between block markers
      const intermediate = cleanHtml.slice(lastIndex, match.index).trim();
      if (intermediate) {
        const fallbackBlocks = parseLegacyHtmlToBlocks(intermediate);
        blocks.push(...fallbackBlocks);
      }
      lastIndex = blockRegex.lastIndex;

      const rawType = match[1].toLowerCase();
      const type = rawType === "custom-html" ? "html" : rawType;
      const rawAttrs = match[2];
      const innerContent = match[3] !== undefined ? match[3].replace(/^\n+|\n+$/g, "") : "";

      let attributes = {};
      if (rawAttrs) {
        try {
          attributes = JSON.parse(rawAttrs);
        } catch (e) {}
      }

      switch (type) {
        case "html":
        case "custom-html": {
          // HTML Block Rule: An HTML Block must preserve its complete HTML source exactly
          // The <h2>, <p>, <div>, <section> inside this HTML must NOT be converted
          blocks.push(createBlock("html", { ...attributes, html: innerContent, content: innerContent }));
          break;
        }

        case "paragraph": {
          const text = innerContent
            .replace(/^<p[^>]*>/i, "")
            .replace(/<\/p>$/i, "")
            .trim();
          blocks.push(createBlock("paragraph", { ...attributes, content: text }));
          break;
        }

        case "heading": {
          const levelMatch = innerContent.match(/<h([1-6])/i);
          const level = levelMatch ? parseInt(levelMatch[1], 10) : (attributes.level || 2);
          const text = innerContent
            .replace(/^<h[1-6][^>]*>/i, "")
            .replace(/<\/h[1-6]>$/i, "")
            .trim();
          blocks.push(createBlock("heading", { ...attributes, level, content: text }));
          break;
        }

        case "code": {
          const codeMatch = innerContent.match(/<code[^>]*>([\s\S]*?)<\/code>/i);
          const codeText = codeMatch
            ? codeMatch[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
            : innerContent.replace(/^<pre[^>]*>/i, "").replace(/<\/pre>$/i, "");
          const langMatch = innerContent.match(/class="language-([^"]+)"/i);
          const language = langMatch ? langMatch[1] : (attributes.language || "javascript");
          blocks.push(createBlock("code", { ...attributes, language, code: codeText, content: codeText }));
          break;
        }

        case "list": {
          const items = [];
          const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
          let liMatch;
          while ((liMatch = liRegex.exec(innerContent)) !== null) {
            items.push(liMatch[1].trim());
          }
          const isOrdered = /<ol[^>]*>/i.test(innerContent) || attributes.listType === "ordered" || attributes.ordered;
          blocks.push(
            createBlock("list", {
              ...attributes,
              listType: isOrdered ? "ordered" : "unordered",
              ordered: isOrdered,
              items: items.length > 0 ? items : (attributes.items || [""]),
            })
          );
          break;
        }

        case "quote": {
          const pMatch = innerContent.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
          const citeMatch = innerContent.match(/<cite[^>]*>(?:—\s*)?([\s\S]*?)<\/cite>/i);
          const text = pMatch
            ? pMatch[1].trim()
            : innerContent.replace(/<cite[\s\S]*?<\/cite>/gi, "").replace(/^<blockquote[^>]*>/i, "").replace(/<\/blockquote>$/i, "").trim();
          const citation = citeMatch ? citeMatch[1].trim() : (attributes.citation || "");
          blocks.push(createBlock("quote", { ...attributes, content: text, citation }));
          break;
        }

        case "image": {
          const imgMatch = innerContent.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
          const altMatch = innerContent.match(/alt="([^"]*)"/i);
          const capMatch = innerContent.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
          blocks.push(
            createBlock("image", {
              ...attributes,
              url: attributes.url || (imgMatch ? imgMatch[1] : ""),
              alt: attributes.alt !== undefined ? attributes.alt : (altMatch ? altMatch[1] : ""),
              caption: attributes.caption !== undefined ? attributes.caption : (capMatch ? capMatch[1] : ""),
            })
          );
          break;
        }

        case "divider": {
          blocks.push(createBlock("divider", attributes));
          break;
        }

        case "button": {
          const aMatch = innerContent.match(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
          blocks.push(
            createBlock("button", {
              ...attributes,
              url: attributes.url || (aMatch ? aMatch[1] : "#"),
              text: attributes.text || (aMatch ? aMatch[2] : "Button"),
            })
          );
          break;
        }

        case "embed": {
          const ifrMatch = innerContent.match(/<iframe[^>]*src="([^"]*)"[^>]*>/i);
          blocks.push(
            createBlock("embed", {
              ...attributes,
              url: attributes.url || (ifrMatch ? ifrMatch[1] : ""),
            })
          );
          break;
        }

        case "table": {
          blocks.push(createBlock("table", { ...attributes }));
          break;
        }

        default:
          blocks.push(createBlock(type, { ...attributes, content: innerContent }));
          break;
      }
    }

    // Capture trailing content after last marker
    const trailing = cleanHtml.slice(lastIndex).trim();
    if (trailing) {
      const fallbackBlocks = parseLegacyHtmlToBlocks(trailing);
      blocks.push(...fallbackBlocks);
    }

    if (blocks.length > 0) {
      return blocks;
    }
  }

  // 2. FALLBACK PATH: Legacy content without explicit block delimiters
  return parseLegacyHtmlToBlocks(cleanHtml);
}

/**
 * Smart clipboard parser for rich text and multi-paragraph paste events.
 * Converts multi-paragraph or HTML clipboard data into structured Gutenberg blocks.
 */
export function parseClipboardContent(htmlData = "", plainTextData = "") {
  if (htmlData && htmlData.trim()) {
    // If it contains HTML block-level elements, parse into Gutenberg blocks
    if (/<(p|h[1-6]|ul|ol|table|blockquote|pre|figure|img|div|hr)[\s>]/i.test(htmlData)) {
      const parsed = htmlToBlocks(htmlData);
      if (parsed && parsed.length > 0) {
        return parsed;
      }
    }
  }

  if (plainTextData && plainTextData.trim()) {
    // If it contains multiple paragraphs separated by blank lines
    if (plainTextData.includes("\n\n") || plainTextData.includes("\r\n\r\n")) {
      const chunks = plainTextData.split(/\r?\n\s*\r?\n+/).map((c) => c.trim()).filter(Boolean);
      if (chunks.length > 1) {
        return chunks.map((chunk) => {
          if (/^#+\s/.test(chunk)) {
            const level = (chunk.match(/^(#+)/) || ["", "##"])[1].length;
            const content = chunk.replace(/^#+\s*/, "");
            return createBlock("heading", { level: Math.min(level, 6), content });
          }
          if (/^[-*]\s/.test(chunk)) {
            const items = chunk.split(/\r?\n/).map((l) => l.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
            return createBlock("list", { ordered: false, items: items.length > 0 ? items : [""] });
          }
          return createBlock("paragraph", { content: chunk.replace(/\r?\n/g, "<br>") });
        });
      }
    }
  }

  return null;
}
