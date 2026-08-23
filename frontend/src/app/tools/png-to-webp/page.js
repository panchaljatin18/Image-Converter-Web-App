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
  title: "Batch Convert PNG to WebP Online (Boost Shopify & PageSpeed) – ConvertGalaxy",
  description: "Convert transparent PNG assets to ultra-lightweight WebP format. Shrink image weight up to 80% while retaining alpha channel transparency. Improve Core Web Vitals performance.",
  canonicalPath: "/tools/png-to-webp",
  ogImage: "https://www.convertgalaxy.com/png-to-webp.webp",
  keywords: [
    "batch convert png to webp for faster shopify loading",
    "convert transparent png graphics to webp for dark mode sites",
    "batch convert png assets to webp for wordpress pagespeed boost",
    "convert png vector icons to ultra lightweight webp graphics",
    "png to webp converter free",
    "convert png to webp online",
    "png to webp transparency",
    "convert transparent png to webp",
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
      title="Batch Convert PNG to WebP Online (Boost Site Speed)"
      description="Convert PNG images to modern WebP format instantly. Preserves full alpha transparency while reducing file weight up to 80% to boost Google PageSpeed & Core Web Vitals."
      uiDescription={
        <span>
          Convert PNG images to modern WebP format instantly. Preserves full alpha transparency while reducing file weight up to 80% to boost Google PageSpeed & Core Web Vitals.
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
