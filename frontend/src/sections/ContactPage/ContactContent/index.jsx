import React from "react";
import ContactForm from "../ContactForm";
import { Mail, Clock, MessageCircle } from "lucide-react";
import Container from "@/components/Container";

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
  { icon: <Mail size={20} />, label: "Email", value: "hello@convertgalaxy.com", href: "mailto:hello@convertgalaxy.com", title: "Email ConvertGalaxy support", color: "#6366f1" },
  { icon: <TwitterIcon size={20} />, label: "Twitter", value: "@convertgalaxy", href: "https://twitter.com", title: "Follow ConvertGalaxy on Twitter/X", color: "#06b6d4" },
  { icon: <Clock size={20} />, label: "Response Time", value: "Within 24 hours", href: null, color: "#10b981" },
  { icon: <MessageCircle size={20} />, label: "Support Hours", value: "Mon – Fri, 9am – 6pm IST", href: null, color: "#f59e0b" },
];

export default function ContactContent() {
  return (
    <Container className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-12 items-start">
        {/* Info Column */}
        <div>
          <h2 className="font-['Outfit'] font-bold text-[1.4rem] mb-2 text-[#f8fafc]">
            Contact Information
          </h2>
          <p className="text-[#94a3b8] text-[0.9rem] leading-relaxed mb-8">
            Choose your preferred way to reach us. We typically respond within one business day.
          </p>

          <div className="flex flex-col gap-3.5 mb-9">
            {contactInfo.map((item, i) => (
              <div key={i} className="flex items-center gap-3.5 p-4 bg-[#1a1a2e] border border-white/8 rounded-2xl">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
                  style={{ 
                    background: `${item.color}18`, 
                    borderColor: `${item.color}30`, 
                    color: item.color 
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-[0.75rem] text-[#64748b] font-semibold uppercase tracking-wider mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a 
                      href={item.href} 
                      target={item.href.startsWith("http") ? "_blank" : undefined} 
                      rel="noopener noreferrer" 
                      title={item.title}
                      className="text-[0.9rem] font-semibold text-[#f8fafc] no-underline hover:text-[#818cf8] transition-colors duration-200"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-[0.9rem] font-semibold text-[#f8fafc]">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Privacy note */}
          <div className="p-4 bg-indigo-500/7 border border-indigo-500/15 rounded-xl">
            <p className="text-[0.8rem] text-[#64748b] leading-relaxed">
              🔒 <strong className="text-[#818cf8]">Your privacy matters.</strong> We only use your contact information to respond to your message. We never share your data with third parties.
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="p-9 bg-[#1a1a2e] border border-white/8 rounded-3xl">
          <h2 className="font-['Outfit'] font-bold text-[1.25rem] mb-1 text-[#f8fafc]">
            Send a Message
          </h2>
          <p className="text-[#64748b] text-[0.875rem] mb-7">
            Fill in the form and we&apos;ll get back to you within 24 hours.
          </p>
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
