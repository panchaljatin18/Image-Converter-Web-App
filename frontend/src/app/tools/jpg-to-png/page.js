import ToolPageLayout from "@/components/ToolPageLayout";
import JpgToPngTool from "@/components/tools/JpgToPngTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "JPG to PNG Converter Free – No Quality Loss, No Signup",
  description: "Convert JPG to PNG online free in seconds. Lossless quality, transparent background support, works fully in your browser — no upload, no signup.",
  canonicalPath: "/tools/jpg-to-png",
  ogImage: "https://www.convertgalaxy.com/jpg-to-png.png",
  keywords: [
    "jpg to png converter",
    "convert jpg to png online free",
    "jpg to png transparent background",
    "jpeg to png converter no watermark",
  ]
});

const relatedTools = [
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "PDF to Image", href: "/tools/pdf-to-image", icon: "📑" },
];

export default function JpgToPngPage() {
  return (
    <ToolPageLayout
      title="Convert JPG to PNG Online – Free & Lossless"
      description="Convert your JPG images to lossless PNG format instantly. Perfect for images requiring transparency support. 100% free, browser-based — zero data uploaded."
      uiDescription={
        <span>
          Convert your JPG images to lossless PNG format instantly. Perfect for images requiring transparency support. 100% free, browser-based — zero data uploaded.
        </span>
      }
      icon="🔄"
      color="#6366f1"
      gradient="linear-gradient(135deg, #6366f1, #818cf8)"
      relatedTools={relatedTools}
      toolPath="tools/jpg-to-png"
      toolCategory="Image Conversion"
    >
      <JpgToPngTool />
    </ToolPageLayout>
  );
}
