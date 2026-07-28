/**
 * config/constants.js
 *
 * Application-wide constants — supported formats, size limits, and
 * production-grade validation thresholds.
 *
 * All values are configurable via environment variables so staging/prod
 * environments can diverge from development defaults without code changes.
 */
module.exports = {
  // ── Upload size limits ────────────────────────────────────────────────────
  /**
   * Maximum upload file size in bytes.
   * Why: Prevents OOM kills on the Node process and disk exhaustion.
   * Free: 25 MB | Future Premium: 100 MB
   * HTTP 413 if exceeded.
   */
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) || 25 * 1024 * 1024,

  /**
   * Maximum file size for PDF uploads (document tools).
   * Why: PDF parsing is CPU-heavy; large PDFs can stall the worker thread.
   * Free: 50 MB | Future Premium: 200 MB
   */
  MAX_PDF_FILE_SIZE: Number(process.env.MAX_PDF_FILE_SIZE) || 50 * 1024 * 1024,

  /**
   * Maximum number of images in a single batch request.
   * Why: Prevents accidental or malicious resource exhaustion from batch jobs.
   * Recommended: 50 images per batch.
   */
  MAX_FILES_PER_REQUEST: Number(process.env.MAX_FILES_PER_REQUEST) || 1,
  MAX_BATCH_FILES: Number(process.env.MAX_BATCH_FILES) || 50,

  /**
   * Maximum ZIP bundle size for batch downloads.
   * Why: ZIP bombs can decompress to gigabytes, crashing servers or clients.
   * Recommended: 200 MB max ZIP output.
   */
  MAX_ZIP_DOWNLOAD_SIZE: Number(process.env.MAX_ZIP_DOWNLOAD_SIZE) || 200 * 1024 * 1024,

  // ── Image dimension limits ────────────────────────────────────────────────
  /**
   * Maximum allowed width and height in pixels.
   * Why: libvips/Sharp will OOM-crash on 80,000,000 px inputs.
   * Recommended: 20,000 px. Configurable for premium tiers.
   * HTTP 422 if exceeded.
   */
  MAX_IMAGE_WIDTH:  Number(process.env.MAX_IMAGE_WIDTH)  || 20000,
  MAX_IMAGE_HEIGHT: Number(process.env.MAX_IMAGE_HEIGHT) || 20000,

  /**
   * Maximum megapixels (width × height / 1_000_000).
   * Why: Even at 20k x 20k the MP count is 400MP which would OOM.
   *      We separately cap MP at 100 to stay memory-safe.
   * Recommended: 100 MP. HTTP 422 if exceeded.
   */
  MAX_MEGAPIXELS: Number(process.env.MAX_MEGAPIXELS) || 100,

  /**
   * Maximum allowed resize target dimensions.
   * Prevents users resizing to impossible values like 80,000,000 px.
   */
  MAX_RESIZE_WIDTH:  Number(process.env.MAX_RESIZE_WIDTH)  || 20000,
  MAX_RESIZE_HEIGHT: Number(process.env.MAX_RESIZE_HEIGHT) || 20000,

  // ── PDF-specific limits ───────────────────────────────────────────────────
  /**
   * Maximum pages in a PDF document.
   * Why: High page-count PDFs (e.g. 5000 pages) can stall Ghostscript for minutes.
   * Recommended: 150 pages for free tier.
   */
  MAX_PDF_PAGES: Number(process.env.MAX_PDF_PAGES) || 150,

  // ── Filename safety ───────────────────────────────────────────────────────
  /**
   * Maximum filename length.
   * Why: Some filesystems cap at 255 bytes; long filenames can cause path errors.
   * Extremely long filenames can also be used for log-injection attacks.
   */
  MAX_FILENAME_LENGTH: Number(process.env.MAX_FILENAME_LENGTH) || 200,

  // ── Processing timeouts ───────────────────────────────────────────────────
  /**
   * Hard timeout for any single conversion/processing job (ms).
   * Why: Runaway Sharp/Ghostscript jobs must be forcibly killed to
   *      free the CPU and prevent the worker queue from stalling.
   * Recommended: 60 seconds.
   */
  CONVERSION_TIMEOUT_MS: Number(process.env.CONVERSION_TIMEOUT_MS) || 60 * 1000,

  /**
   * Compression quality bounds.
   * Why: A quality of 0 or 101 is nonsensical and may cause Sharp panics.
   */
  MIN_QUALITY: 10,
  MAX_QUALITY: 100,

  /**
   * Maximum animated GIF/WebP frames allowed.
   * Why: A 10,000-frame GIF can take minutes to transcode.
   */
  MAX_ANIMATED_FRAMES: Number(process.env.MAX_ANIMATED_FRAMES) || 500,

  // ── Supported input formats (accepted by Multer) ─────────────────────────
  ALLOWED_IMAGE_EXTENSIONS: [
    ".jpg", ".jpeg", ".png", ".webp", ".avif",
    ".heic", ".heif", ".bmp", ".gif", ".tiff", ".tif", ".svg",
    // RAW camera formats
    ".3fr", ".arw", ".cr2", ".cr3", ".crw", ".dcr", ".dng", ".erf",
    ".kdc", ".mdc", ".mef", ".mos", ".mrw", ".nef", ".nrw", ".orf",
    ".pef", ".raf", ".raw", ".rw2", ".srf", ".x3f"
  ],

  ALLOWED_IMAGE_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/heic",
    "image/heif",
    "image/bmp",
    "image/gif",
    "image/tiff",
    "image/svg+xml",
    "image/x-heic",
    "image/x-heif",
    "image/x-canon-cr2",
    "image/x-nikon-nef",
    "image/x-adobe-dng",
    "application/octet-stream", // Fallback for browsers that don't recognize HEIC/RAW MIME types
    "",                         // Allow empty MIME types
  ],

  ALLOWED_PDF_MIME_TYPES: [
    "application/pdf",
    "application/x-pdf",
  ],

  // ── Supported output formats ──────────────────────────────────────────────
  /** Formats that Sharp (libvips) can write natively */
  SHARP_OUTPUT_FORMATS: ["jpeg", "jpg", "png", "webp", "avif", "gif", "tiff", "tif", "heif", "heic"],

  /** RAW camera formats — cannot be produced, only read */
  RAW_FORMATS: [
    "3fr", "arw", "cr2", "cr3", "crw", "dcr", "dng", "erf",
    "kdc", "mdc", "mef", "mos", "mrw", "nef", "nrw", "orf",
    "pef", "raf", "raw", "rw2", "srf", "x3f",
  ],

  /**
   * Dangerous executable/script extensions to always reject,
   * even if they have a valid image MIME type spoofed on top.
   */
  BLOCKED_EXTENSIONS: [
    ".exe", ".bat", ".cmd", ".sh", ".ps1", ".msi", ".dll",
    ".vbs", ".js",  ".ts",  ".php", ".py",  ".rb",  ".pl",
    ".jar", ".war", ".class", ".com", ".scr", ".pif", ".cpl",
    ".inf", ".reg", ".lnk",  ".hta",
  ],

  // ── Rate limiting ─────────────────────────────────────────────────────────
  /** General API rate limit window */
  RATE_LIMIT_WINDOW_MS:  Number(process.env.RATE_LIMIT_WINDOW_MS)      || 15 * 60 * 1000,
  /** Max general requests per IP per window */
  RATE_LIMIT_MAX:        Number(process.env.RATE_LIMIT_MAX_REQUESTS)   || 100,
  /** Max upload/conversion requests per IP per window (stricter) */
  UPLOAD_RATE_LIMIT_MAX: Number(process.env.UPLOAD_RATE_LIMIT_MAX)     || 20,
};
