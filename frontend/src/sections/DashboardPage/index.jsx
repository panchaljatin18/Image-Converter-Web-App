"use client";

import React, { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, RefreshCw, Settings, FileImage, Shield, Clock, HardDrive } from "lucide-react";
import Link from "next/link";

const mockConversions = [
  { id: "conv_1", name: "hero_banner.png", size: "4.2 MB", format: "WEBP", status: "Success", date: "June 11, 2025" },
  { id: "conv_2", name: "profile_avatar.jpg", size: "850 KB", format: "PNG", status: "Success", date: "June 10, 2025" },
  { id: "conv_3", name: "annual_report_draft.png", size: "12.4 MB", format: "PDF", status: "Success", date: "June 08, 2025" },
  { id: "conv_4", name: "product_photo_raw.webp", size: "18.1 MB", format: "JPG", status: "Success", date: "June 04, 2025" },
];

export default function DashboardContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const nameInputRef = useRef(null);
  const [saveNotice, setSaveNotice] = useState("");

  const totalConversions = 42;
  const storageSaved = "184.5 MB";
  const accountTier = "Free Plan";

  useEffect(() => {
    if (typeof window === "undefined" || !nameInputRef.current) {
      return;
    }

    const savedName = window.localStorage.getItem("dashboard-display-name");
    nameInputRef.current.value = savedName || user?.name || "";
  }, [user?.name]);

  const handleSaveSettings = () => {
    const nextName = nameInputRef.current?.value.trim() || user?.name || "";

    if (typeof window !== "undefined") {
      window.localStorage.setItem("dashboard-display-name", nextName);
    }

    setSaveNotice("Settings saved locally in this browser.");
  };

  return (
    <ProtectedRoute>
      {/* RESPONSIVE SCALING ADDED */}
      <div className="min-h-screen bg-slate-50/50 2xl:pt-24 xl:pt-[86px] lg:pt-[76px] md:pt-[67px] sm:pt-[57px] pt-[48px] 2xl:pb-16 xl:pb-[57px] lg:pb-[51px] md:pb-[44px] sm:pb-[38px] pb-[32px]">
        {/* RESPONSIVE SCALING ADDED */}
        <div className="container mx-auto 2xl:px-4 xl:px-[14px] lg:px-[13px] md:px-[11px] sm:px-[10px] px-2 2xl:max-w-6xl xl:max-w-[1036px] lg:max-w-[921px] md:max-w-[806px] sm:max-w-[691px] max-w-[576px]">
          {/* Header Banner */}
          {/* RESPONSIVE SCALING ADDED */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 2xl:rounded-3xl xl:rounded-[22px] lg:rounded-[19px] md:rounded-[17px] sm:rounded-[14px] rounded-[12px] 2xl:p-8 xl:p-[29px] lg:p-[26px] md:p-[22px] sm:p-[19px] p-4 2xl:mb-8 xl:mb-[29px] lg:mb-[26px] md:mb-[22px] sm:mb-[19px] mb-4 relative overflow-hidden shadow-sm">
            {/* RESPONSIVE SCALING ADDED */}
            <div className="absolute top-[-20%] right-[-10%] 2xl:w-80 xl:w-[288px] lg:w-[256px] md:w-[224px] sm:w-[192px] w-[160px] 2xl:h-80 xl:h-[288px] lg:h-[256px] md:h-[224px] sm:h-[192px] h-[160px] bg-indigo-500/10 rounded-full 2xl:blur-[80px] xl:blur-[72px] lg:blur-[64px] md:blur-[56px] sm:blur-[48px] blur-[40px]" />
            {/* RESPONSIVE SCALING ADDED */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center 2xl:gap-6 xl:gap-[22px] lg:gap-[19px] md:gap-[17px] sm:gap-[14px] gap-[12px]">
              <div>
                {/* RESPONSIVE SCALING ADDED */}
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 2xl:px-3 xl:px-[11px] lg:px-[10px] md:px-[8px] sm:px-[7px] px-1.5 2xl:py-1 xl:py-[3.5px] lg:py-[3px] md:py-[2.5px] sm:py-[2px] py-[2px] rounded-full 2xl:text-xs xl:text-xs lg:text-xs md:text-[11px] sm:text-[10px] text-[9px] font-semibold uppercase 2xl:tracking-wider xl:tracking-[0.045em] lg:tracking-[0.04em] md:tracking-[0.035em] sm:tracking-[0.03em] tracking-[0.025em]">
                  {accountTier}
                </span>
                {/* RESPONSIVE SCALING ADDED */}
                <h1 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg sm:text-base text-sm font-extrabold 2xl:tracking-tight xl:tracking-tight lg:tracking-normal md:tracking-normal sm:tracking-normal tracking-normal 2xl:mt-3 xl:mt-[11px] lg:mt-[10px] md:mt-[8px] sm:mt-[7px] mt-1.5">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.name || "User"}</span>!
                </h1>
                {/* RESPONSIVE SCALING ADDED */}
                <p className="text-slate-400 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] 2xl:mt-1 xl:mt-[3.5px] lg:mt-[3px] md:mt-[2.5px] sm:mt-[2px] mt-[2px]">
                  Manage your converters, download history, and workspace settings.
                </p>
              </div>
              {/* RESPONSIVE SCALING ADDED */}
              <button
                onClick={logout}
                className="bg-white/10 hover:bg-white/15 border border-white/10 text-white 2xl:px-5 xl:px-[18px] lg:px-[16px] md:px-[14px] sm:px-[12px] px-[10px] 2xl:py-2.5 xl:py-[9px] lg:py-[8px] md:py-[7px] sm:py-[6px] py-[5px] 2xl:rounded-xl xl:rounded-[14px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[10px] rounded-[8px] font-semibold 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] transition flex items-center 2xl:gap-2 xl:gap-[7px] lg:gap-[6px] md:gap-[5px] sm:gap-[5px] gap-1 cursor-pointer"
              >
                <LogOut className="2xl:w-4 xl:w-[14px] lg:w-[13px] md:w-[11px] sm:w-[10px] w-2 2xl:h-4 xl:h-[14px] lg:h-[13px] md:h-[11px] sm:h-[10px] h-2" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          {/* RESPONSIVE SCALING ADDED */}
          <div className="grid grid-cols-1 sm:grid-cols-3 2xl:gap-6 xl:gap-[22px] lg:gap-[19px] md:gap-[17px] sm:gap-[14px] gap-[12px] 2xl:mb-8 xl:mb-[29px] lg:mb-[26px] md:mb-[22px] sm:mb-[19px] mb-4">
            {/* RESPONSIVE SCALING ADDED */}
            <div className="bg-white border border-slate-200/60 2xl:p-6 xl:p-[22px] lg:p-[19px] md:p-[17px] sm:p-[14px] p-3 2xl:rounded-2xl xl:rounded-[18px] lg:rounded-[16px] md:rounded-[14px] sm:rounded-[12px] rounded-[10px] flex items-center 2xl:gap-5 xl:gap-[18px] lg:gap-[16px] md:gap-[14px] sm:gap-[12px] gap-[10px] shadow-sm">
              {/* RESPONSIVE SCALING ADDED */}
              <div className="2xl:w-12 xl:w-[43px] lg:w-[38px] md:w-[34px] sm:w-[29px] w-[24px] 2xl:h-12 xl:h-[43px] lg:h-[38px] md:h-[34px] sm:h-[29px] h-[24px] 2xl:rounded-xl xl:rounded-[14px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[10px] rounded-[8px] bg-indigo-50 flex items-center justify-center text-indigo-600">
                <RefreshCw className="animate-spin-slow 2xl:w-[22px] xl:w-[20px] lg:w-[18px] md:w-[15px] sm:w-[13px] w-[11px] 2xl:h-[22px] xl:h-[20px] lg:h-[18px] md:h-[15px] sm:h-[13px] h-[11px]" />
              </div>
              <div>
                {/* RESPONSIVE SCALING ADDED */}
                <p className="2xl:text-xs xl:text-xs lg:text-xs md:text-[11px] sm:text-[10px] text-[9px] font-semibold text-slate-500 uppercase 2xl:tracking-wider xl:tracking-[0.045em] lg:tracking-[0.04em] md:tracking-[0.035em] sm:tracking-[0.03em] tracking-[0.025em]">Total Conversions</p>
                {/* RESPONSIVE SCALING ADDED */}
                <h3 className="2xl:text-2xl xl:text-xl lg:text-lg md:text-base sm:text-sm text-xs font-bold text-slate-800 2xl:mt-1 xl:mt-[3.5px] lg:mt-[3px] md:mt-[2.5px] sm:mt-[2px] mt-[2px]">{totalConversions}</h3>
              </div>
            </div>

            {/* RESPONSIVE SCALING ADDED */}
            <div className="bg-white border border-slate-200/60 2xl:p-6 xl:p-[22px] lg:p-[19px] md:p-[17px] sm:p-[14px] p-3 2xl:rounded-2xl xl:rounded-[18px] lg:rounded-[16px] md:rounded-[14px] sm:rounded-[12px] rounded-[10px] flex items-center 2xl:gap-5 xl:gap-[18px] lg:gap-[16px] md:gap-[14px] sm:gap-[12px] gap-[10px] shadow-sm">
              {/* RESPONSIVE SCALING ADDED */}
              <div className="2xl:w-12 xl:w-[43px] lg:w-[38px] md:w-[34px] sm:w-[29px] w-[24px] 2xl:h-12 xl:h-[43px] lg:h-[38px] md:h-[34px] sm:h-[29px] h-[24px] 2xl:rounded-xl xl:rounded-[14px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[10px] rounded-[8px] bg-emerald-50 flex items-center justify-center text-emerald-600">
                <HardDrive className="2xl:w-[22px] xl:w-[20px] lg:w-[18px] md:w-[15px] sm:w-[13px] w-[11px] 2xl:h-[22px] xl:h-[20px] lg:h-[18px] md:h-[15px] sm:h-[13px] h-[11px]" />
              </div>
              <div>
                {/* RESPONSIVE SCALING ADDED */}
                <p className="2xl:text-xs xl:text-xs lg:text-xs md:text-[11px] sm:text-[10px] text-[9px] font-semibold text-slate-500 uppercase 2xl:tracking-wider xl:tracking-[0.045em] lg:tracking-[0.04em] md:tracking-[0.035em] sm:tracking-[0.03em] tracking-[0.025em]">Storage Saved</p>
                {/* RESPONSIVE SCALING ADDED */}
                <h3 className="2xl:text-2xl xl:text-xl lg:text-lg md:text-base sm:text-sm text-xs font-bold text-slate-800 2xl:mt-1 xl:mt-[3.5px] lg:mt-[3px] md:mt-[2.5px] sm:mt-[2px] mt-[2px]">{storageSaved}</h3>
              </div>
            </div>

            {/* RESPONSIVE SCALING ADDED */}
            <div className="bg-white border border-slate-200/60 2xl:p-6 xl:p-[22px] lg:p-[19px] md:p-[17px] sm:p-[14px] p-3 2xl:rounded-2xl xl:rounded-[18px] lg:rounded-[16px] md:rounded-[14px] sm:rounded-[12px] rounded-[10px] flex items-center 2xl:gap-5 xl:gap-[18px] lg:gap-[16px] md:gap-[14px] sm:gap-[12px] gap-[10px] shadow-sm">
              {/* RESPONSIVE SCALING ADDED */}
              <div className="2xl:w-12 xl:w-[43px] lg:w-[38px] md:w-[34px] sm:w-[29px] w-[24px] 2xl:h-12 xl:h-[43px] lg:h-[38px] md:h-[34px] sm:h-[29px] h-[24px] 2xl:rounded-xl xl:rounded-[14px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[10px] rounded-[8px] bg-purple-50 flex items-center justify-center text-purple-600">
                <Shield className="2xl:w-[22px] xl:w-[20px] lg:w-[18px] md:w-[15px] sm:w-[13px] w-[11px] 2xl:h-[22px] xl:h-[20px] lg:h-[18px] md:h-[15px] sm:h-[13px] h-[11px]" />
              </div>
              <div>
                {/* RESPONSIVE SCALING ADDED */}
                <p className="2xl:text-xs xl:text-xs lg:text-xs md:text-[11px] sm:text-[10px] text-[9px] font-semibold text-slate-500 uppercase 2xl:tracking-wider xl:tracking-[0.045em] lg:tracking-[0.04em] md:tracking-[0.035em] sm:tracking-[0.03em] tracking-[0.025em]">Security Tier</p>
                {/* RESPONSIVE SCALING ADDED */}
                <h3 className="2xl:text-2xl xl:text-xl lg:text-lg md:text-base sm:text-sm text-xs font-bold text-slate-800 2xl:mt-1 xl:mt-[3.5px] lg:mt-[3px] md:mt-[2.5px] sm:mt-[2px] mt-[2px]">Local Browser</h3>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          {/* RESPONSIVE SCALING ADDED */}
          <div className="grid grid-cols-1 lg:grid-cols-12 2xl:gap-8 xl:gap-[29px] lg:gap-[26px] md:gap-[22px] sm:gap-[19px] gap-4 items-start">
            {/* Sidebar Navigation */}
            {/* RESPONSIVE SCALING ADDED */}
            <div className="lg:col-span-3 bg-white border border-slate-200/60 2xl:rounded-2xl xl:rounded-[18px] lg:rounded-[16px] md:rounded-[14px] sm:rounded-[12px] rounded-[10px] 2xl:p-4 xl:p-[14px] lg:p-[13px] md:p-[11px] sm:p-[10px] p-2 shadow-sm 2xl:space-y-1 xl:space-y-[3.5px] lg:space-y-[3px] md:space-y-[2.5px] sm:space-y-[2px] space-y-[2px]">
              {/* RESPONSIVE SCALING ADDED */}
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center 2xl:gap-3 xl:gap-[11px] lg:gap-[10px] md:gap-[8px] sm:gap-[7px] gap-1.5 2xl:px-4 xl:px-[14px] lg:px-[13px] md:px-[11px] sm:px-[10px] px-2 2xl:py-3 xl:py-[11px] lg:py-[10px] md:py-[8px] sm:py-[7px] py-1.5 2xl:rounded-xl xl:rounded-[14px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[10px] rounded-[8px] 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] font-semibold transition cursor-pointer text-left ${
                  activeTab === "overview" ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <User className="2xl:w-[18px] xl:w-[16px] lg:w-[14px] md:w-[13px] sm:w-[11px] w-[9px] 2xl:h-[18px] xl:h-[16px] lg:h-[14px] md:h-[13px] sm:h-[11px] h-[9px]" />
                Overview
              </button>
              {/* RESPONSIVE SCALING ADDED */}
              <button
                onClick={() => setActiveTab("history")}
                className={`w-full flex items-center 2xl:gap-3 xl:gap-[11px] lg:gap-[10px] md:gap-[8px] sm:gap-[7px] gap-1.5 2xl:px-4 xl:px-[14px] lg:px-[13px] md:px-[11px] sm:px-[10px] px-2 2xl:py-3 xl:py-[11px] lg:py-[10px] md:py-[8px] sm:py-[7px] py-1.5 2xl:rounded-xl xl:rounded-[14px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[10px] rounded-[8px] 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] font-semibold transition cursor-pointer text-left ${
                  activeTab === "history" ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Clock className="2xl:w-[18px] xl:w-[16px] lg:w-[14px] md:w-[13px] sm:w-[11px] w-[9px] 2xl:h-[18px] xl:h-[16px] lg:h-[14px] md:h-[13px] sm:h-[11px] h-[9px]" />
                Conversion History
              </button>
              {/* RESPONSIVE SCALING ADDED */}
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center 2xl:gap-3 xl:gap-[11px] lg:gap-[10px] md:gap-[8px] sm:gap-[7px] gap-1.5 2xl:px-4 xl:px-[14px] lg:px-[13px] md:px-[11px] sm:px-[10px] px-2 2xl:py-3 xl:py-[11px] lg:py-[10px] md:py-[8px] sm:py-[7px] py-1.5 2xl:rounded-xl xl:rounded-[14px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[10px] rounded-[8px] 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] font-semibold transition cursor-pointer text-left ${
                  activeTab === "settings" ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Settings className="2xl:w-[18px] xl:w-[16px] lg:w-[14px] md:w-[13px] sm:w-[11px] w-[9px] 2xl:h-[18px] xl:h-[16px] lg:h-[14px] md:h-[13px] sm:h-[11px] h-[9px]" />
                Account Settings
              </button>
            </div>

            {/* Dashboard Content Window */}
            {/* RESPONSIVE SCALING ADDED */}
            <div className="lg:col-span-9 bg-white border border-slate-200/60 2xl:rounded-2xl xl:rounded-[18px] lg:rounded-[16px] md:rounded-[14px] sm:rounded-[12px] rounded-[10px] 2xl:p-8 xl:p-[29px] lg:p-[26px] md:p-[22px] sm:p-[19px] p-4 shadow-sm">
              {/* Tab: Overview */}
              {activeTab === "overview" && (
                <div className="2xl:space-y-8 xl:space-y-[29px] lg:space-y-[26px] md:space-y-[22px] sm:space-y-[19px] space-y-4">
                  <div>
                    {/* RESPONSIVE SCALING ADDED */}
                    <h2 className="2xl:text-xl xl:text-lg lg:text-base md:text-sm sm:text-xs text-xs font-bold text-slate-900">Account Overview</h2>
                    {/* RESPONSIVE SCALING ADDED */}
                    <p className="text-slate-500 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] 2xl:mt-1 xl:mt-[3.5px] lg:mt-[3px] md:mt-[2.5px] sm:mt-[2px] mt-[2px]">Review your security status and current user credentials.</p>
                  </div>

                  {/* Profile Card */}
                  {/* RESPONSIVE SCALING ADDED */}
                  <div className="bg-slate-50 border border-slate-200/60 2xl:rounded-2xl xl:rounded-[18px] lg:rounded-[16px] md:rounded-[14px] sm:rounded-[12px] rounded-[10px] 2xl:p-6 xl:p-[22px] lg:p-[19px] md:p-[17px] sm:p-[14px] p-3 flex flex-col sm:flex-row items-center sm:items-start 2xl:gap-6 xl:gap-[22px] lg:gap-[19px] md:gap-[17px] sm:gap-[14px] gap-[12px]">
                    {/* RESPONSIVE SCALING ADDED */}
                    <div className="2xl:w-16 xl:w-[58px] lg:w-[51px] md:w-[45px] sm:w-[38px] w-[32px] 2xl:h-16 xl:h-[58px] lg:h-[51px] md:h-[45px] sm:h-[38px] h-[32px] rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold 2xl:text-2xl xl:text-xl lg:text-lg md:text-base sm:text-sm text-xs uppercase shadow-sm">
                      {user?.name ? user.name[0] : "U"}
                    </div>
                    {/* RESPONSIVE SCALING ADDED */}
                    <div className="2xl:space-y-4 xl:space-y-3.5 lg:space-y-3 md:space-y-2.5 sm:space-y-2 space-y-2 flex-1 text-center sm:text-left">
                      <div>
                        {/* RESPONSIVE SCALING ADDED */}
                        <h4 className="font-bold text-slate-800 2xl:text-lg xl:text-base lg:text-sm md:text-xs sm:text-xs text-[11px]">{user?.name || "User"}</h4>
                        {/* RESPONSIVE SCALING ADDED */}
                        <p className="text-slate-500 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px]">{user?.email || "user@example.com"}</p>
                      </div>
                      {/* RESPONSIVE SCALING ADDED */}
                      <div className="inline-flex items-center 2xl:gap-2 xl:gap-[7px] lg:gap-[6px] md:gap-[5px] sm:gap-[5px] gap-1 bg-indigo-100/40 text-indigo-700 2xl:px-3 xl:px-[11px] lg:px-[10px] md:px-[8px] sm:px-[7px] px-1.5 2xl:py-1 xl:py-[3.5px] lg:py-[3px] md:py-[2.5px] sm:py-[2px] py-[2px] rounded-full 2xl:text-xs xl:text-xs lg:text-xs md:text-[11px] sm:text-[10px] text-[9px] font-semibold">
                        🔒 Authenticated via JWT Session
                      </div>
                    </div>
                  </div>

                  {/* Conversion Promo */}
                  {/* RESPONSIVE SCALING ADDED */}
                  <div className="border border-indigo-100 bg-indigo-50/20 2xl:p-6 xl:p-[22px] lg:p-[19px] md:p-[17px] sm:p-[14px] p-3 2xl:rounded-2xl xl:rounded-[18px] lg:rounded-[16px] md:rounded-[14px] sm:rounded-[12px] rounded-[10px] flex flex-col sm:flex-row justify-between items-center 2xl:gap-4 xl:gap-3.5 lg:gap-3 md:gap-2.5 sm:gap-2 gap-2">
                    {/* RESPONSIVE SCALING ADDED */}
                    <div className="2xl:space-y-1 xl:space-y-[3.5px] lg:space-y-[3px] md:space-y-[2.5px] sm:space-y-[2px] space-y-[2px]">
                      {/* RESPONSIVE SCALING ADDED */}
                      <h4 className="font-bold text-slate-800 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px]">Need to process more images?</h4>
                      {/* RESPONSIVE SCALING ADDED */}
                      <p className="2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] text-slate-500">Jump right back into any of our lightning fast converters.</p>
                    </div>
                    {/* RESPONSIVE SCALING ADDED */}
                    <Link href="/tools" className="btn btn-primary whitespace-nowrap 2xl:px-5 xl:px-[18px] lg:px-[16px] md:px-[14px] sm:px-[12px] px-[10px] 2xl:py-2.5 xl:py-[9px] lg:py-[8px] md:py-[7px] sm:py-[6px] py-[5px] 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px]">
                      Open Converter Tools
                    </Link>
                  </div>
                </div>
              )}

              {/* Tab: History */}
              {activeTab === "history" && (
                <div className="2xl:space-y-6 xl:space-y-5 lg:space-y-5 md:space-y-4 sm:space-y-3 space-y-2">
                  <div>
                    {/* RESPONSIVE SCALING ADDED */}
                    <h2 className="2xl:text-xl xl:text-lg lg:text-base md:text-sm sm:text-xs text-xs font-bold text-slate-900">Conversion History</h2>
                    {/* RESPONSIVE SCALING ADDED */}
                    <p className="text-slate-500 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] 2xl:mt-1 xl:mt-[3.5px] lg:mt-[3px] md:mt-[2.5px] sm:mt-[2px] mt-[2px]">A log of your converted and processed images (stored locally in browser).</p>
                  </div>

                  {/* History Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        {/* RESPONSIVE SCALING ADDED */}
                        <tr className="border-b border-slate-100 2xl:text-xs xl:text-xs lg:text-xs md:text-[11px] sm:text-[10px] text-[9px] font-bold text-slate-400 uppercase 2xl:tracking-wider xl:tracking-[0.045em] lg:tracking-[0.04em] md:tracking-[0.035em] sm:tracking-[0.03em] tracking-[0.025em]">
                          {/* RESPONSIVE SCALING ADDED */}
                          <th className="2xl:pb-3 xl:pb-[11px] lg:pb-[10px] md:pb-[8px] sm:pb-[7px] pb-1.5 2xl:pr-4 xl:pr-[14px] lg:pr-[13px] md:pr-[11px] sm:pr-[10px] pr-2">File Name</th>
                          {/* RESPONSIVE SCALING ADDED */}
                          <th className="2xl:pb-3 xl:pb-[11px] lg:pb-[10px] md:pb-[8px] sm:pb-[7px] pb-1.5 2xl:pr-4 xl:pr-[14px] lg:pr-[13px] md:pr-[11px] sm:pr-[10px] pr-2">Size</th>
                          {/* RESPONSIVE SCALING ADDED */}
                          <th className="2xl:pb-3 xl:pb-[11px] lg:pb-[10px] md:pb-[8px] sm:pb-[7px] pb-1.5 2xl:pr-4 xl:pr-[14px] lg:pr-[13px] md:pr-[11px] sm:pr-[10px] pr-2">Output Format</th>
                          {/* RESPONSIVE SCALING ADDED */}
                          <th className="2xl:pb-3 xl:pb-[11px] lg:pb-[10px] md:pb-[8px] sm:pb-[7px] pb-1.5 2xl:pr-4 xl:pr-[14px] lg:pr-[13px] md:pr-[11px] sm:pr-[10px] pr-2">Date</th>
                          {/* RESPONSIVE SCALING ADDED */}
                          <th className="2xl:pb-3 xl:pb-[11px] lg:pb-[10px] md:pb-[8px] sm:pb-[7px] pb-1.5 text-right">Status</th>
                        </tr>
                      </thead>
                      {/* RESPONSIVE SCALING ADDED */}
                      <tbody className="2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] divide-y divide-slate-100">
                        {mockConversions.map((conv) => (
                          <tr key={conv.id} className="text-slate-700">
                            {/* RESPONSIVE SCALING ADDED */}
                            <td className="2xl:py-4 xl:py-[14px] lg:py-[13px] md:py-[11px] sm:py-[10px] py-2 2xl:pr-4 xl:pr-[14px] lg:pr-[13px] md:pr-[11px] sm:pr-[10px] pr-2 font-semibold text-slate-800 flex items-center 2xl:gap-2 xl:gap-[7px] lg:gap-[6px] md:gap-[5px] sm:gap-[5px] gap-1">
                              <FileImage className="2xl:w-4 xl:w-[14px] lg:w-[13px] md:w-[11px] sm:w-[10px] w-2 2xl:h-4 xl:h-[14px] lg:h-[13px] md:h-[11px] sm:h-[10px] h-2 text-indigo-500" />
                              {conv.name}
                            </td>
                            {/* RESPONSIVE SCALING ADDED */}
                            <td className="2xl:py-4 xl:py-[14px] lg:py-[13px] md:py-[11px] sm:py-[10px] py-2 2xl:pr-4 xl:pr-[14px] lg:pr-[13px] md:pr-[11px] sm:pr-[10px] pr-2 text-slate-500">{conv.size}</td>
                            {/* RESPONSIVE SCALING ADDED */}
                            <td className="2xl:py-4 xl:py-[14px] lg:py-[13px] md:py-[11px] sm:py-[10px] py-2 2xl:pr-4 xl:pr-[14px] lg:pr-[13px] md:pr-[11px] sm:pr-[10px] pr-2">
                              {/* RESPONSIVE SCALING ADDED */}
                              <span className="bg-slate-100 text-slate-700 2xl:px-2 xl:px-[7px] lg:px-[6px] md:px-[5px] sm:px-[5px] px-1 2xl:py-0.5 xl:py-[1.8px] lg:py-[1.6px] md:py-[1.4px] sm:py-[1.2px] py-[1px] 2xl:rounded xl:rounded-[3.5px] lg:rounded-[3px] md:rounded-[2.5px] sm:rounded-[2px] rounded-[2px] 2xl:text-xs xl:text-xs lg:text-xs md:text-[11px] sm:text-[10px] text-[9px] font-semibold">
                                {conv.format}
                              </span>
                            </td>
                            {/* RESPONSIVE SCALING ADDED */}
                            <td className="2xl:py-4 xl:py-[14px] lg:py-[13px] md:py-[11px] sm:py-[10px] py-2 2xl:pr-4 xl:pr-[14px] lg:pr-[13px] md:pr-[11px] sm:pr-[10px] pr-2 text-slate-500">{conv.date}</td>
                            {/* RESPONSIVE SCALING ADDED */}
                            <td className="2xl:py-4 xl:py-[14px] lg:py-[13px] md:py-[11px] sm:py-[10px] py-2 text-right">
                              {/* RESPONSIVE SCALING ADDED */}
                              <span className="bg-emerald-100 text-emerald-800 2xl:px-2 xl:px-[7px] lg:px-[6px] md:px-[5px] sm:px-[5px] px-1 2xl:py-0.5 xl:py-[1.8px] lg:py-[1.6px] md:py-[1.4px] sm:py-[1.2px] py-[1px] 2xl:rounded xl:rounded-[3.5px] lg:rounded-[3px] md:rounded-[2.5px] sm:rounded-[2px] rounded-[2px] 2xl:text-xs xl:text-xs lg:text-xs md:text-[11px] sm:text-[10px] text-[9px] font-bold">
                                {conv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab: Settings */}
              {activeTab === "settings" && (
                <div className="2xl:space-y-6 xl:space-y-5 lg:space-y-5 md:space-y-4 sm:space-y-3 space-y-2">
                  <div>
                    {/* RESPONSIVE SCALING ADDED */}
                    <h2 className="2xl:text-xl xl:text-lg lg:text-base md:text-sm sm:text-xs text-xs font-bold text-slate-900">Account Settings</h2>
                    {/* RESPONSIVE SCALING ADDED */}
                    <p className="text-slate-500 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] 2xl:mt-1 xl:mt-[3.5px] lg:mt-[3px] md:mt-[2.5px] sm:mt-[2px] mt-[2px]">Configure your login preferences and profile metadata.</p>
                  </div>

                  {/* Dummy settings inputs */}
                  {/* RESPONSIVE SCALING ADDED */}
                  <div className="2xl:space-y-4 xl:space-y-3.5 lg:space-y-3 md:space-y-2.5 sm:space-y-2 space-y-2 2xl:max-w-md xl:max-w-[403px] lg:max-w-[358px] md:max-w-[313px] sm:max-w-[268px] max-w-[224px]">
                    {/* RESPONSIVE SCALING ADDED */}
                    <div className="2xl:space-y-2 xl:space-y-2 lg:space-y-1.5 md:space-y-1.5 sm:space-y-1 space-y-1">
                      {/* RESPONSIVE SCALING ADDED */}
                      <label className="2xl:text-xs xl:text-xs lg:text-xs md:text-[11px] sm:text-[10px] text-[9px] font-semibold uppercase 2xl:tracking-wider xl:tracking-[0.045em] lg:tracking-[0.04em] md:tracking-[0.035em] sm:tracking-[0.03em] tracking-[0.025em] text-slate-500 block">Display name</label>
                      <input
                        ref={nameInputRef}
                        type="text"
                        defaultValue={user?.name || ""}
                        className="w-full 2xl:px-4 xl:px-[14px] lg:px-[13px] md:px-[11px] sm:px-[10px] px-2 2xl:py-2.5 xl:py-[9px] lg:py-[8px] md:py-[7px] sm:py-[6px] py-[5px] border border-slate-200 2xl:rounded-xl xl:rounded-[14px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[10px] rounded-[8px] 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition outline-none"
                      />
                    </div>

                    {/* RESPONSIVE SCALING ADDED */}
                    <div className="2xl:space-y-2 xl:space-y-2 lg:space-y-1.5 md:space-y-1.5 sm:space-y-1 space-y-1">
                      {/* RESPONSIVE SCALING ADDED */}
                      <label className="2xl:text-xs xl:text-xs lg:text-xs md:text-[11px] sm:text-[10px] text-[9px] font-semibold uppercase 2xl:tracking-wider xl:tracking-[0.045em] lg:tracking-[0.04em] md:tracking-[0.035em] sm:tracking-[0.03em] tracking-[0.025em] text-slate-500 block">Email Address</label>
                      <input
                        type="email"
                        disabled
                        defaultValue={user?.email || ""}
                        className="w-full 2xl:px-4 xl:px-[14px] lg:px-[13px] md:px-[11px] sm:px-[10px] px-2 2xl:py-2.5 xl:py-[9px] lg:py-[8px] md:py-[7px] sm:py-[6px] py-[5px] border border-slate-200 bg-slate-50 text-slate-400 2xl:rounded-xl xl:rounded-[14px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[10px] rounded-[8px] 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] outline-none cursor-not-allowed"
                      />
                      {/* RESPONSIVE SCALING ADDED */}
                      <p className="2xl:text-[10px] xl:text-[9px] lg:text-[8px] md:text-[7px] sm:text-[6px] text-[5px] text-slate-400">Email addresses cannot be changed directly.</p>
                    </div>

                    {/* RESPONSIVE SCALING ADDED */}
                    <button
                      onClick={handleSaveSettings}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white 2xl:px-5 xl:px-[18px] lg:px-[16px] md:px-[14px] sm:px-[12px] px-[10px] 2xl:py-2.5 xl:py-[9px] lg:py-[8px] md:py-[7px] sm:py-[6px] py-[5px] 2xl:rounded-xl xl:rounded-[14px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[10px] rounded-[8px] font-semibold 2xl:text-sm xl:text-sm lg:text-xs md:text-xs sm:text-[11px] text-[10px] transition shadow-sm hover:shadow cursor-pointer 2xl:mt-4 xl:mt-3.5 lg:mt-3 md:mt-2.5 sm:mt-2 mt-2"
                    >
                      Save Settings
                    </button>
                    {saveNotice && (
                      <p className="text-emerald-600 2xl:text-[10px] xl:text-[9px] lg:text-[8px] md:text-[7px] sm:text-[6px] text-[9px] font-medium">
                        {saveNotice}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
