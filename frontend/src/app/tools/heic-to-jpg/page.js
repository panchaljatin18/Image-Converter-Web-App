import ToolPageLayout from "@/components/ToolPageLayout"
import { constructMetadata } from "@/lib/metadata"
import dynamic from "next/dynamic"

const HeicToJpgTool = dynamic(() => import("@/components/tools/HeicToJpgTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[300px] flex items-center justify-center">
      Loading Converter Tool...
    </div>
  ),
})

export const metadata = constructMetadata({
  title: "HEIC to JPG Converter – Free Online, No Upload Required | ConvertGalaxy",
  description:
    "Convert iPhone HEIC photos to JPG online for free. Preserve camera EXIF metadata and original resolution with 100% private browser processing without server uploads.",
  canonicalPath: "/tools/heic-to-jpg",
  ogImage: "https://www.convertgalaxy.com/heic-to-jpg.webp",
  keywords: [
    "heic to jpg",
    "heic to jpg converter",
    "convert heic to jpg",
    "convert heic to jpg online free",
    "heic to jpg converter free",
    "iphone photo to jpg",
    "heif to jpg converter",
    "convert apple photos to jpg",
    "heic to jpg no upload",
    "heic to jpg private",
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
    q: "Are my iPhone photos safe when converted online?",
    a: "Yes! Your photos are processed privately in your local browser using client-side WebAssembly technology without being saved or retained on external cloud servers.",
  },
  {
    q: "Can I convert HEIC photos on Windows or Android?",
    a: "Yes! ConvertGalaxy works directly in any browser on Windows 11/10, Mac, Android, iPhone, iPad, and Linux with zero software installation required.",
  },
]

export default function HeicToJpgPage() {
  return (
    <ToolPageLayout
      title="HEIC to JPG Converter – Convert iPhone Photos to JPG Online"
      description="Convert Apple HEIC photos to universal JPG format instantly. Preserve original camera resolution and EXIF metadata without uploading files to external servers."
      uiDescription={
        <span>
          Convert Apple iPhone HEIC and HEIF photos to universal JPG format instantly with custom quality & EXIF metadata controls. 100% private browser-side processing.
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
