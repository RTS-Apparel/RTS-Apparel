import React, { useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, Edit2, Check, X, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants } from "../../lib/animations";

export const AdminCategories: React.FC = () => {
  const categories = useDataStore((s) => s.categories);
  const products = useDataStore((s) => s.products);
  const addCategory = useDataStore((s) => s.addCategory);
  const updateCategory = useDataStore((s) => s.updateCategory);
  const reorderCategory = useDataStore((s) => s.reorderCategory);
  const deleteCategory = useDataStore((s) => s.deleteCategory);

  const [nameEn, setNameEn] = useState("");
  const [nameUr, setNameUr] = useState("");
  const [nameRomanUr, setNameRomanUr] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameEn, setEditNameEn] = useState("");
  const [editNameUr, setEditNameUr] = useState("");
  const [editNameRomanUr, setEditNameRomanUr] = useState("");

  const sortedCategories = [...categories].sort(
    (a, b) => a.display_order - b.display_order
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim() || !nameUr.trim()) return;
    addCategory({
      name_en: nameEn.trim(),
      name_ur: nameUr.trim(),
      name_roman_ur: nameRomanUr.trim() || nameEn.trim(),
    });
    setNameEn("");
    setNameUr("");
    setNameRomanUr("");
  };

  const startEdit = (
    id: string,
    currentEn: string,
    currentUr: string,
    currentRomanUr?: string
  ) => {
    setEditingId(id);
    setEditNameEn(currentEn);
    setEditNameUr(currentUr);
    setEditNameRomanUr(currentRomanUr || currentEn);
  };

  const saveEdit = (id: string) => {
    if (!editNameEn.trim() || !editNameUr.trim()) return;
    updateCategory(id, {
      name_en: editNameEn.trim(),
      name_ur: editNameUr.trim(),
      name_roman_ur: editNameRomanUr.trim() || editNameEn.trim(),
    });
    setEditingId(null);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 bg-[#F5F5F5] rounded-[8px]"
    >
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <PageHeading
          title="Categories"
          subtitle="Organize your collections"
          icon={<Layers className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Categories" },
          ]}
        />

        <form
          onSubmit={handleAdd}
          className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-5 grid grid-cols-1 sm:grid-cols-4 items-end gap-4 shadow-xs"
        >
          <div className="space-y-1">
            <label
              htmlFor="cat-en"
              className="text-xs font-medium text-[#1A1A1A]"
            >
              Name (English) *
            </label>
            <input
              id="cat-en"
              type="text"
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Waistcoats"
              className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="cat-roman"
              className="text-xs font-medium text-[#1A1A1A]"
            >
              Name (Roman Urdu)
            </label>
            <input
              id="cat-roman"
              type="text"
              value={nameRomanUr}
              onChange={(e) => setNameRomanUr(e.target.value)}
              placeholder="e.g. Shahi Waistcoats"
              className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="cat-ur"
              className="text-xs font-medium text-[#1A1A1A]"
            >
              Name (Customer Urdu) *
            </label>
            <input
              id="cat-ur"
              type="text"
              dir="rtl"
              required
              value={nameUr}
              onChange={(e) => setNameUr(e.target.value)}
              placeholder="واسکٹ"
              className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-urdu text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
            />
          </div>

          <button
            type="submit"
            className="h-10 px-5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#C1121F] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </form>

        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">English</th>
                <th className="py-3.5 px-4">Roman Urdu</th>
                <th className="py-3.5 px-4">Customer Urdu</th>
                <th className="py-3.5 px-4 text-right">Products</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
              {sortedCategories.map((cat, idx) => {
                const count = products.filter(
                  (p) => p.category_id === cat.id
                ).length;
                const isEditing = editingId === cat.id;

                return (
                  <motion.tr
                    key={cat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#FFFFFF] text-[#1A1A1A]"
                  >
                    <td className="py-3.5 px-4 font-bold text-[#E63946]">
                      #{cat.display_order}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-[#1A1A1A]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editNameEn}
                          onChange={(e) => setEditNameEn(e.target.value)}
                          aria-label="Edit English category name"
                          className="h-8 px-2.5 rounded bg-[#FFFFFF] border border-[#E63946] text-xs text-[#1A1A1A] w-full max-w-[150px]"
                        />
                      ) : (
                        cat.name_en
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#666666]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editNameRomanUr}
                          onChange={(e) => setEditNameRomanUr(e.target.value)}
                          aria-label="Edit Roman Urdu category name"
                          className="h-8 px-2.5 rounded bg-[#FFFFFF] border border-[#E63946] text-xs text-[#1A1A1A] w-full max-w-[150px]"
                        />
                      ) : (
                        cat.name_roman_ur || cat.name_en
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-urdu text-sm text-[#1A1A1A] font-bold">
                      {isEditing ? (
                        <input
                          type="text"
                          dir="rtl"
                          value={editNameUr}
                          onChange={(e) => setEditNameUr(e.target.value)}
                          aria-label="Edit Urdu category name"
                          className="h-8 px-2.5 rounded bg-[#FFFFFF] border border-[#E63946] text-xs font-urdu text-[#1A1A1A] w-full max-w-[150px]"
                        />
                      ) : (
                        cat.name_ur
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#1A1A1A] font-semibold">
                      {count}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEdit(cat.id)}
                              aria-label="Save category changes"
                              className="p-1.5 rounded bg-[#E63946] text-[#FFFFFF] hover:bg-[#C1121F]"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              aria-label="Cancel editing"
                              className="p-1.5 rounded bg-[#F5F5F5] border border-[#E0E0E0] text-[#1A1A1A] hover:border-[#1A1A1A]"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              startEdit(
                                cat.id,
                                cat.name_en,
                                cat.name_ur,
                                cat.name_roman_ur
                              )
                            }
                            aria-label={`Edit ${cat.name_en}`}
                            className="p-1.5 rounded bg-[#F5F5F5] border border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => reorderCategory(cat.id, "up")}
                          aria-label={`Move ${cat.name_en} up`}
                          className="p-1.5 rounded bg-[#F5F5F5] border border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => reorderCategory(cat.id, "down")}
                          aria-label={`Move ${cat.name_en} down`}
                          className="p-1.5 rounded bg-[#F5F5F5] border border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCategory(cat.id)}
                          aria-label={`Delete ${cat.name_en}`}
                          className="p-1.5 rounded bg-[#C1121F] text-[#FFFFFF] hover:bg-[#E63946] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminCategories;
