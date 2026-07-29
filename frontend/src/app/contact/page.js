import ContactHeader from "@/sections/ContactPage/ContactHeader";
import ContactContent from "@/sections/ContactPage/ContactContent";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Contact ConvertGalaxy – Get Support or Send Feedback",
  description: "Have a question, bug report, or feature request? Contact the ConvertGalaxy team — we reply fast.",
  canonicalPath: "/contact",
  keywords: ["contact convertgalaxy"],
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
