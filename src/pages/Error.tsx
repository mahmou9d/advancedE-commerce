import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const Error = () => {
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

      <main className="flex w-full max-w-lg flex-col items-center rounded-3xl border border-white/10 bg-slate-900/70 px-8 py-12 text-center shadow-2xl shadow-black/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:px-12">
        <div className="h-56 w-56 sm:h-72 sm:w-72" aria-hidden="true">
          <DotLottieReact
            src="https://lottie.host/30eb3236-0ecc-486d-8655-da6e741660b3/ep2ZM7q5gP.lottie"
            loop
            autoplay
          />
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-sm text-slate-400">
          Something went wrong, or the page you are looking for does not exist.
        </p>

        <Link
          to="/"
          replace
          className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 ${focus}`}
        >
          How about going back to safety?
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <path d="M5 12h14m-6-6l6 6-6 6" />
          </svg>
        </Link>
      </main>
    </div>
  );
};

export default Error;
