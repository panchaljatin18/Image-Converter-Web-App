import BlogEditor from "@/sections/AdminBlogPage/BlogEditor";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Edit Post: ${slug} | ConvertGalaxy Blog Admin`,
  };
}

export default async function EditPostPage({ params }) {
  const { slug } = await params;
  return <BlogEditor initialSlug={slug} />;
}
