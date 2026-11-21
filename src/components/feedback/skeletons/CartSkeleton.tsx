import ContentLoader from "react-content-loader";

const CartSkeleton = () => (
  <div role="status" aria-busy="true" aria-live="polite" className="w-full">
    <span className="sr-only">Loading cart...</span>
    <ContentLoader
      speed={2}
      viewBox="0 0 500 210"
      backgroundColor="#1e293b"
      foregroundColor="#334155"
      className="w-full max-w-[500px]"
      aria-hidden="true"
    >
      <rect x="140" y="2" rx="3" ry="3" width="105" height="8" />
      <rect x="6" y="2" rx="0" ry="0" width="119" height="178" />
      <rect x="141" y="19" rx="3" ry="3" width="86" height="9" />
      <rect x="140" y="141" rx="0" ry="0" width="96" height="37" />
    </ContentLoader>
  </div>
);

export default CartSkeleton;
