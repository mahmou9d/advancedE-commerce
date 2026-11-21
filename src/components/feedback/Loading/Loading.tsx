import { TLoading } from "@customTypes/shared";
import CategorySkeleton from "../skeletons/CategorySkeleton";
import ProductSkeleton from "../skeletons/ProductSkeleton";
import CartSkeleton from "../skeletons/CartSkeleton";
import TableSkeleton from "../skeletons/TableSkeleton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const skeletonsTypes = {
  category: CategorySkeleton,
  product: ProductSkeleton,
  cart: CartSkeleton,
  table: TableSkeleton,
};

type LoadingProps = {
  loading: TLoading;
  error: null | string;
  children: React.ReactNode;
  type?: keyof typeof skeletonsTypes;
};

const Loading = ({
  loading,
  error,
  children,
  type = "category",
}: LoadingProps) => {
  const Skeleton = skeletonsTypes[type];

  if (loading === "pending") {
    return <Skeleton />;
  }

  if (loading === "failed") {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-slate-900/50 px-4 py-12 text-center"
      >
        <div className="h-48 w-48 sm:h-64 sm:w-64">
          <DotLottieReact
            src="https://lottie.host/0feab54b-be07-4d44-a5b7-99cac4af1311/oXIQqZ9pQn.lottie"
            loop
            autoplay
          />
        </div>
        <p className="mt-4 text-base font-medium text-rose-300">
          {error || "Something went wrong. Please try again."}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default Loading;
