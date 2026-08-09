"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders, Sparkles } from "lucide-react";
import Button from "@/components/Button";
import { useConversionLimit } from "@/context/ConversionLimitContext";
import { downloadFile } from "@/lib/downloadFile";

export default function WebPToJpgTool() {
  const { checkConversionLimit, incrementConversionCount } = useConversionLimit();
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const collapseUploadAfterSelection = true;

  const uploaderActivity = converting
    ? {
        state: "processing",
        label: "Converting WebP to JPG",
        detail: "Flattening background and encoding JPG format",
        progress,
      }
    : file
      ? {
          state: "ready",
          label: "Image selected",
          detail: "Ready to convert to JPG",
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
        options: { quality: quality / 100, bgColor },
        onProgress: (p) => setProgress(Math.max(10, p)),
        onSuccess: async (data) => {
          const img = new window.Image();
          img.src = data.outputUrl;

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error("Failed to load converted image"));
          });

          const outputName = file.name.replace(/\.webp$/i, ".jpg");

          const originalSizeKB = file.size / 1024;
          const compressedSizeKB = data.outputSize ? data.outputSize / 1024 : originalSizeKB;
          const savings = originalSizeKB > 0
            ? Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100)
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
          alert("Failed to convert image. Please try another file.");
        }
      });
    } catch (err) {
      console.error(err);
      alert("Failed to initiate conversion.");
    } finally {
      setConverting(false);
    }
  }, [file, quality, bgColor, checkConversionLimit, incrementConversionCount]);

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
            accept=".webp,image/webp"
            supportedFormats={["WEBP"]}
            title="Drop your WebP image here"
            subtitle="or click to browse — supports .webp files"
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
              {/* Settings */}
              <div className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-5">
                <h3 className="flex items-center gap-2 font-bold text-[1rem] mb-5 text-[#f8fafc]">
                  <Sliders size={16} className="text-[#ea580c]" />
                  Conversion Settings
                </h3>

                <div className="mb-5">
                  <div className="flex justify-between mb-2.5">
                    <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide">
                      JPG Quality
                    </label>
                    <span className="font-bold text-[#f97316] text-[0.9rem]">
                      {quality}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ea580c]"
                    aria-label="JPG quality"
                  />
                  <div className="flex justify-between text-[0.75rem] text-[#64748b] mt-1">
                    <span>Small file</span>
                    <span>Best quality</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-11 h-11 rounded-lg border border-white/8 cursor-pointer bg-transparent p-0.5"
                      aria-label="Background color picker"
                    />
                    <span className="text-[0.875rem] text-[#64748b]">
                      Fills transparent areas (WebP transparency → solid color)
                    </span>
                  </div>
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
                        <div className="h-full bg-gradient-to-r from-[#ea580c] to-[#f97316] transition-all duration-300" style={{ width: `${progress}%` }} />
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
              className="flex-1 justify-center bg-gradient-to-r from-[#ea580c] to-[#f97316] border-[#ea580c]"
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
