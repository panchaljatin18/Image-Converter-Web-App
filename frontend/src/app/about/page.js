import AboutHeader from "@/sections/AboutPage/AboutHeader";
import AboutContent from "@/sections/AboutPage/AboutContent";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "About ConvertGalaxy – Free, Private Image Tools",
  description: "Learn why ConvertGalaxy processes every image locally in your browser — no server upload, no data collection, 100% free forever.",
  canonicalPath: "/about",
  keywords: ["about convertgalaxy"],
});

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <SEO type="about" />
      <AboutHeader />
      <AboutContent />
    </div>
  );
}
