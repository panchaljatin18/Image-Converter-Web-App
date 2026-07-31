"use client";

import "./admin.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, PlusCircle, ArrowLeft, ShieldAlert, Lock, User, Loader2, LogOut } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      const cookies = document.cookie.split(";");
      const session = cookies.find(c => c.trim().startsWith("cg_admin_session="));
      if (session && session.split("=")[1] === "authorized") {
        setIsAuthorized(true);
        setChecking(false);
      } else {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    };
    checkSession();
  }, [pathname, router]);

  const handleLogout = () => {
    document.cookie = "cg_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; sameSite=strict;";
    setIsAuthorized(false);
    router.push("/");
  };

  if (checking || !isAuthorized) {
    return (
      <div className="admin-body min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#8b5cf6]" size={36} />
        <p className="text-sm text-[#cbd5e1] font-medium font-['Outfit']">Redirecting to administrator login...</p>
      </div>
    );
  }

  // RENDER MAIN PANEL LAYOUT
  return (
    <div className="admin-body min-h-screen flex flex-col md:flex-row" style={{ paddingTop: "128px" }}>
      <aside className="admin-sidebar w-full md:w-64 shrink-0 flex flex-col justify-between py-6 px-4 md:h-[calc(100vh-128px)] sticky top-[128px] z-20">
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="px-3 flex items-center gap-2.5">
            <img
              src="/C.png"
              alt="ConvertGalaxy Logo"
              className="w-9 h-9 object-contain rounded-xl"
            />
            <div>
              <h2 className="font-['Outfit'] font-extrabold text-sm text-[#f8fafc] leading-tight">ConvertGalaxy</h2>
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
            <button
              onClick={handleLogout}
              className="admin-sidebar-item shrink-0 w-full text-left bg-transparent border-none outline-none cursor-pointer"
            >
              <LogOut size={16} className="text-red-400" />
              Sign Out
            </button>
            <Link href="/" className="admin-sidebar-item shrink-0 md:mt-8">
              <ArrowLeft size={16} />
              Back to Site
            </Link>
          </nav>
        </div>

        <div className="hidden md:block px-3 text-[11px] text-[#6b6b7a] font-medium font-mono border-t border-[#2a2a38] pt-4">
          Admin: Jatin Panchal
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0f0f1a]">
        {children}
      </main>
    </div>
  );
}
