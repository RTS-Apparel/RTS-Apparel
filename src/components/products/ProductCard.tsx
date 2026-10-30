import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { Category, Product } from "../../types";
import {
  calculateDiscountedPrice,
  formatPKR,
  getEffectiveDiscountPercent,
} from "../../lib/utils";
import { useDataStore } from "../../store/dataStore";
import { useCart } from "../../hooks/useCart";
import {
  CUSTOMER_TRANSLATIONS,
  getCategoryName,
  getProductName,
} from "../../lib/i18n";

interface ProductCardProps {
  product: Product;
  category?: Category;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  category,
}) => {
  const language = useDataStore((s) => s.language);
  const wishlist = useDataStore((s) => s.wishlist);
  const toggleWishlist = useDataStore((s) => s.toggleWishlist);
  const { addItem } = useCart();

  const t = CUSTOMER_TRANSLATIONS[language];
  const displayTitle = getProductName(product, language);
  const displayCat = getCategoryName(category || product.categories, language);

  const discountPercent = getEffectiveDiscountPercent(
    product,
    category || product.categories
  );
  const finalPrice = calculateDiscountedPrice(product.price, discountPercent);
  const isWished = wishlist.includes(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      product.id,
      product.sizes[0] || "L",
      product.colors[0] || "Classic",
      1
    );
  };

  const handleToggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] hover:border-[#C9A84C] hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F4F0]">
        <img
          src={product.images[0]}
          alt={displayTitle}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="rounded bg-[#C9A84C] text-[#1A1A1A] text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Toggle */}
        <button
          type="button"
          onClick={handleToggleWish}
          aria-label={t.wishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#FFFFFF]/90 border border-[#E8E0D0] text-[#1A1A1A] hover:border-[#C9A84C] transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              isWished ? "fill-[#C9A84C] text-[#C9A84C]" : "text-[#4A4A4A]"
            }`}
          />
        </button>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 rounded-lg bg-[#FFFFFF]/95 hover:bg-[#C9A84C] text-[#1A1A1A] border border-[#C9A84C] p-2.5 transition-all duration-200 shadow-md"
          title={t.addToCart}
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {displayCat && (
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#9A9A9A] mb-1">
              {displayCat}
            </p>
          )}
          <h3 className="font-serif-display text-base font-semibold text-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors line-clamp-1">
            {displayTitle}
          </h3>
        </div>

        <div className="pt-2 border-t border-[#E8E0D0] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-sm font-bold text-[#C9A84C]">
              {formatPKR(finalPrice)}
            </span>
            {discountPercent > 0 && (
              <span className="text-xs text-[#9A9A9A] line-through">
                {formatPKR(product.price)}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A9A9A]">
            {product.sizes.join(" · ")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
