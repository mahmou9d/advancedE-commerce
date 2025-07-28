import { TProduct } from "./product";


export type TOrderItem = {
    id: number;
    items: TProduct[];
    subtotal: number;
    firebaseKey?: string;
    userId: string;
};