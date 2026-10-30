import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useDataStore } from "../store/dataStore";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/products/ProductGrid";
import { ProductFilters } from "../components/products/ProductFilters";
import { CUSTOMER_TRANSLATIONS, getCategoryName } from "../lib/i18n";

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const language = useDataStore((s) => s.language);
  const { activeProducts, categories } = useProducts();
  const t = CUSTOMER_TRANSLATIONS[language];

  const category = categories.find((c) => c.slug === slug);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [maxPrice, setMaxPrice] = useState(35000);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  const filteredProducts = activeProducts.filter((p) => {
    if (category && p.category_id !== category.id) return false;
    if (selectedSize && !p.sizes.includes(selectedSize)) return false;
    if (
      selectedColor &&
      !p.colors.some((c) =>
        c.toLowerCase().includes(selectedColor.toLowerCase())
      )
    ) {
      return false;
    }
    if (p.discountedPrice > maxPrice) return false;
    if (onlyDiscounted && p.effectiveDiscount <= 0) return false;
    return true;
  });

  const handleReset = () => {
    setSelectedSize("");
    setSelectedColor("");
    setMaxPrice(35000);
    setOnlyDiscounted(false);
  };

  const displayCat = category
    ? getCategoryName(category, language)
    : t.allCollections;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#4A4A4A]">
        <Link to="/" className="hover:text-[#C9A84C]">
          {t.home}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#C9A84C] font-semibold">{displayCat}</span>
      </nav>

      {/* Category Header */}
      <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            {displayCat}
          </h1>
        </div>
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#9B7B2F] font-semibold">
          {filteredProducts.length} {t.itemsCount}
        </div>
      </div>

      {/* Layout with Sidebar Filters + ProductGrid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <ProductFilters
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onlyDiscounted={onlyDiscounted}
            setOnlyDiscounted={setOnlyDiscounted}
            onReset={handleReset}
          />
        </div>
        <div className="lg:col-span-9">
          <ProductGrid products={filteredProducts} categories={categories} />
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
