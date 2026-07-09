import PrivacyHeader from "@/sections/PrivacyPage/PrivacyHeader";
import PrivacyContent from "@/sections/PrivacyPage/PrivacyContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Privacy Policy",
  description: "ConvertGalaxy's privacy policy. Learn how we handle your data — spoiler: we don't collect or store any images or personal data.",
  canonicalPath: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <PrivacyHeader />
      <PrivacyContent />
    </div>
  );
}
