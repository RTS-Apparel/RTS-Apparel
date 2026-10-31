import React, { useState } from "react";
import { Percent } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { formatPKR, calculateDiscountedPrice } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants } from "../../lib/animations";

export const AdminDiscounts: React.FC = () => {
  const products = useDataStore((s) => s.products);
  const categories = useDataStore((s) => s.categories);
  const updateProduct = useDataStore((s) => s.updateProduct);
  const updateCategory = useDataStore((s) => s.updateCategory);

  const [tab, setTab] = useState<"products" | "categories">("products");

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
          title="Discounts"
          subtitle="Set offers and promotions"
          icon={<Percent className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Discounts" },
          ]}
          actions={
            <div className="flex gap-2 p-1 rounded-[6px] bg-[#2A2A2A] border border-[#333333]">
              <button
                type="button"
                onClick={() => setTab("products")}
                className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-colors ${
                  tab === "products"
                    ? "bg-[#E63946] text-[#FFFFFF]"
                    : "text-[#CCCCCC] hover:text-[#FFFFFF]"
                }`}
              >
                Product Discounts
              </button>
              <button
                type="button"
                onClick={() => setTab("categories")}
                className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-colors ${
                  tab === "categories"
                    ? "bg-[#E63946] text-[#FFFFFF]"
                    : "text-[#CCCCCC] hover:text-[#FFFFFF]"
                }`}
              >
                Category Discounts
              </button>
            </div>
          }
        />

        {tab === "products" ? (
          <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Garment</th>
                  <th className="py-3.5 px-4 text-right">Base Price</th>
                  <th className="py-3.5 px-4 text-right">Discount %</th>
                  <th className="py-3.5 px-4 text-right">Final Sale Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {products.map((prod, idx) => (
                  <motion.tr
                    key={prod.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#FFFFFF] text-[#1A1A1A]"
                  >
                    <td className="py-3 px-4 font-sans font-bold text-[#1A1A1A]">
                      {prod.name_en}
                    </td>
                    <td className="py-3 px-4 text-right text-[#666666]">
                      {formatPKR(prod.price)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <input
                        type="number"
                        min={0}
                        max={90}
                        value={prod.discount_percent}
                        aria-label={`Discount percent for ${prod.name_en}`}
                        onChange={(e) =>
                          updateProduct(prod.id, {
                            discount_percent: Number(e.target.value) || 0,
                          })
                        }
                        className="w-20 h-8 px-2 rounded-[4px] bg-[#FFFFFF] border border-[#E0E0E0] text-right text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
                      />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#E63946]">
                      {formatPKR(
                        calculateDiscountedPrice(
                          prod.price,
                          prod.discount_percent
                        )
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Urdu Name</th>
                  <th className="py-3.5 px-4 text-right">Category Discount %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {categories.map((cat, idx) => (
                  <motion.tr
                    key={cat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#FFFFFF] text-[#1A1A1A]"
                  >
                    <td className="py-3.5 px-4 font-sans font-bold text-[#1A1A1A]">
                      {cat.name_en}
                    </td>
                    <td className="py-3.5 px-4 font-urdu text-[#1A1A1A] font-bold">
                      {cat.name_ur}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <input
                        type="number"
                        min={0}
                        max={90}
                        value={cat.discount_percent}
                        aria-label={`Category discount for ${cat.name_en}`}
                        onChange={(e) =>
                          updateCategory(cat.id, {
                            discount_percent: Number(e.target.value) || 0,
                          })
                        }
                        className="w-20 h-8 px-2 rounded-[4px] bg-[#FFFFFF] border border-[#E0E0E0] text-right text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDiscounts;
