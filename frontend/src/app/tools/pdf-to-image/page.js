import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const PdfToImageTool = dynamic(() => import("@/components/tools/PdfToImageTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[300px] flex items-center justify-center">
      Loading Converter Tool...
    </div>
  ),
});

export const metadata = constructMetadata({
  title: "PDF to Image Converter – Convert PDF to JPG & PNG Online | ConvertGalaxy",
  description: "Convert PDF pages into high-resolution JPG or transparent PNG images online for free. Extract pages and vector logos with custom resolution scaling in browser.",
  canonicalPath: "/tools/pdf-to-image",
  ogImage: "https://www.convertgalaxy.com/pdf-to-image.webp",
  keywords: [
    "pdf to image",
    "pdf to image converter",
    "convert pdf to image",
    "pdf to jpg",
    "pdf to png",
    "pdf to jpg converter",
    "convert pdf to jpg free online",
    "extract images from pdf",
  ]
});

const relatedTools = [
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
];

export default function PdfToImagePage() {
  return (
    <ToolPageLayout
      title="PDF to Image Converter – Convert PDF to JPG & PNG Online Free"
      description="Extract every page of a PDF document as high-resolution PNG or JPG images. Control rendering resolution scale for web or print quality output locally in your browser."
      icon="📑"
      color="#ec4899"
      gradient="linear-gradient(135deg, #ec4899, #f472b6)"
      relatedTools={relatedTools}
      toolPath="tools/pdf-to-image"
      toolCategory="PDF Tools"
    >
      <PdfToImageTool />
    </ToolPageLayout>
  );
}
