import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const tools = [
    { loc: "/tools", changefreq: "weekly", priority: "0.9" },
    { loc: "/tools/crop-image", changefreq: "weekly", priority: "0.9" },
    { loc: "/tools/image-compressor", changefreq: "weekly", priority: "0.9" },
    { loc: "/tools/image-resizer", changefreq: "weekly", priority: "0.9" },
    { loc: "/tools/image-to-pdf", changefreq: "weekly", priority: "0.9" },
    { loc: "/tools/jpg-to-png", changefreq: "weekly", priority: "0.9" },
    { loc: "/tools/pdf-to-image", changefreq: "weekly", priority: "0.9" },
    { loc: "/tools/png-to-jpg", changefreq: "weekly", priority: "0.9" },
    { loc: "/tools/webp-converter", changefreq: "weekly", priority: "0.9" },
  ];

  const currentDate = new Date().toISOString().split("T")[0];

  const urlElements = tools
    .map(
      (tool) => `  <url>
    <loc>${SITE_URL}${tool.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${tool.changefreq}</changefreq>
    <priority>${tool.priority}</priority>
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
