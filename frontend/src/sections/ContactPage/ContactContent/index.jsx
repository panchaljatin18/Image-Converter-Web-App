import React from "react";
import ContactForm from "../ContactForm";
import { Mail, Clock, MessageCircle } from "lucide-react";

const TwitterIcon = ({ size = 20, className }) => (
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

const contactInfo = [
  { icon: <Mail size={20} />, label: "Email", value: "hello@imagetoolkit.pro", href: "mailto:hello@imagetoolkit.pro", color: "#6366f1" },
  { icon: <TwitterIcon size={20} />, label: "Twitter", value: "@imagetoolkit", href: "https://twitter.com", color: "#06b6d4" },
  { icon: <Clock size={20} />, label: "Response Time", value: "Within 24 hours", href: null, color: "#10b981" },
  { icon: <MessageCircle size={20} />, label: "Support Hours", value: "Mon – Fri, 9am – 6pm IST", href: null, color: "#f59e0b" },
];

export default function ContactContent() {
  return (
    <div className="container" style={{ padding: "64px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "48px", alignItems: "start" }} className="contact-grid">
        {/* Info Column */}
        <div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.4rem", marginBottom: "8px" }}>
            Contact Information
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "32px" }}>
            Choose your preferred way to reach us. We typically respond within one business day.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "36px" }}>
            {contactInfo.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${item.color}18`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", textDecoration: "none" }}>
                      {item.value}
                    </a>
                  ) : (
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Privacy note */}
          <div style={{ padding: "16px 18px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "12px" }}>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              🔒 <strong style={{ color: "var(--primary-light)" }}>Your privacy matters.</strong> We only use your contact information to respond to your message. We never share your data with third parties.
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div style={{ padding: "36px", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "24px" }}>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.25rem", marginBottom: "4px" }}>
            Send a Message
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "28px" }}>
            Fill in the form and we&apos;ll get back to you within 24 hours.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
