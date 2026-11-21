import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { actGetOffers, offersRecordsCleanUp } from "@store/offers/offersSlice";
import { GridList } from "@components/common";
import { Loading } from "@components/feedback";
import { Product } from "@components/eCommerce";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const icons = {
  tag: "M3 12V4a1 1 0 011-1h8l9 9-9 9-9-9zm5-5h.01",
  inbox:
    "M4 13l2-8h12l2 8M4 13v6a1 1 0 001 1h14a1 1 0 001-1v-6M4 13h5l1 2h4l1-2h5",
  chevronLeft:
    "M15 19l-7-7 7-7",
  chevronRight:
    "M9 5l7 7-7 7",
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
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d={icons[name]} />
  </svg>
);

const Offers = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishListItemsId = useAppSelector((state) => state.wishlist.itemsId);
  const userAccessToken = useAppSelector((state) => state.auth.accessToken);

  const {
    loading,
    error,
    records: offers,
  } = useAppSelector((state) => state.offers);

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [filterDiscount, setFilterDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"discount" | "price-asc" | "price-desc">("discount");

  useEffect(() => {
    const promise = dispatch(actGetOffers());
    return () => {
      promise.abort();
      dispatch(offersRecordsCleanUp());
    };
  }, [dispatch]);

  // Reset to page 1 on filter/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDiscount, sortBy, pageSize]);

  // Enriched products with auth and cart data
  const allOfferProducts = useMemo(() => {
    return offers.map((el) => ({
      ...el,
      quantity: cartItems[el.id] || 0,
      isLiked: wishListItemsId.includes(el.id as number),
      isAutehnticated: userAccessToken ? true : false,
    }));
  }, [offers, cartItems, wishListItemsId, userAccessToken]);

  // Filter and sort
  const processedOffers = useMemo(() => {
    let result = [...allOfferProducts];

    // Filter by discount percentage
    if (filterDiscount > 0) {
      result = result.filter((p) => (p.offer || 0) >= filterDiscount);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "discount") {
        return (b.offer || 0) - (a.offer || 0);
      }
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      return 0;
    });

    return result;
  }, [allOfferProducts, filterDiscount, sortBy]);

  // Pagination calculation
  const totalCount = processedOffers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const currentOffers = processedOffers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Header Banner */}
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
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-sm font-semibold text-blue-300">
            <Icon name="tag" className="h-4 w-4" />
            Special Deals & Discounts
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
            Hot Offers
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
            Exclusive limited-time price drops on top-selling items.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        {/* Controls Bar: Filters, Sort & Items per page */}
        {allOfferProducts.length > 0 && (
          <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            {/* Filter by discount */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
                Discount:
              </span>
              {[
                { label: "All Deals", value: 0 },
                { label: "15%+ Off", value: 15 },
                { label: "20%+ Off", value: 20 },
                { label: "25%+ Off", value: 25 },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setFilterDiscount(tab.value)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    filterDiscount === tab.value
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "border border-white/10 bg-slate-950/40 text-slate-400 hover:text-white hover:border-white/20"
                  } ${focus}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sorting & Page Size */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none"
                >
                  <option value="discount">Biggest Discount 🔥</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none"
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <Loading loading={loading} error={error} type="product">
          {processedOffers.length > 0 ? (
            <>
              {/* Product Counter Summary */}
              <div className="mb-6 flex items-center justify-between text-xs text-slate-400">
                <p>
                  Showing <strong className="text-white">{startIndex + 1}</strong>–
                  <strong className="text-white">{endIndex}</strong> of{" "}
                  <strong className="text-white">{totalCount}</strong> deals
                </p>
                <p>
                  Page <strong className="text-white">{currentPage}</strong> of{" "}
                  <strong className="text-white">{totalPages}</strong>
                </p>
              </div>

              {/* Grid of current page items */}
              <GridList
                records={currentOffers}
                renderItem={(record) => <Product {...record} showOffer={true} />}
              />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
                  <div className="text-xs text-slate-400">
                    Showing {startIndex + 1}–{endIndex} of {totalCount} total discounted products
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Page Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex h-10 items-center justify-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 px-3.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed ${focus}`}
                    >
                      <Icon name="chevronLeft" className="h-4 w-4" />
                      <span>Previous</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                            : "border border-white/10 bg-slate-900/80 text-slate-400 hover:border-white/20 hover:text-white"
                        } ${focus}`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next Page Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex h-10 items-center justify-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 px-3.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed ${focus}`}
                    >
                      <span>Next</span>
                      <Icon name="chevronRight" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div
              role="status"
              className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/10 bg-slate-900/70 px-8 py-14 text-center shadow-2xl backdrop-blur-md"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                <Icon name="inbox" className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">No offers available</h3>
              <p className="mt-2 text-sm text-slate-400">
                {filterDiscount > 0
                  ? `No products currently have a discount of ${filterDiscount}% or more.`
                  : "Check back later for amazing deals!"}
              </p>
              {filterDiscount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterDiscount(0)}
                  className={`mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition ${focus}`}
                >
                  Clear Discount Filter
                </button>
              )}
            </div>
          )}
        </Loading>
      </section>
    </div>
  );
};

export default Offers;
