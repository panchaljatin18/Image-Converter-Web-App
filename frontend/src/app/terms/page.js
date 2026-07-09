import TermsHeader from "@/sections/TermsPage/TermsHeader";
import TermsContent from "@/sections/TermsPage/TermsContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Terms of Service",
  description: "ConvertGalaxy's Terms of Service. Read our terms and conditions for using our free online image converter and processing tools.",
  canonicalPath: "/terms",
});

export default function TermsPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <TermsHeader />
      <TermsContent />
    </div>
  );
}
