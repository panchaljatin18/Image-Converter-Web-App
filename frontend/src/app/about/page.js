import AboutHeader from "@/sections/AboutPage/AboutHeader";
import AboutContent from "@/sections/AboutPage/AboutContent";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "About Convert Galaxy – Free, Private, Browser-Based Image Tools",
  description: "Learn why Convert Galaxy processes every image 100% locally in your browser — no server upload, no data collection, no signup, completely free forever.",
  canonicalPath: "/about",
  keywords: ["about convert galaxy", "convertgalaxy free image tools", "browser based image converter", "private image conversion", "no upload image converter"],
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
