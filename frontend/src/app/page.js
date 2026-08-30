import Hero from "@/sections/HomePage/Hero"
import Features from "@/sections/HomePage/Features"
import HowItWorks from "@/sections/HomePage/HowItWorks"
import FaqPreview from "@/sections/HomePage/FaqPreview"
import CtaBanner from "@/sections/HomePage/CtaBanner"
import SEO from "@/components/SEO"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Free Image Converter – JPG, PNG & WebP | ConvertGalaxy",
  description: "Convert JPG, PNG, WebP, HEIC & PDF online for free with ConvertGalaxy. Fast, private, browser-based image converter with no file limits or quality loss.",
  canonicalPath: "",
  keywords: [
    "free image converter",
    "online image converter",
    "jpg to png",
    "png to jpg",
    "webp converter",
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
