import ToolPageLayout from "@/components/ToolPageLayout";
import CropImageTool from "@/components/tools/CropImageTool";

export const metadata = {
  title: "Crop Image – Free Online Image Cropper",
  description: "Crop images to any size or aspect ratio online. Draw a crop selection, use aspect ratio presets (1:1, 16:9, 4:3). Free, instant, browser-based image cropper.",
  alternates: {
    canonical: "/tools/crop-image",
  },
};

const relatedTools = [
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
];

export default function CropImagePage() {
  return (
    <ToolPageLayout
      title="Crop Image"
      description="Drag to select a crop area on your image. Choose from aspect ratio presets or go freeform. Preview with a rule-of-thirds overlay and download in JPG, PNG, or WebP."
      icon="✂️"
      color="#ef4444"
      gradient="linear-gradient(135deg, #ef4444, #f87171)"
      relatedTools={relatedTools}
    >
      <CropImageTool />
    </ToolPageLayout>
  );
}
