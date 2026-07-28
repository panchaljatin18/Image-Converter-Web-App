import ToolPageLayout from "@/components/ToolPageLayout";
import WebPConverterTool from "@/components/tools/WebPConverterTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "WebP Converter – Convert Images To & From WebP Free",
  description: "Convert JPG, PNG, GIF to WebP or WebP to JPG/PNG. WebP images are 26% smaller than PNG. Free browser-based converter with quality control.",
  canonicalPath: "/tools/webp-converter",
  ogImage: "https://www.convertgalaxy.com/webp-converter.png",
  keywords: [
    "webp converter",
    "convert to webp",
    "webp to png",
    "png to webp",
    "jpg to webp",
    "convert webp to png online",
    "webp image converter",
    "convert image to webp"
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
      title="WebP Converter"
      description="Convert any image to WebP for maximum web performance, or convert WebP back to JPG/PNG. WebP offers 26% smaller files than PNG with equivalent quality."
      uiDescription={
        <span>
          Convert any image to WebP for maximum web{" "}
          <a href="https://jobforiti.com/maruti-suzuki-campus-placement-2026" target="_blank" rel="noopener noreferrer" title="Maruti Suzuki Campus Placement 2026 on JobForITI" className="text-[#f59e0b] hover:text-[#fbbf24] underline decoration-[#f59e0b]/45">
            performance
          </a>
          , or convert WebP back to JPG/PNG. WebP offers 26% smaller files than PNG with equivalent quality.
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
