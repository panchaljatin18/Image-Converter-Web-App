"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { X, Shield, Zap, History, Cloud, Sparkles, Clock } from "lucide-react";

const ConversionLimitContext = createContext(null);

const MAX_GUEST_CONVERSIONS_PER_24H = 6;
const WINDOW_24H_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const STORAGE_KEY = "guest_conversion_timestamps_v2";

export function ConversionLimitProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [conversionTimestamps, setConversionTimestamps] = useState([]);

  // Read valid timestamps (newer than 24 hours) from localStorage
  const getActiveTimestamps = useCallback(() => {
    if (typeof window === "undefined") return [];
    try {
      // Clean legacy storage key if present
      localStorage.removeItem("guest_conversion_count");

      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) return [];
      const parsed = JSON.parse(rawData);
      if (!Array.isArray(parsed)) return [];
      const now = Date.now();
      // Keep only timestamps from the last 24 hours
      return parsed.filter((t) => typeof t === "number" && now - t < WINDOW_24H_MS);
    } catch (err) {
      console.error("Error reading guest conversion timestamps:", err);
      return [];
    }
  }, []);

  // Sync state on mount and when localStorage changes across browser tabs
  useEffect(() => {
    if (isAuthenticated) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("guest_conversion_count");
      } catch {}
      setConversionTimestamps([]);
      return;
    }

    const syncTimestamps = () => {
      const active = getActiveTimestamps();
      setConversionTimestamps(active);
    };

    syncTimestamps();

    // Multi-tab synchronization listener
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY || e.key === "guest_conversion_count") {
        syncTimestamps();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isAuthenticated, getActiveTimestamps]);

  // Check if guest user can perform conversion
  const checkConversionLimit = useCallback(
    (requiredSlots = 1) => {
      // Logged-in users get UNLIMITED conversions across all tabs!
      if (isAuthenticated) return true;

      const active = getActiveTimestamps();
      if (active.length + requiredSlots > MAX_GUEST_CONVERSIONS_PER_24H) {
        setShowAuthModal(true);
        return false;
      }
      return true;
    },
    [isAuthenticated, getActiveTimestamps]
  );

  // Increment conversion count by adding current timestamp(s)
  const incrementConversionCount = useCallback(
    (count = 1) => {
      // Logged-in users are not restricted
      if (isAuthenticated) return;

      const active = getActiveTimestamps();
      const now = Date.now();
      const newTimestamps = [...active];
      for (let i = 0; i < count; i++) {
        newTimestamps.push(now);
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTimestamps));
      } catch (e) {
        console.error("Failed to save guest conversion timestamps:", e);
      }

      setConversionTimestamps(newTimestamps);
      console.log(
        `[CONVERSION LIMIT]: Guest conversion recorded (+${count}). Active 24h count: ${newTimestamps.length}/${MAX_GUEST_CONVERSIONS_PER_24H}`
      );

      if (newTimestamps.length >= MAX_GUEST_CONVERSIONS_PER_24H) {
        setShowAuthModal(true);
      }
    },
    [isAuthenticated, getActiveTimestamps]
  );

  const handleAction = (tab) => {
    setShowAuthModal(false);
    router.push(`/login?tab=${tab}`);
  };

  return (
    <ConversionLimitContext.Provider
      value={{
        checkConversionLimit,
        incrementConversionCount,
        showAuthModal,
        setShowAuthModal,
        activeGuestConversions: conversionTimestamps.length,
        maxGuestConversions: MAX_GUEST_CONVERSIONS_PER_24H,
      }}
    >
      {children}

      {/* Premium Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#06060c]/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowAuthModal(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-[480px] overflow-hidden rounded-[20px] border border-[#3e344e] bg-[#1a1424] p-6 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] transition-all duration-300 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Background Glow */}
            <div className="absolute -left-16 -top-16 -z-10 h-40 w-40 rounded-full bg-[#6366f1]/15 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 -z-10 h-40 w-40 rounded-full bg-[#a855f7]/10 blur-3xl" />

            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[#94a3b8] transition hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              {/* Animated Icon */}
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-[#818cf8] ring-4 ring-indigo-500/5">
                <Zap size={28} className="animate-pulse" />
              </div>

              {/* Title */}
              <h2 className="font-outfit text-xl font-bold tracking-tight text-white sm:text-2xl">
                🚀 Free 24-Hour Limit Reached
              </h2>

              {/* Description */}
              <p className="mt-3 text-[13px] leading-relaxed text-[#94a3b8]">
                You've used all <span className="font-semibold text-white">6 free guest conversions</span> for the last 24 hours. Create a free account or sign in to enjoy <span className="font-semibold text-white">unlimited conversions</span> across all your tabs!
              </p>

              {/* Divider */}
              <div className="my-6 h-px w-full bg-[#3e344e]" />

              {/* Benefits */}
              <div className="w-full text-left space-y-3.5 mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[#818cf8]">
                    <Zap size={12} />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#cbd5e1]">
                    Unlimited image, PDF & file conversions
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[#818cf8]">
                    <Clock size={12} />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#cbd5e1]">
                    No 24-hour conversion limits after login
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[#818cf8]">
                    <History size={12} />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#cbd5e1]">
                    Conversion history tracking
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[#818cf8]">
                    <Cloud size={12} />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#cbd5e1]">
                    Cloud storage integration (Drive/Dropbox/OneDrive)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[#818cf8]">
                    <Shield size={12} />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#cbd5e1]">
                    Multi-tab support & fast processing
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full flex-col gap-3">
                <button
                  onClick={() => handleAction("register")}
                  className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-[13px] font-semibold text-white shadow-lg transition duration-200 hover:brightness-110 active:scale-[0.98]"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => handleAction("login")}
                  className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-[#3e344e] bg-white/5 text-[13px] font-semibold text-[#cbd5e1] transition duration-200 hover:bg-white/10 active:scale-[0.98]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="mt-1 text-[12px] font-medium text-[#64748b] hover:text-[#94a3b8] transition cursor-pointer"
                >
                  Cancel / Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConversionLimitContext.Provider>
  );
}

export function useConversionLimit() {
  const context = useContext(ConversionLimitContext);
  if (!context) {
    throw new Error("useConversionLimit must be used within a ConversionLimitProvider");
  }
  return context;
}
