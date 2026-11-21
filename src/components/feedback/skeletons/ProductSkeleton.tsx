import ContentLoader from "react-content-loader";

const COUNT = 8;

const ProductSkeleton = () => (
  <div
    role="status"
    aria-busy="true"
    aria-live="polite"
    className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
  >
    <span className="sr-only">Loading products...</span>

    {Array.from({ length: COUNT }, (_, i) => (
      <div
        key={i}
        className="rounded-3xl border border-white/15 bg-slate-900/70 p-3 shadow-2xl shadow-black/50 backdrop-blur-md"
      >
        <ContentLoader
          speed={2}
          viewBox="0 0 300 450"
          backgroundColor="#1e293b"
          foregroundColor="#334155"
          className="block w-full"
          aria-hidden="true"
        >
          {/* Image */}
          <rect x="0" y="0" rx="16" ry="16" width="300" height="300" />
          {/* Discount badge */}
          <rect x="12" y="12" rx="14" ry="14" width="56" height="28" />
          {/* Wishlist button */}
          <circle cx="270" cy="30" r="18" />

          {/* Category label + title */}
          <rect x="8" y="326" rx="4" ry="4" width="64" height="10" />
          <rect x="8" y="348" rx="5" ry="5" width="150" height="16" />

          {/* Price + old price */}
          <rect x="226" y="324" rx="5" ry="5" width="66" height="20" />
          <rect x="242" y="352" rx="4" ry="4" width="50" height="10" />

          {/* Stock line */}
          <rect x="8" y="384" rx="4" ry="4" width="110" height="10" />

          {/* Add to cart button */}
          <rect x="0" y="408" rx="12" ry="12" width="300" height="42" />
        </ContentLoader>
      </div>
    ))}
  </div>
);

export default ProductSkeleton;
