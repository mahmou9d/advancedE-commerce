export type TReview = {
  id?: string;
  productId: string | number;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string; // ISO string
  verifiedPurchase: boolean;
};

