import { NextResponse } from "next/server";
import { getBlogPosts, saveBlogPost } from "@/lib/blog";
import { verifyAdminAuth } from "@/lib/adminAuth";

export async function GET(req) {
  const authError = verifyAdminAuth(req);
  if (authError) return authError;

  try {
    const posts = await getBlogPosts(true); // include drafts in admin panel
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Error in GET /api/admin/blog:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const authError = verifyAdminAuth(req);
  if (authError) return authError;

  try {
    const data = await req.json();
    const { slug, title, description, date, focusKeyword, relatedToolSlug, image, imageAlt, imageTitle, author, status, content, editorHtml, content_blocks } = data;

    if (!slug || !title) {
      return NextResponse.json({ success: false, error: "Slug and Title are required." }, { status: 400 });
    }

    // Save/write to MongoDB
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
      editorHtml: editorHtml || "",
      content_blocks: content_blocks || null,
    });

    return NextResponse.json({ success: true, message: "Blog post created successfully." });
  } catch (error) {
    console.error("Error in POST /api/admin/blog:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
