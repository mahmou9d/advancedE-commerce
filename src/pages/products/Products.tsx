import { Container } from "react-bootstrap";
import { Loading } from "@components/feedback";
import { Product } from "@components/eCommerce";
import GridList from "@components/common/GridList/GridList";
import useProducts from "@hooks/useProducts";
import styles from "./styles.module.css";

const Products = () => {
  const { loading, error, productsFullInfo, productPrefix } = useProducts();

  return (
    <div className={styles.pageWrapper}>
      <Container>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>
            {productPrefix
              ? `${
                  productPrefix.charAt(0).toUpperCase() + productPrefix.slice(1)
                } Products`
              : "Products"}
          </h1>
          <p className={styles.pageDescription}>
            Discover our latest collection
          </p>
        </div>

        <div className={styles.contentSection}>
          <Loading loading={loading} error={error} type="product">
            <GridList
              records={productsFullInfo}
              renderItem={(record) => <Product {...record} showOffer={false} />}
            />
          </Loading>
        </div>
      </Container>
    </div>
  );
};

export default Products;
