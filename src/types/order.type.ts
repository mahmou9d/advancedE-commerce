import { TProduct } from "./product";

export type TOrderStatus = "pending" | "processing" | "completed" | "cancelled";

export type TOrderItem = {
    id: number | string;
    items: TProduct[];
    subtotal: number;
    firebaseKey?: string;
    userId: string;
    status?: TOrderStatus;
    createdAt?: string;
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
