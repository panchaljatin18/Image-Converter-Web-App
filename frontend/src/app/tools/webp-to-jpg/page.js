import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const WebPToJpgTool = dynamic(() => import("@/components/tools/WebPToJpgTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[300px] flex items-center justify-center">
      Loading Converter Tool...
    </div>
  ),
});

export const metadata = constructMetadata({
  title: "WebP to JPG Converter – Free, Fast & Private | ConvertGalaxy",
  description: "Convert WebP to JPG online for free. Easily transform WebP images downloaded from websites into standard JPG format for Amazon, Photoshop, and CMS platforms.",
  canonicalPath: "/tools/webp-to-jpg",
  ogImage: "https://www.convertgalaxy.com/webp-to-jpg.webp",
  keywords: [
    "webp to jpg",
    "webp to jpg converter",
    "convert webp to jpg",
    "convert webp to jpg online free",
    "webp to jpg converter free",
    "save webp as jpg",
    "change webp to jpg",
    "webp to jpeg online",
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
      title="WebP to JPG Converter – Convert WebP to JPG Online Free"
      description="Convert WebP images into universal JPG format instantly. Perfect for Amazon seller listings, photo editing software, and legacy systems with 100% private browser processing."
      uiDescription={
        <span>
          Convert WebP images to standard JPG format instantly. Perfect for Amazon seller listings, photo editing software, and legacy systems with 100% private browser processing.
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
