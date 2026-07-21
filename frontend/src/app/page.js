import dynamic from "next/dynamic"
import Hero from "@/sections/HomePage/Hero"
import SEO from "@/components/SEO"
import { constructMetadata } from "@/lib/metadata"

const Features = dynamic(() => import("@/sections/HomePage/Features"))
const HowItWorks = dynamic(() => import("@/sections/HomePage/HowItWorks"))
const FaqPreview = dynamic(() => import("@/sections/HomePage/FaqPreview"))
const CtaBanner = dynamic(() => import("@/sections/HomePage/CtaBanner"))

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
