import { ZipArchive, TarArchive } from "archiver";
import fs from "fs";
import path from "path";

export async function processArchive(inputPath: string, outputPath: string, targetFormat: string, options: any = {}): Promise<void> {
  const cleanFormat = targetFormat.toLowerCase();
  
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    let format = cleanFormat;
    
    // archiver natively supports zip and tar.
    // GZ target is implemented by using tar format with gzip compression option enabled.
    if (cleanFormat === "gz") {
      format = "tar";
    }
    
    const archiveOptions = cleanFormat === "gz"
      ? { gzip: true, gzipOptions: { level: 9 } }
      : { zlib: { level: 9 } };

    let archive: any;
    if (format === "zip") {
      archive = new ZipArchive(archiveOptions);
    } else if (format === "tar") {
      archive = new TarArchive(archiveOptions);
    } else {
      reject(new Error(`Unsupported archive format: ${format}`));
      return;
    }

    output.on("close", () => {
      console.log(`Archiving finished. Total bytes: ${archive.pointer()}`);
      resolve();
    });

    archive.on("error", (err: any) => {
      reject(err);
    });

    archive.pipe(output);

    const baseName = path.basename(inputPath);
    archive.file(inputPath, { name: baseName });

    archive.finalize();
  });
}

