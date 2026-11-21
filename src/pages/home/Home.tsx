import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { TProduct } from "@customTypes/product";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addToCart } from "@store/cart/cartSlice";
import actLikeToggle from "@store/wishlist/act/actLikeToggle";
import { addToast } from "@store/toasts/toastsSlice";
import { actGetCategories } from "@store/categories/categoriesSlice";
import { fetchProductsPaginated } from "../admin/services/adminService";

/* ---------- Images (Unsplash) ---------- */
const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const img = {
  hero: u("photo-1441986300917-64674bd600d8", 1600),
  promo: u("photo-1498049794561-7780e7231661", 1600),
  headphones: u("photo-1505740420928-5e560c06d30e"),
  watch: u("photo-1523275335684-37898b6baf30"),
  backpack: u("photo-1553062407-98eeb64c6a62"),
  keyboard: u("photo-1587829741301-dc798b83add3"),
  electronics: u("photo-1498049794561-7780e7231661"),
  fashion: u("photo-1445205170230-053b83016050"),
  home: u("photo-1555041469-a586c61ea9bc"),
  beauty: u("photo-1522335789203-aabd1fc54bc9"),
  sports: u("photo-1517649763962-0c623066013b"),
  p1: u("photo-1494790108377-be9c29b29330", 200),
  p2: u("photo-1500648767791-00dcc994a43e", 200),
  p3: u("photo-1438761681033-6461ffad8d80", 200),
};

interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
}

const Photo: React.FC<PhotoProps> = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    onError={(e) => {
      e.currentTarget.style.opacity = "0";
    }}
    className={`h-full w-full object-cover ${className}`}
  />
);

/* ---------- Icons ---------- */
const icons: Record<string, string> = {
  truck:
    "M8 17a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0zM3 5h11v10H3zM14 8h4l3 3v4h-7z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zm-3 9l2 2 4-4",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z",
  return: "M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3",
  headset: "M4 14v-2a8 8 0 1116 0v2M4 14h3v5H4zm13 0h3v5h-3z",
  arrow: "M5 12h14m-6-6l6 6-6 6",
  heart:
    "M12 21s-7-4.6-9.3-9.2C1.3 8.9 3 5.5 6.3 5.5c2 0 3.2 1 3.7 2 .5-1 1.7-2 3.7-2 3.3 0 5 3.4 3.6 6.3C19 16.4 12 21 12 21z",
  cart: "M3 4h2l2.4 11h10.2L20 7H6.2M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z",
  check: "M5 13l4 4L19 7",
};

interface IconProps {
  name: keyof typeof icons | string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = "h-6 w-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={icons[name] || icons.check} />
  </svg>
);

const Stars: React.FC<{ n: number }> = ({ n }) => (
  <div className="flex gap-0.5" role="img" aria-label={`${n} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        viewBox="0 0 24 24"
        className={`h-4 w-4 ${
          i <= Math.round(n)
            ? "fill-amber-400 stroke-amber-400"
            : "fill-slate-800 stroke-slate-700"
        }`}
        strokeWidth="1"
      >
        <path d={icons.star} />
      </svg>
    ))}
  </div>
);

/* ---------- Shared styles ---------- */
// One surface language: soft border + inner top highlight.
const surface =
  "border border-white/10 bg-slate-900/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]";
const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";
const lift =
  "motion-safe:transition motion-safe:duration-300 hover:border-blue-400/40 hover:shadow-xl hover:shadow-blue-950/40";
const sectionTitle = "text-3xl font-bold tracking-tight";

/* ---------- Data ---------- */
const trust = [
  { icon: "truck", title: "Free shipping", text: "On orders over $50" },
  { icon: "return", title: "30-day returns", text: "No questions asked" },
  { icon: "shield", title: "Secure checkout", text: "256-bit encryption" },
  { icon: "headset", title: "24/7 support", text: "Chat or email anytime" },
];

const categories = [
  {
    name: "Electronics",
    count: "2,400 items",
    src: img.electronics,
    span: "lg:col-span-2 lg:row-span-2",
  },
  { name: "Fashion", count: "3,100 items", src: img.fashion, span: "" },
  { name: "Home & Living", count: "1,800 items", src: img.home, span: "" },
  { name: "Beauty", count: "950 items", src: img.beauty, span: "" },
  { name: "Sports", count: "1,200 items", src: img.sports, span: "" },
];

const steps = [
  {
    title: "Browse",
    text: "Search or explore categories to find what you need.",
  },
  { title: "Order", text: "Add to cart and pay with your preferred method." },
  {
    title: "Track",
    text: "Follow your package in real time from our warehouse.",
  },
  {
    title: "Receive",
    text: "Get it in 24–48 hours, or return it within 30 days.",
  },
];

const reviews = [
  {
    name: "Sara M.",
    src: img.p1,
    rating: 5,
    text: "Ordered on Monday morning and it arrived Tuesday evening. Packaging was perfect and the product matched the photos.",
  },
  {
    name: "Ahmed K.",
    src: img.p2,
    rating: 5,
    text: "I had to return a pair of shoes and the refund was in my account in two days. Support was friendly and fast.",
  },
  {
    name: "Lina R.",
    src: img.p3,
    rating: 4,
    text: "Prices are fair and the quality is clearly checked. This is now my first stop for gifts.",
  },
];

const stats = [
  { value: "10K+", label: "Products" },
  { value: "50K+", label: "Customers" },
  { value: "4.8/5", label: "Average rating" },
  { value: "98%", label: "On-time delivery" },
];

/* ---------- Product card (uses real TProduct data) ---------- */
const ProductCard: React.FC<{ p: TProduct }> = ({ p }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const wishlistItemsId = useAppSelector((state) => state.wishlist.itemsId);
  const cartItems = useAppSelector((state) => state.cart.items);

  const isWished = wishlistItemsId.includes(Number(p.id));
  const isInCart = Boolean(cartItems[p.id]);
  const off = p.offer && p.offer > 0 ? p.offer : 0;
  const tag = off > 0 ? `Save ${off}%` : "Featured";

  const handleWishlist = () => {
    if (!user) {
      dispatch(
        addToast({
          type: "warning",
          title: "Sign in required",
          message: "Please sign in to add items to your wishlist.",
        }),
      );
      return;
    }
    dispatch(actLikeToggle(Number(p.id)));
  };

  const handleAddToCart = () => {
    dispatch(addToCart(p.id));
    dispatch(
      addToast({
        type: "success",
        title: "Added to Cart",
        message: `${p.title} added to your cart.`,
      }),
    );
  };

  return (
    <article className="group rounded-2xl border border-slate-800 bg-slate-900 p-2 motion-safe:transition motion-safe:duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/50 motion-safe:hover:-translate-y-1">
      {/* Inset image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-800">
        <Link to={`/product/${p.id}`} className="block h-full w-full">
          <Photo
            src={p.img}
            alt={p.title}
            className="motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-105"
          />
        </Link>
        <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900">
          {tag}
        </span>
        <button
          onClick={handleWishlist}
          aria-pressed={isWished}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-2.5 top-2.5 rounded-full border border-white/15 bg-slate-950/60 p-2 backdrop-blur transition hover:bg-slate-950 ${
            isWished ? "text-rose-400" : "text-white"
          } ${focus}`}
        >
          <Icon
            name="heart"
            className={`h-4 w-4 ${isWished ? "fill-current" : ""}`}
          />
        </button>
      </div>

      {/* Details */}
      <div className="px-3 pb-3 pt-4">
        <Link to={`/product/${p.id}`} className="block hover:text-blue-400 transition">
          <h3 className="min-h-[2.75rem] font-semibold leading-snug line-clamp-2">
            {p.title}
          </h3>
        </Link>

        <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">${p.price}</span>
            </div>
            {off > 0 && (
              <span className="text-xs font-semibold text-emerald-400">
                {off}% off
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            aria-label={isInCart ? "Added to cart" : `Add ${p.title} to cart`}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
              isInCart
                ? "border border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                : "bg-blue-600 text-white hover:bg-blue-500"
            } ${focus}`}
          >
            <Icon name={isInCart ? "check" : "cart"} className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
};

/* ---------- Page ---------- */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // ── Redux state ──
  const cartItems = useAppSelector((state) => state.cart.items);
  const categoriesList = useAppSelector((state) => state.categories.records);
  const isCategoriesLoading = useAppSelector(
    (state) => state.categories.loading === "pending",
  );

  // ── Real products from Firebase ──
  const [trendingProducts, setTrendingProducts] = useState<TProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    dispatch(actGetCategories());

    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const { products } = await fetchProductsPaginated(1, 4);
        setTrendingProducts(products);
      } catch (err) {
        console.error("Failed to load trending products", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, [dispatch]);

  const featuredProduct = trendingProducts[0];
  const isFeaturedInCart = featuredProduct
    ? Boolean(cartItems[featuredProduct.id])
    : false;
  const featuredOffer =
    featuredProduct?.offer && featuredProduct.offer > 0
      ? featuredProduct.offer
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950">
        <div className="absolute inset-0 -z-10">
          <Photo src={img.hero} alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        <div className="mx-auto grid min-h-[88vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              PrimeEcom. Shop better, delivered faster.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
              Over 10,000 quality-checked products from trusted brands. Secure
              payment, 24–48 hour delivery and free returns for 30 days.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/categories")}
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 ${focus}`}
              >
                Start shopping <Icon name="arrow" className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate("/offers")}
                className={`rounded-xl border border-white/25 bg-white/10 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/20 ${focus}`}
              >
                View offers
              </button>
            </div>
          </div>

          {/* Floating product card */}
          <div className="hidden justify-end lg:flex">
            {isLoadingProducts ? (
              <div className="w-80 animate-pulse rounded-3xl border border-white/15 bg-slate-900/70 p-3 shadow-2xl backdrop-blur-md">
                <div className="aspect-square rounded-2xl bg-slate-800" />
                <div className="px-2 pb-2 pt-4 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-slate-800" />
                  <div className="h-6 w-1/3 rounded bg-slate-800" />
                  <div className="h-10 w-full rounded-xl bg-slate-800" />
                </div>
              </div>
            ) : featuredProduct ? (
              <div className="w-80 rounded-3xl border border-white/15 bg-slate-900/70 p-3 shadow-2xl shadow-black/50 backdrop-blur-md">
                <Link
                  to={`/product/${featuredProduct.id}`}
                  className="block relative aspect-square overflow-hidden rounded-2xl bg-slate-800 group"
                >
                  <Photo
                    src={featuredProduct.img}
                    alt={featuredProduct.title}
                    className="transition duration-500 group-hover:scale-105"
                  />
                  {featuredOffer > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950">
                      -{featuredOffer}%
                    </span>
                  )}
                </Link>
                <div className="px-2 pb-2 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/product/${featuredProduct.id}`}
                      className="min-w-0 flex-1 hover:text-blue-400 transition"
                    >
                      <p className="text-xs text-slate-400">Featured today</p>
                      <p className="truncate font-semibold leading-snug">
                        {featuredProduct.title}
                      </p>
                    </Link>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold">
                        ${featuredProduct.price}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      dispatch(addToCart(featuredProduct.id));
                      dispatch(
                        addToast({
                          type: "success",
                          title: "Added to Cart",
                          message: `${featuredProduct.title} added to your cart.`,
                        }),
                      );
                    }}
                    className={`mt-4 w-full rounded-xl py-3 text-sm font-semibold transition ${
                      isFeaturedInCart
                        ? "border border-emerald-400/40 bg-emerald-500/20 text-emerald-300"
                        : "bg-white text-slate-900 hover:bg-slate-200"
                    } ${focus}`}
                  >
                    {isFeaturedInCart ? "In your cart ✓" : "Add to cart"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-white/10 bg-slate-900/60">
        <ul className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t) => (
            <li
              key={t.title}
              className={`flex items-center gap-4 rounded-2xl p-4 ${surface}`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                <Icon name={t.icon} />
              </span>
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-sm text-slate-400">{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className={sectionTitle}>Shop by category</h2>
            <p className="mt-2 text-slate-400">
              Find exactly what you are looking for.
            </p>
          </div>
          <button
            onClick={() => navigate("/categories")}
            className={`hidden items-center gap-1 rounded text-sm font-semibold text-blue-400 hover:text-blue-300 sm:inline-flex ${focus}`}
          >
            View all <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-4 lg:grid-cols-4">
          {isCategoriesLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-white/10 bg-slate-800"
                />
              ))
            : categoriesList.length > 0
              ? categoriesList.slice(0, 5).map((c, idx) => (
                  <button
                    key={c.prefix || c.id || idx}
                    onClick={() => navigate(`/categories/products/${c.prefix}`)}
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800 text-left ${lift} ${
                      idx === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                    } ${focus}`}
                  >
                    <Photo
                      src={c.img}
                      alt={c.title}
                      className="motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 backdrop-blur-md">
                      <div>
                        <p className="font-bold capitalize">{c.title}</p>
                        <p className="text-xs text-slate-300">
                          Explore collection
                        </p>
                      </div>
                      <Icon
                        name="arrow"
                        className="h-5 w-5 text-slate-300 motion-safe:transition motion-safe:group-hover:translate-x-1"
                      />
                    </div>
                  </button>
                ))
              : categories.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => navigate("/categories")}
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800 text-left ${lift} ${c.span} ${focus}`}
                  >
                    <Photo
                      src={c.src}
                      alt={c.name}
                      className="motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 backdrop-blur-md">
                      <div>
                        <p className="font-bold">{c.name}</p>
                        <p className="text-xs text-slate-300">{c.count}</p>
                      </div>
                      <Icon
                        name="arrow"
                        className="h-5 w-5 text-slate-300 motion-safe:transition motion-safe:group-hover:translate-x-1"
                      />
                    </div>
                  </button>
                ))}
        </div>
      </section>

      {/* Products */}
      <section className="border-y border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className={sectionTitle}>Trending now</h2>
              <p className="mt-2 text-slate-400">
                What our customers are buying this week.
              </p>
            </div>
            <button
              onClick={() => navigate("/offers")}
              className={`hidden items-center gap-1 rounded text-sm font-semibold text-blue-400 hover:text-blue-300 sm:inline-flex ${focus}`}
            >
              See all offers <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoadingProducts ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-2"
                >
                  <div className="aspect-square rounded-xl bg-slate-800" />
                  <div className="px-3 pb-3 pt-4 space-y-3">
                    <div className="h-4 w-3/4 rounded bg-slate-800" />
                    <div className="h-4 w-1/2 rounded bg-slate-800" />
                  </div>
                </div>
              ))
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((p) => (
                <ProductCard key={String(p.id)} p={p} />
              ))
            ) : (
              <p className="col-span-4 text-center text-slate-400 py-12">
                No products found.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative isolate overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-blue-800 to-indigo-900">
          <div className="absolute inset-0 -z-10">
            <Photo src={img.promo} alt="" className="opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/80 to-transparent" />
          </div>
          <div className="px-8 py-16 sm:px-14 sm:py-20">
            <p className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-blue-100">
              Limited-time offer
            </p>
            <h2 className="mt-4 max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Up to 40% off selected electronics
            </h2>
            <p className="mt-4 max-w-lg text-blue-100">
              Deals refresh every Friday. Add items to your cart now to lock in
              the price.
            </p>
            <button
              onClick={() => navigate("/offers")}
              className={`mt-8 rounded-xl bg-white px-8 py-4 font-semibold text-blue-800 transition hover:bg-blue-50 ${focus}`}
            >
              Shop the deals
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className={sectionTitle}>How it works</h2>
          <p className="mt-2 text-slate-400">
            From first click to your front door in four steps.
          </p>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className={`relative rounded-2xl p-6 ${surface}`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold shadow-lg shadow-blue-600/30">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {s.text}
                </p>
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-4 top-1/2 hidden h-px w-4 bg-blue-400/40 lg:block"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stats + reviews */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-2xl p-6 ${surface}`}>
              <dd className="text-4xl font-extrabold tracking-tight">
                {s.value}
              </dd>
              <dt className="mt-1 text-sm text-slate-400">{s.label}</dt>
            </div>
          ))}
        </dl>

        <h2 className={`mt-20 ${sectionTitle}`}>What customers say</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className={`flex flex-col rounded-2xl p-6 ${surface} ${lift}`}
            >
              <Stars n={r.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
                {r.text}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <span className="h-11 w-11 overflow-hidden rounded-full border border-white/15 bg-slate-700">
                  <Photo src={r.src} alt={r.name} />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{r.name}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Icon
                      name="check"
                      className="h-3.5 w-3.5 text-emerald-400"
                    />{" "}
                    Verified buyer
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-blue-950/60 p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="text-2xl font-bold">Get 10% off your first order</h2>
            <p className="mt-1 text-slate-400">
              Join our newsletter for new arrivals and member-only deals.
            </p>
          </div>
          {subscribed ? (
            <p
              role="status"
              className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 font-medium text-emerald-300"
            >
              <Icon name="check" className="h-5 w-5" /> You are subscribed.
              Check your inbox for the code.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
              className="flex w-full max-w-md gap-2"
            >
              <label className="flex-1">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-4 py-3 text-sm placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </label>
              <button
                type="submit"
                className={`rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 ${focus}`}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
