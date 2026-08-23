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

    const originalBuffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
    const timestamp = Date.now();

    // Optimize image using sharp (resize to max 1200px width, convert to webp quality 80)
    let optimizedBuffer = originalBuffer;
    let contentType = "image/webp";
    const cleanBaseName = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9.-]/g, "_");
    const safeFilename = `${timestamp}_${cleanBaseName}.webp`;

    try {
      const sharp = (await import("sharp")).default;
      let pipeline = sharp(originalBuffer);
      const metadata = await pipeline.metadata();

      if (metadata.width && metadata.width > 1200) {
        pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true });
      }

      optimizedBuffer = await pipeline
        .webp({ quality: 80, effort: 5 })
        .toBuffer();
    } catch (sharpErr) {
        console.warn("Sharp image compression fallback to original buffer:", sharpErr);
        contentType = file.type || "image/png";
    }

    // Save optimized image to MongoDB
    await dbConnect();
    await BlogImage.create({
      filename: safeFilename,
      contentType,
      data: optimizedBuffer,
    });

    const fileUrl = `/api/uploads/blog/${safeFilename}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Error uploading file in admin context:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
