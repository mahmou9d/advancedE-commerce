import { TProduct } from "@customTypes/product";
import { Modal, Button, Spinner } from "react-bootstrap";
import styles from "./styles.module.css";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addToCart } from "@store/cart/cartSlice";
import { memo, useEffect, useState } from "react";
import Like from "@assets/svg/like.svg?react";
import actLikeToggle from "@store/wishlist/act/actLikeToggle";
import LikeFill from "@assets/svg/like-fill.svg?react";
import { addToast } from "@store/toasts/toastsSlice";
import { useNavigate } from "react-router-dom";

const {
  productCard,
  imageWrapper,
  productImage,
  topBadges,
  discountBadge,
  wishlistButton,
  productContent,
  categoryTag,
  productTitle,
  priceRow,
  currentPrice,
  originalPrice,
  stockInfo,
  stockBadge,
  addToCartBtn,
  btnSpinner,
  adminMode,
} = styles;

const Product = memo(
  ({
    id,
    title,
    price: productPrice,
    img,
    max,
    quantity,
    isLiked,
    isAutehnticated,
    showOffer = false,
    offer,
    cat_prefix,
  }: TProduct) => {
    const [showModal, setShowModal] = useState(false);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAdmin = useAppSelector((state) => state.auth.user?.isAdmin);

    const currentRemainingQuantity = max - (quantity ?? 0);
    const isOutOfStock = currentRemainingQuantity <= 0;

    // Calculate discount
    const finalPrice =
      showOffer && offer
        ? productPrice - (productPrice * offer) / 100
        : productPrice;
    const hasDiscount = showOffer && offer && offer > 0;

    useEffect(() => {
      if (!isBtnDisabled) return;
      const timer = setTimeout(() => setIsBtnDisabled(false), 300);
      return () => clearTimeout(timer);
    }, [isBtnDisabled]);

    const handleCardClick = () => {
      if (isAdmin) {
        navigate("/admin", {
          state: {
            id,
            title,
            price: productPrice,
            img,
            max,
            quantity,
            isLiked,
            isAutehnticated,
            showOffer,
            offer,
            cat_prefix,
          },
        });
      }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(addToCart(id));
      dispatch(
        addToast({
          title: "Added to Cart",
          type: "success",
          message: `${title} added to your cart`,
        })
      );
      setIsBtnDisabled(true);
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isAutehnticated) {
        setShowModal(true);
        return;
      }

      if (isLikeLoading) return;

      setIsLikeLoading(true);
      dispatch(actLikeToggle(id as number))
        .unwrap()
        .then(() => {
          setIsLikeLoading(false);
          if (!isLiked) {
            dispatch(
              addToast({
                type: "success",
                message: `${title} added to wishlist`,
                delayAnimation: true,
              })
            );
          }
        })
        .catch(() => {
          setIsLikeLoading(false);
          dispatch(
            addToast({
              title: "Error",
              type: "danger",
              message: "Failed to update wishlist",
            })
          );
        });
    };

    return (
      <>
        {/* Login Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Login Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please login to add items to your wishlist.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => navigate("/login")}>
              Login
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Product Card */}
        <div
          className={`${productCard} ${isAdmin ? adminMode : ""}`}
          onClick={handleCardClick}
        >
          {/* Image Section */}
          <div className={imageWrapper}>
            <img src={img} alt={title} className={productImage} />

            <div className={topBadges}>
              {hasDiscount && <span className={discountBadge}>-{offer}%</span>}

              <div
                className={wishlistButton}
                onClick={handleWishlistToggle}
                role="button"
                aria-label={
                  isLiked ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {isLikeLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : isLiked ? (
                  <LikeFill />
                ) : (
                  <Like />
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className={productContent}>
            {cat_prefix && <span className={categoryTag}>{cat_prefix}</span>}

            <h2 className={productTitle}>{title}</h2>

            <div className={priceRow}>
              <span className={currentPrice}>${finalPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className={originalPrice}>
                  ${productPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className={stockInfo}>
              <span className={`${stockBadge} limited`}>Limited</span>
              <span className={`${stockBadge} quantity`}>
                {currentRemainingQuantity} left
              </span>
            </div>

            <button
              className={addToCartBtn}
              onClick={handleAddToCart}
              disabled={isBtnDisabled || isOutOfStock}
            >
              {isBtnDisabled ? (
                <>
                  <span className={btnSpinner}></span>
                  Adding...
                </>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </>
    );
  }
);

Product.displayName = "Product";

export default Product;
