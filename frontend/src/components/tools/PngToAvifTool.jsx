"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders, AlertCircle, Sparkles, Cpu, Layers } from "lucide-react";
import Button from "@/components/Button";
import { useConversionLimit } from "@/context/ConversionLimitContext";
import { downloadFile } from "@/lib/downloadFile";

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const QUALITY_PRESETS = Object.freeze([
  { label: "50% Max Shrink", val: 50 },
  { label: "80% Balanced", val: 80 },
  { label: "95% High Fidelity", val: 95 },
]);

let avifWasmPromise = null;
const loadAvifCodec = () => {
  if (!avifWasmPromise) {
    avifWasmPromise = (async () => {
      const mod = await import("@jsquash/avif");
      try {
        if (mod.init) {
          await mod.init(undefined, {
            locateFile: (path) => `/wasm/${path}`,
          });
        }
      } catch {
        // Safe to ignore if already initialized or custom locator not required
      }
      return mod;
    })();
  }
  return avifWasmPromise;
};

export default function PngToAvifTool() {
  const { checkConversionLimit, incrementConversionCount } = useConversionLimit();
  const [file, setFile] = useState(null);
  const [compressionMode, setCompressionMode] = useState("lossy"); // "lossy" | "lossless"
  const [quality, setQuality] = useState(80);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isLossless = compressionMode === "lossless";

  // Pre-warm WASM encoder in background when idle so conversion starts instantly
  useEffect(() => {
    if (typeof window === "undefined") return;

    const preload = () => {
      loadAvifCodec().catch(() => {});
    };

    let idleId;
    let timerId;

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(preload);
    } else {
      timerId = setTimeout(preload, 1000);
    }

    return () => {
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, []);

  // Clean up object URLs on unmount or when new result is generated
  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result?.url]);

  const handleFileSelect = useCallback((selectedFile) => {
    setErrorMessage("");
    if (!selectedFile) return;

    // Validate file type
    const isPngType =
      selectedFile.type === "image/png" || selectedFile.name.toLowerCase().endsWith(".png");
    if (!isPngType) {
      setErrorMessage("Invalid file type. Please upload a valid PNG (.png) image.");
      setFile(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please upload a smaller file.`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }, []);

  const uploaderActivity = useMemo(() => {
    if (converting) {
      return {
        state: "processing",
        label: "Encoding PNG to AVIF",
        detail: statusMessage || "Re-encoding pixel grid with AV1 predictive coding",
        progress,
      };
    }
    if (file) {
      return {
        state: "ready",
        label: "PNG Image Selected",
        detail: `${(file.size / 1024).toFixed(1)} KB · Ready to convert`,
      };
    }
    return null;
  }, [converting, statusMessage, progress, file]);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    if (!checkConversionLimit()) return;

    setConverting(true);
    setProgress(15);
    setStatusMessage("Reading PNG image & decoding pixels...");
    setErrorMessage("");

    try {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }

      // 1. Load image into HTML5 Canvas to extract raw RGBA ImageData
      const objectUrl = URL.createObjectURL(file);
      const img = new window.Image();

      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to decode PNG image. The file may be corrupt."));
        img.src = objectUrl;
      });

      URL.revokeObjectURL(objectUrl);

      const width = img.naturalWidth;
      const height = img.naturalHeight;

      if (!width || !height) {
        throw new Error("Unable to determine image dimensions.");
      }

      setProgress(35);
      setStatusMessage("Extracting alpha transparency & pixel data...");

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (!ctx) {
        throw new Error("Canvas context initialization failed.");
      }

      // Preserve alpha transparency
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, width, height);

      setProgress(55);
      setStatusMessage("Initializing AV1 WebAssembly encoder...");

      await new Promise((r) => setTimeout(r, 40));

      let avifBlob = null;

      try {
        const { default: encode } = await loadAvifCodec();

        setProgress(70);
        setStatusMessage("Applying AV1 intra-frame predictive compression...");
        await new Promise((r) => setTimeout(r, 40));

        const encodeOptions = {
          quality: isLossless ? 100 : quality,
          lossless: isLossless,
          speed: 6, // Optimized balance of speed and compression efficiency
        };

        const avifBuffer = await encode(imageData, encodeOptions);
        avifBlob = new Blob([avifBuffer], { type: "image/avif" });
      } catch (wasmErr) {
        console.warn("WASM AVIF encoding error, checking browser native fallback:", wasmErr);

        // Native browser canvas fallback if supported by client browser
        const nativeBlob = await new Promise((resolve) => {
          canvas.toBlob(
            (blob) => resolve(blob),
            "image/avif",
            isLossless ? 1.0 : quality / 100
          );
        });

        if (nativeBlob && nativeBlob.type === "image/avif") {
          avifBlob = nativeBlob;
        } else {
          throw new Error(
            "AVIF encoding failed in your browser. " + (wasmErr?.message || "WASM codec failure.")
          );
        }
      } finally {
        // Free canvas buffer memory after encoding attempt completes
        canvas.width = 1;
        canvas.height = 1;
      }

      setProgress(95);
      setStatusMessage("Finalizing AVIF file...");

      if (!avifBlob || avifBlob.size === 0) {
        throw new Error("Failed to generate AVIF file payload.");
      }

      const avifUrl = URL.createObjectURL(avifBlob);
      const outputName = file.name.replace(/\.png$/i, "") + ".avif";
      const originalSizeKB = file.size / 1024;
      const convertedSizeKB = avifBlob.size / 1024;
      const savings =
        originalSizeKB > 0
          ? (((originalSizeKB - convertedSizeKB) / originalSizeKB) * 100).toFixed(1)
          : "0.0";

      setResult({
        url: avifUrl,
        blob: avifBlob,
        name: outputName,
        size: `${convertedSizeKB.toFixed(1)} KB`,
        originalSize: `${originalSizeKB.toFixed(1)} KB`,
        savings: parseFloat(savings) > 0 ? savings : "0.0",
        width,
        height,
        isLossless,
      });

      incrementConversionCount();
      setProgress(100);
    } catch (err) {
      console.error("AVIF Conversion failed:", err);
      setErrorMessage(
        err?.message || "An unexpected error occurred during AVIF conversion. Please try again."
      );
    } finally {
      setConverting(false);
      setStatusMessage("");
    }
  }, [file, isLossless, quality, checkConversionLimit, incrementConversionCount, result?.url]);

  const handleDownload = useCallback(async () => {
    if (!result?.url) return;
    setDownloading(true);
    try {
      await downloadFile(result.url, result.name);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback direct anchor click
      const a = document.createElement("a");
      a.href = result.url;
      a.download = result.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  }, [result]);

  const reset = useCallback(() => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
    setFile(null);
    setResult(null);
    setProgress(0);
    setStatusMessage("");
    setErrorMessage("");
  }, [result?.url]);

  return (
    <div className="max-w-[800px] mx-auto">
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage("")}
            className="text-red-400/60 hover:text-red-300 text-xs uppercase font-semibold"
            aria-label="Dismiss error message"
          >
            Dismiss
          </button>
        </div>
      )}

      {!result ? (
        <>
          <ToolUploader
            accept=".png,image/png"
            supportedFormats={["PNG"]}
            title="Drop your PNG image here"
            subtitle="or click to browse — supports .png files"
            maxSizeMB={MAX_FILE_SIZE_MB}
            onFilesSelected={handleFileSelect}
            activity={uploaderActivity}
            collapseOnSelect={true}
            primaryAction={{
              label: "Convert to AVIF",
              loadingLabel: "Converting to AVIF...",
              icon: RefreshCw,
              onClick: handleConvert,
              disabled: converting || !file,
            }}
          />

          {file && (
            <div className="mt-6 space-y-5">
              {/* Settings Card */}
              <div className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl">
                <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
                  <h3 className="flex items-center gap-2 font-bold text-[1rem] text-[#f8fafc]">
                    <Sliders size={18} className="text-[#6366f1]" aria-hidden="true" />
                    AVIF Conversion Settings
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#a5b4fc] bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                    <Cpu size={14} aria-hidden="true" />
                    <span>100% Client-Side WASM Encoder</span>
                  </div>
                </div>

                {/* Compression Mode Selector */}
                <div className="mb-6">
                  <label className="block text-[0.825rem] font-semibold text-[#cbd5e1] mb-2.5">
                    Compression Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCompressionMode("lossy")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        !isLossless
                          ? "bg-indigo-500/15 border-indigo-500/50 text-[#f8fafc] shadow-[0_4px_16px_rgba(99,102,241,0.15)]"
                          : "bg-[#141426] border-white/8 text-[#94a3b8] hover:border-white/20"
                      }`}
                      aria-pressed={!isLossless}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[0.9rem] text-[#f8fafc]">Lossy Mode</span>
                        <span className="text-[0.7rem] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          Smallest Size
                        </span>
                      </div>
                      <p className="text-[0.775rem] text-[#94a3b8] leading-relaxed">
                        Up to 90% smaller than PNG with visually identical quality. Ideal for websites & web performance.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCompressionMode("lossless")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isLossless
                          ? "bg-indigo-500/15 border-indigo-500/50 text-[#f8fafc] shadow-[0_4px_16px_rgba(99,102,241,0.15)]"
                          : "bg-[#141426] border-white/8 text-[#94a3b8] hover:border-white/20"
                      }`}
                      aria-pressed={isLossless}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[0.9rem] text-[#f8fafc]">Lossless Mode</span>
                        <span className="text-[0.7rem] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          Pixel-Perfect
                        </span>
                      </div>
                      <p className="text-[0.775rem] text-[#94a3b8] leading-relaxed">
                        Bit-for-bit exact reproduction of every pixel. Larger file size than lossy, zero quality compromise.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Quality Slider (Lossy only) */}
                {!isLossless ? (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="avif-quality-slider" className="text-[0.825rem] font-semibold text-[#cbd5e1]">
                        Quality Level
                      </label>
                      <span className="font-bold text-[0.875rem] text-[#f8fafc] bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 rounded-md">
                        {quality}%
                      </span>
                    </div>

                    <input
                      id="avif-quality-slider"
                      type="range"
                      min={10}
                      max={100}
                      step={1}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      aria-label="AVIF compression quality level"
                      className="w-full accent-indigo-500 h-2.5 bg-white/10 rounded-lg cursor-pointer touch-none"
                    />

                    {/* Quick Preset Buttons for Mobile & Desktop */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="text-[0.725rem] text-[#94a3b8] mr-1">Presets:</span>
                      {QUALITY_PRESETS.map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setQuality(preset.val)}
                          className={`text-[0.725rem] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            quality === preset.val
                              ? "bg-indigo-500/25 border-indigo-500 text-indigo-300 shadow-[0_2px_8px_rgba(99,102,241,0.2)]"
                              : "bg-white/5 border-white/8 text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/10"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between text-[0.725rem] text-[#94a3b8] mt-2">
                      <span>10% (Maximum compression)</span>
                      <span className="text-indigo-400 font-semibold">80% (Recommended)</span>
                      <span>100% (Near lossless)</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-white/4 border border-white/8 rounded-xl flex items-center gap-2.5 text-xs text-[#cbd5e1]">
                    <Sparkles size={16} className="text-indigo-400 shrink-0" aria-hidden="true" />
                    <span>Lossless mode active: Quality is automatically set to 100% for bit-exact reproduction.</span>
                  </div>
                )}

                {/* Features Pill Strip */}
                <div className="mt-5 pt-4 border-t border-white/6 flex items-center gap-4 flex-wrap text-xs text-[#94a3b8]">
                  <span className="flex items-center gap-1.5">
                    <Layers size={14} className="text-cyan-400" aria-hidden="true" />
                    Full Alpha Transparency Preserved
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-400" aria-hidden="true" />
                    Zero Server Upload (100% In-Browser)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Featured Visual Banner - Perfectly Adjusted */}
          <div className="mt-8 relative group">
            {/* Ambient colorful backlight glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-cyan-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-500 pointer-events-none" />
            
            {/* Card wrapper */}
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-[#141426] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-indigo-500/40">
              <img
                src="/png-to-avif.webp"
                alt="PNG to AVIF Converter – Free Online Tool"
                width={1200}
                height={670}
                className="w-full h-auto object-contain block rounded-2xl md:rounded-3xl transition-transform duration-500 group-hover:scale-[1.01]"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </>
      ) : (
        /* Conversion Result Card */
        <div className="p-6 md:p-8 bg-[#1a1a2e] border border-white/8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-white/8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle size={22} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-[1.1rem] text-[#f8fafc]">Conversion Complete!</h3>
                <p className="text-xs text-[#94a3b8]">{result.name}</p>
              </div>
            </div>

            {parseFloat(result.savings) > 0 && (
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                <Sparkles size={13} aria-hidden="true" />
                {result.savings}% Smaller than PNG
              </div>
            )}
          </div>

          {/* Image Preview with Transparency Checkerboard */}
          <div className="relative rounded-xl overflow-hidden border border-white/10 mb-6 bg-[#0f0f1a] flex items-center justify-center p-4 min-h-[220px] max-h-[360px]">
            {/* Checkerboard Pattern for Alpha Channel */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)`,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }}
            />
            {/* Converted Image */}
            <img
              src={result.url}
              alt="Converted AVIF image preview"
              className="relative z-[1] max-w-full max-h-[320px] object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 bg-[#141426] border border-white/6 rounded-xl">
              <span className="block text-[0.7rem] uppercase tracking-wider text-[#94a3b8] mb-1">
                Original (PNG)
              </span>
              <span className="font-bold text-[0.95rem] text-[#cbd5e1]">{result.originalSize}</span>
            </div>

            <div className="p-3.5 bg-[#141426] border border-white/6 rounded-xl">
              <span className="block text-[0.7rem] uppercase tracking-wider text-[#94a3b8] mb-1">
                AVIF Output
              </span>
              <span className="font-bold text-[0.95rem] text-indigo-300">{result.size}</span>
            </div>

            <div className="p-3.5 bg-[#141426] border border-white/6 rounded-xl">
              <span className="block text-[0.7rem] uppercase tracking-wider text-[#94a3b8] mb-1">
                Dimensions
              </span>
              <span className="font-bold text-[0.95rem] text-[#cbd5e1]">
                {result.width} × {result.height}
              </span>
            </div>

            <div className="p-3.5 bg-[#141426] border border-white/6 rounded-xl">
              <span className="block text-[0.7rem] uppercase tracking-wider text-[#94a3b8] mb-1">
                Compression
              </span>
              <span className="font-bold text-[0.95rem] text-emerald-400">
                {result.isLossless ? "Lossless (100%)" : `Lossy (${quality}%)`}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full sm:flex-1 py-3.5 justify-center text-[0.95rem] min-h-[48px] shadow-[0_4px_16px_rgba(99,102,241,0.25)]"
              aria-label={`Download converted file ${result.name}`}
            >
              <Download size={18} aria-hidden="true" />
              {downloading ? "Downloading..." : "Download AVIF"}
            </Button>

            <button
              type="button"
              onClick={reset}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl border border-white/10 bg-white/4 text-[#cbd5e1] font-semibold text-[0.95rem] hover:bg-white/8 hover:text-white transition-all cursor-pointer min-h-[48px] text-center active:scale-[0.99]"
              aria-label="Convert another PNG image"
            >
              Convert Another Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

