import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { TProduct } from "@customTypes/product";
import { axiosErrorHandler } from "@util/index";
type TResponse = TProduct[]

const actGetProductSearch = createAsyncThunk(
  "products/actGetProductSearch",
  async (_, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    try {
      const response = await axios.get<TResponse>('/products.json', { signal });
      const allProducts = Array.isArray(response.data)
        ? (response.data as TProduct[]).filter(Boolean)
        : Object.values((response.data || {}) as Record<string, TProduct>);

      return allProducts;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error))

    }
  }
);

export default actGetProductSearch;
