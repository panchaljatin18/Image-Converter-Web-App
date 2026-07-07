"use client";

import { useEffect, useRef } from "react";

interface AdSenseUnitProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Reusable Google AdSense Ad Unit Component.
 * Integrates dynamically on the client-side to ensure compatibility with SSR.
 *
 * @param adSlot The Google AdSense slot ID for the specific ad unit.
 * @param adFormat The format of the ad (default: "auto").
 * @param fullWidthResponsive Whether the ad should expand responsive to width (default: true).
 * @param style Style overrides for the ins element.
 * @param className CSS classes for the outer container.
 */
export default function AdSenseUnit({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
  className = "",
}: AdSenseUnitProps) {
  const initialized = useRef(false);

  useEffect(() => {
    // Run only on client side to avoid SSR/hydration issues
    if (typeof window !== "undefined") {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        initialized.current = true;
      } catch (err) {
        console.warn("Google AdSense initialization warning:", err);
      }
    }
  }, []);

  return (
    <div className={`adsense-ad-container my-4 overflow-hidden flex justify-center items-center ${className}`}>
      {/*
        Google AdSense Ad Element
        Publisher Account ID is hardcoded here to ensure all instances target the correct client (ca-pub-9811629021943003).
      */}
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-9811629021943003"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
