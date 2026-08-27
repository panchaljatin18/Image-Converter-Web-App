import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const ImageToPdfTool = dynamic(() => import("@/components/tools/ImageToPdfTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[300px] flex items-center justify-center">
      Loading PDF Tool...
    </div>
  ),
});

export const metadata = constructMetadata({
  title: "Image to PDF Converter – Combine JPG & PNG to PDF Online | ConvertGalaxy",
  description: "Convert and combine multiple JPG, PNG, and WebP images into a single clean PDF document online for free. Customize page sizes, margins, and orientation privately.",
  canonicalPath: "/tools/image-to-pdf",
  ogImage: "https://www.convertgalaxy.com/image-to-pdf.webp",
  keywords: [
    "image to pdf",
    "image to pdf converter",
    "convert image to pdf",
    "jpg to pdf",
    "png to pdf",
    "combine images to pdf",
    "convert jpg to pdf online free",
    "photos to pdf converter",
  ]
});

const relatedTools = [
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "PDF to Image", href: "/tools/pdf-to-image", icon: "📑" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
];

export default function ImageToPdfPage() {
  return (
    <ToolPageLayout
      title="Image to PDF Converter – Combine Images to PDF Online Free"
      description="Combine multiple receipt photos, screenshots, and document scans into a single PDF. Customize page size (A4, Letter), margins, orientation, and reorder pages easily with 100% private browser processing."
      icon="📄"
      color="#f97316"
      gradient="linear-gradient(135deg, #f97316, #fb923c)"
      relatedTools={relatedTools}
      toolPath="tools/image-to-pdf"
      toolCategory="PDF Tools"
    >
      <ImageToPdfTool />
    </ToolPageLayout>
  );
}
