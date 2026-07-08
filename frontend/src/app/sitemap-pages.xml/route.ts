import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const pages = [
    { loc: "", changefreq: "daily", priority: "1.0" },
    { loc: "/about", changefreq: "monthly", priority: "0.8" },
    { loc: "/contact", changefreq: "monthly", priority: "0.8" },
    { loc: "/faq", changefreq: "monthly", priority: "0.7" },
    { loc: "/privacy", changefreq: "yearly", priority: "0.5" },
    { loc: "/terms", changefreq: "yearly", priority: "0.5" },
    { loc: "/disclaimer", changefreq: "yearly", priority: "0.5" },
  ];

  const currentDate = new Date().toISOString().split("T")[0];

  const urlElements = pages
    .map(
      (page) => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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
