"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolUploader from "@/components/ToolUploader";
import { Download, RefreshCw, CheckCircle, Crop, ExternalLink } from "lucide-react";
import Button from "@/components/Button";

import { useConversionLimit } from "@/context/ConversionLimitContext";
import { downloadFile } from "@/lib/downloadFile";

const ASPECT_PRESETS = [
  { label: "FreeForm", w: null, h: null },
  { label: "1:1", w: 1, h: 1 },
  { label: "16:9", w: 16, h: 9 },
  { label: "4:3", w: 4, h: 3 },
  { label: "3:2", w: 3, h: 2 },
  { label: "9:16", w: 9, h: 16 },
];

export default function CropImageTool() {
  const { checkConversionLimit, incrementConversionCount } = useConversionLimit();
  
  // File and Image loading states
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [naturalDims, setNaturalDims] = useState({ w: 0, h: 0 });
  const [previewRect, setPreviewRect] = useState({ w: 0, h: 0 });
  
  // Crop state in natural pixels
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [aspectPreset, setAspectPreset] = useState(ASPECT_PRESETS[0]);
  
  // Manual Input fields text states (to support smooth typing)
  const [inputWidth, setInputWidth] = useState("");
  const [inputHeight, setInputHeight] = useState("");
  const [inputX, setInputX] = useState("");
  const [inputY, setInputY] = useState("");
  
  // Drag state
  const [draggingState, setDraggingState] = useState({
    active: false,
    type: null, // "move" | "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "draw"
    startMouseX: 0,
    startMouseY: 0,
    startCrop: null,
  });

  // Output config and processing states
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [result, setResult] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const previewRef = useRef(null);
  const imgRef = useRef(null);

  // Load selected image
  const handleFileSelected = useCallback((f) => {
    setFile(f);
    setResult(null);
    try {
      const url = URL.createObjectURL(f);
      setImageUrl(url);
    } catch (e) {
      console.error(e);
      alert("Failed to load image.");
    }
  }, []);

  // Center crop at 80% size
  const initCrop = useCallback((w, h, aspect = aspectPreset) => {
    let cropW, cropH;
    const r = aspect.w && aspect.h ? aspect.w / aspect.h : null;
    if (r) {
      if (w / h > r) {
        cropH = h * 0.8;
        cropW = cropH * r;
      } else {
        cropW = w * 0.8;
        cropH = cropW / r;
      }
    } else {
      cropW = w * 0.8;
      cropH = h * 0.8;
    }
    const cropX = (w - cropW) / 2;
    const cropY = (h - cropH) / 2;
    setCrop({
      x: Math.round(cropX),
      y: Math.round(cropY),
      w: Math.round(cropW),
      h: Math.round(cropH),
    });
  }, [aspectPreset]);

  // Update natural dimensions when image finishes loading
  const handleImageLoad = (e) => {
    const nw = e.target.naturalWidth;
    const nh = e.target.naturalHeight;
    setNaturalDims({ w: nw, h: nh });
    initCrop(nw, nh);
  };

  // Sync crop coordinates to text inputs
  useEffect(() => {
    if (crop.w && crop.h) {
      setInputWidth(Math.round(crop.w).toString());
      setInputHeight(Math.round(crop.h).toString());
      setInputX(Math.round(crop.x).toString());
      setInputY(Math.round(crop.y).toString());
    }
  }, [crop.x, crop.y, crop.w, crop.h]);

  // Handle manual input changes
  const handleInputChange = (field, value) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    const r = aspectPreset.w && aspectPreset.h ? aspectPreset.w / aspectPreset.h : null;

    if (field === "w") {
      setInputWidth(value);
      if (value === "") return;
      const val = parseInt(value, 10);
      if (val > 0) {
        let w = Math.min(val, naturalDims.w - crop.x);
        let h = crop.h;
        if (r) {
          h = w / r;
          if (crop.y + h > naturalDims.h) {
            h = naturalDims.h - crop.y;
            w = h * r;
          }
        }
        setCrop((prev) => ({ ...prev, w: Math.round(w), h: Math.round(h) }));
      }
    } else if (field === "h") {
      setInputHeight(value);
      if (value === "") return;
      const val = parseInt(value, 10);
      if (val > 0) {
        let h = Math.min(val, naturalDims.h - crop.y);
        let w = crop.w;
        if (r) {
          w = h * r;
          if (crop.x + w > naturalDims.w) {
            w = naturalDims.w - crop.x;
            h = w / r;
          }
        }
        setCrop((prev) => ({ ...prev, w: Math.round(w), h: Math.round(h) }));
      }
    } else if (field === "x") {
      setInputX(value);
      if (value === "") return;
      const val = parseInt(value, 10);
      if (val >= 0) {
        const x = Math.min(val, naturalDims.w - crop.w);
        setCrop((prev) => ({ ...prev, x: Math.round(x) }));
      }
    } else if (field === "y") {
      setInputY(value);
      if (value === "") return;
      const val = parseInt(value, 10);
      if (val >= 0) {
        const y = Math.min(val, naturalDims.h - crop.h);
        setCrop((prev) => ({ ...prev, y: Math.round(y) }));
      }
    }
  };

  // Fallback clamping on input blur
  const handleInputBlur = () => {
    setInputWidth(Math.round(crop.w).toString());
    setInputHeight(Math.round(crop.h).toString());
    setInputX(Math.round(crop.x).toString());
    setInputY(Math.round(crop.y).toString());
  };

  // Handle Aspect Ratio Select Dropdown
  const handleAspectPresetChange = (preset) => {
    setAspectPreset(preset);
    if (naturalDims.w && naturalDims.h) {
      initCrop(naturalDims.w, naturalDims.h, preset);
    }
  };

  // Start dragging: handles, center overlay, or backdrop
  const startDrag = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const scaleX = naturalDims.w / rect.width;
    const scaleY = naturalDims.h / rect.height;

    const mouseX = Math.round((e.clientX - rect.left) * scaleX);
    const mouseY = Math.round((e.clientY - rect.top) * scaleY);

    setDraggingState({
      active: true,
      type: mode,
      startMouseX: mouseX,
      startMouseY: mouseY,
      startCrop: { ...crop },
    });
  };

  // Dragging event loop
  const handleMouseMove = useCallback(
    (e) => {
      if (!draggingState.active || !imgRef.current) return;

      const rect = imgRef.current.getBoundingClientRect();
      const scaleX = naturalDims.w / rect.width;
      const scaleY = naturalDims.h / rect.height;

      const curX = Math.max(0, Math.min(Math.round((e.clientX - rect.left) * scaleX), naturalDims.w));
      const curY = Math.max(0, Math.min(Math.round((e.clientY - rect.top) * scaleY), naturalDims.h));

      const dx = curX - draggingState.startMouseX;
      const dy = curY - draggingState.startMouseY;

      const { startCrop, type } = draggingState;
      const minSize = 10;
      const r = aspectPreset.w && aspectPreset.h ? aspectPreset.w / aspectPreset.h : null;

      let newX = crop.x;
      let newY = crop.y;
      let newW = crop.w;
      let newH = crop.h;

      if (type === "move") {
        newX = Math.max(0, Math.min(startCrop.x + dx, naturalDims.w - startCrop.w));
        newY = Math.max(0, Math.min(startCrop.y + dy, naturalDims.h - startCrop.h));
        setCrop({ x: Math.round(newX), y: Math.round(newY), w: startCrop.w, h: startCrop.h });
      } else if (type === "draw") {
        let w = curX - draggingState.startMouseX;
        let h = curY - draggingState.startMouseY;

        if (r) {
          const signH = Math.sign(h) || 1;
          const signW = Math.sign(w) || 1;
          const absW = Math.abs(w);
          const absH = absW / r;
          h = absH * signH;
          w = absW * signW;
        }

        const drawX = w >= 0 ? draggingState.startMouseX : draggingState.startMouseX + w;
        const drawY = h >= 0 ? draggingState.startMouseY : draggingState.startMouseY + h;
        const drawW = Math.abs(w);
        const drawH = Math.abs(h);

        const finalX = Math.max(0, Math.min(drawX, naturalDims.w));
        const finalY = Math.max(0, Math.min(drawY, naturalDims.h));
        const finalW = Math.min(drawW, naturalDims.w - finalX);
        const finalH = Math.min(drawH, naturalDims.h - finalY);

        setCrop({
          x: Math.round(finalX),
          y: Math.round(finalY),
          w: Math.round(finalW),
          h: Math.round(finalH),
        });
      } else {
        // Resize Handles logic
        if (type === "se") {
          newW = startCrop.w + dx;
          if (r) {
            newH = newW / r;
          } else {
            newH = startCrop.h + dy;
          }

          newW = Math.max(minSize, Math.min(newW, naturalDims.w - startCrop.x));
          newH = Math.max(minSize, Math.min(newH, naturalDims.h - startCrop.y));

          if (r) {
            if (newW / r > naturalDims.h - startCrop.y) {
              newH = naturalDims.h - startCrop.y;
              newW = newH * r;
            }
            if (newH * r > naturalDims.w - startCrop.x) {
              newW = naturalDims.w - startCrop.x;
              newH = newW / r;
            }
          }

          setCrop({ x: startCrop.x, y: startCrop.y, w: Math.round(newW), h: Math.round(newH) });
        } else if (type === "nw") {
          newW = startCrop.w - dx;
          if (r) {
            newH = newW / r;
          } else {
            newH = startCrop.h - dy;
          }

          newW = Math.max(minSize, Math.min(newW, startCrop.x + startCrop.w));
          newH = Math.max(minSize, Math.min(newH, startCrop.y + startCrop.h));

          if (r) {
            if (newW / r > startCrop.y + startCrop.h) {
              newH = startCrop.y + startCrop.h;
              newW = newH * r;
            }
            if (newH * r > startCrop.x + startCrop.w) {
              newW = startCrop.x + startCrop.w;
              newH = newW / r;
            }
          }

          newX = startCrop.x + startCrop.w - newW;
          newY = startCrop.y + startCrop.h - newH;
          setCrop({
            x: Math.round(newX),
            y: Math.round(newY),
            w: Math.round(newW),
            h: Math.round(newH),
          });
        } else if (type === "ne") {
          newW = startCrop.w + dx;
          if (r) {
            newH = newW / r;
          } else {
            newH = startCrop.h - dy;
          }

          newW = Math.max(minSize, Math.min(newW, naturalDims.w - startCrop.x));
          newH = Math.max(minSize, Math.min(newH, startCrop.y + startCrop.h));

          if (r) {
            if (newW / r > startCrop.y + startCrop.h) {
              newH = startCrop.y + startCrop.h;
              newW = newH * r;
            }
            if (newH * r > naturalDims.w - startCrop.x) {
              newW = naturalDims.w - startCrop.x;
              newH = newW / r;
            }
          }

          newX = startCrop.x;
          newY = startCrop.y + startCrop.h - newH;
          setCrop({
            x: Math.round(newX),
            y: Math.round(newY),
            w: Math.round(newW),
            h: Math.round(newH),
          });
        } else if (type === "sw") {
          newW = startCrop.w - dx;
          if (r) {
            newH = newW / r;
          } else {
            newH = startCrop.h + dy;
          }

          newW = Math.max(minSize, Math.min(newW, startCrop.x + startCrop.w));
          newH = Math.max(minSize, Math.min(newH, naturalDims.h - startCrop.y));

          if (r) {
            if (newW / r > naturalDims.h - startCrop.y) {
              newH = naturalDims.h - startCrop.y;
              newW = newH * r;
            }
            if (newH * r > startCrop.x + startCrop.w) {
              newW = startCrop.x + startCrop.w;
              newH = newW / r;
            }
          }

          newX = startCrop.x + startCrop.w - newW;
          newY = startCrop.y;
          setCrop({
            x: Math.round(newX),
            y: Math.round(newY),
            w: Math.round(newW),
            h: Math.round(newH),
          });
        } else if (type === "n") {
          newH = startCrop.h - dy;
          newH = Math.max(minSize, Math.min(newH, startCrop.y + startCrop.h));

          if (r) {
            newW = newH * r;
            if (newW > naturalDims.w) {
              newW = naturalDims.w;
              newH = newW / r;
            }
            newX = Math.max(0, Math.min(startCrop.x + (startCrop.w - newW) / 2, naturalDims.w - newW));
          } else {
            newW = startCrop.w;
            newX = startCrop.x;
          }

          newY = startCrop.y + startCrop.h - newH;
          setCrop({
            x: Math.round(newX),
            y: Math.round(newY),
            w: Math.round(newW),
            h: Math.round(newH),
          });
        } else if (type === "s") {
          newH = startCrop.h + dy;
          newH = Math.max(minSize, Math.min(newH, naturalDims.h - startCrop.y));

          if (r) {
            newW = newH * r;
            if (newW > naturalDims.w) {
              newW = naturalDims.w;
              newH = newW / r;
            }
            newX = Math.max(0, Math.min(startCrop.x + (startCrop.w - newW) / 2, naturalDims.w - newW));
          } else {
            newW = startCrop.w;
            newX = startCrop.x;
          }

          setCrop({
            x: Math.round(newX),
            y: Math.round(startCrop.y),
            w: Math.round(newW),
            h: Math.round(newH),
          });
        } else if (type === "w") {
          newW = startCrop.w - dx;
          newW = Math.max(minSize, Math.min(newW, startCrop.x + startCrop.w));

          if (r) {
            newH = newW / r;
            if (newH > naturalDims.h) {
              newH = naturalDims.h;
              newW = newH * r;
            }
            newY = Math.max(0, Math.min(startCrop.y + (startCrop.h - newH) / 2, naturalDims.h - newH));
          } else {
            newH = startCrop.h;
            newY = startCrop.y;
          }

          newX = startCrop.x + startCrop.w - newW;
          setCrop({
            x: Math.round(newX),
            y: Math.round(newY),
            w: Math.round(newW),
            h: Math.round(newH),
          });
        } else if (type === "e") {
          newW = startCrop.w + dx;
          newW = Math.max(minSize, Math.min(newW, naturalDims.w - startCrop.x));

          if (r) {
            newH = newW / r;
            if (newH > naturalDims.h) {
              newH = naturalDims.h;
              newW = newH * r;
            }
            newY = Math.max(0, Math.min(startCrop.y + (startCrop.h - newH) / 2, naturalDims.h - newH));
          } else {
            newH = startCrop.h;
            newY = startCrop.y;
          }

          setCrop({
            x: Math.round(startCrop.x),
            y: Math.round(newY),
            w: Math.round(newW),
            h: Math.round(newH),
          });
        }
      }
    },
    [draggingState, naturalDims, aspectPreset, crop]
  );

  const handleMouseUp = () => {
    setDraggingState({
      active: false,
      type: null,
      startMouseX: 0,
      startMouseY: 0,
      startCrop: null,
    });
  };

  useEffect(() => {
    if (draggingState.active) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingState.active, handleMouseMove]);

  useEffect(() => {
    const updatePreviewRect = () => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      setPreviewRect({ w: rect.width, h: rect.height });
    };

    updatePreviewRect();
    window.addEventListener("resize", updatePreviewRect);
    return () => window.removeEventListener("resize", updatePreviewRect);
  }, [imageUrl, naturalDims.w, naturalDims.h]);

  // Submit crop request to backend
  const handleCrop = useCallback(async () => {
    if (!file || crop.w < 10 || crop.h < 10) {
      alert("Please select/draw a crop area first (at least 10×10 pixels).");
      return;
    }
    if (!checkConversionLimit()) return;

    setCropping(true);

    try {
      const { processFileWithBackend } = await import("@/lib/apiClient");

      await processFileWithBackend(file, {
        targetFormat: outputFormat,
        options: {
          crop: { x: crop.x, y: crop.y, width: crop.w, height: crop.h },
          quality: 0.95,
        },
        onProgress: () => {},
        onSuccess: async (data) => {
          const ext = outputFormat === "png" ? ".png" : outputFormat === "webp" ? ".webp" : ".jpg";
          const baseName = file.name.replace(/\.[^.]+$/, "");
          const outputName = `${baseName}_cropped${ext}`;

          setResult({
            url: data.outputUrl,
            name: outputName,
            size: data.outputSize ? `${(data.outputSize / 1024).toFixed(1)} KB` : "Available on download",
            width: Math.round(crop.w),
            height: Math.round(crop.h),
          });
          incrementConversionCount();
        },
        onError: (err) => {
          console.error(err);
          alert(`Failed to crop image: ${err.message || "Unknown error"}`);
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to initiate crop.");
    } finally {
      setCropping(false);
    }
  }, [file, crop, outputFormat, checkConversionLimit, incrementConversionCount]);

  const reset = () => {
    setFile(null);
    setImageUrl(null);
    setResult(null);
    setCrop({ x: 0, y: 0, w: 0, h: 0 });
    setNaturalDims({ w: 0, h: 0 });
    setInputWidth("");
    setInputHeight("");
    setInputX("");
    setInputY("");
    setAspectPreset(ASPECT_PRESETS[0]);
  };

  // Convert crop to absolute display coordinates on preview container
  const displayCrop =
    previewRect.w && previewRect.h && naturalDims.w && naturalDims.h
      ? {
          left: (crop.x / naturalDims.w) * previewRect.w,
          top: (crop.y / naturalDims.h) * previewRect.h,
          width: (crop.w / naturalDims.w) * previewRect.w,
          height: (crop.h / naturalDims.h) * previewRect.h,
        }
      : { left: 0, top: 0, width: 0, height: 0 };

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-2">
      {!result ? (
        <>
          {!imageUrl ? (
            <ToolUploader
              accept="image/*"
              supportedFormats={["JPG", "PNG", "WebP", "GIF"]}
              title="Drop your image to crop"
              subtitle="Select crop parameters or drag corners to crop after uploading"
              onFilesSelected={handleFileSelected}
            />
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column: Sidebar Controls */}
              <div className="w-full lg:w-[320px] shrink-0 p-6 bg-[#1a1a2e] border border-white/8 rounded-2xl flex flex-col gap-5 self-start">
                <div>
                  <h3 className="text-white font-bold text-[1.05rem] flex items-center gap-2">
                    <Crop size={18} className="text-[#818cf8]" />
                    Crop Controls
                  </h3>
                </div>

                {/* Width & Height inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.78rem] font-semibold text-[#94a3b8] tracking-wide mb-1.5">
                      Width
                    </label>
                    <input
                      type="text"
                      value={inputWidth}
                      onChange={(e) => handleInputChange("w", e.target.value)}
                      onBlur={handleInputBlur}
                      className="w-full py-2 px-3 bg-[#13131f] border border-white/8 rounded-lg text-white font-semibold text-[0.875rem] focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.78rem] font-semibold text-[#94a3b8] tracking-wide mb-1.5">
                      Height
                    </label>
                    <input
                      type="text"
                      value={inputHeight}
                      onChange={(e) => handleInputChange("h", e.target.value)}
                      onBlur={handleInputBlur}
                      className="w-full py-2 px-3 bg-[#13131f] border border-white/8 rounded-lg text-white font-semibold text-[0.875rem] focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Aspect Ratio select dropdown */}
                <div>
                  <label className="block text-[0.78rem] font-semibold text-[#94a3b8] tracking-wide mb-1.5">
                    Aspect Ratio
                  </label>
                  <select
                    value={aspectPreset.label}
                    onChange={(e) => {
                      const selected = ASPECT_PRESETS.find((p) => p.label === e.target.value);
                      if (selected) handleAspectPresetChange(selected);
                    }}
                    className="w-full py-2 px-3 bg-[#13131f] border border-white/8 rounded-lg text-white font-semibold text-[0.875rem] focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none transition-all"
                  >
                    {ASPECT_PRESETS.map((p) => (
                      <option key={p.label} value={p.label} className="bg-[#13131f] text-white">
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Crop Position (Y and X inputs) */}
                <div>
                  <label className="block text-[0.78rem] font-semibold text-[#94a3b8] tracking-wide mb-2">
                    Crop Position
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[0.7rem] font-semibold text-[#64748b] mb-1">
                        Position (Y)
                      </label>
                      <input
                        type="text"
                        value={inputY}
                        onChange={(e) => handleInputChange("y", e.target.value)}
                        onBlur={handleInputBlur}
                        className="w-full py-2 px-3 bg-[#13131f] border border-white/8 rounded-lg text-white font-semibold text-[0.875rem] focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.7rem] font-semibold text-[#64748b] mb-1">
                        Position (X)
                      </label>
                      <input
                        type="text"
                        value={inputX}
                        onChange={(e) => handleInputChange("x", e.target.value)}
                        onBlur={handleInputBlur}
                        className="w-full py-2 px-3 bg-[#13131f] border border-white/8 rounded-lg text-white font-semibold text-[0.875rem] focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Output format select */}
                <div>
                  <label className="block text-[0.78rem] font-semibold text-[#94a3b8] tracking-wide mb-1.5">
                    Format
                  </label>
                  <div className="flex gap-2.5">
                    {["jpeg", "png", "webp"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-[0.8rem] font-semibold cursor-pointer uppercase font-['Inter'] transition-all ${
                          outputFormat === fmt
                            ? "border-[#6366f1] bg-indigo-500/15 text-[#818cf8]"
                            : "border-white/8 bg-[#13131f] text-[#94a3b8]"
                        }`}
                      >
                        {fmt === "jpeg" ? "JPG" : fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crop and Reset buttons */}
                <div className="flex flex-col gap-3 mt-2">
                  <Button
                    onClick={handleCrop}
                    disabled={cropping || crop.w < 10 || crop.h < 10}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center"
                  >
                    {cropping ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" /> Cropping...
                      </>
                    ) : (
                      <>
                        <Crop size={18} /> Crop Image
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={reset}
                    className="w-full justify-center"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* Right Column: Canvas Preview area */}
              <div className="flex-1 flex flex-col items-center">
                <div
                  ref={previewRef}
                  className="relative inline-block cursor-crosshair rounded-2xl overflow-hidden border border-white/10 select-none w-full"
                  onMouseDown={(e) => startDrag(e, "draw")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Crop preview"
                    className="block w-full h-auto max-h-[600px] object-contain mx-auto"
                    onLoad={handleImageLoad}
                    draggable={false}
                  />

                  {/* Crop Selection Overlay */}
                  {crop.w > 5 && crop.h > 5 && (
                    <>
                      {/* Dark overlay backdrop around the crop area */}
                      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

                      {/* The visible crop box */}
                      <div
                        className="absolute border-2 border-dashed border-white bg-transparent pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                        style={{
                          left: displayCrop.left,
                          top: displayCrop.top,
                          width: displayCrop.width,
                          height: displayCrop.height,
                        }}
                      >
                        {/* Rule of Thirds grid lines */}
                        {[1, 2].map((i) => (
                          <div
                            key={`h${i}`}
                            className="absolute left-0 right-0 h-px bg-white/40"
                            style={{ top: `${(i / 3) * 100}%` }}
                          />
                        ))}
                        {[1, 2].map((i) => (
                          <div
                            key={`v${i}`}
                            className="absolute top-0 bottom-0 w-px bg-white/40"
                            style={{ left: `${(i / 3) * 100}%` }}
                          />
                        ))}
                      </div>

                      {/* Draggable overlay center to move crop box */}
                      <div
                        className="absolute cursor-move"
                        style={{
                          left: displayCrop.left + 4,
                          top: displayCrop.top + 4,
                          width: Math.max(0, displayCrop.width - 8),
                          height: Math.max(0, displayCrop.height - 8),
                          zIndex: 5,
                        }}
                        onMouseDown={(e) => startDrag(e, "move")}
                      />

                      {/* Interactive Drag Handles (large white circles) */}
                      {/* Corner: NW */}
                      <div
                        className="absolute cursor-nw-resize"
                        style={{
                          top: displayCrop.top - 12,
                          left: displayCrop.left - 12,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                        onMouseDown={(e) => startDrag(e, "nw")}
                      >
                        <div className="w-3.5 h-3.5 bg-white border-2 border-[#6366f1] rounded-full shadow" />
                      </div>

                      {/* Corner: NE */}
                      <div
                        className="absolute cursor-ne-resize"
                        style={{
                          top: displayCrop.top - 12,
                          left: displayCrop.left + displayCrop.width - 12,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                        onMouseDown={(e) => startDrag(e, "ne")}
                      >
                        <div className="w-3.5 h-3.5 bg-white border-2 border-[#6366f1] rounded-full shadow" />
                      </div>

                      {/* Corner: SE */}
                      <div
                        className="absolute cursor-se-resize"
                        style={{
                          top: displayCrop.top + displayCrop.height - 12,
                          left: displayCrop.left + displayCrop.width - 12,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                        onMouseDown={(e) => startDrag(e, "se")}
                      >
                        <div className="w-3.5 h-3.5 bg-white border-2 border-[#6366f1] rounded-full shadow" />
                      </div>

                      {/* Corner: SW */}
                      <div
                        className="absolute cursor-sw-resize"
                        style={{
                          top: displayCrop.top + displayCrop.height - 12,
                          left: displayCrop.left - 12,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                        onMouseDown={(e) => startDrag(e, "sw")}
                      >
                        <div className="w-3.5 h-3.5 bg-white border-2 border-[#6366f1] rounded-full shadow" />
                      </div>

                      {/* Edge: North */}
                      <div
                        className="absolute cursor-n-resize"
                        style={{
                          top: displayCrop.top - 12,
                          left: displayCrop.left + displayCrop.width / 2 - 12,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                        onMouseDown={(e) => startDrag(e, "n")}
                      >
                        <div className="w-3.5 h-3.5 bg-white border-2 border-[#6366f1] rounded-full shadow" />
                      </div>

                      {/* Edge: East */}
                      <div
                        className="absolute cursor-e-resize"
                        style={{
                          top: displayCrop.top + displayCrop.height / 2 - 12,
                          left: displayCrop.left + displayCrop.width - 12,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                        onMouseDown={(e) => startDrag(e, "e")}
                      >
                        <div className="w-3.5 h-3.5 bg-white border-2 border-[#6366f1] rounded-full shadow" />
                      </div>

                      {/* Edge: South */}
                      <div
                        className="absolute cursor-s-resize"
                        style={{
                          top: displayCrop.top + displayCrop.height - 12,
                          left: displayCrop.left + displayCrop.width / 2 - 12,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                        onMouseDown={(e) => startDrag(e, "s")}
                      >
                        <div className="w-3.5 h-3.5 bg-white border-2 border-[#6366f1] rounded-full shadow" />
                      </div>

                      {/* Edge: West */}
                      <div
                        className="absolute cursor-w-resize"
                        style={{
                          top: displayCrop.top + displayCrop.height / 2 - 12,
                          left: displayCrop.left - 12,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                        onMouseDown={(e) => startDrag(e, "w")}
                      >
                        <div className="w-3.5 h-3.5 bg-white border-2 border-[#6366f1] rounded-full shadow" />
                      </div>

                      {/* Dimension label showing current natural px */}
                      <div
                        className="absolute bg-black/75 text-white text-[11px] font-semibold py-0.5 px-2 rounded pointer-events-none font-mono"
                        style={{
                          left: displayCrop.left + 8,
                          top: displayCrop.top + 8,
                          zIndex: 12,
                        }}
                      >
                        {Math.round(crop.w)} × {Math.round(crop.h)}px
                      </div>
                    </>
                  )}
                </div>

                <p className="text-center text-[#64748b] text-[0.85rem] mt-3">
                  Drag handles or center region to resize/move. Double-click or drag on empty space to start a new crop area.
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Result Screen */
        <div>
          <div className="p-6 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl mb-6 flex items-center gap-3">
            <CheckCircle size={22} className="text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-400 mb-0.5">Crop Complete!</p>
              <p className="text-[0.85rem] text-[#94a3b8]">
                {result.name} · {result.size} · {result.width}×{result.height}px
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center max-w-[600px] mx-auto flex-wrap">
            <Button
              variant="primary"
              size="md"
              className="flex-1 justify-center"
              disabled={downloading}
              onClick={async () => {
                setDownloading(true);
                await downloadFile(result.url, result.name);
                setDownloading(false);
              }}
            >
              <Download size={16} />
              {downloading ? "Downloading..." : "Download Cropped"}
            </Button>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline flex-1"
            >
              <Button variant="secondary" size="md" className="w-full justify-center">
                <ExternalLink size={16} />
                Open in New Tab
              </Button>
            </a>
            <Button variant="secondary" size="md" onClick={reset} className="flex-1 justify-center">
              Crop Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
