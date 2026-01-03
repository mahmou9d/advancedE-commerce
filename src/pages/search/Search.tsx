import { GridList } from "@components/common";
import { Product } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import { useAppSelector } from "@store/hooks";
import { Container } from "react-bootstrap";
import styles from "./styles.module.css";

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
    isLiked: wishListItemsId.includes(el.id as number),
    isAuthenticated: !!accessToken,
  }));

  const filterProducts = productsFullInfo.filter((product) =>
    product.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={styles.pageWrapper}>
      <Container>
        <div className={styles.headerSection}>
          <div className={styles.searchIcon}>
            <i className="bi bi-search"></i>
          </div>

          {searchText ? (
            <>
              <h1 className={styles.pageTitle}>Search Results</h1>
              <p className={styles.pageDescription}>
                Found{" "}
                <span className={styles.resultCount}>
                  {filterProducts.length}
                </span>{" "}
                {filterProducts.length === 1 ? "result" : "results"} for "
                {searchText}"
              </p>
            </>
          ) : (
            <>
              <h1 className={styles.pageTitle}>All Products</h1>
              <p className={styles.pageDescription}>
                Browse our complete collection
              </p>
            </>
          )}
        </div>

        <div className={styles.contentSection}>
          <Loading loading={loading} error={error} type="product">
            {filterProducts.length > 0 ? (
              <GridList
                records={filterProducts}
                renderItem={(record) => (
                  <Product {...record} isAutehnticated={!!accessToken} />
                )}
              />
            ) : (
              <div className={styles.emptyState}>
                <i className="bi bi-search"></i>
                <h3>No Results Found</h3>
                <p>
                  {searchText
                    ? `We couldn't find any products matching "${searchText}"`
                    : "Start searching to find products"}
                </p>
                <a href="/categories" className={styles.browseButton}>
                  <span>Browse Categories</span>
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

export default Search;
