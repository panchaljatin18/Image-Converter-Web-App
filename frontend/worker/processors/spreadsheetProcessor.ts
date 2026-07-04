import { convertWithLibreOffice } from "../utils/libreOfficeConverter";

export async function processSpreadsheet(inputPath: string, outputPath: string, targetFormat: string): Promise<void> {
  const cleanFormat = targetFormat.toLowerCase();
  await convertWithLibreOffice(inputPath, outputPath, cleanFormat);
}
