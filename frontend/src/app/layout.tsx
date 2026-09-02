import "./globals.css"
import dynamic from "next/dynamic"
import { Inter, Outfit } from "next/font/google"
import { AuthProvider } from "@/hooks/useAuth"
import { ConversionLimitProvider } from "@/context/ConversionLimitContext"
import NextAuthProvider from "@/components/NextAuthProvider"
import Navbar from "@/components/Navbar"
import { GLOBAL_SEO_DEFAULTS } from "@/lib/metadata"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const Footer = dynamic(() => import("@/components/Footer"))

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata = GLOBAL_SEO_DEFAULTS

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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://image-converter-web-app.onrender.com" />
        <link rel="dns-prefetch" href="https://image-converter-web-app.onrender.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0f0f1a] text-[#f8fafc] antialiased">
        <NextAuthProvider>
          <AuthProvider>
            <ConversionLimitProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </ConversionLimitProvider>
          </AuthProvider>
        </NextAuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
