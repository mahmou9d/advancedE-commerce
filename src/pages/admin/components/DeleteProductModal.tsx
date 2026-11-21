import React, { useEffect } from "react";
import { TProduct } from "@customTypes/product";

type DeleteProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: TProduct | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
};

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  isDeleting,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => !isDeleting && onClose()}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-7 shadow-2xl shadow-black/80">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete Product</h3>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
          </div>
        </div>

        {/* Product Info Preview */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-950/60 p-3">
          <img
            src={product.img}
            alt={product.title}
            className="h-12 w-12 rounded-xl object-cover border border-white/10"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://placehold.co/100x100/1e293b/white?text=No+Img";
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{product.title}</p>
            <p className="text-[11px] text-slate-400">
              Category: <span className="text-blue-400 capitalize">{product.cat_prefix}</span> &bull; ${product.price}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-300">
          Are you sure you want to permanently delete this product from your Firebase database and store catalog?
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 active:scale-95 transition disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Permanently</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

