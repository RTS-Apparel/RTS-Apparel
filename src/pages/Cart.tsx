import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../hooks/useCart";
import { useCartStore } from "../store/cartStore";
import { useDataStore } from "../store/dataStore";
import { calculateDiscountedPrice, formatPKR } from "../lib/utils";
import { LuxuryImage } from "../components/common/LuxuryImage";
import { CUSTOMER_TRANSLATIONS, getProductName } from "../lib/i18n";
import { pageVariants } from "../lib/animations";
import { PageHeading } from "../components/layout/PageHeading";

export const CartPage: React.FC = () => {
  const {
    enrichedItems,
    totals,
    updateQuantity,
    removeItem,
    referralCode,
    referralAgentName,
    applyReferralCode,
    clearReferralCode,
  } = useCart();

  const selectedCity = useCartStore((s) => s.selectedCity);
  const setSelectedCity = useCartStore((s) => s.setSelectedCity);
  const allDeliveryRates = useDataStore((s) => s.deliveryRates);
  const language = useDataStore((s) => s.language);
  const t = CUSTOMER_TRANSLATIONS[language];

  const activeCities = allDeliveryRates.filter((r) => r.is_active);
  const deliveryCharge =
    activeCities.find((r) => r.city_name === selectedCity)?.charge ?? 250;

  const [codeInput, setCodeInput] = useState(referralCode || "");

  const handleApplyReferral = (e: React.FormEvent) => {
    e.preventDefault();
    applyReferralCode(codeInput);
  };

  if (enrichedItems.length === 0) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5"
      >
        <ShoppingBag className="w-14 h-14 text-[#666666] mx-auto" />
        <h1 className="text-3xl font-serif-display font-bold text-[#1A1A1A]">
          {t.emptyBagTitle}
        </h1>
        <p className="text-sm text-[#666666]">{t.emptyBagSub}</p>
        <Link
          to="/category/kurta-shalwar"
          className="btn-primary-futuristic inline-flex items-center gap-2 px-6 py-3 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm hover:bg-[#C1121F]"
        >
          <span>{t.browseCollections}</span>
          <ArrowRight className="w-4 h-4 text-[#FFFFFF]" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8"
    >
      <PageHeading
        title={`${t.shoppingBag} (${totals.itemCount})`}
        subtitle="Review your selected garments and delivery city"
        breadcrumbs={[
          { label: t.home, href: "/" },
          { label: t.shoppingBag },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          {enrichedItems.map((item) => {
            const unitPrice = calculateDiscountedPrice(
              item.product.price,
              item.effectiveDiscount
            );
            const displayTitle = getProductName(item.product, language);
            return (
              <div
                key={`${item.product_id}-${item.size}-${item.color}`}
                className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] hover:border-[#E63946] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <LuxuryImage
                    src={item.product.images[0]}
                    alt={displayTitle}
                    className="w-24 h-28 rounded-lg object-cover border border-[#E0E0E0] bg-[#F5F5F5]"
                  />
                  <div className="space-y-1">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="text-base font-serif-display font-semibold text-[#1A1A1A] hover:text-[#E63946]"
                    >
                      {displayTitle}
                    </Link>
                    <p className="text-xs text-[#666666]">
                      {t.size}:{" "}
                      <strong className="text-[#1A1A1A]">{item.size}</strong> ·{" "}
                      {t.color}:{" "}
                      <strong className="text-[#1A1A1A]">{item.color}</strong>
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-mono text-sm font-bold text-[#E63946] tabular-nums">
                        {formatPKR(unitPrice)}
                      </span>
                      {item.effectiveDiscount > 0 && (
                        <span className="font-mono text-xs text-[#999999] line-through tabular-nums">
                          {formatPKR(item.product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  <div className="flex items-center gap-2 bg-[#F5F5F5] border border-[#E0E0E0] rounded-[6px] p-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          item.size,
                          item.color,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center text-[#1A1A1A] hover:text-[#E63946]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono text-xs font-bold tabular-nums text-[#1A1A1A]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center text-[#1A1A1A] hover:text-[#E63946]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-[#E63946] tabular-nums">
                      {formatPKR(unitPrice * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.product_id, item.size, item.color)
                      }
                      className="text-xs text-[#666666] hover:text-[#C1121F] inline-flex items-center gap-1 mt-1 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.remove}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-5 sticky top-28 shadow-sm">
          <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
            {t.orderSummary}
          </h2>

          {/* City Selector */}
          <div className="space-y-1.5">
            <label
              htmlFor="cart-city"
              className="text-xs text-[#1A1A1A] flex items-center gap-1.5 font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
              <span>{t.selectDeliveryCity}</span>
            </label>
            <select
              id="cart-city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
            >
              {activeCities.map((c) => (
                <option key={c.id} value={c.city_name}>
                  {c.city_name} — {formatPKR(c.charge)}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleApplyReferral} className="space-y-2">
            <label className="text-xs text-[#1A1A1A] flex items-center gap-1.5 font-medium">
              <Tag className="w-3.5 h-3.5 text-[#E63946]" />
              <span>{t.agentReferralCode}</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="RTS-ALI123"
                className="flex-1 h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
              />
              {referralCode ? (
                <button
                  type="button"
                  onClick={() => {
                    clearReferralCode();
                    setCodeInput("");
                  }}
                  className="px-3.5 h-10 rounded-[6px] border-2 border-[#1A1A1A] text-xs text-[#1A1A1A] font-semibold hover:bg-[#1A1A1A] hover:text-[#FFFFFF] transition-colors"
                >
                  {t.remove}
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 h-10 rounded-[6px] border-2 border-[#1A1A1A] text-[#1A1A1A] text-xs font-semibold hover:bg-[#1A1A1A] hover:text-[#FFFFFF] transition-colors"
                >
                  {t.apply}
                </button>
              )}
            </div>
            {referralAgentName && (
              <p className="text-xs text-[#22C55E] font-medium">
                ✓ Linked to Partner Agent: {referralAgentName} ({referralCode})
              </p>
            )}
          </form>

          <div className="space-y-2 text-sm border-t border-[#E0E0E0] pt-4 font-mono tabular-nums">
            <div className="flex justify-between text-xs text-[#666666]">
              <span>{t.originalTotal}</span>
              <span>{formatPKR(totals.originalSubtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-xs text-[#22C55E] font-semibold">
                <span>{t.discountsApplied}</span>
                <span>- {formatPKR(totals.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-[#1A1A1A] pt-1 font-semibold">
              <span>{t.subtotal}</span>
              <span>{formatPKR(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#666666]">
              <span>
                {t.delivery} ({selectedCity})
              </span>
              <span>{formatPKR(deliveryCharge)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#1A1A1A] border-t border-[#E0E0E0] pt-3">
              <span>{t.totalPayable}</span>
              <span className="text-[#E63946]">
                {formatPKR(totals.subtotal + deliveryCharge)}
              </span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="btn-primary-futuristic w-full h-12 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#C1121F] transition-colors"
          >
            <span>{t.proceedToCheckout}</span>
            <ArrowRight className="w-4 h-4 text-[#FFFFFF]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
