import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TProduct } from "@customTypes/product";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addToCart } from "@store/cart/cartSlice";
import actLikeToggle from "@store/wishlist/act/actLikeToggle";
import { addToast } from "@store/toasts/toastsSlice";
import ProductReviews from "./ProductReviews";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

/* SVG Icons */
const Icons = {
  cart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  heartOutline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-400">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-emerald-400">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  rotate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-amber-400">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-amber-400">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<TProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "shipping" | "reviews">("overview");

  const { user } = useAppSelector((state) => state.auth);
  const wishlistItemsId = useAppSelector((state) => state.wishlist.itemsId);
  const cartItems = useAppSelector((state) => state.cart.items);

  const isLiked = product ? wishlistItemsId.includes(Number(product.id)) : false;
  const isInCart = product ? Boolean(cartItems[product.id]) : false;

  // Fetch product details
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const key = id.startsWith("p") ? id : `p${id}`;

    // First attempt direct fetch by key
    axios
      .get<TProduct>(`/products/${key}.json`)
      .then((res) => {
        if (res.data) {
          setProduct({ ...res.data, id: res.data.id || id });
          // Fetch related products from same category
          if (res.data.cat_prefix) {
            fetchRelated(res.data.cat_prefix, res.data.id || id);
          }
        } else {
          // Fallback: search all products
          searchAll(id);
        }
      })
      .catch(() => {
        searchAll(id);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const searchAll = (productId: string) => {
    axios
      .get<Record<string, TProduct>>("/products.json")
      .then((res) => {
        if (!res.data) {
          setError("Product not found.");
          return;
        }
        const found = Object.values(res.data).find(
          (p) => String(p.id) === String(productId) || `p${p.id}` === productId
        );
        if (found) {
          setProduct(found);
          if (found.cat_prefix) {
            fetchRelated(found.cat_prefix, found.id);
          }
        } else {
          setError("Product not found.");
        }
      })
      .catch(() => {
        setError("Failed to load product details.");
      });
  };

  const fetchRelated = (prefix: string, currentId: number | string) => {
    axios
      .get<Record<string, TProduct>>("/products.json")
      .then((res) => {
        if (!res.data) return;
        const items = Object.values(res.data)
          .filter(
            (p) =>
              p.cat_prefix === prefix && String(p.id) !== String(currentId)
          )
          .slice(0, 4);
        setRelatedProducts(items);
      })
      .catch(() => {});
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product.id));
    }
    dispatch(
      addToast({
        type: "success",
        title: "Added to Cart",
        message: `${quantity} × ${product.title} added to your cart.`,
      })
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleLikeToggle = () => {
    if (!product) return;
    if (!user) {
      dispatch(
        addToast({
          type: "warning",
          title: "Sign in required",
          message: "Please log in to save items to your wishlist.",
        })
      );
      return;
    }
    dispatch(actLikeToggle(Number(product.id)));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" />
            <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-400 font-medium text-sm">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-slate-400 max-w-md mb-6">
          The product you are looking for may have been removed or the link might be incorrect.
        </p>
        <Link
          to="/categories"
          className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition ${focus}`}
        >
          <span>Browse All Categories</span>
          {Icons.arrow}
        </Link>
      </div>
    );
  }

  const hasDiscount = Boolean(product.offer && product.offer > 0);
  const finalPrice = product.price;
  const originalPrice = hasDiscount
    ? Math.round((product.price * 100) / (100 - (product.offer || 0)))
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-white transition">Categories</Link>
          {product.cat_prefix && (
            <>
              <span>/</span>
              <Link
                to={`/categories/products/${product.cat_prefix}`}
                className="capitalize hover:text-white transition text-blue-400 font-medium"
              >
                {product.cat_prefix}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-slate-200 font-semibold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Main Showcase */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: Product Image Gallery */}
          <div className="relative group">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-md">
              <img
                src={product.img}
                alt={product.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.opacity = "0.5";
                }}
              />

              {/* Discount Badge */}
              {hasDiscount && (
                <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/30">
                  SAVE {product.offer}%
                </span>
              )}

              {/* Wishlist Button on image */}
              <button
                type="button"
                onClick={handleLikeToggle}
                aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute right-4 top-4 rounded-full border border-white/15 bg-slate-950/70 p-3 text-white backdrop-blur-md transition hover:bg-slate-900 hover:scale-110 ${focus} ${
                  isLiked ? "text-rose-400" : "text-white"
                }`}
              >
                {isLiked ? Icons.heart : Icons.heartOutline}
              </button>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="space-y-6">
            {/* Category & Status tags */}
            <div className="flex flex-wrap items-center gap-3">
              {product.cat_prefix && (
                <Link
                  to={`/categories/products/${product.cat_prefix}`}
                  className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 hover:bg-blue-500/20 transition"
                >
                  {product.cat_prefix}
                </Link>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                In Stock ({product.max} available)
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
              {product.title}
            </h1>

            {/* Rating Stars / Reviews Link */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("reviews");
                const el = document.getElementById("product-tabs-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-blue-400 transition cursor-pointer group text-left"
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{Icons.star}</span>
                ))}
              </div>
              <span className="font-semibold text-slate-200 group-hover:text-blue-400">Customer Reviews</span>
              <span>•</span>
              <span className="text-blue-400 underline underline-offset-4">Verified Buyers Only</span>
            </button>

            {/* Price Box */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md flex items-baseline gap-4">
              <span className="text-4xl font-black text-white">
                ${finalPrice.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-lg text-slate-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              {hasDiscount && (
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  Save ${(originalPrice! - finalPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-white/10 bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2.5 text-slate-400 hover:text-white disabled:opacity-30 transition font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-mono font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.max || 10, q + 1))}
                    disabled={quantity >= (product.max || 10)}
                    className="px-3.5 py-2.5 text-slate-400 hover:text-white disabled:opacity-30 transition font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  Max: {product.max || 10} items per order
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition active:scale-95 ${focus}`}
              >
                {Icons.cart}
                <span>{isInCart ? "Add More to Cart" : "Add to Cart"}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className={`flex-1 flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-bold text-white shadow-xl shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500 transition active:scale-95 ${focus}`}
              >
                <span>Buy Now with Stripe</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/40 p-3">
                {Icons.truck}
                <div>
                  <h4 className="text-xs font-bold text-white">Fast Delivery</h4>
                  <p className="text-[11px] text-slate-400">24–48h door-to-door</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/40 p-3">
                {Icons.rotate}
                <div>
                  <h4 className="text-xs font-bold text-white">30-Day Returns</h4>
                  <p className="text-[11px] text-slate-400">Hassle-free guarantee</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/40 p-3">
                {Icons.shield}
                <div>
                  <h4 className="text-xs font-bold text-white">Stripe Verified</h4>
                  <p className="text-[11px] text-slate-400">256-bit SSL encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Overview, Specs, Shipping, Reviews */}
        <div id="product-tabs-section" className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md">
          {/* Tab buttons */}
          <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto scrollbar-none">
            {(["overview", "specs", "shipping", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold capitalize transition whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                } ${focus}`}
              >
                {tab === "overview"
                  ? "Product Overview"
                  : tab === "specs"
                  ? "Specifications"
                  : tab === "shipping"
                  ? "Shipping & Returns"
                  : "Customer Reviews"}
              </button>
            ))}
          </div>

          <div className="pt-6 text-sm text-slate-300 leading-relaxed">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <p>
                  Experience supreme quality with the <strong>{product.title}</strong>. Meticulously designed for everyday comfort, durability, and modern aesthetic elegance.
                </p>
                <p>
                  Each piece is authenticated and quality-checked by our team before dispatch, ensuring you receive only authentic, premium merchandise.
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-400 pt-2">
                  <li>Original brand packaging and sealed authenticity certificate.</li>
                  <li>Premium materials crafted for long-lasting performance.</li>
                  <li>Covered under PrimeEcom standard 1-year product warranty.</li>
                </ul>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-slate-400">Category</span>
                  <span className="font-semibold text-white capitalize">{product.cat_prefix || "General"}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-slate-400">Item ID</span>
                  <span className="font-mono text-white font-semibold">#{product.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-slate-400">Stock Availability</span>
                  <span className="semibold text-emerald-400">{product.max} Units Ready to Ship</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-slate-400">Warranty</span>
                  <span className="font-semibold text-white">12 Months Official</span>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-3">
                <p>
                  We offer fast express delivery across all provinces:
                </p>
                <div className="grid gap-3 sm:grid-cols-2 pt-2">
                  <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
                    <h4 className="font-bold text-white mb-1">Standard Domestic Delivery</h4>
                    <p className="text-xs text-slate-400">Takes 24 to 48 hours directly to your doorstep.</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
                    <h4 className="font-bold text-white mb-1">30-Day Money Back Guarantee</h4>
                    <p className="text-xs text-slate-400">Return in original packaging for a full refund via Stripe or cash.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <ProductReviews
                productId={product.id}
                productTitle={product.title}
              />
            )}
          </div>
        </div>

        {/* Related Products from same category */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Related Products</h3>
                <p className="text-sm text-slate-400">More items in {product.cat_prefix}</p>
              </div>
              {product.cat_prefix && (
                <Link
                  to={`/categories/products/${product.cat_prefix}`}
                  className={`inline-flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-blue-300 ${focus}`}
                >
                  <span>View All</span>
                  {Icons.arrow}
                </Link>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/product/${rel.id}`}
                  className="group rounded-3xl border border-white/10 bg-slate-900/60 p-3 shadow-xl backdrop-blur-md transition hover:border-white/30 hover:-translate-y-1 block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-800">
                    <img
                      src={rel.img}
                      alt={rel.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {rel.offer && rel.offer > 0 && (
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-slate-950">
                        -{rel.offer}%
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-white truncate group-hover:text-blue-400 transition">
                      {rel.title}
                    </h4>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-base font-bold text-white">${rel.price}</span>
                      <span className="text-xs text-blue-400 font-semibold group-hover:underline">
                        View details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

