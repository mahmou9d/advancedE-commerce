const COUNT = 8;

const CategorySkeleton = () => (
  <div
    role="status"
    aria-busy="true"
    aria-live="polite"
    className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
  >
    <span className="sr-only">Loading categories...</span>

    {Array.from({ length: COUNT }, (_, i) => (
      <div
        key={i}
        aria-hidden="true"
        className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] motion-safe:animate-pulse"
      >
        {/* Image area */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-800 to-slate-700/60" />

        {/* Title bar */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 backdrop-blur-md">
          <div className="h-4 w-2/3 rounded bg-slate-700" />
          <div className="h-5 w-5 rounded bg-slate-700" />
        </div>
      </div>
    ))}
  </div>
);

export default CategorySkeleton;
