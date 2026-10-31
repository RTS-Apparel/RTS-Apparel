import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../hooks/useCart";
import { useCartStore } from "../../store/cartStore";
import { useDataStore } from "../../store/dataStore";
import { calculateDiscountedPrice, formatPKR } from "../../lib/utils";
import { LuxuryImage } from "../common/LuxuryImage";
import { drawerVariants } from "../../lib/animations";

export const CartDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    setDrawerOpen,
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
  const activeCities = allDeliveryRates.filter((r) => r.is_active);
  const cityRate =
    activeCities.find((r) => r.city_name === selectedCity)?.charge ?? 250;

  const [codeInput, setCodeInput] = useState(referralCode || "");
  const [codeFeedback, setCodeFeedback] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyReferralCode(codeInput);
    setCodeFeedback(res.message);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
          onClick={() => setDrawerOpen(false)}
        >
          <motion.div
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Shopping Bag"
            className="w-full max-w-md bg-[#FFFFFF] border-l-2 border-[#E63946] h-full flex flex-col justify-between shadow-2xl"
          >
            {/* Dark Header */}
            <div className="p-5 border-b border-[#333333] flex items-center justify-between bg-[#1A1A1A]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#E63946]" />
                <h2 className="text-lg font-serif-display font-semibold text-[#FFFFFF]">
                  Your Shopping Bag
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close shopping bag"
                className="p-2 rounded-lg text-[#CCCCCC] hover:text-[#FFFFFF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FFFFFF]">
              {enrichedItems.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-[#666666] mx-auto" />
                  <p className="text-sm text-[#666666]">
                    Your ARTS APPAREL bag is currently empty.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate("/category/kurta-shalwar");
                    }}
                    className="btn-primary-futuristic px-5 py-2.5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm hover:bg-[#C1121F]"
                  >
                    Explore Kurta Shalwar
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {enrichedItems.map((item, idx) => {
                    const unitPrice = calculateDiscountedPrice(
                      item.product.price,
                      item.effectiveDiscount
                    );
                    return (
                      <motion.div
                        key={`${item.product_id}-${item.size}-${item.color}`}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: -100,
                          height: 0,
                          marginBottom: 0,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}
                        transition={{ delay: idx * 0.06, duration: 0.28 }}
                        className="flex gap-4 p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E0E0] hover:border-[#E63946] transition-colors overflow-hidden"
                      >
                        <LuxuryImage
                          src={item.product.images[0]}
                          alt={item.product.name_en}
                          className="w-20 h-20 rounded-lg object-cover shrink-0 border border-[#E0E0E0]"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">
                            {item.product.name_en}
                          </h3>
                          <p className="text-xs text-[#666666] mt-0.5">
                            Size: {item.size} · Color: {item.color}
                          </p>
                          <p className="text-sm font-mono font-bold text-[#E63946] mt-1 tabular-nums">
                            {formatPKR(unitPrice)}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
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
                                aria-label="Decrease quantity"
                                className="w-7 h-7 rounded bg-[#FFFFFF] border border-[#E0E0E0] flex items-center justify-center text-[#1A1A1A] hover:border-[#E63946]"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-mono w-6 text-center tabular-nums text-[#1A1A1A] font-semibold">
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
                                aria-label="Increase quantity"
                                className="w-7 h-7 rounded bg-[#FFFFFF] border border-[#E0E0E0] flex items-center justify-center text-[#1A1A1A] hover:border-[#E63946]"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  item.product_id,
                                  item.size,
                                  item.color
                                )
                              }
                              aria-label={`Remove ${item.product.name_en}`}
                              className="text-[#666666] hover:text-[#E63946] p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {enrichedItems.length > 0 && (
              <div className="p-5 border-t border-[#E0E0E0] bg-[#F5F5F5] space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="drawer-city"
                    className="text-xs text-[#1A1A1A] flex items-center gap-1.5 font-medium"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>Delivery City:</span>
                  </label>
                  <select
                    id="drawer-city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="h-8 px-2.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-2 focus:border-[#E63946]"
                  >
                    {activeCities.map((c) => (
                      <option key={c.id} value={c.city_name}>
                        {c.city_name} — {formatPKR(c.charge)}
                      </option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleApplyCode} className="space-y-1.5">
                  <label className="text-xs text-[#1A1A1A] flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>Partner Agent Referral Code (e.g. RTS-ALI123)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                      placeholder="RTS-ALI123"
                      className="flex-1 h-9 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
                    />
                    {referralCode ? (
                      <button
                        type="button"
                        onClick={() => {
                          clearReferralCode();
                          setCodeInput("");
                          setCodeFeedback(null);
                        }}
                        className="px-3 h-9 rounded-[6px] border-2 border-[#1A1A1A] text-xs text-[#1A1A1A] font-semibold hover:bg-[#1A1A1A] hover:text-[#FFFFFF] transition-colors"
                      >
                        Clear
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-3.5 h-9 rounded-[6px] border-2 border-[#1A1A1A] text-[#1A1A1A] text-xs font-semibold hover:bg-[#1A1A1A] hover:text-[#FFFFFF] transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {(referralAgentName || codeFeedback) && (
                    <p className="text-xs text-[#22C55E] font-medium">
                      {referralAgentName
                        ? `Active Partner: ${referralAgentName} (${referralCode})`
                        : codeFeedback}
                    </p>
                  )}
                </form>

                <div className="space-y-1 text-sm border-t border-[#E0E0E0] pt-3">
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-[#22C55E] font-mono tabular-nums font-semibold">
                      <span>Atelier Savings</span>
                      <span>- {formatPKR(totals.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-[#666666] font-mono tabular-nums">
                    <span>Subtotal</span>
                    <span>{formatPKR(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#666666] font-mono tabular-nums">
                    <span>Delivery ({selectedCity})</span>
                    <span>{formatPKR(cityRate)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#1A1A1A] font-mono tabular-nums pt-1">
                    <span>Estimated Total</span>
                    <span className="text-[#E63946]">
                      {formatPKR(totals.subtotal + cityRate)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/cart"
                    onClick={() => setDrawerOpen(false)}
                    className="h-11 rounded-[6px] border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold text-sm flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#FFFFFF] transition-colors"
                  >
                    View Full Bag
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setDrawerOpen(false)}
                    className="btn-primary-futuristic h-11 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm flex items-center justify-center hover:bg-[#C1121F] transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
