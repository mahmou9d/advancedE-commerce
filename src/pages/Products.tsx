
import { Container} from "react-bootstrap";
import { Loading } from "@components/feedback";
import { Product } from "@components/eCommerce";
import GridList from "@components/common/GridList/GridList";
import { Heading } from "@components/common";
import useProducts from "@hooks/useProducts";

const Products = () => {
const { loading, error, productsFullInfo, productPrefix } = useProducts();
  return (
    <>
      <Heading title={`${productPrefix?.toUpperCase()} Products`} />
      <Container>
        <Loading loading={loading} error={error} type="product">
          <GridList
            records={productsFullInfo}
            renderItem={(record) => <Product {...record} showOffer={false} />}
          />
        </Loading>
      </Container>
    </>
  );
};

export default Products;
