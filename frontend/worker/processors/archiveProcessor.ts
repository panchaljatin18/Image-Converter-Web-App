import fs from "fs";
import { ZipArchive, TarArchive } from "archiver";

export async function processArchive(inputPath: string, outputPath: string, targetFormat: string, options: any = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    
    // archiver supports zip and tar natively. For rar, 7z etc, it's more complex, but we'll support the basics perfectly.
    const format = targetFormat.toLowerCase() === "tar" ? "tar" : "zip";
    
    const archive = format === "tar" ? new TarArchive() : new ZipArchive({
      zlib: { level: 9 } // Sets the compression level.
    });

    const output = fs.createWriteStream(outputPath);

    output.on("close", function() {
      resolve();
    });

    archive.on("error", function(err) {
      reject(err);
    });

    archive.pipe(output);

    // Get the original filename without extension to use as the internal file name
    const path = require("path");
    const originalName = path.basename(inputPath);
    
    archive.append(fs.createReadStream(inputPath), { name: `converted_file${path.extname(inputPath)}` });

    archive.finalize();
  });
}
