"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, RefreshCw, Image as FilePreviewIcon, X, AlertCircle, CheckCircle, Folder, Link2, FilePlus, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import GoogleDrivePicker from "./GoogleDrivePicker";
import googleDriveService from "../services/googleDriveService";
import DropboxFilePicker from "./DropboxFilePicker";
import dropboxService from "../services/dropboxService";
import OneDrivePicker from "./OneDrivePicker";
import onedriveService from "../services/onedriveService";
import authService from "../services/authService";

const googleDriveIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: "12px", flexShrink: 0 }}>
    <path d="M14.3 2.5L22.6 17h-5.2L9.1 2.5h5.2zM7.9 18.5L3.7 11.2l5.2-9L13.1 9.5l-5.2 9zM9.6 18.5h10.3l-4.1-7.2H5.5l4.1 7.2z" opacity="0.8"/>
  </svg>
);

const dropboxIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: "12px", flexShrink: 0 }}>
    <path d="M4 4l6 4-6 4-4-4zm6 8l6-4-6-4-6 4zm6-4l6 4-4 4-6-4zm0 8l6-4-6-4-6 4zm-6.2 1.3l6.2-4.1 6.2 4.1-6.2 4.1z" opacity="0.8"/>
  </svg>
);

const onedriveIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: "12px", flexShrink: 0 }}>
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" opacity="0.8"/>
  </svg>
);

const googleDriveIconLarge = (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M14.3 2.5L22.6 17h-5.2L9.1 2.5h5.2zM7.9 18.5L3.7 11.2l5.2-9L13.1 9.5l-5.2 9zM9.6 18.5h10.3l-4.1-7.2H5.5l4.1 7.2z" />
  </svg>
);

const dropboxIconLarge = (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M4 4l6 4-6 4-4-4zm6 8l6-4-6-4-6 4zm6-4l6 4-4 4-6-4zm0 8l6-4-6-4-6 4zm-6.2 1.3l6.2-4.1 6.2 4.1-6.2 4.1z" />
  </svg>
);

const onedriveIconLarge = (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
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

  // Cloud/URL upload states
  const [uploadMethod, setUploadMethod] = useState("file"); // "file", "url", "cloud"
  const [cloudProvider, setCloudProvider] = useState(null); // "google-drive", "dropbox", "onedrive"
  const [inputUrl, setInputUrl] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Google Drive Backend states
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [driveEmail, setDriveEmail] = useState("");
  const [checkingDrive, setCheckingDrive] = useState(false);

  // Dropbox Backend states
  const [isDropboxConnected, setIsDropboxConnected] = useState(false);
  const [dropboxEmail, setDropboxEmail] = useState("");
  const [checkingDropbox, setCheckingDropbox] = useState(false);

  // OneDrive Backend states
  const [isOneDriveConnected, setIsOneDriveConnected] = useState(false);
  const [onedriveEmail, setOnedriveEmail] = useState("");
  const [checkingOneDrive, setCheckingOneDrive] = useState(false);

  const getEffectiveToken = () => {
    return session?.accessToken || authService.getToken();
  };

  useEffect(() => {
    if (cloudProvider === "google-drive") {
      const token = getEffectiveToken();
      if (!token) {
        setIsDriveConnected(false);
        setDriveEmail("");
        return;
      }

      setCheckingDrive(true);
      googleDriveService.getStatus(token)
        .then((data) => {
          if (data.success) {
            setIsDriveConnected(data.connected);
            setDriveEmail(data.email || "");
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
        setDropboxEmail("");
        return;
      }

      setCheckingDropbox(true);
      dropboxService.getStatus(token)
        .then((data) => {
          if (data.success) {
            setIsDropboxConnected(data.connected);
            setDropboxEmail(data.email || "");
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
        setOnedriveEmail("");
        return;
      }

      setCheckingOneDrive(true);
      onedriveService.getStatus(token)
        .then((data) => {
          if (data.success) {
            setIsOneDriveConnected(data.connected);
            setOnedriveEmail(data.email || "");
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


  const wrapperMaxWidth = compact ? "760px" : "860px";
  const uploadPadding = compact ? "40px 24px" : "56px 32px";
  const uploadRadius = compact ? "28px" : "32px";
  const iconBoxSize = compact ? "60px" : "72px";
  const iconSize = compact ? 26 : 30;
  const titleSize = compact ? "1.12rem" : "1.25rem";
  const subtitleSize = compact ? "0.86rem" : "0.9rem";
  const tagGap = compact ? "6px" : "8px";
  const uploadBorder = isDragging ? "rgba(99,102,241,0.95)" : "rgba(99,102,241,0.34)";
  const uploadShadow = isDragging ? "0 24px 80px rgba(99,102,241,0.18)" : "0 18px 60px rgba(0,0,0,0.18)";
  const uploadBackground = isDragging
    ? "linear-gradient(180deg, rgba(99,102,241,0.12) 0%, rgba(6,182,212,0.05) 100%)"
    : "linear-gradient(180deg, rgba(99,102,241,0.06) 0%, rgba(6,182,212,0.02) 100%)";
  const hasSelection = previews.length > 0;
  const shouldCollapse = collapseOnSelect && hasSelection && !isDragging;
  const compactPadding = compact ? "18px 20px" : "22px 24px";
  const compactRadius = compact ? "22px" : "26px";
  const compactBackground = "linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.03) 100%)";
  const compactBorder = isDragging ? "rgba(99,102,241,0.95)" : "rgba(99,102,241,0.26)";
  const compactShadow = isDragging ? "0 18px 50px rgba(99,102,241,0.18)" : "0 14px 36px rgba(0,0,0,0.16)";
  const derivedState = activity?.state || (previews.length > 0 ? "ready" : "idle");
  const PrimaryActionIcon = primaryAction?.icon;
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
      text: "var(--primary-light)",
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
  }, [handleFiles]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div style={{ maxWidth: wrapperMaxWidth, margin: "0 auto" }}>
      <div
        className={`upload-zone ${isDragging ? "drag-over" : ""}`}
        onClick={() => {
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
        style={{
          cursor: "pointer",
          padding: shouldCollapse ? compactPadding : uploadPadding,
          borderRadius: shouldCollapse ? compactRadius : uploadRadius,
          background: shouldCollapse ? compactBackground : uploadBackground,
          borderColor: shouldCollapse ? compactBorder : uploadBorder,
          boxShadow: shouldCollapse ? compactShadow : uploadShadow,
          transform: isDragging ? "translateY(-2px) scale(1.01)" : "translateY(0)",
          transition: "all 0.3s ease",
          overflow: "visible",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          aria-hidden="true"
        />

        {shouldCollapse ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              position: "relative",
              zIndex: 1,
              width: "100%",
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: compact ? "48px" : "56px",
                height: compact ? "48px" : "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(6,182,212,0.1))",
                border: "1px solid rgba(99,102,241,0.28)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: isDragging ? "var(--primary-light)" : "var(--primary)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {derivedState === "processing" ? (
              <RefreshCw
                size={compact ? 22 : 24}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <CheckCircle size={compact ? 22 : 24} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
            <p
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                fontSize: compact ? "0.98rem" : "1.05rem",
                  color: "var(--text-primary)",
                  marginBottom: "4px",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {status?.label || title}
              </p>
            <p style={{ color: "var(--text-muted)", fontSize: compact ? "0.82rem" : "0.86rem", lineHeight: 1.4 }}>
              {status?.detail || subtitle}
            </p>

            {derivedState === "processing" && typeof activity?.progress === "number" && (
              <div style={{ marginTop: "10px" }}>
                <div className="progress-bar" style={{ height: "5px", background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.max(0, Math.min(100, activity.progress))}%`,
                      transition: "width 0.25s ease",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {primaryAction ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!primaryAction.disabled && derivedState !== "processing") {
                  primaryAction.onClick?.();
                }
              }}
              disabled={primaryAction.disabled || derivedState === "processing"}
              className="btn btn-primary btn-sm"
              style={{
                padding: "10px 14px",
                borderRadius: "999px",
                flexShrink: 0,
                minWidth: "140px",
                justifyContent: "center",
                fontSize: "0.82rem",
              }}
            >
              {derivedState === "processing" ? (
                <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />
              ) : PrimaryActionIcon ? (
                <PrimaryActionIcon size={14} />
              ) : null}
              {derivedState === "processing"
                ? primaryAction.loadingLabel || "Processing..."
                : primaryAction.label || "Convert"}
            </button>
          ) : (
            derivedState === "processing" && typeof activity?.progress === "number" && (
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: status.text,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                }}
              >
                {activity.progress}%
              </span>
            )
          )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: compact ? "12px" : "16px",
              position: "relative",
              zIndex: 1,
              maxWidth: "540px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {derivedState === "idle" && uploadMethod === "url" ? (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  textAlign: "center",
                  width: "100%",
                  maxWidth: "420px",
                  padding: "10px"
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "18px",
                    background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.1))",
                    border: "1px solid rgba(6,182,212,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--secondary)",
                  }}
                >
                  <Link2 size={28} />
                </div>
                
                <div style={{ width: "100%" }}>
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 700,
                      fontSize: "1.18rem",
                      color: "var(--text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    Load image from URL
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "14px" }}>
                    Enter the public direct link to an image file.
                  </p>
                  
                  <div style={{ display: "flex", gap: "10px", width: "100%" }}>
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
                      className="form-input"
                      style={{ flex: 1, textAlign: "center" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", width: "100%", justifyContent: "center" }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ minWidth: "90px", justifyContent: "center" }}
                    onClick={() => {
                      setUploadMethod("file");
                      setInputUrl("");
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ minWidth: "110px", justifyContent: "center" }}
                    disabled={isLoadingUrl || !inputUrl}
                    onClick={() => handleUrlLoad(inputUrl)}
                  >
                    {isLoadingUrl ? (
                      <>
                        <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />
                        Loading...
                      </>
                    ) : (
                      "Load Image"
                    )}
                  </button>
                </div>
              </div>
            ) : derivedState === "idle" && uploadMethod === "cloud" ? (
              (checkingDrive || checkingDropbox || checkingOneDrive) ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }} onClick={(e) => e.stopPropagation()}>
                  <RefreshCw size={24} className="animate-spin" style={{ color: "var(--primary-light)" }} />
                  <p style={{ margin: "10px 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Checking connection status...</p>
                </div>
              ) : cloudProvider === "google-drive" && isDriveConnected ? (
                <div style={{ width: "100%", maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
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
                <div style={{ width: "100%", maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
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
                <div style={{ width: "100%", maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
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
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                    textAlign: "center",
                    width: "100%",
                    maxWidth: "420px",
                    padding: "10px"
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "18px",
                      background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1))",
                      border: "1px solid rgba(99,102,241,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary-light)",
                    }}
                  >
                    {cloudProvider === "google-drive" ? googleDriveIconLarge : 
                     cloudProvider === "dropbox" ? dropboxIconLarge : 
                     onedriveIconLarge}
                  </div>

                  <div>
                    <p
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontWeight: 700,
                        fontSize: "1.18rem",
                        color: "var(--text-primary)",
                        marginBottom: "6px",
                        textTransform: "capitalize"
                      }}
                    >
                      Connect to {cloudProvider?.replace("-", " ")}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "14px" }}>
                      Authorize your account to browse and convert files directly from your cloud storage.
                    </p>
                  </div>


                  <div style={{ display: "flex", gap: "12px", width: "100%", justifyContent: "center" }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ minWidth: "90px", justifyContent: "center" }}
                      onClick={() => {
                        setUploadMethod("file");
                        setCloudProvider(null);
                        setError("");
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ minWidth: "140px", justifyContent: "center" }}
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
                        } else {
                          setError(`API credentials missing for OneDrive / Microsoft Graph. Please configure your credentials.`);
                        }
                      }}
                    >
                      Connect Account
                    </button>
                  </div>
                </div>
              )
            ) : (
              <>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 12px",
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--primary-light)",
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.24)",
                  }}
                >
                  <Upload size={12} />
                  {multiple ? "Batch upload" : "Quick upload"}
                </div>

                <div
                  style={
                    isDragging
                      ? {
                          width: iconBoxSize,
                          height: iconBoxSize,
                          borderRadius: "20px",
                          background: "linear-gradient(135deg, rgba(99,102,241,0.38), rgba(6,182,212,0.22))",
                          border: "1px solid rgba(129,140,248,0.65)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transform: "scale(1.1)",
                          transition: "all 0.3s ease",
                          boxShadow: "0 0 0 8px rgba(99,102,241,0.08)",
                        }
                      : {
                          width: iconBoxSize,
                          height: iconBoxSize,
                          borderRadius: "20px",
                          background: "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(6,182,212,0.1))",
                          border: "1px solid rgba(99,102,241,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                        }
                  }
                >
                  <Upload
                    size={iconSize}
                    style={{ color: isDragging ? "var(--primary-light)" : "var(--primary)" }}
                  />
                </div>

                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 700,
                      fontSize: titleSize,
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                      lineHeight: 1.2,
                    }}
                  >
                    {title}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: subtitleSize, lineHeight: 1.5 }}>
                    {subtitle}
                  </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: tagGap, justifyContent: "center" }}>
                  {supportedFormats.map((fmt) => (
                    <span
                      key={fmt}
                      className="tag"
                      style={{
                        padding: "4px 9px",
                        fontSize: "0.72rem",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {fmt}
                    </span>
                  ))}
                </div>

                <div style={{ position: "relative", zIndex: 100 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn btn-primary btn-md"
                    style={{ 
                      justifyContent: "space-between", 
                      minWidth: "185px",
                      gap: "10px",
                    }}
                    onClick={() => {
                      setIsDropdownOpen((prev) => !prev);
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FilePlus size={16} />
                      Select File
                    </span>
                    <ChevronDown 
                      size={14} 
                      style={{ 
                        transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease"
                      }} 
                    />
                  </button>
                  
                  {isDropdownOpen && (
                    <>
                      <div 
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          position: "fixed",
                          inset: 0,
                          zIndex: 98,
                          cursor: "default"
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "calc(100% + 10px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "200px",
                          background: "var(--bg-card)",
                          border: "1px solid var(--border)",
                          borderRadius: "16px",
                          padding: "6px",
                          boxShadow: "var(--shadow-lg), 0 0 30px rgba(99,102,241,0.1)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          zIndex: 99,
                        }}
                      >
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            openPicker();
                          }}
                        >
                          <Folder size={14} style={{ marginRight: "10px", color: "var(--primary-light)", flexShrink: 0 }} />
                          From my computer
                        </button>
                        
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setUploadMethod("url");
                          }}
                        >
                          <Link2 size={14} style={{ marginRight: "10px", color: "var(--secondary)", flexShrink: 0 }} />
                          By URL
                        </button>
                        
                        <div style={{ height: "1px", background: "var(--border-light)", margin: "4px 0" }} />
                        
                        <button
                          type="button"
                          className="dropdown-item"
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
                          className="dropdown-item"
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
                          className="dropdown-item"
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
                    </>
                  )}
                </div>

                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                  Maximum file size: {maxSizeMB}MB
                </p>
              </>
            )}

            {status && (
              <div
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "12px 14px",
                  borderRadius: "16px",
                  background: status.accent,
                  border: `1px solid ${status.border}`,
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  textAlign: "left",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "12px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: status.text,
                  }}
                >
                  <status.icon
                    size={16}
                    style={
                      derivedState === "processing"
                        ? { animation: "spin 1s linear infinite" }
                        : undefined
                    }
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "4px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        lineHeight: 1.3,
                      }}
                    >
                      {status.label}
                    </p>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: status.text,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {derivedState === "processing" && typeof activity?.progress === "number"
                        ? `${activity.progress}%`
                        : derivedState}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                      marginBottom: derivedState === "processing" && typeof activity?.progress === "number" ? "8px" : 0,
                    }}
                  >
                    {status.detail}
                  </p>

                  {derivedState === "processing" && typeof activity?.progress === "number" && (
                    <div className="progress-bar" style={{ height: "5px", background: "rgba(255,255,255,0.08)" }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.max(0, Math.min(100, activity.progress))}%`,
                          transition: "width 0.25s ease",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "10px",
            marginTop: "16px",
            color: "#fca5a5",
            fontSize: "0.875rem",
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && !collapseOnSelect && (
        <div style={{ marginTop: compact ? "20px" : "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <p
              style={{
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle size={15} color="var(--primary-light)" />
              {previews.length} file{previews.length > 1 ? "s" : ""} selected
            </p>
            <button
              onClick={clearAll}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontFamily: "Inter, sans-serif",
                transition: "color 0.2s ease",
              }}
            >
              Clear all
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {previews.map((preview, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  background: "rgba(99,102,241,0.07)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {preview.type.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview.url}
                      alt={preview.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <FilePreviewIcon size={18} color="var(--text-muted)" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {preview.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {preview.size}
                  </p>
                </div>
                <button
                  onClick={() => removePreview(index)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                  }}
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
