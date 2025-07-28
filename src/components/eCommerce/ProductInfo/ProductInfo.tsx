import styles from "./styles.module.css";
import "./styles.module.css";
import "./pro.css";
type ProductInfoProps = {
  title: string;
  img: string;
  price: number;
  quantity?: number;
  direction?: "row" | "column";
  children?: React.ReactNode;
  style?: React.CSSProperties;
  offer?: number;
  showOffer?: boolean;
  cat_prefix?:string
};

const ProductInfo = ({
  title,
  img,
  price,
  quantity,
  direction = "row",
  children,
  style,
  offer,
  showOffer = false,
}: ProductInfoProps) => {
  return (
    <div className={`diraction`}>
      <div className={`${styles[`product-${direction}`]}`} style={style}>
        <div className={`${styles[`productImg-${direction}`]}`}>
          <img src={img} alt={title} width={"200px"} />
        </div>
        <div className={`${styles[`productInfo-${direction}`]}`}>
          <h2 title={title}>{title}</h2>
          {quantity && <h3>Total Quantity: {quantity}</h3>}
          {quantity && <h3>Price Total: {(quantity * price).toFixed(2)}</h3>}

          {price && !showOffer && <p style={{}}>Price: ${price.toFixed(2)}</p>}
          {showOffer && (
            <div>
              <p style={{ color: "orange" }}>Offer Price: ${offer}</p>
              <p style={{ textDecoration: "line-through", color: "#999" }}>
                Original: ${price}
              </p>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
