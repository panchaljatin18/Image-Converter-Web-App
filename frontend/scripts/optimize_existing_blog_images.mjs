import mongoose from "mongoose";
import sharp from "sharp";
import path from "path";
import fs from "fs";

let MONGODB_URI = "mongodb://localhost:27017/convertgalaxy";
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const match = envContent.match(/^MONGODB_URI=(.*)$/m);
  if (match) {
    MONGODB_URI = match[1].trim();
  }
}

const BlogImageSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

const BlogImage = mongoose.models.BlogImage || mongoose.model("BlogImage", BlogImageSchema);

async function optimizeImages() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);

    const images = await BlogImage.find({});
    console.log(`Optimizing ${images.length} images in MongoDB...\n`);

    let totalSavedBytes = 0;

    for (const img of images) {
      const origSize = img.data.length;
      try {
        let pipeline = sharp(img.data);
        const metadata = await pipeline.metadata();

        // Resize if width > 1200px
        if (metadata.width && metadata.width > 1200) {
          pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true });
        }

        // Compress to WebP
        const webpBuffer = await pipeline
          .webp({ quality: 80, effort: 5 })
          .toBuffer();

        const newSize = webpBuffer.length;

        if (newSize < origSize) {
          img.data = webpBuffer;
          img.contentType = "image/webp";
          await img.save();

          const savingsKB = ((origSize - newSize) / 1024).toFixed(1);
          const percent = (((origSize - newSize) / origSize) * 100).toFixed(1);
          totalSavedBytes += (origSize - newSize);
          console.log(`✓ ${img.filename}: ${(origSize/1024).toFixed(1)} KB -> ${(newSize/1024).toFixed(1)} KB (${percent}% / ${savingsKB} KB saved)`);
        } else {
          console.log(`- ${img.filename}: Already optimal (${(origSize/1024).toFixed(1)} KB)`);
        }
      } catch (err) {
        console.error(`❌ Failed to optimize ${img.filename}:`, err.message);
      }
    }

    console.log(`\n🎉 Total space saved across MongoDB blog images: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`);
    process.exit(0);
  } catch (err) {
    console.error("Error optimizing images:", err);
    process.exit(1);
  }
}

optimizeImages();
