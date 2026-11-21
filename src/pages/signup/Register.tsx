import { Navigate, Link } from "react-router-dom";
import type { UseFormRegisterReturn } from "react-hook-form";
import useRegister from "@hooks/useRegister";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const icons = {
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

/* ---------- Reusable field ---------- */
type FieldProps = {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  hint?: string;
  success?: string;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const Field = ({
  id,
  label,
  registration,
  type = "text",
  placeholder,
  autoComplete,
  error,
  hint,
  success,
  disabled,
  onBlur,
}: FieldProps) => {
  const messageId = `${id}-message`;
  const hasMessage = !!(error || hint || success);

  const border = error
    ? "border-rose-400/60 focus:border-rose-400 focus:ring-rose-500/30"
    : success
      ? "border-emerald-400/50 focus:border-emerald-400 focus:ring-emerald-500/30"
      : "border-white/15 focus:border-blue-400 focus:ring-blue-500/40";

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={hasMessage ? messageId : undefined}
        className={`w-full rounded-xl border bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${border}`}
        {...registration}
        onBlur={(e) => {
          registration.onBlur(e);
          onBlur?.(e);
        }}
      />
      {error ? (
        <p id={messageId} role="alert" className="mt-2 text-xs text-rose-400">
          {error}
        </p>
      ) : success ? (
        <p
          id={messageId}
          role="status"
          className="mt-2 text-xs text-emerald-400"
        >
          {success}
        </p>
      ) : hint ? (
        <p id={messageId} role="status" className="mt-2 text-xs text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

/* ---------- Page ---------- */
const Register = () => {
  const {
    loading,
    error,
    accessToken,
    formErrors,
    emailAvailabilityStatus,
    submitForm,
    register,
    handleSubmit,
    emailOnBlurHandler,
  } = useRegister();

  if (accessToken) {
    return <Navigate to="/" />;
  }

  const isLoading = loading === "pending";
  const isChecking = emailAvailabilityStatus === "checking";

  const emailError =
    formErrors.email?.message ||
    (emailAvailabilityStatus === "notAvailable"
      ? "This email is already in use."
      : emailAvailabilityStatus === "failed"
        ? "Error from the server."
        : "");

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

      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:p-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
          <p className="mt-2 text-slate-400">Join us today and get started</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(submitForm)}
          noValidate
          className="mt-8 space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="firstName"
              label="First name"
              placeholder="Enter your first name"
              autoComplete="given-name"
              registration={register("firstName")}
              error={formErrors.firstName?.message}
            />
            <Field
              id="lastName"
              label="Last name"
              placeholder="Enter your last name"
              autoComplete="family-name"
              registration={register("lastName")}
              error={formErrors.lastName?.message}
            />
          </div>

          <Field
            id="email"
            label="Email address"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            registration={register("email")}
            onBlur={emailOnBlurHandler}
            error={emailError}
            hint={
              isChecking ? "Checking if this email is available..." : undefined
            }
            success={
              emailAvailabilityStatus === "available"
                ? "This email is available for use."
                : undefined
            }
            disabled={isChecking || isLoading}
          />

          <Field
            id="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            registration={register("password")}
            error={formErrors.password?.message}
          />

          <Field
            id="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            registration={register("confirmPassword")}
            error={formErrors.confirmPassword?.message}
          />

          <button
            type="submit"
            disabled={isChecking || isLoading}
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
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create account</span>
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

        {/* Sign in */}
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className={`rounded font-semibold text-blue-400 hover:text-blue-300 ${focus}`}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
