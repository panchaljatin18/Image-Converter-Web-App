"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import imageCompression from "browser-image-compression";
import { Download, RefreshCw, CheckCircle, Sliders, Zap } from "lucide-react";
import Button from "@/components/Button";
import { useConversionLimit } from "@/context/ConversionLimitContext";
import { downloadFile } from "@/lib/downloadFile";

export default function ImageCompressorTool() {
  const { checkConversionLimit, incrementConversionCount } = useConversionLimit();
  const [file, setFile] = useState(null);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1920);
  const [quality, setQuality] = useState(80);
  const [useWebWorker] = useState(true);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const collapseUploadAfterSelection = true;
  const uploaderActivity = compressing
    ? {
        state: "processing",
        label: "Compressing image",
        detail: "Optimizing size and quality in your browser",
        progress,
      }
    : file
      ? {
          state: "ready",
          label: "Image selected",
          detail: "Choose a preset or compress now",
        }
      : null;

  const handleCompress = useCallback(async () => {
    if (!file) return;
    if (!checkConversionLimit()) return;
    setCompressing(true);
    setProgress(10);

    try {
      const { processFileWithBackend } = await import("@/lib/apiClient");

      const extMatch = file.name.match(/\.(jpe?g|png|webp|gif)$/i);
      const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
      const targetFormat = ext === "jpeg" ? "jpg" : ext;

      await processFileWithBackend(file, {
        targetFormat,
        options: { 
          quality: quality / 100,
          maxWidthOrHeight
        },
        onProgress: (p) => setProgress(Math.min(90, p)),
        onSuccess: async (data) => {
          setProgress(100);
          const outputName = file.name.replace(/\.[^.]+$/, `_compressed.${ext}`);

          const originalSizeKB = file.size / 1024;
          const compressedSizeKB = data.outputSize ? data.outputSize / 1024 : originalSizeKB * 0.8;
          const savings = originalSizeKB > 0
            ? Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100)
            : 0;

          setResult({
            url: data.outputUrl,
            name: outputName,
            originalSize: originalSizeKB.toFixed(1),
            compressedSize: compressedSizeKB.toFixed(1),
            savings: savings > 0 ? savings : 0,
          });
          incrementConversionCount();
        },
        onError: (err) => {
          console.error(err);
          alert("Compression failed: " + err.message);
        }
      });
    } catch (err) {
      alert("Compression failed to start: " + err.message);
    } finally {
      setCompressing(false);
    }
  }, [file, maxSizeMB, maxWidthOrHeight, quality, useWebWorker]);

  const reset = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
  };

  const presets = [
    { label: "Web", maxSizeMB: 0.5, maxWidthOrHeight: 1280, quality: 75 },
    { label: "Social Media", maxSizeMB: 1, maxWidthOrHeight: 1920, quality: 80 },
    { label: "Email", maxSizeMB: 0.3, maxWidthOrHeight: 800, quality: 70 },
    { label: "High Quality", maxSizeMB: 2, maxWidthOrHeight: 3840, quality: 90 },
  ];

  return (
    <div className="max-w-[800px] mx-auto">
      {!result ? (
        <>
          <ToolUploader
            accept="image/*"
            supportedFormats={["JPG", "PNG", "WebP", "GIF"]}
            title="Drop your image to compress"
            subtitle="Reduce file size while keeping great quality"
            onFilesSelected={(f) => setFile(f)}
            maxSizeMB={50}
            activity={uploaderActivity}
            collapseOnSelect={collapseUploadAfterSelection}
            primaryAction={{
              label: "Compress Image",
              loadingLabel: "Compressing...",
              icon: Zap,
              onClick: handleCompress,
              disabled: compressing,
            }}
          />

          {file && (
            <div className="mt-6">
              {/* Presets */}
              <div className="mb-5">
                <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2">Quick Presets</label>
                <div className="flex gap-2.5 flex-wrap">
                  {presets.map((p) => (
                    <Button
                      key={p.label}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMaxSizeMB(p.maxSizeMB);
                        setMaxWidthOrHeight(p.maxWidthOrHeight);
                        setQuality(p.quality);
                      }}
                    >
                      <Zap size={13} />
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-5">
                <h3 className="flex items-center gap-2 font-bold text-[1rem] mb-5 text-[#f8fafc]">
                  <Sliders size={16} className="text-[#6366f1]" />
                  Compression Settings
                </h3>

                {/* Max File Size */}
                <div className="mb-5">
                  <div className="flex justify-between mb-2.5">
                    <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide">Target Max Size</label>
                    <span className="font-bold text-[#818cf8] text-[0.9rem]">
                      {maxSizeMB < 1 ? `${maxSizeMB * 1000}KB` : `${maxSizeMB}MB`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={maxSizeMB}
                    onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
                    aria-label="Target max file size"
                  />
                  <div className="flex justify-between text-[0.75rem] text-[#64748b] mt-1">
                    <span>100KB</span>
                    <span>10MB</span>
                  </div>
                </div>

                {/* Max Dimension */}
                <div className="mb-5">
                  <div className="flex justify-between mb-2.5">
                    <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide">Max Width/Height</label>
                    <span className="font-bold text-[#818cf8] text-[0.9rem]">
                      {maxWidthOrHeight}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="320"
                    max="4096"
                    step="64"
                    value={maxWidthOrHeight}
                    onChange={(e) => setMaxWidthOrHeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
                    aria-label="Max image dimension"
                  />
                  <div className="flex justify-between text-[0.75rem] text-[#64748b] mt-1">
                    <span>320px</span>
                    <span>4096px</span>
                  </div>
                </div>

                {/* Quality */}
                <div>
                  <div className="flex justify-between mb-2.5">
                    <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide">Quality</label>
                    <span className="font-bold text-[#818cf8] text-[0.9rem]">
                      {quality}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
                    aria-label="Compression quality"
                  />
                </div>
              </div>

              {!collapseUploadAfterSelection && (
                <>
                  {compressing && (
                    <div className="mb-5">
                      <p className="text-[0.85rem] text-[#64748b] mb-2">
                        Compressing... {progress}%
                      </p>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4] transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleCompress}
                    disabled={compressing}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center"
                  >
                    {compressing ? (
                      <><RefreshCw size={18} className="animate-spin" /> Compressing...</>
                    ) : (
                      <><Zap size={18} /> Compress Image</>
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
          {/* Savings Banner */}
          <div className="p-6 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={22} className="text-emerald-400" />
              <p className="font-bold text-emerald-400">Compression Complete!</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Original Size", value: `${result.originalSize} KB`, color: "text-[#94a3b8]" },
                { label: "Compressed Size", value: `${result.compressedSize} KB`, color: "text-emerald-400" },
                { label: "Size Reduction", value: `${result.savings}%`, color: "text-amber-400" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-[1.4rem] font-extrabold font-['Outfit'] ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-[0.75rem] text-[#64748b] mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-[18px_20px] rounded-2xl border border-white/8 mb-5 bg-white/3 flex flex-col gap-2">
            <p className="font-bold text-[#f8fafc]">
              Output ready
            </p>
            <p className="text-[0.85rem] text-[#94a3b8] leading-relaxed">
              {result.name} has been compressed successfully. The preview is hidden to keep the
              result area clean. Use the download button below to save the file.
            </p>
            <div className="flex flex-wrap gap-2.5 text-[0.8rem] text-[#64748b]">
              <span>Original: {result.originalSize} KB</span>
              <span>Compressed: {result.compressedSize} KB</span>
              <span>Saved: {result.savings}%</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="lg"
              className="flex-1 justify-center"
              disabled={downloading}
              onClick={async () => {
                setDownloading(true);
                await downloadFile(result.url, result.name);
                setDownloading(false);
              }}
            >
              <Download size={18} />
              {downloading ? "Downloading..." : "Download Compressed"}
            </Button>
            <Button variant="secondary" size="lg" onClick={reset}>
              Compress Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
