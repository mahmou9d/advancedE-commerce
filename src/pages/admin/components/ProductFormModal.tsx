import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { TProduct } from "@customTypes/product";
import { CATEGORY_OPTIONS, TProductFormData } from "../types";
import { uploadProductImage } from "../services/adminService";

type ProductFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: TProduct | null;
  onSave: (productData: TProductFormData, id?: string) => Promise<void>;
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
}) => {
  const isEditing = Boolean(productToEdit?.id);

  const [title, setTitle] = useState("");
  const [catPrefix, setCatPrefix] = useState("");
  const [customCatPrefix, setCustomCatPrefix] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [offer, setOffer] = useState<number>(0);
  const [max, setMax] = useState<number>(5);

  // Image states: either uploaded file or direct image URL
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Prepopulate form when productToEdit changes
  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title || "");
      const existingCat = productToEdit.cat_prefix || "";
      const isKnown = CATEGORY_OPTIONS.some((c) => c.value === existingCat);
      if (isKnown) {
        setCatPrefix(existingCat);
        setIsCustomCategory(false);
        setCustomCatPrefix("");
      } else {
        setCatPrefix("custom");
        setIsCustomCategory(true);
        setCustomCatPrefix(existingCat);
      }
      setPrice(productToEdit.price || 0);
      setOffer(productToEdit.offer || 0);
      setMax(productToEdit.max || 5);
      setImagePreview(productToEdit.img || "");
      setImageUrlInput(productToEdit.img || "");
      setImageFile(null);
      setImageMode(productToEdit.img ? "url" : "upload");
    } else {
      setTitle("");
      setCatPrefix("");
      setCustomCatPrefix("");
      setIsCustomCategory(false);
      setPrice(0);
      setOffer(0);
      setMax(5);
      setImagePreview("");
      setImageUrlInput("");
      setImageFile(null);
      setImageMode("upload");
    }
    setErrorMsg(null);
  }, [productToEdit, isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrlInput(url);
    setImagePreview(url);
    setImageFile(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const finalCatPrefix = isCustomCategory ? customCatPrefix.trim().toLowerCase() : catPrefix;

    if (!title.trim()) {
      setErrorMsg("Please enter product title.");
      return;
    }
    if (!finalCatPrefix) {
      setErrorMsg("Please select or enter a category prefix.");
      return;
    }
    if (!price || price <= 0) {
      setErrorMsg("Price must be greater than 0.");
      return;
    }
    if (offer && offer >= price) {
      setErrorMsg("Offer price must be lower than the regular price.");
      return;
    }
    if (!max || max <= 0) {
      setErrorMsg("Max per order must be at least 1.");
      return;
    }

    const currentImg = imageMode === "url" ? imageUrlInput.trim() : imagePreview;
    if (!currentImg && !imageFile) {
      setErrorMsg("Please provide a product image (file upload or image URL).");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImgUrl = currentImg;

      if (imageMode === "upload" && imageFile) {
        finalImgUrl = await uploadProductImage(imageFile);
      }

      await onSave(
        {
          title: title.trim(),
          cat_prefix: finalCatPrefix,
          price: Number(price),
          offer: Number(offer) || 0,
          max: Number(max) || 1,
          img: finalImgUrl,
        },
        productToEdit?.id !== undefined ? String(productToEdit.id) : undefined
      );

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving product.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountPercent =
    offer > 0 && price > offer ? Math.round(((price - offer) / price) * 100) : 0;
  const customerSavings = offer > 0 && price > offer ? (price - offer).toFixed(2) : "0.00";
  const displayCat = isCustomCategory ? customCatPrefix || "custom" : catPrefix || "category";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => !isSubmitting && onClose()}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl shadow-black/80 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditing ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? "Update product information in Firebase"
                  : "Fill in the details to publish a new product with live preview"}
              </p>
            </div>
          </div>

          <button
            onClick={() => !isSubmitting && onClose()}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-300">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body with Split Columns: Form on Left/Center, Live Preview on Right */}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Left Column: Form Fields */}
          <div className="space-y-5">
            <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
              {/* Image Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Image Source</span>
                  <div className="flex rounded-lg bg-slate-950 p-0.5 border border-white/10 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setImageMode("upload")}
                      className={`rounded-md px-2 py-0.5 font-medium transition ${
                        imageMode === "upload"
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`rounded-md px-2 py-0.5 font-medium transition ${
                        imageMode === "url"
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {imageMode === "upload" ? (
                  <>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/20 bg-slate-950/70 transition hover:border-blue-400"
                    >
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={() => setImagePreview("")}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100">
                            <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                              Change
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 p-3 text-center text-slate-400">
                          <svg className="h-8 w-8 text-slate-500 group-hover:text-blue-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[11px] font-medium">Click to upload</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-[10px] text-slate-500 text-center">JPG, PNG or WebP</p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 flex items-center justify-center">
                      {imageUrlInput ? (
                        <img
                          src={imageUrlInput}
                          alt="URL Preview"
                          className="h-full w-full object-cover"
                          onError={() => setErrorMsg("Could not load image from the provided URL.")}
                        />
                      ) : (
                        <span className="text-[11px] text-slate-500 p-2 text-center">
                          Paste URL below to preview
                        </span>
                      )}
                    </div>
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-2.5 py-1.5 text-[11px] text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Product Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Nike Air Max 270"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="category" className="block text-xs font-semibold text-slate-300">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(!isCustomCategory);
                        if (!isCustomCategory) setCatPrefix("custom");
                        else setCatPrefix("");
                      }}
                      className="text-[10px] text-blue-400 hover:text-blue-300"
                    >
                      {isCustomCategory ? "Choose standard" : "+ Custom prefix"}
                    </button>
                  </div>

                  {isCustomCategory ? (
                    <input
                      type="text"
                      value={customCatPrefix}
                      onChange={(e) => setCustomCatPrefix(e.target.value)}
                      placeholder="e.g. accessories, watches..."
                      className="w-full rounded-xl border border-blue-500/40 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  ) : (
                    <select
                      id="category"
                      value={catPrefix}
                      onChange={(e) => setCatPrefix(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="">Select a category</option>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label} ({cat.value})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing, Offer & Max */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="price" className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Price ($) *
                </label>
                <input
                  id="price"
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="120.00"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="offer" className="block text-xs font-semibold text-slate-300">
                    Offer Price ($)
                  </label>
                  {discountPercent > 0 && (
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
                <input
                  id="offer"
                  type="number"
                  min={0}
                  step={0.01}
                  value={offer || ""}
                  onChange={(e) => setOffer(Number(e.target.value))}
                  placeholder="Optional discount"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label htmlFor="max" className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Max Limit Per Order *
                </label>
                <input
                  id="max"
                  type="number"
                  min={1}
                  step={1}
                  value={max}
                  onChange={(e) => setMax(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Savings Callout */}
            {discountPercent > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                  Customer Saves: <strong className="text-white">${customerSavings}</strong>
                </span>
                <span className="font-bold">Discount: {discountPercent}% OFF</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving to Firebase...</span>
                  </>
                ) : (
                  <span>{isEditing ? "Update Product" : "Publish Product"}</span>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Real-time Live Storefront Card Preview */}
          <div className="hidden lg:flex flex-col space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Storefront Preview
            </span>

            <div className="overflow-hidden rounded-2xl border border-white/15 bg-slate-950 p-4 shadow-xl">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-900 border border-white/5">
                <img
                  src={imagePreview || "https://placehold.co/240x240/1e293b/white?text=Preview"}
                  alt="Live Preview"
                  className="h-full w-full object-cover"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-2 left-2 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
                    -{discountPercent}% OFF
                  </span>
                )}
                <span className="absolute top-2 right-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] uppercase font-semibold text-slate-300 border border-white/10 capitalize">
                  {displayCat}
                </span>
              </div>

              <div className="mt-3">
                <p className="truncate font-semibold text-white text-sm">
                  {title || "Product Title Preview"}
                </p>
                <div className="mt-2 flex items-baseline justify-between">
                  {discountPercent > 0 ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-emerald-400">${offer}</span>
                      <span className="text-xs text-slate-500 line-through">${price}</span>
                    </div>
                  ) : (
                    <span className="text-base font-bold text-white">${price || "0.00"}</span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">Max: {max}</span>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="mt-4 w-full rounded-xl bg-blue-600/40 py-2 text-center text-xs font-semibold text-white/70 cursor-not-allowed border border-blue-500/30"
              >
                Add to Cart
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center">
              Realtime rendering matching customer store
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
