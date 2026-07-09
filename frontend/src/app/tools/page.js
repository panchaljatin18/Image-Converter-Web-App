import ToolsHeader from "@/sections/ToolsPage/ToolsHeader";
import ToolsCategoryList from "@/sections/ToolsPage/ToolsCategoryList";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "All Free Image Tools",
  description: "Browse all free online image tools: JPG to PNG, PNG to JPG, WebP converter, image compressor, resizer, crop, image to PDF, PDF to image — all free and browser-based.",
  canonicalPath: "/tools",
});

export default function ToolsPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <ToolsHeader />
      <ToolsCategoryList />
    </div>
  );
}
