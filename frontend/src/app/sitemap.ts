import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";
import { getBlogPosts } from "@/lib/blog";
import fs from "fs";
import path from "path";

export const revalidate = 0; // Dynamic sitemap revalidation

/**
 * Generates the XML sitemap dynamically using Next.js Metadata Route API.
 * Includes published blog posts dynamically from DB & content folder.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  const routes: MetadataRoute.Sitemap = [
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

  // Dynamic published blog posts from DB & markdown storage
  try {
    const posts = await getBlogPosts(false); // only published posts
    posts.forEach((post) => {
      routes.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.frontmatter.date ? new Date(post.frontmatter.date) : currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    });
  } catch (e) {
    console.error("Error fetching published blog posts for sitemap:", e);
  }

  return routes;
}
