import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Zap, ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/blog";

export const dynamicParams = true;
export const revalidate = 0;

// Static params generation for SSG
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Dynamic metadata generation
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);
  if (!post || post.frontmatter.status === "Draft") return {};

  return constructMetadata({
    title: `${post.frontmatter.title} | ConvertGalaxy Blog`,
    description: post.frontmatter.description,
    canonicalPath: `/blog/${post.slug}`,
    ogImage: `https://www.convertgalaxy.com${post.frontmatter.image || "/og-image.png"}`,
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

  if (!post || post.frontmatter.status === "Draft") {
    notFound();
  }

  const toolName = post.frontmatter.relatedToolSlug ? getToolName(post.frontmatter.relatedToolSlug) : null;
  const toolUrl = post.frontmatter.relatedToolSlug ? `/tools/${post.frontmatter.relatedToolSlug}` : null;

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
        <header className="max-w-[800px] mx-auto text-left mb-10">
          <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-4">
            Guide
          </span>
          <h1 className="font-['Outfit'] font-black text-3xl md:text-5xl text-[#f8fafc] leading-tight tracking-tight mb-6">
            {post.frontmatter.title}
          </h1>

          <div className="flex items-center gap-5 text-sm text-[#cbd5e1] border-y border-white/6 py-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={15} className="text-indigo-400" />
              {post.frontmatter.date}
            </div>
            <div className="flex items-center gap-1.5">
              <User size={15} className="text-indigo-400" />
              {post.frontmatter.author || "ConvertGalaxy Team"}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.frontmatter.image && (
          <div className="max-w-[850px] mx-auto mb-12 rounded-[28px] overflow-hidden border border-white/8 bg-black/40 shadow-2xl relative aspect-[16/9]">
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
        <article className="max-w-[760px] mx-auto text-left">
          <div
            className="prose prose-invert prose-indigo max-w-none text-left"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />

          {/* CTA Banner Section */}
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
        </article>
      </Container>
    </div>
  );
}
