import { TLoading } from "@customTypes/shared"
import CategorySkeleton from "../skeletons/CategorySkeleton";
import ProductSkeleton from "../skeletons/ProductSkeleton";
import CartSkeleton from "../skeletons/CartSkeleton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import TableSkeleton from "../skeletons/TableSkeleton";


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
const Loading = ({ loading, children,type="category" }: LoadingProps) => {
    const Component = skeletonsTypes[type];
    if(loading==="pending"){
        return <Component/>;
    }
    if (loading === "failed") {
      return (
        <div>
          <DotLottieReact
            src="https://lottie.host/0feab54b-be07-4d44-a5b7-99cac4af1311/oXIQqZ9pQn.lottie"
            loop
            autoplay
          />
        </div>
      );
    }
    return <div>{children}</div>
};



export default Loading