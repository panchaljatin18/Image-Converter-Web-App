"use client";

import "./admin.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, PlusCircle, ArrowLeft, ShieldAlert, Lock, User, Loader2, LogOut, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved !== null) setIsCollapsed(saved === "true");
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  // Fixed username state
  const [username] = useState("Jatin Panchal");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const checkSession = () => {
      // Enforce tab-based session authorization for every admin link access
      const sessionAuth = typeof window !== "undefined" && sessionStorage.getItem("cg_admin_session") === "authorized";

      if (sessionAuth && user) {
        setIsAuthorized(true);
      } else {
        document.cookie = "cg_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; sameSite=strict;";
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
    document.cookie = "cg_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; sameSite=strict;";
    sessionStorage.removeItem("cg_admin_session");
    setIsAuthorized(false);
    setPassword("");
  };

  if (checking) {
    return (
      <div className="admin-body min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#8b5cf6]" size={36} />
        <p className="text-sm text-[#cbd5e1] font-medium font-['Outfit']">Verifying security session...</p>
      </div>
    );
  }

  // RENDER DEDICATED ADMIN LOGIN SCREEN IF NOT AUTHORIZED
  if (!isAuthorized) {
    return (
      <div className="admin-body min-h-screen flex items-center justify-center p-4 pt-14">
        <div className="admin-card max-w-md w-full p-8 space-y-6 relative overflow-hidden border-[#2a2a38] shadow-2xl bg-[#16161f]/90 backdrop-blur-md">
          {/* Top glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Logo Brand */}
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(139,92,246,0.25)]">
              <ShieldCheck size={26} className="text-white" />
            </span>
            <div>
              <h2 className="font-['Outfit'] font-black text-2xl text-white tracking-tight">ConvertGalaxy Admin</h2>
              <p className="text-xs text-[#9494a3] mt-1 font-['Outfit'] font-sans font-normal">Enter credentials to access the CMS console</p>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {/* Username Input */}
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

            {/* Password Input */}
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

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="admin-btn admin-btn-primary w-full justify-center mt-6 cursor-pointer"
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

          {/* Back button */}
          <div className="text-center pt-2">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-[#9494a3] hover:text-white no-underline transition-colors font-medium">
              <ArrowLeft size={13} /> Back to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // RENDER MAIN PANEL LAYOUT
  return (
    <div className="admin-body min-h-screen flex flex-col md:flex-row pt-20 md:pt-24">
      <aside
        className={`admin-sidebar shrink-0 flex flex-col justify-between py-6 px-3.5 transition-all duration-300 ease-in-out sticky top-20 md:top-24 z-20 md:h-[calc(100vh-96px)] ${
          isCollapsed ? "md:w-20" : "md:w-64"
        } w-full`}
      >
        <div className="space-y-6">
          {/* Sidebar Header + Collapse Toggle */}
          <div className="flex items-center justify-between px-1">
            <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? "md:w-0 md:opacity-0 md:hidden" : "w-auto opacity-100"}`}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(139,92,246,0.3)] shrink-0">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div className="whitespace-nowrap">
                <h2 className="font-['Outfit'] font-extrabold text-sm text-[#f8fafc] leading-tight">Jatin Panchal</h2>
                <span className="text-[10px] font-semibold text-[#8b5cf6] uppercase tracking-wider">CMS ADMIN DASHBOARD</span>
              </div>
            </div>

            {/* Icon when Collapsed */}
            {isCollapsed && (
              <div
                className="hidden md:flex w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] items-center justify-center text-white shadow-[0_4px_16px_rgba(139,92,246,0.3)] shrink-0"
                title="Jatin Panchal (CMS Admin)"
              >
                <ShieldCheck size={20} className="text-white" />
              </div>
            )}

            {/* Toggle Button */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden md:flex items-center justify-center shrink-0 ml-auto"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-2 flex flex-row md:flex-col gap-2 md:gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            <Link
              href="/admin/blog"
              title={isCollapsed ? "Posts List" : ""}
              className={`admin-sidebar-item shrink-0 flex items-center gap-3 p-3 rounded-xl transition-all ${
                isCollapsed ? "md:justify-center md:px-0" : ""
              } ${pathname === "/admin/blog" ? "admin-sidebar-item-active text-[#8b5cf6] bg-indigo-500/10" : ""}`}
            >
              <FileText size={18} className="shrink-0" />
              <span className={`transition-all duration-200 whitespace-nowrap ${isCollapsed ? "md:hidden" : "inline"}`}>
                Posts List
              </span>
            </Link>

            <Link
              href="/admin/blog/new"
              title={isCollapsed ? "New Post" : ""}
              className={`admin-sidebar-item shrink-0 flex items-center gap-3 p-3 rounded-xl transition-all ${
                isCollapsed ? "md:justify-center md:px-0" : ""
              } ${pathname === "/admin/blog/new" ? "admin-sidebar-item-active text-[#8b5cf6] bg-indigo-500/10" : ""}`}
            >
              <PlusCircle size={18} className="shrink-0" />
              <span className={`transition-all duration-200 whitespace-nowrap ${isCollapsed ? "md:hidden" : "inline"}`}>
                New Post
              </span>
            </Link>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#2a2a38] pt-4">
          <Link
            href="/"
            title={isCollapsed ? "Back to Site" : ""}
            className={`admin-sidebar-item shrink-0 flex items-center gap-3 p-3 rounded-xl transition-all ${
              isCollapsed ? "md:justify-center md:px-0" : ""
            }`}
          >
            <ArrowLeft size={18} className="shrink-0" />
            <span className={`transition-all duration-200 whitespace-nowrap ${isCollapsed ? "md:hidden" : "inline"}`}>
              Back to Site
            </span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0f0f1a]">
        {children}
      </main>
    </div>
  );
}
