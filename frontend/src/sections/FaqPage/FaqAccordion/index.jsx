"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqCategories = [
  {
    name: "Privacy & Security",
    icon: "🔒",
    items: [
      { q: "Are my images stored on your servers?", a: "No. All image processing happens entirely in your browser using client-side JavaScript and the Canvas API. Your files never leave your device, ensuring complete privacy and security." },
      { q: "Do you collect any personal data?", a: "We do not collect, store, or share any personal data or images. Our tools are fully client-side. We may use anonymous analytics (page views) to improve the service." },
      { q: "Is it safe to use ConvertGalaxy for sensitive images?", a: "Yes. Since all processing is local to your browser and nothing is uploaded to our servers, your sensitive images remain completely private." },
      { q: "Do you use cookies?", a: "We use minimal cookies for basic site functionality and anonymous analytics. We do not use tracking cookies for advertising purposes." },
    ],
  },
  {
    name: "Tools & Features",
    icon: "⚙️",
    items: [
      { q: "What image formats do you support?", a: "We support JPG/JPEG, PNG, WebP, GIF, and BMP across our various tools. Some tools like the PDF converter also handle PDF files." },
      { q: "Is there a file size limit?", a: "Most tools support files up to 50MB. For batch operations and PDF tools, we recommend files under 20MB each for best performance." },
      { q: "Can I process multiple images at once?", a: "Yes! Our Image Compressor and Image to PDF tools support batch/multiple file uploads. Other tools process one file at a time for maximum control." },
      { q: "Will image quality be affected during conversion?", a: "It depends on the output format. PNG is lossless, so quality is preserved perfectly. JPEG and WebP use lossy compression — our quality sliders let you balance file size vs quality." },
      { q: "Why does the converted file look slightly different?", a: "If converting from PNG with transparency to JPG, transparent areas are filled with a solid color (white by default). Use our color picker to choose a different fill." },
    ],
  },
  {
    name: "Pricing & Account",
    icon: "💳",
    items: [
      { q: "Is ConvertGalaxy really free?", a: "Yes, 100% free. All tools are available without any subscription, account, or payment. We are ad-supported to keep the service free." },
      { q: "Do I need to create an account?", a: "No. You can use every tool immediately without registering or logging in. Just open a tool and start processing." },
      { q: "Will you add premium features?", a: "We may introduce optional premium features in the future, but all current tools will remain free forever." },
    ],
  },
  {
    name: "Technical",
    icon: "🛠️",
    items: [
      { q: "Which browsers are supported?", a: "ConvertGalaxy works on all modern browsers: Chrome 80+, Firefox 75+, Safari 14+, and Edge 80+. We recommend Chrome or Firefox for the best experience." },
      { q: "Does it work on mobile?", a: "Yes! All tools are fully responsive and work on iOS and Android browsers. The crop tool works with touch events too." },
      { q: "Why is processing slow on large files?", a: "Large files require more memory and CPU time in the browser. For files over 10MB, processing may take a few seconds. Using a desktop browser helps with large files." },
      { q: "Can I use ConvertGalaxy offline?", a: "Basic tools work offline once the page is loaded. PDF-related tools require an internet connection to load the PDF.js library." },
    ],
  },
];

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden mb-3 transition-colors duration-300 bg-[#1a1a2e] ${open ? "border-indigo-500" : "border-white/8"}`}>
      <button className="w-full p-5 px-6 flex items-center justify-between cursor-pointer bg-transparent border-none text-[#f8fafc] hover:text-[#818cf8] font-semibold text-base font-['Inter'] text-left gap-4 transition-colors duration-200" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{item.q}</span>
        <ChevronDown className={`shrink-0 w-6 h-6 text-indigo-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`} size={20} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[500px] pb-5" : "max-h-0 pb-0"}`}>
        <div className="px-6 text-[#94a3b8] leading-relaxed text-[0.95rem]">{item.a}</div>
      </div>
    </div>
  );
}

export default function FaqAccordion() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex gap-2.5 flex-wrap mb-10 justify-center">
        {faqCategories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setActiveCategory(i)}
            className={`py-2.5 px-5 rounded-full border text-[0.875rem] font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 font-['Inter'] ${
              activeCategory === i
                ? "border-indigo-500 bg-indigo-500/15 text-[#818cf8]"
                : "border-white/8 bg-transparent text-[#94a3b8] hover:text-[#f8fafc] hover:border-white/20"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="max-w-[760px] mx-auto">
        {faqCategories[activeCategory].items.map((item, i) => (
          <AccordionItem key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
