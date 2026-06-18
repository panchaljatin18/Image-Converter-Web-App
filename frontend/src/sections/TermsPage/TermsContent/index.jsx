import React from "react";

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    content: `By using ImageToolkit, you confirm that you are at least 13 years old and agree to these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.`,
  },
  {
    title: "2. Description of Service",
    content: `ImageToolkit provides free, browser-based image processing tools including but not limited to: image format conversion (JPG, PNG, WebP), image compression, image resizing, image cropping, and PDF conversion tools.

All image processing occurs client-side in your browser. We do not host, store, or process your images on our servers.`,
  },
  {
    title: "3. Acceptable Use",
    content: `You may use ImageToolkit for lawful purposes only. You agree NOT to use the service to:

• Process or distribute illegal, harmful, or offensive content
• Infringe on the intellectual property rights of others
• Attempt to reverse engineer, hack, or exploit our systems
• Use automated tools to make excessive requests (scraping, bots)
• Misrepresent the origin of processed images
• Process images you do not have rights to use

We reserve the right to suspend access to users who violate these terms.`,
  },
  {
    title: "4. Intellectual Property",
    content: `<strong>Your Images:</strong> You retain full ownership of all images you process using ImageToolkit. We do not claim any rights to your content.

<strong>Our Service:</strong> The ImageToolkit website, brand, logos, and codebase are owned by us. You may not copy, reproduce, or distribute our service without permission.

<strong>Third-Party Libraries:</strong> Some tools use open-source libraries (pdf-lib, browser-image-compression, pdfjs-dist) under their respective licenses.`,
  },
  {
    title: "5. Disclaimer of Warranties",
    content: `ImageToolkit is provided "as is" and "as available" without warranties of any kind, either express or implied, including:

• Warranty of merchantability or fitness for a particular purpose
• Warranty that the service will be uninterrupted or error-free
• Warranty of the accuracy or reliability of results

We do not guarantee that our tools will produce results identical to professional software or that output quality will meet specific requirements.`,
  },
  {
    title: "6. Limitation of Liability",
    content: `To the maximum extent permitted by law, ImageToolkit and its operators shall not be liable for:

• Any loss of data or images during processing
• Any indirect, incidental, or consequential damages
• Any damages arising from use or inability to use the service
• Any loss of profits or business opportunities

Our total liability, if any, shall not exceed $0 (as we provide a free service).`,
  },
  {
    title: "7. Advertising",
    content: `ImageToolkit may display advertisements from third-party advertising networks including Google AdSense. These ads help fund the free service. Advertisers are responsible for the content of their advertisements.

We are not responsible for the content, accuracy, or privacy practices of linked third-party websites in advertisements.`,
  },
  {
    title: "8. Modifications to Service",
    content: `We reserve the right to modify, suspend, or discontinue any part of ImageToolkit at any time without notice. We may also update these Terms at any time.

Continued use of the service after changes constitutes acceptance of the updated Terms.`,
  },
  {
    title: "9. Governing Law",
    content: `These Terms are governed by applicable laws. Any disputes arising from use of ImageToolkit shall be resolved through good-faith negotiation before any formal legal proceedings.`,
  },
  {
    title: "10. Contact",
    content: `For questions about these Terms, please contact us at:\n\nEmail: hello@imagetoolkit.pro`,
  },
];

export default function TermsContent() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16">
      <div className="max-w-[760px] mx-auto">
        {/* Intro */}
        <div className="py-5 px-6 bg-indigo-500/7 border border-indigo-500/15 rounded-2xl mb-10">
          <p className="text-[#94a3b8] text-[0.925rem] leading-relaxed">
            Please read these Terms of Service (&quot;Terms&quot;) carefully before using ImageToolkit (&quot;Service&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By accessing or using our service, you agree to be bound by these Terms.
          </p>
        </div>

        {termsSections.map((section, i) => (
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
