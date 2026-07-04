import { execPromise } from "../utils/execPromise";

export async function processEbook(inputPath: string, outputPath: string, targetFormat: string): Promise<void> {
  // Calibre ebook-convert command
  // Expected to be available in PATH.
  const command = `ebook-convert "${inputPath}" "${outputPath}"`;
  
  console.log(`Running Calibre: ${command}`);
  await execPromise(command);
}
