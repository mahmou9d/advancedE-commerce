import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosErrorHandler } from "@util/index";
import axios from "axios";

const actLikeToggle = createAsyncThunk(
    "wishlist/actLikeToggle",
    async (id: number, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI;

        type RootState = {
            auth: {
                user?: {
                    id?: string;
                };
            };
        };

        try {
            const state = getState() as RootState;
            const userId = state.auth.user?.id;

            if (!userId) {
                throw new Error("User not authenticated");
            }

            const res = await axios.get<
                Record<string, { productId: number; userId: string }>
            >(`/wishlist.json`);

            const allItems = res.data || {};

            const userItems = Object.entries(allItems).filter(
                ([, value]) => value.userId === userId
            );

            const existing = userItems.find(
                ([, value]) => value.productId === id
            );

            if (existing) {
                const [firebaseKey] = existing;
                await axios.delete(`/wishlist/${firebaseKey}.json`);
                return { type: "remove", id };
            } else {
                await axios.post(`/wishlist.json`, {
                    userId,
                    productId: id,
                });
                return { type: "add", id };
            }
        } catch (error) {
            return rejectWithValue(axiosErrorHandler(error));
        }
    }
);

export default actLikeToggle;





// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosErrorHandler } from "@util/index";
// import axios from "axios";


// const actLikeToggle = createAsyncThunk("wishlist/actLikeToggle", async (id: number, thunkAPI) => {
//     const { rejectWithValue }= thunkAPI
//     try {
//         const isRecordExist = await axios.get(`/wishlist?userId=1&productId=${id}`)
//         if (isRecordExist.data.length > 0) {
//             await axios.delete(`/wishlist/${isRecordExist.data[0].id}`)
//             return { type: "remove", id }
//         } else {
//             await axios.post("/wishlist",{userId:"1",productId:id})
//             return { type: "add", id }
//         }
//     } catch (error) {
//         return rejectWithValue(axiosErrorHandler(error))

//     }
// })


// export default actLikeToggle