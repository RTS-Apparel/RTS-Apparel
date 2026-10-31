import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users2,
  Coins,
  Wallet,
  User,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const TeamSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const links = [
    { to: "/team", label: "Partner Overview", icon: LayoutDashboard, end: true },
    { to: "/team/referrals", label: "My Referrals", icon: Users2 },
    { to: "/team/commission", label: "Commissions", icon: Coins },
    { to: "/team/withdrawal", label: "Withdrawals", icon: Wallet },
    { to: "/team/profile", label: "Payout & Profile", icon: User },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 rounded-xl bg-[#1A1A1A] border border-[#333333] p-4 space-y-6 h-fit shadow-lg">
      <div className="pb-4 border-b border-[#333333]">
        <p className="text-xs text-[#CCCCCC]">Approved ARTS APPAREL Partner</p>
        <p className="text-base font-semibold text-[#FFFFFF] truncate mt-0.5">
          {user?.full_name}
        </p>
        <p className="text-xs font-mono font-semibold text-[#E63946] mt-1">
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
                `flex items-center gap-3 px-3.5 py-2.5 rounded-r-lg text-sm font-medium transition-colors border-l-4 ${
                  isActive
                    ? "bg-[#2A2A2A] border-[#E63946] text-[#FFFFFF] font-semibold"
                    : "border-transparent text-[#CCCCCC] hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
                }`
              }
            >
              <Icon size={18} className="text-[#E63946]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <Link
          to="/account"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-r-lg text-sm font-medium border-l-4 border-transparent text-[#CCCCCC] hover:bg-[#2A2A2A] hover:text-[#FFFFFF] transition-colors mt-2"
        >
          <ShoppingBag size={18} className="text-[#E63946]" />
          <span>My Customer Account</span>
        </Link>
      </nav>

      <div className="pt-4 border-t border-[#333333]">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[6px] text-sm bg-[#2A2A2A] text-[#CCCCCC] hover:bg-[#C1121F] hover:text-[#FFFFFF] transition-colors font-semibold"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
