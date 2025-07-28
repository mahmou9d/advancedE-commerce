import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
    actGetProductsByCatPrefix,
    productsCleanUp,
} from "@store/products/productSlice";

const useProducts = () => {
    const params = useParams();
    const productPrefix = params.prefix;
    const dispatch = useAppDispatch();
    const { loading, error, records } = useAppSelector((state) => state.products);
    const cartItems = useAppSelector((state) => state.cart.items);
    const wishListItemsId = useAppSelector((state) => state.wishlist.itemsId)
    const userAccessToken = useAppSelector((state) => state.auth.accessToken)

    const productsFullInfo = records.map((el) => ({
        ...el,
        quantity: cartItems[el.id] || 0,
        isLiked: wishListItemsId.includes(el.id as number),
        isAutehnticated:userAccessToken?true:false
    }));

    useEffect(() => {
        const promise =dispatch(actGetProductsByCatPrefix(params.prefix as string));

        return () => {
            dispatch(productsCleanUp());
            promise.abort()
        };
    }, [dispatch, params]);
    return { loading, error, productsFullInfo,productPrefix }
}

export default useProducts
