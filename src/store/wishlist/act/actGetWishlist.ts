import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@store/index";
import { TProduct } from "@customTypes/product";
import axiosErrorHandler from "@util/axiosErrorHandler";

type TDataType = "productsFullInfo" | "productIds";

const actGetWishlist = createAsyncThunk(
    "wishlist/actGetWishlist",
    async (dataType: TDataType, thunkAPI) => {
        const { rejectWithValue, signal, getState } = thunkAPI;
        const { auth } = getState() as RootState;
        

        try {
            const wishlistRes = await axios.get<
                Record<string, { productId: number; userId: string }>
            >(`/wishlist.json`, { signal });

            const wishlistArray = Object.entries(wishlistRes.data || {}).map(
                ([firebaseKey, value]) => ({
                    ...value,
                    firebaseKey,
                })
            );

            const userWishlist = wishlistArray.filter(
                (item) => item.userId === String(auth.user?.id)
               
            );

            if (!userWishlist.length) {
                return { data: [], dataType: "empty" };
            }

            if (dataType === "productIds") {
                const ids = userWishlist.map((item) => item.productId);
                return { data: ids, dataType: "productIds" };
            }

            const productsRes = await axios.get<Record<string, TProduct>>(
                `/products.json`,
                { signal }
            );

            const allProducts = Object.values(productsRes.data || {});
            const filteredProducts = allProducts.filter((product) =>
                userWishlist.some((item) => item.productId === product.id)
            );

            return { data: filteredProducts, dataType: "productsFullInfo" };
        } catch (error) {
            return rejectWithValue(axiosErrorHandler(error));
        }
    }
);

export default actGetWishlist;


// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { RootState } from "@store/index";
// import { TProduct } from "@customTypes/product";
// import axiosErrorHandler from "@util/axiosErrorHandler";

// type TDataType = "productsFullInfo" | "ProductIds";
// type TResponse = TProduct[];

// const actGetWishlist = createAsyncThunk(
//     "wishlist/actGetWishlist",
//     async (dataType: TDataType, thunkAPI) => {
//         const { rejectWithValue, signal, getState } = thunkAPI;
//         const { auth } = getState() as RootState;
//         try {
//             const userWishlist = await axios.get<{ productId: number }[]>(
//                 `/wishlist?userId=${auth.user?.id}`,
//                 { signal }
//             );

//             if (!userWishlist.data.length) {
//                 return { data: [], dataType: "empty" };
//             }

//             if (dataType === "ProductIds") {
//                 const concatenatedItemsId = userWishlist.data.map((el) => el.productId);
//                 return { data: concatenatedItemsId, dataType: "productsIds" };
//             } else {
//                 const concatenatedItemsId = userWishlist.data
//                     .map((el) => `id=${el.productId}`)
//                     .join("&");

//                 const response = await axios.get<TResponse>(
//                     `/products?${concatenatedItemsId}`
//                 );
//                 return { data: response.data, dataType: "ProductsFullInfo" };
//             }
//         } catch (error) {
//             return rejectWithValue(axiosErrorHandler(error));
//         }
//     }
// );

// export default actGetWishlist;