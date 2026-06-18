import PrivacyHeader from "@/sections/PrivacyPage/PrivacyHeader";
import PrivacyContent from "@/sections/PrivacyPage/PrivacyContent";

export const metadata = {
  title: "Privacy Policy | ImageToolkit",
  description: "ImageToolkit's privacy policy. Learn how we handle your data — spoiler: we don't collect or store any images or personal data.",
};

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <PrivacyHeader />
      <PrivacyContent />
    </div>
  );
}
