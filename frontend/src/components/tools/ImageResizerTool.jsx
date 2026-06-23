"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders, Lock, Unlock } from "lucide-react";
import Button from "@/components/Button";

import imageCompression from "browser-image-compression";

const PRESETS = [
  { label: "HD (1280×720)", w: 1280, h: 720 },
  { label: "Full HD (1920×1080)", w: 1920, h: 1080 },
  { label: "4K (3840×2160)", w: 3840, h: 2160 },
  { label: "Square (1080×1080)", w: 1080, h: 1080 },
  { label: "Twitter Header", w: 1500, h: 500 },
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Facebook Cover", w: 820, h: 312 },
  { label: "Thumbnail (640×360)", w: 640, h: 360 },
];

export default function ImageResizerTool() {
  const [file, setFile] = useState(null);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [quality, setQuality] = useState(90);
  const [resizing, setResizing] = useState(false);
  const [result, setResult] = useState(null);
  const collapseUploadAfterSelection = true;
  const uploaderActivity = resizing
    ? {
        state: "processing",
        label: "Resizing image",
        detail: "Adjusting dimensions and rendering the new file",
      }
    : file
      ? {
          state: "ready",
          label: "Image selected",
          detail: "Set the new dimensions and resize",
        }
      : null;

  const handleFileSelected = useCallback((f) => {
    setFile(f);
    setResult(null);
    const img = new window.Image();
    img.src = URL.createObjectURL(f);
    img.onload = () => {
      setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      URL.revokeObjectURL(img.src);
    };
  }, []);

  const handleWidthChange = (val) => {
    const w = Number(val) || 0;
    setWidth(w);
    if (lockAspect && originalDims.w) {
      setHeight(Math.round((w / originalDims.w) * originalDims.h));
    }
  };

  const handleHeightChange = (val) => {
    const h = Number(val) || 0;
    setHeight(h);
    if (lockAspect && originalDims.h) {
      setWidth(Math.round((h / originalDims.h) * originalDims.w));
    }
  };

  const applyPreset = (preset) => {
    setWidth(preset.w);
    setHeight(preset.h);
    setLockAspect(false);
  };

  const handleResize = useCallback(async () => {
    if (!file || !width || !height) return;
    setResizing(true);

    try {
      // Safely load the image, downscaling slightly if it's monstrously huge
      const safeFile = await imageCompression(file, {
        maxSizeMB: 50,
        maxWidthOrHeight: 8192,
        useWebWorker: true,
        fileType: "image/png",
        initialQuality: 1,
      });

      const img = new window.Image();
      const url = URL.createObjectURL(safeFile);
      img.src = url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      if (!img.naturalWidth || !img.naturalHeight) {
        throw new Error("Invalid image dimensions");
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (outputFormat === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const mime = outputFormat === "png" ? "image/png" : outputFormat === "webp" ? "image/webp" : "image/jpeg";
      const ext = outputFormat === "png" ? ".png" : outputFormat === "webp" ? ".webp" : ".jpg";

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, mime, quality / 100)
      );

      const baseName = file.name.replace(/\.[^.]+$/, "");
      const outputName = `${baseName}_${width}x${height}${ext}`;
      const outputUrl = URL.createObjectURL(blob);

      setResult({
        url: outputUrl,
        name: outputName,
        size: (blob.size / 1024).toFixed(1) + " KB",
        width,
        height,
      });

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to resize image.");
    } finally {
      setResizing(false);
    }
  }, [file, width, height, outputFormat, quality]);

  const reset = () => {
    setFile(null);
    setResult(null);
    setOriginalDims({ w: 0, h: 0 });
  };

  return (
    <div className="max-w-[800px] mx-auto">
      {!result ? (
        <>
          <ToolUploader
            accept="image/*"
            supportedFormats={["JPG", "PNG", "WebP", "GIF", "BMP"]}
            title="Drop your image to resize"
            subtitle="Set exact dimensions or pick a preset"
            onFilesSelected={handleFileSelected}
            activity={uploaderActivity}
            collapseOnSelect={collapseUploadAfterSelection}
            primaryAction={{
              label: width && height ? `Resize to ${width}×${height}px` : "Resize Image",
              loadingLabel: "Resizing...",
              icon: RefreshCw,
              onClick: handleResize,
              disabled: resizing || !width || !height,
            }}
          />

          {file && (
            <div className="mt-6">
              {/* Presets */}
              <div className="mb-5">
                <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2">Quick Presets</label>
                <div className="flex gap-2.5 flex-wrap">
                  {PRESETS.map((p) => (
                    <Button
                      key={p.label}
                      variant="ghost"
                      size="sm"
                      onClick={() => applyPreset(p)}
                      className="text-[0.78rem]"
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-5">
                <h3 className="flex items-center gap-2 font-bold text-[1rem] mb-5 text-[#f8fafc]">
                  <Sliders size={16} className="text-[#6366f1]" />
                  Resize Settings
                  {originalDims.w > 0 && (
                    <span className="text-[0.8rem] text-[#64748b] font-normal ml-2">
                      (Original: {originalDims.w}×{originalDims.h}px)
                    </span>
                  )}
                </h3>

                {/* Width / Height */}
                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end mb-5">
                  <div>
                    <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2">Width (px)</label>
                    <input
                      type="number"
                      className="w-full py-3 px-4 rounded-xl bg-[#13131f] border border-white/8 text-[#f8fafc] text-[0.95rem] transition-all duration-200 outline-none placeholder:text-slate-500 focus:border-[#6366f1] focus:bg-indigo-500/5 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                      value={width}
                      min="1"
                      max="8000"
                      onChange={(e) => handleWidthChange(e.target.value)}
                      aria-label="Image width in pixels"
                    />
                  </div>
                  <button
                    onClick={() => setLockAspect(!lockAspect)}
                    title={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
                    className={`w-10 h-10 rounded-lg cursor-pointer flex items-center justify-center shrink-0 transition-all duration-200 mb-0 border ${
                      lockAspect
                        ? "bg-indigo-500/15 border-indigo-500/40 text-[#818cf8]"
                        : "bg-white/6 border-white/8 text-[#64748b]"
                    }`}
                    aria-label={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
                  >
                    {lockAspect ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                  <div>
                    <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2">Height (px)</label>
                    <input
                      type="number"
                      className="w-full py-3 px-4 rounded-xl bg-[#13131f] border border-white/8 text-[#f8fafc] text-[0.95rem] transition-all duration-200 outline-none placeholder:text-slate-500 focus:border-[#6366f1] focus:bg-indigo-500/5 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                      value={height}
                      min="1"
                      max="8000"
                      onChange={(e) => handleHeightChange(e.target.value)}
                      aria-label="Image height in pixels"
                    />
                  </div>
                </div>

                {/* Output Format */}
                <div className="mb-5">
                  <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2">Output Format</label>
                  <div className="flex gap-2.5">
                    {["jpeg", "png", "webp"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        className={`py-2.5 px-5 rounded-lg border text-[0.875rem] font-semibold cursor-pointer uppercase font-['Inter'] transition-all duration-200 ${
                          outputFormat === fmt
                            ? "border-[#6366f1] bg-indigo-500/15 text-[#818cf8]"
                            : "border-white/8 bg-transparent text-[#94a3b8]"
                        }`}
                      >
                        {fmt === "jpeg" ? "JPG" : fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality */}
                {outputFormat !== "png" && (
                  <div>
                    <div className="flex justify-between mb-2.5">
                      <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide">Quality</label>
                      <span className="font-bold text-[#818cf8] text-[0.9rem]">{quality}%</span>
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
                )}
              </div>

              {!collapseUploadAfterSelection && (
                <Button
                  onClick={handleResize}
                  disabled={resizing || !width || !height}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                >
                  {resizing ? (
                    <><RefreshCw size={18} className="animate-spin" /> Resizing...</>
                  ) : (
                    <><RefreshCw size={18} /> Resize to {width}×{height}px</>
                  )}
                </Button>
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
              <p className="font-bold text-emerald-400 mb-0.5">Resize Complete!</p>
              <p className="text-[0.85rem] text-[#94a3b8]">
                {result.name} · {result.size} · {result.width}×{result.height}px
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <a href={result.url} download={result.name} className="flex-1 no-underline">
              <Button variant="primary" size="lg" className="w-full justify-center">
                <Download size={18} />
                Download Resized
              </Button>
            </a>
            <Button variant="secondary" size="lg" onClick={reset}>Resize Another</Button>
          </div>
        </div>
      )}
    </div>
  );
}
