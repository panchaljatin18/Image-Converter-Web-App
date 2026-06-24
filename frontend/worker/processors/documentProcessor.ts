import fs from "fs";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import path from "path";

export async function processDocument(inputPath: string, outputPath: string, targetFormat: string, options: any = {}): Promise<void> {
  const cleanFormat = targetFormat.toLowerCase();
  
  if (cleanFormat === "pdf") {
    // If input is an image, we can convert it to PDF
    const ext = path.extname(inputPath).toLowerCase();
    const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".tiff"];
    
    if (imageExtensions.includes(ext)) {
      const pdfDoc = await PDFDocument.create();
      
      // We must convert the image to PNG or JPEG first since pdf-lib only supports those
      let imageBytes: Buffer;
      let isPng = true;
      
      if (ext === ".jpg" || ext === ".jpeg") {
        imageBytes = fs.readFileSync(inputPath);
        isPng = false;
      } else {
        imageBytes = await sharp(inputPath).png().toBuffer();
      }

      let pdfImage;
      if (isPng) {
        pdfImage = await pdfDoc.embedPng(imageBytes);
      } else {
        pdfImage = await pdfDoc.embedJpg(imageBytes);
      }

      const { width, height } = pdfImage.scale(1);
      const page = pdfDoc.addPage([width, height]);
      
      page.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });

      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, pdfBytes);
      return;
    }

    throw new Error("Only Image to PDF conversions are supported perfectly at this time. Text to PDF is undergoing maintenance.");
  }

  throw new Error(`Document format conversions to '${targetFormat}' are currently undergoing maintenance for quality improvements. Please use the dedicated tools.`);
}
