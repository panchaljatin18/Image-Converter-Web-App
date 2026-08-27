"use client";

import "./admin.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText, PlusCircle, ArrowLeft, ShieldAlert, Lock, User,
  Loader2, LogOut, ShieldCheck, ChevronLeft, ChevronRight,
  Menu, X,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved !== null) setIsCollapsed(saved === "true");
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  const [username] = useState("Jatin Panchal");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const checkSession = () => {
      const sessionAuth =
        typeof window !== "undefined" &&
        sessionStorage.getItem("cg_admin_session") === "authorized";
      if (sessionAuth && user) {
        setIsAuthorized(true);
      } else {
        document.cookie =
          "cg_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; sameSite=strict;";
        sessionStorage.removeItem("cg_admin_session");
        setIsAuthorized(false);
      }
      setChecking(false);
    };
    checkSession();
  }, [pathname, user, setUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("cg_admin_session", "authorized");
        setIsAuthorized(true);
        if (setUser) {
          setUser({ name: "Jatin Panchal", email: "jmpanchal394@gmail.com", role: "admin" });
        }
      } else {
        setAuthError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setAuthError("Server communication error.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie =
      "cg_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; sameSite=strict;";
    sessionStorage.removeItem("cg_admin_session");
    setIsAuthorized(false);
    setPassword("");
  };

  if (checking) {
    return (
      <div className="admin-body min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#8b5cf6]" size={36} />
        <p className="text-sm text-[#cbd5e1] font-medium font-['Outfit']">
          Verifying security session...
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="admin-body min-h-screen flex items-center justify-center p-4 pt-14">
        <div className="admin-card max-w-md w-full p-6 sm:p-8 space-y-6 relative overflow-hidden border-[#2a2a38] shadow-2xl bg-[#16161f]/90 backdrop-blur-md">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(139,92,246,0.25)]">
              <ShieldCheck size={26} className="text-white" />
            </span>
            <div>
              <h2 className="font-['Outfit'] font-black text-xl sm:text-2xl text-white tracking-tight">
                ConvertGalaxy Admin
              </h2>
              <p className="text-xs text-[#9494a3] mt-1 font-['Outfit'] font-sans font-normal">
                Enter credentials to access the CMS console
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="admin-label flex items-center gap-1.5">
                <User size={13} className="text-[#8b5cf6]" /> Admin Name
              </label>
              <input
                type="text"
                value={username}
                disabled
                readOnly
                className="admin-input opacity-75 cursor-not-allowed border-[#2a2a38] font-semibold text-white select-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="admin-label flex items-center gap-1.5">
                <Lock size={13} className="text-[#8b5cf6]" /> Security Password
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="admin-input"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="admin-btn admin-btn-primary w-full justify-center mt-6 cursor-pointer min-h-[44px]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin animate-duration-1000" size={16} /> Authenticating...
                </>
              ) : (
                "Authorize & Access Dashboard"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-[#9494a3] hover:text-white no-underline transition-colors font-medium"
            >
              <ArrowLeft size={13} /> Back to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isEditor = pathname !== "/admin/blog";

  /* ─── Shared Sidebar Inner Content ─── */
  const SidebarContent = () => (
    <div className="space-y-5 flex-1 flex flex-col justify-between h-full overflow-hidden">
      <div className="space-y-5">
        {/* Profile Header */}
        <div className="flex items-center gap-3 px-1 pt-1 pb-3 border-b border-white/5 overflow-hidden">
          <div className="relative shrink-0">
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8b5cf6] via-[#a855f7] to-[#06b6d4] flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] shrink-0"
              title="Jatin Panchal (CMS Admin)"
            >
              <ShieldCheck size={22} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#141422] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Online" />
          </div>
          <div
            className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${
              isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"
            }`}
          >
            <h2 className="font-['Outfit'] font-extrabold text-sm text-[#f8fafc] leading-tight">
              Jatin Panchal
            </h2>
            <span className="text-[9px] font-bold text-[#c084fc] uppercase tracking-wider bg-[#8b5cf6]/15 px-1.5 py-0.5 rounded border border-[#8b5cf6]/25">
              CMS Admin
            </span>
          </div>
        </div>

        {/* Nav Label */}
        <div className="px-2">
          <span
            className={`text-[10px] font-bold text-[#64647a] uppercase tracking-widest font-mono transition-opacity duration-200 block ${
              isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            }`}
          >
            Menu Navigation
          </span>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1.5 flex flex-col">
          <Link
            href="/admin/blog"
            title={isCollapsed ? "Posts List" : ""}
            className={`group admin-sidebar-item flex items-center gap-3 py-2.5 px-3.5 rounded-xl transition-all font-medium min-h-[44px] ${
              isCollapsed ? "justify-center px-0" : ""
            } ${pathname === "/admin/blog" ? "admin-sidebar-item-active" : ""}`}
          >
            <FileText size={19} className="shrink-0 group-hover:scale-110 transition-transform duration-200" />
            <span
              className={`transition-all duration-300 whitespace-nowrap text-sm overflow-hidden ${
                isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"
              }`}
            >
              Posts List
            </span>
          </Link>

          <Link
            href="/admin/blog/new"
            title={isCollapsed ? "New Post" : ""}
            className={`group admin-sidebar-item flex items-center gap-3 py-2.5 px-3.5 rounded-xl transition-all font-medium min-h-[44px] ${
              isCollapsed ? "justify-center px-0" : ""
            } ${pathname === "/admin/blog/new" ? "admin-sidebar-item-active" : ""}`}
          >
            <PlusCircle size={19} className="shrink-0 group-hover:scale-110 transition-transform duration-200" />
            <span
              className={`transition-all duration-300 whitespace-nowrap text-sm overflow-hidden ${
                isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"
              }`}
            >
              New Post
            </span>
          </Link>

          {/* Collapse Toggle — desktop only */}
          <div className="pt-3 border-t border-white/10 mt-2 hidden md:block">
            <button
              type="button"
              onClick={toggleSidebar}
              className={`w-full group flex items-center gap-3 py-2 px-2.5 rounded-xl bg-[#161626] hover:bg-[#1d1d32] border border-indigo-500/25 hover:border-indigo-500/50 text-indigo-300 hover:text-white shadow-lg shadow-indigo-950/40 transition-all duration-200 cursor-pointer min-h-[44px] ${
                isCollapsed ? "justify-center px-0 bg-transparent border-0 shadow-none" : ""
              }`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 border border-indigo-400/40 flex items-center justify-center shrink-0 text-white shadow-md shadow-indigo-600/40 group-hover:scale-110 group-hover:border-white/50 transition-all duration-200">
                {isCollapsed ? (
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                ) : (
                  <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                )}
              </div>
              <span
                className={`transition-all duration-300 whitespace-nowrap text-xs font-extrabold tracking-wide text-indigo-200 group-hover:text-white overflow-hidden ${
                  isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"
                }`}
              >
                Collapse Sidebar
              </span>
            </button>
          </div>

          {/* Logout — mobile only (shown inside drawer) */}
          <div className="pt-3 border-t border-white/10 mt-2 md:hidden">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full group flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-rose-400 hover:text-white hover:bg-rose-600/20 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer text-sm font-semibold min-h-[44px]"
            >
              <LogOut size={17} className="shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );

  return (
    <div
      className={`admin-body flex flex-col md:flex-row pt-0 ${
        isEditor ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      {/* ── MOBILE Hamburger Trigger (shown when drawer closed) ── */}
      {!isMobileOpen && (
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 rounded-xl bg-[#141424] border border-indigo-500/30 flex items-center justify-center text-indigo-300 hover:text-white shadow-lg shadow-indigo-950/50 cursor-pointer transition-all active:scale-95"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* ── MOBILE Backdrop ── */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ── MOBILE Drawer Sidebar ── */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-full z-50 flex flex-col py-4 px-3 w-72 max-w-[85vw] admin-sidebar transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header with Close */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs font-bold text-[#8b5cf6] uppercase tracking-widest font-mono">
            Admin Panel
          </span>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* ── DESKTOP Sidebar ── */}
      <aside
        className={`hidden md:flex admin-sidebar shrink-0 flex-col justify-between py-4 px-3 transition-all duration-300 ease-in-out sticky top-0 z-20 ${
          isEditor ? "h-screen" : "min-h-screen"
        } ${isCollapsed ? "w-20" : "w-64"} overflow-hidden select-none`}
      >
        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main
        className={`flex-1 bg-[#0f0f1a] min-w-0 ${
          isEditor
            ? "p-0 h-screen overflow-hidden flex flex-col"
            : "p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto"
        }`}
      >
        {/* Mobile top spacing so content doesn't hide behind hamburger */}
        {!isEditor && <div className="md:hidden h-10 mb-2" />}
        {children}
      </main>
    </div>
  );
}
