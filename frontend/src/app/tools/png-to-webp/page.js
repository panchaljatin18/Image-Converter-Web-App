import ToolPageLayout from "@/components/ToolPageLayout";
import PNGToWebPTool from "@/components/tools/PNGToWebPTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "PNG to WebP Converter Free – Convert PNG to WebP Online",
  description: "Convert PNG images to WebP online for free. No account, no watermark — instant download, 100% private browser-based processing with transparency support.",
  canonicalPath: "/tools/png-to-webp",
  ogImage: "https://www.convertgalaxy.com/png-to-webp.png",
  keywords: [
    "png to webp converter free",
    "convert png to webp online",
    "png to webp transparency",
    "png to webp no watermark",
    "png to webp no signup",
    "best png to webp converter",
    "png image to webp online free",
    "browser based png to webp",
  ]
});

const relatedTools = [
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "🖼️" },
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
];

export default function PNGToWebPPage() {
  return (
    <ToolPageLayout
      title="Convert PNG to WebP Online Free"
      description="Convert PNG images to WebP format with custom quality settings. Preserves alpha transparency while producing up to 35% smaller, web-optimized files instantly in your browser."
      uiDescription={
        <span>
          Convert PNG images to WebP format with custom quality settings. Preserves alpha transparency while producing up to 35% smaller, web-optimized files instantly in your browser.
        </span>
      }
      icon="🖼️"
      color="#06b6d4"
      gradient="linear-gradient(135deg, #06b6d4, #3b82f6)"
      relatedTools={relatedTools}
      toolPath="tools/png-to-webp"
      toolCategory="Image Conversion"
    >
      <PNGToWebPTool />
    </ToolPageLayout>
  );
}
