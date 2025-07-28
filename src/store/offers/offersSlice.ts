import { createSlice } from "@reduxjs/toolkit";
import actGetOffers from "./act/actGetOffers";
import { TLoading } from "@customTypes/shared";
import { isString, TProduct } from "@customTypes/index";
interface ICategoriesState {
  records: TProduct[];
  loading: TLoading;
  error: string | null;
}

const initialState: ICategoriesState = {
  records: [],
  loading: "idle",
  error: null,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    offersRecordsCleanUp: (state) => {
      state.records = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(actGetOffers.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    }); builder.addCase(actGetOffers.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.records = action.payload;
    }); builder.addCase(actGetOffers.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
                state.error = action.payload
      }
    });
  },
})
export const { offersRecordsCleanUp } = offersSlice.actions
export { actGetOffers }
export default offersSlice.reducer;