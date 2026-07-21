"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Image as ImageIcon,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import Container from "./Container";

const WhatsappIcon = ({ size = 16, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
  </svg>
);

const InstagramIcon = ({ size = 16, className }) => (
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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
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

const TelegramIcon = ({ size = 16, className }) => (
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
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const footerTools = [
  { name: "JPG to PNG", href: "/tools/jpg-to-png" },
  { name: "WebP to JPG", href: "/tools/webp-to-jpg" },
  { name: "Image Compressor", href: "/tools/image-compressor" },
  { name: "Crop Image", href: "/tools/crop-image" },
  { name: "Image to PDF", href: "/tools/image-to-pdf" },
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-6 pb-6">
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
                { icon: <WhatsappIcon size={16} />, href: "https://whatsapp.com/channel/0029Vb64sAs7oQhlwy2vJ41z", label: "WhatsApp" },
                { icon: <InstagramIcon size={16} />, href: "https://www.instagram.com/jobs_engineers/", label: "Instagram" },
                { icon: <LinkedinIcon size={16} />, href: "https://www.linkedin.com/in/job-for-iti/", label: "LinkedIn" },
                { icon: <TelegramIcon size={16} />, href: "https://t.me/jobforitiportalgroup", label: "Telegram" },
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
            Made by <Link href="https://jobforiti.com" className="text-[#818cf8] no-underline transition-colors duration-200 hover:text-[#f8fafc]">Jatin Panchal</Link>
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
