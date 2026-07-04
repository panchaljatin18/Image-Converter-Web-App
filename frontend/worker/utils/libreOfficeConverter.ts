import path from "path";
import fs from "fs";
import { execPromise } from "./execPromise";

export async function convertWithLibreOffice(inputPath: string, outputPath: string, targetFormat: string): Promise<void> {
  const outputDir = path.dirname(outputPath);
  const sofficeCmd = process.env.LIBREOFFICE_COMMAND || "soffice";
  // LibreOffice headless command (quoted for paths with spaces)
  const command = `"${sofficeCmd}" --headless --convert-to ${targetFormat} "${inputPath}" --outdir "${outputDir}"`;
  
  console.log(`Running LibreOffice: ${command}`);
  await execPromise(command);

  // LibreOffice automatically names the output file as: [original_basename].[targetFormat]
  // We need to rename it to our generated outputPath
  const parsedInput = path.parse(inputPath);
  const libreOfficeOutput = path.join(outputDir, `${parsedInput.name}.${targetFormat}`);

  if (fs.existsSync(libreOfficeOutput) && libreOfficeOutput !== outputPath) {
    fs.renameSync(libreOfficeOutput, outputPath);
  } else if (!fs.existsSync(libreOfficeOutput) && !fs.existsSync(outputPath)) {
    throw new Error(`LibreOffice failed to generate output file for ${targetFormat}`);
  }
}
