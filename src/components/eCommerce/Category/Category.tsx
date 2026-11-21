import { Link } from "react-router-dom";
import { TCategory } from "@customTypes/category";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const Category = ({ title, img, prefix }: TCategory) => {
  return (
    <Link
      to={`/categories/products/${prefix}`}
      aria-label={`Browse ${title}`}
      className={`group relative block aspect-square overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] motion-safe:transition motion-safe:duration-300 hover:border-blue-400/40 hover:shadow-xl hover:shadow-blue-950/40 motion-safe:hover:-translate-y-1 ${focus}`}
    >
      <img
        src={img}
        alt={title}
        loading="lazy"
        onError={(e) => (e.currentTarget.style.opacity = "0")}
        className="h-full w-full object-cover motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

      {/* Title bar */}
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 backdrop-blur-md">
        <h4 className="truncate font-bold text-slate-100">{title}</h4>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-slate-300 motion-safe:transition motion-safe:group-hover:translate-x-1 group-hover:text-blue-400"
        >
          <path d="M5 12h14m-6-6l6 6-6 6" />
        </svg>
      </div>
    </Link>
  );
};

export default Category;
