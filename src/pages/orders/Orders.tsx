import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Loading } from "@components/feedback";
import { TOrderItem, TOrderStatus } from "@customTypes/order.type";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import actGetOrders from "@store/orders/act/actGetOrders";
import { resetOrderStatus } from "@store/orders/ordersSlice";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

/* SVG Icons */
const Icons = {
  bag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-400">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  receipt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
    </svg>
  ),
  print: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
};

const StatusBadge = ({ status }: { status?: TOrderStatus }) => {
  const currentStatus = status || "processing";

  const styles = {
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    processing: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  }[currentStatus] || "border-blue-500/30 bg-blue-500/10 text-blue-300";

  const dotStyles = {
    completed: "bg-emerald-400",
    processing: "bg-blue-400 animate-pulse",
    pending: "bg-amber-400",
    cancelled: "bg-rose-400",
  }[currentStatus] || "bg-blue-400";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles}`} />
      {currentStatus}
    </span>
  );
};

const Orders = () => {
  const dispatch = useAppDispatch();
  const { loading, error, orderList } = useAppSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState<"all" | TOrderStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<TOrderItem | null>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const promise = dispatch(actGetOrders());
    return () => {
      promise.abort();
      dispatch(resetOrderStatus());
    };
  }, [dispatch]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orderList.filter((order) => {
      const matchesTab =
        activeTab === "all" ||
        (order.status || "processing").toLowerCase() === activeTab;

      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.firebaseKey?.toLowerCase().includes(q) ||
        order.transactionId?.toLowerCase().includes(q) ||
        order.items?.some((i) => i.title.toLowerCase().includes(q));

      return matchesTab && matchesSearch;
    });
  }, [orderList, activeTab, searchTerm]);

  // Status counts
  const counts = useMemo(() => {
    const res = { all: orderList.length, completed: 0, processing: 0, pending: 0, cancelled: 0 };
    orderList.forEach((o) => {
      const s = (o.status || "processing") as TOrderStatus;
      if (res[s] !== undefined) res[s]++;
    });
    return res;
  }, [orderList]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return "Recently placed";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="font-sans text-slate-100 antialiased space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10">
            {Icons.bag}
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Order History</h1>
            <p className="mt-1 text-sm text-slate-400">
              Track past orders, view receipts, and manage your deliveries.
            </p>
          </div>
        </div>

        <Link
          to="/categories"
          className={`inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-800 ${focus}`}
        >
          <span>Continue Shopping</span>
          {Icons.arrow}
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(["all", "processing", "completed", "pending", "cancelled"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition whitespace-nowrap ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:border-white/20"
              } ${focus}`}
            >
              {tab} ({counts[tab] ?? 0})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            {Icons.search}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Orders List Section */}
      <section>
        <Loading loading={loading} error={error} type="table">
          {filteredOrders.length > 0 ? (
            <div className="space-y-5">
              {filteredOrders.map((order) => {
                const orderId = order.firebaseKey || String(order.id);
                const isStripe = order.paymentMethod === "stripe" || !order.paymentMethod;

                return (
                  <article
                    key={orderId}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl backdrop-blur-sm transition hover:border-white/20"
                  >
                    {/* Order Card Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-slate-950/40 px-6 py-4">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="font-mono text-sm font-bold text-white">
                          Order #{orderId.slice(0, 10)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatDate(order.createdAt)}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>

                      {/* Payment Pill */}
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-300">
                          {Icons.card}
                          <span>{isStripe ? "Paid via Stripe" : "Cash on Delivery"}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className={`inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition ${focus}`}
                        >
                          {Icons.receipt}
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-6">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-950/40 p-3"
                          >
                            <img
                              src={item.img}
                              alt={item.title}
                              className="h-16 w-16 shrink-0 rounded-xl object-cover bg-slate-800"
                              onError={(e) => {
                                e.currentTarget.style.opacity = "0.3";
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="truncate text-sm font-semibold text-white">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Qty: {item.quantity || 1} × ${item.price}
                              </p>
                              {item.cat_prefix && (
                                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                                  {item.cat_prefix}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer summary */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 text-xs text-slate-400">
                        <div>
                          {order.shippingAddress ? (
                            <span>
                              Shipping to:{" "}
                              <strong className="text-slate-200">
                                {order.shippingAddress.fullName || "Customer"} (
                                {order.shippingAddress.city || "Cairo"})
                              </strong>
                            </span>
                          ) : (
                            <span>Standard 24-48h Delivery</span>
                          )}
                          {order.transactionId && (
                            <span className="ml-3 font-mono text-[11px] text-slate-500">
                              Trx: {order.transactionId}
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 uppercase font-semibold">Total:</span>
                          <span className="text-lg font-black text-white">
                            ${order.subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div
              role="status"
              className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/10 bg-slate-900/70 px-8 py-14 text-center shadow-2xl backdrop-blur-md"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-xl shadow-blue-500/10">
                {Icons.bag}
              </span>
              <h3 className="mt-5 text-xl font-bold">No orders found</h3>
              <p className="mt-2 text-sm text-slate-400">
                {searchTerm
                  ? "No orders match your search query."
                  : "You haven't placed any orders yet. Discover our latest collections!"}
              </p>
              <Link
                to="/categories"
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-bold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 ${focus}`}
              >
                <span>Start Shopping</span>
                {Icons.arrow}
              </Link>
            </div>
          )}
        </Loading>
      </section>

      {/* Order Receipt Modal */}
      {selectedOrder &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
            <div
              aria-hidden="true"
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
            />

            <div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl shadow-black/80 sm:p-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    {Icons.receipt}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Order Receipt</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      #{selectedOrder.firebaseKey || selectedOrder.id}
                    </p>
                  </div>
                </div>
                <button
                  ref={modalCloseRef}
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  aria-label="Close"
                  className={`rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition ${focus}`}
                >
                  {Icons.close}
                </button>
              </div>

              {/* Receipt Details */}
              <div className="mt-6 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-950/60 p-4 text-xs">
                  <div>
                    <span className="text-slate-400">Order Date:</span>
                    <p className="font-semibold text-slate-200 mt-0.5">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Payment:</span>
                    <p className="font-semibold text-indigo-300 mt-0.5">
                      {selectedOrder.paymentMethod === "stripe" || !selectedOrder.paymentMethod
                        ? "Stripe 256-Bit SSL"
                        : "Cash on Delivery"}
                    </p>
                  </div>
                  {selectedOrder.transactionId && (
                    <div className="col-span-2">
                      <span className="text-slate-400">Transaction ID:</span>
                      <p className="font-mono text-slate-300 mt-0.5 break-all">
                        {selectedOrder.transactionId}
                      </p>
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/40 p-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white line-clamp-1">{item.title}</p>
                          <p className="text-slate-400">Qty: {item.quantity || 1}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-200">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span className="text-emerald-400">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-3 text-sm font-bold text-white">
                    <span>Grand Total</span>
                    <span className="text-base text-blue-400">
                      ${selectedOrder.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 font-semibold text-xs text-white hover:bg-white/10 transition ${focus}`}
                  >
                    {Icons.print}
                    <span>Print Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className={`flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-xs text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 ${focus}`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Orders;
