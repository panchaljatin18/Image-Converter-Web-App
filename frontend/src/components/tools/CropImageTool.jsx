"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Crop } from "lucide-react";
import Button from "@/components/Button";

export default function CropImageTool() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [naturalDims, setNaturalDims] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [result, setResult] = useState(null);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [previewRect, setPreviewRect] = useState({ w: 0, h: 0 });
  const previewRef = useRef(null);
  const imgRef = useRef(null);

  const ASPECT_PRESETS = [
    { label: "Free", w: null, h: null },
    { label: "1:1", w: 1, h: 1 },
    { label: "16:9", w: 16, h: 9 },
    { label: "4:3", w: 4, h: 3 },
    { label: "3:2", w: 3, h: 2 },
    { label: "9:16", w: 9, h: 16 },
  ];

  const [aspectPreset, setAspectPreset] = useState(ASPECT_PRESETS[0]);

  const handleFileSelected = useCallback((f) => {
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setImageUrl(url);
  }, []);

  const getPreviewRect = useCallback(() => {
    if (!imgRef.current) return { left: 0, top: 0, scaleX: 1, scaleY: 1, w: 0, h: 0 };
    const rect = imgRef.current.getBoundingClientRect();
    const scaleX = naturalDims.w / rect.width;
    const scaleY = naturalDims.h / rect.height;
    return { left: rect.left, top: rect.top, scaleX, scaleY, w: rect.width, h: rect.height };
  }, [naturalDims]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const { left, top, scaleX, scaleY } = getPreviewRect();
    const x = Math.round((e.clientX - left) * scaleX);
    const y = Math.round((e.clientY - top) * scaleY);
    setDragStart({ x, y });
    setCrop({ x, y, w: 0, h: 0 });
    setDragging(true);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      const { left, top, scaleX, scaleY } = getPreviewRect();
      let curX = Math.round((e.clientX - left) * scaleX);
      let curY = Math.round((e.clientY - top) * scaleY);

      curX = Math.max(0, Math.min(curX, naturalDims.w));
      curY = Math.max(0, Math.min(curY, naturalDims.h));

      let w = curX - dragStart.x;
      let h = curY - dragStart.y;

      if (aspectPreset.w && aspectPreset.h) {
        const ratio = aspectPreset.w / aspectPreset.h;
        h = w / ratio;
      }

      setCrop({
        x: w >= 0 ? dragStart.x : dragStart.x + w,
        y: h >= 0 ? dragStart.y : dragStart.y + h,
        w: Math.abs(w),
        h: Math.abs(h),
      });
    },
    [dragging, dragStart, getPreviewRect, naturalDims, aspectPreset]
  );

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, handleMouseMove]);

  useEffect(() => {
    const updatePreviewRect = () => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      setPreviewRect({ w: rect.width, h: rect.height });
    };

    updatePreviewRect();
    window.addEventListener("resize", updatePreviewRect);
    return () => window.removeEventListener("resize", updatePreviewRect);
  }, [imageUrl, naturalDims.w, naturalDims.h]);

  const handleCrop = useCallback(async () => {
    if (!file || crop.w < 10 || crop.h < 10) {
      alert("Please draw a crop area first (at least 10×10 pixels).");
      return;
    }

    const img = new window.Image();
    img.src = imageUrl;
    await new Promise((res) => (img.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(crop.w);
    canvas.height = Math.round(crop.h);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, Math.round(crop.x), Math.round(crop.y), Math.round(crop.w), Math.round(crop.h), 0, 0, canvas.width, canvas.height);

    const mime = outputFormat === "png" ? "image/png" : outputFormat === "webp" ? "image/webp" : "image/jpeg";
    const ext = outputFormat === "png" ? ".png" : outputFormat === "webp" ? ".webp" : ".jpg";

    const blob = await new Promise((res) => canvas.toBlob(res, mime, 0.95));
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const outputName = `${baseName}_cropped${ext}`;
    const outputUrl = URL.createObjectURL(blob);

    setResult({
      url: outputUrl,
      name: outputName,
      size: (blob.size / 1024).toFixed(1) + " KB",
      width: canvas.width,
      height: canvas.height,
    });
  }, [file, crop, imageUrl, outputFormat]);

  const reset = () => {
    setFile(null);
    setImageUrl(null);
    setResult(null);
    setCrop({ x: 0, y: 0, w: 0, h: 0 });
    setNaturalDims({ w: 0, h: 0 });
  };

  const displayCrop =
    previewRect.w && previewRect.h && naturalDims.w && naturalDims.h
      ? {
          left: (crop.x / naturalDims.w) * previewRect.w,
          top: (crop.y / naturalDims.h) * previewRect.h,
          width: (crop.w / naturalDims.w) * previewRect.w,
          height: (crop.h / naturalDims.h) * previewRect.h,
        }
      : { left: 0, top: 0, width: 0, height: 0 };

  return (
    <div className="max-w-[900px] mx-auto">
      {!result ? (
        <>
          {!imageUrl ? (
            <ToolUploader
              accept="image/*"
              supportedFormats={["JPG", "PNG", "WebP", "GIF"]}
              title="Drop your image to crop"
              subtitle="Draw to select the crop area after uploading"
              onFilesSelected={handleFileSelected}
            />
          ) : (
            <div>
              {/* Controls */}
              <div className="flex gap-3 flex-wrap mb-4 items-center">
                <div>
                  <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-1.5">Aspect Ratio</label>
                  <div className="flex gap-2">
                    {ASPECT_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => { setAspectPreset(p); setCrop({ x: 0, y: 0, w: 0, h: 0 }); }}
                        className={`py-1.5 px-3.5 rounded-lg border text-[0.8rem] font-semibold cursor-pointer font-['Inter'] transition-all duration-200 ${
                          aspectPreset.label === p.label
                            ? "border-[#6366f1] bg-indigo-500/15 text-[#818cf8]"
                            : "border-white/8 bg-transparent text-[#94a3b8]"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:ml-auto">
                  <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-1.5">Format</label>
                  <div className="flex gap-2">
                    {["jpeg", "png", "webp"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        className={`py-1.5 px-3.5 rounded-lg border text-[0.8rem] font-semibold cursor-pointer uppercase font-['Inter'] transition-all duration-200 ${
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
              </div>

              {/* Canvas Area */}
              <div
                ref={previewRef}
                className="relative inline-block cursor-crosshair rounded-2xl overflow-hidden border border-white/10 select-none w-full"
                onMouseDown={handleMouseDown}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Crop preview"
                  className="block w-full h-auto max-h-[500px] object-contain"
                  onLoad={(e) => {
                    setNaturalDims({ w: e.target.naturalWidth, h: e.target.naturalHeight });
                  }}
                  draggable={false}
                />

                {/* Crop Overlay */}
                {crop.w > 5 && crop.h > 5 && (
                  <>
                    {/* Dimming overlays */}
                    <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                    {/* Clear crop box */}
                    <div
                      className="absolute border-2 border-[#6366f1] bg-transparent pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                      style={{
                        left: displayCrop.left,
                        top: displayCrop.top,
                        width: displayCrop.width,
                        height: displayCrop.height,
                      }}
                    >
                      {/* Rule of thirds grid */}
                      {[1, 2].map((i) => (
                        <div key={`h${i}`} className="absolute left-0 right-0 h-px bg-white/40" style={{ top: `${(i / 3) * 100}%` }} />
                      ))}
                      {[1, 2].map((i) => (
                        <div key={`v${i}`} className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: `${(i / 3) * 100}%` }} />
                      ))}
                      {/* Corner handles */}
                      {[
                        { top: -4, left: -4 }, { top: -4, right: -4 },
                        { bottom: -4, left: -4 }, { bottom: -4, right: -4 },
                      ].map((pos, i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-3 bg-[#6366f1] rounded-[2px]"
                          style={pos}
                        />
                      ))}
                    </div>
                    <div
                      className="absolute bg-black/70 text-white text-[11px] font-semibold py-0.5 px-1.5 rounded pointer-events-none font-mono"
                      style={{
                        left: displayCrop.left + 4,
                        top: displayCrop.top + 4,
                      }}
                    >
                      {Math.round(crop.w)} × {Math.round(crop.h)}
                    </div>
                  </>
                )}
              </div>

              <p className="text-center text-[#64748b] text-[0.85rem] mt-2.5">
                Click and drag on the image to select the crop area
              </p>

              <div className="flex gap-3 mt-5">
                <Button
                  onClick={handleCrop}
                  disabled={crop.w < 10 || crop.h < 10}
                  variant="primary"
                  size="lg"
                  className="flex-1 justify-center"
                >
                  <Crop size={18} />
                  Crop Image ({Math.round(crop.w)}×{Math.round(crop.h)}px)
                </Button>
                <Button variant="secondary" size="lg" onClick={reset}>
                  Reset
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Result */
        <div>
          <div className="p-6 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl mb-6 flex items-center gap-3">
            <CheckCircle size={22} className="text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-400 mb-0.5">Crop Complete!</p>
              <p className="text-[0.85rem] text-[#94a3b8]">
                {result.name} · {result.size} · {result.width}×{result.height}px
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <a href={result.url} download={result.name} className="flex-1 no-underline">
              <Button variant="primary" size="lg" className="w-full justify-center">
                <Download size={18} />
                Download Cropped
              </Button>
            </a>
            <Button variant="secondary" size="lg" onClick={reset}>Crop Another</Button>
          </div>
        </div>
      )}
    </div>
  );
}
