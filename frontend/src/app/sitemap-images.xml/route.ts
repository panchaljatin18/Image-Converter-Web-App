import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const imagesMapping = [
    {
      page: "",
      images: [
        { loc: "/og-image.webp", title: "Convert Galaxy Online Image Tools Banner", caption: "Convert Galaxy open graph social share banner" },
        { loc: "/C.webp", title: "Convert Galaxy Brand Logo Icon", caption: "Convert Galaxy Official Logo Icon" },
      ]
    },
    {
      page: "/tools/heic-to-jpg",
      images: [{ loc: "/heic-to-jpg.webp", title: "HEIC to JPG Conversion Tool - Convert Galaxy", caption: "Convert Apple HEIC photos to high quality JPG format online" }]
    },
    {
      page: "/tools/jpg-to-png",
      images: [{ loc: "/jpg-to-png.webp", title: "JPG to PNG Conversion Tool - Convert Galaxy", caption: "Convert JPG images to lossless PNG format online" }]
    },
    {
      page: "/tools/png-to-jpg",
      images: [{ loc: "/png-to-jpg.webp", title: "PNG to JPG Conversion Tool - Convert Galaxy", caption: "Convert PNG images to compressed JPG format online" }]
    },
    {
      page: "/tools/png-to-webp",
      images: [{ loc: "/png-to-webp.webp", title: "PNG to WebP Conversion Tool - Convert Galaxy", caption: "Convert PNG to WebP transparent next-gen format" }]
    },
    {
      page: "/tools/png-to-avif",
      images: [{ loc: "/png-to-avif.webp", title: "PNG to AVIF Conversion Tool - Convert Galaxy", caption: "Convert PNG to next-generation AVIF compressed images" }]
    },
    {
      page: "/tools/webp-converter",
      images: [{ loc: "/webp-converter.webp", title: "WebP Conversion Tool - Convert Galaxy", caption: "Convert WebP images to next-gen formats online" }]
    },
    {
      page: "/tools/image-compressor",
      images: [{ loc: "/image-compressor.webp", title: "Image Compressor Tool - Convert Galaxy", caption: "Compress JPG, PNG, and WebP images browser-based" }]
    },
    {
      page: "/tools/image-resizer",
      images: [{ loc: "/image-resizer.webp", title: "Image Resizer Tool - Convert Galaxy", caption: "Resize images to custom pixel dimensions and aspect ratios" }]
    },
    {
      page: "/tools/crop-image",
      images: [{ loc: "/crop-image.webp", title: "Crop Image Tool - Convert Galaxy", caption: "Crop images online interactively with rectangle selection" }]
    },
    {
      page: "/tools/image-to-pdf",
      images: [{ loc: "/image-to-pdf.webp", title: "Image to PDF Converter - Convert Galaxy", caption: "Convert and merge multiple images into PDF documents" }]
    },
    {
      page: "/tools/pdf-to-image",
      images: [{ loc: "/pdf-to-image.webp", title: "PDF to Image Converter - Convert Galaxy", caption: "Extract pages of PDF files into JPG and PNG images" }]
    },
    {
      page: "/tools/webp-to-jpg",
      images: [{ loc: "/webp-to-jpg.webp", title: "WebP to JPG Converter - Convert Galaxy", caption: "Convert WebP images to compressed JPEG files online" }]
    },
    {
      page: "/author/jatin-panchal",
      images: [
        {
          loc: "/author.webp",
          title: "Jatin Panchal - Founder & Lead Web Developer at ConvertGalaxy",
          caption: "Official portrait photo of Jatin Panchal, Founder of ConvertGalaxy",
        },
      ],
    },
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
