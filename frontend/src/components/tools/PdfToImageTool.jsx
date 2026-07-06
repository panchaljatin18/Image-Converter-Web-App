"use client";

import { useState, useCallback } from "react";
import { Download, FileText, AlertCircle, Info } from "lucide-react";
import Button from "@/components/Button";
import { useConversionLimit } from "@/context/ConversionLimitContext";

const getPdfErrorMessage = (err, pdfjsLib) => {
  const rawMessage = err?.message?.trim() || "Unknown PDF conversion error.";

  const isPasswordError =
    err?.name === "PasswordException" ||
    err?.code === pdfjsLib?.PasswordResponses?.NEED_PASSWORD ||
    err?.code === pdfjsLib?.PasswordResponses?.INCORRECT_PASSWORD ||
    /password/i.test(rawMessage);

  if (isPasswordError) {
    return "This PDF is password-protected and cannot be converted. Remove the password and try again.";
  }

  if (/api version|worker version/i.test(rawMessage)) {
    return "PDF.js worker version mismatch. Refresh the app so the bundled worker is reloaded.";
  }

  return rawMessage;
};

export default function PdfToImageTool() {
  const { checkConversionLimit, incrementConversionCount } = useConversionLimit();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [scale, setScale] = useState(2);
  const [results, setResults] = useState([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError("");
    } else {
      setError("Please upload a PDF file.");
    }
  };

  const handleFileInput = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setError("");
    }
  };

  const handleConvert = useCallback(async () => {
    if (!file) return;
    if (!checkConversionLimit()) return;
    setConverting(true);
    setProgress(5);
    setResults([]);
    setError("");

    let pdfjsLib;
    try {
      // Import the package's bundled worker so the API and worker stay in sync.
      pdfjsLib = await import("pdfjs-dist/webpack.mjs");

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const convertedPages = [];

      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round(5 + ((i / numPages) * 85)));

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");

        if (outputFormat === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({ canvasContext: ctx, viewport }).promise;

        const mime = outputFormat === "png" ? "image/png" : "image/jpeg";
        const ext = outputFormat === "png" ? "png" : "jpg";
        const blob = await new Promise((res) => canvas.toBlob(res, mime, 0.92));
        if (!blob) {
          throw new Error("The browser could not generate an image from this page.");
        }
        const url = URL.createObjectURL(blob);
        const name = `${file.name.replace(/\.pdf$/i, "")}_page${i}.${ext}`;

        convertedPages.push({
          url,
          name,
          size: (blob.size / 1024).toFixed(1) + " KB",
          page: i,
          width: canvas.width,
          height: canvas.height,
        });
      }

      setProgress(100);
      setResults(convertedPages);
      incrementConversionCount();
    } catch (err) {
      setError(`Failed to convert PDF: ${getPdfErrorMessage(err, pdfjsLib)}`);
    } finally {
      setConverting(false);
    }
  }, [file, outputFormat, scale]);

  const downloadAll = async () => {
    for (const r of results) {
      const a = document.createElement("a");
      a.href = r.url;
      a.download = r.name;
      a.click();
      await new Promise((res) => setTimeout(res, 300));
    }
  };

  const reset = () => {
    setFile(null);
    setResults([]);
    setError("");
    setProgress(0);
  };

  return (
    <div className="max-w-[800px] mx-auto">
      {results.length === 0 ? (
        <>
          {/* Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-[24px] py-16 px-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden select-none outline-none ${
              isDragging
                ? "border-[#6366f1] bg-indigo-500/8 shadow-[0_0_30px_rgba(99,102,241,0.15)]"
                : "border-indigo-500/35 bg-indigo-500/4 hover:border-[#6366f1] hover:bg-indigo-500/8 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
            }`}
            onClick={() => document.getElementById("pdf-input").click()}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            role="button"
            tabIndex={0}
            aria-label="Upload PDF"
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("pdf-input").click()}
          >
            <input
              id="pdf-input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInput}
              className="absolute w-0 h-0 opacity-0 pointer-events-none"
              aria-hidden="true"
            />
            <div className="flex flex-col items-center gap-4 relative z-[1]">
              <div className="w-[72px] h-[72px] rounded-[18px] bg-gradient-to-br from-[#ec4899]/20 to-[#f97316]/10 border border-[#ec4899]/30 flex items-center justify-center">
                <FileText size={30} className="text-[#ec4899]" />
              </div>
              <div>
                <p className="font-['Outfit'] font-bold text-[1.25rem] text-[#f8fafc] mb-1.5">
                  {file ? file.name : "Drop your PDF here"}
                </p>
                <p className="text-[#64748b] text-[0.9rem]">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse — PDF files only"}
                </p>
              </div>
              <span className="py-1 px-3.5 rounded-full border text-[0.75rem] font-bold tracking-wider uppercase border-[#ec4899]/25 bg-[#ec4899]/12 text-[#f472b6]">
                PDF
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3 px-4 bg-red-500/10 border border-red-500/30 rounded-lg mt-4 text-red-300 text-[0.875rem]">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {file && (
            <div className="mt-6">
              {/* Info */}
              <div className="p-[14px_18px] bg-indigo-500/7 border border-indigo-500/15 rounded-xl flex items-center gap-2.5 mb-5 text-[0.875rem] text-[#94a3b8]">
                <Info size={16} className="text-[#818cf8]" />
                Each PDF page will be converted to a separate image. Password-protected PDFs are not supported.
              </div>

              {/* Settings */}
              <div className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-5">
                <h3 className="font-bold text-[1rem] mb-5 text-[#f8fafc]">Conversion Settings</h3>

                <div className="mb-5">
                  <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2">Output Format</label>
                  <div className="flex gap-2.5">
                    {["jpeg", "png"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        className={`py-2.5 px-6 rounded-lg border text-[0.875rem] font-semibold cursor-pointer font-['Inter'] transition-all duration-200 ${
                          outputFormat === fmt
                            ? "border-[#6366f1] bg-indigo-500/15 text-[#818cf8]"
                            : "border-white/8 bg-transparent text-[#94a3b8]"
                        }`}
                      >
                        {fmt === "jpeg" ? "JPG" : "PNG"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2.5">
                    <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide">Resolution Scale</label>
                    <span className="font-bold text-[#818cf8] text-[0.9rem]">{scale}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
                    aria-label="Resolution scale"
                  />
                  <div className="flex justify-between text-[0.75rem] text-[#64748b] mt-1">
                    <span>72 DPI (fast)</span>
                    <span>288 DPI (print quality)</span>
                  </div>
                </div>
              </div>

              {converting && (
                <div className="mb-5">
                  <p className="text-[0.85rem] text-[#64748b] mb-2">Converting pages... {progress}%</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4] transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <Button
                onClick={handleConvert}
                disabled={converting}
                variant="primary"
                size="lg"
                className="w-full justify-center"
              >
                {converting ? (
                  <><FileText size={18} className="animate-spin" /> Converting PDF...</>
                ) : (
                  <><FileText size={18} /> Convert PDF to Images</>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        /* Results view */
        <div>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <p className="font-bold text-[1.1rem] text-[#f8fafc]">
              ✅ {results.length} page{results.length > 1 ? "s" : ""} converted
            </p>
            <div className="flex gap-2.5">
              {results.length > 1 && (
                <Button onClick={downloadAll} variant="primary">
                  <Download size={16} />
                  Download All
                </Button>
              )}
              <Button onClick={reset} variant="secondary">Convert Another</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((r) => (
              <div key={r.page} className="bg-[#1a1a2e] border border-white/8 rounded-2xl overflow-hidden flex flex-col">
                <div className="bg-indigo-500/8 h-40 flex items-center justify-center text-center p-[18px]">
                  <div>
                    <FileText size={34} className="text-[#6366f1] mb-2.5 mx-auto" />
                    <p className="font-bold text-[#f8fafc] mb-1">Page {r.page}</p>
                    <p className="text-[#64748b] text-[0.8rem]">
                      {r.width}×{r.height}px
                    </p>
                  </div>
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div className="mb-3">
                    <p className="font-semibold text-[0.875rem] mb-1 text-[#f8fafc]">Page {r.page}</p>
                    <p className="text-[#64748b] text-[0.75rem]">
                      {r.size} · {r.width}×{r.height}px
                    </p>
                  </div>
                  <a href={r.url} download={r.name} className="w-full no-underline block">
                    <Button variant="primary" size="sm" className="w-full justify-center gap-1.5">
                      <Download size={13} />
                      Download
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
