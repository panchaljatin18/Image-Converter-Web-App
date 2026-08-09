import ToolPageLayout from "@/components/ToolPageLayout";
import ImageCompressorTool from "@/components/tools/ImageCompressorTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Image Compressor Online Free – Compress JPG, PNG, WebP Without Quality Loss",
  description: "Compress JPG, PNG & WebP images online free without losing visible quality. Reduce photo size by up to 80% in seconds — no signup, no watermark, 100% browser-based.",
  canonicalPath: "/tools/image-compressor",
  ogImage: "https://www.convertgalaxy.com/image-compressor.webp",
  keywords: [
    "image compressor online free",
    "compress image without losing quality",
    "reduce photo size online free",
    "compress jpeg online free",
    "compress png online free",
    "image compressor no watermark",
    "reduce image file size free",
    "best image compressor online",
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
