import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLocationArrow, FaMobileAlt, FaCheckCircle } from "react-icons/fa";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const ContactUs: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-4">
            Customer Support
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Have questions about your order, shipping, or need help? Our support team is here 24/7 to assist you.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md space-y-6">
              <h2 className="text-xl font-bold text-white">Get in Touch</h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                    <FaLocationArrow className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Our Location</h3>
                    <p className="text-slate-400 mt-0.5">Cairo, Egypt</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                    <FaMobileAlt className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Phone</h3>
                    <a
                      href="tel:+21009014597"
                      className="text-slate-400 hover:text-white transition mt-0.5 block"
                    >
                      +20 100 901 4597
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                    <FaEnvelope className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Email Address</h3>
                    <a
                      href="mailto:mohnud0987@gmail.com"
                      className="text-blue-400 hover:text-blue-300 transition mt-0.5 block break-all font-mono text-xs"
                    >
                      mohnud0987@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/40 to-slate-900/80 p-6 backdrop-blur-md">
              <h3 className="font-bold text-white mb-2">Fast 24–48h Delivery</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Orders placed before 2 PM are processed the same day and dispatched immediately.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-md">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <FaCheckCircle className="h-16 w-16 text-emerald-400 mb-4 animate-bounce" />
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-300 max-w-md mx-auto text-sm">
                    Thank you, <strong>{name}</strong>. We received your inquiry and our support team will get back to you at <strong>{email}</strong> within a few hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setSubject("");
                      setMessage("");
                    }}
                    className={`mt-6 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 ${focus}`}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Order Inquiry / Shipping / Feedback"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 ${focus}`}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-4 text-center sm:text-left">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 ${focus}`}
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

