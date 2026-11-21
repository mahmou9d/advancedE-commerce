import axios from "axios";
import { TProduct } from "@customTypes/product";
import { TOrderItem } from "@customTypes/order.type";
import { TCategory } from "@customTypes/category";
import { database } from "@store/firebase";
import { ref, update, remove, push, set } from "firebase/database";

const IMGBB_API_KEY =
  import.meta.env.VITE_IMGBB_KEY || "cabad257b34a18c7d587555fd97270e9";

export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error("Failed to upload image to ImgBB");
  }

  return data.data.url;
};

export const fetchAllProducts = async (): Promise<TProduct[]> => {
  const response = await axios.get<Record<string, TProduct>>("/products.json");
  if (!response.data) return [];

  if (Array.isArray(response.data)) {
    return (response.data as TProduct[]).filter(Boolean);
  }

  return Object.entries(response.data).map(([key, product]) => ({
    ...product,
    id: product.id || key,
  }));
};

export type TPaginatedProductsResult = {
  products: TProduct[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

/**
 * Fetches only a single page of products from Firebase Realtime Database
 * instead of loading all products at once.
 * Uses shallow=true to determine total keys without downloading heavy payload.
 */
export const fetchProductsPaginated = async (
  page: number = 1,
  pageSize: number = 8
): Promise<TPaginatedProductsResult> => {
  try {
    // Step 1: Query shallow keys (ultralight: returns only IDs, NO images or heavy data)
    const shallowRes = await axios.get<Record<string, boolean>>("/products.json?shallow=true");
    if (!shallowRes.data) {
      return { products: [], totalCount: 0, totalPages: 1, currentPage: 1, pageSize };
    }

    const allKeys = Object.keys(shallowRes.data);
    const totalCount = allKeys.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const validPage = Math.min(Math.max(1, page), totalPages);

    const startIdx = (validPage - 1) * pageSize;
    const pageKeys = allKeys.slice(startIdx, startIdx + pageSize);

    // Step 2: Fetch only the products for the current page in parallel
    const pagePromises = pageKeys.map(async (key) => {
      try {
        const res = await axios.get<TProduct>(`/products/${key}.json`);
        if (res.data) {
          return {
            ...res.data,
            id: res.data.id || key,
          };
        }
        return null;
      } catch {
        return null;
      }
    });

    const products = (await Promise.all(pagePromises)).filter(Boolean) as TProduct[];

    return {
      products,
      totalCount,
      totalPages,
      currentPage: validPage,
      pageSize,
    };
  } catch (error) {
    console.error("Failed to fetch paginated products:", error);
    return { products: [], totalCount: 0, totalPages: 1, currentPage: 1, pageSize };
  }
};

export const deleteMultipleProducts = async (ids: string[]): Promise<void> => {
  await Promise.all(
    ids.map((id) => {
      const pRef = ref(database, `products/${id}`);
      return remove(pRef);
    })
  );
};

export const fetchAllOrders = async (): Promise<TOrderItem[]> => {
  try {
    const response = await axios.get<Record<string, TOrderItem>>("/orders.json");
    if (!response.data) return [];

    return Object.entries(response.data).map(([firebaseKey, order]) => ({
      ...order,
      firebaseKey,
    }));
  } catch {
    return [];
  }
};

export const updateOrderStatus = async (
  orderFirebaseKey: string,
  newStatus: string
): Promise<void> => {
  const orderRef = ref(database, `orders/${orderFirebaseKey}`);
  await update(orderRef, { status: newStatus });
};

export const deleteOrderRecord = async (
  orderFirebaseKey: string
): Promise<void> => {
  const orderRef = ref(database, `orders/${orderFirebaseKey}`);
  await remove(orderRef);
};

export const fetchAllCategories = async (): Promise<TCategory[]> => {
  try {
    const response = await axios.get<Record<string, TCategory>>("/category.json");
    if (!response.data) return [];
    if (Array.isArray(response.data)) {
      return (response.data as TCategory[]).filter(Boolean);
    }
    return Object.entries(response.data).map(([key, cat]) => ({
      ...cat,
      id: cat.id || key,
    }));
  } catch {
    return [];
  }
};

export const createCategoryRecord = async (newCategory: {
  title: string;
  prefix: string;
  img: string;
}): Promise<void> => {
  const catRef = ref(database, "category");
  const newCatRef = await push(catRef);
  await set(newCatRef, { ...newCategory, id: newCatRef.key });
};

export const deleteCategoryRecord = async (categoryPrefixOrKey: string): Promise<void> => {
  try {
    const response = await axios.get<Record<string, TCategory>>("/category.json");
    if (!response.data) return;

    for (const [key, cat] of Object.entries(response.data)) {
      if (
        key === categoryPrefixOrKey ||
        cat.prefix === categoryPrefixOrKey ||
        String(cat.id) === categoryPrefixOrKey ||
        (cat.title && cat.title.toLowerCase() === categoryPrefixOrKey.toLowerCase())
      ) {
        const catItemRef = ref(database, `category/${key}`);
        await remove(catItemRef);
      }
    }
  } catch (error) {
    console.error("Failed to delete category from Firebase:", error);
    throw error;
  }
};

export const exportProductsToCSV = (products: TProduct[]): void => {
  if (products.length === 0) return;

  const headers = ["ID", "Title", "Category", "Price", "Offer Price", "Max Limit", "Image URL"];
  const rows = products.map((p) => [
    `"${p.id || ""}"`,
    `"${(p.title || "").replace(/"/g, '""')}"`,
    `"${p.cat_prefix || ""}"`,
    p.price ?? 0,
    p.offer ?? 0,
    p.max ?? 1,
    `"${p.img || ""}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `products_export_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
