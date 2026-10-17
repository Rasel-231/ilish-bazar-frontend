"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "react-toastify";
import { useLoginMutation } from "../api/auth.api";

interface FetchBaseQueryError {
  data?: {
    message?: string;
  };
}
interface SerializedError {
  message?: string;
}

const MailIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const FishIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
    <path d="M18 12v.5" />
    <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
    <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33" />
    <path d="m10.46 7.26-.02-.02" />
  </svg>
);

const Spinner: React.FC = () => (
  <svg
    className="animate-spin h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Login: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);

    if (!email.trim() || !password) {
      setCustomError("Please fill in all fields.");
      return;
    }

    try {
      const response = await login({ email: email.trim(), password }).unwrap();

      if (response?.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        toast.success("Welcome back to Ilish Bazar!");

        const rawRedirect = searchParams.get("redirect");
        const redirectTo = rawRedirect
          ? decodeURIComponent(rawRedirect)
          : "/dashboard";

        router.push(redirectTo);
      }
    } catch (error) {
      const fetchError = error as FetchBaseQueryError;
      const serialError = error as SerializedError;
      const errorMessage =
        fetchError.data?.message ||
        serialError.message ||
        "Invalid email or password. Please try again.";

      setCustomError(errorMessage);
      toast.error("Login failed!");
    }
  };

  return (
    <div className="relative flex min-h-[calc(100dvh)] w-full items-center justify-center overflow-hidden p-4 sm:p-6">
      <Image
        src="/images/hero/padma-hilsa.jpg"
        alt="Fresh Ilish from the Padma river"
        fill
        priority
        quality={90}
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/70 to-teal-950/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.25),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(251,191,36,0.15),transparent_55%)]" />

      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-amber-400/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />

      <div className="relative z-10 w-full max-w-md animate-[fadeInUp_0.6s_ease-out]">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-10">
          <div className="absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />

          <div className="mb-6 flex flex-col items-center sm:mb-8">
            <div className="relative mb-4 sm:mb-5">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-amber-400/40 to-emerald-500/40 blur-lg" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 text-slate-950 shadow-xl shadow-amber-500/30 sm:h-16 sm:w-16">
                <FishIcon />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-slate-900/40 bg-emerald-500" />
              </span>
            </div>

            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300 sm:mb-3">
              Premium Access
            </span>

            <h1 className="bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-center text-2xl font-black tracking-tight text-transparent sm:text-3xl">
              Welcome to Ilish Bazar
            </h1>
            <p className="mt-1.5 hidden max-w-xs text-center text-sm leading-relaxed text-slate-300 sm:mt-2 sm:block">
              Sign in to manage orders, track fresh deliveries and enjoy
              farm-to-door Ilish.
            </p>
          </div>

          {customError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/15 p-3.5 text-sm font-medium text-red-200 backdrop-blur-sm sm:mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{customError}</span>
            </div>
          )}

          <form className="space-y-4 sm:space-y-5" onSubmit={handleLoginSubmit} noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-amber-200/90"
              >
                Email address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <MailIcon />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all duration-200 backdrop-blur-sm focus:border-amber-300/60 focus:bg-white/15 focus:ring-2 focus:ring-amber-400/40 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-amber-200/90"
              >
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-11 pr-12 text-sm text-white placeholder-slate-400 outline-none transition-all duration-200 backdrop-blur-sm focus:border-amber-300/60 focus:bg-white/15 focus:ring-2 focus:ring-amber-400/40 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((v) => !v)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-amber-200 disabled:opacity-50"
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                >
                  {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-400/50 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-300">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-amber-300 transition-colors hover:text-amber-200"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 py-3.5 text-sm font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:scale-100"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex items-center justify-center gap-2.5">
                {isLoading ? (
                  <>
                    <Spinner />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </span>
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300 sm:mt-7">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-amber-300 transition-colors hover:text-amber-200"
            >
              Create one free
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center sm:mt-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-amber-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-0.5"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
