import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Shirt } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { LuxuryImage } from "../../components/common/LuxuryImage";
import {
  ADMIN_TRANSLATIONS,
  getCategoryName,
  getProductName,
} from "../../lib/i18n";
import { pageVariants } from "../../lib/animations";

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
          title="Products"
          subtitle="Manage your product catalog"
          icon={<Shirt className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Products" },
          ]}
          actions={
            <Link
              to="/admin/products/new"
              className="h-10 px-4 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs flex items-center gap-2 hover:bg-[#C1121F] shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addProduct}</span>
            </Link>
          }
        />

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
            className="flex-1 h-10 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="h-10 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
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

        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
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
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {filtered.map((prod, idx) => {
                  const cat = categories.find((c) => c.id === prod.category_id);
                  return (
                    <motion.tr
                      key={prod.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[#FFFFFF] text-[#1A1A1A]"
                    >
                      <td className="py-3 px-4 font-sans">
                        <div className="flex items-center gap-3">
                          <LuxuryImage
                            src={prod.images[0]}
                            alt={prod.name_en}
                            className="w-11 h-11 rounded border border-[#E0E0E0] object-cover shrink-0 bg-[#F5F5F5]"
                          />
                          <div>
                            <p className="font-bold text-[#1A1A1A]">
                              {getProductName(prod, adminLanguage)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-sans text-[#666666]">
                        {getCategoryName(cat, adminLanguage) || "—"}
                      </td>
                      <td className="py-3 px-4 text-right text-[#E63946] font-bold">
                        {formatPKR(prod.price)}
                      </td>
                      <td className="py-3 px-4 text-right text-[#E63946] font-semibold">
                        {prod.discount_percent}%
                      </td>
                      <td className="py-3 px-4 text-right text-[#1A1A1A] font-semibold">
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
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            prod.is_active
                              ? "bg-[#D4EDDA] text-[#155724]"
                              : "bg-[#F8D7DA] text-[#721C24]"
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
                            className="p-1.5 rounded-[4px] bg-[#F5F5F5] border border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteProduct(prod.id)}
                            title={t.deleteProduct}
                            aria-label={`${t.deleteProduct} ${prod.name_en}`}
                            className="p-1.5 rounded-[4px] bg-[#C1121F] text-[#FFFFFF] hover:bg-[#E63946] transition-colors"
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
      </div>
    </motion.div>
  );
};

export default AdminProducts;
