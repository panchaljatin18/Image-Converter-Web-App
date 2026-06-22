import React from "react";

const disclaimerSections = [
  {
    title: "1. Information and General Purpose Only",
    content: `The information, utilities, and image conversion tools provided on ImageToolkit are for general information and usage purposes only. 

We make every effort to ensure the accuracy, completeness, and reliability of the software tools offered, but all services, functions, and content are provided "as is" and "as available" without warranties of any kind.`,
  },
  {
    title: "2. Browser-Only (Local) Processing",
    content: `ImageToolkit processes all files locally inside your web browser using modern browser APIs. No file uploads or user data are stored on our servers. 

While this maximizes security, users are solely responsible for ensuring they have backup copies of any files before processing them. ImageToolkit cannot be held liable for any accidental loss, deletion, corruption, or degradation of files during processing or download.`,
  },
  {
    title: "3. Third-Party Content and Advertisements",
    content: `ImageToolkit may display ads from third-party networks (like Google AdSense) or contain links to external sites that are not controlled or owned by us. 

We do not guarantee the completeness, relevance, safety, or accuracy of information on these external platforms. Inclusion of advertisements or outbound links does not imply endorsement of the products, viewpoints, or sites.`,
  },
  {
    title: "4. No Liability",
    content: `In no event shall ImageToolkit, its founders, operators, or affiliates be held liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to:

• Loss of data, files, or images
• System downtime or browser crashes
• Business interruptions or loss of profits
• Any other technical issues arising from your use of the website or tools.

Your use of ImageToolkit is entirely at your own risk.`,
  },
  {
    title: "5. Intellectual Property Rights",
    content: `Users are solely responsible for the legal rights and intellectual property permissions of the files they convert or compress using ImageToolkit. You must not use our service to process copyrighted materials for which you do not possess valid distribution, modification, or usage rights.`,
  },
];

export default function DisclaimerContent() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16">
      <div className="max-w-[760px] mx-auto">
        
        {/* TL;DR */}
        <div className="py-6 px-7 bg-amber-500/8 border border-amber-500/20 rounded-2xl mb-12">
          <h2 className="font-['Outfit'] font-bold text-[1.1rem] text-amber-400 mb-2.5">
            Key Disclaimer Point
          </h2>
          <p className="text-[#94a3b8] text-[0.925rem] leading-relaxed">
            ImageToolkit is provided "as is" without warranty. All processing occurs locally in your browser, meaning we do not access or store your files. You are solely responsible for maintaining backups and ensuring you have the legal right to process your files.
          </p>
        </div>

        {disclaimerSections.map((section, i) => (
          <div key={i} className="mb-10">
            <h2 className="font-['Outfit'] font-bold text-[1.2rem] text-[#f8fafc] mb-3.5 pb-2.5 border-b border-white/8">
              {section.title}
            </h2>
            <p className="text-[#94a3b8] text-[0.925rem] leading-loose whitespace-pre-line">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
