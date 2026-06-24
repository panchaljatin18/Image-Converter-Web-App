import sharp from "sharp";
import fs from "fs";

export async function processImage(inputPath: string, outputPath: string, targetFormat: string, options: any = {}): Promise<void> {
  const cleanFormat = targetFormat.startsWith(".") ? targetFormat.slice(1) : targetFormat;
  
  let pipeline = sharp(inputPath, { animated: true }); // animated: true helps with GIFs

  // Apply cropping if coordinates are provided
  if (options.crop && typeof options.crop.x === 'number') {
    pipeline = pipeline.extract({
      left: Math.round(options.crop.x),
      top: Math.round(options.crop.y),
      width: Math.round(options.crop.width),
      height: Math.round(options.crop.height)
    });
  }

  // Apply resizing
  if (options.width || options.height || options.maxWidthOrHeight) {
    let width = options.width;
    let height = options.height;

    if (options.maxWidthOrHeight) {
      // Logic for max width/height while maintaining aspect ratio
      const metadata = await sharp(inputPath).metadata();
      const origW = metadata.width || 1;
      const origH = metadata.height || 1;
      const maxD = options.maxWidthOrHeight;
      if (origW > maxD || origH > maxD) {
        if (origW > origH) {
          width = maxD;
          height = Math.round((origH / origW) * maxD);
        } else {
          height = maxD;
          width = Math.round((origW / origH) * maxD);
        }
      }
    }

    if (width || height) {
      pipeline = pipeline.resize({
        width: width ? Math.round(width) : undefined,
        height: height ? Math.round(height) : undefined,
        fit: 'inside',
        withoutEnlargement: true
      });
    }
  }

  // Maintain metadata if possible unless explicitly told not to
  if (options.preserveMetadata !== false) {
    pipeline = pipeline.withMetadata();
  }

  // Handle format-specific options
  const quality = options.quality ? Math.round(options.quality * 100) : 90; // quality is often passed as 0.1-1.0 from browser-image-compression
  const finalQuality = quality > 100 ? 90 : (quality < 1 ? 90 : quality); // Fallback

  // Handle background color for transparency flattening (crucial for PNG -> JPG)
  if (options.bgColor) {
    pipeline = pipeline.flatten({ background: options.bgColor });
  }

  switch (cleanFormat.toLowerCase()) {
    case "jpeg":
    case "jpg":
      pipeline = pipeline.jpeg({ quality: finalQuality, chromaSubsampling: '4:4:4' });
      break;
    case "png":
      pipeline = pipeline.png({ quality: finalQuality, compressionLevel: 8 });
      break;
    case "webp":
      pipeline = pipeline.webp({ quality: finalQuality, lossless: options.lossless });
      break;
    case "avif":
      pipeline = pipeline.avif({ quality: finalQuality, lossless: options.lossless });
      break;
    case "gif":
      pipeline = pipeline.gif();
      break;
    case "tiff":
      pipeline = pipeline.tiff({ quality: finalQuality });
      break;
    default:
      // Pass-through or generic toFormat
      pipeline = pipeline.toFormat(cleanFormat as any);
      break;
  }

  await pipeline.toFile(outputPath);
}
