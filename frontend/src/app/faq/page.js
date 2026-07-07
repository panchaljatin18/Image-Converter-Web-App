import FaqHeader from "@/sections/FaqPage/FaqHeader";
import FaqContent from "@/sections/FaqPage/FaqContent";

export const metadata = {
  title: "FAQ – Frequently Asked Questions | ConvertGalaxy",
  description:
    "Find answers to common questions about ConvertGalaxy — privacy, supported formats, file limits, browser compatibility, and more.",
};

export default function FaqPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <FaqHeader />
      <FaqContent />
    </div>
  );
}
