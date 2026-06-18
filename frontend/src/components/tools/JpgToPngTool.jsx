"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle } from "lucide-react";

export default function JpgToPngTool() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const collapseUploadAfterSelection = true;
  const uploaderActivity = converting
    ? {
        state: "processing",
        label: "Converting JPG to PNG",
        detail: "Processing your image locally",
        progress,
      }
    : file
      ? {
          state: "ready",
          label: "Image selected",
          detail: "Ready to convert to PNG",
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
      ctx.drawImage(img, 0, 0);

      setProgress(85);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      setProgress(100);

      const outputUrl = URL.createObjectURL(blob);
      const outputName = file.name.replace(/\.(jpe?g|jpg)$/i, ".png");

      setResult({
        url: outputUrl,
        name: outputName,
        size: (blob.size / 1024).toFixed(1) + " KB",
        width: img.naturalWidth,
        height: img.naturalHeight,
      });

      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to convert image. Please try another file.");
    } finally {
      setConverting(false);
    }
  }, [file]);

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
            accept=".jpg,.jpeg,image/jpeg"
            supportedFormats={["JPG", "JPEG"]}
            title="Drop your JPG image here"
            subtitle="or click to browse — supports .jpg and .jpeg files"
            onFilesSelected={(f) => setFile(f)}
            activity={uploaderActivity}
            collapseOnSelect={collapseUploadAfterSelection}
            primaryAction={{
              label: "Convert to PNG",
              loadingLabel: "Converting...",
              icon: RefreshCw,
              onClick: handleConvert,
              disabled: converting,
            }}
          />

          {file && !collapseUploadAfterSelection && null}
        </>
      ) : (
        /* Result */
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
              Download PNG
            </a>
            <button onClick={reset} className="btn btn-secondary btn-lg">
              Convert Another
            </button>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div style={{ marginTop: "48px" }}>
        <h2
          style={{
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            fontSize: "1.25rem",
            marginBottom: "16px",
            color: "var(--text-primary)",
          }}
        >
          About JPG to PNG Conversion
        </h2>
        <div
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            lineHeight: 1.8,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Why convert JPG to PNG?</strong>{" "}
            PNG (Portable Network Graphics) is a lossless format that supports transparency (alpha
            channel), making it ideal for logos, icons, and graphics that need to be placed on
            different colored backgrounds.
          </p>
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Is this conversion free?</strong>{" "}
            Yes, completely free. All processing happens in your browser — your images are never
            uploaded to any server.
          </p>
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Will quality be affected?</strong>{" "}
            PNG is lossless, so the converted image will maintain the same visual quality as your
            original JPG, but may result in a larger file size.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
