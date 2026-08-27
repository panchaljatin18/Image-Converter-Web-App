import dynamic from "next/dynamic"
import Hero from "@/sections/HomePage/Hero"
import SEO from "@/components/SEO"
import { constructMetadata } from "@/lib/metadata"

const Features = dynamic(() => import("@/sections/HomePage/Features"))
const HowItWorks = dynamic(() => import("@/sections/HomePage/HowItWorks"))
const FaqPreview = dynamic(() => import("@/sections/HomePage/FaqPreview"))
const CtaBanner = dynamic(() => import("@/sections/HomePage/CtaBanner"))

export const metadata = constructMetadata({
  title: "Image Converter Online – Free, Fast & Private Image Tools | ConvertGalaxy",
  description: "Free online image converter to batch convert JPG, PNG, WebP, HEIC & PDF directly in your browser without uploading to a server. 100% private with no quality loss.",
  canonicalPath: "",
  keywords: [
    "free image converter",
    "image converter online",
    "free online image converter",
    "online image converter",
    "convert images without uploading",
    "private image converter",
    "batch image converter",
    "image converter without losing quality",
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
