"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders } from "lucide-react";

export default function PngToJpgTool() {
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
        label: "Converting PNG to JPG",
        detail: "Applying a solid background and encoding the file",
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
    setConverting(true);
    setProgress(20);

    try {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      img.src = url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      setProgress(60);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      // Fill background (handles PNG transparency)
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      setProgress(85);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality / 100)
      );

      setProgress(100);

      const outputUrl = URL.createObjectURL(blob);
      const outputName = file.name.replace(/\.png$/i, ".jpg");

      setResult({
        url: outputUrl,
        name: outputName,
        size: (blob.size / 1024).toFixed(1) + " KB",
        originalSize: (file.size / 1024).toFixed(1) + " KB",
        savings: (((file.size - blob.size) / file.size) * 100).toFixed(1),
        width: img.naturalWidth,
        height: img.naturalHeight,
      });

      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to convert image. Please try another file.");
    } finally {
      setConverting(false);
    }
  }, [file, quality, bgColor]);

  const reset = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {!result ? (
        <>
          <ToolUploader
            accept=".png,image/png"
            supportedFormats={["PNG"]}
            title="Drop your PNG image here"
            subtitle="or click to browse — supports .png files"
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
            <div style={{ marginTop: "24px" }}>
              {/* Settings */}
              <div
                style={{
                  padding: "24px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "16px",
                  marginBottom: "20px",
                }}
              >
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    marginBottom: "20px",
                    color: "var(--text-primary)",
                  }}
                >
                  <Sliders size={16} color="var(--primary)" />
                  Conversion Settings
                </h3>

                <div style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <label className="form-label" style={{ margin: 0 }}>
                      JPEG Quality
                    </label>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "var(--primary-light)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {quality}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    aria-label="JPEG quality"
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: "4px",
                    }}
                  >
                    <span>Small file</span>
                    <span>Best quality</span>
                  </div>
                </div>

                <div>
                  <label className="form-label">Background Color</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        border: "1px solid var(--border-light)",
                        cursor: "pointer",
                        background: "none",
                        padding: "2px",
                      }}
                      aria-label="Background color picker"
                    />
                    <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                      Fills transparent areas (PNG transparency → solid color)
                    </span>
                  </div>
                </div>
              </div>

              {!collapseUploadAfterSelection && (
                <>
                  {converting && (
                    <div style={{ marginBottom: "20px" }}>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                        Converting... {progress}%
                      </p>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleConvert}
                    disabled={converting}
                    className="btn btn-primary btn-lg"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {converting ? (
                      <><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Converting...</>
                    ) : (
                      <><RefreshCw size={18} /> Convert to JPG</>
                    )}
                  </button>
                </>
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
              <p style={{ fontWeight: 700, color: "#34d399", marginBottom: "2px" }}>
                Conversion Successful!
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {result.name} · {result.size} · {result.width}×{result.height}px
                {Number(result.savings) > 0 && (
                  <span style={{ color: "#34d399", marginLeft: "8px" }}>
                    ↓ {result.savings}% smaller
                  </span>
                )}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <a
              href={result.url}
              download={result.name}
              className="btn btn-primary btn-lg"
              style={{ flex: 1, justifyContent: "center" }}
            >
              <Download size={18} />
              Download JPG
            </a>
            <button onClick={reset} className="btn btn-secondary btn-lg">
              Convert Another
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
