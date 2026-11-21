import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TProduct } from "@customTypes/product";
import { TOrderItem } from "@customTypes/order.type";
import { useAppDispatch } from "@store/hooks";
import actAddProduct from "@store/products/act/actAddProduct";
import actEditProduct from "@store/products/act/actEditProduct";
import actDeleteProduct from "@store/products/act/actDeleteProduct";
import {
  fetchAllProducts,
  fetchAllOrders,
  fetchAllCategories,
  updateOrderStatus,
  deleteOrderRecord,
  deleteMultipleProducts,
  exportProductsToCSV,
} from "../services/adminService";
import {
  AdminTab,
  CATEGORY_OPTIONS,
  TAdminFeedback,
  TDashboardStats,
  TProductFormData,
  TProductViewMode,
} from "../types";

export const useAdminDashboard = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const navigatedProduct = location.state as TProduct | null;

  const [currentTab, setCurrentTab] = useState<AdminTab>("overview");
  const [products, setProducts] = useState<TProduct[]>([]);
  const [orders, setOrders] = useState<TOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<TAdminFeedback>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [productViewMode, setProductViewMode] = useState<TProductViewMode>("table");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<TProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<TProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Auto-dismiss feedback message after 4s
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Load initial data from Firebase
  const loadDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [fetchedProducts, fetchedOrders] = await Promise.all([
        fetchAllProducts(),
        fetchAllOrders(),
        fetchAllCategories(),
      ]);

      setProducts(fetchedProducts);
      setOrders(fetchedOrders);
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to load dashboard data from Firebase.",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Open edit modal if arrived with product state
  useEffect(() => {
    if (navigatedProduct?.id) {
      setProductToEdit(navigatedProduct);
      setIsAddModalOpen(true);
      setCurrentTab("products");
    }
  }, [navigatedProduct]);

  // Handle Save (Add or Edit)
  const handleSaveProduct = async (
    formData: TProductFormData,
    existingId?: string
  ) => {
    try {
      if (existingId) {
        const updatedProduct: TProduct = {
          id: existingId,
          ...formData,
        };
        await dispatch(
          actEditProduct({ product: updatedProduct, imageFile: null })
        ).unwrap();

        setProducts((prev) =>
          prev.map((p) => (p.id === existingId ? updatedProduct : p))
        );

        setFeedback({
          type: "success",
          message: `Product "${formData.title}" updated successfully!`,
        });
      } else {
        const newProduct = await dispatch(actAddProduct(formData)).unwrap();
        setProducts((prev) => [...prev, newProduct]);

        setFeedback({
          type: "success",
          message: `Product "${formData.title}" published to Firebase!`,
        });
      }

      setProductToEdit(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error saving product to Firebase";
      setFeedback({ type: "error", message: msg });
      throw err;
    }
  };

  // Handle Delete
  const handleDeleteProduct = async () => {
    if (!productToDelete?.id) return;
    setIsDeleting(true);

    try {
      await dispatch(actDeleteProduct(String(productToDelete.id))).unwrap();

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));

      setFeedback({
        type: "success",
        message: `Product "${productToDelete.title}" deleted permanently.`,
      });
      setProductToDelete(null);
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to delete product from Firebase.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Batch Delete
  const handleBatchDelete = async (ids: string[]) => {
    try {
      await deleteMultipleProducts(ids);
      const idSet = new Set(ids);
      setProducts((prev) => prev.filter((p) => !idSet.has(String(p.id))));
      setFeedback({
        type: "success",
        message: `${ids.length} products deleted permanently from Firebase.`,
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to batch delete products.",
      });
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (
    orderFirebaseKey: string,
    newStatus: string
  ) => {
    try {
      await updateOrderStatus(orderFirebaseKey, newStatus);
      setOrders((prev) =>
        prev.map((ord) =>
          ord.firebaseKey === orderFirebaseKey
            ? ({ ...ord, status: newStatus } as TOrderItem & { status: string })
            : ord
        )
      );
      setFeedback({
        type: "success",
        message: `Order #${orderFirebaseKey.slice(-6)} status updated to ${newStatus}.`,
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to update order status.",
      });
    }
  };

  // Handle Order Deletion
  const handleDeleteOrder = async (orderFirebaseKey: string) => {
    try {
      await deleteOrderRecord(orderFirebaseKey);
      setOrders((prev) => prev.filter((o) => o.firebaseKey !== orderFirebaseKey));
      setFeedback({
        type: "success",
        message: `Order #${orderFirebaseKey.slice(-6)} deleted.`,
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to delete order record.",
      });
    }
  };

  // Calculate Dashboard Statistics
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
  const totalOrders = orders.length;

  const stats: TDashboardStats = {
    totalProducts: products.length,
    totalCategories: CATEGORY_OPTIONS.length,
    totalOrders,
    totalRevenue,
    avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    totalStockUnits: products.reduce((acc, p) => acc + (p.max || 0), 0),
    productsOnSale: products.filter(
      (p) => p.offer && p.offer > 0 && p.offer < p.price
    ).length,
    lowStockCount: products.filter((p) => p.max <= 2).length,
  };

  return {
    currentTab,
    setCurrentTab,
    products,
    orders,
    stats,
    isLoading,
    isRefreshing,
    feedback,
    searchQuery,
    setSearchQuery,
    productViewMode,
    setProductViewMode,
    refreshData: () => loadDashboardData(true),
    exportProducts: () => exportProductsToCSV(products),

    // Modal controls
    isAddModalOpen,
    openAddModal: () => {
      setProductToEdit(null);
      setIsAddModalOpen(true);
    },
    closeAddModal: () => {
      setProductToEdit(null);
      setIsAddModalOpen(false);
    },
    productToEdit,
    editProduct: (p: TProduct) => {
      setProductToEdit(p);
      setIsAddModalOpen(true);
    },
    saveProduct: handleSaveProduct,

    // Delete controls
    productToDelete,
    openDeleteModal: (p: TProduct) => setProductToDelete(p),
    closeDeleteModal: () => setProductToDelete(null),
    confirmDelete: handleDeleteProduct,
    batchDeleteProducts: handleBatchDelete,
    isDeleting,

    // Order actions
    updateOrderStatus: handleUpdateOrderStatus,
    deleteOrder: handleDeleteOrder,

    // Mobile sidebar
    isMobileSidebarOpen,
    openMobileSidebar: () => setIsMobileSidebarOpen(true),
    closeMobileSidebar: () => setIsMobileSidebarOpen(false),
  };
};
