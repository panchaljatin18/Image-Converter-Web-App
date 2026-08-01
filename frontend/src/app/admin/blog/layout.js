"use client";

import "./admin.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, PlusCircle, ArrowLeft, ShieldAlert, Lock, User, Loader2, LogOut, ShieldCheck } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  // Fixed username state
  const [username] = useState("Jatin Panchal");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const checkSession = () => {
      // Enforce tab-based session authorization for every admin link access
      const sessionAuth = typeof window !== "undefined" && sessionStorage.getItem("cg_admin_session") === "authorized";

      if (sessionAuth) {
        setIsAuthorized(true);
        if (setUser) {
          setUser({ name: "Jatin Panchal", email: "jmpanchal394@gmail.com", role: "admin" });
        }
      } else {
        document.cookie = "cg_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; sameSite=strict;";
        setIsAuthorized(false);
      }
      setChecking(false);
    };
    checkSession();
  }, [pathname, setUser]);

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
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center font-bold text-white text-lg shadow-[0_4px_20px_rgba(139,92,246,0.25)]">
              CG
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
    <div className="admin-body min-h-screen flex flex-col md:flex-row" style={{ paddingTop: "95px" }}>
      <aside className="admin-sidebar w-full md:w-64 shrink-0 flex flex-col justify-between py-6 px-4 md:h-[calc(100vh-76px)] sticky top-[76px] z-20">
        <div className="space-y-8">
          {/* Sidebar Header */}
          <div className="px-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(139,92,246,0.3)] shrink-0">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-['Outfit'] font-extrabold text-sm text-[#f8fafc] leading-tight">Jatin Panchal</h2>
              <span className="text-[10px] font-semibold text-[#8b5cf6] uppercase tracking-wider">CMS Admin Dashboard</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5 flex flex-row md:flex-col gap-2 md:gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            <Link
              href="/admin/blog"
              className={`admin-sidebar-item shrink-0 ${
                pathname === "/admin/blog" ? "admin-sidebar-item-active text-[#8b5cf6] bg-indigo-500/10" : ""
              }`}
            >
              <FileText size={16} />
              Posts List
            </Link>
            <Link
              href="/admin/blog/new"
              className={`admin-sidebar-item shrink-0 ${
                pathname === "/admin/blog/new" ? "admin-sidebar-item-active text-[#8b5cf6] bg-indigo-500/10" : ""
              }`}
            >
              <PlusCircle size={16} />
              New Post
            </Link>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#2a2a38] pt-4">
          <Link href="/" className="admin-sidebar-item shrink-0">
            <ArrowLeft size={16} />
            Back to Site
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0f0f1a]">
        {children}
      </main>
    </div>
  );
}
