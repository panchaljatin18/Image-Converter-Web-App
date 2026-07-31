import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { BlogImage } from "@/models/BlogImage";
import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  try {
    const { filename } = await params;

    // 1. Try to find the image in MongoDB
    await dbConnect();
    const imageDoc = await BlogImage.findOne({ filename });

    if (imageDoc) {
      return new Response(imageDoc.data, {
        headers: {
          "Content-Type": imageDoc.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // 2. Fallback to filesystem for backward compatibility
    const filePath = path.join(process.cwd(), "public", "uploads", "blog", filename);
    if (!fs.existsSync(filePath)) {
      return new Response("Image not found", { status: 404 });
    }

    const extension = filename.split(".").pop()?.toLowerCase();
    let fileBuffer = fs.readFileSync(filePath);
    let contentType = "image/jpeg";

    if (extension === "heic" || extension === "heif") {
      try {
        const { execSync } = await import("child_process");
        const tempJpgPath = filePath.replace(/\.(heic|heif)$/i, `_temp_${Date.now()}.jpg`);

        // Convert HEIC to temp JPG on the fly using ImageMagick
        execSync(`magick "${filePath}" "${tempJpgPath}"`);

        // Read converted JPG buffer
        fileBuffer = fs.readFileSync(tempJpgPath);

        // Clean up temp JPG file
        fs.unlinkSync(tempJpgPath);

        contentType = "image/jpeg";
      } catch (err) {
        console.error("On-the-fly HEIC conversion failed:", err);
        contentType = "image/heic";
      }
    } else {
      if (extension === "png") contentType = "image/png";
      else if (extension === "webp") contentType = "image/webp";
      else if (extension === "gif") contentType = "image/gif";
      else if (extension === "svg") contentType = "image/svg+xml";
    }

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving uploaded image:", error);
    return new Response("Error loading image", { status: 500 });
  }
}
