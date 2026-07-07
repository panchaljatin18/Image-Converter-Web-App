import ToolPageLayout from "@/components/ToolPageLayout";
import JpgToPngTool from "@/components/tools/JpgToPngTool";

export const metadata = {
  title: "JPG to PNG Converter – Free Online Tool",
  description:
    "Convert JPG/JPEG images to PNG format instantly. Free, lossless, browser-based converter. No upload required — your files stay private.",
  alternates: {
    canonical: "/tools/jpg-to-png",
  },
};

const relatedTools = [
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
];

export default function JpgToPngPage() {
  return (
    <ToolPageLayout
      title="JPG to PNG Converter"
      description="Convert your JPEG images to lossless PNG format instantly. Perfect for images requiring transparency support. 100% free, browser-based — zero data uploaded."
      icon="🔄"
      color="#6366f1"
      gradient="linear-gradient(135deg, #6366f1, #818cf8)"
      relatedTools={relatedTools}
    >
      <JpgToPngTool />
    </ToolPageLayout>
  );
}
