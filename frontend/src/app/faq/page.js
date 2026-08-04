import FaqHeader from "@/sections/FaqPage/FaqHeader";
import FaqContent from "@/sections/FaqPage/FaqContent";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";
import { ALL_FAQS } from "@/lib/schema";

export const metadata = constructMetadata({
  title: "FAQ – Free Image Converter Questions Answered | Convert Galaxy",
  description: "Find answers to common questions about file size limits, supported formats (JPG, PNG, WebP, HEIC, PDF), privacy policy, and how Convert Galaxy's browser-based tools work.",
  canonicalPath: "/faq",
  keywords: ["convertgalaxy faq", "image converter faq", "free converter questions", "heic to jpg faq", "compress image faq", "image converter privacy"],
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
