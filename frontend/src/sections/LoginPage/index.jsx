"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 12.48c-.02 2.04 1.66 2.88 1.74 2.92-.01.06-.27.95-.89 1.88-.54.8-1.1 1.6-1.98 1.61-.86.02-1.14-.51-2.13-.51-.98 0-1.29.52-2.11.53-.86 0-1.52-.87-2.07-1.66-1.13-1.59-1.99-4.5-.83-6.46.57-.97 1.59-1.58 2.7-1.6.84-.02 1.64.57 2.16.57.51 0 1.47-.71 2.48-.6.42.01 1.6.17 2.36 1.28-.06.04-1.4.84-1.39 2.5zM15.53 6.7c.45-.55.75-1.3.67-2.06-.65.03-1.44.44-1.91.98-.42.48-.79 1.25-.69 1.99.73.06 1.48-.39 1.93-.91z" />
  </svg>
);

const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`h-[35px] w-full rounded-[4px] border border-[#534967] bg-[#40394f] px-[14px] text-[11px] text-white outline-none transition placeholder:text-[#89819a] focus:border-[#b7a7e6] focus:ring-2 focus:ring-[#7d63ce]/25 ${className}`}
  />
);

export default function LoginPage() {
  const router = useRouter();
  const { login, register, googleLogin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("[AUTH]: User is already authenticated. Redirecting directly to home page.");
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleCredentialResponse = async (response) => {
    clearFeedback();
    setLoading(true);
    console.log("[GOOGLE OAUTH]: Google Account Chooser callback triggered. ID Token received successfully.");
    try {
      console.log("[GOOGLE OAUTH]: Initiating verification on Express backend API...");
      await googleLogin(response.credential);
      console.log("[GOOGLE OAUTH]: Login verification completed successfully on backend.");
      setSuccess("Signed in successfully!");
      await sleep(500);
      router.push("/");
    } catch (err) {
      console.error("[GOOGLE OAUTH]: Authentication flow failed:", err.message);
      setError(err.message || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialResponseRef = useRef();
  handleCredentialResponseRef.current = handleCredentialResponse;

  useEffect(() => {
    const initializeGsi = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "703526369514-807bosvpektob98i87qr439mk5fkkn3t.apps.googleusercontent.com",
        callback: (response) => handleCredentialResponseRef.current?.(response),
      });

      // Render standard button in hidden container
      const container = document.getElementById("google-hidden-btn-container");
      if (container) {
        window.google.accounts.id.renderButton(container, {
          type: "standard",
          theme: "outline",
          size: "large",
        });
      }
    };

    if (window.google) {
      initializeGsi();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGsi;
    document.body.appendChild(script);
  }, []);

  const handleGoogleSignIn = () => {
    console.log("[GOOGLE OAUTH]: Custom Google button clicked. Launching standard Google OAuth flow...");
    const hiddenBtn = document.querySelector("#google-hidden-btn-container div[role=button]");
    if (hiddenBtn) {
      console.log("[GOOGLE OAUTH]: Programmatically clicking GSI standard button...");
      hiddenBtn.click();
    } else {
      console.log("[GOOGLE OAUTH]: GSI hidden button not found. Triggering prompt fallback...");
      window.google?.accounts.id.prompt();
    }
  };

  const searchParams = useSearchParams();
  const [tab, setTab] = useState("login");

  useEffect(() => {
    const qTab = searchParams.get("tab");
    if (qTab === "login" || qTab === "register") {
      setTab(qTab);
    }
  }, [searchParams]);

  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      image: "/auth-bg-1.png",
      title: (
        <>
          Capturing Moments,<br />
          Creating Memories
        </>
      ),
    },
    {
      image: "/auth-bg-2.png",
      title: (
        <>
          Convert Any Format,<br />
          Quick and Easy
        </>
      ),
    },
    {
      image: "/auth-bg-3.png",
      title: (
        <>
          Local Browser Power,<br />
          Ultra Secure
        </>
      ),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [terms, setTerms] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isRegister = tab === "register";

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const clearFeedback = () => {
    setError("");
    setSuccess("");
  };

  const handleRegister = async () => {
    clearFeedback();

    if (!firstName.trim() || !lastName.trim() || !regEmail.trim() || !regPass) {
      setError("Please fill all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(regEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (regPass.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!terms) {
      setError("Please accept Terms & Conditions.");
      return;
    }

    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      await register(fullName, regEmail.trim(), regPass);
      setSuccess("Account created successfully! Please log in with your credentials below.");
      
      // Reset registration input fields
      setFirstName("");
      setLastName("");
      setRegEmail("");
      setRegPass("");

      // Switch tab to login
      setTab("login");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    clearFeedback();

    if (!loginEmail.trim() || !loginPass) {
      setError("Enter credentials.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail.trim(), loginPass);
      setSuccess("Signed in successfully!");
      await sleep(400);
      router.push("/");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center overflow-hidden bg-[#5d576c] px-[18px] py-2 text-white sm:px-[18px]">
      <div className="grid h-[min(501px,calc(100vh-18px))] min-h-[500px] w-full max-w-[805px] overflow-hidden rounded-[9px] bg-[#2b2535] p-[11px] shadow-[0_22px_48px_rgba(20,16,30,0.34)] md:grid-cols-[390px_1fr]">
           <aside className="relative hidden h-full overflow-hidden rounded-[7px] md:block">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === activeSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={slide.image}
                  alt={`Slide ${idx + 1}`}
                  className="absolute inset-0 h-full w-full scale-125 object-cover object-[center_58%]"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-[#5d4bb0]/35 mix-blend-color" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#745bca]/55 via-[#211b2b]/20 to-[#130f1d]/82" />

            <div className="absolute left-[19px] top-[20px] text-[24px] font-bold leading-none tracking-[-0.06em] text-white font-outfit">
              AMU
            </div>

            <Link
              href="/"
              className="absolute right-[17px] top-[16px] inline-flex h-[22px] items-center gap-1.5 rounded-full bg-white/[0.14] px-2.5 text-[10px] text-white/90 backdrop-blur-md transition hover:bg-white/[0.22] z-10"
            >
              Back to website
              <ArrowRight size={11} />
            </Link>

            <div className="absolute bottom-[65px] left-[35px] right-[35px] h-[65px]">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-700 absolute inset-0 ${
                    idx === activeSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
                  }`}
                >
                  <h2 className="text-[20px] font-normal leading-[1.2] tracking-[-0.03em] text-white font-outfit">
                    {slide.title}
                  </h2>
                </div>
              ))}
            </div>

            <div className="absolute bottom-[22px] left-1/2 flex -translate-x-1/2 items-center gap-2.5 z-10">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeSlide ? "w-[29px] bg-white" : "w-[21px] bg-white/28 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </aside>

          <div className="flex h-full items-start justify-center px-6 pt-[39px] md:pl-[58px] md:pr-[47px]">
            <div className="w-full max-w-[285px]">
              <div className="mb-[31px]" style={{ marginBottom: 31 }}>
                <h1 className="mb-[17px] text-[34px] font-semibold leading-none tracking-[-0.04em] text-white">
                  {isRegister ? 'Create an account' : 'Welcome back'}
                </h1>
                <p className="text-[10px] text-[#a49cad]">
                  {isRegister ? 'Already have an account?' : 'Do not have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      clearFeedback();
                      setTab(isRegister ? 'login' : 'register');
                    }}
                    className="cursor-pointer bg-transparent p-0 text-[#d8d0ef] underline underline-offset-2"
                  >
                    {isRegister ? 'Log in' : 'Create account'}
                  </button>
                </p>
              </div>

              {(error || success) && (
                <div
                  className={`mb-[14px] flex items-start gap-2.5 rounded-[10px] border px-[12px] py-[10px] text-[10px] leading-[1.5] ${
                    error
                      ? "border-red-500/25 bg-red-500/10 text-red-200"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
                  }`}
                >
                  <span className="mt-[1px] shrink-0">
                    {error ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                  </span>
                  <span>{error || success}</span>
                </div>
              )}

              {isRegister ? (
                <div className="space-y-[13px]">
                  <div className="grid grid-cols-2 gap-[13px]">
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                    />
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>

                  <Input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Email"
                  />

                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder="Enter your password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center text-[#8e859e] transition hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  <label className="flex items-center gap-[10px] text-[8px] text-[#d5cedd]">
                    <input
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                      className="h-[14px] w-[14px] rounded-[2px] accent-white"
                    />
                    <span>
                      I agree to the{' '}
                      <Link href="/terms" className="text-[#dfd8ff] underline underline-offset-2">
                        Terms &amp; Conditions
                      </Link>
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={loading}
                    className="mt-[17px] flex h-[33px] w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-[#7757d8] text-[10px] font-semibold text-white transition hover:bg-[#8565e7] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-[13px]">
                  <Input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Email"
                  />

                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="Enter your password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center text-[#8e859e] transition hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  <div className="text-right">
                    <Link href="/forgot-password" className="text-[10px] text-[#d8d0ef] underline underline-offset-2">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={loading}
                    className="mt-[17px] flex h-[33px] w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-[#7757d8] text-[10px] font-semibold text-white transition hover:bg-[#8565e7] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </div>
              )}

              <div className="my-[14px] flex items-center gap-[11px]">
                <span className="h-px flex-1 bg-[#70667d]" />
                <span className="text-[8px] text-[#938a9f]">
                  Or {isRegister ? 'register' : 'login'} with
                </span>
                <span className="h-px flex-1 bg-[#70667d]" />
              </div>

              <div className="w-full flex justify-center">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="flex h-[34px] w-[210px] cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-[#5d4bb0]/55 bg-[#201a29]/60 text-[10px] font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition duration-250 hover:bg-[#2d253a] hover:border-[#7757d8] hover:shadow-[0_0_12px_rgba(119,87,216,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <GoogleSVG />
                  Continue with Google
                </button>
              </div>
          <div id="google-hidden-btn-container" style={{ display: "none" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
