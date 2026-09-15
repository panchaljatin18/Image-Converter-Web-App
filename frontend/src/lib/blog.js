import fs from "fs";
import path from "path";
import { blocksToHtml, htmlToBlocks } from "../components/BlockEditor/utils/serializer.js";
import { normalizeBlockState } from "../components/BlockEditor/utils/blockTypes.js";

// Path to blog posts directory
const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

/**
 * Parses simple markdown formatting (headings, paragraphs, lists, bold, links) into HTML.
 * Runs 100% on the server side.
 */
export function markdownToHtml(md) {
  if (!md) return "";

  // Normalize newlines
  let html = md.replace(/\r\n/g, "\n");

  // Fenced Code Blocks ```code```
  html = html.replace(/```(?:\w+)?\n([\s\S]*?)```/g, (match, code) => {
    const escapedCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre class="bg-[#090915] p-4 rounded-xl text-indigo-300 font-mono text-xs overflow-x-auto my-6 border border-white/10 shadow-inner"><code>${escapedCode}</code></pre>`;
  });

  // Images: ![alt](url)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
    return `<figure class="my-8 text-center"><img src="${url}" alt="${alt}" loading="lazy" decoding="async" class="w-full max-h-[500px] object-cover rounded-2xl border border-white/10 shadow-2xl mx-auto" />${alt ? `<figcaption class="text-center text-xs text-[#9494a3] mt-2 font-mono">${alt}</figcaption>` : ''}</figure>`;
  });

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, "<del class=\"line-through text-gray-400\">$1</del>");

  // Highlight
  html = html.replace(/==(.*?)==/g, "<mark class=\"bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded font-medium border border-yellow-500/30\">$1</mark>");

  // Inline code / monospace text
  html = html.replace(/`(.*?)`/g, "<code class=\"bg-white/5 px-1.5 py-0.5 rounded text-indigo-300 text-xs font-mono border border-white/10\">$1</code>");

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-indigo-400 hover:text-indigo-300 underline font-semibold transition-colors">$1</a>');

  // Extract and protect raw HTML, Style & Script blocks (e.g. JSON-LD FAQ Schema, custom HTML blocks, details)
  const rawHtmlBlocks = [];

  // Clean up any corrupted <p class="text-[#cbd5e1]"> wrapping CSS rules or HTML code
  html = html.replace(/<p[^>]*class="[^"]*text-\[#cbd5e1\][^"]*"[^>]*>([\s\S]*?)<\/p>/gi, (m, content) => {
    if (content.includes("summary") || content.includes("faq") || content.includes("{") || content.includes("padding") || content.includes("font-size")) {
      return content.replace(/<br\s*\/?>/gi, "\n").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    }
    return m;
  });

  // 1. Script tags (including <script type="application/ld+json">)
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, (match) => {
    rawHtmlBlocks.push(match);
    return `\n\n___RAW_HTML_BLOCK_${rawHtmlBlocks.length - 1}___\n\n`;
  });

  // 2. Style tags (CRITICAL: Protect <style> CSS blocks from paragraph wrapping)
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
    rawHtmlBlocks.push(match);
    return `\n\n___RAW_HTML_BLOCK_${rawHtmlBlocks.length - 1}___\n\n`;
  });

  // 3. Custom HTML wrapper divs
  html = html.replace(/<div class="(?:custom-html-block|wp-custom-html-card|wp-block-html|wp-block-custom-html|faq-container|faq-schema-block)[^>]*">[\s\S]*?<\/div>/gi, (match) => {
    rawHtmlBlocks.push(match);
    return `\n\n___RAW_HTML_BLOCK_${rawHtmlBlocks.length - 1}___\n\n`;
  });

  // 4. HTML details / accordions
  html = html.replace(/<details[^>]*>[\s\S]*?<\/details>/gi, (match) => {
    rawHtmlBlocks.push(match);
    return `\n\n___RAW_HTML_BLOCK_${rawHtmlBlocks.length - 1}___\n\n`;
  });

  // Split content into blocks by double newline
  const lines = html.split(/\n\n+/);
  let insideList = false;
  const processedBlocks = [];

  for (let block of lines) {
    block = block.trim();
    if (!block) continue;

    // Check for protected raw HTML block placeholder
    if (/^___RAW_HTML_BLOCK_\d+___$/.test(block)) {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      const idx = parseInt(block.replace("___RAW_HTML_BLOCK_", "").replace("___", ""), 10);
      if (!isNaN(idx) && rawHtmlBlocks[idx] !== undefined) {
        processedBlocks.push(rawHtmlBlocks[idx]);
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
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      processedBlocks.push(block);
      continue;
    }

    // Already processed code blocks or figures
    if (block.startsWith("<pre") || block.startsWith("<figure")) {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      processedBlocks.push(block);
      continue;
    }

    // Callout Box (> 💡 or > [!NOTE])
    if (block.startsWith("> 💡") || block.startsWith("> [!NOTE]") || block.startsWith("> [!TIP]") || block.startsWith("> 📌")) {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      const cleanContent = block.replace(/^>\s*(\[!(NOTE|TIP|IMPORTANT)\]|💡|📌)?\s*/g, "");
      processedBlocks.push(`
        <div class="my-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 flex items-start gap-3 shadow-md">
          <span class="text-xl shrink-0 mt-0.5">💡</span>
          <div class="text-sm leading-relaxed">${cleanContent.replace(/\n/g, "<br />")}</div>
        </div>
      `);
      continue;
    }

    // Standard Blockquotes (> text)
    if (block.startsWith("> ")) {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      const quoteText = block.replace(/^>\s*/gm, "");
      processedBlocks.push(`
        <blockquote class="my-6 border-l-4 border-indigo-500 pl-5 py-3 bg-white/[0.02] rounded-r-xl italic text-[#e2e8f0] text-base leading-relaxed">
          "${quoteText.replace(/\n/g, "<br />")}"
        </blockquote>
      `);
      continue;
    }

    // Strip outer <p> wrappers if block is just wrapping a markdown heading
    if (/^<p[^>]*>\s*(#{1,6}\s+[\s\S]*?)\s*<\/p>$/i.test(block)) {
      block = block.replace(/^<p[^>]*>\s*(#{1,6}\s+[\s\S]*?)\s*<\/p>$/i, "$1").trim();
    }

    // Headings (supports #, ##, ###, ####, #####, ######)
    const headingMatch = block.match(/^(#{1,6})\s+(.*)$/s);
    if (headingMatch) {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      const level = headingMatch[1].length;
      const titleText = headingMatch[2].trim();
      const hTag = `h${level}`;
      const headingClassesMap = {
        1: "font-['Outfit'] font-black text-[clamp(1.65rem,4vw,2.5rem)] text-[#f8fafc] mt-12 mb-6 break-words [overflow-wrap:anywhere]",
        2: "font-['Outfit'] font-extrabold text-[clamp(1.35rem,3vw,1.85rem)] text-[#f8fafc] mt-10 mb-5 border-b border-indigo-500/20 pb-2 break-words [overflow-wrap:anywhere]",
        3: "font-['Outfit'] font-bold text-[clamp(1.15rem,2.4vw,1.45rem)] text-[#f8fafc] mt-8 mb-4 break-words [overflow-wrap:anywhere]",
        4: "font-['Outfit'] font-bold text-[clamp(1.02rem,2vw,1.2rem)] text-[#f8fafc] mt-6 mb-3 break-words [overflow-wrap:anywhere]",
        5: "font-['Outfit'] font-semibold text-[clamp(0.95rem,1.8vw,1.1rem)] text-[#f8fafc] mt-5 mb-2 break-words [overflow-wrap:anywhere]",
        6: "font-['Outfit'] font-bold text-[clamp(0.875rem,1.5vw,1rem)] text-[#a5b4fc] mt-4 mb-2 uppercase tracking-wider break-words [overflow-wrap:anywhere]",
      };
      processedBlocks.push(`<${hTag} class="${headingClassesMap[level] || headingClassesMap[2]}">${titleText}</${hTag}>`);
      continue;
    }
    // Lists (bullet points starting with - or * )
    else if (block.startsWith("- ") || block.startsWith("* ")) {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
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
      processedBlocks.push(`<ul class="list-disc pl-6 space-y-2 mb-6 text-[#cbd5e1] leading-relaxed">\n${liElements.join("\n")}\n</ul>`);
      continue;
    }
    // Lists (numbered list starting with digits like 1. )
    else if (/^\d+\.\s/.test(block)) {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
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
      processedBlocks.push(`<ol class="list-decimal pl-6 space-y-2 mb-6 text-[#cbd5e1] leading-relaxed">\n${liElements.join("\n")}\n</ol>`);
      continue;
    }
    // Horizontal divider
    else if (block === "---") {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      processedBlocks.push('<hr class="border-t border-white/10 my-8" />');
    }
    // Standard paragraphs
    else {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      const cleanBlockText = block.replace(/^<p[^>]*>/i, "").replace(/<\/p>$/i, "").trim();
      const paragraphHeadingMatch = cleanBlockText.match(/^(#{1,6})\s+(.*)$/s);
      if (paragraphHeadingMatch) {
        const level = paragraphHeadingMatch[1].length;
        const titleText = paragraphHeadingMatch[2].trim();
        const hTag = `h${level}`;
        const headingClassesMap = {
          1: "font-['Outfit'] font-black text-[clamp(1.65rem,4vw,2.5rem)] text-[#f8fafc] mt-12 mb-6 break-words [overflow-wrap:anywhere]",
          2: "font-['Outfit'] font-extrabold text-[clamp(1.35rem,3vw,1.85rem)] text-[#f8fafc] mt-10 mb-5 border-b border-indigo-500/20 pb-2 break-words [overflow-wrap:anywhere]",
          3: "font-['Outfit'] font-bold text-[clamp(1.15rem,2.4vw,1.45rem)] text-[#f8fafc] mt-8 mb-4 break-words [overflow-wrap:anywhere]",
          4: "font-['Outfit'] font-bold text-[clamp(1.02rem,2vw,1.2rem)] text-[#f8fafc] mt-6 mb-3 break-words [overflow-wrap:anywhere]",
          5: "font-['Outfit'] font-semibold text-[clamp(0.95rem,1.8vw,1.1rem)] text-[#f8fafc] mt-5 mb-2 break-words [overflow-wrap:anywhere]",
          6: "font-['Outfit'] font-bold text-[clamp(0.875rem,1.5vw,1rem)] text-[#a5b4fc] mt-4 mb-2 uppercase tracking-wider break-words [overflow-wrap:anywhere]",
        };
        processedBlocks.push(`<${hTag} class="${headingClassesMap[level] || headingClassesMap[2]}">${titleText}</${hTag}>`);
      } else {
        processedBlocks.push(`<p class="text-[#cbd5e1] text-[1.025rem] leading-[1.8] mb-6 [overflow-wrap:anywhere]">${block.replace(/\n/g, "<br />")}</p>`);
      }
    }
  }

  if (insideList) {
    processedBlocks.push(`</${insideList}>`);
  }

  const rawHtml = processedBlocks.join("\n");
  return sanitizeAndBalanceDivs(rawHtml);
}

/**
 * Void/Self-closing HTML tags that do not require a closing tag.
 */
const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
  "meta", "param", "source", "track", "wbr"
]);

/**
 * Ensures all HTML tags within content are perfectly balanced, repairs missing closing tags,
 * eliminates orphan closing tags, and safely validates JSON-LD script blocks.
 * Guarantees that invalid HTML snippets cannot break public website page layouts.
 */
export function balanceAndRepairHtml(html) {
  if (!html) return "";
  let cleaned = html.replace(/<div>\s*(<br\s*\/?>)?\s*<\/div>/gi, "");

  // 1. Repair and validate JSON-LD script blocks
  cleaned = cleaned.replace(/<script([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, content) => {
    if (attrs.includes('type="application/ld+json"') || attrs.includes("application/ld+json")) {
      try {
        JSON.parse(content.trim());
        return match;
      } catch (e) {
        return `<script${attrs}>/* Invalid JSON-LD schema ignored */</script>`;
      }
    }
    return match;
  });

  // 2. Stack-based tag balancing algorithm
  const tagRegex = /<!--[\s\S]*?-->|<(\/)?([a-zA-Z0-9-]+)([^>]*)>/gi;
  const stack = [];
  let result = "";
  let lastIndex = 0;
  let match;

  while ((match = tagRegex.exec(cleaned)) !== null) {
    const fullMatch = match[0];
    const isClosing = Boolean(match[1]);
    const tagName = match[2] ? match[2].toLowerCase() : "";
    const isSelfClosing = fullMatch.endsWith("/>") || VOID_TAGS.has(tagName);

    result += cleaned.slice(lastIndex, match.index);
    lastIndex = tagRegex.lastIndex;

    if (fullMatch.startsWith("<!--") || !tagName) {
      result += fullMatch;
      continue;
    }

    if (VOID_TAGS.has(tagName) || isSelfClosing) {
      result += fullMatch;
      continue;
    }

    if (!isClosing) {
      stack.push(tagName);
      result += fullMatch;
    } else {
      const stackIndex = stack.lastIndexOf(tagName);
      if (stackIndex !== -1) {
        while (stack.length > stackIndex + 1) {
          const unclosedTag = stack.pop();
          result += `</${unclosedTag}>`;
        }
        stack.pop();
        result += fullMatch;
      } else {
        // Skip orphan closing tag to prevent breaking parent container
      }
    }
  }

  result += cleaned.slice(lastIndex);

  while (stack.length > 0) {
    const unclosedTag = stack.pop();
    result += `</${unclosedTag}>`;
  }

  return result;
}

/**
 * Ensures HTML tags within content are balanced and strips orphan closing tags.
 */
export function sanitizeAndBalanceDivs(html) {
  return balanceAndRepairHtml(html);
}

/**
 * Parses frontmatter from a markdown file.
 * Returns { frontmatter, content }
 */
export function parseMarkdownFile(fileContent) {
  const normalized = fileContent.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, content: normalized };
  }

  const frontmatterBlock = match[1];
  const content = match[2];
  const frontmatter = {};

  frontmatterBlock.split("\n").forEach(line => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Strip leading/trailing quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      
      frontmatter[key] = value;
    }
  });

  return { frontmatter, content };
}

import dbConnect from "@/lib/db";
import { BlogPost, SeededLock } from "@/models/BlogPost";

/**
 * Automatically seeds markdown posts from src/content/blog to MongoDB if database is empty.
 */
async function seedMarkdownToDB() {
  try {
    // Check if we have already executed the initial migration before
    const hasSeeded = await SeededLock.findOne();
    if (hasSeeded) return; // Exit immediately, database migration already executed once

    if (!fs.existsSync(BLOG_DIR)) return;

    const files = fs.readdirSync(BLOG_DIR);
    console.log(`Seeding ${files.length} markdown posts to MongoDB...`);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { frontmatter, content } = parseMarkdownFile(fileContent);
      const slug = file.replace(".md", "");
      const htmlContent = markdownToHtml(content);

      await BlogPost.create({
        slug,
        title: frontmatter.title || "Untitled Post",
        description: frontmatter.description || "",
        date: frontmatter.date || new Date().toISOString().split("T")[0],
        focusKeyword: frontmatter.focusKeyword || "",
        relatedToolSlug: frontmatter.relatedToolSlug || "",
        image: frontmatter.image || "",
        imageAlt: frontmatter.imageAlt || "",
        author: frontmatter.author || "Convert Galaxy Team",
        status: frontmatter.status || "Draft",
        content,
        htmlContent,
      });
    }

    // Set lock flag so we never re-seed
    await SeededLock.create({ seeded: true });
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding markdown posts failed:", err);
  }
}

/**
 * Reads and returns all blog posts sorted by date from MongoDB.
 */
export async function getBlogPosts(includeDrafts = false) {
  let posts = [];
  try {
    await dbConnect();
    await seedMarkdownToDB();

    const query = includeDrafts ? {} : { status: { $ne: "Draft" } };
    const dbPosts = await BlogPost.find(query).sort({ date: -1 });

    posts = dbPosts.map(post => ({
      slug: post.slug,
      frontmatter: {
        title: post.title,
        description: post.description,
        date: post.date,
        focusKeyword: post.focusKeyword || "",
        relatedToolSlug: post.relatedToolSlug || "",
        image: post.image || "",
        imageAlt: post.imageAlt || "",
        imageTitle: post.imageTitle || "",
        author: post.author || "Convert Galaxy Team",
        status: post.status || "Draft",
      },
      content: post.content,
      htmlContent: post.htmlContent || "",
      content_blocks: post.content_blocks ? normalizeBlockState(post.content_blocks) : null,
    }));
  } catch (e) {
    console.error("Error loading blog posts from DB:", e);
  }

  return posts;
}

/**
 * Reads a single post by slug exclusively from MongoDB.
 */
export async function getBlogPostBySlug(slug) {
  try {
    await dbConnect();

    const post = await BlogPost.findOne({ slug });
    if (post) {
      let loadedBlocks = null;
      if (post.content_blocks && (post.content_blocks.blocks || Array.isArray(post.content_blocks))) {
        loadedBlocks = normalizeBlockState(post.content_blocks);
      } else {
        loadedBlocks = { version: 1, blocks: htmlToBlocks(post.content || "") };
      }

      let htmlContent = post.htmlContent;
      if (!htmlContent || htmlContent.includes("<!-- block:")) {
        htmlContent = blocksToHtml(loadedBlocks.blocks, { includeDelimiters: false, forPublic: true });
      }

      return {
        slug: post.slug,
        frontmatter: {
          title: post.title,
          description: post.description,
          date: post.date,
          focusKeyword: post.focusKeyword || "",
          relatedToolSlug: post.relatedToolSlug || "",
          image: post.image || "",
          imageAlt: post.imageAlt || "",
          imageTitle: post.imageTitle || "",
          author: post.author || "Convert Galaxy Team",
          status: post.status || "Draft",
        },
        content: post.content,
        htmlContent: htmlContent || markdownToHtml(post.content),
        content_blocks: loadedBlocks,
      };
    }
  } catch (e) {
    console.error(`Error loading blog post by slug (${slug}) from DB:`, e);
  }

  return null;
}


/**
 * Fetches blog posts that target a specific tool from MongoDB.
 */
export async function getRelatedBlogPosts(toolKey) {
  try {
    await dbConnect();
    await seedMarkdownToDB();

    const posts = await BlogPost.find({ status: { $ne: "Draft" }, relatedToolSlug: toolKey }).sort({ date: -1 });
    return posts.map(post => ({
      slug: post.slug,
      frontmatter: {
        title: post.title,
        description: post.description,
        date: post.date,
        focusKeyword: post.focusKeyword || "",
        relatedToolSlug: post.relatedToolSlug || "",
        image: post.image || "",
        imageAlt: post.imageAlt || "",
        author: post.author || "Convert Galaxy Team",
        status: post.status || "Draft",
      },
      content: post.content,
      htmlContent: post.htmlContent || "",
    }));
  } catch (e) {
    console.error("Error fetching related posts from DB:", e);
    return [];
  }
}

import { revalidatePath } from "next/cache";

/**
 * Saves or updates blog post data to MongoDB and local disk storage.
 */
export async function saveBlogPost(slug, {
  title,
  description,
  date,
  focusKeyword,
  relatedToolSlug,
  image,
  imageAlt,
  imageTitle,
  author,
  status,
  content,
  editorHtml,
  content_blocks
}) {
  // Normalize content_blocks to ensure single source of truth: { version: 1, blocks: [...] }
  let structuredBlocks = null;
  if (content_blocks) {
    structuredBlocks = normalizeBlockState(content_blocks);
  } else if (content) {
    structuredBlocks = { version: 1, blocks: htmlToBlocks(content) };
  } else {
    structuredBlocks = { version: 1, blocks: [] };
  }

  // Generate delimited content for storage & clean semantic HTML for public display
  const delimitedContent = blocksToHtml(structuredBlocks.blocks, { includeDelimiters: true });
  const publicHtml = blocksToHtml(structuredBlocks.blocks, { includeDelimiters: false, forPublic: true });

  const finalContent = delimitedContent || sanitizeAndBalanceDivs(content || "");
  const finalHtmlContent = publicHtml || markdownToHtml(finalContent);

  // 1. Save/update directly in MongoDB
  try {
    await dbConnect();
    await BlogPost.findOneAndUpdate(
      { slug },
      {
        title,
        description,
        date,
        focusKeyword,
        relatedToolSlug,
        image,
        imageAlt,
        imageTitle,
        author,
        status,
        content: finalContent,
        htmlContent: finalHtmlContent,
        editorHtml: editorHtml || "",
        content_blocks: structuredBlocks,
      },
      { upsert: true, new: true }
    );
  } catch (e) {
    console.error("Error saving blog post to DB:", e);
    throw e;
  }

  // 2. Revalidate Next.js static & server caches
  try {
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
  } catch (rErr) {
    // Ignore revalidation error outside request context
  }
}

/**
 * Deletes the blog post from MongoDB database.
 */
export async function deleteBlogPost(slug) {
  let deletedFromDb = false;

  // 1. Delete from MongoDB
  try {
    await dbConnect();
    const result = await BlogPost.deleteOne({ slug });
    deletedFromDb = result.deletedCount > 0;
  } catch (e) {
    console.error("Error deleting blog post from DB:", e);
  }

  // 2. Clean up legacy disk files if any still exist
  try {
    if (fs.existsSync(BLOG_DIR)) {
      const filePath = path.join(BLOG_DIR, `${slug}.md`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      const blocksFilePath = path.join(BLOG_DIR, `${slug}.blocks.json`);
      if (fs.existsSync(blocksFilePath)) fs.unlinkSync(blocksFilePath);
    }
  } catch (fsErr) {
    // Ignore legacy cleanup error
  }

  // 3. Revalidate Next.js cache
  try {
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
  } catch (rErr) {
    // Ignore revalidation error
  }

  return deletedFromDb;
}

/**
 * Role-based server-side sanitization layer for Custom HTML blocks.
 * Users with 'unfiltered_html' capability (admin/superadmin) save raw content as-is.
 * Non-admin roles pass through an allowlist sanitizer stripping <script>, inline <style>, and on* event handlers.
 */
export function sanitizeCustomHtmlByRole(rawContent = "", userRole = "admin") {
  if (!rawContent) return "";

  // Administrators and Super Admins have 'unfiltered_html' capability -> raw identity passthrough
  if (userRole === "admin" || userRole === "superadmin" || userRole === "administrator") {
    return rawContent;
  }

  // Non-admin roles: strip <script>, <style>, and inline on* event attributes
  let clean = rawContent;
  clean = clean.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  clean = clean.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  clean = clean.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  return clean;
}


