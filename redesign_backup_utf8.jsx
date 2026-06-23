"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import GoogleDrivePicker from "../../../components/GoogleDrivePicker";
import googleDriveService from "../../../services/googleDriveService";
import DropboxFilePicker from "../../../components/DropboxFilePicker";
import dropboxService from "../../../services/dropboxService";
import OneDrivePicker from "../../../components/OneDrivePicker";
import onedriveService from "../../../services/onedriveService";
import authService from "../../../services/authService";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Download,
  FileImage,
  RefreshCw,
  Sparkles,
  Upload,
  Zap,
  Folder,
  Link2,
  FilePlus,
  Minimize2,
  Crop,
} from "lucide-react";

const googleDriveIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: "12px", flexShrink: 0 }}>
    <path d="M14.3 2.5L22.6 17h-5.2L9.1 2.5h5.2zM7.9 18.5L3.7 11.2l5.2-9L13.1 9.5l-5.2 9zM9.6 18.5h10.3l-4.1-7.2H5.5l4.1 7.2z" opacity="0.8"/>
  </svg>
);

const dropboxIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: "12px", flexShrink: 0 }}>
    <path d="M4 4l6 4-6 4-4-4zm6 8l6-4-6-4-6 4zm6-4l6 4-4 4-6-4zm0 8l6-4-6-4-6 4zm-6.2 1.3l6.2-4.1 6.2 4.1-6.2 4.1z" opacity="0.8"/>
  </svg>
);

const onedriveIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: "12px", flexShrink: 0 }}>
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" opacity="0.8"/>
  </svg>
);

const googleDriveIconLarge = (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M14.3 2.5L22.6 17h-5.2L9.1 2.5h5.2zM7.9 18.5L3.7 11.2l5.2-9L13.1 9.5l-5.2 9zM9.6 18.5h10.3l-4.1-7.2H5.5l4.1 7.2z" />
  </svg>
);

const dropboxIconLarge = (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M4 4l6 4-6 4-4-4zm6 8l6-4-6-4-6 4zm6-4l6 4-4 4-6-4zm0 8l6-4-6-4-6 4zm-6.2 1.3l6.2-4.1 6.2 4.1-6.2 4.1z" />
  </svg>
);

const onedriveIconLarge = (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
  </svg>
);

const INPUT_ACCEPT =
  ".jpg,.jpeg,.jpe,.jfif,.png,.webp,.avif,.gif,.bmp,.ico,.tif,.tiff,.heic,.heif,.jxl,.svg,image/*,.7z,.ace,.alz,.arc,.arj,.bz,.bz2,.cab,.cpio,.deb,.dmg,.gz,.img,.iso,.jar,.lha,.lz,.lzma,.lzo,.rar,.rpm,.rz,.tar,.tar.7z,.tar.bz,.tar.bz2,.tar.gz,.tar.lzo,.tar.xz,.tar.z,.tbz,.tbz2,.tgz,.tz,.tzo,.xz,.z,.zip,.aac,.ac3,.aif,.aifc,.aiff,.amr,.au,.caf,.dss,.flac,.m4a,.m4b,.mp3,.oga,.opus,.voc,.wav,.weba,.wma,.3g2,.3gp,.3gpp,.avi,.cavs,.dv,.dvr,.flv,.m2ts,.m4v,.mkv,.mod,.mov,.mp4,.mpeg,.mpg,.mts,.mxf,.ogg,.ogv,.rm,.rmvb,.swf,.ts,.vob,.webm,.wmv,.wtv,.abw,.djvu,.doc,.docm,.docx,.dot,.dotx,.html,.hwp,.lwp,.md,.odt,.pages,.pdf,.rst,.rtf,.tex,.txt,.wpd,.wps,.zabw,.azw,.azw3,.azw4,.cbc,.cbr,.cbz,.chm,.epub,.fb2,.htm,.htmlz,.lit,.lrf,.mobi,.pdb,.pml,.prc,.rb,.snb,.tcr,.txtz,.dps,.key,.odp,.pot,.potx,.pps,.ppsx,.ppt,.pptm,.pptx,.csv,.et,.numbers,.ods,.xls,.xlsm,.xlsx,.ai,.cdr,.cgm,.emf,.sk,.sk1,.svgz,.vsd,.wmf";

const ALL_FORMAT_CATEGORIES = [
  {
    id: "image",
    label: "Image",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.35)",
    formats: [
      { value: "3fr",  label: "3FR",  note: "Hasselblad Raw" },
      { value: "arw",  label: "ARW",  note: "Sony Raw" },
      { value: "avif", label: "AVIF", note: "Modern compression" },
      { value: "bmp",  label: "BMP",  note: "Bitmap output" },
      { value: "cr2",  label: "CR2",  note: "Canon Raw" },
      { value: "cr3",  label: "CR3",  note: "Canon Raw 3" },
      { value: "crw",  label: "CRW",  note: "Canon Raw CIFF" },
      { value: "dcr",  label: "DCR",  note: "Kodak Raw" },
      { value: "dng",  label: "DNG",  note: "Digital Negative" },
      { value: "eps",  label: "EPS",  note: "PostScript" },
      { value: "erf",  label: "ERF",  note: "Epson Raw" },
      { value: "gif",  label: "GIF",  note: "Animated graphics" },
      { value: "heic", label: "HEIC", note: "Apple photo format" },
      { value: "heif", label: "HEIF", note: "High-efficiency" },
      { value: "icns", label: "ICNS", note: "Apple Icon" },
      { value: "ico",  label: "ICO",  note: "Icon files" },
      { value: "jfif", label: "JFIF", note: "JPEG File Interchange" },
      { value: "jpeg", label: "JPEG", note: "Standard JPEG" },
      { value: "jpg",  label: "JPG",  note: "Best for photos" },
      { value: "jxl",  label: "JXL",  note: "JPEG XL" },
      { value: "mos",  label: "MOS",  note: "Leaf Raw" },
      { value: "mrw",  label: "MRW",  note: "Minolta Raw" },
      { value: "nef",  label: "NEF",  note: "Nikon Raw" },
      { value: "odd",  label: "ODD",  note: "OpenDocument" },
      { value: "odg",  label: "ODG",  note: "OpenDocument Drawing" },
      { value: "orf",  label: "ORF",  note: "Olympus Raw" },
      { value: "pef",  label: "PEF",  note: "Pentax Raw" },
      { value: "png",  label: "PNG",  note: "Transparent & lossless" },
      { value: "ppm",  label: "PPM",  note: "Portable Pixmap" },
      { value: "ps",   label: "PS",   note: "PostScript" },
      { value: "psb",  label: "PSB",  note: "Photoshop Big" },
      { value: "psd",  label: "PSD",  note: "Photoshop format" },
      { value: "pub",  label: "PUB",  note: "MS Publisher" },
      { value: "raf",  label: "RAF",  note: "Fuji Raw" },
      { value: "raw",  label: "RAW",  note: "Camera raw data" },
      { value: "rw2",  label: "RW2",  note: "Panasonic Raw" },
      { value: "svg",  label: "SVG",  note: "Scalable vector" },
      { value: "tga",  label: "TGA",  note: "Truevision TGA" },
      { value: "tif",  label: "TIF",  note: "High fidelity" },
      { value: "tiff", label: "TIFF", note: "High fidelity" },
      { value: "webp", label: "WebP", note: "Small & web-friendly" },
      { value: "x3f",  label: "X3F",  note: "Sigma Raw" },
      { value: "xcf",  label: "XCF",  note: "GIMP Image" },
      { value: "xps",  label: "XPS",  note: "XML Paper Spec" },
    ],
  },
  {
    id: "archive",
    label: "Archive",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.35)",
    formats: [
      { value: "7z",      label: "7Z",      note: "7-Zip archive" },
      { value: "ace",     label: "ACE",     note: "ACE archive" },
      { value: "alz",     label: "ALZ",     note: "ALZ archive" },
      { value: "arc",     label: "ARC",     note: "ARC archive" },
      { value: "arj",     label: "ARJ",     note: "ARJ archive" },
      { value: "bz",      label: "BZ",      note: "Bzip archive" },
      { value: "bz2",     label: "BZ2",     note: "Bzip2 archive" },
      { value: "cab",     label: "CAB",     note: "Windows cabinet" },
      { value: "cpio",    label: "CPIO",    note: "CPIO archive" },
      { value: "deb",     label: "DEB",     note: "Debian package" },
      { value: "dmg",     label: "DMG",     note: "Mac disk image" },
      { value: "gz",      label: "GZ",      note: "Gzip compressed" },
      { value: "img",     label: "IMG",     note: "Disk image" },
      { value: "iso",     label: "ISO",     note: "CD/DVD image" },
      { value: "jar",     label: "JAR",     note: "Java archive" },
      { value: "lha",     label: "LHA",     note: "LHA archive" },
      { value: "lz",      label: "LZ",      note: "Lzip archive" },
      { value: "lzma",    label: "LZMA",    note: "LZMA archive" },
      { value: "lzo",     label: "LZO",     note: "LZO archive" },
      { value: "rar",     label: "RAR",     note: "WinRAR archive" },
      { value: "rpm",     label: "RPM",     note: "Red Hat package" },
      { value: "rz",      label: "RZ",      note: "Rzip archive" },
      { value: "tar",     label: "TAR",     note: "Unix archive" },
      { value: "tar.7z",  label: "TAR.7Z",  note: "Tar 7-Zip" },
      { value: "tar.bz",  label: "TAR.BZ",  note: "Tar Bzip" },
      { value: "tar.bz2", label: "TAR.BZ2", note: "Tar Bzip2" },
      { value: "tar.gz",  label: "TAR.GZ",  note: "Tar Gzip" },
      { value: "tar.lzo", label: "TAR.LZO", note: "Tar LZO" },
      { value: "tar.xz",  label: "TAR.XZ",  note: "Tar XZ" },
      { value: "tar.z",   label: "TAR.Z",   note: "Tar Z" },
      { value: "tbz",     label: "TBZ",     note: "Tar Bzip" },
      { value: "tbz2",    label: "TBZ2",    note: "Tar Bzip2" },
      { value: "tgz",     label: "TGZ",     note: "Tar Gzip" },
      { value: "tz",      label: "TZ",      note: "Tar Z" },
      { value: "tzo",     label: "TZO",     note: "Tar LZO" },
      { value: "xz",      label: "XZ",      note: "XZ archive" },
      { value: "z",       label: "Z",       note: "Z archive" },
      { value: "zip",     label: "ZIP",     note: "Universal archive" },
    ],
  },
  {
    id: "audio",
    label: "Audio",
    color: "#10b981",
    glow: "rgba(16,185,129,0.35)",
    formats: [
      { value: "aac",  label: "AAC",  note: "Apple audio" },
      { value: "ac3",  label: "AC3",  note: "Dolby Digital" },
      { value: "aif",  label: "AIF",  note: "AIFF audio" },
      { value: "aifc", label: "AIFC", note: "Compressed AIFF" },
      { value: "aiff", label: "AIFF", note: "Apple lossless" },
      { value: "amr",  label: "AMR",  note: "Voice audio" },
      { value: "au",   label: "AU",   note: "Sun audio" },
      { value: "caf",  label: "CAF",  note: "Core Audio" },
      { value: "dss",  label: "DSS",  note: "Digital Speech" },
      { value: "flac", label: "FLAC", note: "Lossless HD audio" },
      { value: "m4a",  label: "M4A",  note: "Apple MPEG4 audio" },
      { value: "m4b",  label: "M4B",  note: "MPEG4 audiobook" },
      { value: "midi", label: "MIDI", note: "Musical notation" },
      { value: "mp3",  label: "MP3",  note: "Universal audio" },
      { value: "oga",  label: "OGA",  note: "Ogg audio" },
      { value: "ogg",  label: "OGG",  note: "Open source audio" },
      { value: "opus", label: "OPUS", note: "Web audio codec" },
      { value: "voc",  label: "VOC",  note: "Creative Voice" },
      { value: "wav",  label: "WAV",  note: "Lossless audio" },
      { value: "weba", label: "WEBA", note: "WebM audio" },
      { value: "wma",  label: "WMA",  note: "Windows audio" },
    ],
  },
  {
    id: "video",
    label: "Video",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.35)",
    formats: [
      { value: "3g2",  label: "3G2",  note: "Mobile video" },
      { value: "3gp",  label: "3GP",  note: "Mobile video" },
      { value: "3gpp", label: "3GPP", note: "Mobile video" },
      { value: "avi",  label: "AVI",  note: "Windows video" },
      { value: "cavs", label: "CAVS", note: "Chinese audio/video" },
      { value: "dv",   label: "DV",   note: "Digital video" },
      { value: "dvr",  label: "DVR",  note: "Digital video record" },
      { value: "flv",  label: "FLV",  note: "Flash video" },
      { value: "m2ts", label: "M2TS", note: "Blu-ray video" },
      { value: "m4v",  label: "M4V",  note: "iTunes video" },
      { value: "mkv",  label: "MKV",  note: "Matroska video" },
      { value: "mod",  label: "MOD",  note: "Camcorder video" },
      { value: "mov",  label: "MOV",  note: "Apple QuickTime" },
      { value: "mp4",  label: "MP4",  note: "Universal video" },
      { value: "mpeg", label: "MPEG", note: "MPEG video" },
      { value: "mpg",  label: "MPG",  note: "MPEG video" },
      { value: "mts",  label: "MTS",  note: "AVCHD video" },
      { value: "mxf",  label: "MXF",  note: "Material Exchange" },
      { value: "ogg",  label: "OGG",  note: "Ogg video" },
      { value: "ogv",  label: "OGV",  note: "Ogg video" },
      { value: "rm",   label: "RM",   note: "RealMedia" },
      { value: "rmvb", label: "RMVB", note: "RealMedia VBR" },
      { value: "swf",  label: "SWF",  note: "Flash format" },
      { value: "ts",   label: "TS",   note: "Transport stream" },
      { value: "vob",  label: "VOB",  note: "DVD video" },
      { value: "webm", label: "WebM", note: "Web video format" },
      { value: "wmv",  label: "WMV",  note: "Windows media" },
      { value: "wtv",  label: "WTV",  note: "Windows TV" },
    ],
  },
  {
    id: "document",
    label: "Document",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.35)",
    formats: [
      { value: "abw",   label: "ABW",   note: "AbiWord document" },
      { value: "djvu",  label: "DJVU",  note: "DjVu document" },
      { value: "doc",   label: "DOC",   note: "Legacy Word" },
      { value: "docm",  label: "DOCM",  note: "Word macro" },
      { value: "docx",  label: "DOCX",  note: "Word document" },
      { value: "dot",   label: "DOT",   note: "Word template" },
      { value: "dotx",  label: "DOTX",  note: "Word template" },
      { value: "html",  label: "HTML",  note: "Web page" },
      { value: "hwp",   label: "HWP",   note: "Hangul Word" },
      { value: "lwp",   label: "LWP",   note: "Lotus Word Pro" },
      { value: "md",    label: "MD",    note: "Markdown" },
      { value: "odt",   label: "ODT",   note: "OpenDocument text" },
      { value: "pages", label: "PAGES", note: "Apple Pages" },
      { value: "pdf",   label: "PDF",   note: "Portable document" },
      { value: "rst",   label: "RST",   note: "reStructuredText" },
      { value: "rtf",   label: "RTF",   note: "Rich text" },
      { value: "tex",   label: "TEX",   note: "LaTeX document" },
      { value: "txt",   label: "TXT",   note: "Plain text" },
      { value: "wpd",   label: "WPD",   note: "WordPerfect" },
      { value: "wps",   label: "WPS",   note: "Works Word" },
      { value: "zabw",  label: "ZABW",  note: "Compressed AbiWord" },
    ],
  },
  {
    id: "ebook",
    label: "eBook",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.35)",
    formats: [
      { value: "azw",   label: "AZW",   note: "Kindle eBook" },
      { value: "azw3",  label: "AZW3",  note: "Kindle AZW3" },
      { value: "azw4",  label: "AZW4",  note: "Kindle AZW4" },
      { value: "cbc",   label: "CBC",   note: "Comic Book" },
      { value: "cbr",   label: "CBR",   note: "Comic book RAR" },
      { value: "cbz",   label: "CBZ",   note: "Comic book ZIP" },
      { value: "chm",   label: "CHM",   note: "Compiled HTML" },
      { value: "epub",  label: "EPUB",  note: "Standard eBook" },
      { value: "fb2",   label: "FB2",   note: "FictionBook" },
      { value: "htm",   label: "HTM",   note: "HTML eBook" },
      { value: "htmlz", label: "HTMLZ", note: "Zipped HTML" },
      { value: "lit",   label: "LIT",   note: "MS Reader" },
      { value: "lrf",   label: "LRF",   note: "Sony Reader" },
      { value: "mobi",  label: "MOBI",  note: "Kindle format" },
      { value: "pdb",   label: "PDB",   note: "Palm Database" },
      { value: "pml",   label: "PML",   note: "Palm Markup" },
      { value: "prc",   label: "PRC",   note: "Mobipocket" },
      { value: "rb",    label: "RB",    note: "Rocket eBook" },
      { value: "snb",   label: "SNB",   note: "Shanda Bambook" },
      { value: "tcr",   label: "TCR",   note: "Psion eBook" },
      { value: "txtz",  label: "TXTZ",  note: "Zipped Text" },
    ],
  },
  {
    id: "presentation",
    label: "Presentation",
    color: "#f97316",
    glow: "rgba(249,115,22,0.35)",
    formats: [
      { value: "dps",  label: "DPS",  note: "Kingsoft Presentation" },
      { value: "key",  label: "KEY",  note: "Apple Keynote" },
      { value: "odp",  label: "ODP",  note: "OpenDocument" },
      { value: "pot",  label: "POT",  note: "PowerPoint template" },
      { value: "potx", label: "POTX", note: "PowerPoint template" },
      { value: "pps",  label: "PPS",  note: "PowerPoint show" },
      { value: "ppsx", label: "PPSX", note: "PowerPoint show" },
      { value: "ppt",  label: "PPT",  note: "Legacy PowerPoint" },
      { value: "pptm", label: "PPTM", note: "PowerPoint macro" },
      { value: "pptx", label: "PPTX", note: "PowerPoint" },
    ],
  },
  {
    id: "spreadsheet",
    label: "Spreadsheet",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.35)",
    formats: [
      { value: "csv",     label: "CSV",     note: "Comma separated" },
      { value: "et",      label: "ET",      note: "Kingsoft Sheet" },
      { value: "numbers", label: "NUMBERS", note: "Apple Numbers" },
      { value: "ods",     label: "ODS",     note: "OpenDocument sheet" },
      { value: "xls",     label: "XLS",     note: "Legacy Excel" },
      { value: "xlsm",    label: "XLSM",    note: "Excel macro" },
      { value: "xlsx",    label: "XLSX",    note: "Excel spreadsheet" },
    ],
  },
  {
    id: "vector",
    label: "Vector",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.35)",
    formats: [
      { value: "ai",   label: "AI",   note: "Adobe Illustrator" },
      { value: "cdr",  label: "CDR",  note: "CorelDRAW" },
      { value: "cgm",  label: "CGM",  note: "Computer Graphics Metafile" },
      { value: "emf",  label: "EMF",  note: "Enhanced metafile" },
      { value: "sk",   label: "SK",   note: "Sketch" },
      { value: "sk1",  label: "SK1",  note: "sK1 vector" },
      { value: "svg",  label: "SVG",  note: "Scalable vector" },
      { value: "svgz", label: "SVGZ", note: "Compressed SVG" },
      { value: "vsd",  label: "VSD",  note: "Visio drawing" },
      { value: "wmf",  label: "WMF",  note: "Windows metafile" },
    ],
  },
  {
    id: "font",
    label: "Font",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
    formats: [
      { value: "ttf",   label: "TTF",   note: "TrueType font" },
      { value: "otf",   label: "OTF",   note: "OpenType font" },
      { value: "woff",  label: "WOFF",  note: "Web font" },
      { value: "woff2", label: "WOFF2", note: "Modern web font" },
      { value: "eot",   label: "EOT",   note: "Embedded OpenType" },
    ],
  },
  {
    id: "cad",
    label: "CAD",
    color: "#14b8a6",
    glow: "rgba(20,184,166,0.35)",
    formats: [
      { value: "dwg", label: "DWG", note: "AutoCAD drawing" },
      { value: "dxf", label: "DXF", note: "Drawing exchange" },
      { value: "dwf", label: "DWF", note: "Design web format" },
      { value: "stl", label: "STL", note: "3D print format" },
      { value: "step", label: "STEP", note: "STEP 3D model" },
    ],
  },
];

// Build flat lookup across ALL categories
const IMAGE_FORMATS = ALL_FORMAT_CATEGORIES.find(c => c.id === "image").formats;
const ALL_FORMATS_FLAT = ALL_FORMAT_CATEGORIES.flatMap(c => c.formats.map(f => ({ ...f, catId: c.id })));
const ALL_FORMAT_LOOKUP = new Map(ALL_FORMATS_FLAT.map(f => [f.value, f]));
const TARGET_FORMAT_LOOKUP = ALL_FORMAT_LOOKUP; // compat alias
const TARGET_FORMAT_GROUPS = [{ label: "Image", items: IMAGE_FORMATS }];
const TARGET_FORMATS = IMAGE_FORMATS;

function TargetFormatSelect({ value, onChange, sourceFormatLabel }) {
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState("");

  const activeCategory = activeCat ? ALL_FORMAT_CATEGORIES.find(c => c.id === activeCat) : null;
  const filtered = search.trim()
    ? ALL_FORMATS_FLAT.filter(f =>
        f.label.toLowerCase().includes(search.toLowerCase()) ||
        f.note.toLowerCase().includes(search.toLowerCase())
      )
    : (activeCategory ? activeCategory.formats : []);

  const current = value ? ALL_FORMAT_LOOKUP.get(value) : null;
  const currentCat = current ? (ALL_FORMAT_CATEGORIES.find(c => c.id === (current.catId || "image")) || ALL_FORMAT_CATEGORIES[0]) : null;

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        borderRadius: "16px",
        border: "1px solid rgba(99,102,241,0.25)",
        background: "linear-gradient(180deg, rgba(14,14,30,0.95) 0%, rgba(10,10,22,0.98) 100%)",
        overflow: "hidden",
        boxShadow: "0 0 40px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Search bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search Format"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.85rem",
            fontFamily: "inherit",
          }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 0, lineHeight: 1 }}
          >Γ£ò</button>
        )}
      </div>

      <div style={{ display: "flex", height: "160px" }}>
        {/* Category sidebar */}
        {!search && (
          <div style={{
            width: "105px",
            flexShrink: 0,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            overflowY: "auto",
            padding: "4px 0",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.1) transparent",
          }}>
            {ALL_FORMAT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCat(cat.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 8px",
                  background: activeCat === cat.id ? `linear-gradient(90deg, ${cat.glow} 0%, transparent 100%)` : "transparent",
                  border: "none",
                  borderLeft: activeCat === cat.id ? `2px solid ${cat.color}` : "2px solid transparent",
                  color: activeCat === cat.id ? cat.color : "rgba(255,255,255,0.55)",
                  fontSize: "0.75rem",
                  fontWeight: activeCat === cat.id ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                <span>{cat.label}</span>
                {activeCat === cat.id && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Format chips grid */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "6px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(65px, 1fr))",
          gridAutoRows: "28px",
          gap: "5px",
          alignContent: "start",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent",
        }}>
          {!activeCat && !search ? (
            <div style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "rgba(255,255,255,0.25)", fontSize: "0.82rem", padding: "24px 16px", textAlign: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
              </svg>
              <span>Select a category<br/>to see output formats</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", padding: "20px" }}>
              No formats found
            </div>
          ) : (
            filtered.map(fmt => {
              const isSelected = value === fmt.value;
              const isSameAsSource = sourceFormatLabel && fmt.label.toUpperCase() === sourceFormatLabel.toUpperCase();
              const fmtCat = ALL_FORMAT_CATEGORIES.find(c => c.id === (fmt.catId || activeCat)) || ALL_FORMAT_CATEGORIES[0];
              return (
                <button
                  key={fmt.value}
                  id={`fmt-btn-${fmt.value}`}
                  type="button"
                  title={isSameAsSource ? "File is already in this format" : fmt.note}
                  onClick={() => {
                    if (isSameAsSource) {
                      const el = document.getElementById(`fmt-btn-${fmt.value}`);
                      if (el) {
                        el.classList.remove('animate-zigzag');
                        void el.offsetWidth; // trigger reflow
                        el.classList.add('animate-zigzag');
                      }
                      return;
                    }
                    onChange(fmt.value);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: isSelected
                      ? `1.5px solid ${fmtCat.color}`
                      : isSameAsSource
                        ? "1px solid rgba(220, 38, 38, 0.4)"
                        : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    background: isSelected
                      ? `linear-gradient(135deg, ${fmtCat.glow}, rgba(255,255,255,0.03))`
                      : isSameAsSource
                        ? "rgba(220, 38, 38, 0.15)"
                        : "rgba(255,255,255,0.03)",
                    color: isSelected ? fmtCat.color : isSameAsSource ? "rgba(239, 68, 68, 0.9)" : "rgba(255,255,255,0.7)",
                    fontSize: "0.65rem",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: isSameAsSource ? "not-allowed" : "pointer",
                    opacity: isSameAsSource ? 0.9 : 1,
                    transition: "all 0.12s ease",
                    letterSpacing: "0.03em",
                    fontFamily: "Outfit, monospace",
                    boxShadow: isSelected ? `0 0 12px ${fmtCat.glow}` : "none",
                  }}
                >
                  {fmt.label}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Selected format footer */}
      <div style={{
        padding: "8px 14px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: currentCat ? currentCat.color : "rgba(255,255,255,0.2)",
          boxShadow: currentCat ? `0 0 8px ${currentCat.glow}` : "none",
          flexShrink: 0,
          transition: "all 0.2s ease",
        }} />
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
          {current && currentCat ? (
            <>
              Selected: <strong style={{ color: currentCat.color }}>{current.label}</strong>
              {current.note && <span style={{ marginLeft: "6px", opacity: 0.6 }}>ΓÇö {current.note}</span>}
            </>
          ) : (
            <span style={{ fontStyle: "italic" }}>Select a category and output format</span>
          )}
        </span>
      </div>
    </div>
  );
}

const SOURCE_FORMATS = [
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

const getImageSize = (bytes) => {
  if (!Number.isFinite(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
};

const validateImageFile = (candidate) => {
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

const getSourceFormat = (file) => {
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



export default function Hero() {
  const [targetFormat, setTargetFormat] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);
  const outputUrlRef = useRef("");

  const { data: session } = useSession();

  // Cloud/URL upload states
  const [uploadMethod, setUploadMethod] = useState("file"); // "file", "url", "cloud"
  const [cloudProvider, setCloudProvider] = useState(null); // "google-drive", "dropbox", "onedrive"
  const [inputUrl, setInputUrl] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Google Drive Backend states
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [driveEmail, setDriveEmail] = useState("");
  const [checkingDrive, setCheckingDrive] = useState(false);

  // Dropbox Backend states
  const [isDropboxConnected, setIsDropboxConnected] = useState(false);
  const [dropboxEmail, setDropboxEmail] = useState("");
  const [checkingDropbox, setCheckingDropbox] = useState(false);

  // OneDrive Backend states
  const [isOneDriveConnected, setIsOneDriveConnected] = useState(false);
  const [onedriveEmail, setOnedriveEmail] = useState("");
  const [checkingOneDrive, setCheckingOneDrive] = useState(false);

  // Toolkit states (Tools & Subtools)
  const [activeTool, setActiveTool] = useState("convert"); // "convert", "compress", "resize", "crop"
  const [compressionQuality, setCompressionQuality] = useState(80);
  const [resizeMode, setResizeMode] = useState("percent"); // "percent", "custom"
  const [resizePercent, setResizePercent] = useState(50);
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [cropAspect, setCropAspect] = useState("1:1");
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  const getEffectiveToken = () => {
    return session?.accessToken || authService.getToken();
  };

  useEffect(() => {
    if (cloudProvider === "google-drive") {
      const token = getEffectiveToken();
      if (!token) {
        setIsDriveConnected(false);
        setDriveEmail("");
        return;
      }

      setCheckingDrive(true);
      googleDriveService.getStatus(token)
        .then((data) => {
          if (data.success) {
            setIsDriveConnected(data.connected);
            setDriveEmail(data.email || "");
          }
        })
        .catch((err) => {
          console.error("Error loading Drive status:", err);
          setIsDriveConnected(false);
        })
        .finally(() => {
          setCheckingDrive(false);
        });
    }
  }, [cloudProvider, session]);

  useEffect(() => {
    if (cloudProvider === "dropbox") {
      const token = getEffectiveToken();
      if (!token) {
        setIsDropboxConnected(false);
        setDropboxEmail("");
        return;
      }

      setCheckingDropbox(true);
      dropboxService.getStatus(token)
        .then((data) => {
          if (data.success) {
            setIsDropboxConnected(data.connected);
            setDropboxEmail(data.email || "");
          }
        })
        .catch((err) => {
          console.error("Error loading Dropbox status:", err);
          setIsDropboxConnected(false);
        })
        .finally(() => {
          setCheckingDropbox(false);
        });
    }
  }, [cloudProvider, session]);

  useEffect(() => {
    if (cloudProvider === "onedrive") {
      const token = getEffectiveToken();
      if (!token) {
        setIsOneDriveConnected(false);
        setOnedriveEmail("");
        return;
      }

      setCheckingOneDrive(true);
      onedriveService.getStatus(token)
        .then((data) => {
          if (data.success) {
            setIsOneDriveConnected(data.connected);
            setOnedriveEmail(data.email || "");
          }
        })
        .catch((err) => {
          console.error("Error loading OneDrive status:", err);
          setIsOneDriveConnected(false);
        })
        .finally(() => {
          setCheckingOneDrive(false);
        });
    }
  }, [cloudProvider, session]);

  const target = targetFormat ? (ALL_FORMAT_LOOKUP.get(targetFormat) || null) : null;
  const source = getSourceFormat(file);

  const handleUrlLoad = useCallback(async (url) => {
    if (!url) return;
    setIsLoadingUrl(true);
    setError("");
    try {
      if (!/^https?:\/\/.+/i.test(url)) {
        throw new Error("Please enter a valid URL starting with http:// or https://");
      }

      // Try client side fetching
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
      }
      const blob = await response.blob();
      if (!blob.type.startsWith("image/")) {
        throw new Error("URL does not point to a valid image file.");
      }
      const extension = url.split(".").pop()?.split("?")[0] || "png";
      const filename = url.split("/").pop()?.split("?")[0] || `image.${extension}`;
      const loadedFile = new File([blob], filename, { type: blob.type });
      
      handleFile(loadedFile);
      setUploadMethod("file"); // Reset back to file representation
      setInputUrl("");
    } catch (err) {
      console.warn("Direct fetch failed, trying native Image element:", err.message);
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error("CORS policy or invalid image URL prevents loading this image directly in the browser."));
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not create canvas context.");
        ctx.drawImage(img, 0, 0);
        
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!blob) throw new Error("Failed to export canvas to Blob.");
        
        const filename = url.split("/").pop()?.split("?")[0] || "downloaded-image.png";
        const loadedFile = new File([blob], filename, { type: "image/png" });
        
        handleFile(loadedFile);
        setUploadMethod("file");
        setInputUrl("");
      } catch (innerErr) {
        setError(innerErr.message || "Failed to load image from URL. Ensure CORS is enabled on the host.");
      }
    } finally {
      setIsLoadingUrl(false);
    }
  }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearOutputUrl = useCallback(() => {
    if (outputUrlRef.current) {
      URL.revokeObjectURL(outputUrlRef.current);
      outputUrlRef.current = "";
    }
  }, []);

  useEffect(
    () => () => {
      clearOutputUrl();
    },
    [clearOutputUrl]
  );

  const handleFile = useCallback(
    (candidate) => {
      const message = validateImageFile(candidate);
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      if (message) {
        setError(message);
        return;
      }

      clearOutputUrl();
      setError("");
      setResult(null);
      setFile(candidate);
      setProgress(0);
      setConverting(false);




      // Extract image dimensions for scaling UI
      if (candidate) {
        const tempImg = new window.Image();
        const objectUrl = URL.createObjectURL(candidate);
        tempImg.src = objectUrl;
        tempImg.onload = () => {
          setImgWidth(tempImg.naturalWidth);
          setImgHeight(tempImg.naturalHeight);
          URL.revokeObjectURL(objectUrl);
        };
      }
    },
    [clearOutputUrl]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragging(false);
      handleFile(event.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const handleConvert = useCallback(async () => {
    if (!file) return;

    setConverting(true);
    setProgress(8);
    setError("");

    let sourceUrl = "";

    try {
      const img = new window.Image();
      sourceUrl = URL.createObjectURL(file);
      img.src = sourceUrl;

      const isImageLoaded = await new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });

      setProgress(40);

      let targetWidth = 0;
      let targetHeight = 0;
      let blob = null;

      const lookupTarget = SOURCE_FORMATS.find(f => f.extensions.includes(target?.value));
      const targetMime = lookupTarget ? lookupTarget.mimes[0] : `image/${target?.value === "jpg" ? "jpeg" : target?.value === "svg" ? "svg+xml" : target?.value || "png"}`;
      const mime = activeTool === "convert" ? targetMime : file.type || "application/octet-stream";
      const ext = activeTool === "convert" ? (lookupTarget ? `.${lookupTarget.extensions[0]}` : `.${target?.value || "png"}`) : "." + (file.name.split(".").pop() || "png");

      if (isImageLoaded) {
        targetWidth = img.naturalWidth;
        targetHeight = img.naturalHeight;

        if (activeTool === "resize") {
          if (resizeMode === "percent") {
            const ratio = resizePercent / 100;
            targetWidth = Math.max(1, Math.round(img.naturalWidth * ratio));
            targetHeight = Math.max(1, Math.round(img.naturalHeight * ratio));
          } else {
            const w = parseInt(customWidth);
            const h = parseInt(customHeight);
            if (w > 0 && h > 0) {
              targetWidth = w;
              targetHeight = h;
            } else if (w > 0) {
              targetWidth = w;
              targetHeight = Math.max(1, Math.round((w / img.naturalWidth) * img.naturalHeight));
            } else if (h > 0) {
              targetHeight = h;
              targetWidth = Math.max(1, Math.round((h / img.naturalHeight) * img.naturalWidth));
            }
          }
        }

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.naturalWidth;
        let sourceHeight = img.naturalHeight;

        if (activeTool === "crop") {
          if (cropAspect === "1:1") {
            const size = Math.min(img.naturalWidth, img.naturalHeight);
            sourceX = Math.round((img.naturalWidth - size) / 2);
            sourceY = Math.round((img.naturalHeight - size) / 2);
            sourceWidth = size;
            sourceHeight = size;
            targetWidth = size;
            targetHeight = size;
          } else if (cropAspect === "16:9") {
            const targetRatio = 16 / 9;
            const currentRatio = img.naturalWidth / img.naturalHeight;
            if (currentRatio > targetRatio) {
              sourceHeight = img.naturalHeight;
              sourceWidth = Math.round(img.naturalHeight * targetRatio);
              sourceX = Math.round((img.naturalWidth - sourceWidth) / 2);
            } else {
              sourceWidth = img.naturalWidth;
              sourceHeight = Math.round(img.naturalWidth / targetRatio);
              sourceY = Math.round((img.naturalHeight - sourceHeight) / 2);
            }
            targetWidth = sourceWidth;
            targetHeight = sourceHeight;
          } else if (cropAspect === "4:3") {
            const targetRatio = 4 / 3;
            const currentRatio = img.naturalWidth / img.naturalHeight;
            if (currentRatio > targetRatio) {
              sourceHeight = img.naturalHeight;
              sourceWidth = Math.round(img.naturalHeight * targetRatio);
              sourceX = Math.round((img.naturalWidth - sourceWidth) / 2);
            } else {
              sourceWidth = img.naturalWidth;
              sourceHeight = Math.round(img.naturalWidth / targetRatio);
              sourceY = Math.round((img.naturalHeight - sourceHeight) / 2);
            }
            targetWidth = sourceWidth;
            targetHeight = sourceHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          if (mime === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

          let quality = 0.95;
          if (activeTool === "compress") {
            quality = compressionQuality / 100;
          } else if (mime === "image/jpeg") {
            quality = 0.92;
          }

          blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
        }
      }

      setProgress(75);

      if (!blob) {
        await new Promise(resolve => setTimeout(resolve, 800));
        blob = new Blob([await file.arrayBuffer()], { type: mime });
      }

      let actionSuffix = "";
      if (activeTool === "compress") actionSuffix = "-compressed";
      if (activeTool === "resize") actionSuffix = `-resized-${targetWidth}x${targetHeight}`;
      if (activeTool === "crop") actionSuffix = `-cropped-${cropAspect.replace(":", "x")}`;

      const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");
      const outputName = nameWithoutExt + actionSuffix + ext;
      const outputUrl = URL.createObjectURL(blob);

      clearOutputUrl();
      outputUrlRef.current = outputUrl;

      setResult({
        url: outputUrl,
        name: outputName,
        size: getImageSize(blob.size),
        width: targetWidth,
        height: targetHeight,
      });
      setProgress(100);
    } catch (err) {
      setProgress(0);
      setError(`Failed to process image: ${err?.message || "Unknown error"}`);
    } finally {
      if (sourceUrl) {
        URL.revokeObjectURL(sourceUrl);
      }
      setConverting(false);
    }
  }, [file, activeTool, target, compressionQuality, resizeMode, resizePercent, customWidth, customHeight, cropAspect, clearOutputUrl]);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError("");
    setProgress(0);
    setConverting(false);
    setIsDragging(false);
    setActiveTool("convert");
    setCompressionQuality(80);
    setResizeMode("percent");
    setResizePercent(50);
    setCustomWidth("");
    setCustomHeight("");
    setCropAspect("1:1");
    setImgWidth(0);
    setImgHeight(0);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    clearOutputUrl();
  }, [clearOutputUrl]);

  return (
    <section
      className="relative min-h-screen flex items-start md:items-center overflow-hidden pt-[96px] pb-[36px] sm:pt-[108px] sm:pb-[43px] md:pt-[118px] md:pb-[50px] lg:pt-[128px] lg:pb-[57px] xl:pt-[138px] xl:pb-[64px] 2xl:pt-[148px] 2xl:pb-[72px]"
      style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #121221 55%, #0f1729 100%)",
      }}
    >
      {/* RESPONSIVE SCALING ADDED */}
      <div
        className="hero-orb absolute bg-indigo-500/14 w-[270px] h-[270px] -top-[90px] -left-[80px] sm:w-[324px] sm:h-[324px] sm:-top-[108px] sm:-left-[96px] md:w-[378px] md:h-[378px] md:-top-[126px] md:-left-[112px] lg:w-[432px] lg:h-[432px] lg:-top-[144px] lg:-left-[128px] xl:w-[486px] xl:h-[486px] xl:-top-[162px] xl:-left-[144px] 2xl:w-[540px] 2xl:h-[540px] 2xl:-top-[180px] 2xl:-left-[160px]"
      />
      {/* RESPONSIVE SCALING ADDED */}
      <div
        className="hero-orb absolute bg-cyan-500/10 w-[200px] h-[200px] -bottom-[60px] -right-[60px] sm:w-[240px] sm:h-[240px] sm:-bottom-[72px] sm:-right-[72px] md:w-[280px] md:h-[280px] md:-bottom-[84px] md:-right-[84px] lg:w-[320px] lg:h-[320px] lg:-bottom-[96px] lg:-right-[96px] xl:w-[360px] xl:h-[360px] xl:-bottom-[108px] xl:-right-[108px] 2xl:w-[400px] 2xl:h-[400px] 2xl:-bottom-[120px] 2xl:-right-[120px]"
        style={{
          animationDelay: "2s",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 42%, transparent 80%)",
        }}
      />

      {/* RESPONSIVE SCALING ADDED */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16" style={{ position: "relative", zIndex: 1 }}>
        {/* RESPONSIVE SCALING ADDED */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-[24px] sm:gap-[28px] md:gap-[32px] lg:gap-[36px] xl:gap-[38px] 2xl:gap-[40px] w-full"
        >
          <div className="w-full md:flex-[1_1_50%] max-w-full md:max-w-[448px] lg:max-w-[512px] xl:max-w-[576px] 2xl:max-w-[640px]">
            <div style={{ marginBottom: "24px" }}>
              <span className="badge" style={{ fontSize: "0.78rem" }}>
                <Sparkles size={12} />
                Convert directly in your browser
              </span>
            </div>

            {/* RESPONSIVE SCALING ADDED */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-7xl font-bold" style={{ marginBottom: "16px", letterSpacing: "-0.04em", lineHeight: 1.1, fontFamily: "Outfit, sans-serif" }}>
              Convert Any Image
              <br />
              <span className="text-gradient">without the clutter</span>
            </h1>

            {/* RESPONSIVE SCALING ADDED */}
            <p
              className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-xl"
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                maxWidth: "560px",
                marginBottom: "28px",
              }}
            >
              Upload any image, let the source type detect itself, pick from a wide range of output
              formats, and download the result instantly. No account, no server upload, and no extra steps.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
              {["Auto detect", "Browser only", "Fast output"].map((item) => (
                <span
                  key={item}
                  className="tag"
                  style={{
                    padding: "6px 12px",
                    fontSize: "0.75rem",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link href="/tools" className="btn btn-secondary btn-lg">
                <FileImage size={18} />
                Browse Tools
              </Link>
              <a href="#converter-panel" className="btn btn-primary btn-lg">
                <Zap size={18} />
                Start Converting
              </a>
            </div>
          </div>

          {/* RESPONSIVE SCALING ADDED */}
          <div id="converter-panel" className="w-full md:flex-[1_1_50%] max-w-[320px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[440px] 2xl:max-w-[460px] mx-auto mt-0 md:-mt-[70px] lg:-mt-[80px] xl:-mt-[90px] 2xl:-mt-[100px]">
            <div
              style={{
                borderRadius: "28px",
                border: "1px solid rgba(99,102,241,0.18)",
                background: "linear-gradient(180deg, rgba(18,18,33,0.92) 0%, rgba(14,14,26,0.98) 100%)",
                boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                padding: "20px",
              }}
            >

              <div
                className={`upload-zone ${isDragging ? "drag-over" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  setUploadMethod("file");
                  handleDrop(e);
                }}
                style={{
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: isDragging ? "rgba(99,102,241,0.9)" : "rgba(255,255,255,0.08)",
                  background: isDragging
                    ? "linear-gradient(180deg, rgba(99,102,241,0.16) 0%, rgba(6,182,212,0.05) 100%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)",
                  cursor: "default",
                  minHeight: file && !result ? "auto" : "360px",
                  padding: file && !result ? "16px" : "34px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept={INPUT_ACCEPT}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  aria-hidden="true"
                  style={{ display: "none" }}
                />

                {!file && !result ? (
                  uploadMethod === "url" ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "16px",
                        textAlign: "center",
                        width: "100%",
                        maxWidth: "420px",
                        padding: "20px 10px"
                      }}
                    >
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "18px",
                          background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.1))",
                          border: "1px solid rgba(6,182,212,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--secondary)",
                        }}
                      >
                        <Link2 size={28} />
                      </div>
                      
                      <div style={{ width: "100%" }}>
                        <p
                          style={{
                            fontFamily: "Outfit, sans-serif",
                            fontWeight: 700,
                            fontSize: "1.22rem",
                            color: "var(--text-primary)",
                            marginBottom: "6px",
                          }}
                        >
                          Load image from URL
                        </p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginBottom: "16px" }}>
                          Enter the public direct link to an image file.
                        </p>
                        
                        <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                          <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleUrlLoad(inputUrl);
                              }
                            }}
                            className="form-input"
                            style={{ flex: 1, textAlign: "center" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "12px", width: "100%", justifyContent: "center" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ minWidth: "100px", justifyContent: "center" }}
                          onClick={() => {
                            setUploadMethod("file");
                            setInputUrl("");
                            setError("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ minWidth: "120px", justifyContent: "center" }}
                          disabled={isLoadingUrl || !inputUrl}
                          onClick={() => handleUrlLoad(inputUrl)}
                        >
                          {isLoadingUrl ? (
                            <>
                              <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />
                              Loading...
                            </>
                          ) : (
                            "Load Image"
                          )}
                        </button>
                      </div>
                    </div>
                  ) : uploadMethod === "cloud" ? (
                    (checkingDrive || checkingDropbox || checkingOneDrive) ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }} onClick={(e) => e.stopPropagation()}>
                        <RefreshCw size={24} className="animate-spin" style={{ color: "var(--primary-light)" }} />
                        <p style={{ margin: "10px 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Checking connection status...</p>
                      </div>
                    ) : cloudProvider === "google-drive" && isDriveConnected ? (
                      <div style={{ width: "100%", maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
                        <GoogleDrivePicker
                          onFileSelected={async (file) => {
                            handleFile(file);
                            setUploadMethod("file");
                            setCloudProvider(null);
                          }}
                          onCancel={() => {
                            setUploadMethod("file");
                            setCloudProvider(null);
                            setError("");
                          }}
                        />
                      </div>
                    ) : cloudProvider === "dropbox" && isDropboxConnected ? (
                      <div style={{ width: "100%", maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
                        <DropboxFilePicker
                          onFileSelected={async (file) => {
                            handleFile(file);
                            setUploadMethod("file");
                            setCloudProvider(null);
                          }}
                          onCancel={() => {
                            setUploadMethod("file");
                            setCloudProvider(null);
                            setError("");
                          }}
                        />
                      </div>
                    ) : cloudProvider === "onedrive" && isOneDriveConnected ? (
                      <div style={{ width: "100%", maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
                        <OneDrivePicker
                          onFileSelected={async (file) => {
                            handleFile(file);
                            setUploadMethod("file");
                            setCloudProvider(null);
                          }}
                          onCancel={() => {
                            setUploadMethod("file");
                            setCloudProvider(null);
                            setError("");
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "16px",
                          textAlign: "center",
                          width: "100%",
                          maxWidth: "420px",
                          padding: "20px 10px"
                        }}
                      >
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "18px",
                            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1))",
                            border: "1px solid rgba(99,102,241,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary-light)",
                          }}
                        >
                          {cloudProvider === "google-drive" ? googleDriveIconLarge : 
                           cloudProvider === "dropbox" ? dropboxIconLarge : 
                           onedriveIconLarge}
                        </div>

                        <div>
                          <p
                            style={{
                              fontFamily: "Outfit, sans-serif",
                              fontWeight: 700,
                              fontSize: "1.22rem",
                              color: "var(--text-primary)",
                              marginBottom: "6px",
                              textTransform: "capitalize"
                            }}
                          >
                            Connect to {cloudProvider?.replace("-", " ")}
                          </p>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "16px" }}>
                            Authorize your account to browse and convert files directly from your cloud storage.
                          </p>
                        </div>


                        <div style={{ display: "flex", gap: "12px", width: "100%", justifyContent: "center" }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ minWidth: "100px", justifyContent: "center" }}
                            onClick={() => {
                              setUploadMethod("file");
                              setCloudProvider(null);
                              setError("");
                            }}
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ minWidth: "160px", justifyContent: "center" }}
                            onClick={async () => {
                              const token = getEffectiveToken();
                              if (!token) {
                                setError("Please log in to your account first.");
                                        return;
                              }
                              if (cloudProvider === "google-drive") {
                                try {
                                  const redirectUri = `${window.location.origin}/dashboard/google-drive/callback`;
                                  const data = await googleDriveService.getAuthUrl(token, redirectUri);
                                  if (data.success && data.url) {
                                    window.location.href = data.url;
                                  } else {
                                    throw new Error("Failed to get authorization URL.");
                                  }
                                } catch (err) {
                                  setError(err.message || "Failed to initiate connection.");
                                }
                              } else if (cloudProvider === "dropbox") {
                                try {
                                  const redirectUri = `${window.location.origin}/dashboard/dropbox/callback`;
                                  const data = await dropboxService.getAuthUrl(token, redirectUri);
                                  if (data.success && data.url) {
                                    window.location.href = data.url;
                                  } else {
                                    throw new Error("Failed to get authorization URL.");
                                  }
                                } catch (err) {
                                  setError(err.message || "Failed to initiate connection.");
                                }
                              } else if (cloudProvider === "onedrive") {
                                try {
                                  const redirectUri = `${window.location.origin}/dashboard/onedrive/callback`;
                                  const data = await onedriveService.getAuthUrl(token, redirectUri);
                                  if (data.success && data.url) {
                                    window.location.href = data.url;
                                  } else {
                                    throw new Error("Failed to get authorization URL.");
                                  }
                                } catch (err) {
                                  setError(err.message || "Failed to initiate connection.");
                                }
                              } else {
                                setError(`API credentials missing for OneDrive / Microsoft Graph. Please configure your credentials.`);
                              }
                            }}
                          >
                            Connect Account
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "14px",
                        textAlign: "center",
                        maxWidth: "390px",
                      }}
                    >
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "18px",
                          background: "linear-gradient(135deg, rgba(239,68,68,0.24), rgba(248,113,113,0.12))",
                          border: "1px solid rgba(239,68,68,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fca5a5",
                        }}
                      >
                        <Upload size={28} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: "Outfit, sans-serif",
                            fontWeight: 700,
                            fontSize: "1.22rem",
                            color: "var(--text-primary)",
                            marginBottom: "6px",
                          }}
                        >
                          Drop your file here
                        </p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                          Upload a file and we will detect the source format automatically, then let you choose
                          the output type.
                        </p>
                      </div>
                      
                      <div style={{ position: "relative", zIndex: 100 }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="btn btn-primary btn-lg"
                          style={{ 
                            justifyContent: "space-between", 
                            minWidth: "200px",
                            gap: "12px",
                          }}
                          onClick={() => {
                            setIsDropdownOpen((prev) => !prev);
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FilePlus size={18} />
                            Select File
                          </span>
                          <ChevronDown 
                            size={16} 
                            style={{ 
                              transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.2s ease"
                            }} 
                          />
                        </button>
                        
                        {isDropdownOpen && (
                          <>
                            <div 
                              onClick={() => setIsDropdownOpen(false)}
                              style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 98,
                                cursor: "default"
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                bottom: "calc(100% + 10px)",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "220px",
                                background: "var(--bg-card)",
                                border: "1px solid var(--border)",
                                borderRadius: "16px",
                                padding: "6px",
                                boxShadow: "var(--shadow-lg), 0 0 30px rgba(99,102,241,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px",
                                zIndex: 99,
                              }}
                            >
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  inputRef.current?.click();
                                }}
                              >
                                <Folder size={16} style={{ marginRight: "12px", color: "var(--primary-light)", flexShrink: 0 }} />
                                From my computer
                              </button>
                              
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  setUploadMethod("url");
                                }}
                              >
                                <Link2 size={16} style={{ marginRight: "12px", color: "var(--secondary)", flexShrink: 0 }} />
                                By URL
                              </button>
                              
                              <div style={{ height: "1px", background: "var(--border-light)", margin: "4px 0" }} />
                              
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  setUploadMethod("cloud");
                                  setCloudProvider("google-drive");
                                }}
                              >
                                {googleDriveIcon}
                                From Google Drive
                              </button>
                              
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  setUploadMethod("cloud");
                                  setCloudProvider("dropbox");
                                }}
                              >
                                {dropboxIcon}
                                From Dropbox
                              </button>
                              
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  setUploadMethod("cloud");
                                  setCloudProvider("onedrive");
                                }}
                              >
                                {onedriveIcon}
                                From OneDrive
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                        Common and legacy file formats are supported in a browser-first workflow.
                      </p>
                    </div>
                  )
                ) : result ? (
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "460px",
                      margin: "0 auto",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "16px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "18px",
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.22)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#34d399",
                      }}
                    >
                      <CheckCircle size={28} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "#34d399", marginBottom: "6px" }}>
                        Conversion Successful
                      </p>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        {result.name} | {result.size} | {result.width}x{result.height}px
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                      <a
                        href={result.url}
                        download={result.name}
                        className="btn btn-primary btn-lg"
                        style={{ justifyContent: "center" }}
                      >
                        <Download size={18} />
                        Download {target?.label || targetFormat.toUpperCase()}
                      </a>
                      <button onClick={reset} className="btn btn-secondary btn-lg">
                        Convert Another
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      margin: "0 auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "rgba(99,102,241,0.16)",
                            border: "1px solid rgba(99,102,241,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary-light)",
                            flexShrink: 0,
                          }}
                        >
                          <FileImage size={18} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              marginBottom: "2px",
                              fontSize: "0.95rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {file.name}
                          </p>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                            {getImageSize(file.size)} | Source {source.label} | Ready to convert to {target?.label || "a selected format"}
                          </p>
                        </div>
                      </div>
                      <button onClick={reset} className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem", height: "auto", minHeight: "28px", borderRadius: "8px" }}>
                        Change file
                      </button>
                    </div>

                    {/* Tool Selector Tabs */}
                    <div style={{ display: "flex", gap: "4px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "4px" }}>
                      {[
                        {
                          id: "convert", label: "Convert",
                          color: "#6366f1", glow: "rgba(99,102,241,0.3)",
                          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                        },
                        {
                          id: "compress", label: "Compress",
                          color: "#f59e0b", glow: "rgba(245,158,11,0.3)",
                          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        },
                        {
                          id: "resize", label: "Resize",
                          color: "#06b6d4", glow: "rgba(6,182,212,0.3)",
                          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                        },
                        {
                          id: "crop", label: "Crop",
                          color: "#ec4899", glow: "rgba(236,72,153,0.3)",
                          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>
                        },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setActiveTool(t.id)}
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            padding: "6px 4px",
                            border: activeTool === t.id ? `1.5px solid ${t.color}` : "1.5px solid transparent",
                            borderRadius: "10px",
                            background: activeTool === t.id ? t.glow : "transparent",
                            color: activeTool === t.id ? t.color : "rgba(255,255,255,0.45)",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                            transition: "all 0.18s ease",
                            boxShadow: activeTool === t.id ? `0 0 14px ${t.glow}` : "none",
                            fontFamily: "Outfit, sans-serif",
                          }}
                        >
                          {t.icon}
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Tool configurations */}
                    {activeTool === "convert" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Select output format
                        </span>
                        <TargetFormatSelect value={targetFormat} onChange={setTargetFormat} sourceFormatLabel={source.label} />
                      </div>
                    )}

                    {activeTool === "compress" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "12px" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Compression settings
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                            <span>Quality:</span>
                            <strong>{compressionQuality}%</strong>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={compressionQuality}
                            onChange={(e) => setCompressionQuality(parseInt(e.target.value))}
                            style={{
                              width: "100%",
                              accentColor: "var(--primary-light)",
                              cursor: "pointer"
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {[
                            { label: "Max Compress", value: 30 },
                            { label: "Balanced", value: 75 },
                            { label: "High Quality", value: 95 }
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setCompressionQuality(preset.value)}
                              style={{
                                flex: 1,
                                padding: "6px 8px",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "8px",
                                background: compressionQuality === preset.value ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
                                color: compressionQuality === preset.value ? "var(--primary-light)" : "var(--text-muted)",
                                fontSize: "0.72rem",
                                cursor: "pointer"
                              }}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTool === "resize" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "12px" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Resize dimensions
                        </span>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                            <input
                              type="radio"
                              name="resizeMode"
                              checked={resizeMode === "percent"}
                              onChange={() => setResizeMode("percent")}
                              style={{ accentColor: "var(--primary-light)" }}
                            />
                            Scale %
                          </label>
                          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                            <input
                              type="radio"
                              name="resizeMode"
                              checked={resizeMode === "custom"}
                              onChange={() => setResizeMode("custom")}
                              style={{ accentColor: "var(--primary-light)" }}
                            />
                            Custom Px
                          </label>
                        </div>

                        {resizeMode === "percent" ? (
                          <div style={{ display: "flex", gap: "8px" }}>
                            {[25, 50, 75].map((pct) => (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => setResizePercent(pct)}
                                style={{
                                  flex: 1,
                                  padding: "8px",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  borderRadius: "10px",
                                  background: resizePercent === pct ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
                                  color: resizePercent === pct ? "var(--primary-light)" : "var(--text-primary)",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  cursor: "pointer"
                                }}
                              >
                                {pct}% Size
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Width (px):</span>
                              <input
                                type="number"
                                placeholder={imgWidth ? `${imgWidth}px` : "Width"}
                                value={customWidth}
                                onChange={(e) => setCustomWidth(e.target.value)}
                                style={{
                                  padding: "8px 12px",
                                  background: "rgba(0,0,0,0.2)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  borderRadius: "10px",
                                  color: "white",
                                  fontSize: "0.85rem",
                                  outline: "none"
                                }}
                              />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Height (px):</span>
                              <input
                                type="number"
                                placeholder={imgHeight ? `${imgHeight}px` : "Height"}
                                value={customHeight}
                                onChange={(e) => setCustomHeight(e.target.value)}
                                style={{
                                  padding: "8px 12px",
                                  background: "rgba(0,0,0,0.2)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  borderRadius: "10px",
                                  color: "white",
                                  fontSize: "0.85rem",
                                  outline: "none"
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTool === "crop" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "12px" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Crop Aspect Ratio (Centered)
                        </span>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                          {[
                            { label: "Square 1:1", value: "1:1" },
                            { label: "Widescreen 16:9", value: "16:9" },
                            { label: "Classic 4:3", value: "4:3" }
                          ].map((aspect) => (
                            <button
                              key={aspect.value}
                              type="button"
                              onClick={() => setCropAspect(aspect.value)}
                              style={{
                                padding: "8px 4px",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "10px",
                                background: cropAspect === aspect.value ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
                                color: cropAspect === aspect.value ? "var(--primary-light)" : "var(--text-primary)",
                                fontSize: "0.75rem",
                                fontWeight: cropAspect === aspect.value ? 600 : 500,
                                cursor: "pointer",
                                textAlign: "center"
                              }}
                            >
                              {aspect.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {converting && (
                      <div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                          Processing... {progress}%
                        </p>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${progress}%`, transition: "width 0.25s ease" }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleConvert}
                      disabled={converting || (activeTool === "convert" && !targetFormat)}
                      className="btn btn-primary btn-lg"
                      style={{ justifyContent: "center", opacity: (activeTool === "convert" && !targetFormat) ? 0.5 : 1 }}
                    >
                      {converting ? (
                        <>
                          <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                          Processing...
                        </>
                      ) : activeTool === "convert" ? (
                        targetFormat ? (
                          <>
                            <RefreshCw size={18} />
                            Convert to {target?.label || targetFormat.toUpperCase()}
                          </>
                        ) : (
                          <>
                            <RefreshCw size={18} />
                            Select output format first
                          </>
                        )
                      ) : activeTool === "compress" ? (
                        <>
                          <Minimize2 size={18} />
                          Compress Image ({compressionQuality}%)
                        </>
                      ) : activeTool === "resize" ? (
                        <>
                          <Zap size={18} />
                          Resize Image ({resizeMode === "percent" ? `${resizePercent}%` : `${customWidth || imgWidth || 0}x${customHeight || imgHeight || 0}px`})
                        </>
                      ) : (
                        <>
                          <Crop size={18} />
                          Crop Image ({cropAspect})
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div
                  style={{
                    marginTop: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.28)",
                    borderRadius: "12px",
                    color: "#fca5a5",
                    fontSize: "0.875rem",
                  }}
                >
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
