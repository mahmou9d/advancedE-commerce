import { Container } from "react-bootstrap";
import { GridList } from "@components/common";
import { Product } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import useWishlist from "@hooks/useWishlist";
import styles from "./styles.module.css";

const WishList = () => {
  const { loading, error, records } = useWishlist();

  return (
    <div className={styles.pageWrapper}>
      <Container>
        <div className={styles.headerSection}>
          <div className={styles.wishlistIcon}>
            <i className="bi bi-heart-fill"></i>
          </div>
          <h1 className={styles.pageTitle}>Your Wishlist</h1>
          <p className={styles.pageDescription}>
            {records.length > 0
              ? `${records.length} ${
                  records.length === 1 ? "item" : "items"
                } saved for later`
              : "Save your favorite items here"}
          </p>
        </div>

        <div className={styles.contentSection}>
          <Loading loading={loading} error={error} type="product">
            {records.length > 0 ? (
              <GridList
                records={records}
                renderItem={(record) => <Product {...record} />}
              />
            ) : (
              <div className={styles.emptyState}>
                <i className="bi bi-heart"></i>
                <h3>Your Wishlist is Empty</h3>
                <p>Start adding items you love to your wishlist</p>
                <a href="/categories" className={styles.shopButton}>
                  <span>Start Shopping</span>
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            )}
          </Loading>
        </div>
      </Container>
    </div>
  );
};

export default WishList;
