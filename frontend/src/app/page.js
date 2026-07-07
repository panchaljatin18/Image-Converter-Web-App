import Hero from "@/sections/HomePage/Hero"
import Features from "@/sections/HomePage/Features"
import HowItWorks from "@/sections/HomePage/HowItWorks"
import FaqPreview from "@/sections/HomePage/FaqPreview"
import CtaBanner from "@/sections/HomePage/CtaBanner"

export const metadata = {
  title: "Free Online Image Converter, Compressor & Editor - ConvertGalaxy",
  description:
    "Convert JPG to PNG, PNG to JPG, WebP, compress images, resize, crop, and convert to PDF. 100% free, fast, browser-based image tools. No upload, no account required.",
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <FaqPreview />
      <CtaBanner />
    </>
  )
}
