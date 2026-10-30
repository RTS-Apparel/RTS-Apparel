import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Percent,
  UserCheck,
  Users,
  Image,
  Settings,
  LogOut,
  Globe,
  Coins,
  WalletCards,
  Truck,
  BarChart3,
} from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { useAuth } from "../../hooks/useAuth";
import { ADMIN_TRANSLATIONS } from "../../lib/i18n";
import { AdminLanguage } from "../../types";

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminLanguage = useDataStore((s) => s.adminLanguage);
  const setAdminLanguage = useDataStore((s) => s.setAdminLanguage);
  const { logout } = useAuth();
  const t = ADMIN_TRANSLATIONS[adminLanguage];

  const navItems = [
    { label: t.dashboard, path: "/admin/dashboard", icon: LayoutDashboard },
    { label: t.products, path: "/admin/products", icon: Package },
    { label: t.categories, path: "/admin/categories", icon: Tags },
    { label: t.orders, path: "/admin/orders", icon: ShoppingCart },
    { label: t.customers, path: "/admin/customers", icon: Users },
    { label: t.discounts, path: "/admin/discounts", icon: Percent },
    { label: t.teamMembers, path: "/admin/team", icon: UserCheck },
    { label: t.commissions, path: "/admin/commissions", icon: Coins },
    { label: t.withdrawals, path: "/admin/withdrawals", icon: WalletCards },
    { label: t.deliveryCharges, path: "/admin/delivery", icon: Truck },
    { label: t.banners, path: "/admin/banners", icon: Image },
    { label: t.reports, path: "/admin/reports", icon: BarChart3 },
    { label: t.settings, path: "/admin/settings", icon: Settings },
  ];

  const handleAdminLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <aside className="w-full lg:w-64 bg-[#1A1A1A] rounded-xl border border-[#E8E0D0] shrink-0 flex flex-col justify-between overflow-hidden self-start">
      <div>
        <div className="p-5 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] block font-semibold">
              RTS APPAREL
            </span>
            <h2 className="font-serif-display text-lg text-white mt-0.5 font-bold">
              {t.adminConsoleTitle}
            </h2>
          </div>

          {/* Admin Panel Language Switcher: English | Roman Urdu ONLY (No Urdu Script) */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-2">
              <Globe className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Admin Language</span>
            </div>
            <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              {(["en", "roman_ur"] as AdminLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setAdminLanguage(lang)}
                  className={`py-1.5 rounded text-xs font-medium transition-colors ${
                    adminLanguage === lang
                      ? "bg-[#C9A84C] text-[#1A1A1A] font-semibold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {lang === "en" ? "English" : "Roman Urdu"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.path === "/admin/dashboard"
                ? location.pathname === "/admin/dashboard"
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                  active
                    ? "bg-[#C9A84C] text-[#1A1A1A] font-semibold"
                    : "text-gray-300 hover:text-[#C9A84C] hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleAdminLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider border border-white/20 text-gray-200 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
