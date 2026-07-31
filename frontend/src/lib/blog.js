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

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Inline code / monospace text
  html = html.replace(/`(.*?)`/g, "<code className=\"bg-white/5 px-1.5 py-0.5 rounded text-indigo-300 text-xs font-mono\">$1</code>");

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-indigo-400 hover:text-indigo-300 underline font-semibold transition-colors">$1</a>');

  // Split content into blocks by double newline
  const lines = html.split(/\n\n+/);
  let insideList = false;
  const processedBlocks = [];

  for (let block of lines) {
    block = block.trim();
    if (!block) continue;

    // Headings
    if (block.startsWith("### ")) {
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
    // Lists (bullet points starting with - )
    else if (block.startsWith("- ")) {
      if (insideList && insideList !== "ul") {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      if (!insideList) {
        processedBlocks.push('<ul class="list-disc pl-6 space-y-2 mb-6 text-[#cbd5e1] leading-relaxed">');
        insideList = "ul";
      }
      const listItems = block.split(/\n- /);
      listItems.forEach(item => {
        let cleanItem = item.trim();
        if (cleanItem.startsWith("- ")) {
          cleanItem = cleanItem.slice(2);
        }
        if (cleanItem) {
          processedBlocks.push(`<li>${cleanItem}</li>`);
        }
      });
    }
    // Lists (numbered list starting with digits like 1. )
    else if (/^\d+\.\s/.test(block)) {
      if (insideList && insideList !== "ol") {
        processedBlocks.push(`</${insideList}>`);
        insideList = false;
      }
      if (!insideList) {
        processedBlocks.push('<ol class="list-decimal pl-6 space-y-2 mb-6 text-[#cbd5e1] leading-relaxed">');
        insideList = "ol";
      }
      const listItems = block.split(/\n\d+\.\s/);
      listItems.forEach(item => {
        let cleanItem = item.trim();
        if (/^\d+\.\s/.test(cleanItem)) {
          cleanItem = cleanItem.replace(/^\d+\.\s/, "");
        }
        if (cleanItem) {
          processedBlocks.push(`<li>${cleanItem}</li>`);
        }
      });
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
  try {
    await dbConnect();
    await seedMarkdownToDB();

    const query = includeDrafts ? {} : { status: { $ne: "Draft" } };
    const posts = await BlogPost.find(query).sort({ date: -1 });

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
    console.error("Error loading blog posts from DB:", e);
    return [];
  }
}

/**
 * Reads a single post by slug from MongoDB.
 */
export async function getBlogPostBySlug(slug) {
  try {
    await dbConnect();
    await seedMarkdownToDB();

    const post = await BlogPost.findOne({ slug });
    if (!post) return null;

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
  } catch (e) {
    console.error(`Error loading blog post by slug (${slug}) from DB:`, e);
    return null;
  }
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

/**
 * Saves or updates blog post data to MongoDB.
 */
export async function saveBlogPost(slug, { title, description, date, focusKeyword, relatedToolSlug, image, imageAlt, imageTitle, author, status, content }) {
  try {
    await dbConnect();
    const htmlContent = markdownToHtml(content);

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
    console.error("Error saving blog post to DB:", e);
    throw e;
  }
}

/**
 * Deletes the blog post from MongoDB.
 */
export async function deleteBlogPost(slug) {
  try {
    await dbConnect();
    const result = await BlogPost.deleteOne({ slug });
    return result.deletedCount > 0;
  } catch (e) {
    console.error("Error deleting blog post from DB:", e);
    return false;
  }
}
