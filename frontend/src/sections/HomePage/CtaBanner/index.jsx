import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <div
          style={{
            textAlign: "center",
            padding: "80px 48px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(6,182,212,0.06) 100%)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Orbs */}
          <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "300px", height: "300px", background: "rgba(99,102,241,0.08)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-80px", right: "-80px", width: "300px", height: "300px", background: "rgba(6,182,212,0.06)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="heading-lg" style={{ marginBottom: "16px" }}>
              Start Converting Your Images{" "}
              <span className="text-gradient">Right Now</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "520px", margin: "0 auto 36px", lineHeight: 1.7 }}>
              Join millions of users who trust ImageToolkit for fast, private, and high-quality image processing.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/tools" className="btn btn-primary btn-lg">
                <Zap size={18} />
                Get Started — It&apos;s Free
                <ArrowRight size={18} />
              </Link>
              <Link href="/blog" className="btn btn-secondary btn-lg">
                Read Our Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
