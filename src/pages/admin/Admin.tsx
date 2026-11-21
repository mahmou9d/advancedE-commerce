import React from "react";
import { useAppSelector } from "@store/hooks";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { AdminOverview } from "./components/AdminOverview";
import { ProductTable } from "./components/ProductTable";
import { CategoriesView } from "./components/CategoriesView";
import { OrdersView } from "./components/OrdersView";
import { ProductFormModal } from "./components/ProductFormModal";
import { DeleteProductModal } from "./components/DeleteProductModal";

const Admin: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const {
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
    refreshData,
    exportProducts,

    // Modal controls
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    productToEdit,
    editProduct,
    saveProduct,

    // Delete controls
    productToDelete,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    batchDeleteProducts,
    isDeleting,

    // Order actions
    updateOrderStatus,
    deleteOrder,

    // Mobile sidebar
    isMobileSidebarOpen,
    openMobileSidebar,
    closeMobileSidebar,
  } = useAdminDashboard();

  // Global Keyboard Shortcuts (Ctrl+K for search, N for new product)
  React.useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("admin-search-input");
        searchInput?.focus();
      }

      if (e.key.toLowerCase() === "n" && !isAddModalOpen && !productToDelete) {
        e.preventDefault();
        openAddModal();
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [isAddModalOpen, productToDelete, openAddModal]);

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Background radial glows */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="fixed -top-40 left-1/3 -z-10 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="fixed bottom-0 right-10 -z-10 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"
      />

      {/* Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddModal={openAddModal}
        productCount={products.length}
        orderCount={orders.length}
        adminEmail={user?.email}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Sticky Header */}
        <AdminHeader
          currentTab={currentTab}
          onOpenMobileSidebar={openMobileSidebar}
          onOpenAddModal={openAddModal}
          onRefresh={refreshData}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Floating Notification Toast */}
        {feedback && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
            {feedback.type === "success" ? (
              <div className="flex items-center gap-2.5 text-emerald-300 border-emerald-500/30 bg-emerald-950/90 shadow-emerald-900/30 border rounded-xl px-3 py-2">
                <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{feedback.message}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-rose-300 border-rose-500/30 bg-rose-950/90 shadow-rose-900/30 border rounded-xl px-3 py-2">
                <svg className="h-4 w-4 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{feedback.message}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {isLoading ? (
            <div className="flex h-96 flex-col items-center justify-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
                <div className="h-10 w-10 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
              </div>
              <p className="text-xs font-medium text-slate-400">Loading admin dashboard from Firebase...</p>
            </div>
          ) : (
            <>
              {currentTab === "overview" && (
                <AdminOverview
                  stats={stats}
                  products={products}
                  orders={orders}
                  onSelectTab={setCurrentTab}
                  onOpenAddModal={openAddModal}
                  onEditProduct={editProduct}
                  onSelectCategoryFilter={(prefix) => {
                    setSearchQuery(prefix);
                    setCurrentTab("products");
                  }}
                />
              )}

              {currentTab === "products" && (
                <ProductTable
                  products={products}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onEditProduct={editProduct}
                  onDeleteProduct={openDeleteModal}
                  onOpenAddModal={openAddModal}
                  onExportCSV={exportProducts}
                  onBatchDelete={batchDeleteProducts}
                  viewMode={productViewMode}
                  onViewModeChange={setProductViewMode}
                />
              )}

              {currentTab === "categories" && (
                <CategoriesView
                  products={products}
                  onSelectCategory={(prefix) => {
                    setSearchQuery(prefix);
                    setCurrentTab("products");
                  }}
                  onOpenAddModal={openAddModal}
                />
              )}

              {currentTab === "orders" && (
                <OrdersView
                  orders={orders}
                  onUpdateStatus={updateOrderStatus}
                  onDeleteOrder={deleteOrder}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        productToEdit={productToEdit}
        onSave={saveProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProductModal
        isOpen={Boolean(productToDelete)}
        onClose={closeDeleteModal}
        product={productToDelete}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Admin;
