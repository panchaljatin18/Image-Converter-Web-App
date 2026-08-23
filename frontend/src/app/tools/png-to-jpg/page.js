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
  title: "Convert Transparent PNG to JPG Online (Custom Background Fill) – ConvertGalaxy",
  description: "Convert transparent PNG images to JPG with custom solid background fill. Fix black background glitches, shrink file size for web uploads, 100% free browser processing.",
  canonicalPath: "/tools/png-to-jpg",
  ogImage: "https://www.convertgalaxy.com/png-to-jpg.webp",
  keywords: [
    "convert transparent png to jpg with custom background",
    "convert png to jpg without black background glitch",
    "convert transparent png logo to solid white background jpg",
    "bulk convert png screenshots to compact jpg files",
    "convert png passport scan to jpg for government portal",
    "png to jpg converter free",
    "convert png to jpg online free",
    "png to jpeg free",
    "png to jpg transparent background",
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
      title="Convert Transparent PNG to JPG Online (Custom Solid Background)"
      description="Convert PNG images to JPG with custom solid background color controls. Prevents transparent background corruption glitches, shrinks file size for web forms."
      uiDescription={
        <span>
          Convert PNG images to JPG format with custom quality and solid background color controls. Prevents transparent pixels from turning black while shrinking file size for web forms.
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
