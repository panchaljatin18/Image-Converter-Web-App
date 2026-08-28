import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";

const faqs = [
  { q: "Are my images stored on your servers?", a: "No. All image processing happens entirely in your browser using client-side JavaScript and Canvas API. Your images never leave your device, ensuring complete privacy." },
  { q: "Is ConvertGalaxy completely free?", a: "Yes! All tools on ConvertGalaxy are 100% free to use with no hidden costs, subscriptions, or account requirements." },
  { q: "What image formats do you support?", a: "We support JPG/JPEG, PNG, WebP, GIF, BMP, and TIFF formats across our various tools." },
  { q: "Is there a file size limit?", a: "Most tools support files up to 50MB. For batch operations, we recommend files under 20MB each for optimal performance." },
];

export default function FaqPreview() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#0f0f1a]">
      <Container>
        <div className="text-center max-w-[650px] mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-[0.78rem] font-semibold tracking-wider uppercase bg-indigo-500/15 text-[#818cf8] border border-indigo-500/30 mb-4">FAQ</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-tight font-['Outfit'] mb-4 text-[#f8fafc]">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">Questions</span>
          </h2>
        </div>

        <div className="max-w-[720px] mx-auto">
          {faqs.map((item, i) => (
            <div key={i} className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-3">
              <h3 className="font-bold text-[1rem] text-[#f8fafc] mb-2.5 flex items-start gap-2.5">
                <span className="text-[#6366f1] shrink-0">Q.</span>
                {item.q}
              </h3>
              <p className="text-[#cbd5e1] text-[0.9rem] leading-relaxed pl-[22px]">{item.a}</p>
            </div>
          ))}

          <div className="text-center mt-8">
            <Link
              href="/faq"
              aria-label="View All Frequently Asked Questions"
              className="inline-flex items-center gap-2 py-3 px-7 rounded-xl font-semibold text-[0.95rem] transition-all duration-250 cursor-pointer no-underline whitespace-nowrap bg-transparent text-[#f8fafc] border border-indigo-500/20 backdrop-blur-[10px] hover:bg-indigo-500/10 hover:border-[#6366f1] hover:-translate-y-0.5"
            >
              View All FAQs
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
