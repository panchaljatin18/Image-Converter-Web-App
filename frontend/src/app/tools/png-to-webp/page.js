import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import dynamic from "next/dynamic";

const PNGToWebPTool = dynamic(() => import("@/components/tools/PNGToWebPTool"), {
  loading: () => (
    <div className="w-full max-w-4xl mx-auto p-8 sm:p-12 text-center text-slate-400 bg-[#141424] rounded-2xl border border-slate-800/80 animate-pulse min-h-[320px] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      <span className="text-sm font-medium text-slate-300">Loading PNG to WebP Converter...</span>
    </div>
  ),
});

const TOOL_TITLE = "PNG to WebP Converter – Free Online Tool";
const TOOL_DESCRIPTION =
  "Convert PNG graphics to modern WebP format online. Reduce image file size by up to 80% while preserving alpha transparency for faster website load times. 100% private browser processing.";

const baseMetadata = constructMetadata({
  title: "PNG to WebP Converter | Convert Galaxy",
  description:
    "Convert PNG to WebP online free. Shrink image file size up to 80% while retaining full alpha transparency to boost website speed and Core Web Vitals.",
  canonicalPath: "/tools/png-to-webp",
  ogImage: "https://www.convertgalaxy.com/png-to-webp.webp",
  keywords: [
    "png to webp",
    "png to webp converter",
    "png to webp converter free",
    "Online Image Converter for Free",
    "png to webp online",
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
        url: "https://www.convertgalaxy.com/png-to-webp.webp",
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
    images: ["https://www.convertgalaxy.com/png-to-webp.webp"],
  },
};

const relatedTools = Object.freeze([
  { name: "PNG to AVIF", href: "/tools/png-to-avif", icon: "🚀" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg", icon: "📸" },
  { name: "HEIC to JPG", href: "/tools/heic-to-jpg", icon: "📱" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "📐" },
  { name: "Crop Image", href: "/tools/crop-image", icon: "✂️" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄" },
]);

export default function PNGToWebPPage() {
  return (
    <ToolPageLayout
      title={TOOL_TITLE}
      description={TOOL_DESCRIPTION}
      uiDescription={TOOL_DESCRIPTION}
      icon="🖼️"
      color="#06b6d4"
      gradient="linear-gradient(135deg, #06b6d4, #3b82f6)"
      relatedTools={relatedTools}
      toolPath="tools/png-to-webp"
      toolCategory="Image Conversion"
    >
      <PNGToWebPTool />
    </ToolPageLayout>
  );
}
