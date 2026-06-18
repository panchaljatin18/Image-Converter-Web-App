"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Plus, Trash2, FileText, ArrowUp, ArrowDown } from "lucide-react";
import { PDFDocument } from "pdf-lib";

const PAGE_SIZES = {
  A4: [595, 842],
  A3: [842, 1191],
  Letter: [612, 792],
  Legal: [612, 1008],
  Square: [595, 595],
};

export default function ImageToPdfTool() {
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState("A4");
  const [orientation, setOrientation] = useState("portrait");
  const [margin, setMargin] = useState(20);
  const [fit, setFit] = useState("contain");
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const uploaderActivity = converting
    ? {
        state: "processing",
        label: "Creating PDF",
        detail: "Arranging pages and building your document",
        progress,
      }
    : images.length > 0
      ? {
          state: "ready",
          label: `${images.length} image${images.length > 1 ? "s" : ""} selected`,
          detail: "Ready to create your PDF",
        }
      : null;

  const handleFilesSelected = useCallback((files) => {
    const fileArr = Array.isArray(files) ? files : [files];
    const newImages = fileArr.map((f) => ({
      file: f,
      name: f.name,
      url: URL.createObjectURL(f),
      size: (f.size / 1024).toFixed(1) + " KB",
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index, direction) => {
    setImages((prev) => {
      const arr = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= arr.length) return arr;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
  };

  const handleConvert = useCallback(async () => {
    if (images.length === 0) return;
    setConverting(true);
    setProgress(5);

    try {
      const pdfDoc = await PDFDocument.create();
      let [pgW, pgH] = PAGE_SIZES[pageSize];
      if (orientation === "landscape") [pgW, pgH] = [pgH, pgW];

      for (let i = 0; i < images.length; i++) {
        setProgress(Math.round(5 + ((i / images.length) * 85)));

        const arrayBuffer = await images[i].file.arrayBuffer();
        const mimeType = images[i].file.type;
        let pdfImage;

        if (mimeType === "image/png") {
          pdfImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // Convert non-JPEG/PNG to JPEG via canvas
          const img = new window.Image();
          const blob = new Blob([arrayBuffer], { type: mimeType });
          const url = URL.createObjectURL(blob);
          img.src = url;
          await new Promise((res) => (img.onload = res));

          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);

          const jpegBlob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.95));
          const jpegBuffer = await jpegBlob.arrayBuffer();
          pdfImage = await pdfDoc.embedJpg(jpegBuffer);
        }

        const page = pdfDoc.addPage([pgW, pgH]);
        const mx = margin;
        const my = margin;
        const availW = pgW - mx * 2;
        const availH = pgH - my * 2;

        const { width: imgW, height: imgH } = pdfImage;

        let drawW = imgW;
        let drawH = imgH;

        if (fit === "contain") {
          const scale = Math.min(availW / imgW, availH / imgH);
          drawW = imgW * scale;
          drawH = imgH * scale;
        } else if (fit === "fill") {
          drawW = availW;
          drawH = availH;
        }

        const x = mx + (availW - drawW) / 2;
        const y = my + (availH - drawH) / 2;

        page.drawImage(pdfImage, { x, y, width: drawW, height: drawH });
      }

      setProgress(98);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setProgress(100);
      setResult({ url, name: "images.pdf", size: (blob.size / 1024).toFixed(1) + " KB", pages: images.length });
    } catch (err) {
      alert("Failed to create PDF: " + err.message);
    } finally {
      setConverting(false);
    }
  }, [images, pageSize, orientation, margin, fit]);

  const reset = () => {
    setImages([]);
    setResult(null);
    setProgress(0);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {!result ? (
        <>
          <ToolUploader
            accept="image/*"
            multiple={true}
            supportedFormats={["JPG", "PNG", "WebP", "GIF"]}
            title="Drop images here"
            subtitle="Add multiple images — drag to reorder"
            onFilesSelected={handleFilesSelected}
            maxSizeMB={20}
            activity={uploaderActivity}
          />

          {/* Image Queue */}
          {images.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  {images.length} image{images.length > 1 ? "s" : ""} • {images.length} page{images.length > 1 ? "s" : ""}
                </p>
                <button onClick={() => setImages([])} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem", fontFamily: "Inter" }}>
                  Clear all
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                {images.map((img, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "10px" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700, minWidth: "24px", textAlign: "center" }}>{i + 1}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{img.size}</p>
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button onClick={() => moveImage(i, -1)} disabled={i === 0} className="btn btn-ghost btn-sm" style={{ padding: "6px", opacity: i === 0 ? 0.4 : 1 }} aria-label="Move up">
                        <ArrowUp size={14} />
                      </button>
                      <button onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} className="btn btn-ghost btn-sm" style={{ padding: "6px", opacity: i === images.length - 1 ? 0.4 : 1 }} aria-label="Move down">
                        <ArrowDown size={14} />
                      </button>
                      <button onClick={() => removeImage(i)} className="btn btn-ghost btn-sm" style={{ padding: "6px", color: "#f87171" }} aria-label="Remove">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PDF Settings */}
              <div style={{ padding: "24px", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "16px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "20px" }}>PDF Settings</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <label className="form-label">Page Size</label>
                    <select
                      className="form-input"
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value)}
                      style={{ appearance: "none", cursor: "pointer" }}
                      aria-label="PDF page size"
                    >
                      {Object.keys(PAGE_SIZES).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Orientation</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {["portrait", "landscape"].map((o) => (
                        <button key={o} onClick={() => setOrientation(o)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: orientation === o ? "2px solid var(--primary)" : "1px solid var(--border-light)", background: orientation === o ? "rgba(99,102,241,0.15)" : "transparent", color: orientation === o ? "var(--primary-light)" : "var(--text-secondary)", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", textTransform: "capitalize", fontFamily: "Inter" }}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      <label className="form-label" style={{ margin: 0 }}>Margin</label>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-light)" }}>{margin}pt</span>
                    </div>
                    <input type="range" min="0" max="80" value={margin} onChange={(e) => setMargin(Number(e.target.value))} aria-label="Page margin" />
                  </div>
                  <div>
                    <label className="form-label">Image Fit</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { value: "contain", label: "Contain" },
                        { value: "fill", label: "Stretch" },
                      ].map((f) => (
                        <button key={f.value} onClick={() => setFit(f.value)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: fit === f.value ? "2px solid var(--primary)" : "1px solid var(--border-light)", background: fit === f.value ? "rgba(99,102,241,0.15)" : "transparent", color: fit === f.value ? "var(--primary-light)" : "var(--text-secondary)", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "Inter" }}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {converting && (
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>Creating PDF... {progress}%</p>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <button onClick={handleConvert} disabled={converting} className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>
                {converting ? <><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Creating PDF...</> : <><FileText size={18} /> Create PDF ({images.length} page{images.length > 1 ? "s" : ""})</>}
              </button>
            </div>
          )}
        </>
      ) : (
        <div>
          <div style={{ padding: "24px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircle size={22} color="#34d399" />
            <div>
              <p style={{ fontWeight: 700, color: "#34d399", marginBottom: "2px" }}>PDF Created Successfully!</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {result.name} · {result.size} · {result.pages} page{result.pages > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div style={{ padding: "48px", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "16px", marginBottom: "20px", textAlign: "center" }}>
            <FileText size={48} color="var(--primary)" style={{ marginBottom: "16px" }} />
            <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "6px" }}>{result.name}</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{result.size} · {result.pages} page{result.pages > 1 ? "s" : ""}</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <a href={result.url} download={result.name} className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: "center" }}>
              <Download size={18} />
              Download PDF
            </a>
            <button onClick={reset} className="btn btn-secondary btn-lg">Convert More</button>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
