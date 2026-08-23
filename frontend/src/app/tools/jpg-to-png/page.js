import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const JpgToPngTool = dynamic(() => import("@/components/tools/JpgToPngTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[300px] flex items-center justify-center">
      Loading Converter Tool...
    </div>
  ),
});

export const metadata = constructMetadata({
  title: "Convert JPG to PNG Online (Lossless Quality & Transparency Ready) – ConvertGalaxy",
  description: "Convert JPG to PNG format online for transparent background editing and graphic design workflows. Preserve sharp text rendering, prevent artifact blur, 100% free browser processing.",
  canonicalPath: "/tools/jpg-to-png",
  ogImage: "https://www.convertgalaxy.com/jpg-to-png.webp",
  keywords: [
    "convert jpg to png for transparent background editing",
    "convert jpg logo to png with transparent background",
    "change jpeg diagram to png for crisp text display",
    "convert jpg to high resolution transparent png file",
    "batch convert jpg screenshots to png without quality loss",
    "jpg to png converter free",
    "convert jpg to png online free",
    "jpeg to png converter",
    "jpg to png transparent background",
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
      title="Convert JPG to PNG Online (Lossless Quality & Transparency Ready)"
      description="Convert JPG graphics to lossless PNG format instantly. Ideal for graphic editing, removing compression artifacts around text, and preparing images for transparent backgrounds."
      uiDescription={
        <span>
          Convert JPG graphics to lossless PNG format instantly. Ideal for graphic editing, removing compression artifacts around text, and preparing images for transparent backgrounds. 100% browser-based.
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
