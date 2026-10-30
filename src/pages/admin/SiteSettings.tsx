import React, { useState } from "react";
import { useDataStore } from "../../store/dataStore";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { ADMIN_TRANSLATIONS } from "../../lib/i18n";

export const AdminSiteSettings: React.FC = () => {
  const siteSettings = useDataStore((s) => s.siteSettings);
  const updateSiteSettings = useDataStore((s) => s.updateSiteSettings);
  const adminLanguage = useDataStore((s) => s.adminLanguage);
  const t = ADMIN_TRANSLATIONS[adminLanguage];

  const [form, setForm] = useState(siteSettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(form);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 max-w-3xl">
        <form
          onSubmit={handleSave}
          className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-6 shadow-xs"
        >
          <div>
            <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
              {t.settings}
            </h1>
            <p className="text-xs text-[#4A4A4A]">
              Payment account details, contact channels, and social media links
              configured here sync across the entire storefront.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
              1. Pakistan Digital Payment Accounts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="ss-jc"
                  className="text-xs font-medium text-[#4A4A4A]"
                >
                  JazzCash Account Number
                </label>
                <input
                  id="ss-jc"
                  type="text"
                  value={form.jazzcash_number}
                  onChange={(e) =>
                    setForm({ ...form, jazzcash_number: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="ss-ep"
                  className="text-xs font-medium text-[#4A4A4A]"
                >
                  EasyPaisa Account Number
                </label>
                <input
                  id="ss-ep"
                  type="text"
                  value={form.easypaisa_number}
                  onChange={(e) =>
                    setForm({ ...form, easypaisa_number: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="ss-bname"
                  className="text-xs font-medium text-[#4A4A4A]"
                >
                  Bank Name
                </label>
                <input
                  id="ss-bname"
                  type="text"
                  value={form.bank_name}
                  onChange={(e) =>
                    setForm({ ...form, bank_name: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="ss-btitle"
                  className="text-xs font-medium text-[#4A4A4A]"
                >
                  Account Title
                </label>
                <input
                  id="ss-btitle"
                  type="text"
                  value={form.bank_account_title}
                  onChange={(e) =>
                    setForm({ ...form, bank_account_title: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="ss-iban"
                  className="text-xs font-medium text-[#4A4A4A]"
                >
                  IBAN
                </label>
                <input
                  id="ss-iban"
                  type="text"
                  value={form.bank_iban}
                  onChange={(e) =>
                    setForm({ ...form, bank_iban: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-[#E8E0D0] pt-4">
            <h2 className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
              2. Concierge Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="ss-wa"
                  className="text-xs font-medium text-[#4A4A4A]"
                >
                  WhatsApp Support Number
                </label>
                <input
                  id="ss-wa"
                  type="text"
                  value={form.whatsapp_number}
                  onChange={(e) =>
                    setForm({ ...form, whatsapp_number: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="ss-em"
                  className="text-xs font-medium text-[#4A4A4A]"
                >
                  Contact Email
                </label>
                <input
                  id="ss-em"
                  type="email"
                  value={form.contact_email}
                  onChange={(e) =>
                    setForm({ ...form, contact_email: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="ss-addr"
                className="text-xs font-medium text-[#4A4A4A]"
              >
                Flagship Atelier Address
              </label>
              <input
                id="ss-addr"
                type="text"
                value={form.physical_address}
                onChange={(e) =>
                  setForm({ ...form, physical_address: e.target.value })
                }
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-[#E8E0D0] pt-4">
            <h2 className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
              3. Social Media Links (Instagram, Facebook, TikTok)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="ss-ig"
                  className="text-xs font-medium text-[#4A4A4A]"
                >
                  Instagram URL
                </label>
                <input
                  id="ss-ig"
                  type="url"
                  value={form.instagram_url}
                  onChange={(e) =>
                    setForm({ ...form, instagram_url: e.target.value })
                  }
                  placeholder="https://instagram.com/rtsapparel.pk"
                  className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="ss-fb"
                  className="text-xs font-medium text-[#4A4A4A]"
                >
                  Facebook URL
                </label>
                <input
                  id="ss-fb"
                  type="url"
                  value={form.facebook_url}
                  onChange={(e) =>
                    setForm({ ...form, facebook_url: e.target.value })
                  }
                  placeholder="https://facebook.com/rtsapparel.pk"
                  className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="ss-tt"
                  className="text-xs font-medium text-[#4A4A4A]"
                >
                  TikTok URL
                </label>
                <input
                  id="ss-tt"
                  type="url"
                  value={form.tiktok_url}
                  onChange={(e) =>
                    setForm({ ...form, tiktok_url: e.target.value })
                  }
                  placeholder="https://tiktok.com/@rtsapparel.pk"
                  className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm hover:bg-[#E2C07A]"
          >
            {t.saveChanges}
          </button>
        </form>
      </div>
    </div>
  );
};
