import ToolPageLayout from "@/components/ToolPageLayout";
import ImageResizerTool from "@/components/tools/ImageResizerTool";

export const metadata = {
  title: "Image Resizer – Resize Images Online Free",
  description: "Resize images to exact pixel dimensions or aspect ratios. Presets for social media, HD, 4K, and more. Lock aspect ratio, choose output format. Free, browser-based.",
};

const relatedTools = [
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
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
    >
      <ImageResizerTool />
    </ToolPageLayout>
  );
}
