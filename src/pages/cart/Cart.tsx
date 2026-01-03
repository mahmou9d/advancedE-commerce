import { Heading } from "@components/common";
import { CartItemList, CartSubtotalPrice } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import useCart from "@hooks/useCart";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import styles from "./styles.module.css";

const {
  cartContainer,
  cartHeader,
  cartContent,
  cartItemsSection,
  emptyCartWrapper,
  emptyCartAnimation,
  emptyCartMessage,
  successMessage,
  cartItems,
  cartSummary,
} = styles;

const Cart = () => {
  const {
    loading,
    error,
    products,
    changeQuantityHandler,
    removeItemHandler,
    userAccessToken,
    placeOrderStatus,
  } = useCart();

  return (
    <div className={cartContainer}>
      <div className={cartHeader}>
        <Heading title="Shopping Cart" align="center" />
        {products.length > 0 && (
          <p className={styles.itemCount}>
            {products.length} {products.length === 1 ? "Item" : "Items"} in your
            cart
          </p>
        )}
      </div>

      <Loading loading={loading} error={error} type="cart">
        {products.length <= 0 ? (
          <div className={emptyCartWrapper}>
            <div className={emptyCartAnimation}>
              <DotLottieReact
                src={
                  placeOrderStatus === "succeeded"
                    ? "https://lottie.host/f4dda71b-d88e-44f0-aa30-8654020d3883/h2letYNFID.lottie"
                    : "https://lottie.host/e2878abd-3c69-497e-9f50-14ae417dc69e/K0hRm8Yxcw.lottie"
                }
                loop
                autoplay
              />
            </div>

            {placeOrderStatus === "succeeded" ? (
              <div className={successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h2>Order Placed Successfully!</h2>
                <p>
                  Thank you for your purchase. Your order is being processed and
                  you'll receive a confirmation email shortly.
                </p>
                <button
                  className={styles.continueBtn}
                  onClick={() => (window.location.href = "/categories")}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className={emptyCartMessage}>
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <button
                  className={styles.shopBtn}
                  onClick={() => (window.location.href = "/categories")}
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={cartContent}>
            <div className={cartItemsSection}>
              <div className={cartItems}>
                <CartItemList
                  products={products}
                  changeQuantityHandler={changeQuantityHandler}
                  removeItemHandler={removeItemHandler}
                />
              </div>
            </div>

            <div className={cartSummary}>
              <CartSubtotalPrice
                products={products}
                userAccessToken={userAccessToken}
              />
            </div>
          </div>
        )}
      </Loading>
    </div>
  );
};

export default Cart;
