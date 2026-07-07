import TermsHeader from "@/sections/TermsPage/TermsHeader";
import TermsContent from "@/sections/TermsPage/TermsContent";

export const metadata = {
  title: "Terms of Service | ConvertGalaxy",
  description: "ConvertGalaxy's Terms of Service. Read our terms and conditions for using our free online image converter and processing tools.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <TermsHeader />
      <TermsContent />
    </div>
  );
}
