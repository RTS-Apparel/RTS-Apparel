import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../store/dataStore";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/products/ProductGrid";
import { ProductFilters } from "../components/products/ProductFilters";
import { CUSTOMER_TRANSLATIONS, getCategoryName } from "../lib/i18n";
import { pageVariants } from "../lib/animations";
import { PageHeading } from "../components/layout/PageHeading";

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
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      <PageHeading
        title={displayCat}
        subtitle={`${filteredProducts.length} ${t.itemsCount} · Premium Men's Fashion`}
        breadcrumbs={[
          { label: t.home, href: "/" },
          { label: displayCat },
        ]}
      />

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
    </motion.main>
  );
};

export default CategoryPage;
