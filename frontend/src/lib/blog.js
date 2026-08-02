import fs from "fs";
import path from "path";

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
    return `<figure class="my-8 text-center"><img src="${url}" alt="${alt}" class="w-full max-h-[500px] object-cover rounded-2xl border border-white/10 shadow-2xl mx-auto" />${alt ? `<figcaption class="text-center text-xs text-[#9494a3] mt-2 font-mono">${alt}</figcaption>` : ''}</figure>`;
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

    // Headings
    if (block.startsWith("#### ")) {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      processedBlocks.push(`<h4 class="font-['Outfit'] font-bold text-lg text-[#f8fafc] mt-6 mb-3">${block.slice(5)}</h4>`);
    } else if (block.startsWith("### ")) {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      processedBlocks.push(`<h3 class="font-['Outfit'] font-bold text-xl text-[#f8fafc] mt-8 mb-4">${block.slice(4)}</h3>`);
    } else if (block.startsWith("## ")) {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      processedBlocks.push(`<h2 class="font-['Outfit'] font-extrabold text-2xl text-[#f8fafc] mt-10 mb-5 border-b border-white/6 pb-2">${block.slice(3)}</h2>`);
    } else if (block.startsWith("# ")) {
      if (insideList) {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      processedBlocks.push(`<h1 class="font-['Outfit'] font-black text-3xl md:text-4xl text-[#f8fafc] mt-12 mb-6">${block.slice(2)}</h1>`);
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
      processedBlocks.push(`<p class="text-[#cbd5e1] text-[1.025rem] leading-[1.8] mb-6">${block.replace(/\n/g, "<br />")}</p>`);
    }
  }

  if (insideList) {
    processedBlocks.push(`</${insideList}>`);
  }

  return processedBlocks.join("\n");
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
        author: post.author || "Convert Galaxy Team",
        status: post.status || "Draft",
      },
      content: post.content,
      htmlContent: post.htmlContent || "",
    }));
  } catch (e) {
    console.error("Error loading blog posts from DB, using disk fallback:", e);
  }

  // Fallback to reading markdown files on disk if DB returned nothing or failed
  if (posts.length === 0 && fs.existsSync(BLOG_DIR)) {
    try {
      const files = fs.readdirSync(BLOG_DIR);
      for (const file of files) {
        if (!file.endsWith(".md")) continue;
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { frontmatter, content } = parseMarkdownFile(fileContent);
        const slug = file.replace(".md", "");

        if (!includeDrafts && frontmatter.status === "Draft") continue;

        posts.push({
          slug,
          frontmatter: {
            title: frontmatter.title || "Untitled Post",
            description: frontmatter.description || "",
            date: frontmatter.date || new Date().toISOString().split("T")[0],
            focusKeyword: frontmatter.focusKeyword || "",
            relatedToolSlug: frontmatter.relatedToolSlug || "",
            image: frontmatter.image || "",
            imageAlt: frontmatter.imageAlt || "",
            author: frontmatter.author || "Convert Galaxy Team",
            status: frontmatter.status || "Draft",
          },
          content,
          htmlContent: markdownToHtml(content),
        });
      }
    } catch (fsErr) {
      console.error("Disk reading fallback failed:", fsErr);
    }
  }

  return posts;
}

/**
 * Reads a single post by slug from MongoDB (with disk fallback).
 */
export async function getBlogPostBySlug(slug) {
  try {
    await dbConnect();
    await seedMarkdownToDB();

    const post = await BlogPost.findOne({ slug });
    if (post) {
      const htmlContent = post.htmlContent || markdownToHtml(post.content);
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
          author: post.author || "Convert Galaxy Team",
          status: post.status || "Draft",
        },
        content: post.content,
        htmlContent,
      };
    }
  } catch (e) {
    console.error(`Error loading blog post by slug (${slug}) from DB:`, e);
  }

  // Disk fallback for single post
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { frontmatter, content } = parseMarkdownFile(fileContent);
      return {
        slug,
        frontmatter: {
          title: frontmatter.title || "Untitled Post",
          description: frontmatter.description || "",
          date: frontmatter.date || new Date().toISOString().split("T")[0],
          focusKeyword: frontmatter.focusKeyword || "",
          relatedToolSlug: frontmatter.relatedToolSlug || "",
          image: frontmatter.image || "",
          imageAlt: frontmatter.imageAlt || "",
          author: frontmatter.author || "Convert Galaxy Team",
          status: frontmatter.status || "Draft",
        },
        content,
        htmlContent: markdownToHtml(content),
      };
    }
  } catch (fsErr) {
    console.error(`Disk fallback for ${slug} failed:`, fsErr);
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
export async function saveBlogPost(slug, { title, description, date, focusKeyword, relatedToolSlug, image, imageAlt, imageTitle, author, status, content }) {
  const htmlContent = markdownToHtml(content);

  // 1. Save to local markdown file in src/content/blog
  try {
    if (!fs.existsSync(BLOG_DIR)) {
      fs.mkdirSync(BLOG_DIR, { recursive: true });
    }
    const mdFileContent = `---
title: "${(title || "").replace(/"/g, '\\"')}"
description: "${(description || "").replace(/"/g, '\\"')}"
date: "${date || new Date().toISOString().split("T")[0]}"
focusKeyword: "${focusKeyword || ""}"
relatedToolSlug: "${relatedToolSlug || ""}"
image: "${image || ""}"
imageAlt: "${imageAlt || ""}"
imageTitle: "${imageTitle || ""}"
author: "${author || "Convert Galaxy Team"}"
status: "${status || "Draft"}"
---

${content || ""}`;

    fs.writeFileSync(path.join(BLOG_DIR, `${slug}.md`), mdFileContent, "utf-8");
  } catch (fsErr) {
    console.error("Warning: Failed writing markdown file to disk:", fsErr);
  }

  // 2. Save/update in MongoDB
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
        content,
        htmlContent,
      },
      { upsert: true, new: true }
    );
  } catch (e) {
    console.error("Warning: Error saving blog post to DB:", e);
  }

  // 3. Revalidate Next.js static & server caches
  try {
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
  } catch (rErr) {
    // Ignore revalidation error outside request context
  }
}

/**
 * Deletes the blog post from MongoDB and local markdown storage.
 */
export async function deleteBlogPost(slug) {
  let deletedFromDisk = false;
  let deletedFromDb = false;

  // 1. Delete local file from src/content/blog
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deletedFromDisk = true;
    }
  } catch (fsErr) {
    console.error("Error deleting markdown file from disk:", fsErr);
  }

  // 2. Delete from MongoDB
  try {
    await dbConnect();
    const result = await BlogPost.deleteOne({ slug });
    deletedFromDb = result.deletedCount > 0;
  } catch (e) {
    console.error("Error deleting blog post from DB:", e);
  }

  // 3. Revalidate Next.js cache
  try {
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
  } catch (rErr) {
    // Ignore revalidation error
  }

  return deletedFromDisk || deletedFromDb;
}
