import fs from "fs";
import { fromFile } from "file-type";
import sharp from "sharp";

export async function validateOutput(filePath: string, expectedFormat: string, sourceFormat?: string): Promise<void> {
  // 1. Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error("Validation Error: Output file was not generated.");
  }

  // 2. Check if file is empty
  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    fs.unlinkSync(filePath); // Cleanup
    throw new Error("Validation Error: Output file is 0 bytes (empty file).");
  }

  // 3. Check actual MIME type signature (Prevents faking extension)
  const fileType = await fromFile(filePath);
  if (!fileType) {
    // Some formats (like plain text/CSV) don't have magic numbers, but images/videos do.
    const textFormats = ["csv", "txt", "html", "svg"];
    if (!textFormats.includes(expectedFormat.toLowerCase())) {
        throw new Error("Validation Error: Could not determine file signature (corrupted).");
    }
  } else {
    const ext = fileType.ext.toLowerCase();
    const expected = expectedFormat.toLowerCase();
    const rawFormats = ["3fr", "arw", "cr2", "cr3", "crw", "dcr", "dng", "erf", "kdc", "mdc", "mef", "mos", "mrw", "nef", "nrw", "orf", "pef", "raf", "raw", "rw2", "srf", "x3f"];
    
    // Loosely match variations
    const isMatch = ext === expected || 
                   (expected === 'jpg' && ext === 'jpeg') ||
                   (expected === 'jpeg' && ext === 'jpg') ||
                   (expected === 'tif' && ext === 'tiff') ||
                   (expected === 'tiff' && ext === 'tif') ||
                   (rawFormats.includes(expected) && (ext === 'tif' || ext === 'tiff'));
                   
    if (!isMatch) {
      throw new Error(`Validation Error: Format mismatch. Expected ${expectedFormat}, but file is actually ${fileType.ext}`);
    }
  }

  // 4. If it's an image, use Sharp to verify structural integrity (catches corrupted headers)
  const imageFormats = ["png", "jpg", "jpeg", "webp", "avif", "gif", "tiff"];
  if (imageFormats.includes(expectedFormat.toLowerCase())) {
    try {
      // sharp().metadata() actually parses the image headers. If it fails, the image is corrupt.
      await sharp(filePath).metadata();
    } catch (err: any) {
      fs.unlinkSync(filePath); // Cleanup corrupted file
      throw new Error(`Validation Error: Image structure is corrupted or invalid. (${err.message})`);
    }
  }
}
