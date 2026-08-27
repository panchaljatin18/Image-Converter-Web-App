import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const WebPConverterTool = dynamic(() => import("@/components/tools/WebPConverterTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[300px] flex items-center justify-center">
      Loading Converter Tool...
    </div>
  ),
});

export const metadata = constructMetadata({
  title: "WebP Converter – Convert Images to WebP Online Free | ConvertGalaxy",
  description: "Convert JPG, PNG, and photos to modern WebP format online. Reduce image file size by up to 80% without server-side tools or quality loss. 100% private in browser.",
  canonicalPath: "/tools/webp-converter",
  ogImage: "https://www.convertgalaxy.com/webp-converter.webp",
  keywords: [
    "webp converter",
    "convert to webp",
    "image to webp",
    "convert image to webp online free",
    "jpg to webp converter free",
    "png to webp free",
    "webp converter no watermark",
    "convert jpeg to webp online",
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
      title="WebP Converter – Convert Images to WebP Online Free"
      description="Convert any image to modern WebP format online. Drastically reduce web page load times and improve Core Web Vitals with 100% client-side browser processing."
      uiDescription={
        <span>
          Convert any JPG or PNG image to ultra-fast WebP format online. Drastically reduce web page load times with 100% client-side browser processing.
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
