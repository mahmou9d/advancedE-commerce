import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addToast } from "@store/toasts/toastsSlice";
import { TReview } from "@customTypes/review.type";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

/* SVG Icons */
const Icons = {
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-amber-400">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  starEmpty: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-slate-700">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  verified: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-amber-400">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
};

interface ProductReviewsProps {
  productId: string | number;
  productTitle: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productTitle,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [reviews, setReviews] = useState<TReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const productKey = String(productId).startsWith("p")
    ? String(productId)
    : `p${productId}`;

  // 1. Fetch real reviews for this product from Firebase
  const fetchReviews = () => {
    setLoading(true);
    axios
      .get<Record<string, TReview>>(`/reviews/${productKey}.json`)
      .then((res) => {
        if (!res.data) {
          setReviews([]);
          return;
        }
        const list = Object.entries(res.data).map(([id, r]) => ({
          ...r,
          id,
        }));
        // Sort newest first
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReviews(list);
      })
      .catch(() => {
        setReviews([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, [productKey]);

  // 2. Check if logged-in user has purchased this product
  useEffect(() => {
    if (!user?.id) {
      setHasPurchased(false);
      return;
    }

    setCheckingPurchase(true);
    axios
      .get<Record<string, any>>("/orders.json")
      .then((res) => {
        if (!res.data) {
          setHasPurchased(false);
          return;
        }

        const userOrders = Object.values(res.data).filter(
          (o) => String(o.userId) === String(user.id)
        );

        // Check if any of user's orders contains this product
        const purchased = userOrders.some((order) => {
          if (!order.items || !Array.isArray(order.items)) return false;
          return order.items.some(
            (item: any) =>
              String(item.id) === String(productId) ||
              `p${item.id}` === productKey ||
              String(item.id) === productKey
          );
        });

        setHasPurchased(purchased);
      })
      .catch(() => {
        setHasPurchased(false);
      })
      .finally(() => {
        setCheckingPurchase(false);
      });
  }, [user?.id, productId, productKey]);

  // Average Rating Calculation
  const { avgRating, ratingCounts } = useMemo(() => {
    if (reviews.length === 0) {
      return { avgRating: 5.0, ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating || 5))) as 1 | 2 | 3 | 4 | 5;
      counts[star]++;
    });
    return {
      avgRating: Number((sum / reviews.length).toFixed(1)),
      ratingCounts: counts,
    };
  }, [reviews]);

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !hasPurchased) return;
    if (!comment.trim()) {
      dispatch(
        addToast({
          type: "warning",
          title: "Comment required",
          message: "Please write a brief comment describing your experience.",
        })
      );
      return;
    }

    setSubmitting(true);
    try {
      const newReview: Omit<TReview, "id"> = {
        productId,
        userId: String(user.id),
        userName: `${user.firstName || "Customer"} ${user.lastName || ""}`.trim(),
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        verifiedPurchase: true,
      };

      await axios.post(`/reviews/${productKey}.json`, newReview);

      dispatch(
        addToast({
          type: "success",
          title: "Review Published!",
          message: "Your verified review has been submitted successfully.",
        })
      );

      setComment("");
      setRating(5);
      fetchReviews();
    } catch {
      dispatch(
        addToast({
          type: "danger",
          title: "Submission Failed",
          message: "Could not submit your review. Please try again.",
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Summary & Rating Breakdown */}
      <div className="grid gap-8 rounded-3xl border border-white/10 bg-slate-950/60 p-6 sm:p-8 md:grid-cols-3">
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center border-b border-white/10 pb-6 text-center md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <span className="text-6xl font-black text-white">{avgRating}</span>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s}>{s <= Math.round(avgRating) ? Icons.star : Icons.starEmpty}</span>
            ))}
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-400">
            Based on {reviews.length} verified {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="space-y-2 md:col-span-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = (ratingCounts as any)[star] || 0;
            const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs text-slate-400">
                <span className="w-12 text-right font-medium">{star} stars</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-slate-500 font-mono">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Purchase Check & Review Form Section */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 shadow-xl">
        {!user ? (
          /* Not Logged in */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                {Icons.lock}
              </span>
              <div>
                <h3 className="font-bold text-white text-base">Want to review this product?</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sign in with the account you used to purchase this item to write a verified review.
                </p>
              </div>
            </div>
            <Link
              to="/login"
              className={`rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition whitespace-nowrap ${focus}`}
            >
              Log in to Review
            </Link>
          </div>
        ) : checkingPurchase ? (
          /* Checking purchase status */
          <div className="py-4 text-center text-xs text-slate-400 animate-pulse">
            Verifying your purchase history...
          </div>
        ) : !hasPurchased ? (
          /* Logged in, but hasn't purchased */
          <div className="flex items-start gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-amber-200">
            <span className="mt-0.5 shrink-0">{Icons.lock}</span>
            <div>
              <h4 className="font-bold text-sm text-white">Verified Purchase Required</h4>
              <p className="text-xs text-amber-300/90 mt-1 leading-relaxed">
                To guarantee genuine and trustworthy customer feedback, only customers who have purchased <strong>{productTitle}</strong> from PrimeEcom can write a review.
              </p>
            </div>
          </div>
        ) : (
          /* Logged in AND has purchased: WRITE REVIEW FORM */
          <form onSubmit={handleSubmitReview} className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {Icons.verified}
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Write a Verified Review</h3>
                <p className="text-xs text-emerald-400 font-medium">
                  Verified Buyer — You have purchased this product
                </p>
              </div>
            </div>

            {/* Interactive Stars Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} stars`}
                    className="p-1 transition hover:scale-125 focus:outline-none"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`h-7 w-7 transition ${
                        (hoverRating || rating) >= star
                          ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                          : "text-slate-700"
                      }`}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
                <span className="ml-3 text-xs font-bold text-slate-300">
                  {rating === 5
                    ? "Excellent"
                    : rating === 4
                    ? "Very Good"
                    : rating === 3
                    ? "Average"
                    : rating === 2
                    ? "Poor"
                    : "Terrible"}
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Your Feedback
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the product quality, fit, or performance? Share your honest thoughts..."
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition disabled:opacity-60 ${focus}`}
            >
              {submitting ? "Publishing Review..." : "Submit Verified Review"}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">
          Customer Reviews ({reviews.length})
        </h3>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
            Loading verified reviews from Firebase...
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 backdrop-blur-sm transition hover:border-white/20"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white text-sm">
                      {rev.userName ? rev.userName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{rev.userName}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          {Icons.verified} Verified Buyer
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-500">
                          {formatDate(rev.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s}>
                        {s <= (rev.rating || 5) ? Icons.star : Icons.starEmpty}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-slate-950/30 p-8 text-center">
            <p className="text-sm text-slate-400">
              No reviews yet for this product. Be the first verified buyer to leave a review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;

