import React, { useState } from "react";
import { Search, Truck, MapPin, Phone, ShieldCheck, AlertCircle } from "lucide-react";
import { useDataStore } from "../store/dataStore";
import { formatPKR } from "../lib/utils";
import { OrderStatusTimeline } from "../components/orders/OrderStatusTimeline";
import { OrderStatusBadge } from "../components/orders/OrderStatusBadge";
import { CUSTOMER_TRANSLATIONS } from "../lib/i18n";

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
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#C9A84C] font-semibold">
          Live Logistics Tracker
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#1A1A1A]">
          {t.trackHeading}
        </h1>
        <p className="text-sm text-[#4A4A4A] max-w-xl mx-auto">{t.trackSub}</p>
      </div>

      {/* Dual-Field Verification Form (Order Number + Phone Number) */}
      <form
        onSubmit={handleVerifyTrack}
        className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#FAFAFA] border border-[#E8E0D0] space-y-4 shadow-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9A9A9A] absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={orderNumInput}
              onChange={(e) => setOrderNumInput(e.target.value)}
              placeholder={t.orderNumberPlaceholder}
              aria-label="Order Number"
              className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A] focus:border-[#C9A84C] focus:outline-none"
            />
          </div>

          <div className="relative">
            <Phone className="w-4 h-4 text-[#9A9A9A] absolute left-3.5 top-3.5" />
            <input
              type="tel"
              required
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder={t.phoneVerifyPlaceholder}
              aria-label="Customer Phone Number"
              className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A] focus:border-[#C9A84C] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] text-[#4A4A4A] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
            <span>Privacy Protected: Order &amp; Phone verification required</span>
          </p>
          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs hover:bg-[#E2C07A] transition-colors shrink-0"
          >
            {t.trackBtn}
          </button>
        </div>

        {/* Sample Orders Quick Fill */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E0D0] text-[11px] font-mono text-[#4A4A4A]">
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
              className={`px-2 py-0.5 rounded border transition-colors ${
                matchedOrder?.id === o.id
                  ? "bg-[#C9A84C]/20 border-[#C9A84C] text-[#9B7B2F] font-semibold"
                  : "bg-[#FFFFFF] border-[#E8E0D0] hover:border-[#C9A84C]"
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
          className="max-w-2xl mx-auto p-4 rounded-xl bg-red-50 border border-red-300 text-xs text-red-700 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{verificationError}</span>
        </div>
      )}

      {matchedOrder && (
        <div className="rounded-2xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E0D0] pb-5">
            <div>
              <span className="text-xs font-mono text-[#9A9A9A]">
                Order Number
              </span>
              <h2 className="text-2xl font-mono font-bold text-[#C9A84C]">
                {matchedOrder.order_number}
              </h2>
            </div>
            <OrderStatusBadge status={matchedOrder.status} />
          </div>

          <OrderStatusTimeline status={matchedOrder.status} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E8E0D0] text-xs">
            <div className="space-y-2">
              <h3 className="font-mono uppercase tracking-wider text-[#9A9A9A]">
                {t.dispatchDetails}
              </h3>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                {matchedOrder.customer_name}
              </p>
              <p className="text-[#4A4A4A] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>
                  {matchedOrder.delivery_address}, {matchedOrder.delivery_city}
                </span>
              </p>
              <p className="text-[#4A4A4A] flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>{matchedOrder.customer_phone}</span>
              </p>
              {matchedOrder.referral_code && (
                <p className="text-[#9B7B2F] font-mono pt-1 font-semibold">
                  Partner Referral Code: {matchedOrder.referral_code}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-mono uppercase tracking-wider text-[#9A9A9A]">
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
              <div className="flex justify-between text-[#4A4A4A] font-mono tabular-nums pt-1">
                <span>
                  {t.delivery} ({matchedOrder.delivery_city})
                </span>
                <span>{formatPKR(matchedOrder.delivery_charge)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#C9A84C] font-mono tabular-nums border-t border-[#E8E0D0] pt-2">
                <span>{t.totalPayable}</span>
                <span>{formatPKR(matchedOrder.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
