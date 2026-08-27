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
  title: "Image Resizer – Resize Images Online for Free | ConvertGalaxy",
  description: "Resize images to exact pixel dimensions, percentages, or print inches online for free. Lock aspect ratios to prevent distortion with fast browser-based processing.",
  canonicalPath: "/tools/image-resizer",
  ogImage: "https://www.convertgalaxy.com/image-resizer.webp",
  keywords: [
    "image resizer",
    "resize image",
    "resize image online free",
    "photo resizer free",
    "resize image in pixels",
    "resize photo online",
    "bulk image resizer",
    "resize image without losing quality",
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
      title="Image Resizer – Resize Images Online for Free"
      description="Resize images to exact pixel dimensions, percentages, or print inches. Lock aspect ratios to prevent distortion and export high-quality images with 100% private browser processing."
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
