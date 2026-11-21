import React, { useState } from "react";
import { TOrderItem } from "@customTypes/order.type";

type OrdersViewProps = {
  orders: TOrderItem[];
  onUpdateStatus?: (orderKey: string, newStatus: string) => Promise<void>;
  onDeleteOrder?: (orderKey: string) => Promise<void>;
};

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onUpdateStatus,
  onDeleteOrder,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<TOrderItem | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const getOrderStatus = (ord: TOrderItem) => {
    return (ord as TOrderItem & { status?: string }).status || "completed";
  };

  const filteredOrders = orders.filter((o) => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchKey = (o.firebaseKey || "").toLowerCase().includes(q);
      const matchUser = (o.userId || "").toLowerCase().includes(q);
      const matchId = String(o.id).toLowerCase().includes(q);
      if (!matchKey && !matchUser && !matchId) return false;
    }

    // Status filter
    if (statusFilter !== "all") {
      const status = getOrderStatus(o);
      if (status !== statusFilter) return false;
    }

    return true;
  });

  const handleStatusChange = async (orderKey: string, status: string) => {
    if (!onUpdateStatus) return;
    setIsUpdatingStatus(true);
    try {
      await onUpdateStatus(orderKey, status);
      if (selectedOrder && selectedOrder.firebaseKey === orderKey) {
        setSelectedOrder({ ...selectedOrder, status } as TOrderItem);
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID or User ID..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-2 pl-9 pr-8 text-xs text-slate-100 placeholder-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-white/10 text-xs">
            {["all", "completed", "processing", "pending"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1 font-medium capitalize transition ${
                  statusFilter === st
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
          <span>
            Showing <span className="font-semibold text-white">{filteredOrders.length}</span> of {orders.length} orders
          </span>

          {(statusFilter !== "all" || search) && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium"
            >
              Reset Filters &times;
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl backdrop-blur-md">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">No orders found</h3>
            <p className="mt-1 text-xs text-slate-400">
              {search || statusFilter !== "all"
                ? "Try clearing your filters"
                : "Customer orders placed in the store will appear here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/[0.02] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Order Key / ID</th>
                  <th className="px-4 py-4">Customer User ID</th>
                  <th className="px-4 py-4">Items Ordered</th>
                  <th className="px-4 py-4">Total Amount</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((ord, idx) => {
                  const status = getOrderStatus(ord);
                  const isCompleted = status === "completed";
                  const isProcessing = status === "processing";
                  const isPending = status === "pending";

                  return (
                    <tr
                      key={ord.firebaseKey || ord.id || idx}
                      className="group transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3.5 font-mono font-medium text-slate-200">
                        #{ord.firebaseKey ? ord.firebaseKey.slice(-8) : ord.id}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-400 max-w-[180px] truncate">
                        {ord.userId || "Anonymous"}
                      </td>

                      <td className="px-4 py-3.5 text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {ord.items?.length || 0}
                          </span>{" "}
                          item{ord.items?.length !== 1 ? "s" : ""}
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {ord.items?.slice(0, 3).map((item, i) => (
                              <img
                                key={item.id || i}
                                src={item.img}
                                alt={item.title}
                                className="h-6 w-6 rounded-full object-cover border border-slate-900 bg-slate-950"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "https://placehold.co/50x50/1e293b/white?text=";
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-bold text-white text-sm">
                        ${ord.subtotal?.toFixed(2) || "0.00"}
                      </td>

                      {/* Status Tag & Changer */}
                      <td className="px-4 py-3.5">
                        {onUpdateStatus && ord.firebaseKey ? (
                          <select
                            value={status}
                            disabled={isUpdatingStatus}
                            onChange={(e) =>
                              handleStatusChange(ord.firebaseKey!, e.target.value)
                            }
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border cursor-pointer capitalize transition focus:outline-none ${
                              isCompleted
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                                : isProcessing
                                ? "bg-blue-500/15 text-blue-400 border-blue-500/20"
                                : isPending
                                ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                                : "bg-slate-800 text-slate-300 border-white/10"
                            }`}
                          >
                            <option value="completed">Completed</option>
                            <option value="processing">Processing</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Completed
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-blue-400/50 hover:bg-blue-600/20 hover:text-white transition"
                          >
                            View Items
                          </button>

                          {onDeleteOrder && ord.firebaseKey && (
                            <button
                              onClick={() => {
                                if (window.confirm("Delete this order record from Firebase?")) {
                                  onDeleteOrder(ord.firebaseKey!);
                                }
                              }}
                              title="Delete Order"
                              className="rounded-lg border border-white/10 bg-slate-800 p-1.5 text-slate-400 hover:border-rose-400 hover:bg-rose-600/20 hover:text-rose-400 transition"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-7 shadow-2xl shadow-black/80">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">
                  Order Details #{selectedOrder.firebaseKey?.slice(-8) || selectedOrder.id}
                </h3>
                <p className="text-xs text-slate-400">
                  User ID: <span className="font-mono text-slate-300">{selectedOrder.userId}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Selector in Modal */}
            {onUpdateStatus && selectedOrder.firebaseKey && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-white/5 text-xs">
                <span className="text-slate-400 font-medium">Order Status:</span>
                <select
                  value={getOrderStatus(selectedOrder)}
                  disabled={isUpdatingStatus}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.firebaseKey!, e.target.value)
                  }
                  className="rounded-lg bg-slate-800 border border-white/10 px-3 py-1 font-semibold text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}

            {/* Items list */}
            <div className="mt-4 max-h-80 divide-y divide-white/5 overflow-y-auto pr-1">
              {selectedOrder.items?.map((item, idx) => (
                <div key={item.id || idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="h-11 w-11 rounded-xl object-cover border border-white/10 bg-slate-950"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/100x100/1e293b/white?text=No+Img";
                      }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-400">
                        Qty: <span className="font-semibold text-slate-200">{item.quantity || 1}</span> &bull; ${item.price} each
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white">
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Footer */}
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-slate-400">Total Order Amount:</span>
              <span className="text-base font-bold text-emerald-400">
                ${selectedOrder.subtotal?.toFixed(2) || "0.00"}
              </span>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Receipt
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
