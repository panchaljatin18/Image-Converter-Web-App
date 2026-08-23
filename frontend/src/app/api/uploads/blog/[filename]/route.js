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
      let responseData = imageDoc.data;
      let contentType = imageDoc.contentType || "image/webp";

      // On-the-fly optimization fallback if image is still uncompressed (>300KB or png/jpg)
      if (imageDoc.data && imageDoc.data.length > 300 * 1024 && contentType !== "image/webp") {
        try {
          const sharp = (await import("sharp")).default;
          const webpBuffer = await sharp(imageDoc.data)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

          responseData = webpBuffer;
          contentType = "image/webp";

          // Update MongoDB in background
          BlogImage.updateOne({ _id: imageDoc._id }, { data: webpBuffer, contentType: "image/webp" }).catch(() => {});
        } catch (e) {
          console.warn("On-the-fly image compression skipped:", e);
        }
      }

      return new Response(responseData, {
        headers: {
          "Content-Type": contentType,
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
    let contentType = "image/webp";

    if (extension === "heic" || extension === "heif") {
      try {
        const { execSync } = await import("child_process");
        const tempJpgPath = filePath.replace(/\.(heic|heif)$/i, `_temp_${Date.now()}.jpg`);

        // Convert HEIC to temp JPG on the fly using ImageMagick
        execSync(`magick "${filePath}" "${tempJpgPath}"`);

        // Read converted JPG buffer
        fileBuffer = fs.readFileSync(tempJpgPath);
        fs.unlinkSync(tempJpgPath);
      } catch (err) {
        console.error("On-the-fly HEIC conversion failed:", err);
      }
    }

    try {
      const sharp = (await import("sharp")).default;
      fileBuffer = await sharp(fileBuffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (e) {
      if (extension === "png") contentType = "image/png";
      else if (extension === "gif") contentType = "image/gif";
      else if (extension === "svg") contentType = "image/svg+xml";
      else contentType = "image/jpeg";
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
