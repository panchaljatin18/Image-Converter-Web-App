"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle } from "lucide-react";
import Button from "@/components/Button";
import { useConversionLimit } from "@/context/ConversionLimitContext";
import { downloadFile } from "@/lib/downloadFile";

import imageCompression from "browser-image-compression";

export default function JpgToPngTool() {
  const { checkConversionLimit, incrementConversionCount } = useConversionLimit();
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
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
    if (!checkConversionLimit()) return;
    setConverting(true);
    setProgress(10);

    try {
      const { processFileWithBackend } = await import("@/lib/apiClient");

      await processFileWithBackend(file, {
        targetFormat: "png",
        options: { quality: 1, preserveMetadata: true },
        onProgress: (p) => setProgress(Math.max(10, p)),
        onSuccess: async (data) => {
          // The backend returns the final URL. Let's create an image to get dimensions.
          const img = new window.Image();
          img.src = data.outputUrl;

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error("Failed to load converted image"));
          });

          const outputName = file.name.replace(/\.(jpe?g|jpg)$/i, ".png");

          // We don't have the exact output blob size here easily without another fetch,
          // but we can just use the UI data or fetch headers.
          setResult({
            url: data.outputUrl,
            name: outputName,
            size: data.outputSize ? `${(data.outputSize / 1024).toFixed(1)} KB` : "Available on download",
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          incrementConversionCount();
        },
        onError: (err) => {
          console.error(err);
          alert("Failed to convert image. Please try another file.");
        }
      });
    } catch (err) {
      console.error(err);
      alert("Failed to initiate conversion.");
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
              {downloading ? "Downloading..." : "Download PNG"}
            </Button>
            <Button variant="secondary" size="lg" onClick={reset}>
              Convert Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
