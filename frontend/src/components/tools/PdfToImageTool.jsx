"use client";

import { useState, useCallback } from "react";
import { Download, FileText, AlertCircle, Info } from "lucide-react";

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
    if (f) { setFile(f); setError(""); }
  };

  const handleConvert = useCallback(async () => {
    if (!file) return;
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
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {results.length === 0 ? (
        <>
          {/* Upload Zone */}
          <div
            className={`upload-zone ${isDragging ? "drag-over" : ""}`}
            onClick={() => document.getElementById("pdf-input").click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
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
              aria-hidden="true"
            />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", position: "relative", zIndex: 1 }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "18px", background: "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(249,115,22,0.1))", border: "2px solid rgba(236,72,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={30} color="#ec4899" />
              </div>
              <div>
                <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--text-primary)", marginBottom: "6px" }}>
                  {file ? file.name : "Drop your PDF here"}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse — PDF files only"}
                </p>
              </div>
              <span className="tag" style={{ background: "rgba(236,72,153,0.12)", color: "#f472b6", borderColor: "rgba(236,72,153,0.25)" }}>
                PDF
              </span>
            </div>
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", marginTop: "16px", color: "#fca5a5", fontSize: "0.875rem" }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {file && (
            <div style={{ marginTop: "24px" }}>
              {/* Info */}
              <div style={{ padding: "14px 18px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                <Info size={16} color="var(--primary-light)" />
                Each PDF page will be converted to a separate image. Password-protected PDFs are not supported.
              </div>

              {/* Settings */}
              <div style={{ padding: "24px", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "16px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "20px" }}>Conversion Settings</h3>

                <div style={{ marginBottom: "20px" }}>
                  <label className="form-label">Output Format</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["jpeg", "png"].map((fmt) => (
                      <button key={fmt} onClick={() => setOutputFormat(fmt)} style={{ padding: "10px 24px", borderRadius: "10px", border: outputFormat === fmt ? "2px solid var(--primary)" : "1px solid var(--border-light)", background: outputFormat === fmt ? "rgba(99,102,241,0.15)" : "transparent", color: outputFormat === fmt ? "var(--primary-light)" : "var(--text-secondary)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", fontFamily: "Inter", textTransform: "uppercase", transition: "all 0.2s ease" }}>
                        {fmt === "jpeg" ? "JPG" : "PNG"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <label className="form-label" style={{ margin: 0 }}>Resolution Scale</label>
                    <span style={{ fontWeight: 700, color: "var(--primary-light)", fontSize: "0.9rem" }}>{scale}x</span>
                  </div>
                  <input type="range" min="1" max="4" step="0.5" value={scale} onChange={(e) => setScale(Number(e.target.value))} aria-label="Resolution scale" />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    <span>72 DPI (fast)</span>
                    <span>288 DPI (print quality)</span>
                  </div>
                </div>
              </div>

              {converting && (
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>Converting pages... {progress}%</p>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <button onClick={handleConvert} disabled={converting} className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>
                {converting ? (
                  <><FileText size={18} style={{ animation: "spin 1s linear infinite" }} /> Converting PDF...</>
                ) : (
                  <><FileText size={18} /> Convert PDF to Images</>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
              ✅ {results.length} page{results.length > 1 ? "s" : ""} converted
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {results.length > 1 && (
                <button onClick={downloadAll} className="btn btn-primary">
                  <Download size={16} />
                  Download All
                </button>
              )}
              <button onClick={reset} className="btn btn-secondary">Convert Another</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
            {results.map((r) => (
              <div key={r.page} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "16px", overflow: "hidden" }}>
                <div style={{ background: "rgba(99,102,241,0.08)", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "18px" }}>
                  <div>
                    <FileText size={34} color="var(--primary)" style={{ marginBottom: "10px" }} />
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Page {r.page}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      {r.width}Ã—{r.height}px
                    </p>
                  </div>
                </div>
                <div style={{ padding: "14px" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "4px" }}>Page {r.page}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "12px" }}>
                    {r.size} · {r.width}×{r.height}px
                  </p>
                  <a href={r.url} download={r.name} className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                    <Download size={13} />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
