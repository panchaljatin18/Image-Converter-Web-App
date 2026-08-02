import { Suspense } from "react";
import BlogHeader from "@/sections/BlogPage/BlogHeader";
import BlogGrid from "@/sections/BlogPage/BlogGrid";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";
import { getBlogPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = constructMetadata({
  title: "Image Editing Tips & Guides – ConvertGalaxy Blog",
  description: "Learn image formats, compression tips, and step-by-step guides for JPG, PNG, WebP & PDF conversion — written for beginners.",
  canonicalPath: "/blog",
  keywords: ["image conversion guides"],
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
