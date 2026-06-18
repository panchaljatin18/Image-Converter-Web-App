"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Image,
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
  { name: "Tools", href: "/tools", hasDropdown: true },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

const authRoutes = new Set(["/login", "/forgot-password", "/reset-password"]);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
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
      setToolsOpen(false);
    }, 0);

    return () => clearTimeout(closeMenus);
  }, [pathname]);

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
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? "12px 0" : "18px 0",
          background: scrolled
            ? "rgba(15, 15, 26, 0.95)"
            : "rgba(15, 15, 26, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(99, 102, 241, 0.15)"
            : "1px solid rgba(255,255,255,0.05)",
          transition: "all 0.3s ease",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
              }}
            >
              <Image color="white" size={20} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  background: "linear-gradient(135deg, #a5b4fc, #67e8f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
              >
                ImageToolkit
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }} className="hidden-mobile">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.name} style={{ position: "relative" }}>
                  <button
                    onClick={() => setToolsOpen(!toolsOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "8px 14px",
                      background: "transparent",
                      border: "none",
                      color: pathname.startsWith("/tools") ? "var(--primary-light)" : "var(--text-secondary)",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      borderRadius: "8px",
                      fontFamily: "Inter, sans-serif",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = pathname.startsWith("/tools") ? "var(--primary-light)" : "var(--text-secondary)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {link.name}
                    <ChevronDown
                      size={14}
                      style={{
                        transform: toolsOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </button>

                  {/* Dropdown */}
                  {toolsOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 12px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(19, 19, 31, 0.98)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        borderRadius: "16px",
                        padding: "12px",
                        width: "520px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "4px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
                        animation: "fadeInUp 0.2s ease",
                        zIndex: 1001,
                      }}
                    >
                      {tools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            textDecoration: "none",
                            color: "var(--text-secondary)",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(99,102,241,0.1)";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--text-secondary)";
                          }}
                        >
                          <span
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "7px",
                              background: `${tool.color}22`,
                              border: `1px solid ${tool.color}44`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: tool.color,
                              flexShrink: 0,
                            }}
                          >
                            {tool.icon}
                          </span>
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: pathname === link.href ? "var(--primary-light)" : "var(--text-secondary)",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                    background: pathname === link.href ? "rgba(99,102,241,0.1)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== link.href) {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== link.href) {
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            <Link
              href="/tools"
              className="btn btn-primary btn-sm hidden-mobile"
              style={{ fontSize: "0.85rem", padding: "9px 18px" }}
            >
              <Zap size={14} />
              All Tools
            </Link>

            {user ? (
              <Link
                href="/dashboard"
                className="btn btn-sm hidden-mobile"
                style={{
                  fontSize: "0.85rem",
                  padding: "9px 18px",
                  color: "white",
                  border: "1px solid rgba(99,102,241,0.3)",
                  background: "rgba(99,102,241,0.15)",
                  borderRadius: "10px",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="btn btn-sm hidden-mobile"
                style={{
                  fontSize: "0.85rem",
                  padding: "9px 18px",
                  color: "var(--text-secondary)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "10px",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
              }}
              className="mobile-menu-btn"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 998,
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Mobile Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "300px",
          background: "rgba(19, 19, 31, 0.98)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(99,102,241,0.2)",
          zIndex: 999,
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
          padding: "80px 24px 32px",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {navLinks.map((link) => (
            <div key={link.name}>
              <Link
                href={link.href}
                style={{
                  display: "block",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: pathname === link.href ? "white" : "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  background: pathname === link.href ? "rgba(99,102,241,0.15)" : "transparent",
                  borderLeft: pathname === link.href ? "3px solid var(--primary)" : "3px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {link.name}
              </Link>
              {link.hasDropdown && (
                <div style={{ paddingLeft: "16px", marginTop: "4px", display: "flex", flexDirection: "column", gap: "2px" }}>
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span style={{ color: tool.color }}>{tool.icon}</span>
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {user && (
            <Link
              href="/dashboard"
              style={{
                display: "block",
                padding: "12px 16px",
                borderRadius: "10px",
                textDecoration: "none",
                color: pathname === "/dashboard" ? "white" : "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "1rem",
                background: pathname === "/dashboard" ? "rgba(99,102,241,0.15)" : "transparent",
                borderLeft: pathname === "/dashboard" ? "3px solid var(--primary)" : "3px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              Dashboard
            </Link>
          )}

          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link href="/tools" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              <Zap size={16} />
              All Tools
            </Link>

            {user ? (
              <button
                onClick={logout}
                className="btn"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  color: "white",
                  border: "1px solid rgba(239,68,68,0.3)",
                  background: "rgba(239,68,68,0.1)",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textAlign: "center",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="btn"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textAlign: "center",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>



      {/* Click outside to close tools dropdown */}
      {toolsOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 999 }}
          onClick={() => setToolsOpen(false)}
        />
      )}
    </>
  );
}
