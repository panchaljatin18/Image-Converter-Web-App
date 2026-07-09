import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import { ConversionLimitProvider } from "@/context/ConversionLimitContext"
import NextAuthProvider from "@/components/NextAuthProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Script from "next/script"
import { GLOBAL_SEO_DEFAULTS } from "@/lib/metadata"

export const metadata = GLOBAL_SEO_DEFAULTS;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f0f1a",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0f0f1a] text-[#f8fafc] antialiased">
        {/* Google AdSense Script Integration */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9811629021943003"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <NextAuthProvider>
          <AuthProvider>
            <ConversionLimitProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </ConversionLimitProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
