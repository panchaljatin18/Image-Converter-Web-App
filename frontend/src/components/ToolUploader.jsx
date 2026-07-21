"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Upload, RefreshCw, Image as FilePreviewIcon, X, AlertCircle, CheckCircle, Folder, Link2, FilePlus, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import googleDriveService from "../services/googleDriveService";
import dropboxService from "../services/dropboxService";
import onedriveService from "../services/onedriveService";
import authService from "../services/authService";
import Button from "./Button";

const GoogleDrivePicker = dynamic(() => import("./GoogleDrivePicker"), { ssr: false });
const DropboxFilePicker = dynamic(() => import("./DropboxFilePicker"), { ssr: false });
const OneDrivePicker = dynamic(() => import("./OneDrivePicker"), { ssr: false });

const googleDriveIcon = (
  <svg viewBox="0 0 24 24" width="19" height="19" className="mr-2.5 shrink-0">
    <path d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574z" fill="#4285F4" />
    <path d="M7.25 3.214a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214z" fill="#0F9D58" />
    <path d="M9.509 15.867l-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" fill="#FFBA00" />
  </svg>
);

const dropboxIcon = (
  <svg viewBox="0 0 24 24" width="19" height="19" className="mr-2.5 shrink-0">
    <path d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z" fill="#0061ff" />
  </svg>
);

const onedriveIcon = (
  <svg viewBox="0 0 24 24" width="19" height="19" className="mr-2.5 shrink-0">
    <path d="M19.453 9.95q.961.058 1.787.468.826.41 1.442 1.066.615.657.966 1.512.352.856.352 1.816 0 1.008-.387 1.893-.386.885-1.049 1.547-.662.662-1.546 1.049-.885.387-1.893.387H6q-1.242 0-2.332-.475-1.09-.475-1.904-1.29-.815-.814-1.29-1.903Q0 14.93 0 13.688q0-.985.31-1.887.311-.903.862-1.658.55-.756 1.324-1.325.774-.568 1.711-.861.434-.129.85-.187.416-.06.861-.082h.012q.515-.786 1.207-1.413.691-.627 1.5-1.066.808-.44 1.705-.668.896-.229 1.845-.229 1.278 0 2.456.417 1.177.416 2.144 1.16.967.744 1.658 1.78.692 1.038 1.008 2.28zm-7.265-4.137q-1.325 0-2.52.544-1.195.545-2.04 1.565.446.117.85.299.405.181.792.416l4.78 2.86 2.731-1.15q.27-.117.545-.204.276-.088.58-.147-.293-.937-.855-1.705-.563-.768-1.319-1.318-.755-.551-1.658-.856-.902-.304-1.886-.304zM2.414 16.395l9.914-4.184-3.832-2.297q-.586-.351-1.23-.539-.645-.188-1.325-.188-.914 0-1.722.364-.809.363-1.412.978-.604.616-.955 1.436-.352.82-.352 1.723 0 .703.234 1.423.235.721.68 1.284zm16.711 1.793q.563 0 1.078-.176.516-.176.961-.516l-7.23-4.324-10.301 4.336q.527.328 1.13.504.604.175 1.237.175zm3.012-1.852q.363-.727.363-1.523 0-.774-.293-1.407t-.791-1.072q-.498-.44-1.166-.68-.668-.24-1.406-.24-.422 0-.838.1t-.815.252q-.398.152-.785.334-.386.181-.761.345Z" fill="#0078d4" />
  </svg>
);

const googleDriveIconLarge = (
  <svg viewBox="0 0 24 24" width="28" height="28">
    <path d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574z" fill="#4285F4" />
    <path d="M7.25 3.214a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214z" fill="#0F9D58" />
    <path d="M9.509 15.867l-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" fill="#FFBA00" />
  </svg>
);

const dropboxIconLarge = (
  <svg viewBox="0 0 24 24" width="28" height="28">
    <path d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z" fill="#0061ff" />
  </svg>
);

const onedriveIconLarge = (
  <svg viewBox="0 0 24 24" width="28" height="28">
    <path d="M19.453 9.95q.961.058 1.787.468.826.41 1.442 1.066.615.657.966 1.512.352.856.352 1.816 0 1.008-.387 1.893-.386.885-1.049 1.547-.662.662-1.546 1.049-.885.387-1.893.387H6q-1.242 0-2.332-.475-1.09-.475-1.904-1.29-.815-.814-1.29-1.903Q0 14.93 0 13.688q0-.985.31-1.887.311-.903.862-1.658.55-.756 1.324-1.325.774-.568 1.711-.861.434-.129.85-.187.416-.06.861-.082h.012q.515-.786 1.207-1.413.691-.627 1.5-1.066.808-.44 1.705-.668.896-.229 1.845-.229 1.278 0 2.456.417 1.177.416 2.144 1.16.967.744 1.658 1.78.692 1.038 1.008 2.28zm-7.265-4.137q-1.325 0-2.52.544-1.195.545-2.04 1.565.446.117.85.299.405.181.792.416l4.78 2.86 2.731-1.15q.27-.117.545-.204.276-.088.58-.147-.293-.937-.855-1.705-.563-.768-1.319-1.318-.755-.551-1.658-.856-.902-.304-1.886-.304zM2.414 16.395l9.914-4.184-3.832-2.297q-.586-.351-1.23-.539-.645-.188-1.325-.188-.914 0-1.722.364-.809.363-1.412.978-.604.616-.955 1.436-.352.82-.352 1.723 0 .703.234 1.423.235.721.68 1.284zm16.711 1.793q.563 0 1.078-.176.516-.176.961-.516l-7.23-4.324-10.301 4.336q.527.328 1.13.504.604.175 1.237.175zm3.012-1.852q.363-.727.363-1.523 0-.774-.293-1.407t-.791-1.072q-.498-.44-1.166-.68-.668-.24-1.406-.24-.422 0-.838.1t-.815.252q-.398.152-.785.334-.386.181-.761.345Z" fill="#0078d4" />
  </svg>
);

export default function ToolUploader({
  accept = "image/*",
  multiple = false,
  maxSizeMB = 50,
  onFilesSelected,
  title = "Drop your image here",
  subtitle = "or click to browse files",
  supportedFormats = ["JPG", "PNG", "WebP", "GIF", "BMP"],
  compact = true,
  activity = null,
  collapseOnSelect = false,
  primaryAction = null,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Cloud/URL upload states
  const [uploadMethod, setUploadMethod] = useState("file"); // "file", "url", "cloud"
  const [cloudProvider, setCloudProvider] = useState(null); // "google-drive", "dropbox", "onedrive"
  const [inputUrl, setInputUrl] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  // Google Drive Backend states
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [checkingDrive, setCheckingDrive] = useState(false);

  // Dropbox Backend states
  const [isDropboxConnected, setIsDropboxConnected] = useState(false);
  const [checkingDropbox, setCheckingDropbox] = useState(false);

  // OneDrive Backend states
  const [isOneDriveConnected, setIsOneDriveConnected] = useState(false);
  const [checkingOneDrive, setCheckingOneDrive] = useState(false);

  const getEffectiveToken = () => {
    return session?.accessToken || authService.getToken();
  };

  useEffect(() => {
    if (cloudProvider === "google-drive") {
      const token = getEffectiveToken();
      if (!token) {
        setIsDriveConnected(false);
        return;
      }

      setCheckingDrive(true);
      googleDriveService.getStatus(token)
        .then((data) => {
          if (data.success) {
            setIsDriveConnected(data.connected);
          }
        })
        .catch((err) => {
          console.error("Error loading Drive status:", err);
          setIsDriveConnected(false);
        })
        .finally(() => {
          setCheckingDrive(false);
        });
    }
  }, [cloudProvider, session]);

  useEffect(() => {
    if (cloudProvider === "dropbox") {
      const token = getEffectiveToken();
      if (!token) {
        setIsDropboxConnected(false);
        return;
      }

      setCheckingDropbox(true);
      dropboxService.getStatus(token)
        .then((data) => {
          if (data.success) {
            setIsDropboxConnected(data.connected);
          }
        })
        .catch((err) => {
          console.error("Error loading Dropbox status:", err);
          setIsDropboxConnected(false);
        })
        .finally(() => {
          setCheckingDropbox(false);
        });
    }
  }, [cloudProvider, session]);

  useEffect(() => {
    if (cloudProvider === "onedrive") {
      const token = getEffectiveToken();
      if (!token) {
        setIsOneDriveConnected(false);
        return;
      }

      setCheckingOneDrive(true);
      onedriveService.getStatus(token)
        .then((data) => {
          if (data.success) {
            setIsOneDriveConnected(data.connected);
          }
        })
        .catch((err) => {
          console.error("Error loading OneDrive status:", err);
          setIsOneDriveConnected(false);
        })
        .finally(() => {
          setCheckingOneDrive(false);
        });
    }
  }, [cloudProvider, session]);

  const hasSelection = previews.length > 0;
  const shouldCollapse = collapseOnSelect && hasSelection && !isDragging;
  const derivedState = activity?.state || (previews.length > 0 ? "ready" : "idle");
  const PrimaryActionIcon = primaryAction?.icon;
  const iconSize = compact ? 26 : 30;
  const status = {
    ready: {
      label: activity?.label || `${previews.length} file${previews.length > 1 ? "s" : ""} selected`,
      detail: activity?.detail || "Ready to process",
      accent: "rgba(34,197,94,0.16)",
      border: "rgba(34,197,94,0.24)",
      text: "#86efac",
      icon: CheckCircle,
    },
    processing: {
      label: activity?.label || "Processing file",
      detail:
        activity?.detail ||
        (typeof activity?.progress === "number" ? `${activity.progress}% complete` : "Working on your file"),
      accent: "rgba(99,102,241,0.16)",
      border: "rgba(99,102,241,0.24)",
      text: "#818cf8",
      icon: RefreshCw,
    },
    complete: {
      label: activity?.label || "Ready",
      detail: activity?.detail || "Task complete",
      accent: "rgba(34,197,94,0.16)",
      border: "rgba(34,197,94,0.24)",
      text: "#86efac",
      icon: CheckCircle,
    },
    error: {
      label: activity?.label || "Something went wrong",
      detail: activity?.detail || "Please try again",
      accent: "rgba(239,68,68,0.14)",
      border: "rgba(239,68,68,0.28)",
      text: "#fca5a5",
      icon: AlertCircle,
    },
  }[derivedState];

  const validateFile = useCallback(
    (file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File "${file.name}" is too large. Maximum size is ${maxSizeMB}MB.`;
      }
      return null;
    },
    [maxSizeMB]
  );

  const handleFiles = useCallback(
    (files) => {
      const fileArray = Array.from(files);
      setError("");

      for (const file of fileArray) {
        const err = validateFile(file);
        if (err) {
          setError(err);
          return;
        }
      }

      // Create previews
      const newPreviews = fileArray.map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        url: URL.createObjectURL(file),
        type: file.type,
      }));
      setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews);
      onFilesSelected && onFilesSelected(multiple ? fileArray : fileArray[0]);
    },
    [multiple, previews, validateFile, onFilesSelected]
  );

  const handleUrlLoad = useCallback(async (url) => {
    if (!url) return;
    setIsLoadingUrl(true);
    setError("");
    try {
      if (!/^https?:\/\/.+/i.test(url)) {
        throw new Error("Please enter a valid URL starting with http:// or https://");
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
      }
      const blob = await response.blob();
      if (!blob.type.startsWith("image/")) {
        throw new Error("URL does not point to a valid image file.");
      }
      const extension = url.split(".").pop()?.split("?")[0] || "png";
      const filename = url.split("/").pop()?.split("?")[0] || `image.${extension}`;
      const loadedFile = new File([blob], filename, { type: blob.type });
      
      handleFiles([loadedFile]);
      setUploadMethod("file");
      setInputUrl("");
    } catch (err) {
      console.warn("Direct fetch failed, trying native Image element:", err.message);
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error("CORS policy or invalid image URL prevents loading this image directly in the browser."));
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not create canvas context.");
        ctx.drawImage(img, 0, 0);
        
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!blob) throw new Error("Failed to export canvas to Blob.");
        
        const filename = url.split("/").pop()?.split("?")[0] || "downloaded-image.png";
        const loadedFile = new File([blob], filename, { type: "image/png" });
        
        handleFiles([loadedFile]);
        setUploadMethod("file");
        setInputUrl("");
      } catch (innerErr) {
        setError(innerErr.message || "Failed to load image from URL. Ensure CORS is enabled on the host.");
      }
    } finally {
      setIsLoadingUrl(false);
    }
  }, [handleFiles]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const openPicker = () => inputRef.current?.click();

  const removePreview = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  const clearAll = () => {
    setPreviews([]);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`mx-auto ${compact ? "max-w-[760px]" : "max-w-[860px]"}`}>
      <div
        onClick={(e) => {
          let isButton = false;
          let el = e.target;
          while (el && el !== document.body && el !== null) {
            if (el.tagName === "BUTTON") {
              isButton = true;
              break;
            }
            el = el.parentElement;
          }

          if (
            (dropdownRef.current && dropdownRef.current.contains(e.target)) ||
            isButton
          ) {
            return;
          }
          if (uploadMethod === "file") {
            openPicker();
          }
        }}
        onDrop={(e) => {
          setUploadMethod("file");
          handleDrop(e);
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (uploadMethod === "file") {
              openPicker();
            }
          }
        }}
        className={`border-2 border-dashed overflow-visible cursor-pointer transition-all duration-300 ${
          shouldCollapse
            ? `${compact ? "py-4.5 px-5 rounded-[22px]" : "py-5.5 px-6 rounded-[26px]"} bg-gradient-to-b from-indigo-500/8 to-cyan-500/3 ${
                isDragging
                  ? "border-indigo-500 shadow-[0_18px_50px_rgba(99,102,241,0.18)] -translate-y-0.5 scale-[1.01]"
                  : "border-indigo-500/26 shadow-[0_14px_36px_rgba(0,0,0,0.16)] translate-y-0"
              }`
            : `${compact ? "py-10 px-6 rounded-[28px]" : "py-14 px-8 rounded-[32px]"} ${
                isDragging
                  ? "border-indigo-500 bg-gradient-to-b from-indigo-500/12 to-cyan-500/5 shadow-[0_24px_80px_rgba(99,102,241,0.18)] -translate-y-0.5 scale-[1.01]"
                  : "border-indigo-500/34 bg-gradient-to-b from-indigo-500/6 to-cyan-500/2 shadow-[0_18px_60px_rgba(0,0,0,0.18)] translate-y-0"
              }`
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
          aria-hidden="true"
        />

        {shouldCollapse ? (
          <div className="flex items-center gap-3 relative z-[1] w-full min-w-0">
            <div
              className={`rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/28 bg-gradient-to-br from-indigo-500/22 to-cyan-500/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
                compact ? "w-12 h-12" : "w-14 h-14"
              } ${isDragging ? "text-[#818cf8]" : "text-[#6366f1]"}`}
            >
              {derivedState === "processing" ? (
                <RefreshCw
                  size={compact ? 22 : 24}
                  className="animate-spin"
                />
              ) : (
                <CheckCircle size={compact ? 22 : 24} />
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p
                className={`font-['Outfit'] font-bold text-[#f8fafc] mb-1 leading-tight overflow-hidden text-ellipsis whitespace-nowrap ${
                  compact ? "text-[0.98rem]" : "text-[1.05rem]"
                }`}
              >
                {status?.label || title}
              </p>
              <p className={`text-[#64748b] leading-normal ${compact ? "text-[0.82rem]" : "text-[0.86rem]"}`}>
                {status?.detail || subtitle}
              </p>

              {derivedState === "processing" && typeof activity?.progress === "number" && (
                <div className="mt-2.5">
                  <div className="w-full h-[5px] bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-250 animate-pulse"
                      style={{
                        width: `${Math.max(0, Math.min(100, activity.progress))}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {primaryAction ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!primaryAction.disabled && derivedState !== "processing") {
                    primaryAction.onClick?.();
                  }
                }}
                disabled={primaryAction.disabled || derivedState === "processing"}
                variant="primary"
                size="sm"
                className="py-2.5 px-3.5 rounded-full shrink-0 min-w-[140px] justify-center text-[0.82rem]"
              >
                {derivedState === "processing" ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : PrimaryActionIcon ? (
                  <PrimaryActionIcon size={14} />
                ) : null}
                {derivedState === "processing"
                  ? primaryAction.loadingLabel || "Processing..."
                  : primaryAction.label || "Convert"}
              </Button>
            ) : (
              derivedState === "processing" && typeof activity?.progress === "number" && (
                <span
                  className="text-[0.75rem] font-bold uppercase tracking-widest whitespace-nowrap"
                  style={{ color: status.text }}
                >
                  {activity.progress}%
                </span>
              )
            )}
          </div>
        ) : (
          <div className={`flex flex-col items-center relative z-[1] max-w-[540px] mx-auto w-full ${compact ? "gap-3" : "gap-4"}`}>
            {derivedState === "idle" && uploadMethod === "url" ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col items-center gap-4 text-center w-full max-w-[420px] p-2.5"
              >
                <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Link2 size={28} />
                </div>
                
                <div className="w-full">
                  <p className="font-['Outfit'] font-bold text-[1.18rem] text-[#f8fafc] mb-1.5">
                    Load image from URL
                  </p>
                  <p className="text-[#64748b] text-[0.88rem] mb-3.5">
                    Enter the public direct link to an image file.
                  </p>
                  
                  <div className="flex gap-2.5 w-full">
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleUrlLoad(inputUrl);
                        }
                      }}
                      className="flex-1 text-center w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-[#f8fafc] text-[0.95rem] font-['Inter'] outline-none transition-all duration-250 placeholder:text-[#64748b] focus:border-[#6366f1] focus:bg-indigo-500/5 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 w-full justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="min-w-[90px] justify-center"
                    onClick={() => {
                      setUploadMethod("file");
                      setInputUrl("");
                      setError("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="min-w-[110px] justify-center"
                    disabled={isLoadingUrl || !inputUrl}
                    onClick={() => handleUrlLoad(inputUrl)}
                  >
                    {isLoadingUrl ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load Image"
                    )}
                  </Button>
                </div>
              </div>
            ) : derivedState === "idle" && uploadMethod === "cloud" ? (
              (checkingDrive || checkingDropbox || checkingOneDrive) ? (
                <div className="flex flex-col items-center justify-center p-10" onClick={(e) => e.stopPropagation()}>
                  <RefreshCw size={24} className="animate-spin text-[#818cf8]" />
                  <p className="mt-2.5 text-[0.85rem] text-[#64748b]">Checking connection status...</p>
                </div>
              ) : cloudProvider === "google-drive" && isDriveConnected ? (
                <div className="w-full max-w-[600px]" onClick={(e) => e.stopPropagation()}>
                  <GoogleDrivePicker
                     onFileSelected={async (file) => {
                       handleFiles([file]);
                       setUploadMethod("file");
                       setCloudProvider(null);
                     }}
                     onCancel={() => {
                       setUploadMethod("file");
                       setCloudProvider(null);
                       setError("");
                     }}
                  />
                </div>
              ) : cloudProvider === "dropbox" && isDropboxConnected ? (
                <div className="w-full max-w-[600px]" onClick={(e) => e.stopPropagation()}>
                  <DropboxFilePicker
                     onFileSelected={async (file) => {
                       handleFiles([file]);
                       setUploadMethod("file");
                       setCloudProvider(null);
                     }}
                     onCancel={() => {
                       setUploadMethod("file");
                       setCloudProvider(null);
                       setError("");
                     }}
                  />
                </div>
              ) : cloudProvider === "onedrive" && isOneDriveConnected ? (
                <div className="w-full max-w-[600px]" onClick={(e) => e.stopPropagation()}>
                  <OneDrivePicker
                     onFileSelected={async (file) => {
                       handleFiles([file]);
                       setUploadMethod("file");
                       setCloudProvider(null);
                     }}
                     onCancel={() => {
                       setUploadMethod("file");
                       setCloudProvider(null);
                       setError("");
                     }}
                  />
                </div>
              ) : (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-4 text-center w-full max-w-[420px] p-2.5"
                >
                  <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/30 flex items-center justify-center text-[#818cf8]">
                    {cloudProvider === "google-drive" ? googleDriveIconLarge : 
                     cloudProvider === "dropbox" ? dropboxIconLarge : 
                     onedriveIconLarge}
                  </div>

                  <div>
                    <p className="font-['Outfit'] font-bold text-[1.18rem] text-[#f8fafc] mb-1.5 capitalize">
                      Connect to {cloudProvider?.replace("-", " ")}
                    </p>
                    <p className="text-[#64748b] text-[0.88rem] leading-relaxed mb-3.5">
                      Authorize your account to browse and convert files directly from your cloud storage.
                    </p>
                  </div>

                  <div className="flex gap-3 w-full justify-center">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="min-w-[90px] justify-center"
                      onClick={() => {
                        setUploadMethod("file");
                        setCloudProvider(null);
                        setError("");
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      className="min-w-[140px] justify-center"
                      onClick={async () => {
                        const token = getEffectiveToken();
                        if (!token) {
                          setError("Please log in to your account first.");
                          return;
                        }
                        if (cloudProvider === "google-drive") {
                          try {
                            const redirectUri = `${window.location.origin}/dashboard/google-drive/callback`;
                            const data = await googleDriveService.getAuthUrl(token, redirectUri);
                            if (data.success && data.url) {
                              window.location.href = data.url;
                            } else {
                              throw new Error("Failed to get authorization URL.");
                            }
                          } catch (err) {
                            setError(err.message || "Failed to initiate connection.");
                          }
                        } else if (cloudProvider === "dropbox") {
                          try {
                            const redirectUri = `${window.location.origin}/dashboard/dropbox/callback`;
                            const data = await dropboxService.getAuthUrl(token, redirectUri);
                            if (data.success && data.url) {
                              window.location.href = data.url;
                            } else {
                              throw new Error("Failed to get authorization URL.");
                            }
                          } catch (err) {
                            setError(err.message || "Failed to initiate connection.");
                          }
                        } else if (cloudProvider === "onedrive") {
                          try {
                            const redirectUri = `${window.location.origin}/dashboard/onedrive/callback`;
                            const data = await onedriveService.getAuthUrl(token, redirectUri);
                            if (data.success && data.url) {
                              window.location.href = data.url;
                            } else {
                              throw new Error("Failed to get authorization URL.");
                            }
                          } catch (err) {
                            setError(err.message || "Failed to initiate connection.");
                          }
                        }
                      }}
                    >
                      Connect Account
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <>
                <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[0.72rem] font-bold tracking-widest uppercase text-[#818cf8] bg-indigo-500/12 border border-indigo-500/24">
                  <Upload size={12} />
                  {multiple ? "Batch upload" : "Quick upload"}
                </div>

                <div
                  className={`rounded-2.5xl flex items-center justify-center transition-all duration-300 ${
                    compact ? "w-[60px] h-[60px]" : "w-[72px] h-[72px]"
                  } ${
                    isDragging
                      ? "bg-gradient-to-br from-indigo-500/38 to-cyan-500/22 border border-indigo-400/65 scale-110 shadow-[0_0_0_8px_rgba(99,102,241,0.08)]"
                      : "bg-gradient-to-br from-indigo-500/22 to-cyan-500/10 border border-indigo-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  }`}
                >
                  <Upload
                    size={iconSize}
                    style={{ color: isDragging ? "#818cf8" : "#6366f1" }}
                  />
                </div>

                <div className="text-center">
                  <p
                    className={`font-['Outfit'] font-bold text-[#f8fafc] mb-1 leading-tight ${
                      compact ? "text-[1.12rem]" : "text-[1.25rem]"
                    }`}
                  >
                    {title}
                  </p>
                  <p className={`text-[#64748b] leading-relaxed ${compact ? "text-[0.86rem]" : "text-[0.9rem]"}`}>
                    {subtitle}
                  </p>
                </div>

                <div className={`flex flex-wrap justify-center ${compact ? "gap-1.5" : "gap-2"}`}>
                  {supportedFormats.map((fmt) => (
                    <span
                      key={fmt}
                      className="inline-flex items-center py-1 px-2.5 rounded-full text-[0.72rem] font-semibold tracking-wider bg-indigo-500/12 text-[#818cf8] border border-indigo-500/25"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>

                <div ref={dropdownRef} data-dropdown-container className="relative z-[100]" onClick={(e) => e.stopPropagation()}>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="justify-between min-w-[185px] gap-2.5"
                    onClick={() => {
                      setIsDropdownOpen((prev) => !prev);
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <FilePlus size={16} />
                      Select File
                    </span>
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </Button>
                  
                  {isDropdownOpen && (
                    <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[240px] bg-[#1a1a2e] border border-indigo-500/20 rounded-2xl p-1.5 shadow-[0_8px_48px_rgba(99,102,241,0.15)] flex flex-col gap-0.5 z-[99]">
                      <button
                        type="button"
                        className="flex items-center w-full py-3 px-4 bg-transparent border-none rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-indigo-500/15 text-[0.95rem] font-semibold text-left cursor-pointer transition-all duration-200 hover:translate-x-[3px] outline-none"
                        onClick={() => {
                          openPicker();
                          setTimeout(() => {
                            setIsDropdownOpen(false);
                          }, 50);
                        }}
                      >
                        <Folder size={19} className="mr-2.5 text-[#818cf8] shrink-0" />
                        From my computer
                      </button>
                      
                      <button
                        type="button"
                        className="flex items-center w-full py-3 px-4 bg-transparent border-none rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-indigo-500/15 text-[0.95rem] font-semibold text-left cursor-pointer transition-all duration-200 hover:translate-x-[3px] outline-none"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setUploadMethod("url");
                        }}
                      >
                        <Link2 size={19} className="mr-2.5 text-cyan-400 shrink-0" />
                        By URL
                      </button>
                      
                      <div className="h-px bg-white/8 my-1" />
                      
                      <button
                        type="button"
                        className="flex items-center w-full py-3 px-4 bg-transparent border-none rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-indigo-500/15 text-[0.95rem] font-semibold text-left cursor-pointer transition-all duration-200 hover:translate-x-[3px] outline-none"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setUploadMethod("cloud");
                          setCloudProvider("google-drive");
                        }}
                      >
                        {googleDriveIcon}
                        From Google Drive
                      </button>
                      
                      <button
                        type="button"
                        className="flex items-center w-full py-3 px-4 bg-transparent border-none rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-indigo-500/15 text-[0.95rem] font-semibold text-left cursor-pointer transition-all duration-200 hover:translate-x-[3px] outline-none"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setUploadMethod("cloud");
                          setCloudProvider("dropbox");
                        }}
                      >
                        {dropboxIcon}
                        From Dropbox
                      </button>
                      
                      <button
                        type="button"
                        className="flex items-center w-full py-3 px-4 bg-transparent border-none rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-indigo-500/15 text-[0.95rem] font-semibold text-left cursor-pointer transition-all duration-200 hover:translate-x-[3px] outline-none"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setUploadMethod("cloud");
                          setCloudProvider("onedrive");
                        }}
                      >
                        {onedriveIcon}
                        From OneDrive
                      </button>
                    </div>
                  )}

                </div>

                <p className="text-[#64748b] text-[0.78rem]">
                  Maximum file size: {maxSizeMB}MB
                </p>
              </>
            )}

            {status && (
              <div
                className="w-full mt-1 py-3 px-3.5 rounded-2xl backdrop-blur-md flex items-start gap-3 text-left shadow-[0_8px_24px_rgba(0,0,0,0.12)] border"
                style={{
                  background: status.accent,
                  borderColor: status.border,
                }}
              >
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-white/5 border border-white/8" style={{ color: status.text }}>
                  <status.icon
                    size={16}
                    className={derivedState === "processing" ? "animate-spin" : ""}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2.5 mb-1">
                    <p className="text-[0.84rem] font-bold text-[#f8fafc] leading-tight">
                      {status.label}
                    </p>
                    <span
                      className="text-[0.72rem] font-bold uppercase tracking-widest whitespace-nowrap"
                      style={{ color: status.text }}
                    >
                      {derivedState === "processing" && typeof activity?.progress === "number"
                        ? `${activity.progress}%`
                        : derivedState}
                    </span>
                  </div>
                  <p className={`text-[0.78rem] text-[#94a3b8] leading-normal ${derivedState === "processing" && typeof activity?.progress === "number" ? "mb-2" : "mb-0"}`}>
                    {status.detail}
                  </p>

                  {derivedState === "processing" && typeof activity?.progress === "number" && (
                    <div className="w-full h-[5px] bg-white/8 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-250 animate-pulse"
                        style={{
                          width: `${Math.max(0, Math.min(100, activity.progress))}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 py-3 px-4 bg-red-500/10 border border-red-500/30 rounded-xl mt-4 text-[#fca5a5] text-[0.875rem]">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && !collapseOnSelect && (
        <div className={`${compact ? "mt-5" : "mt-6"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-[0.9rem] text-[#94a3b8] flex items-center gap-1.5">
              <CheckCircle size={15} className="text-[#818cf8]" />
              {previews.length} file{previews.length > 1 ? "s" : ""} selected
            </p>
            <button
              onClick={clearAll}
              className="bg-none border-none text-[#64748b] hover:text-[#f8fafc] cursor-pointer text-[0.8rem] font-['Inter'] transition-colors duration-200"
            >
              Clear all
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="flex items-center gap-3 py-2.5 px-3.5 bg-indigo-500/7 border border-indigo-500/15 rounded-xl"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/5 flex items-center justify-center">
                  {preview.type.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FilePreviewIcon size={18} className="text-[#64748b]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.875rem] font-semibold text-[#f8fafc] overflow-hidden text-ellipsis whitespace-nowrap">
                    {preview.name}
                  </p>
                  <p className="text-[0.75rem] text-[#64748b]">
                    {preview.size}
                  </p>
                </div>
                <button
                  onClick={() => removePreview(index)}
                  className="bg-none border-none text-[#64748b] hover:text-[#f8fafc] cursor-pointer p-1 rounded-md flex items-center justify-center shrink-0 transition-colors duration-200"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
