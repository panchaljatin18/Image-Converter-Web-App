import React from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";
import { getBlogPosts } from "@/lib/blog";
import { ArrowRight, BookOpen, CheckCircle2, Globe, Calendar, Code, ShieldCheck, Cpu } from "lucide-react";

export const metadata = constructMetadata({
  title: "Jatin Panchal - Founder, Lead Web Developer & Author | ConvertGalaxy",
  description: "Official author profile of Jatin Panchal, Founder and Lead Web Developer at ConvertGalaxy. Explore technical guides, image optimization tutorials, web performance insights, and browser tool architectures.",
  canonicalPath: "/author/jatin-panchal",
  ogImage: "https://www.convertgalaxy.com/author.webp",
  ogType: "profile",
  keywords: [
    "Jatin Panchal",
    "Jatin Panchal ConvertGalaxy",
    "Jatin Panchal Web Developer",
    "Jatin Panchal Founder",
    "Jatin Panchal Author",
    "ConvertGalaxy Founder",
    "Jatin Panchal Image Processing"
  ],
});

export default async function JatinPanchalAuthorPage() {
  const posts = await getBlogPosts(false);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <SEO type="author" />

      <Container>
        {/* Author Bio Header Card */}
        <div className="max-w-[880px] mx-auto mb-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#121226]/90 via-[#0d0d1a]/95 to-[#171430]/90 border border-indigo-500/25 shadow-[0_16px_50px_rgba(15,15,30,0.8)] relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-500/12 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Author Headshot Photo */}
            <div className="relative shrink-0">
              <div className="p-[3px] rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[22px] overflow-hidden bg-[#0d0d1a] relative">
                  <Image
                    src="/author.webp"
                    alt="Jatin Panchal - Founder & Lead Developer at ConvertGalaxy"
                    width={350}
                    height={350}
                    quality={95}
                    priority
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-emerald-500/90 text-emerald-950 font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-lg border border-white/20 flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified
              </span>
            </div>

            {/* Author Info & Bio */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-3">
                <Code size={13} className="text-indigo-400" />
                <span>Founder & Lead Full-Stack Developer</span>
              </div>

              <h1 className="font-['Outfit'] font-black text-3xl sm:text-4xl text-white tracking-tight mb-2">
                Jatin Panchal
              </h1>

              <p className="text-indigo-300/90 font-medium text-sm sm:text-base mb-4">
                Creator of ConvertGalaxy.com • Browser Tools & Web Performance Architect
              </p>

              <p className="text-[#cbd5e1] text-sm sm:text-[0.95rem] leading-relaxed mb-6 font-normal">
                Hi, I&apos;m <strong>Jatin Panchal</strong>. I am a web developer and founder of ConvertGalaxy.com, focused on building high-speed, local-first web applications. My mission is to make powerful file conversion, image optimization, and digital asset tools completely private, serverless, and accessible to everyone worldwide.
              </p>

              {/* Social Profiles Row (rel="me" for Google Identity Verification) */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a
                  href="https://github.com/panchaljatin18"
                  target="_blank"
                  rel="me authn noopener noreferrer"
                  title="Jatin Panchal GitHub Profile"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#e2e8f0] text-xs font-semibold hover:bg-[#24292e] hover:border-[#24292e] hover:text-white transition-all duration-200 shadow-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/jatinpanchal08/"
                  target="_blank"
                  rel="me authn noopener noreferrer"
                  title="Jatin Panchal LinkedIn Profile"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#e2e8f0] text-xs font-semibold hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-200 shadow-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>

                <a
                  href="https://x.com/Panchaljatin123"
                  target="_blank"
                  rel="me authn noopener noreferrer"
                  title="Jatin Panchal Twitter X Profile"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#e2e8f0] text-xs font-semibold hover:bg-black hover:border-black hover:text-white transition-all duration-200 shadow-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>Twitter / X</span>
                </a>

                <a
                  href="https://convertgalaxy.com"
                  target="_blank"
                  rel="me noopener noreferrer"
                  title="ConvertGalaxy Website"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#e2e8f0] text-xs font-semibold hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all duration-200 shadow-sm"
                >
                  <Globe size={15} />
                  <span>ConvertGalaxy</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Expertise & Technical Highlights */}
        <div className="max-w-[880px] mx-auto mb-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[#121226]/60 border border-white/8 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-4">
              <Code size={20} />
            </div>
            <h3 className="font-['Outfit'] font-bold text-base text-white mb-2">Web Engineering</h3>
            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              Specialized in Next.js, React, WebAssembly, and client-side canvas rendering logic.
            </p>
          </div>

          <div className="p-6 bg-[#121226]/60 border border-white/8 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-['Outfit'] font-bold text-base text-white mb-2">Privacy Architect</h3>
            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              Designing zero-server file processing models that keep 100% of user data isolated inside local browser sandboxes.
            </p>
          </div>

          <div className="p-6 bg-[#121226]/60 border border-white/8 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4">
              <Cpu size={20} />
            </div>
            <h3 className="font-['Outfit'] font-bold text-base text-white mb-2">Core Web Vitals</h3>
            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              Optimizing image compression algorithms, WebP/AVIF formats, and site speed for peak SEO rankings.
            </p>
          </div>
        </div>

        {/* Articles Authored by Jatin Panchal */}
        <div className="max-w-[880px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen size={22} className="text-indigo-400 shrink-0" />
            <h2 className="font-['Outfit'] font-extrabold text-2xl text-white">
              Articles & Guides Authored by Jatin Panchal
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="no-underline group">
                <div className="h-full flex flex-col rounded-3xl border border-white/8 bg-[#131325]/80 overflow-hidden hover:border-indigo-500/40 hover:shadow-[0_10px_30px_rgba(99,102,241,0.12)] transition-all duration-300">
                  {post.frontmatter.image ? (
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/6 bg-gradient-to-br from-[#121226] via-[#0d0d1a] to-[#181532] flex items-center justify-center">
                      <Image
                        src={post.frontmatter.image}
                        alt={post.frontmatter.imageAlt || post.frontmatter.title}
                        fill
                        unoptimized
                        priority={index < 2}
                        loading={index < 2 ? "eager" : "lazy"}
                        decoding="async"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full bg-indigo-500/10 flex items-center justify-center">
                      <BookOpen size={36} className="text-indigo-400/40" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-[#94a3b8] font-semibold uppercase tracking-wider mb-2">
                      <Calendar size={13} className="text-indigo-400" />
                      {post.frontmatter.date} • Jatin Panchal
                    </div>
                    <h3 className="font-['Outfit'] font-bold text-lg text-white group-hover:text-indigo-300 transition-colors mb-3 line-clamp-2">
                      {post.frontmatter.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed line-clamp-3 mb-6 flex-1">
                      {post.frontmatter.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold group-hover:gap-2.5 transition-all mt-auto">
                      Read Guide
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
