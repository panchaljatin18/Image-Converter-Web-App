import fs from "fs";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import path from "path";
import { convertWithLibreOffice } from "../utils/libreOfficeConverter";
import { execPromise } from "../utils/execPromise";

export async function processDocument(inputPath: string, outputPath: string, targetFormat: string, options: any = {}): Promise<void> {
  const cleanFormat = targetFormat.toLowerCase();
  const ext = path.extname(inputPath).toLowerCase();
  
  // 1. Image to PDF conversion natively
  if (cleanFormat === "pdf") {
    const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".tiff"];
    if (imageExtensions.includes(ext)) {
      const pdfDoc = await PDFDocument.create();
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
      
      page.drawImage(pdfImage, { x: 0, y: 0, width, height });
      fs.writeFileSync(outputPath, await pdfDoc.save());
      return;
    }
  }

  // 2. Pandoc formats (HTML, TXT, RTF)
  const pandocSupported = ["html", "txt", "rtf", "md"];
  if (pandocSupported.includes(cleanFormat) && pandocSupported.includes(ext.slice(1))) {
    const command = `pandoc "${inputPath}" -o "${outputPath}"`;
    console.log(`Running Pandoc: ${command}`);
    await execPromise(command);
    return;
  }

  // 3. LibreOffice generic document conversion
  await convertWithLibreOffice(inputPath, outputPath, cleanFormat);
}
