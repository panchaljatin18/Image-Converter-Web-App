import FaqHeader from "@/sections/FaqPage/FaqHeader";
import FaqContent from "@/sections/FaqPage/FaqContent";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";
import { ALL_FAQS } from "@/lib/schema";

export const metadata = constructMetadata({
  title: "FAQ – Frequently Asked Questions",
  description: "Find answers to common questions about ConvertGalaxy — privacy, supported formats, file limits, browser compatibility, and more.",
  canonicalPath: "/faq",
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
