import ToolPageLayout from "@/components/ToolPageLayout";
import ImageToPdfTool from "@/components/tools/ImageToPdfTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Image to PDF Converter – Combine Images into PDF Free",
  description: "Convert JPG, PNG, WebP images to a PDF file. Combine multiple images into one PDF with page size, orientation, and margin settings. Free, browser-based, no upload.",
  canonicalPath: "/tools/image-to-pdf",
});

const relatedTools = [
  { name: "PDF to Image", href: "/tools/pdf-to-image", icon: "📑" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
];

export default function ImageToPdfPage() {
  return (
    <ToolPageLayout
      title="Image to PDF"
      description="Combine one or more images into a PDF document. Control page size (A4, A3, Letter), orientation, margins, and image fit. Reorder pages before converting."
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
