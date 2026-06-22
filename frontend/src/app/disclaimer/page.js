import DisclaimerHeader from "@/sections/DisclaimerPage/DisclaimerHeader";
import DisclaimerContent from "@/sections/DisclaimerPage/DisclaimerContent";

export const metadata = {
  title: "Disclaimer | ImageToolkit",
  description: "ImageToolkit disclaimer statement. Learn about our service terms, browser-only local file conversion liability, and warranties.",
};

export default function DisclaimerPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <DisclaimerHeader />
      <DisclaimerContent />
    </div>
  );
}
