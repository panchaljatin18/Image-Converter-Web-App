import React from "react";

const privacySections = [
  {
    title: "1. Information We Collect",
    content: `We collect minimal data to operate and improve our service:

<strong>Anonymous Analytics:</strong> We collect anonymous usage data such as page views, tool usage frequency, and general geographic region (country-level). This data contains no personally identifiable information and cannot be used to identify you.

<strong>Contact Form Data:</strong> If you use our contact form, we collect your name, email address, and message content solely to respond to your inquiry.

<strong>What We Do NOT Collect:</strong> We do not collect, upload, store, or access any images you process on ConvertGalaxy. All file processing happens locally in your browser.`,
  },
  {
    title: "2. How Your Images Are Processed",
    content: `ConvertGalaxy uses client-side browser technologies (JavaScript Canvas API, WebAssembly) to process images entirely on your device.

Your images are loaded directly from your device into your browser's memory. They are processed locally using your computer's resources. The converted/compressed result is generated locally and made available for download.

At no point are your images transmitted over the internet to our servers or any third-party server.`,
  },
  {
    title: "3. Cookies and Tracking",
    content: `We use minimal cookies:

<strong>Essential Cookies:</strong> Required for basic site functionality (e.g., remembering your preferences).

<strong>Analytics Cookies:</strong> Anonymous cookies that help us understand how users navigate our site. These do not identify you personally. We use privacy-focused analytics that do not share data with advertising networks.

<strong>No Advertising Cookies:</strong> We do not use cookies for advertising targeting or remarketing.

You can control cookie preferences through your browser settings.`,
  },
  {
    title: "4. Third-Party Services",
    content: `We may use the following third-party services:

<strong>Google Fonts:</strong> Font files are served from Google's CDN. Google may log font requests per their privacy policy.

<strong>CDN Services:</strong> Some JavaScript libraries (like PDF.js) may be loaded from content delivery networks. These CDNs may log request metadata.

<strong>Google AdSense:</strong> We display advertisements through Google AdSense. Google may use cookies to serve personalized ads based on your browsing history. You can opt out via Google's ad settings.

We do not sell or share your personal data with third parties for marketing purposes.`,
  },
  {
    title: "5. Data Retention",
    content: `Since we do not collect or store your images, there is no image data to retain or delete.

Contact form submissions are retained for up to 90 days after your inquiry is resolved, then permanently deleted.

Anonymous analytics data is retained in aggregate form for up to 24 months.`,
  },
  {
    title: "6. Your Rights (GDPR & CCPA)",
    content: `If you are in the European Union (GDPR) or California (CCPA), you have the right to:

• Access any personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your data
• Object to processing of your data
• Data portability

To exercise these rights, contact us at hello@convertgalaxy.pro. We will respond within 30 days.`,
  },
  {
    title: "7. Children's Privacy",
    content: `ConvertGalaxy is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last updated" date at the top of this page. Continued use of ConvertGalaxy after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "9. Contact Us",
    content: `If you have questions about this Privacy Policy or your privacy rights, please contact us:\n\nEmail: hello@convertgalaxy.pro\n\nWe are committed to resolving any privacy concerns promptly.`,
  },
];

export default function PrivacyContent() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16">
      <div className="max-w-[760px] mx-auto">
        {/* TL;DR */}
        <div className="py-6 px-7 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl mb-12">
          <h2 className="font-['Outfit'] font-bold text-[1.1rem] text-emerald-400 mb-2.5">
            TL;DR — The Short Version
          </h2>
          <p className="text-[#94a3b8] text-[0.925rem] leading-relaxed">
            All image processing happens 100% in your browser. We <strong className="text-white">never</strong> upload, store, or access your images. We collect only anonymous analytics data (page views, tool usage counts). No images. No personal files. Ever.
          </p>
        </div>

        {privacySections.map((section, i) => (
          <div key={i} className="mb-10">
            <h2 className="font-['Outfit'] font-bold text-[1.2rem] text-[#f8fafc] mb-3.5 pb-2.5 border-b border-white/8">
              {section.title}
            </h2>
            <div
              className="text-[#94a3b8] text-[0.925rem] leading-loose"
              dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, "<br />") }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
