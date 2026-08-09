"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders } from "lucide-react";
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
    </div>
  );
}
