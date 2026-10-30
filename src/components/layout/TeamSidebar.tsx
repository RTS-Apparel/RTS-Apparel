import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Wallet,
  UserCog,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const TeamSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const links = [
    { to: "/team", label: "Partner Overview", icon: LayoutDashboard, end: true },
    { to: "/team/referrals", label: "My Referrals", icon: Users },
    { to: "/team/commission", label: "Commissions", icon: DollarSign },
    { to: "/team/withdrawal", label: "Withdrawals", icon: Wallet },
    { to: "/team/profile", label: "Payout & Profile", icon: UserCog },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-4 space-y-6 h-fit shadow-xs">
      <div className="pb-4 border-b border-[#E8E0D0]">
        <p className="text-xs text-[#9A9A9A]">Approved RTS Partner</p>
        <p className="text-base font-semibold text-[#1A1A1A] truncate mt-0.5">
          {user?.full_name}
        </p>
        <p className="text-xs font-mono font-semibold text-[#C9A84C] mt-1">
          Code: {user?.referral_code || "RTS-ALI123"}
        </p>
      </div>

      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#C9A84C] text-[#1A1A1A] font-semibold"
                    : "text-[#4A4A4A] hover:bg-[#F5F4F0] hover:text-[#1A1A1A]"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <Link
          to="/account"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#4A4A4A] hover:bg-[#F5F4F0] hover:text-[#1A1A1A] transition-colors mt-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Customer Account</span>
        </Link>
      </nav>

      <div className="pt-4 border-t border-[#E8E0D0]">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm text-[#EF4444] hover:bg-[#F5F4F0] transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
