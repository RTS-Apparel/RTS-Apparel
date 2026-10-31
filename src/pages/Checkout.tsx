import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  Award,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../hooks/useCart";
import { useCartStore } from "../store/cartStore";
import { useAuth } from "../hooks/useAuth";
import { useDataStore } from "../store/dataStore";
import { PaymentMethod } from "../types";
import { calculateDiscountedPrice, formatPKR } from "../lib/utils";
import { CUSTOMER_TRANSLATIONS, getProductName } from "../lib/i18n";
import { pageVariants, buttonHover, buttonTap } from "../lib/animations";
import { PageHeading } from "../components/layout/PageHeading";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    enrichedItems,
    totals,
    referralCode,
    referralAgentName,
    applyReferralCode,
    clearCart,
  } = useCart();

  const selectedCity = useCartStore((s) => s.selectedCity);
  const setSelectedCity = useCartStore((s) => s.setSelectedCity);

  const allDeliveryRates = useDataStore((s) => s.deliveryRates);
  const siteSettings = useDataStore((s) => s.siteSettings);
  const placeOrder = useDataStore((s) => s.placeOrder);
  const language = useDataStore((s) => s.language);
  const t = CUSTOMER_TRANSLATIONS[language];

  const deliveryRates = allDeliveryRates.filter((r) => r.is_active);

  const [customerName, setCustomerName] = useState(
    user?.full_name || "Ahmed Raza Khan"
  );
  const [customerPhone, setCustomerPhone] = useState(
    user?.phone || "03058165623"
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    "House 42-B, Street 9, Phase 5 DHA"
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [paymentReference, setPaymentReference] = useState("");
  const [refInput, setRefInput] = useState(referralCode || "");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const selectedCityRate =
    deliveryRates.find((r) => r.city_name === selectedCity)?.charge ?? 250;
  const grandTotal = totals.subtotal + selectedCityRate;

  if (enrichedItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
          {t.emptyBagTitle}
        </h1>
        <Link
          to="/category/kurta-shalwar"
          className="btn-primary-futuristic inline-block px-6 py-3 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm hover:bg-[#C1121F]"
        >
          {t.browseCollections}
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !deliveryAddress.trim()
    ) {
      setError(
        "Please complete your full name, phone number, and street address."
      );
      return;
    }

    if (paymentMethod !== "cod" && !paymentReference.trim()) {
      setError(
        "Please provide the Transaction ID / Reference Number for your digital transfer."
      );
      return;
    }

    const orderItems = enrichedItems.map((item) => ({
      product_id: item.product.id,
      name_en: item.product.name_en,
      name_ur: item.product.name_ur,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unit_price: item.product.price,
      discount_percent: item.effectiveDiscount,
      final_unit_price: calculateDiscountedPrice(
        item.product.price,
        item.effectiveDiscount
      ),
      image: item.product.images[0],
    }));

    const createdOrder = placeOrder({
      customer_id: user?.id || null,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      delivery_address: deliveryAddress.trim(),
      delivery_city: selectedCity,
      delivery_charge: selectedCityRate,
      items: orderItems,
      subtotal: totals.originalSubtotal,
      discount_amount: totals.discountAmount,
      total_amount: grandTotal,
      payment_method: paymentMethod,
      payment_proof_url: paymentReference.trim() || null,
      referral_code: referralCode || null,
      notes: notes.trim() || null,
    });

    clearCart();
    navigate(`/order-confirmation/${createdOrder.id}`);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8"
    >
      <PageHeading
        title={t.checkout}
        subtitle="ARTS APPAREL Secure Checkout · Nationwide Delivery"
        breadcrumbs={[
          { label: t.home, href: "/" },
          { label: t.shoppingBag, href: "/cart" },
          { label: t.checkout },
        ]}
      />

      <form
        onSubmit={handleSubmitOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="animate-error-shake p-4 rounded-xl bg-[#F8D7DA] border border-[#E63946] text-xs text-[#E63946] font-semibold">
              {error}
            </div>
          )}

          {/* Step 1: Delivery Address & City */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
              <MapPin className="w-4 h-4 text-[#E63946]" />
              <h2>{t.deliveryDestination}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="cust-name"
                  className="text-xs font-medium text-[#1A1A1A]"
                >
                  {t.recipientName}
                </label>
                <input
                  id="cust-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] focus:border-2 focus:border-[#E63946] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="cust-phone"
                  className="text-xs font-medium text-[#1A1A1A]"
                >
                  {t.mobileNumber}
                </label>
                <input
                  id="cust-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="03058165623"
                  className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="cust-city"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                {t.selectDeliveryCity}
              </label>
              <select
                id="cust-city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] focus:border-2 focus:border-[#E63946] focus:outline-none"
              >
                {deliveryRates.map((rate) => (
                  <option key={rate.id} value={rate.city_name}>
                    {rate.city_name} — {formatPKR(rate.charge)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="cust-address"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                {t.streetAddress}
              </label>
              <textarea
                id="cust-address"
                rows={2}
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full p-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] focus:border-2 focus:border-[#E63946] focus:outline-none"
              />
            </div>
          </div>

          {/* Step 2: Pakistan Payment Methods */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
              <CreditCard className="w-4 h-4 text-[#E63946]" />
              <h2>{t.paymentMethodTitle}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "cod",
                  title: t.codTitle,
                  sub: t.codSub,
                },
                {
                  id: "jazzcash",
                  title: t.jazzcashTitle,
                  sub: `Account: ${siteSettings.jazzcash_number}`,
                },
                {
                  id: "easypaisa",
                  title: t.easypaisaTitle,
                  sub: `Account: ${siteSettings.easypaisa_number}`,
                },
                {
                  id: "bank_transfer",
                  title: t.bankTransferTitle,
                  sub: siteSettings.bank_name,
                },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === method.id
                      ? "bg-[#F5F5F5] border-2 border-[#E63946]"
                      : "bg-[#FFFFFF] border-[#E0E0E0] hover:border-[#E63946]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1A1A1A]">
                      {method.title}
                    </span>
                    {paymentMethod === method.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#E63946]" />
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-[#666666] mt-1">
                    {method.sub}
                  </p>
                </button>
              ))}
            </div>

            {paymentMethod !== "cod" && (
              <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E0E0E0] space-y-3 text-xs">
                {paymentMethod === "jazzcash" && (
                  <p className="text-[#1A1A1A]">
                    Send{" "}
                    <strong className="font-mono text-[#E63946]">
                      {formatPKR(grandTotal)}
                    </strong>{" "}
                    to JazzCash Number:{" "}
                    <strong className="font-mono">
                      {siteSettings.jazzcash_number}
                    </strong>{" "}
                    ({siteSettings.bank_account_title})
                  </p>
                )}
                {paymentMethod === "easypaisa" && (
                  <p className="text-[#1A1A1A]">
                    Send{" "}
                    <strong className="font-mono text-[#E63946]">
                      {formatPKR(grandTotal)}
                    </strong>{" "}
                    to EasyPaisa Number:{" "}
                    <strong className="font-mono">
                      {siteSettings.easypaisa_number}
                    </strong>{" "}
                    ({siteSettings.bank_account_title})
                  </p>
                )}
                {paymentMethod === "bank_transfer" && (
                  <div className="space-y-1 text-[#1A1A1A]">
                    <p>
                      Bank: <strong>{siteSettings.bank_name}</strong> · Title:{" "}
                      <strong>{siteSettings.bank_account_title}</strong>
                    </p>
                    <p className="font-mono text-[#E63946] font-semibold">
                      IBAN: {siteSettings.bank_iban}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <label
                    htmlFor="trx-id"
                    className="text-xs font-medium text-[#1A1A1A] block"
                  >
                    {t.trxIdLabel}
                  </label>
                  <input
                    id="trx-id"
                    type="text"
                    required
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="e.g. TID-992841102"
                    className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Partner Agent Referral Code */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
              <Award className="w-4 h-4 text-[#E63946]" />
              <h2>{t.agentReferralCode}</h2>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value.toUpperCase())}
                placeholder="Enter Agent Code (e.g. RTS-ALI123)"
                className="flex-1 h-10 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => applyReferralCode(refInput)}
                className="px-4 h-10 rounded-[6px] border-2 border-[#1A1A1A] text-[#1A1A1A] text-xs font-semibold hover:bg-[#1A1A1A] hover:text-[#FFFFFF] transition-colors"
              >
                {t.apply}
              </button>
            </div>

            {referralAgentName && (
              <p className="text-xs text-[#22C55E] font-medium">
                ✓ Order linked to Partner Agent:{" "}
                <strong>{referralAgentName}</strong> ({referralCode})
              </p>
            )}
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-5 sticky top-28 shadow-sm">
          <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
            {t.orderReviewTitle}
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {enrichedItems.map((item) => {
              const unitFinal = calculateDiscountedPrice(
                item.product.price,
                item.effectiveDiscount
              );
              return (
                <div
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  className="flex items-center justify-between gap-3 text-xs border-b border-[#E0E0E0] pb-2.5"
                >
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">
                      {getProductName(item.product, language)}
                    </p>
                    <p className="text-[#666666]">
                      {item.size} · {item.color} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-[#E63946] tabular-nums">
                    {formatPKR(unitFinal * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 text-xs border-t border-[#E0E0E0] pt-4 font-mono tabular-nums">
            <div className="flex justify-between text-[#666666]">
              <span>{t.originalTotal}</span>
              <span>{formatPKR(totals.originalSubtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-[#22C55E] font-semibold">
                <span>{t.discountsApplied}</span>
                <span>- {formatPKR(totals.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#1A1A1A] font-semibold">
              <span>{t.subtotal}</span>
              <span>{formatPKR(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#666666]">
              <span>
                {t.delivery} ({selectedCity})
              </span>
              <span>+ {formatPKR(selectedCityRate)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#1A1A1A] border-t border-[#E0E0E0] pt-3">
              <span>{t.totalPayable}</span>
              <span className="text-[#E63946]">{formatPKR(grandTotal)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="ord-notes" className="text-xs font-medium text-[#1A1A1A]">
              Special Tailoring / Delivery Notes (Optional)
            </label>
            <input
              id="ord-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call before delivery"
              className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="btn-primary-futuristic w-full h-12 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#C1121F] transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-[#FFFFFF]" />
            <span>
              {t.placeOrder} — {formatPKR(grandTotal)}
            </span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckoutPage;
