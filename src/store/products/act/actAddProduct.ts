// @store/products/act/actAddProduct.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ref, push, set } from "firebase/database";
import { TProduct } from "@customTypes/product";
import { database } from "@store/firebase";
const actAddProduct = createAsyncThunk(
    "products/actAddProduct",
    async (productData: Omit<TProduct, "id">, thunkAPI) => {
        try {
            const productRef = ref(database, "products");
            const newProductRef = await push(productRef);

            const productWithId: TProduct = {
                ...productData,
                id: newProductRef.key!,
            };

            await set(newProductRef, productWithId);

            return productWithId;
        } catch (error) {
            return thunkAPI.rejectWithValue("Error adding product to Firebase");
        }
    }
);


export default actAddProduct;

