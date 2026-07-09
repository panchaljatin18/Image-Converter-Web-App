import Hero from "@/sections/HomePage/Hero"
import Features from "@/sections/HomePage/Features"
import HowItWorks from "@/sections/HomePage/HowItWorks"
import FaqPreview from "@/sections/HomePage/FaqPreview"
import CtaBanner from "@/sections/HomePage/CtaBanner"
import SEO from "@/components/SEO"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Free Online Image Converter, Compressor & Editor",
  description: "Convert JPG to PNG, PNG to JPG, WebP, compress images, resize, crop, and convert to PDF. 100% free, fast, browser-based image tools. No upload, no account required.",
  canonicalPath: "",
});

export default function HomePage() {
  return (
    <>
      <SEO type="homepage" />
      <Hero />
      <Features />
      <HowItWorks />
      <FaqPreview />
      <CtaBanner />
    </>
  )
}
