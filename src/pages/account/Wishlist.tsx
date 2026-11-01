import React from "react";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProducts } from "../../hooks/useProducts";
import { useDataStore } from "../../store/dataStore";
import { PageHeading } from "../../components/layout/PageHeading";
import { ProductGrid } from "../../components/products/ProductGrid";
import { pageVariants } from "../../lib/animations";

export const AccountWishlist: React.FC = () => {
  const { products, categories } = useProducts();
  const wishlist = useDataStore((s) => s.wishlist);
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-7 sm:py-10 space-y-6"
    >
      <PageHeading
        title="My Wishlist"
        subtitle="Your saved styles, all in one place. Come back whenever you're ready."
        icon={<Heart className="w-5 h-5" />}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "My Wishlist" },
        ]}
      />

      {wishlistedProducts.length > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] px-4 py-3">
          <p className="text-sm text-[#1A1A1A]">
            <strong>{wishlistedProducts.length}</strong> {wishlistedProducts.length === 1 ? "item" : "items"} saved
          </p>
          <Link to="/"
            className="text-xs font-semibold text-[#E63946] hover:underline inline-flex items-center gap-1"
          >
            Continue shopping <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <ProductGrid
        products={wishlistedProducts}
        categories={categories}
        emptyIcon={<Heart size={56} />}
        emptyMessage="Your wishlist is empty. Tap the heart on any product to save it here."
      />

      {wishlistedProducts.length === 0 && (
        <div className="text-center -mt-2">
          <Link to="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#E63946] px-5 py-3 text-sm font-semibold text-white hover:bg-[#C1121F] transition-colors"
          >
            <ShoppingBag size={16} /> Explore products
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default AccountWishlist;
