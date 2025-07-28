import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TLoading } from "@customTypes/shared";
import { TProduct } from "@customTypes/product";
import { isString } from "@customTypes/index";
import actGetProductSearch from "../products/act/actGetProductSearch";
interface ICategoriesState {
    records: TProduct[];
    loading: TLoading;
    error: string | null;
    searchText: string;
}

const initialState: ICategoriesState = {
    records: [],
    loading: "idle",
    error: null,
    searchText: "",
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchText(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(actGetProductSearch.pending, (state) => {
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(actGetProductSearch.fulfilled, (state, action) => {
            state.loading = "succeeded";
            state.records = action.payload;
        });
        builder.addCase(actGetProductSearch.rejected, (state, action) => {
            state.loading = "failed";
            if (isString(action.payload)) {
                state.error = action.payload;
            }
        });
    },
});

export const { setSearchText } = searchSlice.actions;
export { actGetProductSearch };
export default searchSlice.reducer;