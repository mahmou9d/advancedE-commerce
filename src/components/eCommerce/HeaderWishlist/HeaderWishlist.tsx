import Logo from "@assets/svg/wishlist.svg?react";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { actGetWishlist } from "@store/wishlist/wishlistSlice";
const { container, totalNum, pumpAnimate, iconWrapper } = styles;

const HeaderBasket = () => {
  const totalQuantity = useAppSelector((state) => state.wishlist.itemsId);
  const { user } = useAppSelector((e) => e.auth);
  const dispatch = useAppDispatch();
  const [isAction, setIsAction] = useState(false);
  const navigate = useNavigate();
  const quantitStyle = `${totalNum} ${isAction ? pumpAnimate : ""}`;

useEffect(() => {
  if (!user?.id) return;

  dispatch(actGetWishlist("productIds"));
  dispatch(actGetWishlist("productsFullInfo"));
}, [user?.id, dispatch]);



  useEffect(() => {
    
    if (!totalQuantity || totalQuantity.length === 0) {
      return;
    }

    setIsAction(true);
    const debounce = setTimeout(() => {
      setIsAction(false);
    }, 300);

    return () => clearTimeout(debounce);
  }, [totalQuantity]); 
useEffect(() => {
  console.log("user id in HeaderBasket", user?.id);
}, [user?.id]);

  return (
    <div className={container} onClick={() => navigate("/wishlist")}>
      <div className={iconWrapper}>
        <Logo title="basket icon" />
        {totalQuantity && totalQuantity.length > 0 && (
          <div className={quantitStyle}>{totalQuantity.length}</div>
        )}
      </div>
      <h3>Wish List</h3>
    </div>
  );
};

export default HeaderBasket;

// import Logo from "@assets/svg/wishlist.svg?react";
// import styles from "./styles.module.css";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAppSelector, } from "@store/hooks";
// const { container, totalNum, pumpAnimate, iconWrapper } = styles;

// const HeaderBasket = () => {
//   const totalQuantity = useAppSelector((state)=>state.wishlist.itemsId.length)
//   console.log(totalQuantity)
//   const [isAction, setIsAction] = useState(false);
//   const navigate = useNavigate();
//   const quantitStyle = `${totalNum} ${isAction ? pumpAnimate : ""}`;

//   useEffect(() => {
//     if (!totalQuantity) {
//       return;
//     }
//     setIsAction(true);
//     const debounce = setTimeout(() => {
//       setIsAction(false);
//     }, 300);
//     return () => clearTimeout(debounce);
//   }, [totalQuantity]);

//   return (
//     <div className={container} onClick={() => navigate("/wishlist")}>
//       <div className={iconWrapper}>
//         <Logo title="basket icon" />
//         {totalQuantity && (
//           <div className={quantitStyle}>{totalQuantity}</div>
//         )}
//       </div>
//       <h3>Wish List</h3>
//     </div>
//   );
// };

// export default HeaderBasket;
