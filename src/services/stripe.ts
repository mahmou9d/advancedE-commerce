import { loadStripe, Stripe } from "@stripe/stripe-js";

// Official Stripe publishable key (Reads from env or uses standard Stripe test key)
const STRIPE_PUBLIC_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIUwTmDividAfHTAcfbLnwgvn0026e6l7g";

let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

