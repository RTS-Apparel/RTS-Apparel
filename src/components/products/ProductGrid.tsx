import React from "react";
import { Category, Product } from "../../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  emptyMessage = "No garments match your current filter selection.",
}) => {
  if (products.length === 0) {
    return (
      <div className="py-16 px-6 text-center rounded-xl bg-[#FAFAFA] border border-[#E8E0D0]">
        <p className="text-base text-[#4A4A4A]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const category = categories.find((c) => c.id === product.category_id);
        return (
          <ProductCard
            key={product.id}
            product={product}
            category={category}
          />
        );
      })}
    </div>
  );
};
