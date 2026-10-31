import React, { useState } from "react";
import { User, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { AccountSidebar } from "../../components/layout/AccountSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants, buttonHover, buttonTap } from "../../lib/animations";

export const AccountProfile: React.FC = () => {
  const { user } = useAuth();
  const updateUserProfile = useDataStore((s) => s.updateUserProfile);

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSavedSuccess(false);
    window.setTimeout(() => {
      updateUserProfile(user.id, {
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });
      setSaving(false);
      setSavedSuccess(true);
      window.setTimeout(() => setSavedSuccess(false), 2500);
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
      <AccountSidebar />

      <div className="flex-1 space-y-6">
        <PageHeading
          title="My Profile"
          subtitle="Update your information"
          icon={<User className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Account", to: "/account" },
            { label: "My Profile" },
          ]}
        />

        <form
          onSubmit={handleSave}
          className="max-w-2xl rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-5 shadow-xs"
        >
          <div className="space-y-1.5">
            <label htmlFor="prof-name" className="text-xs font-medium text-[#1A1A1A]">
              Full Name
            </label>
            <input
              id="prof-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] text-sm text-[#1A1A1A] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="prof-phone" className="text-xs font-medium text-[#1A1A1A]">
              Pakistan Phone Number
            </label>
            <input
              id="prof-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] text-sm font-mono text-[#1A1A1A] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="prof-email" className="text-xs font-medium text-[#1A1A1A]">
              Email Address
            </label>
            <input
              id="prof-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] text-sm text-[#1A1A1A] outline-none"
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
                <span>Save Profile Changes</span>
              )}
            </motion.button>

            {savedSuccess && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#22C55E]"
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

export default AccountProfile;
