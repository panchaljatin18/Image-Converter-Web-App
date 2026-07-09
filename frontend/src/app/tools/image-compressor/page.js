import ToolPageLayout from "@/components/ToolPageLayout";
import ImageCompressorTool from "@/components/tools/ImageCompressorTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Image Compressor – Reduce Image File Size Free Online",
  description: "Compress JPG, PNG, WebP images without visible quality loss. Reduce file size by up to 90% using advanced browser-based compression. 100% free, private, no upload.",
  canonicalPath: "/tools/image-compressor",
});

const relatedTools = [
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
];

export default function ImageCompressorPage() {
  return (
    <ToolPageLayout
      title="Image Compressor"
      description="Reduce image file sizes by up to 90% without noticeable quality loss. Perfect for web optimization, email attachments, and faster page loads. All processing happens in your browser."
      uiDescription={
        <span>
          Reduce image file sizes by up to 90% without noticeable quality loss. Perfect for web{" "}
          <a href="https://jobforiti.com/walk-in-interview-at-ste-ahmedabad-2026" target="_blank" rel="noopener noreferrer" className="text-[#10b981] hover:text-[#34d399] underline decoration-[#10b981]/45">
            optimization
          </a>
          , email attachments, and faster page loads. All processing happens in your browser.
        </span>
      }
      icon="🗜️"
      color="#10b981"
      gradient="linear-gradient(135deg, #10b981, #34d399)"
      relatedTools={relatedTools}
      toolPath="tools/image-compressor"
      toolCategory="Image Optimization"
    >
      <ImageCompressorTool />
    </ToolPageLayout>
  );
}
