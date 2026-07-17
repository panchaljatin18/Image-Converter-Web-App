import ToolPageLayout from "@/components/ToolPageLayout";
import WebPToJpgTool from "@/components/tools/WebPToJpgTool";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "WebP to JPG Converter – Free Online Tool",
  description: "Convert WebP images to compressed JPG format. Adjust quality, set background color for transparent areas. Free, fast, no upload needed.",
  canonicalPath: "/tools/webp-to-jpg",
  keywords: [
    "webp to jpg",
    "convert webp to jpg",
    "webp to jpg online",
    "webp to jpeg",
    "convert webp to jpg free",
    "webp to jpg converter free",
    "change webp to jpg"
  ]
});

const relatedTools = [
  { name: "WebP Converter", href: "/tools/webp-converter", icon: "⚡" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png", icon: "🔄" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg", icon: "🖼️" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🗜️" },
];

export default function WebPToJpgPage() {
  return (
    <ToolPageLayout
      title="WebP to JPG Converter"
      description="Convert WebP images to JPG format with custom quality settings. Handles transparent backgrounds, producing smaller, web-optimized files instantly in your browser."
      uiDescription={
        <span>
          Convert WebP images to JPG format with custom quality settings. Handles transparent backgrounds, producing smaller, web-optimized files instantly in your{" "}
          <a href="https://jobforiti.com/sfc-solution-company-recruitment-2026" target="_blank" rel="noopener noreferrer" title="SFC Solution Company Recruitment 2026 on JobForITI" className="text-[#ea580c] hover:text-[#f97316] underline decoration-[#ea580c]/45">
            browser
          </a>
          .
        </span>
      }
      icon="🖼️"
      color="#ea580c"
      gradient="linear-gradient(135deg, #ea580c, #f97316)"
      relatedTools={relatedTools}
      toolPath="tools/webp-to-jpg"
      toolCategory="Image Conversion"
    >
      <WebPToJpgTool />
    </ToolPageLayout>
  );
}
