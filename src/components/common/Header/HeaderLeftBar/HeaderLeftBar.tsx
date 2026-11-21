import { useAppSelector } from "@store/hooks";
import WishlistIcon from "@assets/svg/wishlist.svg?react";
import CartIcon from "@assets/svg/cart.svg?react";
import { getCartTotalQuantitySelector } from "@store/cart/selectors";
import HeaderCounter from "../HeaderCounter/HeaderCounter";

const HeaderLeftBar = () => {
  const wishlistTotalQuantity = useAppSelector(
    (state) => state.wishlist.itemsId.length,
  );
  const cartTotalQuantity = useAppSelector(getCartTotalQuantitySelector);

  return (
    <div className="flex items-center gap-1">
      <HeaderCounter
        to="/wishlist"
        title="Wishlist"
        totalQuantity={wishlistTotalQuantity}
        svgIcon={<WishlistIcon aria-hidden="true" />}
      />
      <HeaderCounter
        to="/cart"
        title="Cart"
        totalQuantity={cartTotalQuantity}
        svgIcon={<CartIcon aria-hidden="true" />}
      />
    </div>
  );
};

export default HeaderLeftBar;
