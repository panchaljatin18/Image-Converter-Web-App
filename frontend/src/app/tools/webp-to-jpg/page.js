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
  title: "Convert WebP Product Images to JPG Online (Amazon & Marketplace Ready) – ConvertGalaxy",
  description: "Convert WebP files downloaded from websites into standard JPG format for Amazon seller listings, legacy desktop software, and CMS platforms. 100% free browser processing.",
  canonicalPath: "/tools/webp-to-jpg",
  ogImage: "https://www.convertgalaxy.com/webp-to-jpg.webp",
  keywords: [
    "convert webp product images to jpg for amazon seller listing",
    "convert webp images downloaded from browser to standard jpg",
    "batch convert webp file directory to jpg for desktop editing",
    "convert webp graphics to jpg for adobe photoshop legacy",
    "convert webp product images to jpg for amazon seller dashboard",
    "webp to jpg converter free",
    "convert webp to jpg online free",
    "save webp as jpg free",
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
      title="Convert WebP Product Images to JPG Online (Marketplace Ready)"
      description="Convert WebP images downloaded from websites to standard JPEG format instantly. Compatible with Amazon Seller Central, legacy graphic editors, and desktop photo viewers."
      uiDescription={
        <span>
          Convert WebP images downloaded from websites to standard JPEG format instantly with quality controls. Compatible with Amazon Seller Central, legacy graphic editors, and desktop photo viewers.
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
