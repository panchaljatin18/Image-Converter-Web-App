import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const PngToAvifTool = dynamic(() => import("@/components/tools/PngToAvifTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-8 sm:p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[320px] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      <span className="text-sm font-medium text-slate-300">Loading PNG to AVIF Converter Engine...</span>
    </div>
  ),
});

const TOOL_TITLE = "PNG to AVIF Converter – Free Online Tool";
const TOOL_DESCRIPTION =
  "Convert PNG images to AVIF, the next-generation format that's up to 50% smaller than WebP and 90% smaller than PNG — with no visible quality loss. Processed 100% privately in your browser, no upload required.";

const baseMetadata = constructMetadata({
  title: "PNG to AVIF Converter | Convert Galaxy",
  description:
    "Convert PNG to AVIF online free. Shrink images up to 50% smaller with next-gen compression, zero quality loss. 100% private, browser-based, no upload.",
  canonicalPath: "/tools/png-to-avif",
  ogImage: "https://www.convertgalaxy.com/png-to-avif.webp",
  keywords: [
    "png to avif",
    "png to avif converter",
    "convert png to avif",
    "avif converter online free",
    "png to avif online",
  ],
});

export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    title: TOOL_TITLE,
    description: baseMetadata.description,
    images: [
      {
        url: "https://www.convertgalaxy.com/png-to-avif.webp",
        width: 1200,
        height: 630,
        alt: TOOL_TITLE,
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    card: "summary_large_image",
    title: TOOL_TITLE,
    description: baseMetadata.description,
    images: ["https://www.convertgalaxy.com/png-to-avif.webp"],
  },
};

const relatedTools = Object.freeze([
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
]);

export default function PngToAvifPage() {
  return (
    <ToolPageLayout
      title={TOOL_TITLE}
      description={TOOL_DESCRIPTION}
      uiDescription={TOOL_DESCRIPTION}
      icon="🚀"
      color="#6366f1"
      gradient="linear-gradient(135deg, #6366f1, #06b6d4)"
      relatedTools={relatedTools}
      toolPath="tools/png-to-avif"
      toolCategory="Image Conversion"
    >
      <PngToAvifTool />
    </ToolPageLayout>
  );
}

