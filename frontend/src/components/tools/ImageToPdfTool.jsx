"use client";

import { useState, useCallback } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Trash2, FileText, ArrowUp, ArrowDown } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import Button from "@/components/Button";

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
    <div className="max-w-[800px] mx-auto">
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
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-[0.9rem] text-[#94a3b8]">
                  {images.length} image{images.length > 1 ? "s" : ""} • {images.length} page{images.length > 1 ? "s" : ""}
                </p>
                <button onClick={() => setImages([])} className="bg-transparent border-none text-[#64748b] cursor-pointer text-[0.8rem] font-['Inter'] hover:text-white transition-colors duration-150">
                  Clear all
                </button>
              </div>

              <div className="flex flex-col gap-2 mb-6">
                {images.map((img, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-[10px_14px] bg-indigo-500/7 border border-indigo-500/15 rounded-lg">
                    <span className="text-[#64748b] text-[0.8rem] font-bold min-w-[24px] text-center">{i + 1}</span>
                    <img src={img.url} alt={img.name} className="w-10 h-10 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.85rem] font-semibold overflow-hidden text-ellipsis white-space-nowrap text-[#f8fafc]">{img.name}</p>
                      <p className="text-[0.75rem] text-[#64748b]">{img.size}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button onClick={() => moveImage(i, -1)} disabled={i === 0} variant="ghost" size="sm" className="p-1.5" style={{ opacity: i === 0 ? 0.4 : 1 }} aria-label="Move up">
                        <ArrowUp size={14} />
                      </Button>
                      <Button onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} variant="ghost" size="sm" className="p-1.5" style={{ opacity: i === images.length - 1 ? 0.4 : 1 }} aria-label="Move down">
                        <ArrowDown size={14} />
                      </Button>
                      <Button onClick={() => removeImage(i)} variant="ghost" size="sm" className="p-1.5 text-red-400 hover:text-red-300" aria-label="Remove">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PDF Settings */}
              <div className="p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-5">
                <h3 className="font-bold text-[1rem] mb-5 text-[#f8fafc]">PDF Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2">Page Size</label>
                    <select
                      className="w-full py-3 px-4 rounded-xl bg-[#13131f] border border-white/8 text-[#f8fafc] text-[0.95rem] transition-all duration-200 outline-none cursor-pointer focus:border-[#6366f1] focus:bg-indigo-500/5 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value)}
                      aria-label="PDF page size"
                    >
                      {Object.keys(PAGE_SIZES).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2">Orientation</label>
                    <div className="flex gap-2">
                      {["portrait", "landscape"].map((o) => (
                        <button
                          key={o}
                          onClick={() => setOrientation(o)}
                          className={`flex-1 py-2.5 px-4 rounded-lg border text-[0.8rem] font-semibold cursor-pointer capitalize font-['Inter'] transition-all duration-200 ${
                            orientation === o
                              ? "border-[#6366f1] bg-indigo-500/15 text-[#818cf8]"
                              : "border-white/8 bg-transparent text-[#94a3b8]"
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2.5">
                      <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide">Margin</label>
                      <span className="text-[0.85rem] font-bold text-[#818cf8]">{margin}pt</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      value={margin}
                      onChange={(e) => setMargin(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
                      aria-label="Page margin"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.875rem] font-semibold text-[#94a3b8] tracking-wide mb-2">Image Fit</label>
                    <div className="flex gap-2">
                      {[
                        { value: "contain", label: "Contain" },
                        { value: "fill", label: "Stretch" },
                      ].map((f) => (
                        <button
                          key={f.value}
                          onClick={() => setFit(f.value)}
                          className={`flex-1 py-2.5 px-4 rounded-lg border text-[0.8rem] font-semibold cursor-pointer font-['Inter'] transition-all duration-200 ${
                            fit === f.value
                              ? "border-[#6366f1] bg-indigo-500/15 text-[#818cf8]"
                              : "border-white/8 bg-transparent text-[#94a3b8]"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {converting && (
                <div className="mb-5">
                  <p className="text-[0.85rem] text-[#64748b] mb-2">Creating PDF... {progress}%</p>
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
                  <><RefreshCw size={18} className="animate-spin" /> Creating PDF...</>
                ) : (
                  <><FileText size={18} /> Create PDF ({images.length} page{images.length > 1 ? "s" : ""})</>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        /* Result */
        <div>
          <div className="p-6 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl mb-6 flex items-center gap-3">
            <CheckCircle size={22} className="text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-400 mb-0.5">PDF Created Successfully!</p>
              <p className="text-[0.85rem] text-[#94a3b8]">
                {result.name} · {result.size} · {result.pages} page{result.pages > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="p-12 bg-[#1a1a2e] border border-white/8 rounded-2xl mb-5 text-center flex flex-col items-center">
            <FileText size={48} className="text-[#6366f1] mb-4" />
            <p className="font-bold text-[1.1rem] mb-1.5 text-[#f8fafc]">{result.name}</p>
            <p className="text-[#64748b] text-[0.875rem]">{result.size} · {result.pages} page{result.pages > 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-3">
            <a href={result.url} download={result.name} className="flex-1 no-underline">
              <Button variant="primary" size="lg" className="w-full justify-center">
                <Download size={18} />
                Download PDF
              </Button>
            </a>
            <Button variant="secondary" size="lg" onClick={reset}>Convert More</Button>
          </div>
        </div>
      )}
    </div>
  );
}
