import { NextResponse } from "next/server";
import { getBlogPosts, saveBlogPost } from "@/lib/blog";

export async function GET() {
  try {
    const posts = await getBlogPosts(true); // include drafts in admin panel
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Error in GET /api/admin/blog:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { slug, title, description, date, focusKeyword, relatedToolSlug, image, imageAlt, imageTitle, author, status, content } = data;

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
    });

    return NextResponse.json({ success: true, message: "Blog post created successfully." });
  } catch (error) {
    console.error("Error in POST /api/admin/blog:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
