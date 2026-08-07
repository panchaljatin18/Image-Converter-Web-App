"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders, Info, Shield, Sparkles, Layers, FileImage } from "lucide-react";
import Button from "@/components/Button";
import { useConversionLimit } from "@/context/ConversionLimitContext";
import { downloadFile } from "@/lib/downloadFile";

export default function HeicToJpgTool() {
  const { checkConversionLimit, incrementConversionCount } = useConversionLimit();
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(90);
  const [keepMetadata, setKeepMetadata] = useState(true);
  const [autoOrient, setAutoOrient] = useState(true);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const collapseUploadAfterSelection = true;

  const uploaderActivity = converting
    ? {
        state: "processing",
        label: "Converting HEIC to JPG",
        detail: "Decoding Apple HEVC container and encoding JPG format",
        progress,
      }
    : file
      ? {
          state: "ready",
          label: "HEIC Photo selected",
          detail: "Ready to convert to high-quality JPG",
        }
      : null;

  const handleConvert = useCallback(async () => {
    if (!file) return;
    if (!checkConversionLimit()) return;
    setConverting(true);
    setProgress(10);

    try {
      const { processFileWithBackend } = await import("@/lib/apiClient");

      await processFileWithBackend(file, {
        targetFormat: "jpg",
        options: { quality: quality / 100, keepMetadata, autoOrient },
        onProgress: (p) => setProgress(Math.max(10, p)),
        onSuccess: async (data) => {
          const img = new window.Image();
          img.src = data.outputUrl;

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error("Failed to load converted image"));
          });

          const outputName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
          const originalSizeKB = file.size / 1024;
          const compressedSizeKB = data.outputSize ? data.outputSize / 1024 : originalSizeKB;
          const savings = originalSizeKB > 0
            ? Math.max(0, Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100))
            : 0;

          setResult({
            url: data.outputUrl,
            name: outputName,
            size: data.outputSize ? `${(data.outputSize / 1024).toFixed(1)} KB` : "Available on download",
            originalSize: originalSizeKB.toFixed(1) + " KB",
            savings: savings > 0 ? savings.toFixed(1) : "0.0",
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          incrementConversionCount();
        },
        onError: (err) => {
          console.error(err);
          alert("Failed to convert HEIC image. Please try another file.");
        }
      });
    } catch (err) {
      console.error(err);
      alert("Failed to initiate conversion.");
    } finally {
      setConverting(false);
    }
  }, [file, quality, keepMetadata, autoOrient, checkConversionLimit, incrementConversionCount]);

  const reset = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="max-w-[800px] mx-auto">
      {!result ? (
        <>
          <ToolUploader
            accept=".heic,.heif,image/heic,image/heif"
            supportedFormats={["HEIC", "HEIF"]}
            title="Drop your HEIC photo here"
            subtitle="or click to browse — supports iPhone .heic & .heif photos"
            onFilesSelected={(f) => setFile(f)}
            activity={uploaderActivity}
            collapseOnSelect={collapseUploadAfterSelection}
            primaryAction={{
              label: "Convert to JPG",
              loadingLabel: "Converting...",
              icon: RefreshCw,
              onClick: handleConvert,
              disabled: converting,
            }}
          />

          {file && (
            <div className="mt-6">
              {/* Settings Card */}
              <div className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-5">
                <h3 className="flex items-center gap-2 font-bold text-[1rem] mb-5 text-[#f8fafc]">
                  <Sliders size={16} className="text-[#06b6d4]" />
                  Conversion Settings
                </h3>

                {/* Quality Slider */}
                <div className="mb-5">
                  <div className="flex justify-between mb-2.5">
                    <label htmlFor="heic-quality-slider" className="block text-[0.875rem] font-semibold text-[#cbd5e1] tracking-wide">
                      JPG Output Quality
                    </label>
                    <span className="font-bold text-[#06b6d4] text-[0.9rem]">
                      {quality}%
                    </span>
                  </div>
                  <input
                    id="heic-quality-slider"
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
                    aria-label="JPG quality percentage slider"
                  />
                  <div className="flex justify-between text-[0.75rem] text-[#a5b4fc] mt-1">
                    <span>Small file</span>
                    <span>Best quality</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/6">
                  <label className="flex items-center gap-2.5 text-[0.875rem] text-[#cbd5e1] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keepMetadata}
                      aria-label="Preserve EXIF Metadata (GPS, Camera)"
                      onChange={(e) => setKeepMetadata(e.target.checked)}
                      className="rounded bg-[#0f0f1a] border-white/20 text-[#06b6d4] focus:ring-[#06b6d4] h-4 w-4"
                    />
                    <span>Preserve EXIF Metadata (GPS, Camera)</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-[0.875rem] text-[#cbd5e1] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoOrient}
                      aria-label="Auto-Rotate Orientation"
                      onChange={(e) => setAutoOrient(e.target.checked)}
                      className="rounded bg-[#0f0f1a] border-white/20 text-[#06b6d4] focus:ring-[#06b6d4] h-4 w-4"
                    />
                    <span>Auto-Rotate Orientation</span>
                  </label>
                </div>
              </div>

              {!collapseUploadAfterSelection && (
                <>
                  {converting && (
                    <div className="mb-5">
                      <p className="text-[0.85rem] text-[#64748b] mb-2">
                        Converting... {progress}%
                      </p>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleConvert}
                    disabled={converting}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center"
                  >
                    {converting ? (
                      <><RefreshCw size={18} className="animate-spin" /> Converting...</>
                    ) : (
                      <><RefreshCw size={18} /> Convert to JPG</>
                    )}
                  </Button>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        /* Result */
        <div>
          <div className="p-6 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl mb-6 flex items-center gap-3">
            <CheckCircle size={22} className="text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-400 mb-0.5">
                Conversion Successful!
              </p>
              <p className="text-[0.85rem] text-[#94a3b8]">
                {result.name} · {result.size} · {result.width}×{result.height}px
                {Number(result.savings) > 0 && (
                  <span className="text-[#34d399] ml-2">
                    ↓ {result.savings}% smaller
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
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
              {downloading ? "Downloading..." : "Download JPG"}
            </Button>
            <Button variant="secondary" size="lg" onClick={reset}>
              Convert Another
            </Button>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-16 border-t border-white/6 pt-12">
        <h2 className="font-['Outfit'] font-bold text-[1.4rem] mb-6 text-[#f8fafc] flex items-center gap-2">
          <Info size={20} className="text-[#06b6d4]" />
          About HEIC to JPG Conversion
        </h2>

        <div className="text-[#94a3b8] text-[0.92rem] leading-[1.8] flex flex-col gap-6">
          <p>
            <strong className="text-[#f8fafc]">Why convert Apple HEIC to JPG?</strong>{" "}
            HEIC (High Efficiency Image Container) is the default image format used by iPhone and iPad camera sensors. While HEIC saves internal storage on iOS devices, Windows 10/11 PCs, Android devices, email clients, and website upload forms often cannot open .heic files without error popups. Converting HEIC photos to standard JPG format makes them universally viewable across all screens, software, and platforms.
          </p>
          <p>
            <strong className="text-[#f8fafc]">EXIF Metadata & Orientation:</strong>{" "}
            Apple HEIC photos contain embedded camera metadata (GPS coordinates, capture timestamps, shutter speed) and orientation flags. Our tool allows you to preserve EXIF data for archival purposes or strip it for complete online privacy.
          </p>
        </div>

        <h3 className="font-['Outfit'] font-bold text-[1.2rem] mt-10 mb-5 text-[#f8fafc] flex items-center gap-2">
          <Zap size={18} className="text-[#06b6d4]" />
          Key Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Custom JPG Quality</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              Fine-tune the output compression quality. Keep it at 90%+ for crisp photo quality or lower it to reduce file size.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">100% Privacy Protection</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              Files are transferred via encrypted connections and deleted immediately after processing. No personal images are saved.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Automatic Orientation Fix</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              Automatically reads EXIF rotation tags so sideways iPhone photos display correctly in an upright position.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Cross-Platform Support</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              Works seamlessly across Windows, macOS, Android, iOS, and Linux without downloading or installing extra software.
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
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">How do I convert HEIC photos to JPG?</h4>
            <p className="text-[#94a3b8] text-[0.875rem] leading-relaxed">
              Simply drop your HEIC photo onto the uploader panel or browse from your device. Adjust the quality slider or EXIF settings if needed, click "Convert to JPG", and click "Download JPG" to save the file.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Why won't my Windows PC open HEIC files?</h4>
            <p className="text-[#94a3b8] text-[0.875rem] leading-relaxed">
              Windows does not include native HEVC/HEIC decoding codecs by default. Converting your HEIC images to standard JPG format solves this issue immediately.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Will I lose image quality during conversion?</h4>
            <p className="text-[#94a3b8] text-[0.875rem] leading-relaxed">
              Our converter uses advanced image processing algorithms. Keeping quality at 85%-95% preserves photo details, sharpness, and colors so the JPG looks identical to the original HEIC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
