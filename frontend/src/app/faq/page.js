import FaqHeader from "@/sections/FaqPage/FaqHeader";
import FaqContent from "@/sections/FaqPage/FaqContent";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";
import { ALL_FAQS } from "@/lib/schema";

export const metadata = constructMetadata({
  title: "FAQ – Common Questions About ConvertGalaxy Tools",
  description: "Answers to common questions about file size limits, supported formats, privacy, and how ConvertGalaxy's browser-based tools work.",
  canonicalPath: "/faq",
  keywords: ["convertgalaxy faq"],
});

export default function FaqPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <SEO type="faq" faqs={ALL_FAQS} />
      <FaqHeader />
      <FaqContent />
    </div>
  );
}
