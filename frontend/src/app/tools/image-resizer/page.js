import ToolPageLayout from "@/components/ToolPageLayout";
import ImageResizerTool from "@/components/tools/ImageResizerTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Image Resizer – Resize Images Online Free",
  description: "Resize images to exact pixel dimensions or aspect ratios. Presets for social media, HD, 4K, and more. Lock aspect ratio, choose output format. Free, browser-based.",
  canonicalPath: "/tools/image-resizer",
  keywords: [
    "image resizer",
    "resize image",
    "resize image online",
    "resize image pixels",
    "change image resolution",
    "resize jpeg",
    "resize png",
    "free image resizer"
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
      title="Image Resizer"
      description="Resize your images to exact pixel dimensions. Lock aspect ratio to prevent distortion, use social media presets, or enter custom dimensions. Supports JPG, PNG, and WebP output."
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
