import { Form, Button } from "react-bootstrap";
import styles from "./styles.module.css";
import { TProduct } from "@customTypes/product";
import { memo } from "react";
import ProductInfo from "../ProductInfo/ProductInfo";
const { cartItem, cartItemSelection } =
  styles;

type CartItemProps = TProduct & {
  changeQuantityHandler: (id: number, quantity: number) => void;
    removeItemHandler:(id:number)=>void
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

    return (
      <div className={cartItem}>
        <ProductInfo title={title} price={price} img={img} direction="column" >
            <Button
              variant="secondary"
              style={{ color: "white",width: "100%" }}
              className="mt-auto"
              onClick={() => removeItemHandler(id as number)}
            >
              Remove
            </Button>
        </ProductInfo>

        <div className={cartItemSelection}>
          <span className="d-block mb-1 text-uppercase">Quantity</span>
          <Form.Select
            className="form-select"
            aria-label="Default select example"
            value={quantity}
            onChange={changeQuantity}
          >
            {renderOptions}
          </Form.Select>
        </div>
      </div>
    );
  }
);

export default CartItem;
