import React from "react";

export default function Card({
  children,
  hover = false,
  className = "",
  ...props
}) {
  const baseClasses =
    "bg-[#1a1a2e] border border-white/8 rounded-[24px] p-8 transition-all duration-300";
  const hoverClasses = hover
    ? "hover:border-indigo-500/20 hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
    : "";

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
