import React, { useState } from "react";
import { useDataStore } from "../../store/dataStore";
import { formatPKR, calculateDiscountedPrice } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";

export const AdminDiscounts: React.FC = () => {
  const products = useDataStore((s) => s.products);
  const categories = useDataStore((s) => s.categories);
  const updateProduct = useDataStore((s) => s.updateProduct);
  const updateCategory = useDataStore((s) => s.updateCategory);

  const [tab, setTab] = useState<"products" | "categories">("products");

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
              Discounts & Promotional Rules
            </h1>
            <p className="text-xs text-[#4A4A4A]">
              Product-level discount % overrides category-level discount %.
            </p>
          </div>

          <div className="flex gap-2 p-1 rounded-lg bg-[#FAFAFA] border border-[#E8E0D0]">
            <button
              type="button"
              onClick={() => setTab("products")}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-colors ${
                tab === "products"
                  ? "bg-[#C9A84C] text-[#1A1A1A]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A]"
              }`}
            >
              Product Discounts
            </button>
            <button
              type="button"
              onClick={() => setTab("categories")}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-colors ${
                tab === "categories"
                  ? "bg-[#C9A84C] text-[#1A1A1A]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A]"
              }`}
            >
              Category Discounts
            </button>
          </div>
        </div>

        {tab === "products" ? (
          <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3.5 px-4">Garment</th>
                  <th className="py-3.5 px-4 text-right">Base Price</th>
                  <th className="py-3.5 px-4 text-right">Discount %</th>
                  <th className="py-3.5 px-4 text-right">Final Sale Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F5F4F0] transition-colors">
                    <td className="py-3 px-4 font-sans font-semibold text-[#1A1A1A]">
                      {prod.name_en}
                    </td>
                    <td className="py-3 px-4 text-right text-[#4A4A4A]">
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
                        className="w-20 h-8 px-2 rounded bg-[#FFFFFF] border border-[#E8E0D0] text-right text-xs font-bold text-[#9B7B2F] focus:outline-none focus:border-[#C9A84C]"
                      />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#16A34A]">
                      {formatPKR(
                        calculateDiscountedPrice(
                          prod.price,
                          prod.discount_percent
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Urdu Name</th>
                  <th className="py-3.5 px-4 text-right">Category Discount %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#F5F4F0] transition-colors">
                    <td className="py-3.5 px-4 font-sans font-semibold text-[#1A1A1A]">
                      {cat.name_en}
                    </td>
                    <td className="py-3.5 px-4 font-urdu text-[#9B7B2F]">
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
                        className="w-20 h-8 px-2 rounded bg-[#FFFFFF] border border-[#E8E0D0] text-right text-xs font-bold text-[#9B7B2F] focus:outline-none focus:border-[#C9A84C]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
