import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";

export default function CtaBanner() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#13131f]">
      <Container>
        <div className="text-center py-20 px-12 bg-gradient-to-br from-indigo-500/12 to-cyan-500/6 border border-indigo-500/20 rounded-[32px] relative overflow-hidden">
          {/* Orbs */}
          <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-indigo-500/8 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-cyan-500/6 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-tight font-['Outfit'] mb-4 text-[#f8fafc]">
              Start Converting Your Images{" "}
              <span className="bg-gradient-to-r from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">Right Now</span>
            </h2>
            <p className="text-[#94a3b8] text-[1.1rem] max-w-[520px] mx-auto mb-9 leading-[1.7]">
              Join millions of users who trust ConvertGalaxy for fast, private, and high-quality image processing.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/tools" className="no-underline">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  <Zap size={18} />
                  Get Started — It&apos;s Free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <a href="https://jobforiti.com" target="_blank" rel="noopener noreferrer" title="JobForITI - Latest Walk-in Interviews & Job Placements" className="no-underline">
                <Button variant="secondary" size="lg">
                  Visit Job Portal
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
