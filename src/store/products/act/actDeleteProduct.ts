import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDatabase, ref, remove } from "firebase/database";
import { axiosErrorHandler } from "@util/index";

const actDeleteProduct = createAsyncThunk(
    "products/actDeleteProduct",
    async (productId: string, thunkAPI) => {
        try {
            const db = getDatabase();
            const dbRef = ref(db, `products/${productId}`);
            await remove(dbRef);
            return productId;
        } catch (error) {
            return thunkAPI.rejectWithValue(axiosErrorHandler(error));
        }
    }
);

export default actDeleteProduct;
