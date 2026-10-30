import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { TeamSidebar } from "../../components/layout/TeamSidebar";

export const TeamProfilePage: React.FC = () => {
  const { user } = useAuth();
  const updateUserProfile = useDataStore((s) => s.updateUserProfile);

  const [fullName, setFullName] = useState(user?.full_name || "Ali Raza Khan");
  const [phone, setPhone] = useState(user?.phone || "0321-4567890");
  const [paymentMethod, setPaymentMethod] = useState<
    "jazzcash" | "easypaisa" | "bank_transfer"
  >(user?.payment_method || "jazzcash");
  const [accountDetails, setAccountDetails] = useState(
    user?.payment_account_details || "JazzCash: 0321-4567890 (Ali Raza Khan)"
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(user?.id || "user-agent-1", {
      full_name: fullName.trim(),
      phone: phone.trim(),
      payment_method: paymentMethod,
      payment_account_details: accountDetails.trim(),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      <TeamSidebar />

      <div className="flex-1 max-w-2xl">
        <form
          onSubmit={handleSave}
          className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-5 shadow-xs"
        >
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Partner Profile & Payout Settings
          </h1>

          <div className="space-y-1">
            <label htmlFor="tp-name" className="text-xs font-medium text-[#4A4A4A]">
              Partner Full Name
            </label>
            <input
              id="tp-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm text-[#1A1A1A]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="tp-phone" className="text-xs font-medium text-[#4A4A4A]">
              WhatsApp / Mobile Number
            </label>
            <input
              id="tp-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm font-mono text-[#1A1A1A]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="tp-method" className="text-xs font-medium text-[#4A4A4A]">
              Default Payout Method
            </label>
            <select
              id="tp-method"
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value as "jazzcash" | "easypaisa" | "bank_transfer"
                )
              }
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm text-[#1A1A1A]"
            >
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
              <option value="bank_transfer">Bank Transfer (IBAN)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="tp-details" className="text-xs font-medium text-[#4A4A4A]">
              Payout Account Number / IBAN Details
            </label>
            <textarea
              id="tp-details"
              rows={2}
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A]"
            />
          </div>

          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm hover:bg-[#E2C07A]"
          >
            Save Payout Preferences
          </button>
        </form>
      </div>
    </div>
  );
};
