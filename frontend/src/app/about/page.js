import AboutHeader from "@/sections/AboutPage/AboutHeader";
import AboutContent from "@/sections/AboutPage/AboutContent";

export const metadata = {
  title: "About Us | ImageToolkit",
  description: "Learn more about ImageToolkit. Our mission is to build fast, secure, local-first browser utilities for image processing with zero file uploads.",
};

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <AboutHeader />
      <AboutContent />
    </div>
  );
}
