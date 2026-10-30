import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, Truck } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useCartStore } from "../../store/cartStore";
import { useDataStore } from "../../store/dataStore";
import { calculateDiscountedPrice, formatPKR } from "../../lib/utils";
import { LuxuryImage } from "../common/LuxuryImage";

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

  if (!isDrawerOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyReferralCode(codeInput);
    setCodeFeedback(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div
        role="dialog"
        aria-label="Shopping Bag"
        className="w-full max-w-md bg-[#FFFFFF] border-l border-[#E8E0D0] h-full flex flex-col justify-between shadow-2xl"
      >
        <div className="p-5 border-b border-[#E8E0D0] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C9A84C]" />
            <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
              Your Shopping Bag
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close shopping bag"
            className="p-2 rounded-lg text-[#4A4A4A] hover:text-[#1A1A1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {enrichedItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag className="w-12 h-12 text-[#9A9A9A] mx-auto" />
              <p className="text-sm text-[#4A4A4A]">
                Your RTS Apparel bag is currently empty.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/category/kurta-shalwar");
                }}
                className="px-5 py-2.5 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm hover:bg-[#E2C07A]"
              >
                Explore Kurta Shalwar
              </button>
            </div>
          ) : (
            enrichedItems.map((item) => {
              const unitPrice = calculateDiscountedPrice(
                item.product.price,
                item.effectiveDiscount
              );
              return (
                <div
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  className="flex gap-4 p-3 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0]"
                >
                  <LuxuryImage
                    src={item.product.images[0]}
                    alt={item.product.name_en}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 border border-[#E8E0D0]"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">
                      {item.product.name_en}
                    </h3>
                    <p className="text-xs text-[#4A4A4A] mt-0.5">
                      Size: {item.size} · Color: {item.color}
                    </p>
                    <p className="text-sm font-mono font-bold text-[#C9A84C] mt-1 tabular-nums">
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
                          className="w-7 h-7 rounded bg-[#FFFFFF] border border-[#E8E0D0] flex items-center justify-center text-[#1A1A1A] hover:border-[#C9A84C]"
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
                          className="w-7 h-7 rounded bg-[#FFFFFF] border border-[#E8E0D0] flex items-center justify-center text-[#1A1A1A] hover:border-[#C9A84C]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.product_id, item.size, item.color)
                        }
                        aria-label={`Remove ${item.product.name_en}`}
                        className="text-[#9A9A9A] hover:text-[#EF4444] p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {enrichedItems.length > 0 && (
          <div className="p-5 border-t border-[#E8E0D0] bg-[#FAFAFA] space-y-3.5">
            {/* City-based delivery charge selector */}
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="drawer-city"
                className="text-xs text-[#4A4A4A] flex items-center gap-1.5 font-medium"
              >
                <Truck className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Delivery City:</span>
              </label>
              <select
                id="drawer-city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="h-8 px-2.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#C9A84C]"
              >
                {activeCities.map((c) => (
                  <option key={c.id} value={c.city_name}>
                    {c.city_name} — {formatPKR(c.charge)}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleApplyCode} className="space-y-1.5">
              <label className="text-xs text-[#4A4A4A] flex items-center gap-1.5 font-medium">
                <Tag className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Partner Agent Referral Code (e.g. RTS-ALI123)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  placeholder="RTS-ALI123"
                  className="flex-1 h-9 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A]"
                />
                {referralCode ? (
                  <button
                    type="button"
                    onClick={() => {
                      clearReferralCode();
                      setCodeInput("");
                      setCodeFeedback(null);
                    }}
                    className="px-3 h-9 rounded-lg border border-[#E8E0D0] text-xs text-[#4A4A4A]"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-3.5 h-9 rounded-lg border border-[#C9A84C] text-[#C9A84C] text-xs font-semibold hover:bg-[#C9A84C]/10"
                  >
                    Apply
                  </button>
                )}
              </div>
              {(referralAgentName || codeFeedback) && (
                <p className="text-xs text-[#9B7B2F] font-medium">
                  {referralAgentName
                    ? `Active Partner: ${referralAgentName} (${referralCode})`
                    : codeFeedback}
                </p>
              )}
            </form>

            <div className="space-y-1 text-sm border-t border-[#E8E0D0] pt-3">
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-xs text-[#16A34A] font-mono tabular-nums">
                  <span>Atelier Savings</span>
                  <span>- {formatPKR(totals.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[#4A4A4A] font-mono tabular-nums">
                <span>Subtotal</span>
                <span>{formatPKR(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#4A4A4A] font-mono tabular-nums">
                <span>Delivery ({selectedCity})</span>
                <span>{formatPKR(cityRate)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1A1A1A] font-mono tabular-nums pt-1">
                <span>Estimated Total</span>
                <span className="text-[#C9A84C]">
                  {formatPKR(totals.subtotal + cityRate)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={() => setDrawerOpen(false)}
                className="h-11 rounded-lg border border-[#C9A84C] text-[#C9A84C] font-semibold text-sm flex items-center justify-center hover:bg-[#C9A84C]/10 transition-colors"
              >
                View Full Bag
              </Link>
              <Link
                to="/checkout"
                onClick={() => setDrawerOpen(false)}
                className="h-11 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm flex items-center justify-center hover:bg-[#E2C07A] transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
