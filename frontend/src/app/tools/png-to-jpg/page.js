import ToolPageLayout from "@/components/ToolPageLayout";
import PngToJpgTool from "@/components/tools/PngToJpgTool";

export const metadata = {
  title: "PNG to JPG Converter – Free Online Tool",
  description: "Convert PNG images to compressed JPEG format. Adjust quality, set background color for transparent areas. Free, fast, no upload needed.",
};

const relatedTools = [
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
];

export default function PngToJpgPage() {
  return (
    <ToolPageLayout
      title="PNG to JPG Converter"
      description="Convert PNG images to JPEG format with custom quality settings. Handles transparent backgrounds, producing smaller, web-optimized files instantly in your browser."
      icon="🖼️"
      color="#06b6d4"
      gradient="linear-gradient(135deg, #06b6d4, #67e8f9)"
      relatedTools={relatedTools}
    >
      <PngToJpgTool />
    </ToolPageLayout>
  );
}
