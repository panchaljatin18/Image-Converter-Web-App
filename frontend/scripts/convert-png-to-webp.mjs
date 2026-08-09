import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const directoriesToScan = [
  path.join(projectRoot, "public"),
  path.join(projectRoot, "public/uploads"),
  path.join(projectRoot, "src/app"),
];

async function convertPngToWebp(filePath) {
  try {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const outputPath = path.join(dir, `${base}.webp`);

    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;

    // Use sharp to convert PNG to WebP while retaining full alpha transparency
    await sharp(filePath)
      .webp({ quality: 85, alphaQuality: 100, lossless: base === "CG" || base === "C" })
      .toFile(outputPath);

    const convertedStats = fs.statSync(outputPath);
    const convertedSize = convertedStats.size;
    const savings = originalSize > 0
      ? (((originalSize - convertedSize) / originalSize) * 100).toFixed(1)
      : "0";

    console.log(
      `✓ Converted: ${path.relative(projectRoot, filePath)} -> ${base}.webp | ${(originalSize / 1024).toFixed(1)}KB -> ${(convertedSize / 1024).toFixed(1)}KB (${savings}% saved)`
    );

    return { originalSize, convertedSize };
  } catch (err) {
    console.error(`❌ Failed to convert ${filePath}:`, err.message);
    return null;
  }
}

async function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return { original: 0, converted: 0, count: 0 };

  let totalOriginal = 0;
  let totalConverted = 0;
  let count = 0;

  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subRes = await processDirectory(fullPath);
      totalOriginal += subRes.original;
      totalConverted += subRes.converted;
      count += subRes.count;
    } else if (stat.isFile() && item.toLowerCase().endsWith(".png")) {
      const result = await convertPngToWebp(fullPath);
      if (result) {
        totalOriginal += result.originalSize;
        totalConverted += result.convertedSize;
        count++;
      }
    }
  }

  return { original: totalOriginal, converted: totalConverted, count };
}

async function main() {
  console.log("🚀 Starting PNG to WebP bulk conversion...\n");

  let totalOriginal = 0;
  let totalConverted = 0;
  let totalCount = 0;

  for (const dir of directoriesToScan) {
    const res = await processDirectory(dir);
    totalOriginal += res.original;
    totalConverted += res.converted;
    totalCount += res.count;
  }

  const overallSavingsMB = ((totalOriginal - totalConverted) / (1024 * 1024)).toFixed(2);
  const overallSavingsPercent = totalOriginal > 0
    ? (((totalOriginal - totalConverted) / totalOriginal) * 100).toFixed(1)
    : "0";

  console.log("\n==========================================");
  console.log(`🎉 Conversion Summary:`);
  console.log(`- Images Converted: ${totalCount}`);
  console.log(`- Total Original Size: ${(totalOriginal / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`- Total Converted Size: ${(totalConverted / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`- Total Space Saved: ${overallSavingsMB} MB (${overallSavingsPercent}% smaller)`);
  console.log("==========================================\n");
}

main();
