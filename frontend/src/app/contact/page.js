import ContactHeader from "@/sections/ContactPage/ContactHeader";
import ContactContent from "@/sections/ContactPage/ContactContent";

export const metadata = {
  title: "Contact Us | ConvertGalaxy",
  description: "Get in touch with the ConvertGalaxy team. Report a bug, request a feature, or ask a question. We respond within 24 hours.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <ContactHeader />
      <ContactContent />
    </div>
  );
}
