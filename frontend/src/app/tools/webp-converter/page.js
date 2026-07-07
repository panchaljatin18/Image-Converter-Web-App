import ToolPageLayout from "@/components/ToolPageLayout";
import WebPConverterTool from "@/components/tools/WebPConverterTool";

export const metadata = {
  title: "WebP Converter – Convert Images To & From WebP Free",
  description: "Convert JPG, PNG, GIF to WebP or WebP to JPG/PNG. WebP images are 26% smaller than PNG. Free browser-based converter with quality control.",
  alternates: {
    canonical: "/tools/webp-converter",
  },
};

const relatedTools = [
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
];

export default function WebPConverterPage() {
  return (
    <ToolPageLayout
      title="WebP Converter"
      description="Convert any image to WebP for maximum web performance, or convert WebP back to JPG/PNG. WebP offers 26% smaller files than PNG with equivalent quality."
      icon="⚡"
      color="#f59e0b"
      gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
      relatedTools={relatedTools}
    >
      <WebPConverterTool />
    </ToolPageLayout>
  );
}
