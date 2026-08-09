import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const imagesMapping = [
    {
      page: "",
      images: [
        { loc: "/C.webp", title: "Convert Galaxy Logo Icon", caption: "Convert Galaxy Brand Logo Icon" },
        { loc: "/og-image.webp", title: "Convert Galaxy Tools Suite Banner", caption: "Convert Galaxy open graph social share banner" }
      ]
    },
    {
      page: "/tools/jpg-to-png",
      images: [{ loc: "/C.webp", title: "JPG to PNG Conversion Tool - Convert Galaxy", caption: "Convert JPG to PNG lossless files" }]
    },
    {
      page: "/tools/png-to-jpg",
      images: [{ loc: "/C.webp", title: "PNG to JPG Conversion Tool - Convert Galaxy", caption: "Convert PNG to JPG compressed files" }]
    },
    {
      page: "/tools/png-to-webp",
      images: [{ loc: "/C.webp", title: "PNG to WebP Conversion Tool - Convert Galaxy", caption: "Convert PNG to WebP transparent files" }]
    },
    {
      page: "/tools/webp-converter",
      images: [{ loc: "/C.webp", title: "WebP Conversion Tool - Convert Galaxy", caption: "Convert WebP next-gen format files" }]
    },
    {
      page: "/tools/image-compressor",
      images: [{ loc: "/C.webp", title: "Image Compressor Tool - Convert Galaxy", caption: "Compress images online browser-based" }]
    },
    {
      page: "/tools/image-resizer",
      images: [{ loc: "/C.webp", title: "Image Resizer Tool - Convert Galaxy", caption: "Resize images to custom width and height" }]
    },
    {
      page: "/tools/crop-image",
      images: [{ loc: "/C.webp", title: "Crop Image Tool - Convert Galaxy", caption: "Crop images online interactively" }]
    },
    {
      page: "/tools/image-to-pdf",
      images: [{ loc: "/C.webp", title: "Image to PDF Converter - Convert Galaxy", caption: "Convert and merge images into PDF documents" }]
    },
    {
      page: "/tools/pdf-to-image",
      images: [{ loc: "/C.webp", title: "PDF to Image Converter - Convert Galaxy", caption: "Extract pages of PDF as images" }]
    },
    {
      page: "/tools/webp-to-jpg",
      images: [{ loc: "/C.webp", title: "WebP to JPG Converter - Convert Galaxy", caption: "Convert WebP images to compressed JPEG files" }]
    }
  ];

  const currentDate = new Date().toISOString().split("T")[0];

  const urlElements = imagesMapping
    .map(
      (entry) => `  <url>
    <loc>${SITE_URL}${entry.page}</loc>
    <lastmod>${currentDate}</lastmod>
${entry.images
  .map(
    (img) => `    <image:image>
      <image:loc>${SITE_URL}${img.loc}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
    </image:image>`
  )
  .join("\n")}
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
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
