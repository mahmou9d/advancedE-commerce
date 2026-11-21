import React, { useState, useEffect } from "react";
import { TProduct } from "@customTypes/product";
import { CATEGORY_OPTIONS } from "../types";
import {
  createCategoryRecord,
  deleteCategoryRecord,
  fetchAllCategories,
} from "../services/adminService";
import { CategoryIcon } from "./CategoryIcon";

type CategoriesViewProps = {
  products: TProduct[];
  onSelectCategory: (categoryPrefix: string) => void;
  onOpenAddModal: () => void;
};

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  products,
  onSelectCategory,
  onOpenAddModal,
}) => {
  const [categoriesList, setCategoriesList] = useState(CATEGORY_OPTIONS);
  const [search, setSearch] = useState("");
  const [isNewCatModalOpen, setIsNewCatModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [isDeletingCat, setIsDeletingCat] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newPrefix, setNewPrefix] = useState("");
  const [newIcon, setNewIcon] = useState("tag");
  const [newImg, setNewImg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Load and merge categories from Firebase on mount
  useEffect(() => {
    let isMounted = true;
    fetchAllCategories()
      .then((firebaseCats) => {
        if (!isMounted || !firebaseCats || firebaseCats.length === 0) return;
        setCategoriesList((prev) => {
          const map = new Map<
            string,
            { value: string; label: string; icon: string }
          >();
          // 1. Put built-in categories
          prev.forEach((c) => map.set(c.value.toLowerCase(), c));
          // 2. Put Firebase categories
          firebaseCats.forEach((fc) => {
            const prefix = (fc.prefix || fc.title || "").toLowerCase().trim();
            if (prefix) {
              map.set(prefix, {
                value: prefix,
                label: fc.title || prefix,
                icon: prefix,
              });
            }
          });
          return Array.from(map.values());
        });
      })
      .catch((err) => console.error("Error loading categories:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCategories = categoriesList.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      c.label.toLowerCase().includes(q) || c.value.toLowerCase().includes(q)
    );
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newTitle.trim() || !newPrefix.trim()) {
      setErrorMsg("Please enter both title and prefix.");
      return;
    }

    const cleanPrefix = newPrefix.trim().toLowerCase().replace(/\s+/g, "");

    setIsSaving(true);
    try {
      await createCategoryRecord({
        title: newTitle.trim(),
        prefix: cleanPrefix,
        img:
          newImg.trim() ||
          "https://placehold.co/400x300/1e293b/white?text=" + newTitle,
      });

      // Update local categories list
      setCategoriesList((prev) => [
        ...prev,
        {
          value: cleanPrefix,
          label: newTitle.trim(),
          icon: newIcon || "tag",
        },
      ]);

      setIsNewCatModalOpen(false);
      setNewTitle("");
      setNewPrefix("");
      setNewIcon("tag");
      setNewImg("");
      setFeedbackMsg(`Category "${newTitle}" created successfully!`);
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch {
      setErrorMsg("Failed to save category to Firebase.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeletingCat(true);
    try {
      await deleteCategoryRecord(categoryToDelete.value);
      setCategoriesList((prev) =>
        prev.filter((c) => c.value !== categoryToDelete.value),
      );
      setFeedbackMsg(`Category "${categoryToDelete.label}" deleted.`);
      setTimeout(() => setFeedbackMsg(null), 3500);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category from Firebase.");
    } finally {
      setIsDeletingCat(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Store Categories</h2>
          <p className="text-xs text-slate-400">
            Browse and manage product inventory grouped by department
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative min-w-[180px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter categories..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsNewCatModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-600/20 px-3.5 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-600 hover:text-white transition shadow-sm"
          >
            <span>+ New Category</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((cat) => {
          const categoryProducts = products.filter(
            (p) => p.cat_prefix === cat.value,
          );
          const totalValuation = categoryProducts.reduce(
            (acc, p) => acc + (p.offer && p.offer > 0 ? p.offer : p.price),
            0,
          );
          const discountedCount = categoryProducts.filter(
            (p) => p.offer && p.offer > 0 && p.offer < p.price,
          ).length;

          return (
            <div
              key={cat.value}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg backdrop-blur-md transition-all hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-blue-400 shadow-inner">
                      <CategoryIcon
                        name={cat.icon || cat.value}
                        className="w-6 h-6"
                      />
                    </span>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition">
                        {cat.label}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500">
                        prefix: {cat.value}
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">
                    {categoryProducts.length} items
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-white/5 bg-slate-950/60 p-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Inventory Value
                    </span>
                    <p className="mt-0.5 font-bold text-white">
                      ${totalValuation.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      On Sale
                    </span>
                    <p className="mt-0.5 font-bold text-purple-400">
                      {discountedCount} products
                    </p>
                  </div>
                </div>

                {/* Thumbnails of items */}
                <div className="mt-4 flex items-center gap-1.5 overflow-hidden">
                  {categoryProducts.length === 0 ? (
                    <span className="text-[11px] text-slate-500 italic py-1">
                      No products yet in this category
                    </span>
                  ) : (
                    <>
                      {categoryProducts.slice(0, 4).map((p, i) => (
                        <img
                          key={p.id || i}
                          src={p.img}
                          alt={p.title}
                          className="h-9 w-9 rounded-lg object-cover border border-white/10 bg-slate-950 shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://placehold.co/100x100/1e293b/white?text=No+Img";
                          }}
                        />
                      ))}
                      {categoryProducts.length > 4 && (
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-800 text-[10px] font-semibold text-slate-300">
                          +{categoryProducts.length - 4}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={() => onSelectCategory(cat.value)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2 text-xs font-semibold text-slate-200 hover:border-blue-400/50 hover:bg-blue-600/10 hover:text-white transition active:scale-[0.98]"
                >
                  <span>View Products ({categoryProducts.length})</span>
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setCategoryToDelete(cat)}
                  title={`Delete category "${cat.label}" from Firebase`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 transition"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Category Modal */}
      {isNewCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isSaving && setIsNewCatModalOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-7 shadow-2xl shadow-black/80">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <CategoryIcon name="tag" className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Create Category
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add a new store department in Firebase
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isSaving && setIsNewCatModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
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

            {errorMsg && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Watches, Gaming..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Prefix (Identifier) *
                </label>
                <input
                  type="text"
                  value={newPrefix}
                  onChange={(e) => setNewPrefix(e.target.value)}
                  placeholder="e.g. watches (lowercase, no spaces)"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Icon Name (optional)
                  </label>
                  <input
                    type="text"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    placeholder="e.g. tech, shoes, sports, bag"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Banner URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newImg}
                    onChange={(e) => setNewImg(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewCatModalOpen(false)}
                  disabled={isSaving}
                  className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
                >
                  {isSaving ? "Saving..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isDeletingCat && setCategoryToDelete(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-sm rounded-3xl border border-rose-500/30 bg-slate-900 p-6 shadow-2xl shadow-black/80">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Delete Category
                </h3>
                <p className="text-xs text-slate-400">
                  Delete &quot;{categoryToDelete.label}&quot; from Datebase?
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-300 leading-relaxed rounded-xl bg-slate-950/60 p-3 border border-white/5">
              This will remove the category record. Products currently assigned
              to this category will not be deleted, but the category group will
              be removed.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                disabled={isDeletingCat}
                className="rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                disabled={isDeletingCat}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 disabled:opacity-60"
              >
                {isDeletingCat ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating feedback toast */}
      {feedbackMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/90 px-4 py-2.5 text-xs font-semibold text-emerald-300 shadow-2xl backdrop-blur-xl">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{feedbackMsg}</span>
        </div>
      )}
    </div>
  );
};
