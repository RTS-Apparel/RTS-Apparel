import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { AccountSidebar } from "../../components/layout/AccountSidebar";

export const AccountProfile: React.FC = () => {
  const { user } = useAuth();
  const updateUserProfile = useDataStore((s) => s.updateUserProfile);

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateUserProfile(user.id, {
      full_name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      <AccountSidebar />

      <div className="flex-1 max-w-2xl">
        <form
          onSubmit={handleSave}
          className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-5 shadow-xs"
        >
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Profile Settings
          </h1>

          <div className="space-y-1.5">
            <label htmlFor="prof-name" className="text-xs font-medium text-[#4A4A4A]">
              Full Name
            </label>
            <input
              id="prof-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm text-[#1A1A1A]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="prof-phone" className="text-xs font-medium text-[#4A4A4A]">
              Pakistan Phone Number
            </label>
            <input
              id="prof-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm font-mono text-[#1A1A1A]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="prof-email" className="text-xs font-medium text-[#4A4A4A]">
              Email Address
            </label>
            <input
              id="prof-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm text-[#1A1A1A]"
            />
          </div>

          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm hover:bg-[#E2C07A]"
          >
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
};
