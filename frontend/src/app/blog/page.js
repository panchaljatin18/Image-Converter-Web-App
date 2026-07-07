import BlogHeader from "@/sections/BlogPage/BlogHeader";
import BlogGrid from "@/sections/BlogPage/BlogGrid";

export const metadata = {
  title: "Blog – Image Tips, Tutorials & Guides | ConvertGalaxy",
  description:
    "Learn about image formats, compression tips, web optimization, and how-to guides for getting the most out of your images on the web.",
};

export default function BlogPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <BlogHeader />
      <BlogGrid />
    </div>
  );
}
