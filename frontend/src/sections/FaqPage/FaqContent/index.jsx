import React from "react";
import FaqAccordion from "../FaqAccordion";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";

export default function FaqContent() {
  return (
    <Container className="py-16">
      <FaqAccordion />

      {/* Still have questions? */}
      <div className="text-center mt-16 p-12 bg-indigo-500/5 border border-indigo-500/15 rounded-3xl">
        <div className="text-[3rem] mb-4">💬</div>
        <h2 className="font-['Outfit'] font-bold text-2xl mb-3 text-[#f8fafc]">
          Still have questions?
        </h2>
        <p className="text-[#94a3b8] mb-6 max-w-[400px] mx-auto text-[0.95rem] leading-relaxed">
          Can&apos;t find the answer you&apos;re looking for? Send us a message and we&apos;ll get back to you within 24 hours.
        </p>
        <Link href="/contact" className="no-underline inline-block">
          <Button variant="primary">
            <MessageCircle size={16} />
            Contact Us
          </Button>
        </Link>
      </div>
    </Container>
  );
}
