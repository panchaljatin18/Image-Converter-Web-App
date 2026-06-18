"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Folder, File, Search, ArrowLeft, Loader2, AlertCircle, RefreshCw } from "lucide-react";

export default function GoogleDriveFilePicker({ onFileSelected, onCancel }) {
  const [files, setFiles] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [folderHistory, setFolderHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");
  const [nextPageToken, setNextPageToken] = useState("");

  const fetchFiles = useCallback(async (folderId, query = "", pageToken = "") => {
    setIsLoading(true);
    setError("");
    try {
      const url = new URL("/api/drive/list", window.location.origin);
      url.searchParams.set("folderId", folderId);
      if (query) url.searchParams.set("query", query);
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const response = await fetch(url.toString());
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load files");
      }

      const data = await response.json();
      setFiles(pageToken ? (prev) => [...prev, ...data.files] : data.files || []);
      setNextPageToken(data.nextPageToken || "");
    } catch (err) {
      setError(err.message || "An error occurred while loading files");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles(currentFolderId, searchQuery);
  }, [currentFolderId, searchQuery, fetchFiles]);

  const handleBack = () => {
    if (folderHistory.length === 0) return;
    const previousFolderId = folderHistory[folderHistory.length - 1];
    setFolderHistory((prev) => prev.slice(0, -1));
    setCurrentFolderId(previousFolderId);
  };

  const handleSelectFile = async (file) => {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      setFolderHistory((prev) => [...prev, currentFolderId]);
      setCurrentFolderId(file.id);
      return;
    }

    // Download the file
    setIsDownloading(true);
    setError("");
    try {
      const downloadUrl = `/api/drive/download?fileId=${file.id}`;
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error("Failed to download file from Google Drive");
      }
      const blob = await response.blob();
      const loadedFile = new File([blob], file.name, { type: file.mimeType || blob.type });

      if (onFileSelected) {
        onFileSelected(loadedFile);
      }
    } catch (err) {
      setError(err.message || "Failed to download image file");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "500px",
        maxHeight: "80vh",
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        overflow: "hidden",
        fontFamily: "Outfit, sans-serif",
        color: "var(--text-primary)"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(15, 23, 42, 0.4)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {folderHistory.length > 0 && (
              <button
                onClick={handleBack}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "6px",
                  cursor: "pointer",
                  color: "white"
                }}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>Google Drive Files</h3>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "0.875rem"
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)"
            }}
          />
          <input
            type="text"
            placeholder="Search images and PDFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px 10px 36px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "white",
              fontSize: "0.875rem",
              outline: "none"
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#fca5a5",
              fontSize: "0.875rem",
              marginBottom: "16px"
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {isDownloading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "40px 0"
            }}
          >
            <Loader2 size={32} className="animate-spin" style={{ color: "var(--primary-light)" }} />
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>Importing file from Google Drive...</p>
          </div>
        )}

        {!isDownloading && isLoading && files.length === 0 ? (
          /* Skeletons */
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: "50px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.02)",
                  animation: "pulse 2.0s infinite"
                }}
              />
            ))}
          </div>
        ) : !isDownloading && files.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
            No files or folders found.
          </div>
        ) : (
          /* Grid/List of Files */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "12px"
            }}
          >
            {files.map((file) => {
              const isFolder = file.mimeType === "application/vnd.google-apps.folder";
              return (
                <div
                  key={file.id}
                  onClick={() => handleSelectFile(file)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    padding: "16px 12px",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "center"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                    e.currentTarget.style.borderColor = "var(--primary-light)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.04)";
                  }}
                >
                  {/* Icon or Thumbnail */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      background: isFolder ? "rgba(25, 153, 213, 0.1)" : "rgba(255, 255, 255, 0.04)",
                      color: isFolder ? "var(--primary-light)" : "var(--text-muted)",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {isFolder ? (
                      <Folder size={24} />
                    ) : file.thumbnailLink ? (
                      <img
                        src={file.thumbnailLink}
                        alt=""
                        referrerPolicy="no-referrer"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <File size={24} />
                    )}
                  </div>

                  {/* Title / Details */}
                  <div style={{ width: "100%" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "white"
                      }}
                    >
                      {file.name}
                    </p>
                    {!isFolder && file.size && (
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {formatSize(file.size)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer / Load More */}
      {nextPageToken && !isLoading && (
        <div
          style={{
            padding: "12px",
            textAlign: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(15, 23, 42, 0.4)"
          }}
        >
          <button
            onClick={() => fetchFiles(currentFolderId, searchQuery, nextPageToken)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "6px 16px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "white",
              cursor: "pointer"
            }}
          >
            <RefreshCw size={12} />
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
