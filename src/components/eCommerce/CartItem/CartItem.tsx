import { Form } from "react-bootstrap";
import styles from "./styles.module.css";
import { TProduct } from "@customTypes/product";
import { memo } from "react";
import ProductInfo from "../ProductInfo/ProductInfo";

const {
  cartItem,
  cartItemSelection,
  quantityLabel,
  removeBtn,
  cartItemContent,
  priceSection,
} = styles;

type CartItemProps = TProduct & {
  changeQuantityHandler: (id: number, quantity: number) => void;
  removeItemHandler: (id: number) => void;
};

const CartItem = memo(
  ({
    id,
    title,
    img,
    price,
    quantity,
    max,
    changeQuantityHandler,
    removeItemHandler,
  }: CartItemProps) => {
    const renderOptions = Array(max)
      .fill(0)
      .map((_, idx) => {
        const quantity = ++idx;
        return (
          <option value={quantity} key={quantity}>
            {quantity}
          </option>
        );
      });

    const changeQuantity = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const quantity = +event.target.value;
      changeQuantityHandler(id as number, quantity);
    };

    const subtotal = (price * Number(quantity)).toFixed(2);

    return (
      <div className={cartItem}>
        <div className={cartItemContent}>
          <ProductInfo title={title} price={price} img={img} direction="row" />

          <div className={cartItemSelection}>
            <div className={styles.quantityWrapper}>
              <span className={quantityLabel}>Quantity</span>
              <Form.Select
                className={styles.quantitySelect}
                value={quantity}
                onChange={changeQuantity}
              >
                {renderOptions}
              </Form.Select>
            </div>

            <div className={priceSection}>
              <span className={styles.priceLabel}>Subtotal</span>
              <span className={styles.priceValue}>${subtotal}</span>
            </div>
          </div>
        </div>

        <button
          className={removeBtn}
          onClick={() => removeItemHandler(id as number)}
          aria-label="Remove item"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Remove</span>
        </button>
      </div>
    );
  }
);

export default CartItem;
