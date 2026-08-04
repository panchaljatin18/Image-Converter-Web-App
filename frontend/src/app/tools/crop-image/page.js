import ToolPageLayout from "@/components/ToolPageLayout";
import CropImageTool from "@/components/tools/CropImageTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Crop Image Online Free – Custom Size, Aspect Ratio & Preset Shapes",
  description: "Crop any photo online free with custom size, preset aspect ratios (square, 16:9, passport) or freeform selection. No signup, no watermark — 100% browser-based.",
  canonicalPath: "/tools/crop-image",
  ogImage: "https://www.convertgalaxy.com/crop-image.png",
  keywords: [
    "crop image online free",
    "free image cropper no watermark",
    "crop photo to square online free",
    "crop image for instagram free",
    "crop image no signup",
    "online image cropper",
    "crop photo online free",
    "best image cropper online",
  ]
});

const relatedTools = [
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "PDF to Image", href: "/tools/pdf-to-image", icon: "📑" },
];

export default function CropImagePage() {
  return (
    <ToolPageLayout
      title="Crop Your Image Online Free"
      description="Drag to select a crop area on your image. Choose from aspect ratio presets or go freeform. Preview with a rule-of-thirds overlay and download in JPG, PNG, or WebP."
      uiDescription={
        <span>
          Drag to select a crop area on your image. Choose from aspect ratio presets or go freeform. Preview with a rule-of-thirds overlay and download in JPG, PNG, or WebP.
        </span>
      }
      icon="✂️"
      color="#ef4444"
      gradient="linear-gradient(135deg, #ef4444, #f87171)"
      relatedTools={relatedTools}
      toolPath="tools/crop-image"
      toolCategory="Image Optimization"
    >
      <CropImageTool />
    </ToolPageLayout>
  );
}
