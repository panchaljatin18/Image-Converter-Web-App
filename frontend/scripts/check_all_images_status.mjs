import mongoose from "mongoose";
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

const BlogPostSchema = new mongoose.Schema({
  slug: String,
  title: String,
  image: String,
});

const BlogImageSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);
const BlogImage = mongoose.models.BlogImage || mongoose.model("BlogImage", BlogImageSchema);

async function checkAllImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const posts = await BlogPost.find({});
    console.log("\nChecking BlogPosts cover images:");
    for (const p of posts) {
      const imgUrl = p.image || "";
      const filename = imgUrl.split("/").pop();
      const imageDoc = await BlogImage.findOne({ filename });

      if (imageDoc) {
        console.log(`✓ Post: ${p.slug} | Image URL: ${imgUrl} | DB Status: FOUND (${(imageDoc.data.length/1024).toFixed(1)} KB, ${imageDoc.contentType})`);
      } else {
        console.log(`❌ Post: ${p.slug} | Image URL: ${imgUrl} | DB Status: NOT FOUND IN MONGO!`);
      }
    }

    const allImages = await BlogImage.find({});
    console.log(`\nAll ${allImages.length} images in MongoDB BlogImage collection:`);
    allImages.forEach(img => {
      console.log(`- ${img.filename} | ${img.contentType} | ${(img.data.length/1024).toFixed(1)} KB`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkAllImages();
