import { TOrderItem } from "@customTypes/order.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store/index";
import axiosErrorHandler from "@util/axiosErrorHandler";
import axios from "axios";

type TFirebaseOrders = Record<string, TOrderItem>;

const actGetOrders = createAsyncThunk(
    "orders/actGetOrders",
    async (_, thunkAPI) => {
        const { rejectWithValue, getState, signal } = thunkAPI;
        const { auth } = getState() as RootState;

        try {
            const res = await axios.get<TFirebaseOrders>(`/orders.json`, { signal });

            if (!res.data) return [];

            const filteredOrders = Object.entries(res.data)
            
                .filter(([, order]) => order.userId === String(auth.user?.id)) 
                .map(([firebaseKey, order]) => ({
                    ...order,
                    firebaseKey,
                }));

            return filteredOrders;
        } catch (error) {
            return rejectWithValue(axiosErrorHandler(error));
        }
    }
);

export default actGetOrders;




// import { TOrderItem } from "@customTypes/order.type";
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { RootState } from "@store/index";
// import axiosErrorHandler from "@util/axiosErrorHandler";
// import axios from "axios";




// type TResponse = TOrderItem[];


// const actGetOrders = createAsyncThunk("orders/actGetOrders",async(_,thunkAPI)=>{
//     const {rejectWithValue,getState,signal} =thunkAPI
//     const {auth} =getState() as RootState
//     try {
//         const res =await axios.get<TResponse>(`/orders?userId=${auth.user?.id}`,{signal})
//     return res.data
//     } catch (error) {
//         return rejectWithValue(axiosErrorHandler(error));
//     }
// })

// export default actGetOrders;