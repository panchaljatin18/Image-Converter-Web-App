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
  const quality = options.quality ? Math.round(options.quality * 100) : 90;
  const finalQuality = quality > 100 ? 90 : (quality < 1 ? 90 : quality);

  if (options.bgColor) {
    pipeline = pipeline.flatten({ background: options.bgColor });
  }

  const rawFormats = ["3fr", "arw", "cr2", "cr3", "crw", "dcr", "dng", "erf", "kdc", "mdc", "mef", "mos", "mrw", "nef", "nrw", "orf", "pef", "raf", "raw", "rw2", "srf", "x3f"];
  const isRawTarget = rawFormats.includes(cleanFormat.toLowerCase());
  const effectiveFormat = isRawTarget ? "tiff" : cleanFormat.toLowerCase();

  const useImageMagick = ["bmp", "ico"].includes(effectiveFormat);

  if (useImageMagick) {
    // If output is something sharp doesn't support writing well (like BMP, ICO, HEIC)
    // we use ImageMagick CLI directly
    const { execPromise } = await import("../utils/execPromise");
    let command = `magick "${inputPath}" "${outputPath}"`;
    if (effectiveFormat === "ico") {
      command = `magick "${inputPath}" -resize 256x256 "${outputPath}"`;
    }
    console.log(`Running ImageMagick: ${command}`);
    await execPromise(command);
    return;
  }

  try {
    switch (effectiveFormat) {
      case "heic":
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
        pipeline = pipeline.toFormat(effectiveFormat as any);
        break;
    }

    await pipeline.toFile(outputPath);
  } catch (err: any) {
    // Fallback to ImageMagick if Sharp fails to decode or encode
    console.warn(`Sharp failed: ${err.message}. Falling back to ImageMagick.`);
    const { execPromise } = await import("../utils/execPromise");
    let command = `magick "${inputPath}" "${outputPath}"`;
    if (effectiveFormat === "ico") {
      command = `magick "${inputPath}" -resize 256x256 "${outputPath}"`;
    } else if (effectiveFormat === "heic") {
      command = `magick "${inputPath}" "jpg:${outputPath}"`;
    }
    console.log(`Running ImageMagick Fallback: ${command}`);
    await execPromise(command);
  }
}
