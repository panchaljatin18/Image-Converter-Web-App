import { isConversionSupported } from "./conversions";

export const INPUT_ACCEPT =
  ".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif,.ico,.heic,.avif,.svg,.3fr,.arw,.cr2,.cr3,.crw,.dcr,.dng,.erf,.kdc,.mdc,.mef,.mos,.mrw,.nef,.nrw,.orf,.pef,.raf,.raw,.rw2,.srf,.x3f,.pdf,.docx,.doc,.txt,.rtf,.odt,.html,.xlsx,.xls,.csv,.ods,.pptx,.ppt,.odp,.zip,.tar,.gz";

export const ALL_FORMAT_CATEGORIES = [
  {
    id: "image",
    label: "Image",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.35)",
    formats: [
      { value: "png", label: "PNG", note: "Transparent & lossless" },
      { value: "jpg", label: "JPG", note: "Best for photos" },
      { value: "jpeg", label: "JPEG", note: "Standard JPEG" },
      { value: "webp", label: "WebP", note: "Small & web-friendly" },
      { value: "gif", label: "GIF", note: "Animated graphics" },
      { value: "bmp", label: "BMP", note: "Bitmap output" },
      { value: "tiff", label: "TIFF", note: "High fidelity" },
      { value: "tif", label: "TIF", note: "High fidelity" },
      { value: "ico", label: "ICO", note: "Icon files" },
      { value: "heic", label: "HEIC", note: "Apple photo format" },
      { value: "avif", label: "AVIF", note: "Modern compression" },
      { value: "svg", label: "SVG", note: "Scalable vector" },
      { value: "3fr", label: "3FR", note: "Hasselblad Raw" },
      { value: "arw", label: "ARW", note: "Sony Raw" },
      { value: "cr2", label: "CR2", note: "Canon Raw" },
      { value: "cr3", label: "CR3", note: "Canon Raw 3" },
      { value: "crw", label: "CRW", note: "Canon Raw CIFF" },
      { value: "dcr", label: "DCR", note: "Kodak Raw" },
      { value: "dng", label: "DNG", note: "Digital Negative" },
      { value: "erf", label: "ERF", note: "Epson Raw" },
      { value: "kdc", label: "KDC", note: "Kodak Raw" },
      { value: "mdc", label: "MDC", note: "Minolta Raw" },
      { value: "mef", label: "MEF", note: "Mamiya Raw" },
      { value: "mos", label: "MOS", note: "Leaf Raw" },
      { value: "mrw", label: "MRW", note: "Minolta Raw" },
      { value: "nef", label: "NEF", note: "Nikon Raw" },
      { value: "nrw", label: "NRW", note: "Nikon Coolpix Raw" },
      { value: "orf", label: "ORF", note: "Olympus Raw" },
      { value: "pef", label: "PEF", note: "Pentax Raw" },
      { value: "raf", label: "RAF", note: "Fuji Raw" },
      { value: "raw", label: "RAW", note: "Camera raw data" },
      { value: "rw2", label: "RW2", note: "Panasonic Raw" },
      { value: "srf", label: "SRF", note: "Sony Raw" },
      { value: "x3f", label: "X3F", note: "Sigma Raw" },
    ],
  },
  {
    id: "document",
    label: "Document",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.35)",
    formats: [
      { value: "pdf", label: "PDF", note: "Portable document" },
      { value: "docx", label: "DOCX", note: "Word document" },
      { value: "doc", label: "DOC", note: "Legacy Word" },
      { value: "txt", label: "TXT", note: "Plain text" },
      { value: "rtf", label: "RTF", note: "Rich text" },
      { value: "odt", label: "ODT", note: "OpenDocument text" },
      { value: "html", label: "HTML", note: "Web page" },
    ],
  },
  {
    id: "presentation",
    label: "Presentation",
    color: "#f97316",
    glow: "rgba(249,115,22,0.35)",
    formats: [
      { value: "pptx", label: "PPTX", note: "PowerPoint" },
      { value: "ppt", label: "PPT", note: "Legacy PowerPoint" },
      { value: "odp", label: "ODP", note: "OpenDocument" },
    ],
  },
  {
    id: "spreadsheet",
    label: "Spreadsheet",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.35)",
    formats: [
      { value: "xlsx", label: "XLSX", note: "Excel spreadsheet" },
      { value: "xls", label: "XLS", note: "Legacy Excel" },
      { value: "csv", label: "CSV", note: "Comma separated" },
      { value: "ods", label: "ODS", note: "OpenDocument sheet" },
    ],
  },
  {
    id: "archive",
    label: "Archive",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.35)",
    formats: [
      { value: "zip", label: "ZIP", note: "Universal archive" },
      { value: "tar", label: "TAR", note: "Unix archive" },
      { value: "gz", label: "GZ", note: "Gzip compressed" },
    ],
  },
];

export const ALL_FORMATS_FLAT = ALL_FORMAT_CATEGORIES.flatMap((c) =>
  c.formats.map((f) => ({ ...f, catId: c.id }))
);
export const ALL_FORMAT_LOOKUP = new Map(ALL_FORMATS_FLAT.map((f) => [f.value, f]));

export const FORMAT_ALIASES = {
  jpeg: "jpg",
  jfif: "jpg",
  jpe: "jpg",
  tif: "tiff",
};

export const getAllowedConversions = (sourceFmt) => {
  if (!sourceFmt) return [];

  // Normalize aliases (e.g. "jfif" → "jpg") so isConversionSupported gets a canonical format
  const normalized = FORMAT_ALIASES[sourceFmt.toLowerCase()] || sourceFmt.toLowerCase();

  const rawList = ALL_FORMATS_FLAT.map((f) => f.value);
  return rawList.filter((target) => isConversionSupported(normalized, target));
};

export const SOURCE_FORMATS = [
  { label: "7Z", extensions: ["7z"], mimes: ["application/x-7z-compressed"] },
  { label: "ACE", extensions: ["ace"], mimes: ["application/x-ace-compressed"] },
  { label: "ALZ", extensions: ["alz"], mimes: [] },
  { label: "ARC", extensions: ["arc"], mimes: ["application/x-freearc"] },
  { label: "ARJ", extensions: ["arj"], mimes: [] },
  { label: "BZ", extensions: ["bz"], mimes: ["application/x-bzip"] },
  { label: "BZ2", extensions: ["bz2"], mimes: ["application/x-bzip2"] },
  { label: "CAB", extensions: ["cab"], mimes: ["application/vnd.ms-cab-compressed"] },
  { label: "CPIO", extensions: ["cpio"], mimes: ["application/x-cpio"] },
  { label: "DEB", extensions: ["deb"], mimes: ["application/vnd.debian.binary-package"] },
  { label: "DMG", extensions: ["dmg"], mimes: ["application/x-apple-diskimage"] },
  { label: "GZ", extensions: ["gz"], mimes: ["application/gzip"] },
  { label: "IMG", extensions: ["img"], mimes: [] },
  { label: "ISO", extensions: ["iso"], mimes: [] },
  { label: "JAR", extensions: ["jar"], mimes: ["application/java-archive"] },
  { label: "LHA", extensions: ["lha"], mimes: [] },
  { label: "LZ", extensions: ["lz"], mimes: [] },
  { label: "LZMA", extensions: ["lzma"], mimes: [] },
  { label: "LZO", extensions: ["lzo"], mimes: [] },
  { label: "RAR", extensions: ["rar"], mimes: ["application/vnd.rar"] },
  { label: "RPM", extensions: ["rpm"], mimes: ["application/x-rpm"] },
  { label: "RZ", extensions: ["rz"], mimes: [] },
  { label: "TAR", extensions: ["tar"], mimes: ["application/x-tar"] },
  { label: "TAR.7Z", extensions: ["tar.7z"], mimes: [] },
  { label: "TAR.BZ", extensions: ["tar.bz"], mimes: [] },
  { label: "TAR.BZ2", extensions: ["tar.bz2"], mimes: [] },
  { label: "TAR.GZ", extensions: ["tar.gz"], mimes: [] },
  { label: "TAR.LZO", extensions: ["tar.lzo"], mimes: [] },
  { label: "TAR.XZ", extensions: ["tar.xz"], mimes: [] },
  { label: "TAR.Z", extensions: ["tar.z"], mimes: [] },
  { label: "TBZ", extensions: ["tbz"], mimes: [] },
  { label: "TBZ2", extensions: ["tbz2"], mimes: [] },
  { label: "TGZ", extensions: ["tgz"], mimes: [] },
  { label: "TZ", extensions: ["tz"], mimes: [] },
  { label: "TZO", extensions: ["tzo"], mimes: [] },
  { label: "XZ", extensions: ["xz"], mimes: [] },
  { label: "Z", extensions: ["z"], mimes: [] },
  { label: "ZIP", extensions: ["zip"], mimes: ["application/zip"] },
  { label: "3FR", extensions: ["3fr"], mimes: [] },
  { label: "ARW", extensions: ["arw"], mimes: [] },
  { label: "AVIF", extensions: ["avif"], mimes: ["image/avif"] },
  { label: "BMP", extensions: ["bmp"], mimes: ["image/bmp", "image/x-ms-bmp"] },
  { label: "CR2", extensions: ["cr2"], mimes: [] },
  { label: "CR3", extensions: ["cr3"], mimes: [] },
  { label: "CRW", extensions: ["crw"], mimes: [] },
  { label: "DCR", extensions: ["dcr"], mimes: [] },
  { label: "DNG", extensions: ["dng"], mimes: [] },
  { label: "EPS", extensions: ["eps"], mimes: ["application/postscript"] },
  { label: "ERF", extensions: ["erf"], mimes: [] },
  { label: "GIF", extensions: ["gif"], mimes: ["image/gif"] },
  { label: "HEIC", extensions: ["heic"], mimes: ["image/heic"] },
  { label: "HEIF", extensions: ["heif"], mimes: ["image/heif"] },
  { label: "ICNS", extensions: ["icns"], mimes: ["image/icns"] },
  { label: "ICO", extensions: ["ico"], mimes: ["image/x-icon", "image/vnd.microsoft.icon"] },
  { label: "JFIF", extensions: ["jfif"], mimes: ["image/jpeg"] },
  { label: "JPEG", extensions: ["jpeg"], mimes: ["image/jpeg"] },
  { label: "JPG", extensions: ["jpg", "jpeg", "jpe", "jfif"], mimes: ["image/jpeg"] },
  { label: "JXL", extensions: ["jxl"], mimes: ["image/jxl"] },
  { label: "MOS", extensions: ["mos"], mimes: [] },
  { label: "MRW", extensions: ["mrw"], mimes: [] },
  { label: "NEF", extensions: ["nef"], mimes: [] },
  { label: "ODD", extensions: ["odd"], mimes: [] },
  { label: "ODG", extensions: ["odg"], mimes: ["application/vnd.oasis.opendocument.graphics"] },
  { label: "ORF", extensions: ["orf"], mimes: [] },
  { label: "PEF", extensions: ["pef"], mimes: [] },
  { label: "PNG", extensions: ["png"], mimes: ["image/png"] },
  { label: "PPM", extensions: ["ppm"], mimes: ["image/x-portable-pixmap"] },
  { label: "PS", extensions: ["ps"], mimes: ["application/postscript"] },
  { label: "PSB", extensions: ["psb"], mimes: [] },
  { label: "PSD", extensions: ["psd"], mimes: ["image/vnd.adobe.photoshop"] },
  { label: "PUB", extensions: ["pub"], mimes: ["application/x-mspublisher"] },
  { label: "RAF", extensions: ["raf"], mimes: [] },
  { label: "RAW", extensions: ["raw"], mimes: ["image/x-dcraw"] },
  { label: "RW2", extensions: ["rw2"], mimes: [] },
  { label: "SVG", extensions: ["svg"], mimes: ["image/svg+xml"] },
  { label: "TGA", extensions: ["tga"], mimes: ["image/x-tga"] },
  { label: "TIF", extensions: ["tif", "tiff"], mimes: ["image/tiff"] },
  { label: "TIFF", extensions: ["tif", "tiff"], mimes: ["image/tiff"] },
  { label: "WebP", extensions: ["webp"], mimes: ["image/webp"] },
  { label: "X3F", extensions: ["x3f"], mimes: [] },
  { label: "XCF", extensions: ["xcf"], mimes: ["image/x-xcf"] },
  { label: "XPS", extensions: ["xps"], mimes: ["application/vnd.ms-xpsdocument"] },
  { label: "AAC", extensions: ["aac"], mimes: ["audio/aac"] },
  { label: "AC3", extensions: ["ac3"], mimes: ["audio/ac3"] },
  { label: "AIF", extensions: ["aif"], mimes: ["audio/x-aiff"] },
  { label: "AIFC", extensions: ["aifc"], mimes: ["audio/x-aiff"] },
  { label: "AIFF", extensions: ["aiff"], mimes: ["audio/x-aiff"] },
  { label: "AMR", extensions: ["amr"], mimes: ["audio/amr"] },
  { label: "AU", extensions: ["au"], mimes: ["audio/basic"] },
  { label: "CAF", extensions: ["caf"], mimes: ["audio/x-caf"] },
  { label: "DSS", extensions: ["dss"], mimes: [] },
  { label: "FLAC", extensions: ["flac"], mimes: ["audio/flac"] },
  { label: "M4A", extensions: ["m4a"], mimes: ["audio/mp4"] },
  { label: "M4B", extensions: ["m4b"], mimes: ["audio/mp4"] },
  { label: "MP3", extensions: ["mp3"], mimes: ["audio/mpeg"] },
  { label: "OGA", extensions: ["oga"], mimes: ["audio/ogg"] },
  { label: "OPUS", extensions: ["opus"], mimes: ["audio/opus"] },
  { label: "VOC", extensions: ["voc"], mimes: ["audio/x-voc"] },
  { label: "WAV", extensions: ["wav"], mimes: ["audio/wav"] },
  { label: "WEBA", extensions: ["weba"], mimes: ["audio/webm"] },
  { label: "WMA", extensions: ["wma"], mimes: ["audio/x-ms-wma"] },
  { label: "3G2", extensions: ["3g2"], mimes: ["video/3gpp2"] },
  { label: "3GP", extensions: ["3gp"], mimes: ["video/3gpp"] },
  { label: "3GPP", extensions: ["3gpp"], mimes: ["video/3gpp"] },
  { label: "AVI", extensions: ["avi"], mimes: ["video/x-msvideo"] },
  { label: "CAVS", extensions: ["cavs"], mimes: ["video/cavs"] },
  { label: "DV", extensions: ["dv"], mimes: ["video/x-dv"] },
  { label: "DVR", extensions: ["dvr"], mimes: ["video/x-ms-dvr"] },
  { label: "FLV", extensions: ["flv"], mimes: ["video/x-flv"] },
  { label: "M2TS", extensions: ["m2ts"], mimes: ["video/mp2t"] },
  { label: "M4V", extensions: ["m4v"], mimes: ["video/x-m4v"] },
  { label: "MKV", extensions: ["mkv"], mimes: ["video/x-matroska"] },
  { label: "MOD", extensions: ["mod"], mimes: [] },
  { label: "MOV", extensions: ["mov"], mimes: ["video/quicktime"] },
  { label: "MP4", extensions: ["mp4"], mimes: ["video/mp4"] },
  { label: "MPEG", extensions: ["mpeg"], mimes: ["video/mpeg"] },
  { label: "MPG", extensions: ["mpg"], mimes: ["video/mpeg"] },
  { label: "MTS", extensions: ["mts"], mimes: ["video/mp2t"] },
  { label: "MXF", extensions: ["mxf"], mimes: ["application/mxf"] },
  { label: "OGG", extensions: ["ogg"], mimes: ["video/ogg", "audio/ogg"] },
  { label: "OGV", extensions: ["ogv"], mimes: ["video/ogg"] },
  { label: "RM", extensions: ["rm"], mimes: ["application/vnd.rn-realmedia"] },
  { label: "RMVB", extensions: ["rmvb"], mimes: ["application/vnd.rn-realmedia-vbr"] },
  { label: "SWF", extensions: ["swf"], mimes: ["application/x-shockwave-flash"] },
  { label: "TS", extensions: ["ts"], mimes: ["video/mp2t"] },
  { label: "VOB", extensions: ["vob"], mimes: ["video/x-ms-vob"] },
  { label: "WEBM", extensions: ["webm"], mimes: ["video/webm"] },
  { label: "WMV", extensions: ["wmv"], mimes: ["video/x-ms-wmv"] },
  { label: "WTV", extensions: ["wtv"], mimes: ["video/x-ms-wtv"] },
  { label: "ABW", extensions: ["abw"], mimes: ["application/x-abiword"] },
  { label: "DJVU", extensions: ["djvu"], mimes: ["image/vnd.djvu"] },
  { label: "DOC", extensions: ["doc"], mimes: ["application/msword"] },
  { label: "DOCM", extensions: ["docm"], mimes: ["application/vnd.ms-word.document.macroenabled.12"] },
  { label: "DOCX", extensions: ["docx"], mimes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] },
  { label: "DOT", extensions: ["dot"], mimes: ["application/msword"] },
  { label: "DOTX", extensions: ["dotx"], mimes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.template"] },
  { label: "HTML", extensions: ["html", "htm"], mimes: ["text/html"] },
  { label: "HWP", extensions: ["hwp"], mimes: ["application/x-hwp"] },
  { label: "LWP", extensions: ["lwp"], mimes: ["application/vnd.lotus-wordpro"] },
  { label: "MD", extensions: ["md"], mimes: ["text/markdown"] },
  { label: "ODT", extensions: ["odt"], mimes: ["application/vnd.oasis.opendocument.text"] },
  { label: "PAGES", extensions: ["pages"], mimes: ["application/vnd.apple.pages"] },
  { label: "PDF", extensions: ["pdf"], mimes: ["application/pdf"] },
  { label: "RST", extensions: ["rst"], mimes: ["text/x-rst"] },
  { label: "RTF", extensions: ["rtf"], mimes: ["application/rtf"] },
  { label: "TEX", extensions: ["tex"], mimes: ["application/x-tex"] },
  { label: "TXT", extensions: ["txt"], mimes: ["text/plain"] },
  { label: "WPD", extensions: ["wpd"], mimes: ["application/vnd.wordperfect"] },
  { label: "WPS", extensions: ["wps"], mimes: ["application/vnd.ms-works"] },
  { label: "ZABW", extensions: ["zabw"], mimes: ["application/x-abiword"] },
  { label: "AZW", extensions: ["azw"], mimes: ["application/vnd.amazon.ebook"] },
  { label: "AZW3", extensions: ["azw3"], mimes: ["application/vnd.amazon.ebook"] },
  { label: "AZW4", extensions: ["azw4"], mimes: ["application/vnd.amazon.ebook"] },
  { label: "CBC", extensions: ["cbc"], mimes: [] },
  { label: "CBR", extensions: ["cbr"], mimes: ["application/x-cbr"] },
  { label: "CBZ", extensions: ["cbz"], mimes: ["application/x-cbz"] },
  { label: "CHM", extensions: ["chm"], mimes: ["application/vnd.ms-htmlhelp"] },
  { label: "EPUB", extensions: ["epub"], mimes: ["application/epub+zip"] },
  { label: "FB2", extensions: ["fb2"], mimes: ["application/x-fictionbook+xml"] },
  { label: "HTM", extensions: ["htm"], mimes: ["text/html"] },
  { label: "HTMLZ", extensions: ["htmlz"], mimes: [] },
  { label: "LIT", extensions: ["lit"], mimes: ["application/x-ms-reader"] },
  { label: "LRF", extensions: ["lrf"], mimes: ["application/x-sony-bbeb"] },
  { label: "MOBI", extensions: ["mobi"], mimes: ["application/x-mobipocket-ebook"] },
  { label: "PDB", extensions: ["pdb"], mimes: ["application/vnd.palm"] },
  { label: "PML", extensions: ["pml"], mimes: [] },
  { label: "PRC", extensions: ["prc"], mimes: ["application/x-mobipocket-ebook"] },
  { label: "RB", extensions: ["rb"], mimes: [] },
  { label: "SNB", extensions: ["snb"], mimes: [] },
  { label: "TCR", extensions: ["tcr"], mimes: [] },
  { label: "TXTZ", extensions: ["txtz"], mimes: [] },
  { label: "DPS", extensions: ["dps"], mimes: ["application/vnd.kingsoft.presentation"] },
  { label: "KEY", extensions: ["key"], mimes: ["application/vnd.apple.keynote"] },
  { label: "ODP", extensions: ["odp"], mimes: ["application/vnd.oasis.opendocument.presentation"] },
  { label: "POT", extensions: ["pot"], mimes: ["application/vnd.ms-powerpoint"] },
  { label: "POTX", extensions: ["potx"], mimes: ["application/vnd.openxmlformats-officedocument.presentationml.template"] },
  { label: "PPS", extensions: ["pps"], mimes: ["application/vnd.ms-powerpoint"] },
  { label: "PPSX", extensions: ["ppsx"], mimes: ["application/vnd.openxmlformats-officedocument.presentationml.slideshow"] },
  { label: "PPT", extensions: ["ppt"], mimes: ["application/vnd.ms-powerpoint"] },
  { label: "PPTM", extensions: ["pptm"], mimes: ["application/vnd.ms-powerpoint.presentation.macroEnabled.12"] },
  { label: "PPTX", extensions: ["pptx"], mimes: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"] },
  { label: "CSV", extensions: ["csv"], mimes: ["text/csv"] },
  { label: "ET", extensions: ["et"], mimes: ["application/vnd.kingsoft.spreadsheet"] },
  { label: "NUMBERS", extensions: ["numbers"], mimes: ["application/vnd.apple.numbers"] },
  { label: "ODS", extensions: ["ods"], mimes: ["application/vnd.oasis.opendocument.spreadsheet"] },
  { label: "XLS", extensions: ["xls"], mimes: ["application/vnd.ms-excel"] },
  { label: "XLSM", extensions: ["xlsm"], mimes: ["application/vnd.ms-excel.sheet.macroEnabled.12"] },
  { label: "XLSX", extensions: ["xlsx"], mimes: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] },
  { label: "AI", extensions: ["ai"], mimes: ["application/postscript"] },
  { label: "CDR", extensions: ["cdr"], mimes: ["application/coreldraw"] },
  { label: "CGM", extensions: ["cgm"], mimes: ["image/cgm"] },
  { label: "EMF", extensions: ["emf"], mimes: ["image/emf"] },
  { label: "SK", extensions: ["sk"], mimes: ["image/x-skencil"] },
  { label: "SK1", extensions: ["sk1"], mimes: ["image/x-skencil"] },
  { label: "SVGZ", extensions: ["svgz"], mimes: ["image/svg+xml"] },
  { label: "VSD", extensions: ["vsd"], mimes: ["application/vnd.visio"] },
  { label: "WMF", extensions: ["wmf"], mimes: ["image/wmf"] },
];

export const getImageSize = (bytes) => {
  if (!Number.isFinite(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
};

export const validateImageFile = (candidate) => {
  if (!candidate) return "Please choose a file.";
  if (candidate.size > 50 * 1024 * 1024) {
    return "File is too large. Maximum size is 50MB.";
  }

  const extension = candidate.name.split(".").pop()?.toLowerCase() || "";
  const mime = (candidate.type || "").toLowerCase();

  const isSupported = SOURCE_FORMATS.some(
    (format) => format.extensions.includes(extension) || format.mimes.includes(mime)
  );

  if (!isSupported) {
    return "Please upload a supported file format.";
  }

  return "";
};

export const getSourceFormat = (file) => {
  if (!file) {
    return {
      label: "AUTO",
      note: "Upload a file and we will detect the source type automatically.",
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const mime = (file.type || "").toLowerCase();
  const match = SOURCE_FORMATS.find(
    (format) => format.extensions.includes(extension) || format.mimes.includes(mime)
  );

  if (match) {
    return {
      label: match.label,
      note: "Detected automatically from the uploaded file.",
    };
  }

  return {
    label: "FILE",
    note: "Detected automatically from the uploaded file.",
  };
};
