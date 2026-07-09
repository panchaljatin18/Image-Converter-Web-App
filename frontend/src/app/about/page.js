import AboutHeader from "@/sections/AboutPage/AboutHeader";
import AboutContent from "@/sections/AboutPage/AboutContent";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "About Us",
  description: "Learn more about ConvertGalaxy. Our mission is to build fast, secure, local-first browser utilities for image processing with zero file uploads.",
  canonicalPath: "/about",
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
