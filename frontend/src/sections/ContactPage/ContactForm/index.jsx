"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, MapPin, Clock, MessageCircle } from "lucide-react";

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
      <div style={{ textAlign: "center", padding: "60px 40px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "24px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <CheckCircle size={32} color="#34d399" />
        </div>
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.5rem", marginBottom: "12px", color: "#34d399" }}>
          Message Sent!
        </h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "380px", margin: "0 auto 24px" }}>
          Thanks for reaching out, <strong style={{ color: "var(--text-primary)" }}>{form.name}</strong>! We&apos;ll get back to you at {form.email} within 24 hours.
        </p>
        <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="btn btn-secondary">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="form-grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="contact-name">Full Name *</label>
          <input id="contact-name" className="form-input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="contact-email">Email Address *</label>
          <input id="contact-email" className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-subject">Subject *</label>
        <select id="contact-subject" className="form-input" name="subject" value={form.subject} onChange={handleChange} required style={{ cursor: "pointer", appearance: "none" }}>
          <option value="">Select a subject...</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-message">Message *</label>
        <textarea id="contact-message" className="form-input" name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help you..." required style={{ minHeight: "140px" }} />
      </div>

      <button type="submit" disabled={sending || !form.name || !form.email || !form.subject || !form.message} className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>
        {sending ? (
          <><Send size={18} style={{ animation: "spin 1s linear infinite" }} /> Sending...</>
        ) : (
          <><Send size={18} /> Send Message</>
        )}
      </button>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>
    </form>
  );
}
