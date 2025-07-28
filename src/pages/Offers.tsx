import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { actGetOffers, offersRecordsCleanUp } from "@store/offers/offersSlice";
import { GridList, Heading } from "@components/common";
import { Loading } from "@components/feedback";
import { Container } from "react-bootstrap";
import { Product } from "@components/eCommerce";
const Offers = () => {
      const cartItems = useAppSelector((state) => state.cart.items);
      const wishListItemsId = useAppSelector((state) => state.wishlist.itemsId);
      const userAccessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();
  const { loading, error, records:offers } = useAppSelector(
    (state) => state.offers
  );
console.log(offers)
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
    <>
      <Heading title={`offers`} />
      <Container>
        <Loading loading={loading} error={error} type="product">
          <GridList
            records={productsFullInfo}
            renderItem={(record) => <Product {...record} showOffer={true} />}
          />
        </Loading>
      </Container>
    </>
  );
};

export default Offers;
{/* <Heading title="Latest Offers" />
      <Loading loading={loading} error={error} type="product">
        <div
          className="offers-container"
          style={{
            padding: "1rem",
            color: "#fff",
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
          }}
        >
          <div
            className="offers-grid"
            style={{
              display: "flex",
              flexWrap: "wrap",
              // gap: "1rem",
              justifyContent: "space-evenly",
            }}
          >
            {offers.length > 0 ? (
              offers.map((item) => (
                <Col
                  // xs={3}
                  md={3}
                  key={item.id}
                  className="d-flex justify-content-center mb-5 mt-2"
                >
                  <div
                    key={item.id}
                    className="offer-card"
                    style={{
                      background: "#222",
                      padding: "1rem",
                      borderRadius: "8px",
                      width: "200px",
                      display: "flex",
                      justifyContent: "space-evenly",
                      flexWrap: "wrap",
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "90%",
                        height: "200px",
                        borderRadius: "6px",
                      }}
                    />
                    <h4>{item.title}</h4>
                    <h4>uiglkj</h4>
                    <p style={{ color: "orange" }}>
                      Offer Price: ${item.price}
                    </p>
                    <p
                      style={{ textDecoration: "line-through", color: "#999" }}
                    >
                      Original: ${item.offer}
                    </p>
                  </div>
                </Col>
              ))
            ) : (
              <p>No offers available.</p>
            )}
          </div>
        </div>
      </Loading> */}