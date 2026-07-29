import dynamic from "next/dynamic"
import Hero from "@/sections/HomePage/Hero"
import SEO from "@/components/SEO"
import { constructMetadata } from "@/lib/metadata"

const Features = dynamic(() => import("@/sections/HomePage/Features"))
const HowItWorks = dynamic(() => import("@/sections/HomePage/HowItWorks"))
const FaqPreview = dynamic(() => import("@/sections/HomePage/FaqPreview"))
const CtaBanner = dynamic(() => import("@/sections/HomePage/CtaBanner"))

export const metadata = constructMetadata({
  title: "Free Online Image Converter, Compressor & Editor Tools",
  description: "Convert, compress, resize & crop images free — JPG, PNG, WebP, PDF & more. 100% browser-based, no upload, no signup required.",
  canonicalPath: "",
  keywords: ["free online image converter"],
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
