import ContentLoader from "react-content-loader";

const TableSkeleton = () => (
  <div
    role="status"
    aria-busy="true"
    aria-live="polite"
    className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50"
  >
    <span className="sr-only">Loading table...</span>
    <ContentLoader
      speed={2}
      viewBox="0 0 400 200"
      backgroundColor="#1e293b"
      foregroundColor="#334155"
      className="w-full"
      aria-hidden="true"
    >
      <rect x="47" y="61" rx="0" ry="0" width="58" height="12" />
      <rect x="148" y="61" rx="0" ry="0" width="136" height="12" />
      <rect x="327" y="61" rx="0" ry="0" width="58" height="12" />
      <rect x="48" y="82" rx="0" ry="0" width="58" height="12" />
      <rect x="149" y="82" rx="0" ry="0" width="136" height="12" />
      <rect x="327" y="83" rx="0" ry="0" width="58" height="12" />
      <rect x="45" y="102" rx="0" ry="0" width="58" height="12" />
      <rect x="46" y="123" rx="0" ry="0" width="58" height="12" />
      <rect x="149" y="123" rx="0" ry="0" width="136" height="12" />
      <rect x="325" y="124" rx="0" ry="0" width="58" height="12" />
      <rect x="149" y="103" rx="0" ry="0" width="136" height="12" />
      <rect x="326" y="103" rx="0" ry="0" width="58" height="12" />
      <rect x="47" y="141" rx="0" ry="0" width="58" height="12" />
      <rect x="150" y="141" rx="0" ry="0" width="136" height="12" />
      <rect x="326" y="142" rx="0" ry="0" width="58" height="12" />
    </ContentLoader>
  </div>
);

export default TableSkeleton;
