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
      { q: "Is it safe to use ImageToolkit for sensitive images?", a: "Yes. Since all processing is local to your browser and nothing is uploaded to our servers, your sensitive images remain completely private." },
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
      { q: "Is ImageToolkit really free?", a: "Yes, 100% free. All tools are available without any subscription, account, or payment. We are ad-supported to keep the service free." },
      { q: "Do I need to create an account?", a: "No. You can use every tool immediately without registering or logging in. Just open a tool and start processing." },
      { q: "Will you add premium features?", a: "We may introduce optional premium features in the future, but all current tools will remain free forever." },
    ],
  },
  {
    name: "Technical",
    icon: "🛠️",
    items: [
      { q: "Which browsers are supported?", a: "ImageToolkit works on all modern browsers: Chrome 80+, Firefox 75+, Safari 14+, and Edge 80+. We recommend Chrome or Firefox for the best experience." },
      { q: "Does it work on mobile?", a: "Yes! All tools are fully responsive and work on iOS and Android browsers. The crop tool works with touch events too." },
      { q: "Why is processing slow on large files?", a: "Large files require more memory and CPU time in the browser. For files over 10MB, processing may take a few seconds. Using a desktop browser helps with large files." },
      { q: "Can I use ImageToolkit offline?", a: "Basic tools work offline once the page is loaded. PDF-related tools require an internet connection to load the PDF.js library." },
    ],
  },
];

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`accordion-item ${open ? "open" : ""}`}>
      <button className="accordion-button" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{item.q}</span>
        <ChevronDown className="accordion-icon" size={20} />
      </button>
      <div className="accordion-content">
        <div className="accordion-body">{item.a}</div>
      </div>
    </div>
  );
}

export default function FaqAccordion() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div>
      {/* Category Tabs */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "40px", justifyContent: "center" }}>
        {faqCategories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setActiveCategory(i)}
            style={{
              padding: "10px 20px",
              borderRadius: "100px",
              border: activeCategory === i ? "1px solid var(--primary)" : "1px solid var(--border-light)",
              background: activeCategory === i ? "rgba(99,102,241,0.15)" : "transparent",
              color: activeCategory === i ? "var(--primary-light)" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {faqCategories[activeCategory].items.map((item, i) => (
          <AccordionItem key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
