
import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const guides = [
    {
      title: "JPG to PNG Converter Guide",
      description: "Learn how to convert compressed JPG to lossless PNG with transparency and maximum detail preservation.",
      url: `${SITE_URL}/tools/jpg-to-png`,
      date: new Date("2026-01-01").toUTCString(),
    },
    {
      title: "PNG to JPG Converter Guide",
      description: "Optimize web assets by converting heavy PNG drawings and graphics to lightweight JPG photos.",
      url: `${SITE_URL}/tools/png-to-jpg`,
      date: new Date("2026-01-02").toUTCString(),
    },
    {
      title: "WebP conversion and optimization benefits",
      description: "Understand next-gen compression benefits. WebP delivers smaller image weights than typical PNG and JPG files.",
      url: `${SITE_URL}/tools/webp-converter`,
      date: new Date("2026-01-03").toUTCString(),
    },
    {
      title: "How to compress images locally in your browser",
      description: "Compress images using browser processing engines for guaranteed client-side data security.",
      url: `${SITE_URL}/tools/image-compressor`,
      date: new Date("2026-01-04").toUTCString(),
    },
  ];

  const rssItems = guides
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${item.date}</pubDate>
    </item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Convert Galaxy – Guides &amp; Tools Feed</title>
    <link>${SITE_URL}/blog</link>
    <description>Latest guides and news on online image conversions, compressions, resizes and format edits.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
