import { Heading } from "@components/common";
import { CartItemList, CartSubtotalPrice } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import useCart from "@hooks/useCart";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Cart = () => {
  const {
    loading,
    error,
    products,
    changeQuantityHandler,
    removeItemHandler,
    userAccessToken,
    placeOrderStatus
  } = useCart();
  return (
    <div>
      <Heading title="Your Cart" />
      <Loading loading={loading} error={error} type="cart">
        {products.length <= 0 ? (
          placeOrderStatus === "succeeded" ? (
            <div
              style={{
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
                height: "450px",
              }}
            >
              <DotLottieReact
                src="https://lottie.host/f4dda71b-d88e-44f0-aa30-8654020d3883/h2letYNFID.lottie"
                loop
                autoplay
              />
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
                height: "450px",
              }}
            >
              <DotLottieReact
                src="https://lottie.host/e2878abd-3c69-497e-9f50-14ae417dc69e/K0hRm8Yxcw.lottie"
                loop
                autoplay
              />
            </div>
          )
        ) : (
          <>
            <CartItemList
              products={products}
              changeQuantityHandler={changeQuantityHandler}
              removeItemHandler={removeItemHandler}
            />
            <CartSubtotalPrice
              products={products}
              userAccessToken={userAccessToken}
            />
          </>
        )}
      </Loading>
    </div>
  );
};

export default Cart;
