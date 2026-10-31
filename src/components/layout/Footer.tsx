import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Banknote,
  MessageCircle,
} from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { CUSTOMER_TRANSLATIONS, getCategoryName } from "../../lib/i18n";
import { BrandLogo } from "../common/BrandLogo";

export const Footer: React.FC = () => {
  const categories = useDataStore((s) => s.categories);
  const siteSettings = useDataStore((s) => s.siteSettings);
  const language = useDataStore((s) => s.language);
  const t = CUSTOMER_TRANSLATIONS[language];

  const shopAddress =
    siteSettings.physical_address?.trim() ||
    "Club Road Near New Cafe Sajawal Sadiqabad, Sadiqabad Pakistan";
  const shopPhone = siteSettings.whatsapp_number?.trim() || "03058165623";
  const facebookUrl = siteSettings.facebook_url?.trim() || "";
  const tiktokUrl = siteSettings.tiktok_url?.trim() || "";

  return (
    <footer className="bg-[#1A1A1A] border-t border-[#333333] text-[#CCCCCC] mt-20 relative z-10">
      {/* Value Proposition Strip */}
      <div className="border-b border-[#333333] bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#E63946] flex items-center justify-center text-[#FFFFFF] shrink-0">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-display text-[#FFFFFF] text-base font-semibold">
                {t.trustPayments}
              </h4>
              <p className="text-xs text-[#CCCCCC]">{t.codSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#E63946] flex items-center justify-center text-[#FFFFFF] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-display text-[#FFFFFF] text-base font-semibold">
                {t.trustDelivery}
              </h4>
              <p className="text-xs text-[#CCCCCC]">{t.freeDelivery}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#E63946] flex items-center justify-center text-[#FFFFFF] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-display text-[#FFFFFF] text-base font-semibold">
                {t.trustExchange}
              </h4>
              <p className="text-xs text-[#CCCCCC]">{t.heroPriceCaption}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <BrandLogo size="md" showTagline variant="dark" />
          </Link>
          <p className="text-xs text-[#CCCCCC] leading-relaxed">
            {t.footerTagline}
          </p>

          {(facebookUrl || tiktokUrl) && (
            <div className="flex items-center gap-3 pt-2">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ARTS APPAREL Facebook"
                  className="w-9 h-9 rounded-lg bg-[#2A2A2A] border border-[#333333] hover:border-[#E63946] text-[#CCCCCC] hover:text-[#E63946] flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ARTS APPAREL TikTok"
                  className="w-9 h-9 rounded-lg bg-[#2A2A2A] border border-[#333333] hover:border-[#E63946] text-[#CCCCCC] hover:text-[#E63946] flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-serif-display text-sm uppercase tracking-[0.2em] text-[#E63946] font-bold mb-4">
            {t.collections}
          </h4>
          <ul className="space-y-2.5 text-xs">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="text-[#CCCCCC] hover:text-[#E63946] transition-colors flex items-center justify-between"
                >
                  <span>{getCategoryName(cat, language)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif-display text-sm uppercase tracking-[0.2em] text-[#E63946] font-bold mb-4">
            {t.clientCare}
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link
                to="/track"
                className="text-[#CCCCCC] hover:text-[#E63946] transition-colors"
              >
                {t.orderTracking}
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="text-[#CCCCCC] hover:text-[#E63946] transition-colors"
              >
                {t.shoppingBag}
              </Link>
            </li>
            <li>
              <Link
                to="/account/orders"
                className="text-[#CCCCCC] hover:text-[#E63946] transition-colors"
              >
                {t.myOrders}
              </Link>
            </li>
            <li>
              <Link
                to="/signup?tab=agent"
                className="text-[#CCCCCC] hover:text-[#E63946] transition-colors"
              >
                {t.joinAgentNetwork}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-[#CCCCCC] hover:text-[#E63946] transition-colors"
              >
                {t.aboutAtelier}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-[#CCCCCC] hover:text-[#E63946] transition-colors"
              >
                {t.contactUs}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-display text-sm uppercase tracking-[0.2em] text-[#E63946] font-bold mb-4">
            {t.conciergePayments}
          </h4>
          <ul className="space-y-3 text-xs text-[#CCCCCC]">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
              <span>{shopAddress}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#E63946] shrink-0" />
              <a
                href={`tel:${shopPhone.replace(/\s+/g, "")}`}
                className="hover:text-[#E63946] transition-colors font-mono"
              >
                {shopPhone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-[#E63946] shrink-0" />
              <a
                href="https://wa.me/923058165623"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E63946] transition-colors"
              >
                WhatsApp: 03058165623
              </a>
            </li>
            {siteSettings.contact_email && (
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E63946] shrink-0" />
                <span>{siteSettings.contact_email}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#333333] py-6 text-center text-xs text-[#666666]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#666666]">
            © {new Date().getFullYear()} ARTS APPAREL. All rights reserved.
          </p>
          <p className="text-[#CCCCCC]">{t.trustPayments}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
