import BlogHeader from "@/sections/BlogPage/BlogHeader";
import BlogGrid from "@/sections/BlogPage/BlogGrid";

export const metadata = {
  title: "Tools Directory & Guides – ConvertGalaxy",
  description:
    "Explore detailed information, features, and best practices for converting, resizing, cropping, and optimizing your images using our free online tools.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <BlogHeader />
      <BlogGrid />
    </div>
  );
}
