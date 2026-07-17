"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders, Info, Shield, Zap, Sparkles } from "lucide-react";
import Button from "@/components/Button";
import { useConversionLimit } from "@/context/ConversionLimitContext";

export default function WebPToJpgTool() {
  const { checkConversionLimit, incrementConversionCount } = useConversionLimit();
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const collapseUploadAfterSelection = true;

  const uploaderActivity = converting
    ? {
        state: "processing",
        label: "Converting WebP to JPG",
        detail: "Flattening background and encoding JPEG format",
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
                      JPEG Quality
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
                    aria-label="JPEG quality"
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
            <a
              href={result.url}
              download={result.name}
              className="flex-1 no-underline"
            >
              <Button variant="primary" size="lg" className="w-full justify-center bg-gradient-to-r from-[#ea580c] to-[#f97316] border-[#ea580c]">
                <Download size={18} />
                Download JPG
              </Button>
            </a>
            <Button variant="secondary" size="lg" onClick={reset}>
              Convert Another
            </Button>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-16 border-t border-white/6 pt-12">
        <h2 className="font-['Outfit'] font-bold text-[1.4rem] mb-6 text-[#f8fafc] flex items-center gap-2">
          <Info size={20} className="text-[#ea580c]" />
          About WebP to JPG Conversion
        </h2>
        
        <div className="text-[#94a3b8] text-[0.92rem] leading-[1.8] flex flex-col gap-6">
          <p>
            <strong className="text-[#f8fafc]">Why convert WebP to JPG?</strong>{" "}
            While WebP offers advanced compression and smaller file sizes for modern web browsers, it has limited compatibility with offline software, legacy image editors, email clients, and older operating systems. Converting WebP to JPG (JPEG) ensures your files can be viewed and opened universally on any device or platform without installing additional codecs.
          </p>
          <p>
            <strong className="text-[#f8fafc]">Transparent backgrounds:</strong>{" "}
            The WebP format supports transparency (an alpha channel), whereas JPG does not. When you convert transparent WebP files, the transparent areas must be filled with a solid color. Our tool provides a solid color background picker (defaulting to white) so you can choose exactly what color replaces transparent pixels during conversion.
          </p>
        </div>

        <h3 className="font-['Outfit'] font-bold text-[1.2rem] mt-10 mb-5 text-[#f8fafc] flex items-center gap-2">
          <Sparkles size={18} className="text-[#ea580c]" />
          Key Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Custom JPEG Quality</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              Fine-tune the compression of your output image. Slide to reduce quality for a smaller file size, or raise it to 100% to maximize visual fidelity.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">100% Browser-First Security</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              Your images are processed locally within your browser context or via local network hooks. We do not store or keep copies of your personal photos.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Solid Color Backdrop Fill</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              Define custom background colors using the visual color picker to smoothly blend alpha transparency channels into solid pixels.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Intelligent Size Savings</h4>
            <p className="text-[#94a3b8] text-[0.85rem] leading-relaxed">
              The converter calculates precise optimization savings, indicating how much storage is reduced compared to the original file formats.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <h3 className="font-['Outfit'] font-bold text-[1.2rem] mt-10 mb-6 text-[#f8fafc] flex items-center gap-2">
          <Shield size={18} className="text-[#ea580c]" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">How do I convert a WebP file to JPG?</h4>
            <p className="text-[#94a3b8] text-[0.875rem] leading-relaxed">
              Simply drop your WebP image onto the uploader panel or browse from your filesystem. Adjust the JPEG quality slider to your liking, select a custom background color if your image has transparency, and click "Convert to JPG". Once completed, click "Download" to save the image.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">Will I lose image quality during the conversion?</h4>
            <p className="text-[#94a3b8] text-[0.875rem] leading-relaxed">
              WebP uses highly advanced compression. Converting it to JPEG (which is a lossy format) may introduce minor compression artifacts. However, by setting the quality slider to 90% or higher, the differences are virtually indistinguishable to the human eye.
            </p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/6 rounded-2xl">
            <h4 className="font-bold text-[#f8fafc] mb-2 text-[0.95rem]">How does the transparency backup color picker work?</h4>
            <p className="text-[#94a3b8] text-[0.875rem] leading-relaxed">
              JPEG files do not support transparency. If a WebP image with transparent sections is converted directly, those sections would typically turn black. To prevent this, our backdrop tool lets you specify a background fill color (white is the industry default) to ensure a clean visual output.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
