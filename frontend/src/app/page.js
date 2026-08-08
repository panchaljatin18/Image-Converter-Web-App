import dynamic from "next/dynamic"
import Hero from "@/sections/HomePage/Hero"
import SEO from "@/components/SEO"
import { constructMetadata } from "@/lib/metadata"

const Features = dynamic(() => import("@/sections/HomePage/Features"))
const HowItWorks = dynamic(() => import("@/sections/HomePage/HowItWorks"))
const FaqPreview = dynamic(() => import("@/sections/HomePage/FaqPreview"))
const CtaBanner = dynamic(() => import("@/sections/HomePage/CtaBanner"))

export const metadata = constructMetadata({
  title: "Free Online Image Converter & Compressor – Convert Without Losing Quality",
  description: "Free online image converter and batch image compressor. Compress and convert images (JPG, PNG, WebP, HEIC, PDF) without losing quality. 100% private, no signup.",
  canonicalPath: "",
  keywords: [
    "free image converter",
    "free online image converter",
    "image converter without losing quality",
    "batch image converter",
    "compress and convert image",
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
    "image compressor no watermark",
    "best free image converter",
    "online image tools",
  ],
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
