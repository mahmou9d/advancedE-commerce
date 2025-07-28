import { Heading, GridList } from "@components/common";
import { Product } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import { useAppSelector } from "@store/hooks";
import { Container } from "react-bootstrap";

const Search = () => {
  const { searchText, records, loading, error } = useAppSelector(
    (state) => state.search
  );
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishListItemsId = useAppSelector((state) => state.wishlist.itemsId);
  const accessToken = useAppSelector((state) => state.auth.accessToken);


  const productsFullInfo = records.map((el) => ({
    ...el,
    quantity: cartItems[el.id] || 0,
    isLiked: wishListItemsId.includes(el.id as  number),
    isAuthenticated: !!accessToken, 
  }));

  const filterProducts = productsFullInfo.filter((product) =>
    product.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Heading title="All Product" />
      <Container>
        <Loading loading={loading} error={error} type="product">
          <GridList
            records={filterProducts}
            renderItem={(record) => <Product {...record} isAutehnticated={true} />}
          />
        </Loading>
      </Container>
    </div>
  );
}

export default Search
