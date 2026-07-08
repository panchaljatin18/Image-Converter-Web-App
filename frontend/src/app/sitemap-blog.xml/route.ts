import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const blogs = [
    { loc: "/blog", changefreq: "weekly", priority: "0.8" },
  ];

  const currentDate = new Date().toISOString().split("T")[0];

  const urlElements = blogs
    .map(
      (blog) => `  <url>
    <loc>${SITE_URL}${blog.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${blog.changefreq}</changefreq>
    <priority>${blog.priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
