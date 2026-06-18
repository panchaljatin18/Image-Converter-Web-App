"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Image,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
} from "lucide-react";

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
  { name: "All Tools", href: "/tools" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

const footerLegal = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/privacy#cookies" },
  { name: "GDPR", href: "/privacy#gdpr" },
];

const authRoutes = new Set(["/login", "/forgot-password", "/reset-password"]);

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (authRoutes.has(pathname)) {
    return null;
  }

  return (
    <footer
      style={{
        background: "rgba(13, 13, 22, 0.98)",
        borderTop: "1px solid rgba(99, 102, 241, 0.12)",
        paddingTop: "72px",
      }}
    >
      <div className="container">
        {/* Top Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: "48px",
            paddingBottom: "64px",
          }}
          className="footer-grid"
        >
          {/* Brand Column */}
          <div>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                }}
              >
                <Image color="white" size={20} />
              </div>
              <span
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  background: "linear-gradient(135deg, #a5b4fc, #67e8f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ImageToolkit
              </span>
            </Link>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                marginBottom: "24px",
                maxWidth: "280px",
              }}
            >
              Free, fast, and secure online image tools. Convert, compress,
              resize, and transform your images — entirely in your browser with
              zero data uploads.
            </p>

            {/* Contact Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              <a
                href="mailto:hello@imagetoolkit.pro"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <Mail size={14} />
                hello@imagetoolkit.pro
              </a>
            </div>

            {/* Social Links */}
            <div style={{ display: "flex", gap: "10px" }}>
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
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.2)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
                    e.currentTarget.style.color = "var(--primary-light)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h3
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
                marginBottom: "20px",
                letterSpacing: "-0.01em",
              }}
            >
              Tools
            </h3>
            <nav>
              {footerTools.map((item) => (
                <Link key={item.href} href={item.href} className="footer-link">
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company Column */}
          <div>
            <h3
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
                marginBottom: "20px",
                letterSpacing: "-0.01em",
              }}
            >
              Company
            </h3>
            <nav>
              {footerCompany.map((item) => (
                <Link key={item.href} href={item.href} className="footer-link">
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Column */}
          <div>
            <h3
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
                marginBottom: "20px",
                letterSpacing: "-0.01em",
              }}
            >
              Legal
            </h3>
            <nav>
              {footerLegal.map((item) => (
                <Link key={item.href} href={item.href} className="footer-link">
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Trust Badges */}
            <div
              style={{
                marginTop: "28px",
                padding: "16px",
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: "12px",
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--primary-light)",
                  fontWeight: 600,
                  marginBottom: "6px",
                }}
              >
                🔒 100% Secure
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                All processing happens in your browser. We never store or
                upload your images.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="gradient-divider" />

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 0",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            © {currentYear} ImageToolkit. All rights reserved.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Made with ❤️ for creators worldwide
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {footerLegal.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.825rem",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>


    </footer>
  );
}
