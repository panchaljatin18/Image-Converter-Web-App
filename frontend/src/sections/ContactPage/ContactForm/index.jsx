"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import Button from "@/components/Button";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate submission
    await new Promise((res) => setTimeout(res, 1500));
    setSending(false);
    setSubmitted(true);
  };

  const subjects = [
    "General Question",
    "Bug Report",
    "Feature Request",
    "Business Inquiry",
    "Privacy / Data",
    "Other",
  ];

  if (submitted) {
    return (
      <div className="text-center p-[60px_40px] bg-emerald-500/8 border border-emerald-500/20 rounded-3xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>
        <h3 className="font-['Outfit'] font-bold text-2xl mb-3 text-emerald-400">
          Message Sent!
        </h3>
        <p className="text-[#94a3b8] leading-relaxed max-w-[380px] mx-auto mb-6">
          Thanks for reaching out, <strong className="text-[#f8fafc]">{form.name}</strong>! We&apos;ll get back to you at {form.email} within 24 hours.
        </p>
        <Button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} variant="secondary">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide" htmlFor="contact-name">Full Name *</label>
          <input id="contact-name" className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-[#f8fafc] text-[0.95rem] font-['Inter'] outline-none transition-all duration-250 placeholder:text-[#64748b] focus:border-[#6366f1] focus:bg-indigo-500/5 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide" htmlFor="contact-email">Email Address *</label>
          <input id="contact-email" className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-[#f8fafc] text-[0.95rem] font-['Inter'] outline-none transition-all duration-250 placeholder:text-[#64748b] focus:border-[#6366f1] focus:bg-indigo-500/5 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-5">
        <label className="text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide" htmlFor="contact-subject">Subject *</label>
        <select id="contact-subject" className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-[#f8fafc] text-[0.95rem] font-['Inter'] outline-none transition-all duration-250 focus:border-[#6366f1] focus:bg-indigo-500/5 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] cursor-pointer appearance-none" name="subject" value={form.subject} onChange={handleChange} required>
          <option value="" className="bg-[#121221]">Select a subject...</option>
          {subjects.map((s) => <option key={s} value={s} className="bg-[#121221]">{s}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2 mb-5">
        <label className="text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide" htmlFor="contact-message">Message *</label>
        <textarea id="contact-message" className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-[#f8fafc] text-[0.95rem] font-['Inter'] outline-none transition-all duration-250 placeholder:text-[#64748b] focus:border-[#6366f1] focus:bg-indigo-500/5 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] min-h-[140px] resize-y" name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help you..." required />
      </div>

      <Button type="submit" disabled={sending || !form.name || !form.email || !form.subject || !form.message} variant="primary" size="lg" className="w-full justify-center">
        {sending ? (
          <><Send size={18} className="animate-spin" /> Sending...</>
        ) : (
          <><Send size={18} /> Send Message</>
        )}
      </Button>
    </form>
  );
}
