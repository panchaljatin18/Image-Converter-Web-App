"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Image as ImageIcon,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import Container from "./Container";

const TwitterIcon = ({ size = 16, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const GithubIcon = ({ size = 16, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const footerTools = [
  { name: "JPG to PNG", href: "/tools/jpg-to-png" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg" },
  { name: "WebP Converter", href: "/tools/webp-converter" },
  { name: "Image Compressor", href: "/tools/image-compressor" },
  { name: "Image Resizer", href: "/tools/image-resizer" },
  { name: "Crop Image", href: "/tools/crop-image" },
  { name: "Image to PDF", href: "/tools/image-to-pdf" },
  { name: "PDF to Image", href: "/tools/pdf-to-image" },
];

const footerCompany = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "All Tools", href: "/tools" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

const footerLegal = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/privacy#cookies" },
  { name: "Disclaimer", href: "/disclaimer" },
];

const authRoutes = new Set(["/login", "/forgot-password", "/reset-password"]);

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (authRoutes.has(pathname)) {
    return null;
  }

  return (
    <footer className="bg-[#0d0d16]/98 border-t border-indigo-500/12 pt-8">
      <Container>
        {/* Top Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-6 pb-16">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 md:-mt-2">
            <Link href="/" className="flex items-center shrink-0 no-underline mb-4">
              <img
                src="/CG.png"
                alt="Converter Galaxy Logo"
                className="h-[65px] md:h-[85px] w-auto object-contain"
              />
            </Link>
            <p className="text-[#64748b] text-[0.9rem] leading-[1.7] mb-6 max-w-[280px]">
              Free, fast, and secure online image tools. Convert, compress,
              resize, and transform your images — entirely in your browser with
              zero data uploads.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-2.5 mb-6">
              <a
                href="mailto:hello@convertergalaxy.com"
                className="flex items-center gap-2 text-[#64748b] no-underline text-[0.85rem] transition-colors duration-200 hover:text-[#818cf8]"
              >
                <Mail size={14} />
                hello@convertergalaxy.com
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-2.5">
              {[
                { icon: <TwitterIcon size={16} />, href: "https://twitter.com", label: "Twitter" },
                { icon: <GithubIcon size={16} />, href: "https://github.com", label: "GitHub" },
                { icon: <LinkedinIcon size={16} />, href: "https://linkedin.com", label: "LinkedIn" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-[9px] bg-white/6 border border-white/8 flex items-center justify-center text-[#64748b] no-underline transition-all duration-200 hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-[#818cf8]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Tools Column */}
          <div className="col-span-1">
            <h3 className="font-['Outfit'] font-bold text-[1rem] text-[#f8fafc] mb-5 tracking-tight">
              Tools
            </h3>
            <nav className="flex flex-col">
              {footerTools.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-[#64748b] text-[0.9rem] no-underline mb-3 transition-all duration-200 hover:text-[#818cf8] hover:translate-x-1"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company Column */}
          <div className="col-span-1">
            <h3 className="font-['Outfit'] font-bold text-[1rem] text-[#f8fafc] mb-5 tracking-tight">
              Company
            </h3>
            <nav className="flex flex-col">
              {footerCompany.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-[#64748b] text-[0.9rem] no-underline mb-3 transition-all duration-200 hover:text-[#818cf8] hover:translate-x-1"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Column */}
          <div className="col-span-2 sm:col-span-1 grid grid-cols-2 sm:grid-cols-1 gap-6 sm:gap-0">
            <div>
              <h3 className="font-['Outfit'] font-bold text-[1rem] text-[#f8fafc] mb-5 tracking-tight">
                Legal
              </h3>
              <nav className="flex flex-col">
                {footerLegal.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center text-[#64748b] text-[0.9rem] no-underline mb-3 transition-all duration-200 hover:text-[#818cf8] hover:translate-x-1"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Trust Badges */}
            <div className="mt-0 sm:mt-7 bg-indigo-500/8 border border-indigo-500/15 rounded-xl p-4 self-start">
              <p className="text-[0.75rem] text-[#818cf8] font-semibold mb-1.5">
                🔒 100% Secure
              </p>
              <p className="text-[0.75rem] text-[#64748b] leading-[1.5]">
                All processing happens in your browser. We never store or
                upload your images.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

        {/* Bottom Bar */}
        <div className="flex items-center justify-between py-6 gap-4 flex-wrap">
          <p className="text-[#64748b] text-[0.85rem]">
            © {currentYear} Converter Galaxy. All rights reserved.
          </p>
          <p className="text-[#64748b] text-[0.85rem]">
            Made with ❤️ for creators worldwide
          </p>
          <div className="flex gap-5">
            {footerLegal.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#64748b] text-[0.825rem] no-underline transition-colors duration-200 hover:text-[#818cf8]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
