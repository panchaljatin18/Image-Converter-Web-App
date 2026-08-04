import ToolPageLayout from "@/components/ToolPageLayout";
import PngToJpgTool from "@/components/tools/PngToJpgTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "PNG to JPG Converter – Free, Fast, No Watermark",
  description: "Convert PNG to JPG online free instantly. Reduce file size, handle transparent backgrounds with custom fill color. No signup, no watermark, 100% browser-based.",
  canonicalPath: "/tools/png-to-jpg",
  ogImage: "https://www.convertgalaxy.com/png-to-jpg.png",
  keywords: [
    "png to jpg converter free",
    "convert png to jpg online free",
    "png to jpeg free",
    "png to jpg no watermark",
    "png to jpg no signup",
    "compress png to jpg free",
    "png to jpg transparent background",
    "best png to jpg converter",
  ]
});

const relatedTools = [
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "PDF to Image", href: "/tools/pdf-to-image", icon: "📑" },
];

export default function PngToJpgPage() {
  return (
    <ToolPageLayout
      title="Convert PNG to JPG Online Free"
      description="Convert PNG images to JPG format with custom quality settings. Handles transparent backgrounds, producing smaller, web-optimized files instantly in your browser."
      uiDescription={
        <span>
          Convert PNG images to JPG format with custom quality settings. Handles transparent backgrounds, producing smaller, web-optimized files instantly in your browser.
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
