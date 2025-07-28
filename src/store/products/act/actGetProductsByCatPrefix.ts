import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { TProduct } from "@customTypes/product";
import { axiosErrorHandler } from "@util/index";
type TResponse = TProduct[]

const actGetProductsByCatPrefix = createAsyncThunk(
  "products/actGetProductsByCatPrefix",
  async (prefix: string, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    try {
      const response = await axios.get<TResponse>('/products.json', { signal });
      const allProducts = Object.values(response.data || {});
      const filteredProducts = allProducts.filter(product => product.cat_prefix === prefix);

      return filteredProducts;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error))

    }
  }
);

export default actGetProductsByCatPrefix;
