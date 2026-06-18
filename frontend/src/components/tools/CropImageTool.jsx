"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Crop, RotateCw } from "lucide-react";

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
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
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
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px", alignItems: "center" }}>
                <div>
                  <label className="form-label" style={{ marginBottom: "6px", display: "block" }}>Aspect Ratio</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {ASPECT_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => { setAspectPreset(p); setCrop({ x: 0, y: 0, w: 0, h: 0 }); }}
                        style={{
                          padding: "7px 14px",
                          borderRadius: "8px",
                          border: aspectPreset.label === p.label ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                          background: aspectPreset.label === p.label ? "rgba(99,102,241,0.15)" : "transparent",
                          color: aspectPreset.label === p.label ? "var(--primary-light)" : "var(--text-secondary)",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <label className="form-label" style={{ marginBottom: "6px", display: "block" }}>Format</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["jpeg", "png", "webp"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        style={{
                          padding: "7px 14px",
                          borderRadius: "8px",
                          border: outputFormat === fmt ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                          background: outputFormat === fmt ? "rgba(99,102,241,0.15)" : "transparent",
                          color: outputFormat === fmt ? "var(--primary-light)" : "var(--text-secondary)",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          textTransform: "uppercase",
                        }}
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
                style={{
                  position: "relative",
                  display: "inline-block",
                  cursor: "crosshair",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  userSelect: "none",
                  width: "100%",
                }}
                onMouseDown={handleMouseDown}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Crop preview"
                  style={{ display: "block", width: "100%", height: "auto", maxHeight: "500px", objectFit: "contain" }}
                  onLoad={(e) => {
                    setNaturalDims({ w: e.target.naturalWidth, h: e.target.naturalHeight });
                  }}
                  draggable={false}
                />

                {/* Crop Overlay */}
                {crop.w > 5 && crop.h > 5 && (
                  <>
                    {/* Dimming overlays */}
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", pointerEvents: "none" }} />
                    {/* Clear crop box */}
                    <div
                      style={{
                        position: "absolute",
                        left: displayCrop.left,
                        top: displayCrop.top,
                        width: displayCrop.width,
                        height: displayCrop.height,
                        border: "2px solid var(--primary)",
                        background: "transparent",
                        pointerEvents: "none",
                        boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                      }}
                    >
                      {/* Rule of thirds grid */}
                      {[1, 2].map((i) => (
                        <div key={`h${i}`} style={{ position: "absolute", left: 0, right: 0, top: `${(i / 3) * 100}%`, height: "1px", background: "rgba(255,255,255,0.4)" }} />
                      ))}
                      {[1, 2].map((i) => (
                        <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${(i / 3) * 100}%`, width: "1px", background: "rgba(255,255,255,0.4)" }} />
                      ))}
                      {/* Corner handles */}
                      {[
                        { t: -4, l: -4 }, { t: -4, r: -4 },
                        { b: -4, l: -4 }, { b: -4, r: -4 },
                      ].map((pos, i) => (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            width: "12px",
                            height: "12px",
                            background: "var(--primary)",
                            borderRadius: "2px",
                            ...pos,
                          }}
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: displayCrop.left + 4,
                        top: displayCrop.top + 4,
                        background: "rgba(0,0,0,0.7)",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        pointerEvents: "none",
                        fontFamily: "Inter, monospace",
                      }}
                    >
                      {Math.round(crop.w)} × {Math.round(crop.h)}
                    </div>
                  </>
                )}
              </div>

              <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "10px" }}>
                Click and drag on the image to select the crop area
              </p>

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button
                  onClick={handleCrop}
                  disabled={crop.w < 10 || crop.h < 10}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  <Crop size={18} />
                  Crop Image ({Math.round(crop.w)}×{Math.round(crop.h)}px)
                </button>
                <button onClick={reset} className="btn btn-secondary">
                  <RefreshCw size={16} />
                  Reset
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <div
            style={{
              padding: "24px",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "16px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <CheckCircle size={22} color="#34d399" />
            <div>
              <p style={{ fontWeight: 700, color: "#34d399", marginBottom: "2px" }}>Crop Complete!</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {result.name} · {result.size} · {result.width}×{result.height}px
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <a href={result.url} download={result.name} className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: "center" }}>
              <Download size={18} />
              Download Cropped
            </a>
            <button onClick={reset} className="btn btn-secondary btn-lg">Crop Another</button>
          </div>
        </div>
      )}
    </div>
  );
}
