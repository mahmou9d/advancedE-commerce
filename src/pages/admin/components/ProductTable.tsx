import React, { useMemo, useState, useEffect, useCallback } from "react";
import { TProduct } from "@customTypes/product";
import { CATEGORY_OPTIONS, TProductFilter, TProductViewMode } from "../types";
import {
  exportProductsToCSV,
  fetchProductsPaginated,
} from "../services/adminService";

type ProductTableProps = {
  products: TProduct[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEditProduct: (product: TProduct) => void;
  onDeleteProduct: (product: TProduct) => void;
  onOpenAddModal: () => void;
  onExportCSV?: () => void;
  onBatchDelete?: (ids: string[]) => Promise<void>;
  viewMode?: TProductViewMode;
  onViewModeChange?: (mode: TProductViewMode) => void;
};

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  searchQuery,
  onSearchChange,
  onEditProduct,
  onDeleteProduct,
  onOpenAddModal,
  onExportCSV,
  onBatchDelete,
  viewMode = "table",
  onViewModeChange,
}) => {
  const [filter, setFilter] = useState<TProductFilter>({
    search: searchQuery,
    category: "",
    offerOnly: false,
    sortBy: "newest",
  });

  const [localViewMode, setLocalViewMode] =
    useState<TProductViewMode>(viewMode);
  const currentView = onViewModeChange ? viewMode : localViewMode;
  const setView = onViewModeChange || setLocalViewMode;

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  // Server-Side / Backend Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [serverPageProducts, setServerPageProducts] = useState<TProduct[]>([]);
  const [serverTotalCount, setServerTotalCount] = useState<number>(0);
  const [isFetchingPage, setIsFetchingPage] = useState<boolean>(false);

  const effectiveSearch = searchQuery || filter.search;
  const hasActiveFilters = Boolean(
    effectiveSearch.trim() ||
    filter.category ||
    filter.offerOnly ||
    filter.sortBy !== "newest",
  );

  // Fetch only the requested page from Firebase backend on-demand
  const loadPageFromBackend = useCallback(
    async (page: number, size: number) => {
      setIsFetchingPage(true);
      try {
        const res = await fetchProductsPaginated(page, size);
        setServerPageProducts(res.products);
        setServerTotalCount(res.totalCount);
      } catch (err) {
        console.error("Backend pagination fetch error:", err);
      } finally {
        setIsFetchingPage(false);
      }
    },
    [],
  );

  // Trigger on-demand backend fetch whenever currentPage or pageSize changes
  useEffect(() => {
    if (!hasActiveFilters) {
      loadPageFromBackend(currentPage, pageSize);
    }
  }, [currentPage, pageSize, hasActiveFilters, loadPageFromBackend]);

  // If products length changed (e.g. after adding, editing or deleting), refresh current page
  useEffect(() => {
    if (!hasActiveFilters) {
      loadPageFromBackend(currentPage, pageSize);
    }
  }, [
    products.length,
    hasActiveFilters,
    currentPage,
    pageSize,
    loadPageFromBackend,
  ]);

  // Filtered Products (if client search/filter is active)
  const filteredProducts = useMemo(() => {
    if (!hasActiveFilters) {
      return serverPageProducts.length > 0 ? serverPageProducts : products;
    }
    return products
      .filter((p) => {
        if (effectiveSearch.trim()) {
          const q = effectiveSearch.toLowerCase().trim();
          const matchTitle = p.title?.toLowerCase().includes(q);
          const matchCat = p.cat_prefix?.toLowerCase().includes(q);
          const matchId = String(p.id).toLowerCase().includes(q);
          if (!matchTitle && !matchCat && !matchId) return false;
        }

        if (filter.category && p.cat_prefix !== filter.category) {
          return false;
        }

        if (
          filter.offerOnly &&
          (!p.offer || p.offer <= 0 || p.offer >= p.price)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === "price-asc") {
          return (a.offer || a.price) - (b.offer || b.price);
        }
        if (filter.sortBy === "price-desc") {
          return (b.offer || b.price) - (a.offer || a.price);
        }
        if (filter.sortBy === "title") {
          return (a.title || "").localeCompare(b.title || "");
        }
        return 0;
      });
  }, [
    hasActiveFilters,
    serverPageProducts,
    products,
    effectiveSearch,
    filter.category,
    filter.offerOnly,
    filter.sortBy,
  ]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [effectiveSearch, filter.category, filter.offerOnly, filter.sortBy]);

  // Total count & pages calculation
  const totalItemsCount = hasActiveFilters
    ? filteredProducts.length
    : serverTotalCount || products.length;
  const totalPages = Math.max(1, Math.ceil(totalItemsCount / pageSize));

  // Current page products: serverPageProducts when browsing by pages; sliced when filtered
  const paginatedProducts = useMemo(() => {
    if (!hasActiveFilters) {
      return serverPageProducts.length > 0
        ? serverPageProducts
        : products.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [
    hasActiveFilters,
    serverPageProducts,
    products,
    filteredProducts,
    currentPage,
    pageSize,
  ]);

  // Multi-selection handlers
  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllPage = () => {
    const allPageIds = paginatedProducts
      .map((p) => String(p.id))
      .filter(Boolean);
    const allSelected = allPageIds.every((id) => selectedIds.has(id));

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        allPageIds.forEach((id) => next.delete(id));
      } else {
        allPageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleBatchDelete = async () => {
    if (!onBatchDelete || selectedIds.size === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.size} selected products from Firebase?`,
      )
    ) {
      return;
    }

    setIsBatchDeleting(true);
    try {
      await onBatchDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const handleExportSelected = () => {
    const selectedProducts = products.filter((p) =>
      selectedIds.has(String(p.id)),
    );
    exportProductsToCSV(selectedProducts);
  };

  const isAllPageSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedIds.has(String(p.id)));

  return (
    <div className="space-y-6 relative">
      {/* Filters & Actions Bar */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-5 shadow-lg backdrop-blur-md space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Search & Filters */}
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={effectiveSearch}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setFilter((prev) => ({ ...prev, search: e.target.value }));
                }}
                placeholder="Search products by title, ID..."
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-2 pl-9 pr-8 text-xs text-slate-100 placeholder-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              {effectiveSearch && (
                <button
                  onClick={() => {
                    onSearchChange("");
                    setFilter((prev) => ({ ...prev, search: "" }));
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Category Select */}
            <select
              value={filter.category}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, category: e.target.value }))
              }
              className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">All Categories</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Sort Select */}
            <select
              value={filter.sortBy}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  sortBy: e.target.value as TProductFilter["sortBy"],
                }))
              }
              className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="newest">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>

            {/* Offer Only Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 hover:bg-slate-950 transition">
              <input
                type="checkbox"
                checked={filter.offerOnly}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    offerOnly: e.target.checked,
                  }))
                }
                className="h-3.5 w-3.5 rounded border-white/20 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0"
              />
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-rose-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 010 11.314z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                  />
                </svg>
                Discounts Only
              </span>
            </label>
          </div>

          {/* Right: Actions, View Toggle, Export, Add */}
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setView("table")}
                title="Table View"
                className={`rounded-lg p-1.5 transition ${
                  currentView === "table"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                title="Grid View"
                className={`rounded-lg p-1.5 transition ${
                  currentView === "grid"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>

            {/* Export CSV button */}
            {onExportCSV && (
              <button
                onClick={onExportCSV}
                title="Export catalog to CSV"
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs font-medium text-slate-300 hover:border-blue-400/50 hover:text-white transition"
              >
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            {/* Add Product Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Product
            </button>
          </div>
        </div>

        {/* Active filter count ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <span className="font-semibold text-white">
                {paginatedProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {totalItemsCount}
              </span>{" "}
              products
            </span>

            {isFetchingPage && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 animate-pulse">
                <svg
                  className="w-3 h-3 animate-spin text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Fetching page {currentPage}...
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg bg-slate-950/80 border border-white/10 px-2 py-0.5 text-[11px] text-white focus:outline-none focus:border-blue-400 cursor-pointer"
              >
                <option value={8}>8 / page</option>
                <option value={12}>12 / page</option>
                <option value={24}>24 / page</option>
              </select>
            </div>

            {(filter.category || filter.offerOnly || effectiveSearch) && (
              <button
                onClick={() => {
                  onSearchChange("");
                  setFilter({
                    search: "",
                    category: "",
                    offerOnly: false,
                    sortBy: "newest",
                  });
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium"
              >
                Clear all filters &times;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container: Table View OR Grid View */}
      {filteredProducts.length === 0 ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-16 text-center shadow-xl backdrop-blur-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-semibold text-white">
            No products found
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search query or filters to find what you&apos;re
            looking for.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                onSearchChange("");
                setFilter({
                  search: "",
                  category: "",
                  offerOnly: false,
                  sortBy: "newest",
                });
              }}
              className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenAddModal}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
            >
              Add New Product
            </button>
          </div>
        </div>
      ) : currentView === "grid" ? (
        /* GRID VIEW */
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedProducts.map((p) => {
            const hasDiscount = p.offer && p.offer > 0 && p.offer < p.price;
            const discountPct = hasDiscount
              ? Math.round(((p.price - p.offer!) / p.price) * 100)
              : 0;
            const isSelected = selectedIds.has(String(p.id));

            return (
              <div
                key={p.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-slate-900/70 p-4 shadow-lg backdrop-blur-md transition ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-950/20"
                    : "border-white/10 hover:border-blue-500/40 hover:shadow-xl"
                }`}
              >
                <div>
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/200x200/1e293b/white?text=No+Img";
                      }}
                    />

                    {/* Checkbox select */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(String(p.id))}
                        className="h-4 w-4 rounded border-white/30 bg-slate-900/80 text-blue-600 focus:ring-0 cursor-pointer shadow"
                      />
                    </div>

                    {hasDiscount && (
                      <span className="absolute bottom-2 left-2 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                        -{discountPct}% OFF
                      </span>
                    )}
                    <span className="absolute top-2 right-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] uppercase font-semibold text-slate-300 border border-white/10">
                      {p.cat_prefix}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="truncate font-semibold text-white text-sm group-hover:text-blue-400 transition">
                      {p.title}
                    </h4>
                    <p className="mt-0.5 text-[10px] font-mono text-slate-500">
                      ID: {p.id}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      {hasDiscount ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold text-emerald-400">
                            ${p.offer}
                          </span>
                          <span className="text-xs text-slate-500 line-through">
                            ${p.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-base font-bold text-white">
                          ${p.price}
                        </span>
                      )}
                      <p className="text-[10px] text-slate-400">
                        Limit: {p.max} max
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEditProduct(p)}
                        className="rounded-lg border border-white/10 bg-slate-800 p-2 text-slate-300 hover:border-blue-400 hover:text-white transition"
                        title="Edit product"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p)}
                        className="rounded-lg border border-white/10 bg-slate-800 p-2 text-slate-300 hover:border-rose-400 hover:text-rose-400 transition"
                        title="Delete product"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/[0.02] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={isAllPageSelected}
                      onChange={toggleSelectAllPage}
                      className="h-4 w-4 rounded border-white/30 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Price / Offer</th>
                  <th className="px-4 py-4">Max per order</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedProducts.map((p) => {
                  const hasDiscount =
                    p.offer && p.offer > 0 && p.offer < p.price;
                  const discountPct = hasDiscount
                    ? Math.round(((p.price - p.offer!) / p.price) * 100)
                    : 0;
                  const isSelected = selectedIds.has(String(p.id));

                  return (
                    <tr
                      key={p.id}
                      className={`group transition-colors ${
                        isSelected ? "bg-blue-950/30" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(String(p.id))}
                          className="h-4 w-4 rounded border-white/30 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3.5">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                            <img
                              src={p.img}
                              alt={p.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "https://placehold.co/100x100/1e293b/white?text=No+Img";
                              }}
                            />
                          </div>
                          <div className="min-w-0 max-w-[240px]">
                            <p className="truncate font-semibold text-white group-hover:text-blue-400 transition">
                              {p.title}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              ID: {p.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-400 border border-blue-500/20 capitalize">
                          {p.cat_prefix}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {hasDiscount ? (
                          <div className="flex items-center gap-2">
                            <div>
                              <span className="font-bold text-emerald-400 text-sm">
                                ${p.offer}
                              </span>
                              <span className="ml-1.5 text-[11px] text-slate-500 line-through">
                                ${p.price}
                              </span>
                            </div>
                            <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                              -{discountPct}%
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-white text-sm">
                            ${p.price}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-slate-300">
                        <span className="font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          {p.max} units
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {hasDiscount ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-rose-300 border border-rose-500/30">
                            <svg
                              className="w-3 h-3 text-rose-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 010 11.314z"
                              />
                            </svg>
                            On Sale
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                            Regular
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditProduct(p)}
                            title="Edit product"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-800/80 text-slate-300 hover:border-blue-400/50 hover:bg-blue-600/20 hover:text-blue-300 transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.8}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p)}
                            title="Delete product"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-800/80 text-slate-300 hover:border-rose-400/50 hover:bg-rose-600/20 hover:text-rose-400 transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.8}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar when items are selected */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-2xl border border-blue-500/40 bg-slate-900/95 px-5 py-3 shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="flex items-center gap-2 text-xs font-semibold text-white">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px]">
              {selectedIds.size}
            </span>
            products selected
          </span>

          <span className="h-4 w-px bg-white/20" />

          {onBatchDelete && (
            <button
              onClick={handleBatchDelete}
              disabled={isBatchDeleting}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 transition shadow disabled:opacity-60"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>{isBatchDeleting ? "Deleting..." : "Delete Selected"}</span>
            </button>
          )}

          <button
            onClick={handleExportSelected}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition"
          >
            <svg
              className="w-3.5 h-3.5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Export Selected</span>
          </button>

          <button
            onClick={() => setSelectedIds(new Set())}
            className="rounded-xl p-1.5 text-slate-400 hover:text-white transition"
            title="Deselect all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      {totalItemsCount > pageSize && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              Page{" "}
              <span className="font-semibold text-white">{currentPage}</span> of{" "}
              <span className="font-semibold text-white">{totalPages}</span> (
              {totalItemsCount} items total)
            </span>
            {isFetchingPage && (
              <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                <svg
                  className="w-3.5 h-3.5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Loading...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isFetchingPage}
              className="rounded-xl border border-white/10 bg-slate-800 px-3 py-1.5 font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, idx, arr) => {
                const prevPage = arr[idx - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="text-slate-500 px-1">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      disabled={isFetchingPage}
                      className={`h-8 w-8 rounded-xl font-semibold transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "border border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isFetchingPage}
              className="rounded-xl border border-white/10 bg-slate-800 px-3 py-1.5 font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
