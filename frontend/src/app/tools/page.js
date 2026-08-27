import dynamic from "next/dynamic";
import ToolsHeader from "@/sections/ToolsPage/ToolsHeader";
import { constructMetadata } from "@/lib/metadata";

const MegaMenu = dynamic(() => import("@/components/MegaMenu"));

export const metadata = constructMetadata({
  title: "All Free Image Tools & Online Converters | ConvertGalaxy",
  description: "Browse all 11 free image tools in one place – format converters, batch compressor, resizer, cropper & PDF tools. 100% private, browser-based, no signup required.",
  canonicalPath: "/tools",
  keywords: [
    "all image tools",
    "free image tools online",
    "online image converters",
    "free image utilities",
    "batch image tools",
  ],
});

export default function ToolsPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <ToolsHeader />
      <MegaMenu />
    </div>
  );
}
