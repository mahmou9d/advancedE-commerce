import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { actGetOffers, offersRecordsCleanUp } from "@store/offers/offersSlice";
import { GridList } from "@components/common";
import { Loading } from "@components/feedback";
import { Product } from "@components/eCommerce";
import styles from "./styles.module.css";

const Offers = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishListItemsId = useAppSelector((state) => state.wishlist.itemsId);
  const userAccessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();

  const {
    loading,
    error,
    records: offers,
  } = useAppSelector((state) => state.offers);

  const productsFullInfo = offers.map((el) => ({
    ...el,
    quantity: cartItems[el.id] || 0,
    isLiked: wishListItemsId.includes(el.id as number),
    isAutehnticated: userAccessToken ? true : false,
  }));

  useEffect(() => {
    const promise = dispatch(actGetOffers());
    return () => {
      promise.abort();
      dispatch(offersRecordsCleanUp());
    };
  }, [dispatch]);

  return (
    <div className={styles.pageWrapper}>
      <Container>
        <div className={styles.headerSection}>
          <div className={styles.offerBadge}>
            <i className="bi bi-tag-fill"></i>
            <span>Special Deals</span>
          </div>
          <h1 className={styles.pageTitle}>Hot Offers</h1>
          <p className={styles.pageDescription}>
            Limited time deals you don't want to miss
          </p>
        </div>

        <div className={styles.contentSection}>
          <Loading loading={loading} error={error} type="product">
            {productsFullInfo.length > 0 ? (
              <GridList
                records={productsFullInfo}
                renderItem={(record) => (
                  <Product {...record} showOffer={true} />
                )}
              />
            ) : (
              <div className={styles.emptyState}>
                <i className="bi bi-inbox"></i>
                <h3>No Offers Available</h3>
                <p>Check back later for amazing deals!</p>
              </div>
            )}
          </Loading>
        </div>
      </Container>
    </div>
  );
};

export default Offers;
