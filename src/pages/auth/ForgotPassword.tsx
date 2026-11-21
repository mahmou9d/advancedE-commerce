import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@store/firebase";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const getResetErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes before trying again.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connection.";
    default:
      return "Failed to send reset email. Please try again.";
  }
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Directs the user back to your app's login route after completing password reset on the link
      const actionCodeSettings = {
        url: `${window.location.origin}/login?message=password_reset`,
        handleCodeInApp: false,
      };

      try {
        await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
      } catch (err: any) {
        // If domain isn't whitelisted for deep-link in Firebase console, fallback to standard email
        if (err?.code === "auth/unauthorized-continue-uri") {
          await sendPasswordResetEmail(auth, email.trim());
        } else {
          throw err;
        }
      }

      setSuccess(true);
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(getResetErrorMessage(err.code));
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-16 font-sans text-slate-100 antialiased">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl"
      />

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/50 backdrop-blur-md sm:p-10">
        {/* Brand / Return to Store Link */}
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10 hover:border-white/10"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white shadow-md shadow-blue-500/30">
              P
            </span>
            <span>
              Prime<span className="text-blue-400">Ecom</span>
            </span>
            <span className="text-xs text-slate-400 group-hover:text-slate-200">
              ← Back to Store
            </span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email to receive a password reset link
          </p>
        </div>

        {success ? (
          /* Success Screen */
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-bold text-emerald-300 text-base">
                Check Your Inbox!
              </h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                We sent a password reset link to:
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-white break-all bg-slate-950/60 py-1 px-3 rounded-lg border border-white/5 inline-block">
                {email}
              </p>
              <p className="mt-3 text-[11px] text-slate-400">
                Please check your inbox (and spam/junk folder) and click the
                link in the email to set your new password.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                disabled={cooldown > 0 || loading}
                onClick={handleSubmit}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${focus}`}
              >
                {loading
                  ? "Resending..."
                  : cooldown > 0
                    ? `Resend Link in ${cooldown}s`
                    : "Resend Reset Link"}
              </button>

              <Link
                to="/login"
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition ${focus}`}
              >
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="reset-email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Registered Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-center gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300"
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 ${focus}`}
            >
              {loading ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 animate-spin"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M21 12a9 9 0 00-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Email</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>

            <div className="pt-2 text-center text-sm text-slate-400">
              Remember your password?{" "}
              <Link
                to="/login"
                className={`font-semibold text-blue-400 hover:text-blue-300 ${focus}`}
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
