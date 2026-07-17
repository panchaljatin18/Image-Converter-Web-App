import ToolPageLayout from "@/components/ToolPageLayout";
import PngToJpgTool from "@/components/tools/PngToJpgTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "PNG to JPG Converter – Free Online Tool",
  description: "Convert PNG images to compressed JPG format. Adjust quality, set background color for transparent areas. Free, fast, no upload needed.",
  canonicalPath: "/tools/png-to-jpg",
});

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
      description="Convert PNG images to JPG format with custom quality settings. Handles transparent backgrounds, producing smaller, web-optimized files instantly in your browser."
      uiDescription={
        <span>
          Convert PNG images to JPG format with custom quality settings. Handles transparent backgrounds, producing smaller, web-optimized files instantly in your{" "}
          <a href="https://jobforiti.com/sfc-solution-company-recruitment-2026" target="_blank" rel="noopener noreferrer" className="text-[#06b6d4] hover:text-[#67e8f9] underline decoration-[#06b6d4]/45">
            browser
          </a>
          .
        </span>
      }
      icon="🖼️"
      color="#06b6d4"
      gradient="linear-gradient(135deg, #06b6d4, #67e8f9)"
      relatedTools={relatedTools}
      toolPath="tools/png-to-jpg"
      toolCategory="Image Conversion"
    >
      <PngToJpgTool />
    </ToolPageLayout>
  );
}
