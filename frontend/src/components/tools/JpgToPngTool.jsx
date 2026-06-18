"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle } from "lucide-react";
import Button from "@/components/Button";

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
    <div className="max-w-[800px] mx-auto">
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
          <div className="p-6 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl mb-6 flex items-center gap-3">
            <CheckCircle size={22} className="text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-400 mb-0.5">
                Conversion Successful!
              </p>
              <p className="text-[0.85rem] text-[#94a3b8]">
                {result.name} · {result.size} · {result.width}×{result.height}px
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={result.url}
              download={result.name}
              className="flex-1 no-underline"
            >
              <Button variant="primary" size="lg" className="w-full justify-center">
                <Download size={18} />
                Download PNG
              </Button>
            </a>
            <Button variant="secondary" size="lg" onClick={reset}>
              Convert Another
            </Button>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12">
        <h2 className="font-['Outfit'] font-bold text-[1.25rem] mb-4 text-[#f8fafc]">
          About JPG to PNG Conversion
        </h2>
        <div className="text-[#94a3b8] text-[0.9rem] leading-[1.8] flex flex-col gap-3">
          <p>
            <strong className="text-[#f8fafc]">Why convert JPG to PNG?</strong>{" "}
            PNG (Portable Network Graphics) is a lossless format that supports transparency (alpha
            channel), making it ideal for logos, icons, and graphics that need to be placed on
            different colored backgrounds.
          </p>
          <p>
            <strong className="text-[#f8fafc]">Is this conversion free?</strong>{" "}
            Yes, completely free. All processing happens in your browser — your images are never
            uploaded to any server.
          </p>
          <p>
            <strong className="text-[#f8fafc]">Will quality be affected?</strong>{" "}
            PNG is lossless, so the converted image will maintain the same visual quality as your
            original JPG, but may result in a larger file size.
          </p>
        </div>
      </div>
    </div>
  );
}
