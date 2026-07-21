import ToolPageLayout from "@/components/ToolPageLayout"
import HeicToJpgTool from "@/components/tools/HeicToJpgTool"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "HEIC to JPG Converter – Free Online Tool",
  description:
    "Convert Apple HEIC photos to JPG format instantly. Free, browser-based converter. No registration required — preserve EXIF metadata & quality.",
  canonicalPath: "/tools/heic-to-jpg",
  keywords: [
    "heic to jpg",
    "convert heic to jpg",
    "heic to jpg converter",
    "heif to jpg",
    "apple heic to jpg",
    "iphone photo to jpg",
    "convert heic to jpg free",
    "heic to jpeg",
  ],
})

const relatedTools = [
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
  { name: "PDF to Image", href: "/tools/pdf-to-image", icon: "📑" },
]

const toolFaqs = [
  {
    q: "What is HEIC and why should I convert it to JPG?",
    a: "HEIC (High Efficiency Image Container) is Apple's default photo format for iPhone and iPad. While it saves space, Windows PCs, legacy Android devices, and many websites cannot open HEIC files. Converting to JPG ensures universal compatibility everywhere.",
  },
  {
    q: "Will converting HEIC to JPG reduce my photo quality?",
    a: "Our converter preserves original photo resolution and details. By keeping the quality setting at 85%-95%, the output JPG will look virtually identical to your original HEIC photo.",
  },
  {
    q: "Are my iPhone photos safe when uploaded?",
    a: "Yes. Your privacy is protected. Files are processed securely over encrypted SSL connections and are automatically deleted immediately after conversion.",
  },
  {
    q: "Can I convert HEIC photos on Windows or Android?",
    a: "Yes! ConvertGalaxy works directly in any browser on Windows 11/10, Mac, Android, iPhone, iPad, and Linux with zero software installation required.",
  },
]

export default function HeicToJpgPage() {
  return (
    <ToolPageLayout
      title="HEIC to JPG Converter"
      description="Convert Apple HEIC and HEIF photos to high-quality JPG images instantly. Fast, secure, free — works on Windows, Mac, iPhone, and Android."
      uiDescription={
        <span>
          Convert Apple HEIC photos to universal JPG format instantly with
          custom quality & EXIF metadata controls. 100% free —{" "}
          <a
            href="https://jobforiti.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#06b6d4] hover:underline cursor-pointer">
            secure browser & server processing
          </a>
          .
        </span>
      }
      icon="📱"
      color="#06b6d4"
      gradient="linear-gradient(135deg, #06b6d4, #3b82f6)"
      relatedTools={relatedTools}
      toolPath="tools/heic-to-jpg"
      toolCategory="Image Conversion"
      toolFaqs={toolFaqs}>
      <HeicToJpgTool />
    </ToolPageLayout>
  )
}
