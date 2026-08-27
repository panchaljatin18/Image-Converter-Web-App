import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const ImageCompressorTool = dynamic(() => import("@/components/tools/ImageCompressorTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[300px] flex items-center justify-center">
      Loading Compressor Tool...
    </div>
  ),
});

export const metadata = constructMetadata({
  title: "Image Compressor – Reduce JPG, PNG & WebP Size Online | ConvertGalaxy",
  description: "Compress JPG, PNG, and WebP images online for free without losing quality. Reduce file size up to 90% for web performance, Discord emojis, and email attachments.",
  canonicalPath: "/tools/image-compressor",
  ogImage: "https://www.convertgalaxy.com/image-compressor.webp",
  keywords: [
    "image compressor",
    "compress image",
    "compress image online free",
    "compress image without losing quality",
    "reduce photo size online free",
    "compress png online free",
    "compress jpeg online",
    "reduce image size kb",
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
      title="Image Compressor – Compress Images Online Without Quality Loss"
      description="Shrink PNG, JPG & WebP image file sizes up to 90% without degrading visual sharpness or text clarity. Perfect for PageSpeed optimization, Discord emojis, and email attachments."
      uiDescription={
        <span>
          Shrink PNG, JPG & WebP image file sizes up to 90% without degrading visual sharpness or text clarity. Perfect for PageSpeed optimization and email attachments. 100% private in your browser.
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
