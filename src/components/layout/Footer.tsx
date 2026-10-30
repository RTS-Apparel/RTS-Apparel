import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ShieldCheck, Truck, Banknote } from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { CUSTOMER_TRANSLATIONS, getCategoryName } from "../../lib/i18n";

export const Footer: React.FC = () => {
  const categories = useDataStore((s) => s.categories);
  const siteSettings = useDataStore((s) => s.siteSettings);
  const language = useDataStore((s) => s.language);
  const t = CUSTOMER_TRANSLATIONS[language];

  return (
    <footer className="bg-[#1A1A1A] border-t border-[#E8E0D0] text-gray-300 mt-20">
      {/* Value Proposition Strip */}
      <div className="border-b border-white/10 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg border border-[#C9A84C]/40 bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] shrink-0">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-display text-white text-base">
                {t.trustPayments}
              </h4>
              <p className="text-xs text-gray-400">{t.codSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg border border-[#C9A84C]/40 bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-display text-white text-base">
                {t.trustDelivery}
              </h4>
              <p className="text-xs text-gray-400">{t.freeDelivery}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg border border-[#C9A84C]/40 bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-display text-white text-base">
                {t.trustExchange}
              </h4>
              <p className="text-xs text-gray-400">{t.heroPriceCaption}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content (NO Admin Links) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <h3 className="font-serif-display text-2xl tracking-[0.2em] text-white">
            RTS APPAREL
          </h3>
          <p className="text-xs text-[#C9A84C] tracking-widest uppercase">
            {t.heroBadge}
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            {t.footerTagline}
          </p>
        </div>

        <div>
          <h4 className="font-serif-display text-sm uppercase tracking-[0.2em] text-[#C9A84C] mb-4">
            {t.footerDepartments}
          </h4>
          <ul className="space-y-2.5 text-xs">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="text-gray-300 hover:text-[#C9A84C] transition-colors flex items-center justify-between"
                >
                  <span>{getCategoryName(cat, language)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif-display text-sm uppercase tracking-[0.2em] text-[#C9A84C] mb-4">
            {t.footerClientCare}
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link
                to="/track"
                className="text-gray-300 hover:text-[#C9A84C] transition-colors"
              >
                {t.orderTracking}
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="text-gray-300 hover:text-[#C9A84C] transition-colors"
              >
                {t.shoppingBag}
              </Link>
            </li>
            <li>
              <Link
                to="/account/orders"
                className="text-gray-300 hover:text-[#C9A84C] transition-colors"
              >
                {t.myOrders}
              </Link>
            </li>
            <li>
              <Link
                to="/signup?tab=agent"
                className="text-gray-300 hover:text-[#C9A84C] transition-colors"
              >
                {t.joinAgentNetwork}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-[#C9A84C] transition-colors"
              >
                {t.contactUs}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-display text-sm uppercase tracking-[0.2em] text-[#C9A84C] mb-4">
            {t.footerAtelierContact}
          </h4>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
              <span>{siteSettings.physical_address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <span>{siteSettings.whatsapp_number}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <span>{siteSettings.contact_email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>{t.footerRights}</p>
          <p className="text-[#C9A84C]/80">{t.trustPayments}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
