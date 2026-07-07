import AboutHeader from "@/sections/AboutPage/AboutHeader";
import AboutContent from "@/sections/AboutPage/AboutContent";

export const metadata = {
  title: "About Us | ConvertGalaxy",
  description: "Learn more about ConvertGalaxy. Our mission is to build fast, secure, local-first browser utilities for image processing with zero file uploads.",
};

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <AboutHeader />
      <AboutContent />
    </div>
  );
}
