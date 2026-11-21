import React from "react";
import { TProduct } from "@customTypes/product";
import { TOrderItem } from "@customTypes/order.type";
import { TDashboardStats, CATEGORY_OPTIONS, AdminTab } from "../types";
import { RevenueChart } from "./RevenueChart";
import { CategoryIcon } from "./CategoryIcon";

type AdminOverviewProps = {
  stats: TDashboardStats;
  products: TProduct[];
  orders: TOrderItem[];
  onSelectTab: (tab: AdminTab) => void;
  onOpenAddModal: () => void;
  onEditProduct: (product: TProduct) => void;
  onSelectCategoryFilter?: (category: string) => void;
};

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  stats,
  products,
  orders,
  onSelectTab,
  onOpenAddModal,
  onEditProduct,
  onSelectCategoryFilter,
}) => {
  // Category breakdown calculation
  const categoryCounts = CATEGORY_OPTIONS.map((cat) => {
    const count = products.filter((p) => p.cat_prefix === cat.value).length;
    const percentage = stats.totalProducts > 0 ? Math.round((count / stats.totalProducts) * 100) : 0;
    return {
      ...cat,
      count,
      percentage,
    };
  });

  // Recent 5 products
  const recentProducts = [...products].reverse().slice(0, 5);

  // Recent 5 orders
  const recentOrders = [...orders].reverse().slice(0, 5);

  // Low stock products alert (max limit <= 2)
  const lowStockItems = products.filter((p) => p.max <= 2).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md transition hover:border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-white">
                ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                +14.2%
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">From {stats.totalOrders} customer orders</p>
          </div>
        </div>

        {/* Orders Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md transition hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-white">{stats.totalOrders}</h3>
              <span className="inline-flex items-center text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                Live Sync
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>Realtime Firebase database</span>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md transition hover:border-purple-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Total Products
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/10">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-white">{stats.totalProducts}</h3>
              <span className="inline-flex items-center text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                {stats.productsOnSale} Offers
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Across {stats.totalCategories} active departments
            </p>
          </div>
        </div>

        {/* Average Order Value (AOV) Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md transition hover:border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Average Order Value
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/10">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              ${stats.avgOrderValue.toFixed(2)}
            </h3>
            <p className="mt-1 text-xs text-slate-400">Per customer transaction</p>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-md text-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-white">{stats.totalStockUnits} units</p>
            <p className="text-[10px] text-slate-400">Total Stock Max Limit</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-white">{stats.productsOnSale} products</p>
            <p className="text-[10px] text-slate-400">Active Sale Discounts</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-white">{stats.lowStockCount} items</p>
            <p className="text-[10px] text-slate-400">Low Order Limit Alert</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-white">Online & Healthy</p>
            <p className="text-[10px] text-slate-400">Firebase Realtime Sync</p>
          </div>
        </div>
      </div>

      {/* Sales & Orders Analytics Chart */}
      <RevenueChart orders={orders} />

      {/* Main Content Grid: Categories Breakdown & Recent Products */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Category Breakdown (1 col) */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="font-semibold text-white">Categories Distribution</h3>
              <p className="text-xs text-slate-400">Click to filter products</p>
            </div>
            <button
              onClick={() => onSelectTab("categories")}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View all
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {categoryCounts.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  if (onSelectCategoryFilter) onSelectCategoryFilter(cat.value);
                  onSelectTab("products");
                }}
                className="w-full text-left space-y-1.5 group p-1.5 -mx-1.5 rounded-xl hover:bg-white/[0.03] transition"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-200 group-hover:text-blue-400 transition">
                    <CategoryIcon name={cat.icon || cat.value} className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-medium">{cat.label}</span>
                  </span>
                  <span className="text-slate-400">
                    <span className="font-semibold text-white">{cat.count}</span> items ({cat.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Quick CTA */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <button
              onClick={onOpenAddModal}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] py-2.5 text-xs font-semibold text-slate-300 hover:border-blue-400 hover:text-white transition active:scale-[0.98]"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </button>
          </div>
        </div>

        {/* Recent Products (2 cols) */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="font-semibold text-white">Recently Added Products</h3>
              <p className="text-xs text-slate-400">Latest additions to your catalog</p>
            </div>
            <button
              onClick={() => onSelectTab("products")}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              See all products ({stats.totalProducts}) &rarr;
            </button>
          </div>

          <div className="mt-4 divide-y divide-white/5">
            {recentProducts.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                No products found. Start by adding a product!
              </div>
            ) : (
              recentProducts.map((p) => {
                const hasDiscount = p.offer && p.offer > 0 && p.offer < p.price;
                return (
                  <div key={p.id} className="flex items-center justify-between py-3.5 group">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={p.img}
                        alt={p.title}
                        className="h-12 w-12 rounded-xl object-cover border border-white/10 bg-slate-950 shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://placehold.co/100x100/1e293b/white?text=No+Img";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white group-hover:text-blue-400 transition">
                          {p.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] uppercase font-semibold text-slate-400 border border-white/5">
                            {p.cat_prefix}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Limit: {p.max} per order
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 pl-3">
                      <div className="text-right">
                        {hasDiscount ? (
                          <>
                            <p className="text-sm font-bold text-emerald-400">${p.offer}</p>
                            <p className="text-[11px] text-slate-500 line-through">${p.price}</p>
                          </>
                        ) : (
                          <p className="text-sm font-bold text-white">${p.price}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onEditProduct(p)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
                        title="Edit product"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert Box if any items exist */}
      {lowStockItems.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              <div>
                <h4 className="text-sm font-bold text-amber-300">Strict Limit / Low Stock Warning</h4>
                <p className="text-xs text-amber-200/60">These products have a limit of 2 units or fewer per order</p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab("products")}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline"
            >
              Review in Products
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onEditProduct(item)}
                className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-slate-950/60 p-2.5 cursor-pointer hover:border-amber-400 transition"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-10 w-10 rounded-lg object-cover border border-white/10"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://placehold.co/80x80/1e293b/white?text=Img";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">{item.title}</p>
                  <p className="text-[11px] font-bold text-amber-400">Limit: {item.max} max</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Overview */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="font-semibold text-white">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400">Live order activity from Firebase Realtime Database</p>
          </div>
          <button
            onClick={() => onSelectTab("orders")}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            Manage all orders ({orders.length}) &rarr;
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No orders placed yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">Order ID / Key</th>
                  <th className="pb-3 font-semibold">User ID</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Total Amount</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((ord, idx) => (
                  <tr key={ord.firebaseKey || ord.id || idx} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-mono text-slate-300 font-medium">
                      #{ord.firebaseKey?.slice(-6) || ord.id}
                    </td>
                    <td className="py-3 text-slate-400 truncate max-w-[150px]">
                      {ord.userId || "Guest / Anonymous"}
                    </td>
                    <td className="py-3 text-slate-300">
                      <span className="font-semibold text-white">{ord.items?.length || 0}</span> items
                    </td>
                    <td className="py-3 font-semibold text-white">
                      ${ord.subtotal?.toFixed(2) || "0.00"}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                        <span className="h-1 w-1 rounded-full bg-emerald-400" />
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
