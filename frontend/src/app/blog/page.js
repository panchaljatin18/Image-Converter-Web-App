import { Suspense } from "react";
import BlogHeader from "@/sections/BlogPage/BlogHeader";
import BlogGrid from "@/sections/BlogPage/BlogGrid";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Image Editing Tips & Guides – ConvertGalaxy Blog",
  description: "Learn image formats, compression tips, and step-by-step guides for JPG, PNG, WebP & PDF conversion — written for beginners.",
  canonicalPath: "/blog",
  keywords: ["image conversion guides"],
});

const posts = [
  {
    title: "How to Convert HEIC to JPG Online (iPhone Photos on PC)",
    desc: "Learn how to open and convert Apple's HEIC/HEIF photos to JPG format for universal compatibility without losing metadata.",
    url: "https://www.convertgalaxy.com/tools/heic-to-jpg",
    date: "2026-01-01"
  },
  {
    title: "Convert JPG to PNG: How to Keep Quality Lossless",
    desc: "Learn how to convert compressed JPG to lossless PNG with transparency and maximum detail preservation.",
    url: "https://www.convertgalaxy.com/tools/jpg-to-png",
    date: "2026-01-02"
  },
  {
    title: "PNG to JPG Converter: Reduce Image File Sizes",
    desc: "Optimize web assets by converting heavy PNG drawings and graphics to lightweight JPG photos.",
    url: "https://www.convertgalaxy.com/tools/png-to-jpg",
    date: "2026-01-03"
  },
  {
    title: "WebP Conversion and Next-Gen Image Optimization Benefits",
    desc: "Understand next-gen compression benefits. Convert JPG, PNG, or GIF to WebP for faster load speeds.",
    url: "https://www.convertgalaxy.com/tools/webp-converter",
    date: "2026-01-04"
  },
  {
    title: "WebP to JPG Converter: Save Web Images to Universal Format",
    desc: "Convert WebP images to standard JPG format easily. Maintain compatibility with legacy software and devices.",
    url: "https://www.convertgalaxy.com/tools/webp-to-jpg",
    date: "2026-01-05"
  },
  {
    title: "How to Compress Images Locally in Your Browser",
    desc: "Compress images using browser processing engines for guaranteed client-side data security without visual degradation.",
    url: "https://www.convertgalaxy.com/tools/image-compressor",
    date: "2026-01-06"
  },
  {
    title: "Resize Images Online: Maintain Aspect Ratio & Quality",
    desc: "Scale your photos to exact pixel resolutions or percentage sizes. Perfect for social media and web page layout demands.",
    url: "https://www.convertgalaxy.com/tools/image-resizer",
    date: "2026-01-07"
  },
  {
    title: "Crop Images Online: Trim Borders & Target Focal Areas",
    desc: "Easily crop specific sections of your photos with drag-and-drop handles. Choose standard ratios like 1:1, 16:9, or custom.",
    url: "https://www.convertgalaxy.com/tools/crop-image",
    date: "2026-01-08"
  },
  {
    title: "Image to PDF: Merge Multiple JPG/PNG Photos into One File",
    desc: "Combine scattered images, scans, and screenshots into a single, clean PDF document. Arrange pages manually.",
    url: "https://www.convertgalaxy.com/tools/image-to-pdf",
    date: "2026-01-09"
  },
  {
    title: "PDF to Image: Extract PDF Pages to JPG/PNG Easily",
    desc: "Deconstruct multi-page PDFs to save every page as a high-quality standalone image. Runs completely in your browser.",
    url: "https://www.convertgalaxy.com/tools/pdf-to-image",
    date: "2026-01-10"
  }
];

export default function BlogPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <SEO type="blog" posts={posts} />
      <BlogHeader />
      <Suspense fallback={<div className="py-16 text-center text-[#64748b]">Loading search...</div>}>
        <BlogGrid />
      </Suspense>
    </div>
  );
}
