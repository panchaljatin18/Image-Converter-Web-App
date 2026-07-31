import ToolPageLayout from "@/components/ToolPageLayout";
import ImageCompressorTool from "@/components/tools/ImageCompressorTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Image Compressor Online – Reduce Size Without Losing Quality",
  description: "Compress JPG, PNG & WebP images free without visible quality loss. Reduce photo file size in seconds, right in your browser — no upload needed.",
  canonicalPath: "/tools/image-compressor",
  ogImage: "https://www.convertgalaxy.com/image-compressor.png",
  keywords: [
    "image compressor online",
    "compress image without losing quality",
    "reduce photo size online free",
    "compress jpeg online free",
  ]
});

const relatedTools = [
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "PDF to Image", href: "/tools/pdf-to-image", icon: "📑" },
];

export default function ImageCompressorPage() {
  return (
    <ToolPageLayout
      title="Compress Images Online Free — No Quality Loss"
      description="Reduce image file sizes by up to 90% without noticeable quality loss. Perfect for web optimization, email attachments, and faster page loads. All processing happens in your browser."
      uiDescription={
        <span>
          Reduce image file sizes by up to 90% without noticeable quality loss. Perfect for web optimization, email attachments, and faster page loads. All processing happens in your browser.
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
