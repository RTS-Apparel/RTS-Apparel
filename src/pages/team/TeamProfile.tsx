import React, { useState } from "react";
import { UserCheck, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { TeamSidebar } from "../../components/layout/TeamSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants, buttonHover, buttonTap } from "../../lib/animations";

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
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedOk(false);
    window.setTimeout(() => {
      updateUserProfile(user?.id || "user-agent-1", {
        full_name: fullName.trim(),
        phone: phone.trim(),
        payment_method: paymentMethod,
        payment_account_details: accountDetails.trim(),
      });
      setSaving(false);
      setSavedOk(true);
      window.setTimeout(() => setSavedOk(false), 2500);
    }, 300);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8"
    >
      <TeamSidebar />

      <div className="flex-1 space-y-6">
        <PageHeading
          title="My Profile"
          subtitle="Update agent profile"
          icon={<UserCheck className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Agent Hub", to: "/team" },
            { label: "My Profile" },
          ]}
        />

        <form
          onSubmit={handleSave}
          className="max-w-2xl rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-5 shadow-xs"
        >
          <div className="space-y-1">
            <label htmlFor="tp-name" className="text-xs font-medium text-[#1A1A1A]">
              Partner Full Name
            </label>
            <input
              id="tp-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] text-sm text-[#1A1A1A] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="tp-phone" className="text-xs font-medium text-[#1A1A1A]">
              WhatsApp / Mobile Number
            </label>
            <input
              id="tp-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] text-sm font-mono text-[#1A1A1A] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="tp-method" className="text-xs font-medium text-[#1A1A1A]">
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
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] text-sm text-[#1A1A1A] outline-none"
            >
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
              <option value="bank_transfer">Bank Transfer (IBAN)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="tp-details" className="text-xs font-medium text-[#1A1A1A]">
              Payout Account Number / IBAN Details
            </label>
            <textarea
              id="tp-details"
              rows={2}
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              className="w-full p-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] text-xs font-mono text-[#1A1A1A] outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={buttonHover}
              whileTap={buttonTap}
              className="h-11 px-6 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm hover:bg-[#C1121F] transition-colors inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>loading...</span>
                </>
              ) : (
                <span>Save Payout Preferences</span>
              )}
            </motion.button>

            {savedOk && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                className="text-xs font-semibold text-[#22C55E] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved!</span>
              </motion.span>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TeamProfilePage;
