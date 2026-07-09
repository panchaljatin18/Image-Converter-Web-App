import DisclaimerHeader from "@/sections/DisclaimerPage/DisclaimerHeader";
import DisclaimerContent from "@/sections/DisclaimerPage/DisclaimerContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Disclaimer",
  description: "ConvertGalaxy disclaimer statement. Learn about our service terms, browser-only local file conversion liability, and warranties.",
  canonicalPath: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <DisclaimerHeader />
      <DisclaimerContent />
    </div>
  );
}
