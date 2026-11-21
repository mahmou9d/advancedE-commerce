import { Navigate, Link } from "react-router-dom";
import useLogin from "@hooks/useLogin";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition focus:outline-none focus:ring-2 ${
    hasError
      ? "border-rose-400/60 focus:border-rose-400 focus:ring-rose-500/30"
      : "border-white/15 focus:border-blue-400 focus:ring-blue-500/40"
  }`;

const icons = {
  info: "M12 8h.01M11 12h1v5h1M12 21a9 9 0 100-18 9 9 0 000 18z",
  check: "M5 13l4 4L19 7",
  warn: "M12 9v4m0 4h.01M10.3 4.3L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z",
  arrow: "M5 12h14m-6-6l6 6-6 6",
};

const Icon = ({
  name,
  className = "h-5 w-5",
}: {
  name: keyof typeof icons;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d={icons[name]} />
  </svg>
);

const Login = () => {
  const {
    error,
    loading,
    accessToken,
    register,
    handleSubmit,
    formErrors,
    submitForm,
    searchParams,
  } = useLogin();

  if (accessToken) {
    return <Navigate to="/" />;
  }

  const message = searchParams.get("message");
  const isLoading = loading === "pending";

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

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:p-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-slate-400">Please login to your account</p>
        </div>

        {/* Messages */}
        {message === "login_required" && (
          <div
            role="status"
            className="mt-6 flex items-center gap-3 rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-200"
          >
            <Icon name="info" className="h-5 w-5 shrink-0" />
            You need to login to view this content
          </div>
        )}

        {message === "account_created" && (
          <div
            role="status"
            className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300"
          >
            <Icon name="check" className="h-5 w-5 shrink-0" />
            Your account was created successfully, please login
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(submitForm)}
          noValidate
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              aria-invalid={!!formErrors.email}
              aria-describedby={formErrors.email ? "email-error" : undefined}
              className={inputClass(!!formErrors.email)}
              {...register("email")}
            />
            {formErrors.email?.message && (
              <p
                id="email-error"
                role="alert"
                className="mt-2 text-xs text-rose-400"
              >
                {formErrors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className={`rounded text-sm font-semibold text-blue-400 hover:text-blue-300 ${focus}`}
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!formErrors.password}
              aria-describedby={
                formErrors.password ? "password-error" : undefined
              }
              className={inputClass(!!formErrors.password)}
              {...register("password")}
            />
            {formErrors.password?.message && (
              <p
                id="password-error"
                role="alert"
                className="mt-2 text-xs text-rose-400"
              >
                {formErrors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 ${focus}`}
          >
            {isLoading ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-5 w-5 motion-safe:animate-spin"
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
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <Icon name="arrow" />
              </>
            )}
          </button>

          {error && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300"
            >
              <Icon name="warn" className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Sign up */}
        <p className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className={`rounded font-semibold text-blue-400 hover:text-blue-300 ${focus}`}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
