import ToolPageLayout from "@/components/ToolPageLayout";
import WebPToJpgTool from "@/components/tools/WebPToJpgTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "WebP to JPG Converter Free – Convert WebP Images to JPEG Online",
  description: "Convert WebP images to JPG/JPEG format online for free. No account, no watermark — instant download, 100% private browser-based processing. Works on all devices.",
  canonicalPath: "/tools/webp-to-jpg",
  ogImage: "https://www.convertgalaxy.com/webp-to-jpg.png",
  keywords: [
    "webp to jpg converter free",
    "convert webp to jpg online free",
    "webp to jpeg converter",
    "save webp as jpg free",
    "webp to jpg no watermark",
    "webp to jpg no signup",
    "best webp to jpg converter",
    "webp image to jpg online",
  ]
});

const relatedTools = [
  { name: "PNG to WebP", href: "/tools/png-to-webp", icon: "🖼️" },
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "PDF to Image", href: "/tools/pdf-to-image", icon: "📑" },
];

export default function WebPToJpgPage() {
  return (
    <ToolPageLayout
      title="Convert WebP to JPG Online Free"
      description="Convert WebP images to JPG format with custom quality settings. Handles transparent backgrounds, producing smaller, web-optimized files instantly in your browser."
      uiDescription={
        <span>
          Convert WebP images to JPG format with custom quality settings. Handles transparent backgrounds, producing smaller, web-optimized files instantly in your browser.
        </span>
      }
      icon="🖼️"
      color="#ea580c"
      gradient="linear-gradient(135deg, #ea580c, #f97316)"
      relatedTools={relatedTools}
      toolPath="tools/webp-to-jpg"
      toolCategory="Image Conversion"
    >
      <WebPToJpgTool />
    </ToolPageLayout>
  );
}
