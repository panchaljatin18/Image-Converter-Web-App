import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";

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
    <Container className="py-16">
      {/* Featured Post */}
      <div className="p-10 bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 border border-indigo-500/20 rounded-3xl mb-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <div className="flex gap-2.5 mb-4 flex-wrap">
            <span className="inline-flex items-center py-1 px-2.5 rounded-full text-[0.75rem] font-semibold bg-indigo-500/12 text-[#818cf8] border border-indigo-500/25">Featured</span>
            <span className="inline-flex items-center py-1 px-2.5 rounded-full text-[0.75rem] font-semibold bg-cyan-500/12 text-cyan-300 border border-cyan-500/25">{featured.category}</span>
            <span className="text-[#64748b] text-[0.8rem] flex items-center gap-1">
              <Clock size={12} /> {featured.readTime}
            </span>
            <span className="text-[#64748b] text-[0.8rem] flex items-center gap-1">
              <Calendar size={12} /> {featured.date}
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-2xl md:text-3xl lg:text-4xl leading-tight mb-3.5 text-[#f8fafc]">
            {featured.title}
          </h2>
          <p className="text-[#94a3b8] leading-relaxed mb-6 text-base">
            {featured.excerpt}
          </p>
          <Link href={`/blog/${featured.slug}`} className="no-underline inline-block">
            <Button variant="primary">
              Read Article
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
        <div className="hidden md:block text-[6rem] opacity-80 select-none">
          {featured.emoji}
        </div>
      </div>

      {/* Post Grid */}
      <h2 className="font-['Outfit'] font-bold text-xl mb-6 text-[#f8fafc]">
        Latest Articles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="no-underline">
            <article className="bg-[#1a1a2e] border border-white/8 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col hover:border-indigo-500 hover:-translate-y-1 hover:shadow-[0_8px_48px_rgba(99,102,241,0.15)] group">
              <div
                className="w-full h-[200px] flex items-center justify-center text-[3rem]"
                style={{ background: `linear-gradient(135deg, ${post.color}20, ${post.color}08)` }}
              >
                {post.emoji}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3 text-[0.8rem] text-[#64748b]">
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
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {post.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {post.date}
                  </span>
                </div>
                <h3 className="text-[1.1rem] font-bold leading-snug mb-2.5 font-['Outfit'] text-[#f8fafc]">{post.title}</h3>
                <p className="text-[#94a3b8] text-[0.875rem] leading-relaxed flex-1 mb-4">{post.excerpt}</p>
                <div
                  className="flex items-center gap-1.5 text-[0.85rem] font-semibold"
                  style={{ color: post.color }}
                >
                  Read More
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </Container>
  );
}
