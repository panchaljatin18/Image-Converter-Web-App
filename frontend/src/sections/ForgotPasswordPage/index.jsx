"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordContent() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setError("");
    setSuccess("");
    setResetUrl("");

    if (!email) {
      setValidationError("Email address is required.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const data = await forgotPassword(email);
      if (data.success) {
        setSuccess(
          "We've generated a password reset link. Check your inbox and spam folder, or use the dev link below."
        );
        setResetUrl(data.resetUrl || "");
      }
    } catch (err) {
      setError(err.message || "Failed to send reset link. Please verify the email is registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight m-0">Forgot Password</h1>
          <p className="text-sm text-slate-400 m-0">
            Enter your email address to receive a secure link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col gap-5 text-center py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-sm text-slate-400 m-0 max-w-sm mx-auto">
              {success}
            </p>
            {resetUrl && (
              <a
                href={resetUrl}
                target="_blank"
                rel="noreferrer"
                className="mx-auto inline-flex items-center justify-center gap-2 rounded-xl border border-violet-500/25 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/15"
              >
                Open reset link
              </a>
            )}
            <div className="pt-2">
              <Link
                href="/login"
                className="text-indigo-400 font-semibold cursor-pointer hover:text-indigo-300 hover:underline bg-transparent border-none p-0 inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs">
                ⚠️ {error}
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-[13px] bg-[#23233a] border-[1.5px] rounded-xl text-white text-sm outline-none transition-all placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 ${
                  validationError ? "border-red-500" : "border-[#3f3f6e]"
                }`}
              />
              {validationError && (
                <p className="text-xs text-red-400 mt-1">{validationError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[#7c3aed] border-none rounded-xl text-white text-sm font-semibold cursor-pointer transition-all hover:bg-[#6d28d9] hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-indigo-400 font-semibold cursor-pointer hover:text-indigo-300 hover:underline bg-transparent border-none p-0 inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
