const imageFormats = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "gif",
  "bmp",
  "tiff",
  "svg",
  "ico",
  "heic",
  "3fr",
  "arw",
  "cr2",
  "cr3",
  "crw",
  "dcr",
  "dng",
  "erf",
  "kdc",
  "mdc",
  "mef",
  "mos",
  "mrw",
  "nef",
  "nrw",
  "orf",
  "pef",
  "raf",
  "raw",
  "rw2",
  "srf",
  "x3f",
];

const standardImageFormats = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "avif",
  "gif",
  "bmp",
  "tiff",
  "tif",
  "ico",
  "heic",
  "svg",
];

const documentFormats = ["pdf", "docx", "doc", "txt", "rtf", "odt", "html"];
const spreadsheetFormats = ["xlsx", "xls", "csv", "ods"];
const presentationFormats = ["pptx", "ppt", "odp"];
const archiveFormats = ["zip", "tar", "gz"];

/**
 * Checks if conversion from a source format to a target format is supported.
 */
function isConversionSupported(sourceFormat, targetFormat) {
  const src = sourceFormat.toLowerCase().trim();
  const tgt = targetFormat.toLowerCase().trim();

  // If source and target are the same, it is supported (though redundant)
  if (src === tgt) {
    return true;
  }

  // Any format can be compressed into an archive
  if (archiveFormats.includes(tgt)) {
    return true;
  }

  // Image conversions (images can convert to other standard images, or PDF documents)
  if (imageFormats.includes(src)) {
    return standardImageFormats.includes(tgt) || tgt === "pdf";
  }

  // PDF conversions (PDF can convert to standard images, PDF-A, or compressed PDF)
  if (src === "pdf") {
    return standardImageFormats.includes(tgt) || tgt === "pdf";
  }

  // Document conversions (docx, doc, odt, rtf, txt, html) can convert to other document formats or PDF
  if (documentFormats.includes(src)) {
    return documentFormats.includes(tgt) || standardImageFormats.includes(tgt);
  }

  // Spreadsheet conversions (xlsx, xls, csv, ods) can convert to other spreadsheet formats or PDF
  if (spreadsheetFormats.includes(src)) {
    return spreadsheetFormats.includes(tgt) || tgt === "pdf";
  }

  // Presentation conversions (pptx, ppt, odp) can convert to other presentation formats or PDF
  if (presentationFormats.includes(src)) {
    return presentationFormats.includes(tgt) || tgt === "pdf";
  }

  return false;
}

module.exports = {
  isConversionSupported,
  imageFormats,
  standardImageFormats,
  documentFormats,
  spreadsheetFormats,
  presentationFormats,
  archiveFormats,
};
