"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders } from "lucide-react";
import Button from "@/components/Button";

import imageCompression from "browser-image-compression";

const OUTPUT_FORMATS = [
  { value: "webp", label: "To WebP", mime: "image/webp", ext: ".webp" },
  { value: "png", label: "WebP → PNG", mime: "image/png", ext: ".png" },
  { value: "jpeg", label: "WebP → JPG", mime: "image/jpeg", ext: ".jpg" },
];

export default function WebPConverterTool() {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("webp");
  const [quality, setQuality] = useState(85);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const collapseUploadAfterSelection = true;
  const selectedFormat = OUTPUT_FORMATS.find((f) => f.value === outputFormat);
  const convertLabel =
    selectedFormat.value === "webp"
      ? "Converting to WebP"
      : `Converting WebP to ${selectedFormat.ext.replace(".", "").toUpperCase()}`;
  const uploaderActivity = converting
    ? {
        state: "processing",
        label: convertLabel,
        detail: "Processing your image locally",
        progress,
      }
    : file
      ? {
          state: "ready",
          label: "Image selected",
          detail: "Pick a format and convert",
        }
      : null;

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setConverting(true);
    setProgress(10);

    try {
      const { processFileWithBackend } = await import("@/lib/apiClient");

      await processFileWithBackend(file, {
        targetFormat: selectedFormat.value,
        options: { quality: quality / 100 },
        onProgress: (p) => setProgress(Math.max(10, p)),
        onSuccess: async (data) => {
          const img = new window.Image();
          img.src = data.outputUrl;

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error("Failed to load converted image"));
          });

          const baseName = file.name.replace(/\.(webp|png|jpe?g|gif|bmp)$/i, "");
          const outputName = baseName + selectedFormat.ext;

          setResult({
            url: data.outputUrl,
            name: outputName,
            size: "Available on download",
            originalSize: (file.size / 1024).toFixed(1) + " KB",
            savings: "0.0", // Can't easily calculate without fetching the blob, but UI is preserved
            width: img.naturalWidth,
            height: img.naturalHeight,
            format: selectedFormat.label,
          });
        },
        onError: (err) => {
          console.error(err);
          alert("Failed to convert. Make sure your file is valid.");
        }
      });

    } catch (err) {
      console.error(err);
      alert("Failed to initiate conversion.");
    } finally {
      setConverting(false);
    }
  }, [file, selectedFormat, quality]);

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
            accept="image/*"
            supportedFormats={["WebP", "JPG", "PNG", "GIF", "BMP"]}
            title="Drop your image here"
            subtitle="Convert any image to or from WebP format"
            onFilesSelected={(f) => setFile(f)}
            activity={uploaderActivity}
            collapseOnSelect={collapseUploadAfterSelection}
            primaryAction={{
              label: "Convert Image",
              loadingLabel: "Converting...",
              icon: RefreshCw,
              onClick: handleConvert,
              disabled: converting,
            }}
          />

          {file && (
            <div className="mt-6">
              <div className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-5">
                <h3 className="flex items-center gap-2 font-bold text-[1rem] mb-5 text-[#f8fafc]">
                  <Sliders size={16} className="text-[#6366f1]" />
                  Conversion Settings
                </h3>

                {/* Format Selector */}
                <div className="mb-5">
                  <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2.5">Output Format</label>
                  <div className="flex gap-2.5 flex-wrap">
                    {OUTPUT_FORMATS.map((fmt) => (
                      <button
                        key={fmt.value}
                        onClick={() => setOutputFormat(fmt.value)}
                        className={`py-2.5 px-5 rounded-lg border text-[0.875rem] font-semibold cursor-pointer font-['Inter'] transition-all duration-200 ${
                          outputFormat === fmt.value
                            ? "border-[#6366f1] bg-indigo-500/15 text-[#818cf8]"
                            : "border-white/8 bg-transparent text-[#94a3b8]"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
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
                    aria-label="Output quality"
                  />
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
                        <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4] transition-all duration-300" style={{ width: `${progress}%` }} />
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
                      <><RefreshCw size={18} /> Convert Image</>
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
                Conversion Successful! ({result.format})
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
            <a
              href={result.url}
              download={result.name}
              className="flex-1 no-underline"
            >
              <Button variant="primary" size="lg" className="w-full justify-center">
                <Download size={18} />
                Download {selectedFormat?.ext.replace(".", "").toUpperCase()}
              </Button>
            </a>
            <Button variant="secondary" size="lg" onClick={reset}>
              Convert Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
