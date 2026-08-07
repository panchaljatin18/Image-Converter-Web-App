import { Suspense } from "react";
import BlogHeader from "@/sections/BlogPage/BlogHeader";
import BlogGrid from "@/sections/BlogPage/BlogGrid";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";
import { getBlogPosts } from "@/lib/blog";

export const revalidate = 60;

export const metadata = constructMetadata({
  title: "Image Conversion Blog – Free Guides, Tips & Tutorials for JPG, PNG, WebP & PDF",
  description: "Expert guides on JPG to PNG, PNG to JPG, HEIC to JPG, WebP conversion, image compression & PDF tools. Step-by-step tutorials for beginners — completely free.",
  canonicalPath: "/blog",
  keywords: ["image conversion guides", "jpg to png tutorial", "heic to jpg guide", "compress image tutorial", "webp converter guide", "image to pdf guide", "free image tools blog"],
});

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const seoPosts = posts.map(p => ({
    title: p.frontmatter.title,
    desc: p.frontmatter.description || p.frontmatter.desc,
    url: `https://www.convertgalaxy.com/blog/${p.slug}`,
    date: p.frontmatter.date
  }));

  return (
    <div style={{ paddingTop: "72px" }}>
      <SEO type="blog" posts={seoPosts} />
      <BlogHeader />
      <Suspense fallback={<div className="py-16 text-center text-[#cbd5e1]">Loading search...</div>}>
        <BlogGrid initialPosts={posts} />
      </Suspense>
    </div>
  );
}
