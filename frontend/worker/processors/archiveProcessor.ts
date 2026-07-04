import { execPromise } from "../utils/execPromise";

export async function processArchive(inputPath: string, outputPath: string, targetFormat: string, options: any = {}): Promise<void> {
  const cleanFormat = targetFormat.toLowerCase();
  
  // 7z a [archive_name] [file_to_add]
  // 7z automatically infers format from the output extension (.zip, .7z, .tar, .gz)
  const command = `7z a "${outputPath}" "${inputPath}"`;
  
  console.log(`Running 7-Zip: ${command}`);
  await execPromise(command);
}
