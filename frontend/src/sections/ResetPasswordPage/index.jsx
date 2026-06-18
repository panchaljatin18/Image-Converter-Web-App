"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const tokenMissingMessage = token
    ? ""
    : "Reset token is missing from the link URL. Please request a new recovery link.";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!password) {
      errors.password = "New password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (!validate()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await resetPassword(token, password);
      if (data.success) {
        setSuccess("Password has been reset successfully! You can now sign in with your new password.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setError(err.message || "Failed to reset password. The link may have expired or is invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight m-0">Create New Password</h1>
        <p className="text-sm text-slate-400 m-0">
          Enter a strong password to finish securing your account.
        </p>
      </div>

      {tokenMissingMessage && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold">Invalid reset link</p>
          <p className="mt-1 text-sm text-amber-100/85">{tokenMissingMessage}</p>
          <Link
            href="/forgot-password"
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-50 transition hover:bg-amber-500/15"
          >
            Request a new link
          </Link>
        </div>
      )}

      {success ? (
        <div className="flex flex-col gap-5 text-center py-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-sm text-slate-400 m-0 max-w-sm mx-auto">
            {success}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="w-full py-3.5 px-6 bg-[#7c3aed] border-none rounded-xl text-white text-sm font-semibold cursor-pointer transition-all hover:bg-[#6d28d9] hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              Sign In
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

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!token}
                className={`w-full px-4 py-[13px] bg-[#23233a] border-[1.5px] rounded-xl text-white text-sm outline-none transition-all placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 pr-[46px] ${
                  validationErrors.password ? "border-red-500" : "border-[#3f3f6e]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={!token}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 bg-transparent border-none text-gray-500 hover:text-gray-300 cursor-pointer p-0 flex items-center"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!token}
                className={`w-full px-4 py-[13px] bg-[#23233a] border-[1.5px] rounded-xl text-white text-sm outline-none transition-all placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 pr-[46px] ${
                  validationErrors.confirmPassword ? "border-red-500" : "border-[#3f3f6e]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={!token}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 bg-transparent border-none text-gray-500 hover:text-gray-300 cursor-pointer p-0 flex items-center"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3.5 px-6 bg-[#7c3aed] border-none rounded-xl text-white text-sm font-semibold cursor-pointer transition-all hover:bg-[#6d28d9] hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordContent() {
  return (
    <AuthLayout>
      <Suspense fallback={
        <div className="flex justify-center 2xl:p-8 xl:p-7 lg:p-6 md:p-5 sm:p-4 p-3">
          <Loader2 className="animate-spin text-indigo-600 2xl:w-6 xl:w-[22px] lg:w-[19px] md:w-[17px] sm:w-[14px] w-3 2xl:h-6 xl:h-[22px] lg:h-[19px] md:h-[17px] sm:h-[14px] h-3" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
