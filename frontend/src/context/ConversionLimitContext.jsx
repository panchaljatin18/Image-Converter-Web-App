"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { X, Shield, Zap, History, Cloud, Sparkles } from "lucide-react";

const ConversionLimitContext = createContext(null);

export function ConversionLimitProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [guestCount, setGuestCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize and load count from localStorage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem("guest_conversion_count");
    if (savedCount) {
      setGuestCount(parseInt(savedCount, 10));
    }
  }, []);

  // Reset guest count automatically when a user logs in
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem("guest_conversion_count");
      setGuestCount(0);
    }
  }, [isAuthenticated]);

  const checkConversionLimit = () => {
    if (isAuthenticated) return true;

    if (guestCount >= 3) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const incrementConversionCount = () => {
    if (isAuthenticated) return;

    const newCount = guestCount + 1;
    setGuestCount(newCount);
    localStorage.setItem("guest_conversion_count", newCount.toString());
    console.log(`[CONVERSION LIMIT]: Guest conversion incremented. Current count: ${newCount}/3`);
    
    if (newCount >= 3) {
      // Auto open modal after completing the 3rd conversion
      setShowAuthModal(true);
    }
  };

  const handleAction = (tab) => {
    setShowAuthModal(false);
    // Redirect to login page with pre-selected tab
    router.push(`/login?tab=${tab}`);
  };

  return (
    <ConversionLimitContext.Provider value={{ checkConversionLimit, incrementConversionCount, showAuthModal, setShowAuthModal }}>
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
                <Sparkles size={28} className="animate-pulse" />
              </div>

              {/* Title */}
              <h2 className="font-outfit text-xl font-bold tracking-tight text-white sm:text-2xl">
                🚀 Continue Converting for Free
              </h2>

              {/* Description */}
              <p className="mt-3 text-[13px] leading-relaxed text-[#94a3b8]">
                You've used all <span className="font-semibold text-white">3 free guest conversions</span>. Create a free account or sign in to continue converting files and unlock additional features.
              </p>

              {/* Divider */}
              <div className="my-6 h-px w-full bg-[#3e344e]" />

              {/* Benefits */}
              <div className="w-full text-left space-y-3.5 mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[#818cf8]">
                    <Zap size={12} />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#cbd5e1]">Unlimited file conversions</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[#818cf8]">
                    <History size={12} />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#cbd5e1]">Conversion history</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[#818cf8]">
                    <Cloud size={12} />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#cbd5e1]">Cloud storage integration</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[#818cf8]">
                    <Sparkles size={12} />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#cbd5e1]">Faster processing</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[#818cf8]">
                    <Shield size={12} />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#cbd5e1]">Secure file management</span>
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
