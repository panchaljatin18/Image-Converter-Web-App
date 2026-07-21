"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Image as ImageIcon,
  Menu,
  X,
  ChevronDown,
  Zap,
  FileImage,
  Minimize2,
  Crop,
  RefreshCw,
  FileText,
} from "lucide-react";
import Container from "./Container";
import Button from "./Button";

const tools = [
  {
    name: "JPG to PNG",
    href: "/tools/jpg-to-png",
    icon: <RefreshCw size={16} />,
    color: "#6366f1",
  },
  {
    name: "PNG to JPG",
    href: "/tools/png-to-jpg",
    icon: <RefreshCw size={16} />,
    color: "#06b6d4",
  },
  {
    name: "WebP Converter",
    href: "/tools/webp-converter",
    icon: <FileImage size={16} />,
    color: "#f59e0b",
  },
  {
    name: "Image Compressor",
    href: "/tools/image-compressor",
    icon: <Minimize2 size={16} />,
    color: "#10b981",
  },
  {
    name: "Image Resizer",
    href: "/tools/image-resizer",
    icon: <Zap size={16} />,
    color: "#8b5cf6",
  },
  {
    name: "Crop Image",
    href: "/tools/crop-image",
    icon: <Crop size={16} />,
    color: "#ef4444",
  },
  {
    name: "Image to PDF",
    href: "/tools/image-to-pdf",
    icon: <FileText size={16} />,
    color: "#f97316",
  },
  {
    name: "PDF to Image",
    href: "/tools/pdf-to-image",
    icon: <FileText size={16} />,
    color: "#ec4899",
  },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Tools", href: "/tools", hasDropdown: true },
  { name: "Contact", href: "/contact" },
];

const authRoutes = new Set(["/login", "/forgot-password", "/reset-password"]);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAuthRoute = authRoutes.has(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMenus = setTimeout(() => {
      setMobileOpen(false);
      setMobileToolsOpen(false);
    }, 0);
    return () => clearTimeout(closeMenus);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      setMobileToolsOpen(false);
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (isAuthRoute) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] backdrop-blur-[20px] transition-all duration-300 ${scrolled
            ? "py-3 bg-[#0f0f1a]/95 border-b border-indigo-500/15"
            : "py-4.5 bg-[#0f0f1a]/70 border-b border-white/5"
          }`}
      >
        <Container className="flex items-center justify-between gap-6">
          {/* Logo - Desktop */}
          <Link href="/" className="logo-nav-desktop no-underline">
            <Image
              src="/CG.png"
              alt="Converter Galaxy Logo"
              width={200}
              height={50}
              priority
              style={{ width: "auto", height: "auto" }}
              className="h-auto w-auto object-contain"
            />
          </Link>

          {/* Logo - Mobile */}
          <Link href="/" className="logo-nav-mobile no-underline">
            <Image
              src="/CG.png"
              alt="Converter Galaxy Logo"
              width={160}
              height={40}
              priority
              style={{ width: "auto", height: "auto" }}
              className="h-auto w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.name} className="relative group">
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-label="Tools navigation menu"
                    className={`flex items-center gap-1 py-2 px-3.5 bg-transparent border-none font-medium text-[0.9rem] cursor-pointer rounded-lg font-['Inter'] transition-all duration-200 hover:text-white hover:bg-white/5 no-underline outline-none ${pathname.startsWith("/tools") ? "text-[#818cf8]" : "text-[#94a3b8]"
                      }`}
                  >
                    {link.name}
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#13131f]/98 backdrop-blur-[20px] border border-indigo-500/20 rounded-2xl p-3 w-[520px] grid grid-cols-2 gap-1 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(99,102,241,0.1)] z-[1001] opacity-0 invisible translate-y-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 origin-top">
                    {tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg no-underline text-[#94a3b8] text-[0.875rem] font-medium transition-all duration-200 hover:bg-indigo-500/10 hover:text-white"
                      >
                        <span
                          className="w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0 border"
                          style={{
                            background: `${tool.color}22`,
                            borderColor: `${tool.color}44`,
                            color: tool.color,
                          }}
                        >
                          {tool.icon}
                        </span>
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`py-2 px-3.5 rounded-lg no-underline font-medium text-[0.9rem] transition-all duration-200 ${pathname === link.href
                      ? "text-[#818cf8] bg-indigo-500/10"
                      : "text-[#94a3b8] hover:text-white hover:bg-white/5"
                    }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/tools" className="no-underline hidden lg:inline-block">
              <Button variant="primary" size="sm" className="flex items-center gap-1.5 py-2 px-4.5 text-[0.85rem]">
                <Zap size={14} />
                All Tools
              </Button>
            </Link>

            {user ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                className="py-2 px-4.5 text-[0.85rem] border border-red-500/30 bg-red-500/15 rounded-[10px] text-white cursor-pointer hover:bg-red-500/25 hidden lg:inline-block"
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/login" className="no-underline hidden lg:inline-block">
                <Button variant="secondary" size="sm" className="py-2 px-4.5 text-[0.85rem] border border-white/15 bg-white/5 rounded-[10px] text-[#94a3b8]">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setMobileOpen((prev) => !prev);
              }}
              className="flex lg:hidden w-10 h-10 rounded-lg bg-white/7 border border-white/10 items-center justify-center cursor-pointer text-white z-[1001]"
              aria-label="Toggle mobile navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-[998] backdrop-blur-[4px]"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[300px] bg-[#13131f]/98 backdrop-blur-[20px] border-l border-indigo-500/20 z-[999] overflow-y-auto p-6 pt-20 transition-all duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] ${mobileOpen
            ? "translate-x-0 opacity-100 visible pointer-events-auto"
            : "translate-x-full opacity-0 invisible pointer-events-none"
          }`}
      >
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.hasDropdown ? (
                <button
                  type="button"
                  onClick={() => setMobileToolsOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between py-3 px-4 rounded-lg bg-transparent border-none font-semibold text-[1rem] transition-all duration-200 border-l-[3px] cursor-pointer text-left ${pathname.startsWith("/tools")
                      ? "text-white bg-indigo-500/15 border-[#6366f1]"
                      : "text-[#94a3b8] border-transparent"
                    }`}
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 text-[#94a3b8] ${mobileToolsOpen ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3 px-4 rounded-lg no-underline font-semibold text-[1rem] transition-all duration-200 border-l-[3px] ${pathname === link.href
                      ? "text-white bg-indigo-500/15 border-[#6366f1]"
                      : "text-[#94a3b8] border-transparent"
                    }`}
                >
                  {link.name}
                </Link>
              )}
              {link.hasDropdown && (
                <div
                  className={`pl-4 mt-1 flex flex-col gap-0.5 overflow-hidden transition-all duration-300 ease-in-out ${mobileToolsOpen ? "max-h-[400px] opacity-100 py-1" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                >
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg no-underline text-[#64748b] text-[0.85rem] transition-all duration-200 hover:text-white"
                    >
                      <span style={{ color: tool.color }}>{tool.icon}</span>
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}


          <div className="mt-6 flex flex-col gap-2.5">
            <Link href="/tools" className="no-underline">
              <Button variant="primary" className="w-full justify-center">
                <Zap size={16} />
                All Tools
              </Button>
            </Link>

            {user ? (
              <button
                onClick={logout}
                className="w-full justify-center inline-flex items-center gap-2 font-semibold transition-all duration-250 cursor-pointer text-white border border-red-500/30 bg-red-500/10 py-3 px-6 rounded-xl text-[0.875rem] text-center"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/login" className="no-underline">
                <button
                  className="w-full justify-center inline-flex items-center gap-2 font-semibold transition-all duration-250 cursor-pointer text-white border border-white/15 bg-white/5 py-3 px-6 rounded-xl text-[0.875rem] text-center"
                >
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
