import React from "react";
import FaqAccordion from "../FaqAccordion";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function FaqContent() {
  return (
    <div className="container" style={{ padding: "64px 24px" }}>
      <FaqAccordion />

      {/* Still have questions? */}
      <div style={{ textAlign: "center", marginTop: "64px", padding: "48px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "24px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>💬</div>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.5rem", marginBottom: "12px" }}>
          Still have questions?
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", maxWidth: "400px", margin: "0 auto 24px", fontSize: "0.95rem", lineHeight: 1.7 }}>
          Can&apos;t find the answer you&apos;re looking for? Send us a message and we&apos;ll get back to you within 24 hours.
        </p>
        <Link href="/contact" className="btn btn-primary">
          <MessageCircle size={16} />
          Contact Us
        </Link>
      </div>
    </div>
  );
}
