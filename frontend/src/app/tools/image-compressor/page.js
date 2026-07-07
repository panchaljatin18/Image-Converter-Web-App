import ToolPageLayout from "@/components/ToolPageLayout";
import ImageCompressorTool from "@/components/tools/ImageCompressorTool";

export const metadata = {
  title: "Image Compressor – Reduce Image File Size Free Online",
  description: "Compress JPG, PNG, WebP images without visible quality loss. Reduce file size by up to 90% using advanced browser-based compression. 100% free, private, no upload.",
  alternates: {
    canonical: "/tools/image-compressor",
  },
};

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
      icon="🗜️"
      color="#10b981"
      gradient="linear-gradient(135deg, #10b981, #34d399)"
      relatedTools={relatedTools}
    >
      <ImageCompressorTool />
    </ToolPageLayout>
  );
}
