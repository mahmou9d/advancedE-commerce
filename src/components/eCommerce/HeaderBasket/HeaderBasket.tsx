import Logo from "@assets/svg/cart.svg?react";

import styles from "./styles.module.css";
import { useAppSelector } from "@store/hooks";
import { getCartTotalQuantitySelector } from "@store/cart/selectors";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { container, totalNum, pumpAnimate,  iconWrapper  } =
  styles;

const HeaderBasket = () => {
  const totalQuantity = useAppSelector(getCartTotalQuantitySelector);
  console.log(totalQuantity)
  const [isAction,setIsAction]=useState(false)
  const navigate= useNavigate()
  const quantitStyle = `${totalNum} ${isAction?pumpAnimate:""}`;
  
  useEffect(() => {
    if (!totalQuantity) {
      return
    }
    setIsAction(true);
    const debounce = setTimeout(() => {
      setIsAction(false);
    }, 300);
    return () => clearTimeout(debounce);
  }, [totalQuantity]);
  
  
  
  return (
    <div className={container} onClick={() => navigate("/cart")}>
      <div className={iconWrapper}>
        <Logo title="basket icon" />
        {totalQuantity > 0 && (
          <div className={quantitStyle}>{totalQuantity}</div>
        )}
      </div>
      <h3>Cart</h3>
    </div>
  );
};

export default HeaderBasket;
