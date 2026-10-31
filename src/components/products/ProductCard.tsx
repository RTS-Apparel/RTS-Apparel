import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";
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
import { cardVariants } from "../../lib/animations";

interface ProductCardProps {
  product: Product;
  category?: Category;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  category,
  index = 0,
}) => {
  const language = useDataStore((s) => s.language);
  const wishlist = useDataStore((s) => s.wishlist);
  const toggleWishlist = useDataStore((s) => s.toggleWishlist);
  const { addItem } = useCart();

  const [imgLoaded, setImgLoaded] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true, amount: 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        transformStyle: "preserve-3d",
      }}
      className="h-full"
    >
      <Link
        to={`/product/${product.id}`}
        className="group h-full rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] hover:border-[#E63946] transition-all duration-300 flex flex-col overflow-hidden shadow-xs hover:shadow-md"
      >
        {/* Product image area bg: #F5F5F5 */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F5]">
          {!imgLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
          <img
            src={product.images[0]}
            alt={displayTitle}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-[1.08] transition-all duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Discount badge: bg #E63946, color #FFFFFF, position absolute top-left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discountPercent > 0 && (
              <span
                style={{ transform: "rotate(-3deg)" }}
                className="inline-block rounded bg-[#E63946] text-[#FFFFFF] text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 shadow-sm"
              >
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Heart: Empty #CCCCCC, Filled #E63946 */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWish}
            aria-label={t.wishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-[#FFFFFF] border border-[#E0E0E0] hover:border-[#E63946] transition-colors shadow-xs"
          >
            <Heart
              className={`w-4 h-4 ${
                isWished ? "fill-[#E63946] text-[#E63946]" : "text-[#CCCCCC]"
              }`}
            />
          </motion.button>
        </div>

        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#FFFFFF]">
          <div>
            {displayCat && (
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#E63946] font-semibold mb-1">
                {displayCat}
              </p>
            )}
            <h3 className="font-serif-display text-base font-semibold text-[#1A1A1A] group-hover:text-[#E63946] transition-colors line-clamp-1">
              {displayTitle}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="pt-2 border-t border-[#E0E0E0] flex items-baseline justify-between">
              <div className="flex items-baseline gap-2 font-mono tabular-nums">
                <span className="text-sm font-bold text-[#E63946]">
                  {formatPKR(finalPrice)}
                </span>
                {discountPercent > 0 && (
                  <span className="text-xs text-[#999999] line-through">
                    {formatPKR(product.price)}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#666666]">
                {product.sizes.join(" · ")}
              </span>
            </div>

            {/* Add to Cart button: bg #1A1A1A, color #FFFFFF, hover bg #E63946, color #FFFFFF */}
            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-full rounded-[6px] bg-[#1A1A1A] hover:bg-[#E63946] text-[#FFFFFF] py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold transition-colors duration-200"
              title={t.addToCart}
            >
              <ShoppingBag className="w-4 h-4 text-[#FFFFFF]" />
              <span>{t.addToCart}</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
