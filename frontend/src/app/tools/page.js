import dynamic from "next/dynamic";
import ToolsHeader from "@/sections/ToolsPage/ToolsHeader";
import { constructMetadata } from "@/lib/metadata";

const MegaMenu = dynamic(() => import("@/components/MegaMenu"));

export const metadata = constructMetadata({
  title: "All Image Tools – Convert, Compress, Resize & Edit Free",
  description: "Browse all free image tools in one place — converters, compressor, resizer, cropper & PDF tools. No signup, fully browser-based.",
  canonicalPath: "/tools",
  keywords: ["free image tools online"],
});

export default function ToolsPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <ToolsHeader />
      <MegaMenu />
    </div>
  );
}
