import dynamic from "next/dynamic"
import Hero from "@/sections/HomePage/Hero"
import SEO from "@/components/SEO"
import { constructMetadata } from "@/lib/metadata"

const Features = dynamic(() => import("@/sections/HomePage/Features"))
const HowItWorks = dynamic(() => import("@/sections/HomePage/HowItWorks"))
const FaqPreview = dynamic(() => import("@/sections/HomePage/FaqPreview"))
const CtaBanner = dynamic(() => import("@/sections/HomePage/CtaBanner"))

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
