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
  title: "Convert PDF to Image Online (Extract Pages as High-Res JPG or PNG) – ConvertGalaxy",
  description: "Convert multi-page PDF files into individual high-resolution PNG or JPG images. Extract vector logos and document pages with transparent background support locally in browser.",
  canonicalPath: "/tools/pdf-to-image",
  ogImage: "https://www.convertgalaxy.com/pdf-to-image.webp",
  keywords: [
    "convert multi page pdf to individual png files transparent background",
    "convert scanned pdf pages to high resolution jpg images",
    "extract embedded vector logos from pdf document into transparent png",
    "pdf to image converter free",
    "convert pdf to jpg free online",
    "pdf to png converter free",
    "pdf to jpg no signup",
    "extract images from pdf free",
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
      title="Convert PDF to Image Online (Extract High-Res JPG & PNG)"
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
