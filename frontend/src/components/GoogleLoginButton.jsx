"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import Button from "@/components/Button";

export default function GoogleLoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2.5 py-3 px-7 rounded-xl font-semibold text-[0.95rem] font-['Inter'] cursor-not-allowed bg-transparent text-[#f8fafc] border border-white/20 backdrop-blur-md opacity-70"
      >
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "User Avatar"}
            className="w-8 h-8 rounded-full border border-indigo-500/20"
          />
        )}
        <div className="flex flex-col items-start">
          <span className="text-[0.85rem] font-semibold text-[#f8fafc]">
            {session.user?.name}
          </span>
          <span className="text-[0.75rem] text-[#64748b]">
            {session.user?.email}
          </span>
        </div>
        <Button
          onClick={() => signOut()}
          variant="secondary"
          size="sm"
          className="py-1.5 px-3"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="inline-flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl py-2.5 px-5 font-['Outfit'] font-semibold text-[#f8fafc] cursor-pointer transition-all duration-200 hover:bg-white/8 hover:border-indigo-400 hover:-translate-y-0.5"
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.69-1.55 2.69-3.85 2.69-6.57z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.91-2.24c-.8.54-1.84.87-3.05.87-2.34 0-4.33-1.58-5.03-3.7H1.02v2.32C2.5 15.97 5.56 18 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.97 10.7C3.79 10.16 3.69 9.59 3.69 9s.1-1.16.28-1.7V4.98H1.02C.37 6.19 0 7.56 0 9s.37 2.81 1.02 4.02l2.95-2.32z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4C13.46.99 11.43 0 9 0 5.56 0 2.03 1.02 4.98l2.95 2.32c.7-2.12 2.69-3.72 5.03-3.72z"
        />
      </svg>
      Continue with Google
    </button>
  );
}
