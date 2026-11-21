import { Link } from "react-router-dom";
import { GridList } from "@components/common";
import { Product } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import useWishlist from "@hooks/useWishlist";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const icons = {
  heart:
    "M12 21s-7-4.6-9.3-9.2C1.3 8.9 3 5.5 6.3 5.5c2 0 3.2 1 3.7 2 .5-1 1.7-2 3.7-2 3.3 0 5 3.4 3.6 6.3C19 16.4 12 21 12 21z",
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

const WishList = () => {
  const { loading, error, records } = useWishlist();

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
          className="absolute -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-rose-600/15 blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-20">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10 text-rose-400">
            <Icon name="heart" className="h-7 w-7 fill-current" />
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Your wishlist
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
            {records.length > 0
              ? `${records.length} ${
                  records.length === 1 ? "item" : "items"
                } saved for later`
              : "Save your favorite items here"}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Loading loading={loading} error={error} type="product">
          {records.length > 0 ? (
            <GridList
              records={records}
              renderItem={(record) => <Product {...record} />}
            />
          ) : (
            <div
              role="status"
              className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/10 bg-slate-900/70 px-8 py-14 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10 text-rose-400">
                <Icon name="heart" className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">
                Your wishlist is empty
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Start adding items you love to your wishlist.
              </p>
              <Link
                to="/categories"
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 ${focus}`}
              >
                Start shopping
                <Icon name="arrow" />
              </Link>
            </div>
          )}
        </Loading>
      </section>
    </div>
  );
};

export default WishList;
