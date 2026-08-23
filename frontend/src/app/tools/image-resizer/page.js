import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const ImageResizerTool = dynamic(() => import("@/components/tools/ImageResizerTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[300px] flex items-center justify-center">
      Loading Resizer Tool...
    </div>
  ),
});

export const metadata = constructMetadata({
  title: "Resize Image Online (Exact Pixels, Inches for Printing & Social Media) – ConvertGalaxy",
  description: "Resize photos to exact pixel width/height or physical inch measurements for print and online forms. Lock aspect ratio to prevent stretching. Free, fast browser resizer.",
  canonicalPath: "/tools/image-resizer",
  ogImage: "https://www.convertgalaxy.com/image-resizer.webp",
  keywords: [
    "resize image to exact dimensions in inches for printing",
    "resize jpg photo for email signature banner 600px width",
    "resize photo for official visa or passport application dimensions",
    "image resizer online free",
    "resize image in pixels online free",
    "photo resizer free no watermark",
    "resize image for instagram free",
    "bulk image resizer online",
  ]
});

const relatedTools = [
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "PDF to Image", href: "/tools/pdf-to-image", icon: "📑" },
];

export default function ImageResizerPage() {
  return (
    <ToolPageLayout
      title="Resize Image Online (Exact Pixels, Inches & Aspect Ratios)"
      description="Resize images to exact pixel dimensions or physical print inches. Lock aspect ratio to prevent distortion, use custom presets, or export in JPG, PNG, and WebP format."
      icon="📐"
      color="#8b5cf6"
      gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)"
      relatedTools={relatedTools}
      toolPath="tools/image-resizer"
      toolCategory="Image Optimization"
    >
      <ImageResizerTool />
    </ToolPageLayout>
  );
}
