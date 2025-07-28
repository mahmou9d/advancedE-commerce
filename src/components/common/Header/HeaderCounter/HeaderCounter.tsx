import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { container, totalNum, pumpAnimate, iconWrapper } = styles;



type HeaderCounterProps = {
  totalQuantity: number;
  svgIcon: React.ReactNode;
  title: string;
  to: string;
};


const HeaderBasket = ({
  totalQuantity,
  svgIcon,
  title,
  to,
}: HeaderCounterProps) => {
  const [isAction, setIsAction] = useState(false);
  const navigate = useNavigate();
  const quantitStyle = `${totalNum} ${isAction ? pumpAnimate : ""}`;

  useEffect(() => {
    if (!totalQuantity) {
      return;
    }
    setIsAction(true);
    const debounce = setTimeout(() => {
      setIsAction(false);
    }, 300);
    return () => clearTimeout(debounce);
  }, [totalQuantity]);

  return (
    <div className={container} onClick={() => navigate(to)}>
      <div className={iconWrapper}>
        {svgIcon}
        {totalQuantity > 0 && (
          <div className={quantitStyle}>{totalQuantity}</div>
        )}
      </div>
      <h3>{title}</h3>
    </div>
  );
};

export default HeaderBasket;
