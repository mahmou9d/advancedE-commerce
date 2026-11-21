import React from "react";
import { Link } from "react-router-dom";
import { AdminTab } from "../types";

type AdminSidebarProps = {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onOpenAddModal: () => void;
  productCount: number;
  orderCount: number;
  adminEmail?: string;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  productCount,
  orderCount,
  adminEmail,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: "overview" as AdminTab,
      label: "Overview",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      id: "products" as AdminTab,
      label: "Products",
      badge: productCount,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      id: "categories" as AdminTab,
      label: "Categories",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
    },
    {
      id: "orders" as AdminTab,
      label: "Orders",
      badge: orderCount,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-white/10 bg-slate-900/95 p-6 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen
            ? "translate-x-0 shadow-2xl shadow-blue-500/10"
            : "-translate-x-full"
        }`}
      >
        {/* Top: Logo & Nav */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <Link
              to="/"
              title="Go to customer storefront"
              className="flex items-center gap-3 group transition"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                  PrimeEcom
                  <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/30">
                    ADMIN
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Store Management</p>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <svg
                className="w-5 h-5"
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

          {/* Quick Action: New Product */}
          <button
            onClick={() => {
              onOpenAddModal();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-blue-400 active:scale-[0.98]"
          >
            <svg
              className="w-5 h-5"
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
            Add New Product
          </button>

          {/* Nav List */}
          <nav className="space-y-1.5 pt-2">
            <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Menu
            </span>
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-inner"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={isActive ? "text-blue-400" : "text-slate-400"}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isActive
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Card & Store Link */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:border-blue-400/30 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Store
            </span>
          </Link>

          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3 border border-white/5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-sm font-bold text-blue-400 border border-blue-500/30">
              {adminEmail ? adminEmail[0].toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {adminEmail || "Admin User"}
              </p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Authorized Admin
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
