import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { CartItemList, CartSubtotalPrice } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import useCart from "@hooks/useCart";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const icons = {
  cart: "M3 4h2l2.4 11h10.2L20 7H6.2M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z",
  arrow: "M5 12h14m-6-6l6 6-6 6",
  check: "M5 13l4 4L19 7",
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

const SHOP_BUTTON = `mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 ${focus}`;

const Cart = () => {
  const {
    loading,
    error,
    products,
    changeQuantityHandler,
    removeItemHandler,
    userAccessToken,
    placeOrderStatus,
  } = useCart();

  const orderPlaced = placeOrderStatus === "succeeded";

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Header */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950"
        />
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-20">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
            <Icon name="cart" className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Shopping cart
          </h1>
          {products.length > 0 && (
            <p className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
              {products.length} {products.length === 1 ? "item" : "items"} in
              your cart
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Loading loading={loading} error={error} type="cart">
          {products.length <= 0 ? (
            <div
              role="status"
              className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-white/10 bg-slate-900/70 px-8 py-12 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            >
              <div className="h-56 w-56 sm:h-64 sm:w-64" aria-hidden="true">
                <DotLottieReact
                  src={
                    orderPlaced
                      ? "https://lottie.host/f4dda71b-d88e-44f0-aa30-8654020d3883/h2letYNFID.lottie"
                      : "https://lottie.host/e2878abd-3c69-497e-9f50-14ae417dc69e/K0hRm8Yxcw.lottie"
                  }
                  loop
                  autoplay
                />
              </div>

              {orderPlaced ? (
                <>
                  <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                    <Icon name="check" className="h-6 w-6" />
                  </span>
                  <h2 className="mt-5 text-2xl font-bold">
                    Order placed successfully!
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                    Thank you for your purchase. Your order is being processed
                    and you&apos;ll receive a confirmation email shortly.
                  </p>
                  <Link to="/categories" className={SHOP_BUTTON}>
                    Continue shopping
                    <Icon name="arrow" />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-2xl font-bold">
                    Your cart is empty
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Looks like you haven&apos;t added anything to your cart yet.
                  </p>
                  <Link to="/categories" className={SHOP_BUTTON}>
                    Start shopping
                    <Icon name="arrow" />
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] sm:p-6">
                <CartItemList
                  products={products}
                  changeQuantityHandler={changeQuantityHandler}
                  removeItemHandler={removeItemHandler}
                />
              </div>

              <aside className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] lg:sticky lg:top-6">
                <CartSubtotalPrice
                  products={products}
                  userAccessToken={userAccessToken}
                />
              </aside>
            </div>
          )}
        </Loading>
      </section>
    </div>
  );
};

export default Cart;
