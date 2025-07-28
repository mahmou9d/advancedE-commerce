import { GridList, Heading } from "@components/common";
import { Product } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import useWishlist from "@hooks/useWishlist";


const WishList = () => {
const { loading, error, records}=useWishlist();
  return (
    <div>
      <Heading title="Your Wishlist" />
      <Loading loading={loading} error={error} type="product">
        <GridList
          records={records}
          renderItem={(record) => <Product {...record} />}
        />
      </Loading>
    </div>
  );
}

export default WishList
