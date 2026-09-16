import dynamic from "next/dynamic";
import Hero from "@/sections/HomePage/Hero";
import SEO from "@/components/SEO";
import { constructMetadata } from "@/lib/metadata";

const SectionSkeleton = () => (
  <div className="w-full min-h-[280px] bg-white/[0.01] my-6 rounded-2xl animate-pulse border border-white/5" />
);

const Features = dynamic(() => import("@/sections/HomePage/Features"), {
  loading: () => <SectionSkeleton />,
});
const HowItWorks = dynamic(() => import("@/sections/HomePage/HowItWorks"), {
  loading: () => <SectionSkeleton />,
});
const FaqPreview = dynamic(() => import("@/sections/HomePage/FaqPreview"), {
  loading: () => <SectionSkeleton />,
});
const CtaBanner = dynamic(() => import("@/sections/HomePage/CtaBanner"), {
  loading: () => <SectionSkeleton />,
});

export const metadata = constructMetadata({
  title: "Free Image Converter – JPG, PNG & WebP | ConvertGalaxy",
  description:
    "Convert JPG, PNG, WebP, HEIC & PDF online for free with ConvertGalaxy. Fast, private, browser-based image converter with no file limits or quality loss.",
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
      <div>
        <Features />
      </div>
      <div>
        <HowItWorks />
      </div>
      <div>
        <FaqPreview />
      </div>
      <div>
        <CtaBanner />
      </div>
    </>
  );
}
