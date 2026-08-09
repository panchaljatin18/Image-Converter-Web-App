"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders, AlertCircle, Info, Shield, Zap, Sparkles } from "lucide-react";
import Button from "@/components/Button";
import { useConversionLimit } from "@/context/ConversionLimitContext";
import { downloadFile } from "@/lib/downloadFile";

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function PNGToWebPTool() {
  const { checkConversionLimit, incrementConversionCount } = useConversionLimit();
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(80);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const collapseUploadAfterSelection = true;

  const handleFileSelect = (selectedFile) => {
    setErrorMessage("");
    if (!selectedFile) return;

    // 1. File Type Validation
    const isPngType = selectedFile.type === "image/png" || selectedFile.name.toLowerCase().endsWith(".png");
    if (!isPngType) {
      setErrorMessage("Invalid file type. Please upload a valid PNG (.png) image.");
      setFile(null);
      return;
    }

    // 2. File Size Validation (Max 50MB)
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please upload a smaller file.`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const uploaderActivity = converting
    ? {
        state: "processing",
        label: "Encoding PNG to WebP",
        detail: "Preserving alpha transparency & compressing image pixels",
        progress,
      }
    : file
      ? {
          state: "ready",
          label: "PNG Image selected",
          detail: `${(file.size / (1024 * 1024)).toFixed(2)} MB · Ready to convert`,
        }
      : null;

  const handleConvert = useCallback(async () => {
    if (!file) return;
    if (!checkConversionLimit()) return;
    setConverting(true);
    setProgress(20);
    setErrorMessage("");

    try {
      // 1. Browser WebP Encoding Support Feature Detection
      const testCanvas = document.createElement("canvas");
      testCanvas.width = 1;
      testCanvas.height = 1;
      const testUrl = testCanvas.toDataURL("image/webp");
      if (!testUrl.startsWith("data:image/webp")) {
        throw new Error("Your browser doesn't support WebP export. Please use Chrome, Firefox, Edge, or Safari 14+.");
      }

      setProgress(40);

      // 2. Client-side HTML5 Canvas API WebP encoding (preserves PNG transparency)
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Corrupt or invalid PNG file. Please try another image."));
        img.src = objectUrl;
      });

      URL.revokeObjectURL(objectUrl);
      setProgress(70);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext("2d");
      // Clear canvas to ensure PNG alpha channel transparency is preserved
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const qualityValue = quality / 100;

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("WebP conversion failed. Please try again."));
          },
          "image/webp",
          qualityValue
        );
      });

      setProgress(95);

      const outputUrl = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.png$/i, "");
      const outputName = `${baseName}-converted.webp`;

      const originalSizeKB = file.size / 1024;
      const convertedSizeKB = blob.size / 1024;
      const savings = originalSizeKB > 0
        ? Math.round(((originalSizeKB - convertedSizeKB) / originalSizeKB) * 100)
        : 0;

      const formattedOriginalSize = originalSizeKB >= 1024
        ? `${(originalSizeKB / 1024).toFixed(2)} MB`
        : `${originalSizeKB.toFixed(1)} KB`;

      const formattedConvertedSize = convertedSizeKB >= 1024
        ? `${(convertedSizeKB / 1024).toFixed(2)} MB`
        : `${convertedSizeKB.toFixed(1)} KB`;

      setResult({
        url: outputUrl,
        name: outputName,
        size: formattedConvertedSize,
        originalSize: formattedOriginalSize,
        savings: savings > 0 ? savings : 0,
        width: canvas.width,
        height: canvas.height,
      });

      incrementConversionCount();
      setProgress(100);
    } catch (err) {
      console.error("PNG to WebP Conversion Error:", err);
      setErrorMessage(err.message || "Failed to convert PNG to WebP. Please retry.");
    } finally {
      setConverting(false);
    }
  }, [file, quality, checkConversionLimit, incrementConversionCount]);

  const reset = () => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
    setFile(null);
    setResult(null);
    setProgress(0);
    setErrorMessage("");
  };

  return (
    <div className="max-w-[800px] mx-auto">
      {errorMessage && (
        <div className="p-4 mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle size={20} className="text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!result ? (
        <>
          <ToolUploader
            accept=".png,image/png"
            supportedFormats={["PNG"]}
            title="Drop your PNG image here"
            subtitle="or click to browse — max 50MB files"
            onFilesSelected={handleFileSelect}
            activity={uploaderActivity}
            collapseOnSelect={collapseUploadAfterSelection}
            primaryAction={{
              label: "Convert to WebP",
              loadingLabel: "Converting...",
              icon: RefreshCw,
              onClick: handleConvert,
              disabled: converting || !file,
            }}
          />

          {file && (
            <div className="mt-6">
              {/* Settings Box */}
              <div className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-5">
                <h3 className="flex items-center gap-2 font-bold text-[1rem] mb-5 text-[#f8fafc]">
                  <Sliders size={16} className="text-[#06b6d4]" />
                  WebP Compression & Quality Settings
                </h3>

                <div className="mb-4">
                  <div className="flex justify-between mb-2.5">
                    <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide">
                      WebP Encoding Quality
                    </label>
                    <span className="font-bold text-[#38bdf8] text-[0.9rem]">
                      {quality}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
                    aria-label="WebP quality setting"
                  />
                  <div className="flex justify-between text-[0.75rem] text-[#64748b] mt-1.5 font-mono">
                    <span>10% (Smaller file size)</span>
                    <span>80% (Recommended)</span>
                    <span>100% (Maximum detail)</span>
                  </div>
                </div>

                <div className="p-3.5 bg-cyan-500/8 border border-cyan-500/20 rounded-xl flex items-center gap-2.5 text-xs text-[#94a3b8]">
                  <Sparkles size={16} className="text-[#38bdf8] shrink-0" />
                  <span>
                    <strong>Alpha Transparency Preserved:</strong> PNG transparent backgrounds are kept 100% intact without adding white or solid background fills.
                  </span>
                </div>
              </div>

              {!collapseUploadAfterSelection && (
                <>
                  {converting && (
                    <div className="mb-5">
                      <p className="text-[0.85rem] text-[#64748b] mb-2">
                        Converting PNG to WebP... {progress}%
                      </p>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleConvert}
                    disabled={converting}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] border-[#06b6d4]"
                  >
                    {converting ? (
                      <><RefreshCw size={18} className="animate-spin" /> Encoding WebP...</>
                    ) : (
                      <><RefreshCw size={18} /> Convert PNG to WebP</>
                    )}
                  </Button>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        /* Conversion Result Card */
        <div>
          <div className="p-6 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl mb-6 flex items-center gap-3 shadow-xl">
            <CheckCircle size={24} className="text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-emerald-400 mb-0.5 text-base font-['Outfit']">
                Conversion Successful!
              </p>
              <p className="text-[0.875rem] text-[#94a3b8]">
                {result.name} · {result.size} (was {result.originalSize}) · {result.width}×{result.height}px
                {Number(result.savings) > 0 && (
                  <span className="text-[#34d399] font-bold ml-2">
                    ↓ {result.savings}% smaller
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              className="flex-1 justify-center bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] border-[#06b6d4]"
              disabled={downloading}
              onClick={async () => {
                setDownloading(true);
                await downloadFile(result.url, result.name);
                setDownloading(false);
              }}
            >
              <Download size={18} />
              {downloading ? "Downloading..." : "Download WebP"}
            </Button>
            <Button variant="secondary" size="lg" onClick={reset}>
              Convert Another PNG
            </Button>
          </div>
        </div>
      )}

      {/* Educational & Features Section */}
      <div className="mt-16 border-t border-white/6 pt-12 text-left">
        <h2 className="font-['Outfit'] font-bold text-[1.4rem] mb-6 text-[#f8fafc] flex items-center gap-2">
          <Info size={20} className="text-[#06b6d4]" />
          About PNG to WebP Conversion
        </h2>

        <div className="text-[#94a3b8] text-[0.92rem] leading-[1.8] flex flex-col gap-6">
          <p>
            <strong className="text-[#f8fafc]">Why convert PNG to WebP?</strong>{" "}
            PNG (Portable Network Graphics) is renowned for lossless quality and transparent background support, but it often produces large file sizes that slow down website loading speeds. WebP is Google's next-generation image format designed specifically for the modern web. Converting PNG to WebP produces images that are up to 35% smaller while preserving 100% of visual quality and full alpha transparency.
          </p>
          <p>
            <strong className="text-[#f8fafc]">Preserves PNG Alpha Transparency:</strong>{" "}
            Unlike standard JPG converters that replace transparent regions with solid white backgrounds, our PNG to WebP converter keeps your transparent background layers completely intact. It is ideal for website logos, app icons, digital UI graphics, and web design overlays.
          </p>
        </div>

        <h3 className="font-['Outfit'] font-bold text-[1.2rem] mt-10 mb-5 text-[#f8fafc] flex items-center gap-2">
          <Zap size={18} className="text-[#06b6d4]" />
          Key Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Custom WebP Quality Control</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              Fine-tune the output compression quality slider from 10% to 100%. Optimize file size for web publishing without visible pixelation.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">100% Browser-Based Privacy</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              All image operations run locally in your browser context using the HTML5 Canvas API. No photos are ever uploaded or stored on remote servers.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Alpha Transparency Preserved</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              Transparent layers are automatically preserved in the converted WebP output file without solid color background fills.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Instant File Size Comparison</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              Displays instant KB/MB size savings and percentage reductions as soon as the WebP conversion completes.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <h3 className="font-['Outfit'] font-bold text-[1.2rem] mt-10 mb-6 text-[#f8fafc] flex items-center gap-2">
          <Shield size={18} className="text-[#06b6d4]" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">How do I convert a PNG image to WebP?</h4>
            <p className="text-[#94a3b8] text-[0.875rem] leading-relaxed">
              Drag and drop your .png file into the upload zone or click to select a file from your device. Adjust the quality slider if desired, then click "Convert PNG to WebP". Once processing is complete, click "Download WebP".
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Does WebP support transparent backgrounds?</h4>
            <p className="text-[#94a3b8] text-[0.875rem] leading-relaxed">
              Yes, WebP full alpha channel transparency is supported! Transparent areas in your PNG image will remain 100% transparent in the WebP output file.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Is WebP supported on all browsers and devices?</h4>
            <p className="text-[#94a3b8] text-[0.875rem] leading-relaxed">
              Yes. All modern web browsers (Google Chrome, Mozilla Firefox, Microsoft Edge, Opera, and Apple Safari on iOS 14+ and macOS Big Sur+) fully support WebP images.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">What is the maximum file size limit?</h4>
            <p className="text-[#94a3b8] text-[0.875rem] leading-relaxed">
              You can upload PNG files up to 50MB in size. Because processing happens in your browser sandbox, conversions complete instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
