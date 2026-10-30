import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { LuxuryImage } from "../../components/common/LuxuryImage";
import {
  ADMIN_TRANSLATIONS,
  getCategoryName,
  getProductName,
} from "../../lib/i18n";

export const AdminProducts: React.FC = () => {
  const products = useDataStore((s) => s.products);
  const categories = useDataStore((s) => s.categories);
  const updateProduct = useDataStore((s) => s.updateProduct);
  const deleteProduct = useDataStore((s) => s.deleteProduct);
  const adminLanguage = useDataStore((s) => s.adminLanguage);

  const t = ADMIN_TRANSLATIONS[adminLanguage];
  const isRoman = adminLanguage === "roman_ur";

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    if (categoryFilter !== "all" && p.category_id !== categoryFilter) {
      return false;
    }
    if (
      search.trim() &&
      !p.name_en.toLowerCase().includes(search.trim().toLowerCase()) &&
      !(p.name_roman_ur || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
              {t.products} ({filtered.length})
            </h1>
            <p className="text-xs text-[#4A4A4A]">
              {isRoman
                ? "Products shamil karein, stock aur qeematein manage karein."
                : "Add, edit, or manage stock and multilingual descriptions."}
            </p>
          </div>
          <Link
            to="/admin/products/new"
            className="h-10 px-4 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs flex items-center gap-2 hover:bg-[#E2C07A] self-start shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addProduct}</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isRoman
                ? "Product ke naam se filter karein..."
                : "Filter by product name..."
            }
            className="flex-1 h-10 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="h-10 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
          >
            <option value="all">
              {isRoman ? "Tamam Categories" : "All Categories"}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {getCategoryName(c, adminLanguage)}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3.5 px-4">
                    {isRoman ? "Product" : "Garment"}
                  </th>
                  <th className="py-3.5 px-4">{t.categories}</th>
                  <th className="py-3.5 px-4 text-right">
                    {isRoman ? "Qeemat" : "Price"}
                  </th>
                  <th className="py-3.5 px-4 text-right">Discount</th>
                  <th className="py-3.5 px-4 text-right">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {filtered.map((prod) => {
                  const cat = categories.find((c) => c.id === prod.category_id);
                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-[#F5F4F0] transition-colors"
                    >
                      <td className="py-3 px-4 font-sans">
                        <div className="flex items-center gap-3">
                          <LuxuryImage
                            src={prod.images[0]}
                            alt={prod.name_en}
                            className="w-11 h-11 rounded border border-[#E8E0D0] object-cover shrink-0 bg-[#FFFFFF]"
                          />
                          <div>
                            <p className="font-semibold text-[#1A1A1A]">
                              {getProductName(prod, adminLanguage)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-sans text-[#4A4A4A]">
                        {getCategoryName(cat, adminLanguage) || "—"}
                      </td>
                      <td className="py-3 px-4 text-right text-[#C9A84C] font-semibold">
                        {formatPKR(prod.price)}
                      </td>
                      <td className="py-3 px-4 text-right text-[#16A34A] font-semibold">
                        {prod.discount_percent}%
                      </td>
                      <td className="py-3 px-4 text-right text-[#1A1A1A]">
                        {prod.stock}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <button
                          type="button"
                          onClick={() =>
                            updateProduct(prod.id, {
                              is_active: !prod.is_active,
                            })
                          }
                          className={`text-xs font-semibold ${
                            prod.is_active
                              ? "text-[#16A34A]"
                              : "text-[#9A9A9A]"
                          }`}
                        >
                          {prod.is_active ? "Active" : "Hidden"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/products/${prod.id}/edit`}
                            title={t.editProduct}
                            aria-label={`${t.editProduct} ${prod.name_en}`}
                            className="p-1.5 rounded bg-[#FFFFFF] border border-[#E8E0D0] text-[#9B7B2F] hover:border-[#C9A84C]"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteProduct(prod.id)}
                            title={t.deleteProduct}
                            aria-label={`${t.deleteProduct} ${prod.name_en}`}
                            className="p-1.5 rounded bg-[#FFFFFF] border border-[#E8E0D0] text-red-600 hover:border-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </div>
    </div>
  );
};
