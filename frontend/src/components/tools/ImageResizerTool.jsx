"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders, Lock, Unlock, AlertCircle, HardDrive, X, ExternalLink } from "lucide-react";
import Button from "@/components/Button";
import { useConversionLimit } from "@/context/ConversionLimitContext";
import { downloadFile } from "@/lib/downloadFile";

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

const MAX_ALLOWED_DIMENSION = 20000;

export default function ImageResizerTool() {
  const { checkConversionLimit, incrementConversionCount } = useConversionLimit();
  const [file, setFile] = useState(null);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  
  // 3 Resize Modes: "stretch" | "crop" | "fit"
  const [resizeMode, setResizeMode] = useState("stretch");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Target File Size (KB/MB) control
  const [targetSizeEnabled, setTargetSizeEnabled] = useState(false);
  const [targetSizeVal, setTargetSizeVal] = useState("");
  const [targetSizeUnit, setTargetSizeUnit] = useState("KB"); // "KB" or "MB"

  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [quality, setQuality] = useState(90);
  const [resizing, setResizing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState(null);
  
  // User-friendly error message banner state
  const [errorMessage, setErrorMessage] = useState(null);

  const collapseUploadAfterSelection = true;

  const uploaderActivity = resizing
    ? {
        state: "processing",
        label: "Resizing image",
        detail: "Applying selected mode and target size...",
      }
    : file
      ? {
          state: "ready",
          label: "Image selected",
          detail: "Set the new dimensions, resize mode, and target size",
        }
      : null;

  const handleFileSelected = useCallback((f) => {
    setFile(f);
    setResult(null);
    setErrorMessage(null);
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
    setErrorMessage(null);
    const w = Number(val) || 0;
    setWidth(w);
    if (w > MAX_ALLOWED_DIMENSION) {
      setErrorMessage(`⚠️ Width (${w.toLocaleString()}px) exceeds maximum limit of 20,000px. Please enter a value up to 20,000 pixels.`);
    }
    if (lockAspect && originalDims.w) {
      const calcH = Math.round((w / originalDims.w) * originalDims.h);
      setHeight(calcH);
      if (calcH > MAX_ALLOWED_DIMENSION) {
        setErrorMessage(`⚠️ Calculated height (${calcH.toLocaleString()}px) exceeds maximum limit of 20,000px. Please enter a smaller width.`);
      }
    }
  };

  const handleHeightChange = (val) => {
    setErrorMessage(null);
    const h = Number(val) || 0;
    setHeight(h);
    if (h > MAX_ALLOWED_DIMENSION) {
      setErrorMessage(`⚠️ Height (${h.toLocaleString()}px) exceeds maximum limit of 20,000px. Please enter a value up to 20,000 pixels.`);
    }
    if (lockAspect && originalDims.h) {
      const calcW = Math.round((h / originalDims.h) * originalDims.w);
      setWidth(calcW);
      if (calcW > MAX_ALLOWED_DIMENSION) {
        setErrorMessage(`⚠️ Calculated width (${calcW.toLocaleString()}px) exceeds maximum limit of 20,000px. Please enter a smaller height.`);
      }
    }
  };

  const applyPreset = (preset) => {
    setErrorMessage(null);
    setWidth(preset.w);
    setHeight(preset.h);
    setLockAspect(false);
  };

  const handleResize = useCallback(async () => {
    setErrorMessage(null);

    // Client-side validation check
    if (!file) return;
    if (!width || width <= 0) {
      setErrorMessage("⚠️ Please enter a valid positive width.");
      return;
    }
    if (!height || height <= 0) {
      setErrorMessage("⚠️ Please enter a valid positive height.");
      return;
    }
    if (width > MAX_ALLOWED_DIMENSION) {
      setErrorMessage(`⚠️ Width (${width.toLocaleString()}px) exceeds maximum limit of ${MAX_ALLOWED_DIMENSION.toLocaleString()}px. Please lower the width.`);
      return;
    }
    if (height > MAX_ALLOWED_DIMENSION) {
      setErrorMessage(`⚠️ Height (${height.toLocaleString()}px) exceeds maximum limit of ${MAX_ALLOWED_DIMENSION.toLocaleString()}px. Please lower the height.`);
      return;
    }

    if (!checkConversionLimit()) return;
    setResizing(true);

    try {
      const { processFileWithBackend } = await import("@/lib/apiClient");

      // Calculate targetSizeKB if enabled
      let targetSizeKB = null;
      if (targetSizeEnabled && targetSizeVal) {
        const num = parseFloat(targetSizeVal);
        if (!isNaN(num) && num > 0) {
          targetSizeKB = targetSizeUnit === "MB" ? num * 1024 : num;
        } else {
          setErrorMessage("⚠️ Please enter a valid target size (greater than 0).");
          setResizing(false);
          return;
        }
      }

      await processFileWithBackend(file, {
        targetFormat: outputFormat,
        options: {
          width,
          height,
          quality: quality / 100,
          resizeMode,
          bgColor,
          targetSizeKB,
        },
        onProgress: () => {},
        onSuccess: async (data) => {
          const ext = outputFormat === "png" ? ".png" : outputFormat === "webp" ? ".webp" : ".jpg";
          const baseName = file.name.replace(/\.[^.]+$/, "");
          const outputName = `${baseName}_${width}x${height}${ext}`;

          setResult({
            url: data.outputUrl,
            name: outputName,
            size: data.outputSize ? `${(data.outputSize / 1024).toFixed(1)} KB` : "Available on download",
            width,
            height,
            mode: resizeMode,
          });
          incrementConversionCount();
        },
        onError: (err) => {
          // Display user-friendly message from backend
          setErrorMessage(`⚠️ ${err.message || "Failed to resize image. Please check parameters and try again."}`);
        }
      });
    } catch (err) {
      setErrorMessage(`⚠️ ${err.message || "An unexpected error occurred. Please try again."}`);
    } finally {
      setResizing(false);
    }
  }, [file, width, height, outputFormat, quality, resizeMode, bgColor, targetSizeEnabled, targetSizeVal, targetSizeUnit, checkConversionLimit, incrementConversionCount]);

  const reset = () => {
    setFile(null);
    setResult(null);
    setErrorMessage(null);
    setOriginalDims({ w: 0, h: 0 });
    setTargetSizeEnabled(false);
    setTargetSizeVal("");
  };

  return (
    <div className="max-w-[800px] mx-auto">
      {!result ? (
        <>
          <ToolUploader
            accept="image/*"
            supportedFormats={["JPG", "PNG", "WebP", "GIF", "BMP"]}
            title="Drop your image to resize"
            subtitle="Set exact dimensions, select resize mode, or target a file size"
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

          {/* User-Friendly Validation Error Banner */}
          {errorMessage && (
            <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3 text-[0.9rem] animate-fadeIn">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1">
                <p className="font-bold text-red-400 text-[0.95rem] mb-0.5">Dimension Limit Warning</p>
                <p className="text-red-300 text-[0.875rem] leading-relaxed">{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-400/60 hover:text-red-300 transition-colors p-1"
                aria-label="Close message"
              >
                <X size={16} />
              </button>
            </div>
          )}

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

              {/* Resize Mode Selector (Stretch / Crop / Fit) */}
              <div className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-5">
                <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-3">
                  Resize Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Stretch Mode */}
                  <button
                    type="button"
                    onClick={() => setResizeMode("stretch")}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      resizeMode === "stretch"
                        ? "bg-indigo-500/15 border-[#6366f1] text-[#818cf8] shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                        : "bg-[#13131f] border-white/8 text-[#94a3b8] hover:border-white/20"
                    }`}
                  >
                    <div className="w-16 h-12 rounded border-2 border-current flex items-center justify-center bg-black/20 p-1 overflow-hidden">
                      <div className="w-full h-full bg-current rounded-sm opacity-60 flex items-center justify-center text-[0.6rem] font-bold text-black">
                        ↔
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-[0.9rem] text-[#f8fafc]">Stretch</div>
                      <div className="text-[0.72rem] text-[#64748b] mt-0.5">Stretch image to exact size</div>
                    </div>
                  </button>

                  {/* Crop Mode */}
                  <button
                    type="button"
                    onClick={() => setResizeMode("crop")}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      resizeMode === "crop"
                        ? "bg-indigo-500/15 border-[#6366f1] text-[#818cf8] shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                        : "bg-[#13131f] border-white/8 text-[#94a3b8] hover:border-white/20"
                    }`}
                  >
                    <div className="w-16 h-12 rounded border-2 border-current flex items-center justify-center bg-black/20 overflow-hidden relative">
                      <div className="w-[120%] h-[140%] bg-current opacity-60 rounded-sm" />
                      <div className="absolute inset-0 border border-white border-dashed" />
                    </div>
                    <div>
                      <div className="font-bold text-[0.9rem] text-[#f8fafc]">Crop</div>
                      <div className="text-[0.72rem] text-[#64748b] mt-0.5">Center-crop without distortion</div>
                    </div>
                  </button>

                  {/* Fit Mode */}
                  <button
                    type="button"
                    onClick={() => setResizeMode("fit")}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      resizeMode === "fit"
                        ? "bg-indigo-500/15 border-[#6366f1] text-[#818cf8] shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                        : "bg-[#13131f] border-white/8 text-[#94a3b8] hover:border-white/20"
                    }`}
                  >
                    <div className="w-16 h-12 rounded border-2 border-current flex items-center justify-center bg-black/40 p-1 overflow-hidden">
                      <div className="w-7 h-10 bg-current opacity-60 rounded-sm" />
                    </div>
                    <div>
                      <div className="font-bold text-[0.9rem] text-[#f8fafc]">Fit</div>
                      <div className="text-[0.72rem] text-[#64748b] mt-0.5">Fit inside with background pad</div>
                    </div>
                  </button>
                </div>

                {/* Background color picker for Fit mode */}
                {resizeMode === "fit" && (
                  <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
                    <span className="text-[0.85rem] text-[#94a3b8] font-semibold">Padding Background Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                      />
                      <span className="text-[0.8rem] text-[#f8fafc] font-mono">{bgColor}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dimensions Input */}
              <div className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-5">
                <h3 className="flex items-center gap-2 font-bold text-[1rem] mb-5 text-[#f8fafc]">
                  <Sliders size={16} className="text-[#6366f1]" />
                  Dimension Settings
                  {originalDims.w > 0 && (
                    <span className="text-[0.8rem] text-[#64748b] font-normal ml-2">
                      (Original: {originalDims.w}×{originalDims.h}px)
                    </span>
                  )}
                </h3>

                {/* Width / Height */}
                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end mb-5">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide">Width (px)</label>
                      <span className="text-[0.75rem] text-[#64748b]">Max 20,000px</span>
                    </div>
                    <input
                      type="number"
                      className={`w-full py-3 px-4 rounded-xl bg-[#13131f] border text-[#f8fafc] text-[0.95rem] transition-all outline-none ${
                        width > MAX_ALLOWED_DIMENSION
                          ? "border-red-500/80 focus:border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                          : "border-white/8 focus:border-[#6366f1]"
                      }`}
                      value={width}
                      min="1"
                      max={MAX_ALLOWED_DIMENSION}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      aria-label="Image width in pixels"
                    />
                  </div>
                  <button
                    onClick={() => setLockAspect(!lockAspect)}
                    title={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
                    className={`w-10 h-10 rounded-lg cursor-pointer flex items-center justify-center shrink-0 border ${
                      lockAspect
                        ? "bg-indigo-500/15 border-indigo-500/40 text-[#818cf8]"
                        : "bg-white/6 border-white/8 text-[#64748b]"
                    }`}
                    aria-label={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
                  >
                    {lockAspect ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide">Height (px)</label>
                      <span className="text-[0.75rem] text-[#64748b]">Max 20,000px</span>
                    </div>
                    <input
                      type="number"
                      className={`w-full py-3 px-4 rounded-xl bg-[#13131f] border text-[#f8fafc] text-[0.95rem] transition-all outline-none ${
                        height > MAX_ALLOWED_DIMENSION
                          ? "border-red-500/80 focus:border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                          : "border-white/8 focus:border-[#6366f1]"
                      }`}
                      value={height}
                      min="1"
                      max={MAX_ALLOWED_DIMENSION}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      aria-label="Image height in pixels"
                    />
                  </div>
                </div>

                {/* Target File Size Control (KB / MB) */}
                <div className="pt-4 border-t border-white/8">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={targetSizeEnabled}
                        onChange={(e) => setTargetSizeEnabled(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#6366f1] cursor-pointer"
                      />
                      <span className="text-[0.875rem] font-semibold text-[#f8fafc] flex items-center gap-1.5">
                        <HardDrive size={15} className="text-[#6366f1]" />
                        Limit Target File Size (KB / MB)
                      </span>
                    </label>
                  </div>

                  {targetSizeEnabled && (
                    <div className="flex gap-2 items-center bg-[#13131f] p-3 rounded-xl border border-white/8">
                      <input
                        type="number"
                        placeholder="e.g. 50, 100, 500"
                        value={targetSizeVal}
                        onChange={(e) => setTargetSizeVal(e.target.value)}
                        className="flex-1 bg-transparent border-none text-[#f8fafc] outline-none text-[0.95rem] px-2"
                        min="1"
                      />
                      <div className="flex gap-1 border-l border-white/10 pl-2">
                        {["KB", "MB"].map((unit) => (
                          <button
                            key={unit}
                            type="button"
                            onClick={() => setTargetSizeUnit(unit)}
                            className={`px-3 py-1 rounded text-[0.8rem] font-bold transition-all ${
                              targetSizeUnit === unit
                                ? "bg-[#6366f1] text-white"
                                : "text-[#94a3b8] hover:text-white"
                            }`}
                          >
                            {unit}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Output Format */}
                <div className="mt-5">
                  <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2">Output Format</label>
                  <div className="flex gap-2.5">
                    {["jpeg", "png", "webp"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        className={`py-2.5 px-5 rounded-lg border text-[0.875rem] font-semibold cursor-pointer uppercase font-['Inter'] transition-all ${
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

                {/* Quality Slider (when target size not explicitly set) */}
                {outputFormat !== "png" && !targetSizeEnabled && (
                  <div className="mt-5">
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
                  disabled={resizing || !width || !height || width > MAX_ALLOWED_DIMENSION || height > MAX_ALLOWED_DIMENSION}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                >
                  {resizing ? (
                    <><RefreshCw size={18} className="animate-spin" /> Resizing...</>
                  ) : (
                    <><RefreshCw size={18} /> Resize Image</>
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
              <p className="font-bold text-emerald-400 mb-0.5">Resize Complete! ({result.mode?.toUpperCase()})</p>
              <p className="text-[0.85rem] text-[#94a3b8]">
                {result.name} · {result.size} · {result.width}×{result.height}px
              </p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
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
              {downloading ? "Downloading..." : "Download Resized"}
            </Button>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline flex-1"
            >
              <Button variant="secondary" size="lg" className="w-full justify-center">
                <ExternalLink size={18} />
                Open in New Tab
              </Button>
            </a>
            <Button variant="secondary" size="lg" onClick={reset}>Resize Another</Button>
          </div>
        </div>
      )}
    </div>
  );
}
