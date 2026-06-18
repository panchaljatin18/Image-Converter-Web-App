import React from "react";

export default function Container({ className = "", children, ...props }) {
  return (
    <div
      className={`w-full mx-auto px-4 md:px-6 max-w-[1200px] 2xl:max-w-[1500px] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
