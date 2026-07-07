import ToolsHeader from "@/sections/ToolsPage/ToolsHeader";
import ToolsCategoryList from "@/sections/ToolsPage/ToolsCategoryList";

export const metadata = {
  title: "All Free Image Tools – ConvertGalaxy",
  description:
    "Browse all free online image tools: JPG to PNG, PNG to JPG, WebP converter, image compressor, resizer, crop, image to PDF, PDF to image — all free and browser-based.",
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <ToolsHeader />
      <ToolsCategoryList />
    </div>
  );
}
