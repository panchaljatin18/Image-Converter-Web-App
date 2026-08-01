import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { BlogImage } from "@/models/BlogImage";
import { verifyAdminAuth } from "@/lib/adminAuth";

export async function POST(req) {
  const authError = verifyAdminAuth(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided for upload." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
    const timestamp = Date.now();

    // Sanitize and create safe filename
    const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const safeFilename = `${timestamp}_${cleanName}`;

    // Save image to MongoDB
    await dbConnect();
    await BlogImage.create({
      filename: safeFilename,
      contentType: file.type || "image/png",
      data: buffer,
    });

    const fileUrl = `/api/uploads/blog/${safeFilename}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Error uploading file in admin context:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
