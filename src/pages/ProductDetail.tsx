import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Sparkles,
  Check,
  Truck,
  Zap,
  Share2,
  CheckCircle,
  XCircle,
  Ruler,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { useDataStore } from "../store/dataStore";
import { calculateDiscountedPrice, formatPKR } from "../lib/utils";
import { aiRecommendations, RecommendationAttribute } from "../lib/ai";
import { ProductImageGallery } from "../components/products/ProductImageGallery";
import { ProductGrid } from "../components/products/ProductGrid";
import {
  CUSTOMER_TRANSLATIONS,
  getCategoryName,
  getProductDescription,
  getProductName,
} from "../lib/i18n";
import { pageVariants, buttonHover, buttonTap } from "../lib/animations";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeProducts, categories, getEffectiveDiscount } = useProducts();
  const { addItem } = useCart();

  const language = useDataStore((s) => s.language);
  const wishlist = useDataStore((s) => s.wishlist);
  const toggleWishlist = useDataStore((s) => s.toggleWishlist);
  const addToast = useDataStore((s) => s.addToast);

  const t = CUSTOMER_TRANSLATIONS[language];

  const product = activeProducts.find((p) => p.id === id) || activeProducts[0];
  const category = categories.find((c) => c.id === product?.category_id);

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes[1] || product?.sizes[0] || "M"
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0] || "Obsidian Black"
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "sizing" | "delivery">(
    "details"
  );
  const [aiSuggestions, setAiSuggestions] = useState<
    Array<string | RecommendationAttribute>
  >([]);
  const [aiRecSuccess, setAiRecSuccess] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSelectedSize(product.sizes[1] || product.sizes[0] || "M");
    setSelectedColor(product.colors[0] || "Black");
    setQuantity(1);

    let cancelled = false;
    aiRecommendations({
      product_id: product.id,
      category: category?.name_en || "Menswear",
      tags: [...product.colors, ...product.sizes],
      name: product.name_en,
      language,
    }).then((res) => {
      if (!cancelled) {
        if (res.success && res.recommendations && res.recommendations.length > 0) {
          setAiSuggestions(res.recommendations);
          setAiRecSuccess(true);
        } else {
          setAiSuggestions([]);
          setAiRecSuccess(false);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  // useProducts() enriches products into fresh objects on every render.
  // Depend on stable identifiers instead of the product object, otherwise
  // selecting a size/color re-runs this effect and resets the user's choice.
  }, [product?.id, category?.name_en, language]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-[#666666]">Garment not found.</p>
      </div>
    );
  }

  const effectiveDiscount = getEffectiveDiscount(product);
  const finalPrice = calculateDiscountedPrice(product.price, effectiveDiscount);
  const isWished = wishlist.includes(product.id);
  const relatedProducts = activeProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const displayTitle = getProductName(product, language);
  const displayDesc = getProductDescription(product, language);
  const displayCat = getCategoryName(category, language);

  const handleBuyNow = () => {
    addItem(product.id, selectedSize, selectedColor, quantity);
    navigate("/checkout");
  };

  const handleShareProduct = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    addToast("Product link copied to clipboard!");
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-5 sm:py-10 space-y-8 sm:space-y-16 bg-[#FFFFFF]"
    >
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-mono text-[#666666] min-w-0">
        <Link to="/" className="hover:text-[#E63946] text-[#1A1A1A] font-medium">
          {t.home}
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link
              to={`/category/${category.slug}`}
              className="hover:text-[#E63946] text-[#1A1A1A] font-medium"
            >
              {displayCat}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#E63946] font-semibold truncate">
          {displayTitle}
        </span>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
        <div className="lg:col-span-6">
          <ProductImageGallery images={product.images} alt={displayTitle} />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-[#E0E0E0] pb-5">
            {category && (
              <span className="text-xs font-mono uppercase tracking-widest text-[#E63946] font-semibold">
                {displayCat}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-serif-display font-bold text-[#1A1A1A] break-words">
              {displayTitle}
            </h1>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-mono font-bold text-[#E63946] tabular-nums">
                {formatPKR(finalPrice)}
              </span>
              {effectiveDiscount > 0 && (
                <>
                  <span className="text-base font-mono text-[#999999] line-through tabular-nums">
                    {formatPKR(product.price)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-[#E63946] text-[#FFFFFF] font-mono text-xs font-bold">
                    SAVE {effectiveDiscount}%
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-[#666666] leading-relaxed">
            {displayDesc}
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full border border-[#E0E0E0] bg-[#F5F5F5] px-3 py-2 text-[#1A1A1A]">Cash on Delivery Available</span>
            <span className="rounded-full border border-[#E0E0E0] bg-[#F5F5F5] px-3 py-2 text-[#1A1A1A]">Delivery: 3–5 working days across Pakistan</span>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#666666] uppercase tracking-wider font-mono font-semibold">
                {t.selectSize}:{" "}
                <strong className="text-[#1A1A1A]">{selectedSize}</strong>
              </span>
              <span className="font-mono font-semibold inline-flex items-center gap-1.5">
                {product.stock > 0 ? (
                  <>
                    <CheckCircle size={14} color="#22C55E" />
                    <span className="text-[#22C55E]">
                      {product.stock} {t.piecesAvailable}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} color="#E63946" />
                    <span className="text-[#E63946]">{t.outOfStock}</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`w-12 h-11 rounded-[6px] font-mono text-xs font-semibold border transition-colors ${
                    selectedSize === sz
                      ? "bg-[#E63946] text-[#FFFFFF] border-[#E63946]"
                      : "bg-[#FFFFFF] text-[#1A1A1A] border-[#E0E0E0] hover:border-[#E63946]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2.5">
            <span className="text-xs text-[#666666] uppercase tracking-wider font-mono font-semibold block">
              {t.selectColor}:{" "}
              <strong className="text-[#1A1A1A]">{selectedColor}</strong>
            </span>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map((clr) => (
                <button
                  key={clr}
                  type="button"
                  onClick={() => setSelectedColor(clr)}
                  className={`px-4 h-10 rounded-[6px] text-xs font-semibold border flex items-center gap-2 transition-colors ${
                    selectedColor === clr
                      ? "bg-[#1A1A1A] text-[#FFFFFF] border-[#1A1A1A]"
                      : "bg-[#FFFFFF] text-[#1A1A1A] border-[#E0E0E0] hover:border-[#E63946]"
                  }`}
                >
                  {selectedColor === clr && (
                    <Check className="w-3.5 h-3.5 text-[#E63946]" />
                  )}
                  <span>{clr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to Cart + Buy Now */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center h-12 rounded-[6px] bg-[#F5F5F5] border border-[#E0E0E0] px-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 text-[#1A1A1A] hover:text-[#E63946] font-mono text-lg font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono text-sm font-semibold tabular-nums text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock || 10, q + 1))
                  }
                  className="px-3 text-[#1A1A1A] hover:text-[#E63946] font-mono text-lg font-bold"
                >
                  +
                </button>
              </div>

              <motion.button
                type="button"
                whileHover={buttonHover}
                whileTap={buttonTap}
                disabled={product.stock <= 0}
                onClick={() =>
                  addItem(product.id, selectedSize, selectedColor, quantity)
                }
                className="btn-primary-futuristic flex-1 h-12 px-6 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#C1121F] disabled:bg-[#E0E0E0] disabled:text-[#999999] transition-colors"
              >
                <ShoppingCart size={16} className="text-[#FFFFFF]" />
                <span>
                  {t.addToCart} — {formatPKR(finalPrice * quantity)}
                </span>
              </motion.button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Save to wishlist"
                className={`h-12 px-4 rounded-[6px] border flex items-center gap-2 text-xs font-semibold transition-colors ${
                  isWished
                    ? "bg-[#FFFFFF] border-[#E63946] text-[#E63946]"
                    : "bg-[#FFFFFF] border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946]"
                }`}
              >
                <Heart
                  size={20}
                  className={
                    isWished ? "fill-[#E63946] text-[#E63946]" : "text-[#CCCCCC]"
                  }
                />
                <span className="hidden sm:inline">
                  {isWished ? t.saved : t.wishlist}
                </span>
              </button>

              <button
                type="button"
                onClick={handleShareProduct}
                aria-label="Share product"
                className="h-12 px-3.5 rounded-[6px] border border-[#E0E0E0] bg-[#FFFFFF] text-[#1A1A1A] hover:border-[#E63946] hover:text-[#E63946] flex items-center justify-center transition-colors"
              >
                <Share2 size={16} />
              </button>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={buttonTap}
              disabled={product.stock <= 0}
              onClick={handleBuyNow}
              className="w-full h-11 rounded-[6px] border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1A1A1A] hover:text-[#FFFFFF] disabled:bg-[#E0E0E0] disabled:text-[#999999] transition-colors"
            >
              <Zap size={16} />
              <span>{t.buyNow}</span>
            </motion.button>
          </div>

          {/* Detail Tabs */}
          <div className="pt-4 border-t border-[#E0E0E0] space-y-3">
            <div className="flex gap-4 border-b border-[#E0E0E0] text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`pb-2.5 font-semibold border-b-2 transition-colors ${
                  activeTab === "details"
                    ? "border-[#E63946] text-[#E63946]"
                    : "border-transparent text-[#666666] hover:text-[#1A1A1A]"
                }`}
              >
                {t.craftSpecs}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sizing")}
                className={`pb-2.5 font-semibold border-b-2 transition-colors inline-flex items-center gap-1.5 ${
                  activeTab === "sizing"
                    ? "border-[#E63946] text-[#E63946]"
                    : "border-transparent text-[#666666] hover:text-[#1A1A1A]"
                }`}
              >
                <Ruler size={16} />
                <span>{t.sizeGuide}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("delivery")}
                className={`pb-2.5 font-semibold border-b-2 transition-colors inline-flex items-center gap-1.5 ${
                  activeTab === "delivery"
                    ? "border-[#E63946] text-[#E63946]"
                    : "border-transparent text-[#666666] hover:text-[#1A1A1A]"
                }`}
              >
                <Truck size={16} />
                <span>{t.deliveryExchange}</span>
              </button>
            </div>

            <div className="text-xs text-[#1A1A1A] leading-relaxed bg-[#F5F5F5] p-4 rounded-xl border border-[#E0E0E0]">
              {activeTab === "details" && (
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>
                    Crafted by ARTS APPAREL — Flagship store at Club Road Near
                    New Cafe Sajawal Sadiqabad
                  </li>
                  <li>
                    Reinforced stitching and custom antique brass buttons
                  </li>
                  <li>Dry clean recommended for embroidered and suede items</li>
                </ul>
              )}
              {activeTab === "sizing" && (
                <p className="flex items-center gap-2">
                  <Ruler size={16} className="text-[#E63946] shrink-0" />
                  <span>
                    Standard Pakistani tailored fit: S (Chest 38&quot;), M (Chest
                    40&quot;), L (Chest 42&quot;), XL (Chest 44&quot;), XXL (Chest
                    46&quot;).
                  </span>
                </p>
              )}
              {activeTab === "delivery" && (
                <div className="space-y-1.5">
                  <p className="flex items-center gap-2">
                    <Truck size={16} className="text-[#E63946] shrink-0" />
                    <span>
                      Sadiqabad Rs. 150 · Lahore Rs. 200 · Karachi/Islamabad Rs.
                      250 · Rest of Pakistan Rs. 280–350
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <RotateCcw size={16} className="text-[#E63946] shrink-0" />
                    <span>
                      7-day complimentary size exchange on unworn garments with
                      tags attached.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {aiRecSuccess && aiSuggestions.length > 0 && (
            <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E0E0E0] border-l-4 border-l-[#E63946] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                <Sparkles className="w-4 h-4 text-[#E63946]" />
                <span>{t.aiSuggestionsTitle}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#666666]">
                {aiSuggestions.map((item, idx) => {
                  const text =
                    typeof item === "string"
                      ? item
                      : `${item.attribute}${item.reason ? ` — ${item.reason}` : ""}`;
                  return (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />
                      <span className="text-[#1A1A1A]">{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {aiRecSuccess && (
        <section className="space-y-6 pt-8 border-t border-[#E0E0E0]">
          <div className="border-l-[3px] border-[#E63946] pl-[10px]">
            <h2 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
              {t.youMayAlsoLike}
            </h2>
          </div>
          <ProductGrid products={relatedProducts} categories={categories} />
        </section>
      )}
    </motion.div>
  );
};

export default ProductDetail;
