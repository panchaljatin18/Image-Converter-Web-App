
import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const guides = [
    {
      title: "How to Convert HEIC to JPG Online (iPhone Photos on PC)",
      description: "Learn how to open and convert Apple's HEIC/HEIF photos to JPG format for universal compatibility without losing metadata.",
      url: `${SITE_URL}/tools/heic-to-jpg`,
      date: new Date("2026-01-01").toUTCString(),
    },
    {
      title: "Convert JPG to PNG: How to Keep Quality Lossless",
      description: "Learn how to convert compressed JPG to lossless PNG with transparency and maximum detail preservation.",
      url: `${SITE_URL}/tools/jpg-to-png`,
      date: new Date("2026-01-02").toUTCString(),
    },
    {
      title: "PNG to JPG Converter: Reduce Image File Sizes",
      description: "Optimize web assets by converting heavy PNG drawings and graphics to lightweight JPG photos.",
      url: `${SITE_URL}/tools/png-to-jpg`,
      date: new Date("2026-01-03").toUTCString(),
    },
    {
      title: "WebP Conversion and Next-Gen Image Optimization Benefits",
      description: "Understand next-gen compression benefits. Convert JPG, PNG, or GIF to WebP for faster load speeds.",
      url: `${SITE_URL}/tools/webp-converter`,
      date: new Date("2026-01-04").toUTCString(),
    },
    {
      title: "WebP to JPG Converter: Save Web Images to Universal Format",
      description: "Convert WebP images to standard JPG format easily. Maintain compatibility with legacy software and devices.",
      url: `${SITE_URL}/tools/webp-to-jpg`,
      date: new Date("2026-01-05").toUTCString(),
    },
    {
      title: "How to Compress Images Locally in Your Browser",
      description: "Compress images using browser processing engines for guaranteed client-side data security without visual degradation.",
      url: `${SITE_URL}/tools/image-compressor`,
      date: new Date("2026-01-06").toUTCString(),
    },
    {
      title: "Resize Images Online: Maintain Aspect Ratio & Quality",
      description: "Scale your photos to exact pixel resolutions or percentage sizes. Perfect for social media and web page layout demands.",
      url: `${SITE_URL}/tools/image-resizer`,
      date: new Date("2026-01-07").toUTCString(),
    },
    {
      title: "Crop Images Online: Trim Borders & Target Focal Areas",
      description: "Easily crop specific sections of your photos with drag-and-drop handles. Choose standard ratios like 1:1, 16:9, or custom.",
      url: `${SITE_URL}/tools/crop-image`,
      date: new Date("2026-01-08").toUTCString(),
    },
    {
      title: "Image to PDF: Merge Multiple JPG/PNG Photos into One File",
      description: "Combine scattered images, scans, and screenshots into a single, clean PDF document. Arrange pages manually.",
      url: `${SITE_URL}/tools/image-to-pdf`,
      date: new Date("2026-01-09").toUTCString(),
    },
    {
      title: "PDF to Image: Extract PDF Pages to JPG/PNG Easily",
      description: "Deconstruct multi-page PDFs to save every page as a high-quality standalone image. Runs completely in your browser.",
      url: `${SITE_URL}/tools/pdf-to-image`,
      date: new Date("2026-01-10").toUTCString(),
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
