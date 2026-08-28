import ContactHeader from "@/sections/ContactPage/ContactHeader"
import ContactContent from "@/sections/ContactPage/ContactContent"
import SEO from "@/components/SEO"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Contact Convert Galaxy – Support, Feedback & Feature Requests",
  description:
    "Have a question, found a bug, or want to request a new image tool feature? Contact the Convert Galaxy team — we reply fast. Free image converter support.",
  canonicalPath: "/contact",
  keywords: [
    "contact convert galaxy",
    "image converter support",
    "convertgalaxy feedback",
    "free converter help",
    "report bug image converter",
  ],
})

export default function ContactPage() {
  return (
    <div style={{ paddingTop: "65px" }}>
      <SEO type="contact" />
      <ContactHeader />
      <ContactContent />
    </div>
  )
}
