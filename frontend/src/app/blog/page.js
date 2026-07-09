import { Suspense } from "react";
import BlogHeader from "@/sections/BlogPage/BlogHeader";
import BlogGrid from "@/sections/BlogPage/BlogGrid";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Tools Directory & Guides",
  description: "Explore detailed information, features, and best practices for converting, resizing, cropping, and optimizing your images using our free online tools.",
  canonicalPath: "/blog",
});

export default function BlogPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <SEO type="blog" posts={[]} />
      <BlogHeader />
      <Suspense fallback={<div className="py-16 text-center text-[#64748b]">Loading search...</div>}>
        <BlogGrid />
      </Suspense>
    </div>
  );
}
