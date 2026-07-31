"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-white/8 bg-[#1a1a2e] rounded-2xl overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between py-4 px-6 text-left font-semibold text-[#f8fafc] hover:bg-white/[0.02] transition-colors duration-150"
            >
              <span>{faq.q || faq.question}</span>
              {isOpen ? (
                <ChevronUp size={18} className="text-[#a5b4fc] shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-[#a5b4fc] shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="py-4 px-6 border-t border-white/6 text-[#cbd5e1] text-[0.9rem] leading-relaxed bg-[#151528]">
                {faq.a || faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
