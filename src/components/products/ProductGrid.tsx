import React from "react";
import { PackageSearch } from "lucide-react";
import { Category, Product } from "../../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  emptyMessage = "No garments match your current filter selection.",
  emptyIcon,
}) => {
  if (products.length === 0) {
    return (
      <div className="py-16 px-6 text-center rounded-xl bg-[#F5F5F5] border border-[#E0E0E0] flex flex-col items-center justify-center space-y-3">
        <div className="text-[#999999]">
          {emptyIcon || <PackageSearch size={64} />}
        </div>
        <p className="text-base text-[#666666]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => {
        const category = categories.find((c) => c.id === product.category_id);
        return (
          <ProductCard
            key={product.id}
            product={product}
            category={category}
            index={index}
          />
        );
      })}
    </div>
  );
};
