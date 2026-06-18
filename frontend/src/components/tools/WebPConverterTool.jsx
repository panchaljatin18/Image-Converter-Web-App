"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Sliders } from "lucide-react";

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
    setProgress(20);

    try {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      img.src = url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      setProgress(65);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (selectedFormat.mime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      setProgress(85);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, selectedFormat.mime, quality / 100)
      );

      setProgress(100);

      const baseName = file.name.replace(/\.(webp|png|jpe?g|gif|bmp)$/i, "");
      const outputName = baseName + selectedFormat.ext;
      const outputUrl = URL.createObjectURL(blob);

      setResult({
        url: outputUrl,
        name: outputName,
        size: (blob.size / 1024).toFixed(1) + " KB",
        originalSize: (file.size / 1024).toFixed(1) + " KB",
        savings: (((file.size - blob.size) / file.size) * 100).toFixed(1),
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: selectedFormat.label,
      });

      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to convert. Make sure your browser supports WebP.");
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
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
            <div style={{ marginTop: "24px" }}>
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
                  }}
                >
                  <Sliders size={16} color="var(--primary)" />
                  Conversion Settings
                </h3>

                {/* Format Selector */}
                <div style={{ marginBottom: "20px" }}>
                  <label className="form-label">Output Format</label>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {OUTPUT_FORMATS.map((fmt) => (
                      <button
                        key={fmt.value}
                        onClick={() => setOutputFormat(fmt.value)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "10px",
                          border: outputFormat === fmt.value
                            ? "2px solid var(--primary)"
                            : "1px solid var(--border-light)",
                          background: outputFormat === fmt.value
                            ? "rgba(99,102,241,0.15)"
                            : "transparent",
                          color: outputFormat === fmt.value
                            ? "var(--primary-light)"
                            : "var(--text-secondary)",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <label className="form-label" style={{ margin: 0 }}>Quality</label>
                    <span style={{ fontWeight: 700, color: "var(--primary-light)", fontSize: "0.9rem" }}>
                      {quality}%
                    </span>
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
                      <><RefreshCw size={18} /> Convert Image</>
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
                Conversion Successful! ({result.format})
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
              Download {selectedFormat?.ext.replace(".", "").toUpperCase()}
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
