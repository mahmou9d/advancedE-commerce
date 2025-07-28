import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store/index";
import axios from "axios";
import { TProduct } from "@customTypes/product";
import { axiosErrorHandler } from "@util/index";

type TResponse = Record<string, TProduct>;

const actGetProductsByItems = createAsyncThunk(
  "cart/actGetProductsByItems",
  async (_, thunkAPI) => {
    const { rejectWithValue, signal, fulfillWithValue, getState } = thunkAPI;
    const { cart } = getState() as RootState;
    const itemsId = Object.keys(cart.items);

    if (!itemsId.length) {
      return fulfillWithValue([]);
    }

    try {
      const response = await axios.get<TResponse>('/products.json', { signal });

      const allProducts = Object.values(response.data || {});
      const filteredProducts = allProducts.filter(product =>
        itemsId.includes(String(product.id))
      );

      return filteredProducts;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetProductsByItems;



// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { RootState } from "@store/index";
// import axios from "axios";
// import { TProduct } from "@customTypes/product";
// import { axiosErrorHandler } from "@util/index";

// type TResponse = TProduct[];

// const actGetProductsByItems = createAsyncThunk(
//   "cart/actGetProductsByItems",
//   async (_, thunkAPI) => {
//     const { rejectWithValue, signal, fulfillWithValue, getState } = thunkAPI;
//     const { cart } = getState() as RootState;
//     const itemsId = Object.keys(cart.items);

//     if (!itemsId.length) {
//       return fulfillWithValue([]);
//     }

//     try {
//       const concatenatedItemsId = itemsId.map((el) => `id=${el}`).join("&");
//       const response = await axios.get<TResponse>(
//         `/products?${concatenatedItemsId}`, { signal }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(axiosErrorHandler(error))
//     }
//   }
// );

// export default actGetProductsByItems;
