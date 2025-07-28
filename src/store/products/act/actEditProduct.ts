import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDatabase, ref, update } from "firebase/database";
import { TProduct } from "@customTypes/product";
import { axiosErrorHandler } from "@util/index";

const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const API_KEY = "cabad257b34a18c7d587555fd97270e9"; 

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) throw new Error("❌ فشل رفع الصورة");

    return data.data.url;
};

const actEditProduct = createAsyncThunk(
    "products/actEditProduct",
    async (
        payload: { product: TProduct; imageFile: File | null },
        thunkAPI
    ) => {
        try {
            const { product, imageFile } = payload;
            const db = getDatabase();

            if (!product.id) throw new Error("Product ID is required");

            let finalImageURL = product.img;
            if (imageFile) {
                finalImageURL = await uploadToImgBB(imageFile);
            }

            const updatedProduct: TProduct = {
                id: product.id,
                title: product.title,
                price: product.price,
                max: product.max,
                cat_prefix: product.cat_prefix,
                img: finalImageURL,
            };

            const dbRef = ref(db, `products/${product.id}`);
            await update(dbRef, updatedProduct);

            return updatedProduct;
        } catch (error) {
            return thunkAPI.rejectWithValue(axiosErrorHandler(error));
        }
    }
);

export default actEditProduct;
