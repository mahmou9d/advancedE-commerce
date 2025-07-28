import { TProduct } from "@customTypes/product";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import styles from "./styles.module.css";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addToCart } from "@store/cart/cartSlice";
import { memo, useEffect, useState } from "react";
import Like from "@assets/svg/like.svg?react";
import actLikeToggle from "@store/wishlist/act/actLikeToggle";
import LikeFill from "@assets/svg/like-fill.svg?react";
import ProductInfo from "../ProductInfo/ProductInfo";
import { addToast } from "@store/toasts/toastsSlice";
import { useNavigate } from "react-router-dom";
const { button, wishlistBtn } = styles;

const Product = memo(
  ({
    id,
    title,
    price,
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
    const dispatch = useAppDispatch();
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const currentRemainingQuantity = max - (quantity ?? 0);
    const quantityReachedToMax = currentRemainingQuantity <= 0 ? true : false;
    const navigate = useNavigate();
    const isAdmin = useAppSelector((state) => state.auth.user?.isAdmin);
console.log(cat_prefix)
    const handleClick = () => {
      if (isAdmin) {
        navigate("/admin", {
          state: {
            id,
            title,
            price,
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

    useEffect(() => {
      if (!isBtnDisabled) {
        return;
      }

      const debounce = setTimeout(() => {
        setIsBtnDisabled(false);
      }, 300);

      return () => clearTimeout(debounce);
    }, [isBtnDisabled]);

    const addToCartHandle = () => {
      dispatch(addToCart(id));
      dispatch(
        addToast({
          title: "Add to Cart",
          type: "success",
          message: `${title} added to wishlist`,
          // onCloseToast: () => {
          //   console.log("fired");
          // },
        })
      );
      setIsBtnDisabled(true);
    };
    const likeToggleHandler = () => {
      if (isAutehnticated) {
        if (!isLoading) {
          setIsLoading(true);
          dispatch(actLikeToggle(id as number))
            .unwrap()
            .then(() => {
              setIsLoading(false);
              !isLiked &&
                dispatch(
                  addToast({
                    type: "success",
                    message: `${title} added to wishlist`,
                    delayAnimation: true,
                  })
                );
            })
            .catch(() => {
              setIsLoading(false);
              dispatch(
                addToast({
                  title: "Failed Operation",
                  type: "danger",
                  message: `Failed to add wishlist, error from server`,
                })
              );
            });
        }
      } else {
        setShowModal(true);
      }
    };
    return (
      <>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Login Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You need to login first to add this item to your wishlist.
          </Modal.Body>
        </Modal>
        <div onClick={handleClick}>
          <ProductInfo
            title={title}
            price={price}
            img={img}
            offer={offer}
            showOffer={showOffer}
            cat_prefix={cat_prefix as string}
          >
            <div className={wishlistBtn} onClick={likeToggleHandler}>
              {isLoading ? (
                <Spinner animation="border" size="sm" variant="danger" />
              ) : isLiked ? (
                <LikeFill />
              ) : (
                <Like />
              )}
            </div>
            <h3 style={{ width: "100%", textAlign: "center" }}>
              <Badge
                style={{
                  // width: "60%",
                  height: "25px",
                  fontSize: "15px",
                  marginRight: "5px",
                }}
                bg="warning"
              >
                limited
              </Badge>
              <Badge
                bg="danger"
                style={{
                  fontSize: "15px",
                  width: "30%",
                  height: "25px",
                  textAlign: "center",
                }}
              >
                {currentRemainingQuantity}
              </Badge>
            </h3>
            <Button
              disabled={isBtnDisabled || quantityReachedToMax}
              className={button}
              variant="danger"
              onClick={addToCartHandle}
              style={ {width: "100%"} }
            >
              {isBtnDisabled ? (
                <>
                  <Spinner animation="border" size="sm" /> Loading...
                </>
              ) : (
                "Add to cart"
              )}
            </Button>
          </ProductInfo>
        </div>
      </>
    );
  }
);

export default Product;
