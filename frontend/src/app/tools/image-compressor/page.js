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
  title: "Compress Image Size Online (Reduce PNG & JPG KB Without Quality Loss) – ConvertGalaxy",
  description: "Compress PNG & JPG image size without degrading text sharpness or visual clarity. Reduce file size up to 90% for Discord custom emojis, WordPress PageSpeed, email limits.",
  canonicalPath: "/tools/image-compressor",
  ogImage: "https://www.convertgalaxy.com/image-compressor.webp",
  keywords: [
    "compress png image size without degrading text sharpness",
    "compress png image for discord custom emoji 256kb limit",
    "bulk compress jpg photos for wordpress pagespeed optimization",
    "compress jpg image to under 100kb for passport application",
    "image compressor online free",
    "compress image without losing quality",
    "reduce photo size online free",
    "compress png online free",
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
      title="Compress Image Size Online (Preserve Visual Quality)"
      description="Shrink PNG, JPG & WebP image file sizes up to 90% without degrading visual sharpness or text clarity. Perfect for PageSpeed optimization, Discord emojis, and email attachments."
      uiDescription={
        <span>
          Shrink PNG, JPG & WebP image file sizes up to 90% without degrading visual sharpness or text clarity. Perfect for PageSpeed optimization, Discord emojis, and email attachments.
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
