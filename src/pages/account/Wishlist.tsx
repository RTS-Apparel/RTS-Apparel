import React from "react";
import { useProducts } from "../../hooks/useProducts";
import { useDataStore } from "../../store/dataStore";
import { AccountSidebar } from "../../components/layout/AccountSidebar";
import { ProductGrid } from "../../components/products/ProductGrid";

export const AccountWishlist: React.FC = () => {
  const { products, categories } = useProducts();
  const wishlist = useDataStore((s) => s.wishlist);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      <AccountSidebar />

      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Saved Wishlist ({wishlistedProducts.length})
          </h1>
          <p className="text-xs text-[#4A4A4A] mt-1">
            Pieces you have bookmarked from the RTS Apparel catalog.
          </p>
        </div>

        <ProductGrid
          products={wishlistedProducts}
          categories={categories}
          emptyMessage="Your wishlist is currently empty. Click the heart icon on any garment to save it here."
        />
      </div>
    </div>
  );
};
