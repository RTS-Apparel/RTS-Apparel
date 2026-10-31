import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  ShoppingBag,
  Tag,
  Users,
  Image,
  Settings,
  LogOut,
  Globe,
  Coins,
  Wallet,
  Truck,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { useAuth } from "../../hooks/useAuth";
import { ADMIN_TRANSLATIONS } from "../../lib/i18n";
import { AdminLanguage } from "../../types";
import { BrandLogo } from "../common/BrandLogo";

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
    { label: t.categories, path: "/admin/categories", icon: Grid3X3 },
    { label: t.orders, path: "/admin/orders", icon: ShoppingBag },
    { label: t.customers, path: "/admin/customers", icon: Users },
    { label: t.discounts, path: "/admin/discounts", icon: Tag },
    { label: t.teamMembers, path: "/admin/team", icon: Users },
    { label: t.commissions, path: "/admin/commissions", icon: Coins },
    { label: t.withdrawals, path: "/admin/withdrawals", icon: Wallet },
    { label: t.deliveryCharges, path: "/admin/delivery", icon: Truck },
    { label: t.banners, path: "/admin/banners", icon: Image },
    { label: t.reports, path: "/admin/reports", icon: BarChart3 },
    { label: t.settings, path: "/admin/settings", icon: Settings },
  ];

  const handleAdminLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-full lg:w-64 bg-[#1A1A1A] rounded-xl border border-[#333333] shrink-0 flex flex-col justify-between overflow-hidden self-start shadow-xl">
      <div>
        <div className="p-5 border-b border-[#333333]">
          <BrandLogo size="sm" showTagline variant="dark" />
          <p className="text-xs text-[#CCCCCC] mt-2 font-medium">
            {t.adminConsoleTitle}
          </p>

          {/* Admin Panel Language Switcher: English | Roman Urdu ONLY */}
          <div className="mt-4 pt-3 border-t border-[#333333]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#CCCCCC] mb-2">
              <Globe className="w-3.5 h-3.5 text-[#E63946]" />
              <span>Admin Language</span>
            </div>
            <div className="grid grid-cols-2 gap-1 bg-[#2A2A2A] p-1 rounded-lg border border-[#333333]">
              {(["en", "roman_ur"] as AdminLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setAdminLanguage(lang)}
                  className={`py-1.5 rounded text-xs font-medium transition-colors ${
                    adminLanguage === lang
                      ? "bg-[#E63946] text-[#FFFFFF] font-semibold"
                      : "text-[#CCCCCC] hover:text-[#FFFFFF]"
                  }`}
                >
                  {lang === "en" ? "English" : "Roman Urdu"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active =
              item.path === "/admin/dashboard"
                ? location.pathname === "/admin/dashboard" ||
                  location.pathname === "/admin"
                : location.pathname.startsWith(item.path);
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-lg text-xs uppercase tracking-wider whitespace-nowrap transition-all border-l-4 ${
                    active
                      ? "border-[#E63946] bg-[#2A2A2A] text-[#FFFFFF] font-semibold"
                      : "border-transparent text-[#CCCCCC] hover:text-[#FFFFFF] hover:bg-[#2A2A2A]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 ${
                      active ? "text-[#E63946]" : "text-[#CCCCCC]"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#333333]">
        <button
          type="button"
          onClick={handleAdminLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[6px] text-xs uppercase tracking-wider font-semibold bg-[#2A2A2A] border border-[#333333] text-[#CCCCCC] hover:bg-[#C1121F] hover:border-[#C1121F] hover:text-[#FFFFFF] transition-colors"
        >
          <LogOut size={18} />
          <span>{t.logout}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
