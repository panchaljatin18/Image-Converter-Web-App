import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const PngToJpgTool = dynamic(() => import("@/components/tools/PngToJpgTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[300px] flex items-center justify-center">
      Loading Converter Tool...
    </div>
  ),
});

export const metadata = constructMetadata({
  title: "PNG to JPG Converter – Free Online, Private & Fast | ConvertGalaxy",
  description: "Convert PNG to JPG online for free. Adjust image quality, handle transparent backgrounds seamlessly, and batch convert PNG images directly in your browser without uploading files.",
  canonicalPath: "/tools/png-to-jpg",
  ogImage: "https://www.convertgalaxy.com/png-to-jpg.webp",
  keywords: [
    "png to jpg",
    "png to jpg converter",
    "convert png to jpg",
    "convert png to jpg online free",
    "png to jpg converter free",
    "png to jpeg converter",
    "free png to jpg",
    "convert png to jpg without losing quality",
    "png to jpg transparent background",
    "png to jpg no upload",
  ]
});

const relatedTools = [
  { name: "PNG to WebP", href: "/tools/png-to-webp", icon: "🖼️" },
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
      title="PNG to JPG Converter – Convert PNG to JPG Online Free"
      description="Convert PNG images to high-quality JPG format in seconds. Adjust quality, replace transparent backgrounds with solid colors, and batch process images 100% privately in your browser."
      uiDescription={
        <span>
          Convert PNG images to universal JPG format in seconds. Adjust quality, replace transparent backgrounds with custom colors, and batch process files 100% privately in your browser.
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
