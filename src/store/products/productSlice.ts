import { createSlice } from "@reduxjs/toolkit";
import actGetProductsByCatPrefix from "./act/actGetProductsByCatPrefix";
import { TLoading } from "@customTypes/shared";
import { TProduct } from "@customTypes/product";
import { isString } from "@customTypes/index";
import actAddProduct from "./act/actAddProduct";
import { actGetOffers } from "@store/offers/offersSlice";
interface ICategoriesState {
  records: TProduct[];
  loading: TLoading;
  error: string | null;
}

const initialState: ICategoriesState = {
  records: [] as TProduct[],
  loading: "idle",
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productsCleanUp: (state) => {
      state.records = [];
    },
    // actAddProduct(state, action: PayloadAction<Omit<TProduct, "id">>) {
    //   const newProduct = {
    //     ...action.payload,
    //     id: Date.now(),
    //   };
    //   state.records.push(newProduct);
    //   console.log("🟢 Product added:", newProduct);
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(actGetProductsByCatPrefix.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actGetProductsByCatPrefix.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.records = action.payload;
    });
    builder.addCase(actGetProductsByCatPrefix.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
                state.error = action.payload;
      }
    });
    builder.addCase(actAddProduct.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actAddProduct.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.records.push(action.payload);
    });
    builder.addCase(actAddProduct.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    }); builder.addCase(actGetOffers.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actGetOffers.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.records = action.payload;
    });
    builder.addCase(actGetOffers.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });
  },
});

export const { productsCleanUp } = productsSlice.actions;
export { actGetProductsByCatPrefix };
export default productsSlice.reducer;