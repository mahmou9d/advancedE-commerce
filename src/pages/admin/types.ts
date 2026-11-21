export type AdminTab = "overview" | "products" | "categories" | "orders";

export type TProductViewMode = "table" | "grid";

export type TProductFilter = {
  search: string;
  category: string;
  offerOnly: boolean;
  sortBy: "newest" | "price-asc" | "price-desc" | "title";
};

export type TDashboardStats = {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  totalStockUnits: number;
  productsOnSale: number;
  lowStockCount: number;
};

export type TProductFormData = {
  title: string;
  price: number;
  offer: number;
  max: number;
  cat_prefix: string;
  img: string;
};

export type TOrderStatus = "pending" | "processing" | "completed" | "cancelled";

export type TAdminFeedback = {
  type: "success" | "error" | "info";
  message: string;
} | null;

export const CATEGORY_OPTIONS = [
  { value: "shoes", label: "Shoes", icon: "shoes" },
  { value: "electronics", label: "Electronics", icon: "electronics" },
  { value: "sport", label: "Sport", icon: "sport" },
  { value: "kids", label: "Kids", icon: "kids" },
  { value: "women", label: "Women", icon: "women" },
  { value: "men", label: "Men", icon: "men" },
];

export type TCategoryMeta = {
  prefix: string;
  title: string;
  count: number;
  icon: string;
  valuation: number;
};
