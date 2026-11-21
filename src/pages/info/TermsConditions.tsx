import React from "react";
import { Link } from "react-router-dom";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-4">
            Legal Terms
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Last updated: November 2026 • Please read carefully before purchasing
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-8 text-slate-300 leading-relaxed text-sm sm:text-base">
          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using PrimeEcom, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you may not use our service.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              2. Orders and Pricing
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
              <li>All product prices are listed in USD or EGP as specified on the store.</li>
              <li>We reserve the right to correct pricing errors or cancel orders arising from typographical inaccuracies.</li>
              <li>Orders are subject to product availability and confirmation of payment through Stripe or Cash on Delivery.</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              3. Shipping & Delivery
            </h2>
            <p>
              We provide standard 24–48 hour delivery for domestic orders. Estimated delivery times are provided in good faith and may vary due to unforeseen logistical factors.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              4. Return & Refund Policy
            </h2>
            <p>
              You may request a return within <strong>30 days</strong> of receiving your package, provided the product remains in its original packaging and undamaged condition. Refunds for card payments will be processed via Stripe within 5–7 business days.
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="pt-4 text-center sm:text-left">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 ${focus}`}
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;

