import ToolPageLayout from "@/components/ToolPageLayout";
import PdfToImageTool from "@/components/tools/PdfToImageTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "PDF to Image Converter Free – Convert PDF to JPG or PNG Online",
  description: "Convert PDF pages to high-quality JPG or PNG images free online. No signup, no watermark, fast browser-based conversion. Extract every page from any PDF instantly.",
  canonicalPath: "/tools/pdf-to-image",
  ogImage: "https://www.convertgalaxy.com/pdf-to-image.webp",
  keywords: [
    "pdf to image converter free",
    "convert pdf to jpg free online",
    "pdf to png converter free",
    "pdf to jpg no signup",
    "extract images from pdf free",
    "pdf to image no watermark",
    "best pdf to image converter",
    "pdf page to jpg online",
  ]
});

const relatedTools = [
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
];

export default function PdfToImagePage() {
  return (
    <ToolPageLayout
      title="Convert PDF to Image Online Free"
      description="Extract each page of a PDF as a high-quality JPG or PNG image. Control the resolution scale for web or print quality output. All processing happens locally in your browser."
      icon="📑"
      color="#ec4899"
      gradient="linear-gradient(135deg, #ec4899, #f472b6)"
      relatedTools={relatedTools}
      toolPath="tools/pdf-to-image"
      toolCategory="PDF Tools"
    >
      <PdfToImageTool />
    </ToolPageLayout>
  );
}
