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
        processedBlocks.push("</ul>");
        insideList = false;
      }
      processedBlocks.push(`<h3 class="font-['Outfit'] font-bold text-xl text-[#f8fafc] mt-8 mb-4">${block.slice(4)}</h3>`);
    } else if (block.startsWith("## ")) {
      if (insideList) {
        processedBlocks.push("</ul>");
        insideList = false;
      }
      processedBlocks.push(`<h2 class="font-['Outfit'] font-extrabold text-2xl text-[#f8fafc] mt-10 mb-5 border-b border-white/6 pb-2">${block.slice(3)}</h2>`);
    } else if (block.startsWith("# ")) {
      if (insideList) {
        processedBlocks.push("</ul>");
        insideList = false;
      }
      processedBlocks.push(`<h1 class="font-['Outfit'] font-black text-3xl md:text-4xl text-[#f8fafc] mt-12 mb-6">${block.slice(2)}</h1>`);
    }
    // Lists (bullet points starting with - )
    else if (block.startsWith("- ")) {
      if (!insideList) {
        processedBlocks.push('<ul class="list-disc pl-6 space-y-2 mb-6 text-[#cbd5e1] leading-relaxed">');
        insideList = true;
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
    // Standard paragraphs
    else {
      if (insideList) {
        processedBlocks.push("</ul>");
        insideList = false;
      }
      processedBlocks.push(`<p class="text-[#cbd5e1] text-[1.025rem] leading-[1.8] mb-6">${block.replace(/\n/g, "<br />")}</p>`);
    }
  }

  if (insideList) {
    processedBlocks.push("</ul>");
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

/**
 * Helper to ensure the blog directory exists.
 */
function ensureBlogDirectory() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

/**
 * Reads and returns all blog posts sorted by date.
 */
export function getBlogPosts() {
  ensureBlogDirectory();
  try {
    const files = fs.readdirSync(BLOG_DIR);
    const posts = files
      .filter(file => file.endsWith(".md"))
      .map(file => {
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { frontmatter, content } = parseMarkdownFile(fileContent);
        const slug = file.replace(".md", "");

        return {
          slug,
          frontmatter,
          content
        };
      })
      .filter(post => post.frontmatter.title) // Ensure valid post
      .sort((a, b) => {
        const dateA = new Date(a.frontmatter.date || "");
        const dateB = new Date(b.frontmatter.date || "");
        return dateB - dateA; // Newest first
      });

    return posts;
  } catch (e) {
    console.error("Error loading blog posts:", e);
    return [];
  }
}

/**
 * Reads a single post by slug, parses it, and renders its body to HTML.
 */
export function getBlogPostBySlug(slug) {
  ensureBlogDirectory();
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { frontmatter, content } = parseMarkdownFile(fileContent);
    const htmlContent = markdownToHtml(content);

    return {
      slug,
      frontmatter,
      htmlContent,
      content
    };
  } catch (e) {
    console.error(`Error loading blog post by slug (${slug}):`, e);
    return null;
  }
}

/**
 * Fetches blog posts that target a specific tool (used for internal linking on tool pages).
 */
export function getRelatedBlogPosts(toolKey) {
  const posts = getBlogPosts();
  return posts.filter(post => post.frontmatter.relatedToolSlug === toolKey);
}
