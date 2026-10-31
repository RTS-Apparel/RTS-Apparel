import React, { useState } from "react";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { ADMIN_TRANSLATIONS } from "../../lib/i18n";
import { pageVariants } from "../../lib/animations";

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
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 bg-[#F5F5F5] rounded-[8px]"
    >
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <PageHeading
          title="Site Settings"
          subtitle="Configure store details"
          icon={<Settings className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Site Settings" },
          ]}
        />

        <form
          onSubmit={handleSave}
          className="max-w-3xl rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-6 shadow-xs"
        >
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#E63946] uppercase tracking-wider">
              1. Pakistan Digital Payment Accounts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="ss-jc"
                  className="text-xs font-medium text-[#1A1A1A]"
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
                  className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="ss-ep"
                  className="text-xs font-medium text-[#1A1A1A]"
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
                  className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="ss-bname"
                  className="text-xs font-medium text-[#1A1A1A]"
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
                  className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="ss-btitle"
                  className="text-xs font-medium text-[#1A1A1A]"
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
                  className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="ss-iban"
                  className="text-xs font-medium text-[#1A1A1A]"
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
                  className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-[#E0E0E0] pt-4">
            <h2 className="text-sm font-bold text-[#E63946] uppercase tracking-wider">
              2. Concierge Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="ss-wa"
                  className="text-xs font-medium text-[#1A1A1A]"
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
                  className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="ss-em"
                  className="text-xs font-medium text-[#1A1A1A]"
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
                  className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="ss-addr"
                className="text-xs font-medium text-[#1A1A1A]"
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
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-[#E0E0E0] pt-4">
            <h2 className="text-sm font-bold text-[#E63946] uppercase tracking-wider">
              3. Social Media Links (Instagram, Facebook, TikTok)
            </h2>
            <p className="text-[11px] text-[#666666]">
              Leave Facebook or TikTok blank to hide their icons on the public website until you add your URLs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="ss-ig"
                  className="text-xs font-medium text-[#1A1A1A]"
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
                  placeholder="https://instagram.com/artsapparel.pk"
                  className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="ss-fb"
                  className="text-xs font-medium text-[#1A1A1A]"
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
                  placeholder="https://facebook.com/artsapparel.pk"
                  className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="ss-tt"
                  className="text-xs font-medium text-[#1A1A1A]"
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
                  placeholder="https://tiktok.com/@artsapparel.pk"
                  className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="h-11 px-6 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm hover:bg-[#C1121F] transition-colors"
          >
            {t.saveChanges}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminSiteSettings;
