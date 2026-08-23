import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const CropImageTool = dynamic(() => import("@/components/tools/CropImageTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[300px] flex items-center justify-center">
      Loading Cropper Tool...
    </div>
  ),
});

export const metadata = constructMetadata({
  title: "Crop Image Online Free (Exact Aspect Ratios for LinkedIn, IG & Avatars) – ConvertGalaxy",
  description: "Crop images to exact aspect ratios (16:9, 1:1, square) for LinkedIn banners, Instagram profile avatars, and passport photos. Free rule-of-thirds grid visual cropper.",
  canonicalPath: "/tools/crop-image",
  ogImage: "https://www.convertgalaxy.com/crop-image.webp",
  keywords: [
    "crop image to exact aspect ratio for linkedin banner",
    "crop profile picture into precise square for instagram avatar",
    "crop headshot photo to 2x2 passport specification free",
    "crop image online free",
    "free image cropper no watermark",
    "crop photo to square online free",
    "crop image for instagram free",
    "online image cropper",
  ]
});

const relatedTools = [
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "PDF to Image", href: "/tools/pdf-to-image", icon: "📑" },
];

export default function CropImagePage() {
  return (
    <ToolPageLayout
      title="Crop Image Online Free (Aspect Ratios for Social Media & Avatars)"
      description="Drag to crop images with precise aspect ratio presets (1:1 square, 16:9 banner, passport). Preview with a rule-of-thirds grid overlay and download instantly."
      uiDescription={
        <span>
          Drag to crop images with precise aspect ratio presets (1:1 square, 16:9 banner, passport). Preview with a rule-of-thirds grid overlay and download instantly.
        </span>
      }
      icon="✂️"
      color="#ef4444"
      gradient="linear-gradient(135deg, #ef4444, #f87171)"
      relatedTools={relatedTools}
      toolPath="tools/crop-image"
      toolCategory="Image Optimization"
    >
      <CropImageTool />
    </ToolPageLayout>
  );
}
