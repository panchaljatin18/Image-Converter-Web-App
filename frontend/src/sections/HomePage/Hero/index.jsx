"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { standardImageFormats } from "../../../lib/conversions";
import { useConversionLimit } from "@/context/ConversionLimitContext";
import {
  INPUT_ACCEPT,
  ALL_FORMAT_CATEGORIES,
  ALL_FORMATS_FLAT,
  ALL_FORMAT_LOOKUP,
  getAllowedConversions,
  SOURCE_FORMATS,
  getImageSize,
  validateImageFile,
  getSourceFormat,
} from "@/lib/formatMetadata";


const GoogleDrivePicker = dynamic(() => import("../../../components/GoogleDrivePicker"), { ssr: false });
const DropboxFilePicker = dynamic(() => import("../../../components/DropboxFilePicker"), { ssr: false });
const OneDrivePicker = dynamic(() => import("../../../components/OneDrivePicker"), { ssr: false });
import Container from "@/components/Container";
import Button from "@/components/Button";
import { downloadFile } from "@/lib/downloadFile";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Download,
  ExternalLink,
  FileImage,
  RefreshCw,
  Sparkles,
  Upload,
  Zap,
  Folder,
  Link2,
  FilePlus,
  Minimize2,
  Crop,
} from "lucide-react";

const googleDriveIcon = (
  <svg viewBox="0 0 24 24" width="19" height="19" className="mr-3 shrink-0">
    <path d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574z" fill="#4285F4" />
    <path d="M7.25 3.214a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214z" fill="#0F9D58" />
    <path d="M9.509 15.867l-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" fill="#FFBA00" />
  </svg>
);

const dropboxIcon = (
  <svg viewBox="0 0 24 24" width="19" height="19" className="mr-3 shrink-0">
    <path d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z" fill="#0061ff" />
  </svg>
);

const onedriveIcon = (
  <svg viewBox="0 0 24 24" width="19" height="19" className="mr-3 shrink-0">
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

function TargetFormatSelect({ value, onChange, sourceFormatLabel, allowedFormats }) {
  const [activeCat, setActiveCat] = useState(null);
  const [hoverCat, setHoverCat] = useState(null);
  const [hoveredFmt, setHoveredFmt] = useState(null);
  const [search, setSearch] = useState("");

  const effectiveFlat = allowedFormats
    ? ALL_FORMATS_FLAT.filter(f => allowedFormats.includes(f.value))
    : ALL_FORMATS_FLAT;

  const effectiveCategories = allowedFormats
    ? ALL_FORMAT_CATEGORIES.map(c => ({
      ...c,
      formats: c.formats.filter(f => allowedFormats.includes(f.value))
    })).filter(c => c.formats.length > 0)
    : ALL_FORMAT_CATEGORIES;

  // Auto-select first available category on mount / when allowedFormats changes
  useEffect(() => {
    if (effectiveCategories.length > 0) {
      setActiveCat(prev => {
        const valid = effectiveCategories.find(c => c.id === prev);
        return valid ? prev : effectiveCategories[0].id;
      });
    }
  }, [allowedFormats]);

  // The category whose formats to show in right panel:
  // hoverCat takes priority (live hover preview), else activeCat (clicked/locked)
  const displayCatId = hoverCat || activeCat;
  const displayCategory = displayCatId ? effectiveCategories.find(c => c.id === displayCatId) : effectiveCategories[0];

  const filtered = search.trim()
    ? effectiveFlat.filter(f =>
      f.label.toLowerCase().includes(search.toLowerCase()) ||
      f.note.toLowerCase().includes(search.toLowerCase())
    )
    : (displayCategory ? displayCategory.formats : []);

  const current = value ? ALL_FORMAT_LOOKUP.get(value) : null;
  const currentCat = current ? (ALL_FORMAT_CATEGORIES.find(c => c.id === (current.catId || "image")) || ALL_FORMAT_CATEGORIES[0]) : null;

  const renderFormatChip = (fmt) => {
    const isSelected = value === fmt.value;
    const isHovered = hoveredFmt === fmt.value;
    const isSameAsSource = sourceFormatLabel && fmt.label.toUpperCase() === sourceFormatLabel.toUpperCase();
    const fmtCat = ALL_FORMAT_CATEGORIES.find(c => c.id === (fmt.catId || displayCatId)) || ALL_FORMAT_CATEGORIES[0];

    return (
      <button
        key={fmt.value}
        id={`fmt-btn-${fmt.value}`}
        type="button"
        title={isSameAsSource ? "File is already in this format" : fmt.note}
        onMouseEnter={() => setHoveredFmt(fmt.value)}
        onMouseLeave={() => setHoveredFmt(null)}
        onClick={() => {
          if (isSameAsSource) {
            const el = document.getElementById(`fmt-btn-${fmt.value}`);
            if (el) {
              el.classList.remove('animate-zigzag');
              void el.offsetWidth;
              el.classList.add('animate-zigzag');
            }
            return;
          }
          onChange(fmt.value);
        }}
        className={`flex items-center justify-center rounded-none text-[0.65rem] transition-all duration-120 tracking-wide font-['Outfit'] border ${isSameAsSource ? "cursor-not-allowed opacity-30 pointer-events-none" : "cursor-pointer"} ${isSelected ? "font-bold" : "font-medium"}`}
        style={{
          borderColor: isSelected
            ? fmtCat.color
            : isSameAsSource
              ? "rgba(255,255,255,0.08)"
              : isHovered
                ? `${fmtCat.color}60`
                : "rgba(255,255,255,0.1)",
          background: isSelected
            ? `linear-gradient(135deg, ${fmtCat.glow}, rgba(255,255,255,0.03))`
            : isSameAsSource
              ? "rgba(255,255,255,0.02)"
              : isHovered
                ? `linear-gradient(135deg, ${fmtCat.glow}80, rgba(255,255,255,0.02))`
                : "rgba(255,255,255,0.03)",
          color: isSelected
            ? fmtCat.color
            : isSameAsSource
              ? "rgba(255,255,255,0.3)"
              : isHovered
                ? fmtCat.color
                : "rgba(255,255,255,0.7)",
          boxShadow: isSelected
            ? `0 0 12px ${fmtCat.glow}`
            : isHovered && !isSameAsSource
              ? `0 0 8px ${fmtCat.glow}60`
              : "none",
          transform: isHovered && !isSameAsSource ? "scale(1.04)" : "scale(1)",
        }}
      >
        {fmt.label}
      </button>
    );
  };

  return (
    <div
      onClick={e => e.stopPropagation()}
      className="rounded-2xl border border-indigo-500/25 bg-gradient-to-b from-[#0e0e1e]/95 to-[#0a0a16]/98 overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.1),_inset_0_1px_0_rgba(255,255,255,0.05)]"
    >
      {/* Search bar */}
      <div className="flex items-center gap-2.5 p-[10px_14px] border-b border-white/6 bg-white/2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="stroke-white/40" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search Format"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white/80 text-[0.85rem] font-inherit"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="bg-transparent border-none text-white/40 cursor-pointer p-0 leading-none"
          >✕</button>
        )}
      </div>

      <div className="flex h-40" onMouseLeave={() => setHoverCat(null)}>
        {/* Category sidebar — hover previews, click locks */}
        {!search && (
          <div
            className="w-[105px] shrink-0 border-r border-white/6 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {effectiveCategories.map(cat => {
              const isHov = hoverCat === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onMouseEnter={() => setHoverCat(cat.id)}
                  onClick={() => setActiveCat(cat.id)}
                  className={`w-full py-1.5 px-3 bg-transparent border-none text-[0.75rem] cursor-pointer text-left transition-all duration-120 font-['Outfit'] font-medium`}
                  style={{
                    color: isHov ? cat.color : "rgba(255,255,255,0.45)",
                  }}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Format chips grid */}
        <div className="flex-1 overflow-y-auto p-1.5 grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] auto-rows-[26px] gap-1 content-start scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {filtered.length === 0 ? (
            <div className="col-span-full flex items-center justify-center text-white/30 text-[0.8rem] p-5">
              {allowedFormats && allowedFormats.length === 0
                ? "No conversion options available."
                : "No formats found"}
            </div>
          ) : (
            filtered.map(fmt => renderFormatChip(fmt))
          )}
        </div>
      </div>

      {/* Selected format footer */}
      <div className="p-[8px_14px] border-t border-white/6 bg-white/2 flex items-center gap-2.5">
        <div
          className="w-2 h-2 rounded-full shrink-0 transition-all duration-200"
          style={{
            background: currentCat ? currentCat.color : "rgba(255,255,255,0.2)",
            boxShadow: currentCat ? `0 0 8px ${currentCat.glow}` : "none",
          }}
        />
        <span className="text-[0.75rem] text-white/40">
          {current && currentCat ? (
            <>
              Selected: <strong style={{ color: currentCat.color }}>{current.label}</strong>
              {current.note && <span className="ml-1.5 opacity-60">— {current.note}</span>}
            </>
          ) : (
            <span className="italic">Hover a category · Click a format to select</span>
          )}
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  const { checkConversionLimit, incrementConversionCount } = useConversionLimit();
  const [targetFormat, setTargetFormat] = useState("");
  const [sourceFormat, setSourceFormat] = useState("jpg");
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  const sourceRef = useRef(null);
  const targetRef = useRef(null);

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);
  const outputUrlRef = useRef("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target)) {
        setIsSourceDropdownOpen(false);
      }
      if (targetRef.current && !targetRef.current.contains(event.target)) {
        setIsTargetDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Auto-cycle example formats
  useEffect(() => {
    if (!isAutoCycling || file || isSourceDropdownOpen || isTargetDropdownOpen) return;

    const cycleExamples = [
      { src: "jpg", tgt: "png" },
      { src: "mp4", tgt: "mp3" },
      { src: "pdf", tgt: "docx" },
      { src: "csv", tgt: "xlsx" },
      { src: "ai", tgt: "svg" },
      { src: "webm", tgt: "gif" },
    ];
    
    // Find current index
    let currentIndex = cycleExamples.findIndex(ex => ex.src === sourceFormat);
    if (currentIndex === -1) currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cycleExamples.length;
      setSourceFormat(cycleExamples[currentIndex].src);
      setTargetFormat(cycleExamples[currentIndex].tgt);
    }, 3500); // cycle every 3.5 seconds

    return () => clearInterval(interval);
  }, [isAutoCycling, file, isSourceDropdownOpen, isTargetDropdownOpen, sourceFormat]);

  const floatingAnim = {
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const handleSwap = useCallback(() => {
    setIsAutoCycling(false);
    const prevSource = sourceFormat;
    setSourceFormat(targetFormat || "png");
    setTargetFormat(prevSource);
  }, [sourceFormat, targetFormat]);

  // Synchronize available options when sourceFormat changes
  // Synchronize available options when sourceFormat changes
  useEffect(() => {
    if (!file) return; // Only synchronize/reset if a file has been uploaded
    const allowedConversions = getAllowedConversions(sourceFormat);
    if (allowedConversions && allowedConversions.length > 0) {
      if (!targetFormat || !allowedConversions.includes(targetFormat)) {
        setTargetFormat(""); // Reset if invalid
      }
    } else {
      setTargetFormat("");
    }
  }, [sourceFormat, file]);

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

  // Toolkit states (Tools & Subtools)
  const [activeTool, setActiveTool] = useState("convert"); // "convert", "compress", "resize", "crop"
  const [compressionQuality, setCompressionQuality] = useState(80);
  const [resizeMode, setResizeMode] = useState("percent"); // "percent", "custom"
  const [resizePercent, setResizePercent] = useState(50);
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [cropAspect, setCropAspect] = useState("1:1");
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  const getEffectiveToken = async () => {
    try {
      const { getSession } = await import("next-auth/react");
      const currentSession = await getSession();
      if (currentSession?.accessToken) return currentSession.accessToken;
    } catch {}
    const authModule = await import("../../../services/authService");
    return authModule.default.getToken();
  };

  useEffect(() => {
    let isMounted = true;
    if (cloudProvider === "google-drive") {
      (async () => {
        const token = await getEffectiveToken();
        if (!token) {
          if (isMounted) {
            setIsDriveConnected(false);
            setDriveEmail("");
          }
          return;
        }

        if (isMounted) setCheckingDrive(true);
        try {
          const driveModule = await import("../../../services/googleDriveService");
          const data = await driveModule.default.getStatus(token);
          if (isMounted && data.success) {
            setIsDriveConnected(data.connected);
            setDriveEmail(data.email || "");
          }
        } catch (err) {
          console.error("Error loading Drive status:", err);
          if (isMounted) setIsDriveConnected(false);
        } finally {
          if (isMounted) setCheckingDrive(false);
        }
      })();
    }
    return () => { isMounted = false; };
  }, [cloudProvider]);

  useEffect(() => {
    let isMounted = true;
    if (cloudProvider === "dropbox") {
      (async () => {
        const token = await getEffectiveToken();
        if (!token) {
          if (isMounted) {
            setIsDropboxConnected(false);
            setDropboxEmail("");
          }
          return;
        }

        if (isMounted) setCheckingDropbox(true);
        try {
          const dropboxModule = await import("../../../services/dropboxService");
          const data = await dropboxModule.default.getStatus(token);
          if (isMounted && data.success) {
            setIsDropboxConnected(data.connected);
            setDropboxEmail(data.email || "");
          }
        } catch (err) {
          console.error("Error loading Dropbox status:", err);
          if (isMounted) setIsDropboxConnected(false);
        } finally {
          if (isMounted) setCheckingDropbox(false);
        }
      })();
    }
    return () => { isMounted = false; };
  }, [cloudProvider]);

  useEffect(() => {
    let isMounted = true;
    if (cloudProvider === "onedrive") {
      (async () => {
        const token = await getEffectiveToken();
        if (!token) {
          if (isMounted) {
            setIsOneDriveConnected(false);
            setOnedriveEmail("");
          }
          return;
        }

        if (isMounted) setCheckingOneDrive(true);
        try {
          const onedriveModule = await import("../../../services/onedriveService");
          const data = await onedriveModule.default.getStatus(token);
          if (isMounted && data.success) {
            setIsOneDriveConnected(data.connected);
            setOnedriveEmail(data.email || "");
          }
        } catch (err) {
          console.error("Error loading OneDrive status:", err);
          if (isMounted) setIsOneDriveConnected(false);
        } finally {
          if (isMounted) setCheckingOneDrive(false);
        }
      })();
    }
    return () => { isMounted = false; };
  }, [cloudProvider]);

  const target = targetFormat ? (ALL_FORMAT_LOOKUP.get(targetFormat) || null) : null;
  const source = getSourceFormat(file);

  const handleUrlLoad = useCallback(async (url) => {
    if (!url) return;
    setIsLoadingUrl(true);
    setError("");
    try {
      if (!/^https?:\/\/.+/i.test(url)) {
        throw new Error("Please enter a valid URL starting with http:// or https://");
      }

      // Try client side fetching
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

      handleFile(loadedFile);
      setUploadMethod("file"); // Reset back to file representation
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

        handleFile(loadedFile);
        setUploadMethod("file");
        setInputUrl("");
      } catch (innerErr) {
        setError(innerErr.message || "Failed to load image from URL. Ensure CORS is enabled on the host.");
      }
    } finally {
      setIsLoadingUrl(false);
    }
  }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearOutputUrl = useCallback(() => {
    if (outputUrlRef.current) {
      URL.revokeObjectURL(outputUrlRef.current);
      outputUrlRef.current = "";
    }
  }, []);

  useEffect(
    () => () => {
      clearOutputUrl();
    },
    [clearOutputUrl]
  );

  const handleFile = useCallback(
    (candidate) => {
      const message = validateImageFile(candidate);
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      if (message) {
        setError(message);
        return;
      }

      clearOutputUrl();
      setError("");
      setResult(null);
      setFile(candidate);
      setProgress(0);
      setConverting(false);

      if (candidate) {
        const detected = getSourceFormat(candidate);
        if (detected && detected.label !== "AUTO" && detected.label !== "FILE") {
          setSourceFormat(detected.label.toLowerCase());
        } else {
          const ext = candidate.name.split(".").pop()?.toLowerCase();
          if (ext) {
            setSourceFormat(ext);
          }
        }
      }

      // Extract image dimensions for scaling UI
      if (candidate) {
        const tempImg = new window.Image();
        const objectUrl = URL.createObjectURL(candidate);
        tempImg.src = objectUrl;
        tempImg.onload = () => {
          setImgWidth(tempImg.naturalWidth);
          setImgHeight(tempImg.naturalHeight);
          URL.revokeObjectURL(objectUrl);
        };
      }
    },
    [clearOutputUrl]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragging(false);
      handleFile(event.dataTransfer.files[0]);
    },
    [handleFile]
  );

    const handleConvert = useCallback(async (e) => {
    if (!file) return;
    if (!checkConversionLimit()) return;

    if (e && e.currentTarget) {
      try {
        e.currentTarget.blur();
      } catch (err) {}
    }

    setConverting(true);
    setProgress(8);
    setError("");

    let sourceUrl = "";

    try {
      const img = new window.Image();
      sourceUrl = URL.createObjectURL(file);
      img.src = sourceUrl;

      const isImageLoaded = await new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });

      setProgress(40);

      let targetWidth = 2000;
      let targetHeight = 2000;
      let blob = null;

      const lookupTarget = SOURCE_FORMATS.find(f => f.extensions.includes(target?.value));
      const targetMime = lookupTarget ? lookupTarget.mimes[0] : `image/${target?.value === "jpg" ? "jpeg" : target?.value === "svg" ? "svg+xml" : target?.value || "png"}`;
      const mime = targetFormat ? targetMime : (file.type || "application/octet-stream");
      const ext = targetFormat ? (lookupTarget ? `.${lookupTarget.extensions[0]}` : `.${target?.value || "png"}`) : "." + (file.name.split(".").pop() || "png");

      if (isImageLoaded) {
        targetWidth = img.naturalWidth || 2000;
        targetHeight = img.naturalHeight || 2000;

        if (activeTool === "resize") {
          if (resizeMode === "percent") {
            const ratio = resizePercent / 100;
            targetWidth = Math.max(1, Math.round(targetWidth * ratio));
            targetHeight = Math.max(1, Math.round(targetHeight * ratio));
          } else {
            const w = parseInt(customWidth);
            const h = parseInt(customHeight);
            if (w > 0 && h > 0) {
              targetWidth = w;
              targetHeight = h;
            } else if (w > 0) {
              targetWidth = w;
              targetHeight = Math.max(1, Math.round((w / (img.naturalWidth || 2000)) * (img.naturalHeight || 2000)));
            } else if (h > 0) {
              targetHeight = h;
              targetWidth = Math.max(1, Math.round((h / (img.naturalHeight || 2000)) * (img.naturalWidth || 2000)));
            }
          }
        }

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.naturalWidth || 2000;
        let sourceHeight = img.naturalHeight || 2000;

        if (activeTool === "crop") {
          if (cropAspect === "1:1") {
            const size = Math.min(sourceWidth, sourceHeight);
            sourceX = Math.round((sourceWidth - size) / 2);
            sourceY = Math.round((sourceHeight - size) / 2);
            sourceWidth = size;
            sourceHeight = size;
            targetWidth = size;
            targetHeight = size;
          } else if (cropAspect === "16:9") {
            const targetRatio = 16 / 9;
            const currentRatio = sourceWidth / sourceHeight;
            if (currentRatio > targetRatio) {
              sourceHeight = sourceHeight;
              sourceWidth = Math.round(sourceHeight * targetRatio);
              sourceX = Math.round(((img.naturalWidth || 2000) - sourceWidth) / 2);
            } else {
              sourceWidth = sourceWidth;
              sourceHeight = Math.round(sourceWidth / targetRatio);
              sourceY = Math.round(((img.naturalHeight || 2000) - sourceHeight) / 2);
            }
            targetWidth = sourceWidth;
            targetHeight = sourceHeight;
          } else if (cropAspect === "4:3") {
            const targetRatio = 4 / 3;
            const currentRatio = sourceWidth / sourceHeight;
            if (currentRatio > targetRatio) {
              sourceHeight = sourceHeight;
              sourceWidth = Math.round(sourceHeight * targetRatio);
              sourceX = Math.round(((img.naturalWidth || 2000) - sourceWidth) / 2);
            } else {
              sourceWidth = sourceWidth;
              sourceHeight = Math.round(sourceWidth / targetRatio);
              sourceY = Math.round(((img.naturalHeight || 2000) - sourceHeight) / 2);
            }
            targetWidth = sourceWidth;
            targetHeight = sourceHeight;
          }
        }
      }

      let actionSuffix = "";
      if (activeTool === "compress") actionSuffix = "-compressed";
      if (activeTool === "resize") actionSuffix = `-resized-${targetWidth}x${targetHeight}`;
      if (activeTool === "crop") actionSuffix = `-cropped-${cropAspect.replace(":", "x")}`;

      const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");
      const outputName = nameWithoutExt + actionSuffix + ext;

      const { processFileWithBackend } = await import("@/lib/apiClient");

      await processFileWithBackend(file, {
        targetFormat: target?.value || ext.slice(1) || "png",
        options: {
          width: activeTool === "resize" ? targetWidth : undefined,
          height: activeTool === "resize" ? targetHeight : undefined,
          crop: activeTool === "crop" ? {
            x: sourceX,
            y: sourceY,
            width: sourceWidth,
            height: sourceHeight
          } : undefined,
          quality: activeTool === "compress" ? compressionQuality / 100 : undefined
        },
        onProgress: (p) => setProgress(Math.max(40, p)),
        onSuccess: (data) => {
          clearOutputUrl();
          outputUrlRef.current = data.outputUrl;

          setResult({
            url: data.outputUrl,
            name: outputName,
            size: data.outputSize ? getImageSize(data.outputSize) : "Available on download",
            width: targetWidth,
            height: targetHeight,
          });
          setProgress(100);
          setConverting(false);
          if (sourceUrl) URL.revokeObjectURL(sourceUrl);
          incrementConversionCount();
        },
        onError: (err) => {
          setProgress(0);
          setError(`Failed to process file: ${err.message || "Unknown error"}`);
          setConverting(false);
          if (sourceUrl) URL.revokeObjectURL(sourceUrl);
        }
      });
    } catch (err) {
      setProgress(0);
      setError(`Failed to process file: ${err?.message || "Unknown error"}`);
      setConverting(false);
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    }
  }, [file, activeTool, target, compressionQuality, resizeMode, resizePercent, customWidth, customHeight, cropAspect, clearOutputUrl]);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError("");
    setProgress(0);
    setConverting(false);
    setIsDragging(false);
    setActiveTool("convert");
    setCompressionQuality(80);
    setResizeMode("percent");
    setResizePercent(50);
    setCustomWidth("");
    setCustomHeight("");
    setCropAspect("1:1");
    setImgWidth(0);
    setImgHeight(0);
    setSourceFormat("jpg");
    setTargetFormat("");
    setIsAutoCycling(true);
    setUploadMethod("file");
    setCloudProvider(null);
    setInputUrl("");
    setIsLoadingUrl(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    clearOutputUrl();
  }, [clearOutputUrl]);

  return (
    <section className="relative min-h-screen flex items-start md:items-center pt-[76px] pb-[36px] sm:pt-[80px] sm:pb-[43px] md:pt-[84px] md:pb-[50px] lg:pt-[88px] lg:pb-[57px] xl:pt-[92px] xl:pb-[70px] 2xl:pt-[96px] 2xl:pb-[72px] bg-gradient-to-br from-[#0f0f1a] via-[#121221] to-[#0f1729]">

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_42%,transparent_80%)]" />

        {/* Concentric rings centered around the converter panel area */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-indigo-500/5 opacity-15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-cyan-500/5 opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-indigo-500/10 opacity-25" />
      </div>

      <Container className="relative z-[1]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-[24px] sm:gap-[28px] md:gap-[32px] lg:gap-[36px] xl:gap-[138px] 2xl:gap-[120px] w-full">
          <div className="w-full md:flex-[1_1_50%] max-w-full md:max-w-[448px] lg:max-w-[512px] xl:max-w-[576px] 2xl:max-w-[640px]">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 py-2 px-4 bg-indigo-500/8 border border-indigo-500/20 rounded-full text-[#818cf8] font-semibold font-['Outfit'] tracking-wide text-[0.78rem]">
                <Zap size={12} />
                Convert directly in your browser
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[52px] 2xl:text-[58px] font-bold tracking-[-0.02em] leading-[1.1] font-['Outfit'] mb-3.5">
              Free Online Image<br />Converter
              <br />
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent whitespace-nowrap">
                Fast, Private &amp; No Upload
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-[0.95rem] lg:text-[1rem] xl:text-[1.05rem] text-[#94a3b8] leading-relaxed max-w-[540px] mb-5">
              Convert, compress, and optimize any image directly in your browser. Auto-detect formats, adjust quality,
              and batch process files 100% privately without uploading to external servers.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-5">
              {["Auto detect", "Browser only", "Fast output"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-white/3 border border-white/8 rounded-full text-[#94a3b8] font-medium text-[0.75rem] transition-all duration-200"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex gap-3 sm:gap-3.5">
              <Link href="/tools" className="no-underline flex-1 min-w-0">
                <Button variant="secondary" size="lg" className="w-full justify-center">
                  <FileImage size={18} />
                  Browse Tools
                </Button>
              </Link>
              <a href="#converter-panel" className="no-underline flex-1 min-w-0">
                <Button variant="primary" size="lg" className="w-full justify-center">
                  <Zap size={18} />
                  Start Converting
                </Button>
              </a>
            </div>
          </div>

          <div id="converter-panel" className="w-full md:flex-[1_1_50%] max-w-[320px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[440px] 2xl:max-w-[460px] mx-auto mt-0 md:mt-2 lg:mt-4 xl:mt-6 md:self-start">

            {/* Row of Select Cards: Convert From -> Swap Button -> Convert To */}
            {/* Moved OUTSIDE the dark container */}
            <div className="flex items-center justify-between gap-2.5 mb-6 relative z-20">
              {/* Subtle gradient connecting line */}
                <div className="absolute top-1/2 left-3 right-3 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-y-1/2 z-0" />

                {/* Convert From Card */}
                <div ref={sourceRef} className="relative z-10 flex-1">
                  <div
                    onClick={() => {
                      if (!file) {
                        setIsAutoCycling(false);
                        setIsSourceDropdownOpen(!isSourceDropdownOpen);
                        setIsTargetDropdownOpen(false);
                      }
                    }}
                    className={`animate-float-slow gpu-accelerated bg-gradient-to-br from-[#1e1e36]/90 to-[#121221]/95 backdrop-blur-md border rounded-[22px] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_10px_30px_rgba(0,0,0,0.5)] text-center flex flex-col items-center justify-center h-[120px] transition-all duration-300 ${file
                      ? "cursor-not-allowed border-white/5 opacity-60"
                      : "cursor-pointer border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                      }`}
                  >
                    <span className="text-[0.68rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-['Inter']">
                      Convert From
                    </span>
                    <div className="flex flex-col items-center gap-1.5 w-full justify-center px-2 mt-1">
                      <div className="text-slate-300 opacity-90 drop-shadow-md">
                        <FileImage size={26} strokeWidth={2} />
                      </div>
                      <span 
                        className="text-[1.35rem] sm:text-2xl font-black text-[#f8fafc] font-['Outfit'] tracking-wide drop-shadow-sm"
                      >
                        {file ? (file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : source.label.toUpperCase()) : sourceFormat.toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown size={18} className="mt-2 text-slate-300 opacity-80" style={{ transform: isSourceDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
                  </div>

                  {isSourceDropdownOpen && (
                    <div
                      className="absolute top-[calc(100%+8px)] left-0 w-[270px] sm:w-[310px] z-[999] transition-all duration-150 transform opacity-100 translate-y-0"
                    >
                      <TargetFormatSelect
                        value={sourceFormat}
                        onChange={(val) => {
                          setSourceFormat(val);
                          setIsSourceDropdownOpen(false);
                        }}
                        sourceFormatLabel={targetFormat}
                      />
                    </div>
                  )}
                </div>

                {/* Swap Button */}
                <div className="relative z-30 shrink-0 mx-1">
                  {/* Subtle pulsing backdrop */}
                  {!file && (
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[10px] opacity-40 animate-pulse pointer-events-none" />
                  )}
                  <button
                    type="button"
                    aria-label="Swap source and target formats"
                    onClick={file ? undefined : handleSwap}
                    className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 ring-4 ring-[#0f0f1a] ${file
                      ? "bg-white/5 border border-white/8 text-slate-600 cursor-not-allowed opacity-40 shadow-none"
                      : "bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 border border-white/20 cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.4),_inset_0_2px_4px_rgba(255,255,255,0.3)] hover:shadow-[0_0_28px_rgba(6,182,212,0.6),_inset_0_2px_6px_rgba(255,255,255,0.5)] hover:scale-110 active:scale-95 hover:rotate-180"
                      }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3L21 7L17 11" />
                      <path d="M3 17L7 21L3 15" />
                      <path d="M21 7H9" />
                      <path d="M3 17H15" />
                    </svg>
                  </button>
                </div>

                {/* Convert To Card */}
                <div ref={targetRef} className="relative z-10 flex-1">
                  {(() => {
                    const allowedConversions = getAllowedConversions(sourceFormat);
                    const hasConversions = file ? allowedConversions.length > 0 : true;

                    return (
                      <>
                        <div
                          onClick={() => {
                            if (!hasConversions) return;
                            setIsAutoCycling(false);
                            setIsTargetDropdownOpen(!isTargetDropdownOpen);
                            setIsSourceDropdownOpen(false);
                          }}
                          className={`animate-float-slow gpu-accelerated bg-gradient-to-br from-[#121e36]/90 to-[#0e1221]/95 backdrop-blur-md border rounded-[22px] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_10px_30px_rgba(0,0,0,0.5)] text-center flex flex-col items-center justify-center h-[120px] transition-all duration-300 ${hasConversions
                            ? "cursor-pointer border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                            : "cursor-not-allowed border-white/5 opacity-60"
                            }`}
                        >
                          <span className={`text-[0.68rem] font-bold ${hasConversions ? "text-cyan-400" : "text-slate-500"} uppercase tracking-wider mb-1.5 font-['Inter']`}>
                            Convert To
                          </span>
                          <div className="flex flex-col items-center gap-1.5">
                            {hasConversions ? (
                              <div className="flex flex-col items-center gap-1.5 w-full justify-center px-2 mt-1">
                                <div className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] opacity-90">
                                  <RefreshCw size={26} strokeWidth={2.5} />
                                </div>
                                <span className="text-[1.35rem] sm:text-2xl font-black text-cyan-200 font-['Outfit'] tracking-wide drop-shadow-sm">
                                  {targetFormat ? targetFormat.toUpperCase() : "SELECT"}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[0.65rem] text-slate-400 font-semibold mt-1">
                                No conversion options available.
                              </span>
                            )}
                          </div>
                          {hasConversions && <ChevronDown size={18} className="mt-2 text-cyan-400 opacity-90" style={{ transform: isTargetDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />}
                        </div>

                        {isTargetDropdownOpen && hasConversions && (
                          <div
                            className="absolute top-[calc(100%+8px)] right-0 w-[270px] sm:w-[310px] z-[999] transition-all duration-150 transform opacity-100 translate-y-0"
                          >
                            <TargetFormatSelect
                              value={targetFormat}
                              onChange={(val) => {
                                setTargetFormat(val);
                                setIsTargetDropdownOpen(false);
                              }}
                              sourceFormatLabel={file ? (file.name.includes('.') ? file.name.split('.').pop() : sourceFormat) : sourceFormat}
                              allowedFormats={file ? allowedConversions : undefined}
                            />
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>


            </div>

            {/* Main Converter Container */}
            <div className="rounded-[28px] border border-indigo-500/18 bg-gradient-to-b from-[#121221]/92 to-[#0e0e1a]/98 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-3xl p-4 relative overflow-visible mt-6">

              {/* Upload Dropzone Box */}
              <div
                className={`border rounded-2xl flex items-center justify-center cursor-default transition-all duration-300 ${file && !result ? "min-h-0 p-4" : "min-h-[260px] p-[24px_16px]"
                  } ${isDragging
                    ? "border-indigo-500 bg-gradient-to-b from-indigo-500/16 to-cyan-500/5"
                    : "border-white/8 bg-gradient-to-b from-white/3 to-white/[0.015]"
                  }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  setUploadMethod("file");
                  handleDrop(e);
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept={INPUT_ACCEPT}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  className="absolute w-0 h-0 opacity-0 pointer-events-none"
                  aria-hidden="true"
                />

                {!file && !result ? (
                  uploadMethod === "url" ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center gap-4 text-center w-full max-w-[420px] p-[20px_10px]"
                    >
                      <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-cyan-500/20 to-[#6366f1]/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Link2 size={28} />
                      </div>

                      <div className="w-full">
                        <p className="font-['Outfit'] font-bold text-[1.22rem] text-[#f8fafc] mb-1.5">
                          Load image from URL
                        </p>
                        <p className="text-[#64748b] text-[0.92rem] mb-4">
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
                            className="w-full py-3 px-4 rounded-xl bg-[#13131f] border border-white/8 text-[#f8fafc] text-[0.95rem] transition-all duration-200 outline-none placeholder:text-slate-500 focus:border-[#6366f1] focus:bg-indigo-500/5 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] flex-1 text-center"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 w-full justify-center">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="min-w-[100px] justify-center"
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
                          className="min-w-[120px] justify-center"
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
                  ) : uploadMethod === "cloud" ? (
                    (checkingDrive || checkingDropbox || checkingOneDrive) ? (
                      <div className="flex flex-col items-center justify-center p-10" onClick={(e) => e.stopPropagation()}>
                        <RefreshCw size={24} className="animate-spin text-[#818cf8]" />
                        <p className="mt-2.5 text-[0.85rem] text-[#64748b]">Checking connection status...</p>
                      </div>
                    ) : cloudProvider === "google-drive" && isDriveConnected ? (
                      <div className="w-full max-w-[600px]" onClick={(e) => e.stopPropagation()}>
                        <GoogleDrivePicker
                          onFileSelected={async (file) => {
                            handleFile(file);
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
                            handleFile(file);
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
                            handleFile(file);
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
                        className="flex flex-col items-center gap-4 text-center w-full max-w-[420px] p-[20px_10px]"
                      >
                        <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/35 flex items-center justify-center text-[#818cf8]">
                          {cloudProvider === "google-drive" ? googleDriveIconLarge :
                            cloudProvider === "dropbox" ? dropboxIconLarge :
                              onedriveIconLarge}
                        </div>

                        <div>
                          <p className="font-['Outfit'] font-bold text-[1.22rem] text-[#f8fafc] mb-1.5 capitalize">
                            Connect to {cloudProvider?.replace("-", " ")}
                          </p>
                          <p className="text-[#64748b] text-[0.92rem] leading-relaxed mb-4">
                            Authorize your account to browse and convert files directly from your cloud storage.
                          </p>
                        </div>

                        <div className="flex gap-3 w-full justify-center">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="min-w-[100px] justify-center"
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
                            className="min-w-[160px] justify-center"
                            onClick={async () => {
                              const token = await getEffectiveToken();
                              if (!token) {
                                setError("Please log in to your account first.");
                                return;
                              }
                              if (cloudProvider === "google-drive") {
                                try {
                                  const driveModule = await import("../../../services/googleDriveService");
                                  const redirectUri = `${window.location.origin}/dashboard/google-drive/callback`;
                                  const data = await driveModule.default.getAuthUrl(token, redirectUri);
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
                                  const dropboxModule = await import("../../../services/dropboxService");
                                  const redirectUri = `${window.location.origin}/dashboard/dropbox/callback`;
                                  const data = await dropboxModule.default.getAuthUrl(token, redirectUri);
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
                                  const onedriveModule = await import("../../../services/onedriveService");
                                  const redirectUri = `${window.location.origin}/dashboard/onedrive/callback`;
                                  const data = await onedriveModule.default.getAuthUrl(token, redirectUri);
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
                          </Button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center gap-3.5 text-center max-w-[390px]"
                    >
                      <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-red-500/24 to-red-400/12 border border-red-500/30 flex items-center justify-center text-red-300">
                        <Upload size={28} />
                      </div>
                      <div>
                        <p className="font-['Outfit'] font-bold text-[1.22rem] text-[#f8fafc] mb-1.5">
                          Drop your file here
                        </p>
                        <p className="font-['Outfit'] font-bold text-[1.22rem] text-[#818cf8] mb-1.5">
                          Select your file here
                        </p>

                      </div>

                      <div className="relative z-[100]" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="button"
                          variant="primary"
                          size="lg"
                          className="justify-between min-w-[200px] gap-3"
                          onClick={() => {
                            setIsDropdownOpen((prev) => !prev);
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <FilePlus size={18} />
                            Select File
                          </span>
                          <ChevronDown
                            size={16}
                            style={{
                              transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.2s ease"
                            }}
                          />
                        </Button>

                        {isDropdownOpen && (
                          <>
                            <div
                              onClick={() => setIsDropdownOpen(false)}
                              className="fixed inset-0 z-[98] cursor-default"
                            />
                            <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-60 bg-[#16162a] border border-white/10 rounded-2xl p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_30px_rgba(99,102,241,0.1)] flex flex-col gap-0.5 z-[99]">
                              <button
                                type="button"
                                className="flex items-center w-full py-3 px-4 bg-transparent border-none rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/4 text-[0.95rem] font-semibold cursor-pointer transition-all duration-150 text-left font-['Inter']"
                                onClick={() => {
                                  inputRef.current?.click();
                                  setTimeout(() => {
                                    setIsDropdownOpen(false);
                                  }, 50);
                                }}
                              >
                                <Folder size={19} className="mr-3 text-[#818cf8] shrink-0" />
                                From my computer
                              </button>

                              <button
                                type="button"
                                className="flex items-center w-full py-3 px-4 bg-transparent border-none rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/4 text-[0.95rem] font-semibold cursor-pointer transition-all duration-150 text-left font-['Inter']"
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  setUploadMethod("url");
                                }}
                              >
                                <Link2 size={19} className="mr-3 text-cyan-400 shrink-0" />
                                By URL
                              </button>

                              <div className="h-px bg-white/8 my-1" />

                              <button
                                type="button"
                                className="flex items-center w-full py-3 px-4 bg-transparent border-none rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/4 text-[0.95rem] font-semibold cursor-pointer transition-all duration-150 text-left font-['Inter']"
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
                                className="flex items-center w-full py-3 px-4 bg-transparent border-none rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/4 text-[0.95rem] font-semibold cursor-pointer transition-all duration-150 text-left font-['Inter']"
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
                                className="flex items-center w-full py-3 px-4 bg-transparent border-none rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/4 text-[0.95rem] font-semibold cursor-pointer transition-all duration-150 text-left font-['Inter']"
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

                    </div>
                  )
                ) : result ? (
                  <div className="w-full max-w-[460px] mx-auto flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-[18px] bg-emerald-500/12 border border-emerald-500/22 flex items-center justify-center text-emerald-400">
                      <CheckCircle size={28} />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-400 mb-1.5">
                        Conversion Successful
                      </p>
                      <p className="text-[#94a3b8] text-[0.9rem]">
                        {result.name} | {result.size}
                        {standardImageFormats.includes(targetFormat.replace(".", "").toLowerCase()) && (
                          <> | {result.width}x{result.height}px</>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-3 flex-wrap justify-center">
                      <Button
                        variant="primary"
                        size="lg"
                        className="justify-center"
                        onClick={async () => {
                          await downloadFile(result.url, result.name);
                        }}
                      >
                        <Download size={18} />
                        Download {target?.label || targetFormat.toUpperCase()}
                      </Button>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline"
                      >
                        <Button variant="secondary" size="lg" className="justify-center">
                          <ExternalLink size={18} />
                          Open in New Tab
                        </Button>
                      </a>
                      <Button variant="secondary" size="lg" onClick={reset}>
                        Convert Another
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-[400px] mx-auto flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-3 justify-between flex-wrap">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/16 border border-indigo-500/20 flex items-center justify-center text-[#818cf8] shrink-0">
                          <FileImage size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#f8fafc] mb-0.5 text-[0.95rem] overflow-hidden text-ellipsis whitespace-nowrap">
                            {file.name}
                          </p>
                          <p className="text-[#64748b] text-[0.75rem]">
                            {getImageSize(file.size)} | Source {file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : source.label.toUpperCase()} | Ready to convert to {target?.label || "a selected format"}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="secondary" 
                        onClick={() => {
                          if (inputRef.current) {
                            inputRef.current.value = "";
                            inputRef.current.click();
                          }
                        }} 
                        className="py-1 px-2.5 text-[0.75rem] h-auto min-h-[28px] rounded-lg"
                      >
                        Change file
                      </Button>
                    </div>

                    {/* Tool Selector Tabs */}
                    <div className="flex gap-1 bg-black/25 border border-white/7 rounded-[14px] p-1">
                      {[
                        {
                          id: "convert", label: "Convert",
                          color: "#6366f1", glow: "rgba(99,102,241,0.3)",
                          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>
                        },
                        {
                          id: "compress", label: "Compress",
                          color: "#f59e0b", glow: "rgba(245,158,11,0.3)",
                          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        },
                        {
                          id: "resize", label: "Resize",
                          color: "#06b6d4", glow: "rgba(6,182,212,0.3)",
                          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                        },
                        {
                          id: "crop", label: "Crop",
                          color: "#ec4899", glow: "rgba(236,72,153,0.3)",
                          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14" /><path d="M18 22V8a2 2 0 0 0-2-2H2" /></svg>
                        },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setActiveTool(t.id)}
                          className={`flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[0.7rem] font-bold tracking-wide transition-all duration-180 font-['Outfit'] border-1.5 ${activeTool === t.id
                            ? "text-[#818cf8]"
                            : "border-transparent bg-transparent text-white/45 hover:text-white/60 cursor-pointer"
                            }`}
                          style={{
                            borderColor: activeTool === t.id ? t.color : "transparent",
                            background: activeTool === t.id ? t.glow : "transparent",
                            color: activeTool === t.id ? t.color : undefined,
                            boxShadow: activeTool === t.id ? `0 0 14px ${t.glow}` : "none",
                          }}
                        >
                          {t.icon}
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Tool configurations */}
                    {activeTool === "compress" && (
                      <div className="flex flex-col gap-3 bg-white/2 border border-white/6 rounded-2xl p-3">
                        <span className="text-[0.75rem] font-bold text-[#94a3b8] uppercase tracking-wider">
                          Compression settings
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[0.85rem] text-[#f8fafc]">
                            <span>Quality:</span>
                            <strong>{compressionQuality}%</strong>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={compressionQuality}
                            onChange={(e) => setCompressionQuality(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
                          />
                        </div>
                        <div className="flex gap-2">
                          {[
                            { label: "Max Compress", value: 30 },
                            { label: "Balanced", value: 75 },
                            { label: "High Quality", value: 95 }
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setCompressionQuality(preset.value)}
                              className={`flex-1 py-1.5 px-2 border rounded-lg text-[0.72rem] cursor-pointer transition-all duration-150 ${compressionQuality === preset.value
                                ? "border-[#6366f1] bg-indigo-500/15 text-[#818cf8]"
                                : "border-white/8 bg-white/2 text-[#64748b] hover:text-[#94a3b8]"
                                }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTool === "resize" && (
                      <div className="flex flex-col gap-3 bg-white/2 border border-white/6 rounded-2xl p-3">
                        <span className="text-[0.75rem] font-bold text-[#94a3b8] uppercase tracking-wider">
                          Resize dimensions
                        </span>
                        <div className="flex gap-2.5 items-center">
                          <label className="flex items-center gap-1.5 text-[0.82rem] text-[#94a3b8] cursor-pointer hover:text-[#f8fafc]">
                            <input
                              type="radio"
                              name="resizeMode"
                              checked={resizeMode === "percent"}
                              onChange={() => setResizeMode("percent")}
                              className="accent-[#6366f1] cursor-pointer"
                            />
                            Scale %
                          </label>
                          <label className="flex items-center gap-1.5 text-[0.82rem] text-[#94a3b8] cursor-pointer hover:text-[#f8fafc]">
                            <input
                              type="radio"
                              name="resizeMode"
                              checked={resizeMode === "custom"}
                              onChange={() => setResizeMode("custom")}
                              className="accent-[#6366f1] cursor-pointer"
                            />
                            Custom Px
                          </label>
                        </div>

                        {resizeMode === "percent" ? (
                          <div className="flex gap-2">
                            {[25, 50, 75].map((pct) => (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => setResizePercent(pct)}
                                className={`flex-1 py-2 border rounded-xl text-[0.8rem] font-semibold cursor-pointer transition-all duration-150 ${resizePercent === pct
                                  ? "border-[#6366f1] bg-indigo-500/15 text-[#818cf8]"
                                  : "border-white/8 bg-white/2 text-[#f8fafc] hover:bg-white/4"
                                  }`}
                              >
                                {pct}% Size
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="flex flex-col gap-1">
                              <span className="text-[0.7rem] text-[#64748b]">Width (px):</span>
                              <input
                                type="number"
                                placeholder={imgWidth ? `${imgWidth}px` : "Width"}
                                value={customWidth}
                                onChange={(e) => setCustomWidth(e.target.value)}
                                className="w-full py-2 px-3 bg-black/20 border border-white/8 rounded-xl text-white text-[0.85rem] outline-none transition-all duration-150 focus:border-[#6366f1]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[0.7rem] text-[#64748b]">Height (px):</span>
                              <input
                                type="number"
                                placeholder={imgHeight ? `${imgHeight}px` : "Height"}
                                value={customHeight}
                                onChange={(e) => setCustomHeight(e.target.value)}
                                className="w-full py-2 px-3 bg-black/20 border border-white/8 rounded-xl text-white text-[0.85rem] outline-none transition-all duration-150 focus:border-[#6366f1]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTool === "crop" && (
                      <div className="flex flex-col gap-3 bg-white/2 border border-white/6 rounded-2xl p-3">
                        <span className="text-[0.75rem] font-bold text-[#94a3b8] uppercase tracking-wider">
                          Crop Aspect Ratio (Centered)
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Square 1:1", value: "1:1" },
                            { label: "Widescreen 16:9", value: "16:9" },
                            { label: "Classic 4:3", value: "4:3" }
                          ].map((aspect) => (
                            <button
                              key={aspect.value}
                              type="button"
                              onClick={() => setCropAspect(aspect.value)}
                              className={`py-2 px-1 border rounded-xl text-[0.75rem] cursor-pointer text-center transition-all duration-150 ${cropAspect === aspect.value
                                ? "border-[#6366f1] bg-indigo-500/15 text-[#818cf8] font-semibold"
                                : "border-white/8 bg-white/2 text-[#f8fafc] hover:bg-white/4 font-medium"
                                }`}
                            >
                              {aspect.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {converting && (
                      <div className="mb-2">
                        <p className="text-[0.85rem] text-[#64748b] mb-2">
                          Processing... {progress}%
                        </p>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4] transition-all duration-[250ms]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleConvert}
                      disabled={converting || (activeTool === "convert" && !targetFormat)}
                      variant="primary"
                      size="lg"
                      className="w-full justify-center"
                    >
                      {converting ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : activeTool === "convert" ? (
                        targetFormat ? (
                          <>
                            <RefreshCw size={18} />
                            Convert to {target?.label || targetFormat.toUpperCase()}
                          </>
                        ) : (
                          <>
                            <RefreshCw size={18} />
                            Select output format first
                          </>
                        )
                      ) : activeTool === "compress" ? (
                        <>
                          <Minimize2 size={18} />
                          Compress Image ({compressionQuality}%)
                        </>
                      ) : activeTool === "resize" ? (
                        <>
                          <Zap size={18} />
                          Resize Image ({resizeMode === "percent" ? `${resizePercent}%` : `${customWidth || imgWidth || 0}x${customHeight || imgHeight || 0}px`})
                        </>
                      ) : (
                        <>
                          <Crop size={18} />
                          Crop Image ({cropAspect})
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-3.5 flex items-center gap-2.5 p-3 px-4 bg-indigo-500/10 border border-red-500/28 rounded-xl text-red-300 text-[0.875rem]">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
