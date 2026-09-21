import ToolPageLayout from "@/components/ToolPageLayout";
import { constructMetadata } from "@/lib/metadata";
import PNGToWebPTool from "@/components/tools/PNGToWebPTool";

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

const toolFaqs = [
  {
    q: "How does the PNG to WebP converter work?",
    a: "Our converter encodes your PNG image into Google's modern WebP image format directly inside your web browser using HTML5 Canvas technology. Your image file is never uploaded to any external server.",
  },
  {
    q: "Will PNG transparent backgrounds be preserved in WebP?",
    a: "Yes! WebP fully supports 8-bit alpha transparency. Our converter keeps transparent PNG backgrounds 100% intact without adding white or black borders.",
  },
  {
    q: "How much file size reduction can I expect when converting PNG to WebP?",
    a: "Converting lossless PNG graphics to lossy or lossless WebP typically reduces image file sizes by 40% to 80% with zero noticeable loss in visual quality.",
  },
  {
    q: "Are my uploaded PNG photos safe and private?",
    a: "100% safe. All conversions happen entirely on your device (client-side). No data, images, or metadata ever leave your web browser or touch cloud servers.",
  },
];

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
      toolFaqs={toolFaqs}
    >
      <PNGToWebPTool />
    </ToolPageLayout>
  );
}
