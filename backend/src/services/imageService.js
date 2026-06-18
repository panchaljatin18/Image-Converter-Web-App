const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, "../downloads");
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

/**
 * Generate output file name with target extension
 */
const generateOutputFilename = (originalName, targetExt) => {
  const nameWithoutExt = path.parse(originalName).name;
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E4);
  return `${nameWithoutExt}-${uniqueSuffix}.${targetExt}`;
};

/**
 * Sharp Image Processing Services
 */
const imageService = {
  /**
   * Convert image to a target format (png, jpeg, webp)
   */
  async convertFormat(filePath, originalFilename, targetFormat, quality = 85) {
    const outputFilename = generateOutputFilename(originalFilename, targetFormat);
    const outputPath = path.join(downloadsDir, outputFilename);

    let sharpInstance = sharp(filePath);

    if (targetFormat === "png") {
      sharpInstance = sharpInstance.png({ quality });
    } else if (targetFormat === "jpeg" || targetFormat === "jpg") {
      sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
    } else if (targetFormat === "webp") {
      sharpInstance = sharpInstance.webp({ quality });
    }

    await sharpInstance.toFile(outputPath);
    return outputFilename;
  },

  /**
   * Compress image (reduce file size, preserve format)
   */
  async compressImage(filePath, originalFilename, mimetype, quality = 75) {
    let targetFormat = "jpeg";
    if (mimetype.includes("png")) targetFormat = "png";
    if (mimetype.includes("webp")) targetFormat = "webp";

    const outputFilename = generateOutputFilename(originalFilename, targetFormat);
    const outputPath = path.join(downloadsDir, outputFilename);

    let sharpInstance = sharp(filePath);

    if (targetFormat === "png") {
      // PNG uses compressionLevel (0-9) and palette/colors optimization
      sharpInstance = sharpInstance.png({ compressionLevel: 9, palette: true, quality });
    } else if (targetFormat === "webp") {
      sharpInstance = sharpInstance.webp({ quality, effort: 6 });
    } else {
      sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
    }

    await sharpInstance.toFile(outputPath);
    return outputFilename;
  },

  /**
   * Resize image with optional width and height
   */
  async resizeImage(filePath, originalFilename, mimetype, width, height) {
    let ext = path.extname(originalFilename).replace(".", "") || "jpeg";
    if (ext === "jpg") ext = "jpeg";

    const outputFilename = generateOutputFilename(originalFilename, ext);
    const outputPath = path.join(downloadsDir, outputFilename);

    const resizeOptions = {
      fit: sharp.fit.inside,
      withoutEnlargement: true
    };

    if (width) resizeOptions.width = parseInt(width, 10);
    if (height) resizeOptions.height = parseInt(height, 10);

    await sharp(filePath)
      .resize(resizeOptions)
      .toFile(outputPath);

    return outputFilename;
  },

  /**
   * Crop image using width, height, left, and top offsets
   */
  async cropImage(filePath, originalFilename, width, height, left, top) {
    let ext = path.extname(originalFilename).replace(".", "") || "jpeg";
    if (ext === "jpg") ext = "jpeg";

    const outputFilename = generateOutputFilename(originalFilename, ext);
    const outputPath = path.join(downloadsDir, outputFilename);

    await sharp(filePath)
      .extract({
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        left: parseInt(left, 10),
        top: parseInt(top, 10)
      })
      .toFile(outputPath);

    return outputFilename;
  }
};

module.exports = imageService;
