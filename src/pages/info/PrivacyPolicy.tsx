import React from "react";
import { Link } from "react-router-dom";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-4">
            Security & Trust
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Last updated: November 2026 • Effective immediately
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-8 text-slate-300 leading-relaxed text-sm sm:text-base">
          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              1. Information We Collect
            </h2>
            <p>
              When you use PrimeEcom, we collect essential information to process your orders and provide a personalized shopping experience:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
              <li><strong>Personal Details:</strong> Name, email address, shipping and billing address.</li>
              <li><strong>Payment Information:</strong> Handled securely through Stripe using 256-bit encryption. We never store your full card numbers.</li>
              <li><strong>Order History:</strong> Details of items purchased, transaction IDs, and delivery statuses.</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              2. How We Protect Your Data
            </h2>
            <p>
              We implement industry-leading technical and organizational security measures to protect your personal information against unauthorized access, alteration, or disclosure:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
              <li>End-to-end SSL/TLS encryption for all data transmissions.</li>
              <li>PCI-DSS Level 1 compliant card processing via Stripe.</li>
              <li>Firebase secure authentication rules and role-based access control.</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              3. Cookies and Tracking
            </h2>
            <p>
              We use necessary cookies and local storage tokens to keep you logged in, retain your cart items, and save your wishlist preferences across browsing sessions. We do not sell your personal data to third-party advertisers.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              4. Your Rights & Inquiries
            </h2>
            <p>
              You have the right to access, rectify, or request deletion of your personal data at any time. For privacy-related questions or data requests, please contact our Data Protection Officer at:
            </p>
            <p className="font-mono text-blue-400">mohnud0987@gmail.com</p>
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

export default PrivacyPolicy;

