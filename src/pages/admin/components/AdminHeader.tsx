import React from "react";
import { Link } from "react-router-dom";
import { AdminTab } from "../types";

type AdminHeaderProps = {
  currentTab: AdminTab;
  onOpenMobileSidebar: () => void;
  onOpenAddModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onOpenAddModal,
  onRefresh,
  isRefreshing,
  searchQuery,
  onSearchChange,
}) => {
  const titles: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: {
      title: "Dashboard Overview",
      subtitle: "Monitor key metrics, sales insights, and inventory status.",
    },
    products: {
      title: "Products Inventory",
      subtitle: "Manage, filter, search, and update all store items.",
    },
    categories: {
      title: "Categories",
      subtitle: "Explore category distribution and product breakdown.",
    },
    orders: {
      title: "Customer Orders",
      subtitle:
        "Track order status, customer receipts, and transaction totals.",
    },
  };

  const { title, subtitle } = titles[currentTab] || titles.overview;

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur-md md:flex-row md:items-center md:justify-between">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
          className="rounded-xl border border-white/10 bg-slate-900 p-2 text-slate-300 hover:text-white lg:hidden"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link
              to="/"
              className="hover:text-blue-400 transition flex items-center gap-1"
            >
              <span>PrimeEcom</span>
            </Link>
            <span>/</span>
            <span>Admin</span>
            <span>/</span>
            <span className="capitalize text-blue-400 font-medium">
              {currentTab}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Actions & Search */}
      <div className="flex items-center gap-3">
        {/* Global Search in Header */}
        <div className="relative w-full sm:w-64">
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
            id="admin-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products... (Ctrl+K)"
            className="w-full rounded-xl border border-white/10 bg-slate-900/90 py-2 pl-9 pr-14 text-xs text-slate-100 placeholder-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          {!searchQuery && (
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
              ⌘K
            </kbd>
          )}
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
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

        {/* Live Refresh from Firebase */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Data from Firebase"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 hover:border-blue-400/40 hover:text-white transition disabled:opacity-50"
        >
          <svg
            className={`h-4 w-4 ${isRefreshing ? "animate-spin text-blue-400" : ""}`}
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
        </button>

        {/* View Storefront Link */}
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          title="Open Customer Store in new tab"
          className="hidden md:flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3 text-xs font-semibold text-slate-300 hover:border-white/20 hover:text-white transition"
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Store
        </Link>

        {/* Add Product Button */}
        <button
          onClick={onOpenAddModal}
          className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95"
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
    </header>
  );
};
