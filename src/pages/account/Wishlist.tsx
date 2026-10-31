import React from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "../../hooks/useProducts";
import { useDataStore } from "../../store/dataStore";
import { AccountSidebar } from "../../components/layout/AccountSidebar";
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
      className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8"
    >
      <AccountSidebar />

      <div className="flex-1 space-y-6">
        <PageHeading
          title="My Wishlist"
          subtitle="Items you love ❤️"
          icon={<Heart className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Account", to: "/account" },
            { label: "My Wishlist" },
          ]}
        />

        <ProductGrid
          products={wishlistedProducts}
          categories={categories}
          emptyIcon={<Heart size={64} />}
          emptyMessage="Your wishlist is currently empty. Click the heart icon on any garment to save it here."
        />
      </div>
    </motion.div>
  );
};

export default AccountWishlist;
