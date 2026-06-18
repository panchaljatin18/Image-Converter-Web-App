import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

const posts = [
  {
    slug: "jpg-vs-png-when-to-use",
    title: "JPG vs PNG: Which Format Should You Use and When?",
    excerpt:
      "Understanding the difference between JPG and PNG can dramatically improve your website's performance and image quality. We break down everything you need to know.",
    category: "Formats",
    readTime: "5 min read",
    date: "June 10, 2025",
    emoji: "🖼️",
    color: "#6366f1",
  },
  {
    slug: "webp-the-future-of-web-images",
    title: "WebP: Why Google's Image Format Is the Future of the Web",
    excerpt:
      "WebP images are 26% smaller than PNGs and 25-34% smaller than JPEGs. Learn why you should convert your website images to WebP today.",
    category: "Optimization",
    readTime: "7 min read",
    date: "June 5, 2025",
    emoji: "⚡",
    color: "#f59e0b",
  },
  {
    slug: "compress-images-without-losing-quality",
    title: "How to Compress Images Without Losing Quality: The Complete Guide",
    excerpt:
      "Image compression is one of the easiest wins for website performance. This guide explains lossy vs lossless compression and the best settings for every use case.",
    category: "Compression",
    readTime: "8 min read",
    date: "May 28, 2025",
    emoji: "🗜️",
    color: "#10b981",
  },
  {
    slug: "image-size-guide-social-media",
    title: "The Ultimate Social Media Image Size Guide for 2025",
    excerpt:
      "Instagram, Facebook, Twitter, LinkedIn — every platform has different image dimension requirements. This updated guide covers them all.",
    category: "Social Media",
    readTime: "6 min read",
    date: "May 20, 2025",
    emoji: "📱",
    color: "#ec4899",
  },
  {
    slug: "image-to-pdf-guide",
    title: "How to Combine Multiple Images Into One PDF: Step-by-Step Guide",
    excerpt:
      "Need to send multiple images as a single document? Learn how to combine JPG, PNG, and WebP images into a professional PDF without any software.",
    category: "PDF",
    readTime: "4 min read",
    date: "May 12, 2025",
    emoji: "📄",
    color: "#f97316",
  },
  {
    slug: "core-web-vitals-image-optimization",
    title: "Optimizing Images for Core Web Vitals: LCP, CLS, and FID",
    excerpt:
      "Images are often the largest elements on a webpage. Poorly optimized images hurt your Google Core Web Vitals scores. Here's how to fix it.",
    category: "SEO & Performance",
    readTime: "10 min read",
    date: "May 3, 2025",
    emoji: "🚀",
    color: "#8b5cf6",
  },
];

export default function BlogGrid() {
  const [featured, ...rest] = posts;

  return (
    <div className="container" style={{ padding: "64px 24px" }}>
      {/* Featured Post */}
      <div
        style={{
          padding: "40px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,182,212,0.05) 100%)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "24px",
          marginBottom: "48px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "32px",
          alignItems: "center",
        }}
        className="featured-post"
      >
        <div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
            <span className="tag">Featured</span>
            <span className="tag cyan">{featured.category}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={12} /> {featured.readTime}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px" }}>
              <Calendar size={12} /> {featured.date}
            </span>
          </div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.3rem, 3vw, 2rem)", lineHeight: 1.3, marginBottom: "14px" }}>
            {featured.title}
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "24px", fontSize: "1rem" }}>
            {featured.excerpt}
          </p>
          <Link href={`/blog/${featured.slug}`} className="btn btn-primary">
            Read Article
            <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ fontSize: "6rem", opacity: 0.8 }} className="featured-emoji">
          {featured.emoji}
        </div>
      </div>

      {/* Post Grid */}
      <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.25rem", marginBottom: "24px" }}>
        Latest Articles
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
            <article className="blog-card">
              <div
                className="blog-card-img"
                style={{ background: `linear-gradient(135deg, ${post.color}20, ${post.color}08)` }}
              >
                {post.emoji}
              </div>
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "100px",
                      background: `${post.color}18`,
                      color: post.color,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      border: `1px solid ${post.color}30`,
                    }}
                  >
                    {post.category}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={11} /> {post.readTime}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={11} /> {post.date}
                  </span>
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: post.color, fontSize: "0.85rem", fontWeight: 600 }}>
                  Read More <ArrowRight size={14} />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
