import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { TCategory } from "@customTypes/category";
import { axiosErrorHandler } from "@util/index";
type TResponse = TCategory[]

const actGetCategories = createAsyncThunk(
  "categories/actGetCategories",
  async (_, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    try {
      const response = await axios.get<TResponse>(
        "/category.json", { signal }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error))
    }
  }
);

export default actGetCategories;