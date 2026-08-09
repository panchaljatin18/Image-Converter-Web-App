import ToolPageLayout from "@/components/ToolPageLayout";
import WebPConverterTool from "@/components/tools/WebPConverterTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "WebP Converter Free – Convert JPG/PNG to WebP Online, Faster Websites",
  description: "Convert JPG, PNG or any image to WebP format free online. Smaller files = faster websites. No signup, no watermark — 100% browser-based, instant WebP conversion.",
  canonicalPath: "/tools/webp-converter",
  ogImage: "https://www.convertgalaxy.com/webp-converter.webp",
  keywords: [
    "webp converter free",
    "convert image to webp online free",
    "jpg to webp converter free",
    "png to webp free",
    "webp converter no watermark",
    "best webp converter online",
    "convert jpeg to webp online",
    "webp image converter no signup",
  ]
});

const relatedTools = [
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "PDF to Image", href: "/tools/pdf-to-image", icon: "📑" },
];

export default function WebPConverterPage() {
  return (
    <ToolPageLayout
      title="Convert Any Image to WebP Online"
      description="Convert any image to WebP for maximum web performance, or convert WebP back to JPG/PNG. WebP offers 26% smaller files than PNG with equivalent quality."
      uiDescription={
        <span>
          Convert any image to WebP for maximum web performance, or convert WebP back to JPG/PNG. WebP offers 26% smaller files than PNG with equivalent quality.
        </span>
      }
      icon="⚡"
      color="#f59e0b"
      gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
      relatedTools={relatedTools}
      toolPath="tools/webp-converter"
      toolCategory="Image Conversion"
    >
      <WebPConverterTool />
    </ToolPageLayout>
  );
}
