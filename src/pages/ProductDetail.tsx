import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Sparkles,
  Check,
  Truck,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { useDataStore } from "../store/dataStore";
import { calculateDiscountedPrice, formatPKR } from "../lib/utils";
import { aiRecommendations } from "../lib/ai";
import { ProductImageGallery } from "../components/products/ProductImageGallery";
import { ProductGrid } from "../components/products/ProductGrid";
import {
  CUSTOMER_TRANSLATIONS,
  getCategoryName,
  getProductDescription,
  getProductName,
} from "../lib/i18n";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeProducts, categories, getEffectiveDiscount } = useProducts();
  const { addItem } = useCart();

  const language = useDataStore((s) => s.language);
  const wishlist = useDataStore((s) => s.wishlist);
  const toggleWishlist = useDataStore((s) => s.toggleWishlist);

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
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!product) return;
    setSelectedSize(product.sizes[1] || product.sizes[0] || "M");
    setSelectedColor(product.colors[0] || "Black");
    setQuantity(1);

    let cancelled = false;
    aiRecommendations(
      product.name_en,
      category?.name_en || "Menswear",
      product.price,
      language
    ).then((res) => {
      if (!cancelled && res.recommendations) {
        setAiSuggestions(res.recommendations);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [product, category, language]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-[#4A4A4A]">Garment not found.</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#9A9A9A]">
        <Link to="/" className="hover:text-[#C9A84C]">
          {t.home}
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link
              to={`/category/${category.slug}`}
              className="hover:text-[#C9A84C]"
            >
              {displayCat}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#C9A84C] font-semibold truncate">
          {displayTitle}
        </span>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Interactive Image Gallery */}
        <div className="lg:col-span-6">
          <ProductImageGallery images={product.images} alt={displayTitle} />
        </div>

        {/* Right: Specifications & Purchase Controls (Single Language) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-[#E8E0D0] pb-5">
            {category && (
              <span className="text-xs font-mono uppercase tracking-widest text-[#C9A84C] font-semibold">
                {displayCat}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#1A1A1A]">
              {displayTitle}
            </h1>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-mono font-bold text-[#C9A84C] tabular-nums">
                {formatPKR(finalPrice)}
              </span>
              {effectiveDiscount > 0 && (
                <>
                  <span className="text-base font-mono text-[#9A9A9A] line-through tabular-nums">
                    {formatPKR(product.price)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-[#16A34A]/15 text-[#16A34A] font-mono text-xs font-bold">
                    SAVE {effectiveDiscount}%
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-[#4A4A4A] leading-relaxed">
            {displayDesc}
          </p>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#4A4A4A] uppercase tracking-wider font-mono font-semibold">
                {t.selectSize}:{" "}
                <strong className="text-[#1A1A1A]">{selectedSize}</strong>
              </span>
              <span className="text-[#C9A84C] font-mono">
                {product.stock > 0
                  ? `${product.stock} ${t.piecesAvailable}`
                  : t.outOfStock}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`w-12 h-11 rounded-lg font-mono text-xs font-semibold border transition-colors ${
                    selectedSize === sz
                      ? "bg-[#C9A84C] text-[#1A1A1A] border-[#C9A84C]"
                      : "bg-[#FAFAFA] text-[#1A1A1A] border-[#E8E0D0] hover:border-[#C9A84C]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2.5">
            <span className="text-xs text-[#4A4A4A] uppercase tracking-wider font-mono font-semibold block">
              {t.selectColor}:{" "}
              <strong className="text-[#1A1A1A]">{selectedColor}</strong>
            </span>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map((clr) => (
                <button
                  key={clr}
                  type="button"
                  onClick={() => setSelectedColor(clr)}
                  className={`px-4 h-10 rounded-lg text-xs font-medium border flex items-center gap-2 transition-colors ${
                    selectedColor === clr
                      ? "bg-[#C9A84C]/15 text-[#1A1A1A] border-[#C9A84C] font-semibold"
                      : "bg-[#FAFAFA] text-[#4A4A4A] border-[#E8E0D0] hover:border-[#C9A84C]"
                  }`}
                >
                  {selectedColor === clr && (
                    <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
                  )}
                  <span>{clr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to Cart + Buy Now */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center h-12 rounded-lg bg-[#FAFAFA] border border-[#E8E0D0] px-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 text-[#1A1A1A] hover:text-[#C9A84C] font-mono text-lg"
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
                  className="px-3 text-[#1A1A1A] hover:text-[#C9A84C] font-mono text-lg"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={product.stock <= 0}
                onClick={() =>
                  addItem(product.id, selectedSize, selectedColor, quantity)
                }
                className="flex-1 h-12 px-6 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#E2C07A] disabled:opacity-40 transition-colors shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {t.addToCart} — {formatPKR(finalPrice * quantity)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Save to wishlist"
                className={`h-12 px-4 rounded-lg border flex items-center gap-2 text-xs font-semibold transition-colors ${
                  isWished
                    ? "bg-[#C9A84C]/15 border-[#C9A84C] text-[#9B7B2F]"
                    : "bg-[#FAFAFA] border-[#E8E0D0] text-[#1A1A1A] hover:border-[#C9A84C]"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isWished ? "fill-current text-[#C9A84C]" : ""}`}
                />
                <span className="hidden sm:inline">
                  {isWished ? t.saved : t.wishlist}
                </span>
              </button>
            </div>

            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={handleBuyNow}
              className="w-full h-11 rounded-lg border-2 border-[#C9A84C] text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#C9A84C]/10 disabled:opacity-40 transition-colors"
            >
              <Zap className="w-4 h-4 text-[#C9A84C]" />
              <span>{t.buyNow}</span>
            </button>
          </div>

          {/* Detail Tabs */}
          <div className="pt-4 border-t border-[#E8E0D0] space-y-3">
            <div className="flex gap-4 border-b border-[#E8E0D0] text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`pb-2.5 font-semibold border-b-2 transition-colors ${
                  activeTab === "details"
                    ? "border-[#C9A84C] text-[#C9A84C]"
                    : "border-transparent text-[#4A4A4A]"
                }`}
              >
                {t.craftSpecs}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sizing")}
                className={`pb-2.5 font-semibold border-b-2 transition-colors ${
                  activeTab === "sizing"
                    ? "border-[#C9A84C] text-[#C9A84C]"
                    : "border-transparent text-[#4A4A4A]"
                }`}
              >
                {t.sizeGuide}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("delivery")}
                className={`pb-2.5 font-semibold border-b-2 transition-colors ${
                  activeTab === "delivery"
                    ? "border-[#C9A84C] text-[#C9A84C]"
                    : "border-transparent text-[#4A4A4A]"
                }`}
              >
                {t.deliveryExchange}
              </button>
            </div>

            <div className="text-xs text-[#4A4A4A] leading-relaxed bg-[#FAFAFA] p-4 rounded-xl border border-[#E8E0D0]">
              {activeTab === "details" && (
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>
                    Tailored at the RTS Flagship Atelier in Gulberg III, Lahore
                  </li>
                  <li>
                    Reinforced stitching and custom antique brass buttons
                  </li>
                  <li>Dry clean recommended for embroidered and suede items</li>
                </ul>
              )}
              {activeTab === "sizing" && (
                <p>
                  Standard Pakistani tailored fit: S (Chest 38&quot;), M (Chest
                  40&quot;), L (Chest 42&quot;), XL (Chest 44&quot;), XXL (Chest
                  46&quot;).
                </p>
              )}
              {activeTab === "delivery" && (
                <div className="space-y-1.5">
                  <p className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>
                      Lahore Rs. 200 · Karachi/Islamabad Rs. 250 · Rest of
                      Pakistan Rs. 300–350
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>
                      7-day complimentary size exchange on unworn garments with
                      tags attached.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Sartorial Pairing Recommendations */}
          {aiSuggestions.length > 0 && (
            <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#C9A84C]/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#9B7B2F]">
                <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                <span>{t.aiSuggestionsTitle}</span>
              </div>
              <ul className="space-y-1 text-xs text-[#4A4A4A]">
                {aiSuggestions.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <section className="space-y-6 pt-8 border-t border-[#E8E0D0]">
        <h2 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
          {t.youMayAlsoLike}
        </h2>
        <ProductGrid products={relatedProducts} categories={categories} />
      </section>
    </div>
  );
};
