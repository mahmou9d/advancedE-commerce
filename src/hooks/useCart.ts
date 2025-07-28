import actGetProductsByItems from "@store/cart/act/actGetProductsByItems";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useEffect, useCallback } from "react";
import { cartItemChangeQuantity, cartItemRemove, cleanCartProductsFullInfo } from "@store/cart/cartSlice";
import { resetOrderStatus } from "@store/orders/ordersSlice";

const useCart = () => {
    const dispatch = useAppDispatch();
    const { items, productsFullInfo, loading, error } = useAppSelector(
        (state) => state.cart
    );
    useEffect(() => {
        const promise= dispatch(actGetProductsByItems());
        return () => { 
            promise.abort()
            dispatch(cleanCartProductsFullInfo()) 
            dispatch(resetOrderStatus());
        };
    }, [dispatch]);
    const products = productsFullInfo.map((el) => ({
        ...el,
        quantity: items[el.id],
    }));

    const userAccessToken = useAppSelector((state) => state.auth.accessToken);
    // const placeOrderStatus = useAppSelector((state) => state.orders.loading);
    const changeQuantityHandler = useCallback(
        (id: number, quantity: number) => {
            dispatch(cartItemChangeQuantity({ id, quantity }));
        },
        [dispatch]
    );


    const placeOrderStatus = useAppSelector((state) => state.orders.loading);

    const removeItemHandler = useCallback(
        (id: number) => {
            dispatch(cartItemRemove(id));
        },
        [dispatch]
    );
    return { loading, error, products, changeQuantityHandler, removeItemHandler, userAccessToken, placeOrderStatus }
}

export default useCart
