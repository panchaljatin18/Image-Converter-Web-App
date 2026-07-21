"use client";

import { useEffect, useRef } from "react";

interface AdSenseUnitProps {
  adSlot?: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * High-Performance, Non-Blocking Google AdSense Ad Unit.
 * Defer-executes ad pushing to prevent blocking main thread / FCP / LCP.
 */
export default function AdSenseUnit({
  adSlot = "7641288079",
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
  className = "",
}: AdSenseUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || pushedRef.current) return;

    // Use requestIdleCallback or setTimeout to defer ad loading after initial paint
    const timer = setTimeout(() => {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        pushedRef.current = true;
      } catch (err) {
        console.warn("AdSense push deferred warning:", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`adsense-ad-container my-8 min-h-[90px] w-full flex justify-center items-center overflow-hidden transition-all duration-300 ${className}`}
    >
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
