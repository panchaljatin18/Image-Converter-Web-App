import dynamic from "next/dynamic"
import Hero from "@/sections/HomePage/Hero"
import SEO from "@/components/SEO"
import { constructMetadata } from "@/lib/metadata"

const Features = dynamic(() => import("@/sections/HomePage/Features"))
const HowItWorks = dynamic(() => import("@/sections/HomePage/HowItWorks"))
const FaqPreview = dynamic(() => import("@/sections/HomePage/FaqPreview"))
const CtaBanner = dynamic(() => import("@/sections/HomePage/CtaBanner"))

export const metadata = constructMetadata({
  title: "Free Online Image Converter – JPG, PNG, WebP & More | ConvertGalaxy",
  description: "Convert images online for free with ConvertGalaxy. Fast, browser-based image converter supporting JPG, PNG, WebP, HEIC, GIF, and PDF with 100% privacy and no quality loss.",
  canonicalPath: "",
  keywords: [
    "free online image converter",
    "online image converter",
    "image converter",
    "free image converter",
    "convert images online",
    "online image conversion",
    "image conversion tool",
    "jpg to png converter free",
    "png to jpg free",
    "heic to jpg converter",
    "webp converter free",
    "compress image online free",
    "resize image online free",
    "image to pdf free",
    "pdf to image converter",
    "crop image online free",
    "convert image free no signup",
  ],
});

export default function HomePage() {
  return (
    <>
      <SEO type="homepage" />
      <Hero />
      <div className="cv-auto-section">
        <Features />
      </div>
      <div className="cv-auto-section">
        <HowItWorks />
      </div>
      <div className="cv-auto-section">
        <FaqPreview />
      </div>
      <div className="cv-auto-section">
        <CtaBanner />
      </div>
    </>
  )
}
