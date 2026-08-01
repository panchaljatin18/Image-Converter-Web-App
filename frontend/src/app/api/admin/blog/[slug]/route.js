import { NextResponse } from "next/server";
import { getBlogPostBySlug, saveBlogPost, deleteBlogPost } from "@/lib/blog";
import { verifyAdminAuth } from "@/lib/adminAuth";

export async function GET(req, { params }) {
  const authError = verifyAdminAuth(req);
  if (authError) return authError;

  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ success: false, error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error(`Error in GET /api/admin/blog/[slug]:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const authError = verifyAdminAuth(req);
  if (authError) return authError;

  try {
    const { slug } = await params;
    const data = await req.json();
    const { title, description, date, focusKeyword, relatedToolSlug, image, imageAlt, imageTitle, author, status, content } = data;

    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required." }, { status: 400 });
    }

    await saveBlogPost(slug, {
      title,
      description: description || "",
      date: date || new Date().toISOString().split("T")[0],
      focusKeyword: focusKeyword || "",
      relatedToolSlug: relatedToolSlug || "",
      image: image || "",
      imageAlt: imageAlt || "",
      imageTitle: imageTitle || "",
      author: author || "Convert Galaxy Team",
      status: status || "Draft",
      content: content || "",
    });

    return NextResponse.json({ success: true, message: "Blog post updated successfully." });
  } catch (error) {
    console.error(`Error in PUT /api/admin/blog/[slug]:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const authError = verifyAdminAuth(req);
  if (authError) return authError;

  try {
    const { slug } = await params;
    const deleted = await deleteBlogPost(slug);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Blog post not found or could not be deleted." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog post deleted successfully." });
  } catch (error) {
    console.error(`Error in DELETE /api/admin/blog/[slug]:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
