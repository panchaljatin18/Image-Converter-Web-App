"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import imageCompression from "browser-image-compression";
import { Download, RefreshCw, CheckCircle, Sliders, Zap } from "lucide-react";

export default function ImageCompressorTool() {
  const [file, setFile] = useState(null);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1920);
  const [quality, setQuality] = useState(80);
  const [useWebWorker] = useState(true);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const collapseUploadAfterSelection = true;
  const uploaderActivity = compressing
    ? {
        state: "processing",
        label: "Compressing image",
        detail: "Optimizing size and quality in your browser",
        progress,
      }
    : file
      ? {
          state: "ready",
          label: "Image selected",
          detail: "Choose a preset or compress now",
        }
      : null;

  const handleCompress = useCallback(async () => {
    if (!file) return;
    setCompressing(true);
    setProgress(10);

    try {
      const options = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker,
        initialQuality: quality / 100,
        onProgress: (p) => setProgress(Math.min(90, p)),
      };

      const compressed = await imageCompression(file, options);
      setProgress(100);

      const ext = file.name.match(/\.(jpe?g|png|webp)$/i)?.[1] || "jpg";
      const outputName = file.name.replace(/\.[^.]+$/, `_compressed.${ext}`);
      const outputUrl = URL.createObjectURL(compressed);

      setResult({
        url: outputUrl,
        name: outputName,
        originalSize: (file.size / 1024).toFixed(1),
        compressedSize: (compressed.size / 1024).toFixed(1),
        savings: (((file.size - compressed.size) / file.size) * 100).toFixed(1),
      });
    } catch (err) {
      alert("Compression failed: " + err.message);
    } finally {
      setCompressing(false);
    }
  }, [file, maxSizeMB, maxWidthOrHeight, quality, useWebWorker]);

  const reset = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
  };

  const presets = [
    { label: "Web", maxSizeMB: 0.5, maxWidthOrHeight: 1280, quality: 75 },
    { label: "Social Media", maxSizeMB: 1, maxWidthOrHeight: 1920, quality: 80 },
    { label: "Email", maxSizeMB: 0.3, maxWidthOrHeight: 800, quality: 70 },
    { label: "High Quality", maxSizeMB: 2, maxWidthOrHeight: 3840, quality: 90 },
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {!result ? (
        <>
          <ToolUploader
            accept="image/*"
            supportedFormats={["JPG", "PNG", "WebP", "GIF"]}
            title="Drop your image to compress"
            subtitle="Reduce file size while keeping great quality"
            onFilesSelected={(f) => setFile(f)}
            maxSizeMB={50}
            activity={uploaderActivity}
            collapseOnSelect={collapseUploadAfterSelection}
            primaryAction={{
              label: "Compress Image",
              loadingLabel: "Compressing...",
              icon: Zap,
              onClick: handleCompress,
              disabled: compressing,
            }}
          />

          {file && (
            <div style={{ marginTop: "24px" }}>
              {/* Presets */}
              <div style={{ marginBottom: "20px" }}>
                <label className="form-label">Quick Presets</label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {presets.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        setMaxSizeMB(p.maxSizeMB);
                        setMaxWidthOrHeight(p.maxWidthOrHeight);
                        setQuality(p.quality);
                      }}
                      className="btn btn-ghost btn-sm"
                    >
                      <Zap size={13} />
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
                  Compression Settings
                </h3>

                {/* Max File Size */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <label className="form-label" style={{ margin: 0 }}>Target Max Size</label>
                    <span style={{ fontWeight: 700, color: "var(--primary-light)", fontSize: "0.9rem" }}>
                      {maxSizeMB < 1 ? `${maxSizeMB * 1000}KB` : `${maxSizeMB}MB`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={maxSizeMB}
                    onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                    aria-label="Target max file size"
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    <span>100KB</span>
                    <span>10MB</span>
                  </div>
                </div>

                {/* Max Dimension */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <label className="form-label" style={{ margin: 0 }}>Max Width/Height</label>
                    <span style={{ fontWeight: 700, color: "var(--primary-light)", fontSize: "0.9rem" }}>
                      {maxWidthOrHeight}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="320"
                    max="4096"
                    step="64"
                    value={maxWidthOrHeight}
                    onChange={(e) => setMaxWidthOrHeight(Number(e.target.value))}
                    aria-label="Max image dimension"
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    <span>320px</span>
                    <span>4096px</span>
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
                    aria-label="Compression quality"
                  />
                </div>
              </div>

              {!collapseUploadAfterSelection && (
                <>
                  {compressing && (
                    <div style={{ marginBottom: "20px" }}>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                        Compressing... {progress}%
                      </p>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleCompress}
                    disabled={compressing}
                    className="btn btn-primary btn-lg"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {compressing ? (
                      <><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Compressing...</>
                    ) : (
                      <><Zap size={18} /> Compress Image</>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div>
          {/* Savings Banner */}
          <div
            style={{
              padding: "24px",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <CheckCircle size={22} color="#34d399" />
              <p style={{ fontWeight: 700, color: "#34d399" }}>Compression Complete!</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {[
                { label: "Original Size", value: `${result.originalSize} KB`, color: "var(--text-secondary)" },
                { label: "Compressed Size", value: `${result.compressedSize} KB`, color: "#34d399" },
                { label: "Size Reduction", value: `${result.savings}%`, color: "#fbbf24" },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", color: stat.color }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "18px 20px",
              borderRadius: "16px",
              border: "1px solid var(--border-light)",
              marginBottom: "20px",
              background: "rgba(255,255,255,0.03)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <p style={{ fontWeight: 700, color: "var(--text-primary)" }}>
              Output ready
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {result.name} has been compressed successfully. The preview is hidden to keep the
              result area clean. Use the download button below to save the file.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <span>Original: {result.originalSize} KB</span>
              <span>Compressed: {result.compressedSize} KB</span>
              <span>Saved: {result.savings}%</span>
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
              Download Compressed
            </a>
            <button onClick={reset} className="btn btn-secondary btn-lg">
              Compress Another
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
