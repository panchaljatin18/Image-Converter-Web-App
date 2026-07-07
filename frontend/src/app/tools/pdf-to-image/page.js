import ToolPageLayout from "@/components/ToolPageLayout";
import PdfToImageTool from "@/components/tools/PdfToImageTool";

export const metadata = {
  title: "PDF to Image Converter – Extract PDF Pages as JPG/PNG Free",
  description: "Convert PDF pages to high-quality JPG or PNG images. Extract every page as a separate image file. Free, browser-based PDF to image converter with resolution control.",
  alternates: {
    canonical: "/tools/pdf-to-image",
  },
};

const relatedTools = [
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
];

export default function PdfToImagePage() {
  return (
    <ToolPageLayout
      title="PDF to Image"
      description="Extract each page of a PDF as a high-quality JPG or PNG image. Control the resolution scale for web or print quality output. All processing happens locally in your browser."
      icon="📑"
      color="#ec4899"
      gradient="linear-gradient(135deg, #ec4899, #f472b6)"
      relatedTools={relatedTools}
    >
      <PdfToImageTool />
    </ToolPageLayout>
  );
}
