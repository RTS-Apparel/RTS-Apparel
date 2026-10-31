import React, { useState } from "react";
import { Search, MapPin, Phone, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../store/dataStore";
import { formatPKR } from "../lib/utils";
import { OrderStatusTimeline } from "../components/orders/OrderStatusTimeline";
import { OrderStatusBadge } from "../components/orders/OrderStatusBadge";
import { CUSTOMER_TRANSLATIONS } from "../lib/i18n";
import { pageVariants } from "../lib/animations";
import { PageHeading } from "../components/layout/PageHeading";

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

export const TrackOrderPage: React.FC = () => {
  const orders = useDataStore((s) => s.orders);
  const language = useDataStore((s) => s.language);
  const t = CUSTOMER_TRANSLATIONS[language];

  const [orderNumInput, setOrderNumInput] = useState(
    orders[0]?.order_number || "RTS-2026-0001"
  );
  const [phoneInput, setPhoneInput] = useState(
    orders[0]?.customer_phone || "0301-7766554"
  );
  const [verifiedOrderId, setVerifiedOrderId] = useState<string | null>(
    orders[0]?.id || null
  );
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  const matchedOrder = orders.find((o) => o.id === verifiedOrderId);

  const handleVerifyTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);

    const cleanOrderNum = orderNumInput.trim().toLowerCase();
    const cleanPhone = normalizePhone(phoneInput);

    if (!cleanOrderNum || !cleanPhone) {
      setVerificationError(
        "Both Order Number and Customer Phone Number are required to protect your privacy."
      );
      setVerifiedOrderId(null);
      return;
    }

    const found = orders.find(
      (o) =>
        o.order_number.toLowerCase() === cleanOrderNum &&
        normalizePhone(o.customer_phone) === cleanPhone
    );

    if (!found) {
      setVerificationError(
        "No matching order found for this Order Number and Phone Number combination. Please verify both fields."
      );
      setVerifiedOrderId(null);
      return;
    }

    setVerifiedOrderId(found.id);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8"
    >
      <PageHeading
        title={t.trackHeading}
        subtitle={t.trackSub}
        breadcrumbs={[
          { label: t.home, href: "/" },
          { label: t.trackHeading },
        ]}
      />

      {/* Dual-Field Verification Form */}
      <form
        onSubmit={handleVerifyTrack}
        className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#FFFFFF] border border-[#E0E0E0] space-y-4 shadow-sm"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={orderNumInput}
              onChange={(e) => setOrderNumInput(e.target.value)}
              placeholder={t.orderNumberPlaceholder}
              aria-label="Order Number"
              className="w-full h-11 pl-10 pr-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <div className="relative">
            <Phone className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
            <input
              type="tel"
              required
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder={t.phoneVerifyPlaceholder}
              aria-label="Customer Phone Number"
              className="w-full h-11 pl-10 pr-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] text-[#666666] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
            <span>
              Privacy Protected: Order &amp; Phone verification required
            </span>
          </p>
          <button
            type="submit"
            className="btn-primary-futuristic h-11 px-6 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs hover:bg-[#C1121F] transition-colors shrink-0"
          >
            {t.trackBtn}
          </button>
        </div>

        {/* Sample Orders Quick Fill */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E0E0E0] text-[11px] font-mono text-[#666666]">
          <span>Sample Verified Orders:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setOrderNumInput(o.order_number);
                setPhoneInput(o.customer_phone);
                setVerifiedOrderId(o.id);
                setVerificationError(null);
              }}
              className={`px-2 py-0.5 rounded-[6px] border transition-colors ${
                matchedOrder?.id === o.id
                  ? "bg-[#E63946] border-[#E63946] text-[#FFFFFF] font-semibold"
                  : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946]"
              }`}
            >
              {o.order_number} ({o.customer_phone})
            </button>
          ))}
        </div>
      </form>

      {verificationError && (
        <div
          role="alert"
          className="max-w-2xl mx-auto p-4 rounded-xl bg-[#F8D7DA] border border-[#E63946] text-xs text-[#E63946] font-semibold flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{verificationError}</span>
        </div>
      )}

      {matchedOrder && (
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E0E0E0] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E0E0E0] pb-5">
            <div>
              <span className="text-xs font-mono text-[#666666]">
                Order Number
              </span>
              <h2 className="text-2xl font-mono font-bold text-[#E63946]">
                {matchedOrder.order_number}
              </h2>
            </div>
            <OrderStatusBadge status={matchedOrder.status} />
          </div>

          <OrderStatusTimeline status={matchedOrder.status} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E0E0E0] text-xs">
            <div className="space-y-2">
              <h3 className="font-mono uppercase tracking-wider text-[#666666]">
                {t.dispatchDetails}
              </h3>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                {matchedOrder.customer_name}
              </p>
              <p className="text-[#666666] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
                <span>
                  {matchedOrder.delivery_address}, {matchedOrder.delivery_city}
                </span>
              </p>
              <p className="text-[#666666] flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#E63946]" />
                <span>{matchedOrder.customer_phone}</span>
              </p>
              {matchedOrder.referral_code && (
                <p className="text-[#E63946] font-mono pt-1 font-semibold">
                  Partner Referral Code: {matchedOrder.referral_code}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-mono uppercase tracking-wider text-[#666666]">
                {t.orderSummary}
              </h3>
              {matchedOrder.items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-[#1A1A1A] font-mono tabular-nums"
                >
                  <span>
                    {it.name_en} ({it.size}) × {it.quantity}
                  </span>
                  <span>{formatPKR(it.final_unit_price * it.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-[#666666] font-mono tabular-nums pt-1">
                <span>
                  {t.delivery} ({matchedOrder.delivery_city})
                </span>
                <span>{formatPKR(matchedOrder.delivery_charge)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#E63946] font-mono tabular-nums border-t border-[#E0E0E0] pt-2">
                <span>{t.totalPayable}</span>
                <span>{formatPKR(matchedOrder.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TrackOrderPage;
