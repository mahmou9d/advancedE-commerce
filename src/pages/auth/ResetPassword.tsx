import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@store/firebase";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const getConfirmErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/expired-action-code":
      return "The reset link has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "This link is invalid or your password has already been changed. You can log in now.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    default:
      return "Failed to reset password. Please try again.";
  }
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract oobCode from URL query params
  const code = searchParams.get("oobCode") || searchParams.get("code") || "";

  const [targetEmail, setTargetEmail] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!code) return;

    setVerifying(true);
    setError(null);
    verifyPasswordResetCode(auth, code)
      .then((email) => {
        setTargetEmail(email);
        setCodeValid(true);
      })
      .catch((err) => {
        if (err instanceof FirebaseError) {
          setError(getConfirmErrorMessage(err.code));
        } else {
          setError("Invalid or expired reset link.");
        }
        setCodeValid(false);
      })
      .finally(() => {
        setVerifying(false);
      });
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      setError("No reset token found. Please use the link sent to your email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await confirmPasswordReset(auth, code, password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login?message=password_reset");
      }, 2500);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(getConfirmErrorMessage(err.code));
      } else {
        setError("Failed to update password. Please try again.");
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {targetEmail
              ? `Enter your new password for ${targetEmail}`
              : "Enter your new password below"}
          </p>
        </div>

        {verifying ? (
          /* Verifying spinner */
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Verifying reset link...</p>
          </div>
        ) : success ? (
          /* Success Screen */
          <div className="mt-8 space-y-6 text-center">
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6">
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
              <h3 className="font-bold text-emerald-300 text-lg">
                Password Changed!
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                Your password has been successfully updated. You can now login with your new credentials.
              </p>
              <p className="mt-3 text-[11px] text-slate-400">
                Redirecting to login page in 3 seconds...
              </p>
            </div>

            <Link
              to="/login?message=password_reset"
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition ${focus}`}
            >
              Go to Login Now
            </Link>
          </div>
        ) : !code || !codeValid ? (
          /* If no code or code invalid/already used */
          <div className="mt-8 space-y-5 text-center">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white">
                Password Reset Status
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {error ||
                  "If you clicked the reset link in your email and already changed your password, your account is updated! You can log in directly."}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition ${focus}`}
              >
                Go to Login
              </Link>
              <Link
                to="/forgot-password"
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 transition ${focus}`}
              >
                Request a New Reset Link
              </Link>
            </div>
          </div>
        ) : (
          /* Reset Form - ONLY New Password and Confirm Password */
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {targetEmail && (
              <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-3.5 py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Account:</span>
                <span className="font-semibold text-blue-300 font-mono">
                  {targetEmail}
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-slate-300"
                >
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
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
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Confirm & Reset Password</span>
              )}
            </button>

            <div className="pt-2 text-center text-sm text-slate-400">
              <Link
                to="/login"
                className={`font-semibold text-blue-400 hover:text-blue-300 ${focus}`}
              >
                Cancel and return to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
