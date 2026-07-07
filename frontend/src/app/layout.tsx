import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import { ConversionLimitProvider } from "@/context/ConversionLimitContext"
import NextAuthProvider from "@/components/NextAuthProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Script from "next/script"

export const metadata = {
  metadataBase: new URL("https://convertgalaxy.com"),
  title: {
    default: "Convert Galaxy – Free Online Image Converter, Compressor & Editor",
    template: "%s | ConvertGalaxy",
  },
  description:
    "Convert JPG to PNG, PNG to JPG, WebP conversion, compress images, resize, crop, and convert images to PDF — all free, fast, and secure in your browser.",
  keywords: [
    "image converter",
    "JPG to PNG",
    "PNG to JPG",
    "WebP converter",
    "image compressor",
    "image resizer",
    "crop image",
    "image to PDF",
    "PDF to image",
    "free image tools",
    "online image editor",
  ],
  authors: [{ name: "ConvertGalaxy" }],
  creator: "ConvertGalaxy",
  publisher: "ConvertGalaxy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://convertgalaxy.com",
    siteName: "Convert Galaxy",
    title: "Convert Galaxy – Free Online Image Converter & Editor",
    description:
      "Free, fast, browser-based image tools. Convert, compress, resize, crop images and more — no upload required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ConvertGalaxy – Free Online Image Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Galaxy – Free Online Image Converter & Editor",
    description:
      "Free browser-based image tools. Convert, compress, resize, crop and more.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification=s0ab_86u6FyoQmZRSv69y4Ji4Q5IuJqM8lds-lyZ5HM",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <link rel="icon" href="/C.png" />
        <link rel="apple-touch-icon" href="/C.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ConvertGalaxy",
              url: "https://convertgalaxy.com",
              description:
                "Free online image converter, compressor, resizer, and editor tools.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://convertgalaxy.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
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
