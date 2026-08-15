import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Zap, ArrowRight, BookOpen, Tag, Globe, CheckCircle2 } from "lucide-react";
import Container from "@/components/Container";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/blog";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);
  if (!post || post.frontmatter.status === "Draft") return {};
  return constructMetadata({
    title: `${post.frontmatter.title} | ConvertGalaxy Blog`,
    description: post.frontmatter.description,
    canonicalPath: `/blog/${resolvedParams.slug}`,
    ogImage: `https://www.convertgalaxy.com${post.frontmatter.image || "/og-image.webp"}`,
    ogType: "article",
    keywords: post.frontmatter.focusKeyword ? [post.frontmatter.focusKeyword] : ["image guide"],
  });
}

const getToolName = (slug) => {
  const map = {
    "heic-to-jpg": "HEIC to JPG Converter",
    "jpg-to-png": "JPG to PNG Converter",
    "png-to-jpg": "PNG to JPG Converter",
    "webp-converter": "WebP Converter",
    "webp-to-jpg": "WebP to JPG Converter",
    "image-compressor": "Image Compressor",
    "image-resizer": "Image Resizer",
    "crop-image": "Crop Image Tool",
    "image-to-pdf": "Image to PDF",
    "pdf-to-image": "PDF to Image",
  };
  return map[slug] || "Image Converter";
};

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post || post.frontmatter.status === "Draft") notFound();

  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.frontmatter.status !== "Draft")
    .slice(0, 3);

  const toolName = post.frontmatter.relatedToolSlug ? getToolName(post.frontmatter.relatedToolSlug) : null;
  const toolUrl = post.frontmatter.relatedToolSlug ? `/tools/${post.frontmatter.relatedToolSlug}` : null;

  const tagList = post.frontmatter.tags
    ? post.frontmatter.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO
        type="blogpost"
        post={{
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          url: `https://www.convertgalaxy.com/blog/${post.slug}`,
          datePublished: post.frontmatter.date,
          image: post.frontmatter.image ? `https://www.convertgalaxy.com${post.frontmatter.image}` : undefined,
          authorName: post.frontmatter.author,
        }}
      />

      <Container>
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-indigo-400 no-underline text-sm mb-8 transition-colors duration-200 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="max-w-[820px] mx-auto text-left mb-6 sm:mb-10">
          <span className="inline-block py-1 px-3 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-3 sm:mb-4">
            Guide
          </span>
          <h1 className="font-['Outfit'] font-black text-[clamp(1.65rem,4.2vw,3rem)] leading-[1.2] tracking-tight text-[#f8fafc] mb-4 sm:mb-6">
            {post.frontmatter.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-[#cbd5e1] border-y border-white/6 py-3 sm:py-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-400 shrink-0" />
              {post.frontmatter.date}
            </div>
            <a
              href="#author-box"
              className="flex items-center gap-1.5 text-[#cbd5e1] hover:text-indigo-300 transition-colors duration-200 no-underline cursor-pointer group"
              title="Jump to Author Bio"
            >
              <User size={14} className="text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="hover:underline underline-offset-4 decoration-indigo-400 font-medium">
                {post.frontmatter.author || "ConvertGalaxy Team"}
              </span>
            </a>
          </div>
        </header>

        {/* Featured Image */}
        {post.frontmatter.image && (
          <div className="max-w-[850px] mx-auto mb-8 sm:mb-12 rounded-2xl sm:rounded-[28px] overflow-hidden border border-white/8 bg-black/40 shadow-2xl relative aspect-[16/9] w-full">
            <Image
              src={post.frontmatter.image}
              alt={post.frontmatter.imageAlt || post.frontmatter.title}
              fill
              className="object-cover"
              sizes="(max-width: 850px) 100vw, 850px"
              priority
            />
          </div>
        )}

        {/* Main Article Body */}
        <article className="max-w-[780px] mx-auto text-left px-1 sm:px-0">
          <div
            className="prose prose-invert prose-indigo max-w-none text-left"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />

          {/* CTA Banner */}
          {toolName && toolUrl && (
            <div className="mt-16 p-8 bg-gradient-to-br from-indigo-500/12 to-cyan-500/6 border border-indigo-500/20 rounded-3xl relative overflow-hidden shadow-lg">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="font-['Outfit'] font-bold text-xl text-[#f8fafc] mb-2 flex items-center gap-2">
                    <Zap className="text-indigo-400" size={20} />
                    Try Our Free Tool
                  </h3>
                  <p className="text-[#cbd5e1] text-sm max-w-[480px] leading-relaxed">
                    Optimize, crop, convert, or compress your files locally inside your browser sandbox. 100% private processing.
                  </p>
                </div>
                <Link href={toolUrl} className="no-underline shrink-0">
                  <button className="py-3 px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all">
                    Open {toolName}
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Tags Row */}
          {tagList.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <Tag size={14} className="text-[#6b6b7a] shrink-0" />
              {tagList.map((tag, i) => (
                <span
                  key={i}
                  className="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 border border-indigo-500/25 text-indigo-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Box */}
          <div id="author-box" className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121226]/90 via-[#0d0d1a]/95 to-[#171430]/90 border border-indigo-500/20 shadow-[0_12px_40px_rgba(15,15,30,0.7)] relative overflow-hidden group transition-all duration-300 hover:border-indigo-500/35 scroll-mt-28">
            {/* Ambient glowing background shapes */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-500" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/15 transition-all duration-500" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
              {/* Author Avatar with Gradient Ring */}
              <div className="relative shrink-0 mx-auto sm:mx-0">
                <div className="p-[2px] rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_20px_rgba(99,102,241,0.25)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all duration-300">
                  <div className="w-20 h-20 rounded-[14px] overflow-hidden bg-[#0d0d1a] relative">
                    <Image
                      src="/author.webp"
                      alt="Jatin Panchal - Author & Founder"
                      width={240}
                      height={240}
                      quality={95}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-indigo-500/30 transition-all duration-300" />
                </div>
                {/* Online status indicator dot */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#121226] shadow-sm flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping opacity-75" />
                </span>
              </div>

              {/* Bio & Details */}
              <div className="relative z-10 text-left flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 font-['Outfit'] flex items-center gap-1.5">
                    Written by
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    <CheckCircle2 size={11} /> Verified Creator
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                  <h4 className="font-['Outfit'] font-black text-xl text-white tracking-tight">
                    Jatin Panchal
                  </h4>
                  <span className="text-xs text-indigo-300/80 font-medium">
                    Founder & Developer @ ConvertGalaxy
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#9494a3] leading-relaxed max-w-[540px] mb-5 font-normal">
                  I&apos;m a web developer and the founder of Convertgalaxy.com, dedicated to clean code and practical
                  problem-solving. I write hands-on tutorials derived directly from real-world projects, breaking down
                  complex topics into actionable insights. I share what I learn so other developers can learn faster
                  and grow together.
                </p>

                {/* Social Links Row */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
                  <span className="text-[11px] font-medium text-gray-400 mr-1">Connect:</span>
                  
                  {/* GitHub */}
                  <a
                    href="https://github.com/panchaljatin18"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub Profile"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#cbd5e1] text-xs font-medium hover:bg-[#24292e] hover:border-[#24292e] hover:text-white transition-all duration-200 hover:-translate-y-0.5 shadow-sm no-underline"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/jatinpanchal08/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn Profile"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#cbd5e1] text-xs font-medium hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-200 hover:-translate-y-0.5 shadow-sm no-underline"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href="https://x.com/Panchaljatin123"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="X / Twitter Profile"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#cbd5e1] text-xs font-medium hover:bg-black hover:border-black hover:text-white transition-all duration-200 hover:-translate-y-0.5 shadow-sm no-underline"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>X / Twitter</span>
                  </a>

                  {/* Website */}
                  <a
                    href="https://convertgalaxy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Website"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#cbd5e1] text-xs font-medium hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all duration-200 hover:-translate-y-0.5 shadow-sm no-underline"
                  >
                    <Globe size={14} />
                    <span>Website</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="max-w-[760px] mx-auto mt-20">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen size={20} className="text-indigo-400 shrink-0" />
              <h2 className="font-['Outfit'] font-extrabold text-xl text-white">Related Articles</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map((rp) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="no-underline group">
                  <div className="h-full flex flex-col rounded-2xl border border-white/8 bg-[#0f0f1c] overflow-hidden hover:border-indigo-500/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.12)] transition-all duration-300">
                    {rp.frontmatter.image ? (
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <Image
                          src={rp.frontmatter.image}
                          alt={rp.frontmatter.imageAlt || rp.frontmatter.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1c]/70 to-transparent" />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] w-full bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 flex items-center justify-center">
                        <BookOpen size={32} className="text-indigo-400/40" />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-4 gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b7a]">
                        <Calendar size={11} />
                        {rp.frontmatter.date}
                      </div>
                      <h3 className="font-['Outfit'] font-bold text-sm text-[#f8fafc] leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {rp.frontmatter.title}
                      </h3>
                      {rp.frontmatter.description && (
                        <p className="text-[12px] text-[#9494a3] leading-relaxed line-clamp-2 flex-1">
                          {rp.frontmatter.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-indigo-400 text-xs font-semibold group-hover:gap-2 transition-all duration-200 mt-auto pt-2">
                        Read Article
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
