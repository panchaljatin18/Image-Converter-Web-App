import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";
import fs from "fs";
import path from "path";

/**
 * Generates the XML sitemap dynamically using Next.js Metadata Route API.
 * Scans tools and blog posts directories at build time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const routes = [
    // Core pages
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  // Dynamic tools pages (scan src/app/tools directory)
  try {
    const toolsDir = path.join(process.cwd(), "src/app/tools");
    if (fs.existsSync(toolsDir)) {
      const items = fs.readdirSync(toolsDir);
      items.forEach((item) => {
        const itemPath = path.join(toolsDir, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory() && !item.startsWith(".")) {
          const hasPage = fs.existsSync(path.join(itemPath, "page.js")) || fs.existsSync(path.join(itemPath, "page.tsx"));
          if (hasPage) {
            routes.push({
              url: `${SITE_URL}/tools/${item}`,
              lastModified: currentDate,
              changeFrequency: "weekly" as const,
              priority: 0.9,
            });
          }
        }
      });
    }
  } catch (e) {
    console.error("Error reading tools directory for sitemap:", e);
  }

  // Dynamic blog posts (scan src/content/blog directory)
  try {
    const blogDir = path.join(process.cwd(), "src/content/blog");
    if (fs.existsSync(blogDir)) {
      const items = fs.readdirSync(blogDir);
      items.forEach((item) => {
        if (item.endsWith(".md")) {
          const slug = item.replace(".md", "");
          const filePath = path.join(blogDir, item);
          const stat = fs.statSync(filePath);
          routes.push({
            url: `${SITE_URL}/blog/${slug}`,
            lastModified: stat.mtime || currentDate,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          });
        }
      });
    }
  } catch (e) {
    console.error("Error reading blog directory for sitemap:", e);
  }

  return routes;
}
