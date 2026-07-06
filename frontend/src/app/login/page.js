import { Suspense } from "react";
import LoginPage from "@/sections/LoginPage"

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f1a]" />}>
      <LoginPage />
    </Suspense>
  );
}