import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosErrorHandler } from "@util/index";
import { TProduct } from "@customTypes/product";
type TResponse = TProduct[]
const actGetOffers = createAsyncThunk(
  "offers/actGetOffers",
  async (_, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    try {
      const response = await axios.get("/products.json", { signal });
      const allProducts = Object.values(response.data || {}) as TResponse;
      const offerProducts = allProducts.filter((product) => product.offer as number > 0);
      return offerProducts;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);


export default actGetOffers;