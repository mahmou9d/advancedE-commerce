type ProductInfoProps = {
  title: string;
  img: string;
  price: number;
  quantity?: number;
  direction?: "row" | "column";
  children?: React.ReactNode;
  style?: React.CSSProperties;
  offer?: number;
  showOffer?: boolean;
  cat_prefix?: string;
};

const ProductInfo = ({
  title,
  img,
  price,
  quantity,
  direction = "row",
  children,
  style,
  offer,
  showOffer = false,
}: ProductInfoProps) => {
  const isRow = direction === "row";
  const hasOffer = showOffer && !!offer;
  const off = hasOffer ? Math.round((1 - offer! / price) * 100) : 0;

  return (
    <div className="w-full">
      <div
        style={style}
        className={`flex gap-4 ${isRow ? "flex-row items-center" : "flex-col"}`}
      >
        {/* Image */}
        <div
          className={`relative shrink-0 overflow-hidden rounded-xl bg-slate-800 ${
            isRow ? "h-20 w-20 sm:h-24 sm:w-24" : "aspect-square w-full"
          }`}
        >
          <img
            src={img}
            alt={title}
            loading="lazy"
            onError={(e) => (e.currentTarget.style.opacity = "0")}
            className="h-full w-full object-cover"
          />
          {hasOffer && off > 0 && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950">
              -{off}%
            </span>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <h3
            title={title}
            className="line-clamp-2 font-semibold leading-snug text-slate-100"
          >
            {title}
          </h3>

          {quantity ? (
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex gap-1.5">
                <dt className="text-slate-400">Quantity:</dt>
                <dd className="font-medium text-slate-200">{quantity}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-slate-400">Total:</dt>
                <dd className="font-semibold text-slate-100">
                  ${(quantity * price).toFixed(2)}
                </dd>
              </div>
            </dl>
          ) : null}

          {!showOffer && price ? (
            <p className="mt-2 flex items-baseline gap-1.5 text-sm">
              <span className="text-slate-400">Price:</span>
              <span className="text-xl font-bold text-slate-100">
                ${price.toFixed(2)}
              </span>
            </p>
          ) : null}

          {hasOffer && (
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-100">
                ${offer!.toFixed(2)}
              </span>
              <span className="text-sm text-slate-500 line-through">
                ${price.toFixed(2)}
              </span>
              {off > 0 && (
                <span className="text-xs font-semibold text-emerald-400">
                  Save {off}%
                </span>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
