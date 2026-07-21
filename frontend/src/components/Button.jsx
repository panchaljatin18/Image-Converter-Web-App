import React from "react";

export default function Button({
  children,
  variant = "primary", // primary, secondary, ghost
  size = "md", // sm, md, lg
  icon = false,
  className = "",
  type = "button",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center gap-2 font-semibold transition-all duration-250 cursor-pointer no-underline whitespace-nowrap relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] before:-translate-x-full before:transition-transform before:duration-600 hover:before:translate-x-full";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#6366f1] to-[#06b6d4] text-white border-none shadow-[0_4px_15px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.5)]",
    secondary:
      "bg-transparent text-[#f8fafc] border border-indigo-500/20 backdrop-blur-[10px] hover:bg-indigo-500/10 hover:border-[#6366f1] hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-[#cbd5e1] border-none hover:bg-white/5 hover:text-[#f8fafc]",
  };

  const sizeClasses = icon
    ? {
        sm: "w-8 h-8 p-0 justify-center rounded-lg",
        md: "w-[42px] h-[42px] p-0 justify-center rounded-xl",
        lg: "w-12 h-12 p-0 justify-center rounded-2xl",
      }
    : {
        sm: "py-2 px-4 text-[0.85rem] rounded-lg",
        md: "py-3 px-7 text-[0.95rem] rounded-xl",
        lg: "py-4 px-9 text-[1.05rem] rounded-[16px]",
      };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
