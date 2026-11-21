import { memo } from "react";
import { TProduct } from "@customTypes/product";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

type CartItemProps = TProduct & {
  changeQuantityHandler: (id: number, quantity: number) => void;
  removeItemHandler: (id: number) => void;
};

const CartItem = memo(
  ({
    id,
    title,
    img,
    price,
    quantity,
    max,
    changeQuantityHandler,
    removeItemHandler,
  }: CartItemProps) => {
    const options = Array.from({ length: max }, (_, i) => i + 1);

    const changeQuantity = (event: React.ChangeEvent<HTMLSelectElement>) => {
      changeQuantityHandler(id as number, Number(event.target.value));
    };

    const subtotal = (price * Number(quantity)).toFixed(2);

    return (
      <article className="relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] motion-safe:transition motion-safe:duration-300 hover:border-blue-400/30 sm:flex-row sm:items-center sm:gap-6 sm:p-4">
        {/* Product info */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-800 sm:h-24 sm:w-24">
            <img
              src={img}
              alt={title}
              loading="lazy"
              onError={(e) => (e.currentTarget.style.opacity = "0")}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-semibold leading-snug">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">${price} each</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-4 sm:justify-end sm:border-t-0 sm:pt-0">
          <div>
            <label
              htmlFor={`quantity-${id}`}
              className="mb-1 block text-xs font-medium text-slate-400"
            >
              Quantity
            </label>
            <div className="relative">
              <select
                id={`quantity-${id}`}
                value={quantity}
                onChange={changeQuantity}
                aria-label={`Quantity for ${title}`}
                className="w-20 cursor-pointer appearance-none rounded-xl border border-white/15 bg-slate-950/80 py-2.5 pl-3 pr-8 text-sm text-slate-100 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {options.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          <div className="min-w-[5rem] text-right">
            <span className="block text-xs font-medium text-slate-400">
              Subtotal
            </span>
            <span className="mt-1 block text-xl font-bold">${subtotal}</span>
          </div>

          <button
            type="button"
            onClick={() => removeItemHandler(id as number)}
            aria-label={`Remove ${title} from cart`}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300 ${focus}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </article>
    );
  },
);

export default CartItem;
