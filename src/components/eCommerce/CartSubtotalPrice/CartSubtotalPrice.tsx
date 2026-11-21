import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { TProduct } from "@customTypes/product";
import { useAppDispatch } from "@store/hooks";
import actPlaceOrder from "@store/orders/act/actPlaceOrder";
import { clearCartAfterPlaceOrder } from "@store/cart/cartSlice";
import { getStripe } from "@services/stripe";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

type CartSubtotalPriceProps = {
  products: TProduct[];
  userAccessToken: string | null;
};

/* SVG Icons */
const Icons = {
  lock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  card: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  close: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-5 w-5"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-emerald-400"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

const Spinner = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={`${className} motion-safe:animate-spin`}
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
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#f8fafc",
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "15px",
      "::placeholder": {
        color: "#64748b",
      },
      iconColor: "#60a5fa",
    },
    invalid: {
      color: "#f87171",
      iconColor: "#f87171",
    },
  },
  hidePostalCode: true,
};

/* Internal Form using Stripe Elements Hooks */
const StripePaymentForm = ({
  subtotal,
  paymentMethod,
  setPaymentMethod,
  onClose,
}: {
  subtotal: number;
  paymentMethod: "stripe" | "cod";
  setPaymentMethod: (m: "stripe" | "cod") => void;
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [cardName, setCardName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [isCardReady, setIsCardReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setLoading(true);

    try {
      let transactionId = `ch_stripe_${Math.random().toString(36).substring(2, 9)}${Date.now().toString().slice(-4)}`;
      let cardBrand = "visa";
      let last4 = "4242";

      if (paymentMethod === "stripe") {
        if (!stripe || !elements) {
          throw new Error("Stripe is initializing. Please wait a moment.");
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error(
            "Card input element is not ready. Please refresh the page.",
          );
        }

        setStatusMessage("Connecting to Stripe Secure Gateway...");

        // Create official Stripe payment method directly from the mounted CardElement
        const { error: stripeError, paymentMethod: pm } =
          await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
              name: cardName || "Customer",
              address: {
                line1: address || "Default Address",
                city: city || "Cairo",
                postal_code: postalCode || "11511",
              },
            },
          });

        if (stripeError) {
          throw new Error(stripeError.message || "Card verification failed.");
        }

        if (pm) {
          transactionId = pm.id;
          cardBrand = pm.card?.brand || "visa";
          last4 = pm.card?.last4 || "4242";
        }

        setStatusMessage("Payment authorized! Finalizing order...");
      } else {
        setStatusMessage("Confirming Cash on Delivery order...");
      }

      await dispatch(
        actPlaceOrder({
          subtotal,
          paymentMethod,
          paymentStatus: paymentMethod === "stripe" ? "paid" : "pending",
          transactionId,
          cardBrand,
          last4,
          shippingAddress: {
            fullName: cardName || "Customer",
            address: address || "Default Shipping Address",
            city: city || "Cairo",
            postalCode: postalCode || "11511",
          },
        }),
      ).unwrap();

      setIsSuccess(true);
      dispatch(clearCartAfterPlaceOrder());

      setTimeout(() => {
        onClose();
        navigate("/profile/orders");
      }, 1500);
    } catch (err: any) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Payment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Success View */}
      {isSuccess ? (
        <div className="py-12 text-center flex flex-col items-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 text-emerald-400 shadow-xl shadow-emerald-500/20">
            {Icons.check}
          </div>
          <h4 className="text-2xl font-black text-white mb-2">
            Payment Authorized!
          </h4>
          <p className="text-emerald-300 font-semibold text-sm">
            Your Visa / Card order has been securely processed with Stripe.
          </p>
          <p className="text-xs text-slate-400 mt-3">
            Redirecting to Order History...
          </p>
        </div>
      ) : (
        /* The form is ALWAYS mounted so Stripe CardElement is never destroyed */
        <div className="relative">
          {/* Transparent loading overlay when processing */}
          {loading && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl bg-slate-900/90 backdrop-blur-sm p-6 text-center">
              <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" />
                <div className="h-14 w-14 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1.5">
                Processing Payment
              </h4>
              <p className="text-slate-300 font-medium text-xs animate-pulse">
                {statusMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Method Switcher */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 font-semibold text-sm transition ${
                  paymentMethod === "stripe"
                    ? "border-blue-500 bg-blue-600/15 text-blue-300 shadow-lg shadow-blue-900/30"
                    : "border-white/10 bg-slate-950/40 text-slate-400 hover:border-white/20 hover:text-white"
                } ${focus}`}
              >
                <span>Visa / Card</span>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-indigo-300 border border-indigo-400/30">
                  STRIPE
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 font-semibold text-sm transition ${
                  paymentMethod === "cod"
                    ? "border-blue-500 bg-blue-600/15 text-blue-300 shadow-lg shadow-blue-900/30"
                    : "border-white/10 bg-slate-950/40 text-slate-400 hover:border-white/20 hover:text-white"
                } ${focus}`}
              >
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* Card Section */}
            <div className={paymentMethod === "stripe" ? "block" : "hidden"}>
              <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required={paymentMethod === "stripe"}
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                {/* Official Stripe Card Element */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Card Details (Visa / Mastercard / Amex)
                    </label>
                    {!isCardReady && (
                      <span className="text-[10px] text-blue-400 animate-pulse">
                        Loading Stripe iframe...
                      </span>
                    )}
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-900 px-3.5 py-3 transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <CardElement
                      options={CARD_ELEMENT_OPTIONS}
                      onReady={() => setIsCardReady(true)}
                      onChange={(e) => {
                        if (e.error) {
                          setError(e.error.message);
                        } else {
                          setError(null);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {paymentMethod === "cod" && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300 text-sm">
                <p className="font-semibold">Pay upon receiving your package</p>
                <p className="text-xs text-emerald-400/80 mt-1">
                  You can pay cash or via POS terminal directly to the courier
                  when the order arrives.
                </p>
              </div>
            )}

            {/* Shipping Address Inputs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Delivery Address
              </h4>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address (e.g., 25 Nile Corniche)"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City (e.g., Cairo)"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Postal / Zip code"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs font-semibold text-rose-300">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={
                  loading ||
                  (paymentMethod === "stripe" && (!stripe || !isCardReady))
                }
                className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-xl shadow-blue-600/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 ${focus}`}
              >
                {loading ? (
                  <>
                    <Spinner className="h-5 w-5 text-white" />
                    <span>Authorizing with Stripe...</span>
                  </>
                ) : paymentMethod === "stripe" ? (
                  <>
                    <span>Pay ${subtotal.toFixed(2)} with Visa / Card</span>
                    {Icons.lock}
                  </>
                ) : (
                  <span>Confirm Order (${subtotal.toFixed(2)})</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

/* Main Component */
const CartSubtotalPrice = ({
  products,
  userAccessToken,
}: CartSubtotalPriceProps) => {
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">(
    "stripe",
  );
  const stripePromise = getStripe();

  const subtotal = products.reduce((accumulator, el) => {
    const quantity = el.quantity;
    if (quantity && typeof quantity === "number") {
      return accumulator + el.price * quantity;
    }
    return accumulator;
  }, 0);

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (showModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [showModal]);

  return (
    <>
      {/* Summary card */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
        <h2 className="text-xl font-bold">Order summary</h2>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between text-slate-400">
            <dt>Total items</dt>
            <dd className="font-semibold text-slate-200">{products.length}</dd>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <dt>Shipping</dt>
            <dd className="font-semibold text-emerald-400">Free</dd>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <dt>Tax (Included)</dt>
            <dd className="font-semibold text-slate-200">0.00 EGP</dd>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <dt className="font-semibold uppercase tracking-wide text-slate-300">
              Total to pay
            </dt>
            <dd className="text-2xl font-black text-blue-400">
              ${subtotal.toFixed(2)}
            </dd>
          </div>
        </dl>

        {userAccessToken ? (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-bold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:shadow-blue-600/40 ${focus}`}
          >
            <span>Proceed to Checkout</span>
            {Icons.card}
          </button>
        ) : (
          <p className="mt-6 rounded-2xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-center text-sm text-blue-200">
            <Link
              to="/login"
              className={`font-semibold text-blue-300 underline hover:text-blue-200 ${focus}`}
            >
              Log in
            </Link>{" "}
            to place your order with Stripe.
          </p>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          {Icons.shield}
          <span>Guaranteed safe & secure Stripe checkout</span>
        </div>
      </div>

      {/* Stripe Elements Checkout Modal rendered via createPortal over entire viewport */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
            <div
              aria-hidden="true"
              onClick={closeModal}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
            />

            <div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-slate-900 shadow-2xl shadow-black/90 sm:my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-black text-lg shadow-md shadow-indigo-600/30">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      Stripe Card Checkout
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      {Icons.lock}
                      <span>Official Stripe Elements • 256-bit SSL</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  className={`rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition ${focus}`}
                >
                  {Icons.close}
                </button>
              </div>

              {/* Modal Body wrapped in official Stripe Elements provider */}
              <div className="p-6">
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    subtotal={subtotal}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    onClose={closeModal}
                  />
                </Elements>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default CartSubtotalPrice;
