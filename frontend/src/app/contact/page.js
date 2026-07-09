import ContactHeader from "@/sections/ContactPage/ContactHeader";
import ContactContent from "@/sections/ContactPage/ContactContent";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Contact Us",
  description: "Get in touch with the ConvertGalaxy team. Report a bug, request a feature, or ask a question. We respond within 24 hours.",
  canonicalPath: "/contact",
});

export default function ContactPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <SEO type="contact" />
      <ContactHeader />
      <ContactContent />
    </div>
  );
}
