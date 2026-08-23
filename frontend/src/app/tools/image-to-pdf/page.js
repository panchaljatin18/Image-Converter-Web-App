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
  title: "Convert Image to PDF Online (Combine JPG & PNG Scans into PDF) – ConvertGalaxy",
  description: "Combine receipt photos, document screenshots, and JPG scans into a clean multi-page PDF document. Ideal for expense reports, student homework, and contract submissions.",
  canonicalPath: "/tools/image-to-pdf",
  ogImage: "https://www.convertgalaxy.com/image-to-pdf.webp",
  keywords: [
    "combine receipts jpg into pdf for expense report",
    "convert multiple png screenshots into single pdf document",
    "combine mobile camera document photos into clear pdf file",
    "image to pdf converter free",
    "jpg to pdf free online",
    "convert jpg to pdf no signup",
    "multiple images to pdf online free",
    "png to pdf converter free",
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
      title="Convert Images to PDF Online (Combine Scans & Receipts)"
      description="Combine multiple receipt photos, screenshots, and document scans into a single PDF. Customize page size (A4, Letter), margins, orientation, and reorder pages easily."
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
