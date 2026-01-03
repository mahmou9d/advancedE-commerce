import styles from "./styles.module.css";

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
  cat_prefix?: string;
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
  const {
    productWrapper,
    productContainer,
    productImage,
    productDetails,
    productTitle,
    productQuantity,
    productPrice,
    offerPrice,
    originalPrice,
  } = styles;

  const containerClass = `${productContainer} ${productContainer}--${direction}`;
  const imageClass = `${productImage} ${productImage}--${direction}`;
  const detailsClass = `${productDetails} ${productDetails}--${direction}`;

  return (
    <div className={productWrapper}>
      <div className={containerClass} style={style}>
        <div className={imageClass}>
          <img src={img} alt={title} />
        </div>

        <div className={detailsClass}>
          <h2 className={productTitle} title={title}>
            {title}
          </h2>

          {quantity && (
            <>
              <p className={productQuantity}>
                Quantity: <span>{quantity}</span>
              </p>
              <p className={productPrice}>
                Total: <span>${(quantity * price).toFixed(2)}</span>
              </p>
            </>
          )}

          {!showOffer && price && (
            <p className={productPrice}>
              Price: <span>${price.toFixed(2)}</span>
            </p>
          )}

          {showOffer && offer && (
            <div className={styles.priceSection}>
              <p className={offerPrice}>${offer.toFixed(2)}</p>
              <p className={originalPrice}>${price.toFixed(2)}</p>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
