import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { TProduct } from "@customTypes/product";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addToCart } from "@store/cart/cartSlice";
import actLikeToggle from "@store/wishlist/act/actLikeToggle";
import { addToast } from "@store/toasts/toastsSlice";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const Spinner = ({ className = "h-4 w-4" }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
  />
);
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-[18px] w-[18px]"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.4 4.5 6.8 4.5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.4 0 5.4 3.4 4.1 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
  </svg>
);
/* ---------- Login modal ---------- */
const LoginModal = ({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: () => void;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-md"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="login-modal-title" className="text-lg font-bold text-white">
            Login Required
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white ${focus}`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-300">
          Please login to add items to your wishlist.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5 ${focus}`}
          >
            Close
          </button>
          <button
            type="button"
            onClick={onLogin}
            className={`rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 ${focus}`}
          >
            Login
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

/* ---------- Product card ---------- */
const Product = memo(
  ({
    id,
    title,
    price: productPrice,
    img,
    max,
    quantity,
    isLiked,
    isAutehnticated,
    showOffer = false,
    offer,
    cat_prefix,
  }: TProduct) => {
    const [showModal, setShowModal] = useState(false);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAdmin = useAppSelector((state) => state.auth.user?.isAdmin);

    const currentRemainingQuantity = max - (quantity ?? 0);
    const isOutOfStock = currentRemainingQuantity <= 0;

    // Calculate discount
    const finalPrice =
      showOffer && offer
        ? productPrice - (productPrice * offer) / 100
        : productPrice;
    const hasDiscount = showOffer && offer && offer > 0;

    useEffect(() => {
      if (!isBtnDisabled) return;
      const timer = setTimeout(() => setIsBtnDisabled(false), 300);
      return () => clearTimeout(timer);
    }, [isBtnDisabled]);

    const handleCardClick = () => {
      if (isAdmin) {
        navigate("/admin", {
          state: {
            id,
            title,
            price: productPrice,
            img,
            max,
            quantity,
            isLiked,
            isAutehnticated,
            showOffer,
            offer,
            cat_prefix,
          },
        });
      } else {
        navigate(`/product/${id}`);
      }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(addToCart(id));
      dispatch(
        addToast({
          title: "Added to Cart",
          type: "success",
          message: `${title} added to your cart`,
        }),
      );
      setIsBtnDisabled(true);
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isAutehnticated) {
        setShowModal(true);
        return;
      }

      if (isLikeLoading) return;

      setIsLikeLoading(true);
      dispatch(actLikeToggle(id as number))
        .unwrap()
        .then(() => {
          setIsLikeLoading(false);
          if (!isLiked) {
            dispatch(
              addToast({
                type: "success",
                message: `${title} added to wishlist`,
                delayAnimation: true,
              }),
            );
          }
        })
        .catch(() => {
          setIsLikeLoading(false);
          dispatch(
            addToast({
              title: "Error",
              type: "danger",
              message: "Failed to update wishlist",
            }),
          );
        });
    };

    return (
      <>
        {showModal && (
          <LoginModal
            onClose={() => setShowModal(false)}
            onLogin={() => {
              setShowModal(false);
              navigate("/login");
            }}
          />
        )}

        <article
          onClick={handleCardClick}
          className="group flex h-full flex-col rounded-3xl border border-white/15 bg-slate-900/70 p-3 shadow-2xl shadow-black/50 backdrop-blur-md motion-safe:transition motion-safe:duration-300 hover:border-white/30 motion-safe:hover:-translate-y-1 cursor-pointer"
        >
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-800">
            <img
              src={img}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-105"
            />

            {hasDiscount && (
              <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950">
                -{offer}%
              </span>
            )}

            <button
              type="button"
              onClick={handleWishlistToggle}
              disabled={isLikeLoading}
              aria-pressed={!!isLiked}
              aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition duration-200 motion-safe:hover:scale-110 motion-safe:active:scale-90 disabled:cursor-wait ${
                isLiked
                  ? "border-rose-400/60 bg-rose-500 text-white shadow-lg shadow-rose-500/40 hover:bg-rose-400"
                  : "border-white/20 bg-slate-950/50 text-white hover:border-rose-400/50 hover:bg-slate-950/80 hover:text-rose-300"
              } ${focus}`}
            >
              {isLikeLoading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <span
                  key={String(!!isLiked)}
                  className={
                    isLiked ? "motion-safe:animate-[pop_300ms_ease-out]" : ""
                  }
                >
                  <HeartIcon filled={!!isLiked} />
                </span>
              )}
            </button>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {cat_prefix && (
                  <p className="text-xs capitalize text-slate-400">
                    {cat_prefix}
                  </p>
                )}
                <h3 className="line-clamp-2 font-semibold leading-snug text-white">
                  {title}
                </h3>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xl font-bold text-white">
                  ${finalPrice.toFixed(2)}
                </p>
                {hasDiscount && (
                  <p className="text-xs text-slate-500 line-through">
                    ${productPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <p
              className={`mt-2 text-xs ${
                isOutOfStock ? "text-rose-400" : "text-slate-400"
              }`}
            >
              {isOutOfStock
                ? "Out of stock"
                : `Limited · ${currentRemainingQuantity} left`}
            </p>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isBtnDisabled || isOutOfStock}
              className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:hover:bg-slate-700 ${focus} ${
                !isBtnDisabled && !isOutOfStock ? "" : ""
              }`}
              style={{ marginTop: "1rem" }}
            >
              {isBtnDisabled
                ? "Added to cart"
                : isOutOfStock
                  ? "Out of stock"
                  : "Add to cart"}
            </button>
          </div>
        </article>
      </>
    );
  },
);

Product.displayName = "Product";

export default Product;
