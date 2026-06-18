"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "../../../../hooks/useAuth";
import googleDriveService from "../../../../services/googleDriveService";
import authService from "../../../../services/authService";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { user } = useAuth();
  const [status, setStatus] = useState("loading"); // "loading", "success", "error"
  const [errorMessage, setErrorMessage] = useState("");

  const getEffectiveToken = () => {
    return session?.accessToken || authService.getToken();
  };

  useEffect(() => {
    const exchangeCode = async () => {
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setStatus("error");
        setErrorMessage(errorParam || "Google authentication rejected.");
        return;
      }

      if (!code) {
        setStatus("error");
        setErrorMessage("Authorization code is missing.");
        return;
      }

      const token = getEffectiveToken();
      if (!token) {
        // Retry shortly in case session initialization is in progress
        setTimeout(exchangeCode, 1000);
        return;
      }

      try {
        const redirectUri = `${window.location.origin}/dashboard/google-drive/callback`;
        const res = await googleDriveService.connect(token, code, redirectUri);
        
        if (res.success) {
          setStatus("success");
          // Redirect back to the uploader page after 2 seconds
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          throw new Error(res.message || "Failed to exchange auth token.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage(err.message || "An unexpected error occurred during token exchange.");
      }
    };

    exchangeCode();
  }, [searchParams, session, user, router]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Outfit, sans-serif",
        color: "var(--text-primary)"
      }}
    >
      <div
        style={{
          background: "rgba(15, 23, 42, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: "40px",
          maxWidth: "460px",
          width: "100%",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
        }}
      >
        {status === "loading" && (
          <>
            <Loader2 size={48} className="animate-spin" style={{ color: "var(--primary-light)", marginBottom: "20px" }} />
            <h2 style={{ margin: "0 0 10px 0", fontSize: "1.5rem", fontWeight: 700 }}>Connecting Google Drive</h2>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Exchanging secure credentials with the server. Please wait...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ color: "#4ade80", display: "inline-flex", marginBottom: "20px" }}>
              <CheckCircle size={48} />
            </div>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "1.5rem", fontWeight: 700 }}>Connected Successfully!</h2>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Your Google Drive is now connected. Redirecting you back to uploader...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ color: "#f87171", display: "inline-flex", marginBottom: "20px" }}>
              <AlertCircle size={48} />
            </div>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "1.5rem", fontWeight: 700 }}>Connection Failed</h2>
            <p style={{ margin: "0 0 24px 0", color: "#fca5a5", fontSize: "0.95rem" }}>
              {errorMessage}
            </p>
            <button
              onClick={() => router.push("/")}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "10px 24px",
                color: "white",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function GoogleDriveCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--primary-light)" }} />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
