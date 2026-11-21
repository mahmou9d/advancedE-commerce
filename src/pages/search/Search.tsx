import { useMemo } from "react";
import { Link } from "react-router-dom";
import { GridList } from "@components/common";
import { Product } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import { useAppSelector } from "@store/hooks";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const icons = {
  search: "M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z",
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

const Search = () => {
  const { searchText, records, loading, error } = useAppSelector(
    (state) => state.search,
  );
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishListItemsId = useAppSelector((state) => state.wishlist.itemsId);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const filterProducts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return records
      .map((el) => ({
        ...el,
        quantity: cartItems[el.id] || 0,
        isLiked: wishListItemsId.includes(el.id as number),
        isAutehnticated: !!accessToken,
      }))
      .filter((p) => p.title.toLowerCase().includes(query));
  }, [records, cartItems, wishListItemsId, accessToken, searchText]);

  const count = filterProducts.length;

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
            <Icon name="search" className="h-7 w-7" />
          </span>

          {searchText ? (
            <>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Search results
              </h1>
              <p
                role="status"
                className="mx-auto mt-4 max-w-xl break-words text-lg text-slate-300"
              >
                {loading === "pending"
                  ? "Searching..."
                  : `${count} ${count === 1 ? "result" : "results"} for “${searchText}”`}
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                All products
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
                Browse our complete collection of verified products.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Loading loading={loading} error={error} type="product">
          {count > 0 ? (
            <GridList
              records={filterProducts}
              renderItem={(record) => <Product {...record} />}
            />
          ) : (
            <div
              role="status"
              className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/10 bg-slate-900/70 px-8 py-14 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                <Icon name="search" className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">No results found</h3>
              <p className="mt-2 break-words text-sm leading-relaxed text-slate-400">
                {searchText
                  ? `We couldn't find any products matching “${searchText}”. Try searching for something else.`
                  : "Start searching using the top bar to find products."}
              </p>
              <Link
                to="/categories"
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 ${focus}`}
              >
                Browse categories
                <Icon name="arrow" />
              </Link>
            </div>
          )}
        </Loading>
      </section>
    </div>
  );
};

export default Search;
