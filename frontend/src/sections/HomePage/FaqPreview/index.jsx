import Link from "next/link";
import { ArrowRight } from "lucide-react";

const faqs = [
  { q: "Are my images stored on your servers?", a: "No. All image processing happens entirely in your browser using client-side JavaScript and Canvas API. Your images never leave your device, ensuring complete privacy." },
  { q: "Is ImageToolkit completely free?", a: "Yes! All tools on ImageToolkit are 100% free to use with no hidden costs, subscriptions, or account requirements." },
  { q: "What image formats do you support?", a: "We support JPG/JPEG, PNG, WebP, GIF, BMP, and TIFF formats across our various tools." },
  { q: "Is there a file size limit?", a: "Most tools support files up to 50MB. For batch operations, we recommend files under 20MB each for optimal performance." },
];

export default function FaqPreview() {
  return (
    <section className="section" style={{ background: "var(--bg-primary)" }}>
      <div className="container">
        <div className="section-header">
          <span className="badge">FAQ</span>
          <h2 className="heading-lg">
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h2>
        </div>

        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {faqs.map((item, i) => (
            <div key={i} style={{ padding: "24px", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "16px", marginBottom: "12px" }}>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "10px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ color: "var(--primary)", flexShrink: 0 }}>Q.</span>
                {item.q}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7, paddingLeft: "22px" }}>{item.a}</p>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link href="/faq" className="btn btn-secondary">
              View All FAQs
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
