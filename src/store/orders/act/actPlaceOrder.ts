import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@store/index";
import axiosErrorHandler from "@util/axiosErrorHandler";

export type TPlaceOrderArgs =
    | number
    | {
          subtotal: number;
          paymentMethod?: "stripe" | "cod";
          paymentStatus?: "paid" | "pending";
          transactionId?: string;
          cardBrand?: string;
          last4?: string;
          shippingAddress?: {
              fullName?: string;
              address?: string;
              city?: string;
              postalCode?: string;
          };
      };

const actPlaceOrder = createAsyncThunk(
    "orders/actPlaceOrder",
    async (arg: TPlaceOrderArgs, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI;
        const { cart, auth } = getState() as RootState;

        const subtotal = typeof arg === "number" ? arg : arg.subtotal;
        const extraData = typeof arg === "object" ? arg : {};

        const orderItems = cart.productsFullInfo.map((el) => ({
            id: el.id,
            title: el.title,
            price: el.price,
            img: el.img,
            quantity: cart.items[el.id] || 1,
        }));

        try {
            const res = await axios.post("/orders.json", {
                userId: auth.user?.id,
                items: orderItems,
                subtotal,
                status: "processing",
                createdAt: new Date().toISOString(),
                paymentMethod: "stripe",
                paymentStatus: "paid",
                transactionId: `ch_stripe_${Math.random().toString(36).substring(2, 10)}${Date.now().toString().slice(-4)}`,
                ...extraData,
            });

            return res.data;
        } catch (error) {
            return rejectWithValue(axiosErrorHandler(error));
        }
    }
);

export default actPlaceOrder;
