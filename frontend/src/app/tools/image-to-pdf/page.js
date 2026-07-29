import ToolPageLayout from "@/components/ToolPageLayout";
import ImageToPdfTool from "@/components/tools/ImageToPdfTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Image to PDF Converter Free – JPG/PNG to PDF in Seconds",
  description: "Convert one or multiple JPG/PNG images into a single PDF file free. No email signup, no watermark — works instantly in your browser.",
  canonicalPath: "/tools/image-to-pdf",
  ogImage: "https://www.convertgalaxy.com/image-to-pdf.png",
  keywords: [
    "image to pdf converter",
    "convert jpg to pdf free",
    "multiple images to one pdf online",
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
      title="Convert Images to PDF Online Free"
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
