import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const PNGToWebPTool = dynamic(() => import("@/components/tools/PNGToWebPTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[300px] flex items-center justify-center">
      Loading Converter Tool...
    </div>
  ),
});

export const metadata = constructMetadata({
  title: "PNG to WebP Converter – Convert PNG to WebP Online Free | ConvertGalaxy",
  description: "Convert PNG to WebP online for free. Shrink image file size up to 80% while retaining full alpha transparency to boost website speed and Core Web Vitals.",
  canonicalPath: "/tools/png-to-webp",
  ogImage: "https://www.convertgalaxy.com/png-to-webp.webp",
  keywords: [
    "png to webp",
    "png to webp converter",
    "convert png to webp",
    "convert png to webp online free",
    "png to webp converter free",
    "png to webp transparency",
    "batch convert png to webp",
    "convert transparent png to webp",
  ]
});

const relatedTools = [
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
];

export default function PNGToWebPPage() {
  return (
    <ToolPageLayout
      title="PNG to WebP Converter – Convert PNG to WebP Online Free"
      description="Convert PNG graphics to modern WebP format online. Reduce image file size by up to 80% while preserving alpha transparency for faster website load times."
      uiDescription={
        <span>
          Convert PNG graphics to modern WebP format online. Reduce image file size by up to 80% while preserving alpha transparency for faster website load times. 100% private browser processing.
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
