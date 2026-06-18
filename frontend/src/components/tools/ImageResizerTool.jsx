"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders, Lock, Unlock } from "lucide-react";

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
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      img.src = url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

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
    } catch {
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
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
            <div style={{ marginTop: "24px" }}>
              {/* Presets */}
              <div style={{ marginBottom: "20px" }}>
                <label className="form-label">Quick Presets</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p)}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: "24px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "16px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "1rem", marginBottom: "20px" }}>
                  <Sliders size={16} color="var(--primary)" />
                  Resize Settings
                  {originalDims.w > 0 && (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 400, marginLeft: "8px" }}>
                      (Original: {originalDims.w}×{originalDims.h}px)
                    </span>
                  )}
                </h3>

                {/* Width / Height */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "12px", alignItems: "end", marginBottom: "20px" }}>
                  <div>
                    <label className="form-label">Width (px)</label>
                    <input
                      type="number"
                      className="form-input"
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
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: lockAspect ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.06)",
                      border: lockAspect ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--border-light)",
                      color: lockAspect ? "var(--primary-light)" : "var(--text-muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                      marginBottom: "0",
                    }}
                    aria-label={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
                  >
                    {lockAspect ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                  <div>
                    <label className="form-label">Height (px)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={height}
                      min="1"
                      max="8000"
                      onChange={(e) => handleHeightChange(e.target.value)}
                      aria-label="Image height in pixels"
                    />
                  </div>
                </div>

                {/* Output Format */}
                <div style={{ marginBottom: "20px" }}>
                  <label className="form-label">Output Format</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["jpeg", "png", "webp"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "10px",
                          border: outputFormat === fmt ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                          background: outputFormat === fmt ? "rgba(99,102,241,0.15)" : "transparent",
                          color: outputFormat === fmt ? "var(--primary-light)" : "var(--text-secondary)",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          textTransform: "uppercase",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {fmt === "jpeg" ? "JPG" : fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality */}
                {outputFormat !== "png" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      <label className="form-label" style={{ margin: 0 }}>Quality</label>
                      <span style={{ fontWeight: 700, color: "var(--primary-light)", fontSize: "0.9rem" }}>{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      aria-label="Output quality"
                    />
                  </div>
                )}
              </div>

              {!collapseUploadAfterSelection && (
                <button
                onClick={handleResize}
                disabled={resizing || !width || !height}
                className="btn btn-primary btn-lg"
                style={{ width: "100%", justifyContent: "center" }}
              >
                {resizing ? (
                  <><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Resizing...</>
                ) : (
                  <><RefreshCw size={18} /> Resize to {width}×{height}px</>
                )}
                </button>
              )}
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
              <p style={{ fontWeight: 700, color: "#34d399", marginBottom: "2px" }}>Resize Complete!</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {result.name} · {result.size} · {result.width}×{result.height}px
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <a href={result.url} download={result.name} className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: "center" }}>
              <Download size={18} />
              Download Resized
            </a>
            <button onClick={reset} className="btn btn-secondary btn-lg">Resize Another</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
