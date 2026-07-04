import { convertWithLibreOffice } from "../utils/libreOfficeConverter";

export async function processPresentation(inputPath: string, outputPath: string, targetFormat: string): Promise<void> {
  const cleanFormat = targetFormat.toLowerCase();
  await convertWithLibreOffice(inputPath, outputPath, cleanFormat);
}
