import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  User,
  MapPin,
  Heart,
  Award,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const AccountSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const links = [
    { to: "/account", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/account/orders", label: "My Orders", icon: Package },
    { to: "/account/addresses", label: "Saved Addresses", icon: MapPin },
    { to: "/account/profile", label: "Profile Settings", icon: User },
    { to: "/account/wishlist", label: "Wishlist", icon: Heart },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 rounded-[8px] bg-[#1A1A1A] border border-[#333333] p-4 space-y-6 h-fit shadow-md">
      <div className="pb-4 border-b border-[#333333]">
        <p className="text-xs text-[#CCCCCC]">ARTS APPAREL Client</p>
        <p className="text-base font-semibold text-[#FFFFFF] truncate mt-0.5">
          {user?.full_name || "ARTS APPAREL Client"}
        </p>
        <p className="text-xs font-mono text-[#E63946] font-semibold mt-0.5">
          {user?.phone}
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
                `flex items-center gap-3 px-3.5 py-2.5 rounded-[6px] text-sm font-medium transition-colors border-l-4 ${
                  isActive
                    ? "bg-[#2A2A2A] border-[#E63946] text-[#FFFFFF] font-semibold"
                    : "border-transparent text-[#CCCCCC] hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
                }`
              }
            >
              <Icon className="w-4 h-4 text-[#E63946]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {(user?.role === "agent" || user?.role === "admin") && (
          <Link
            to="/team"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-[6px] text-sm font-medium text-[#FFFFFF] hover:bg-[#2A2A2A] transition-colors mt-2"
          >
            <Award className="w-4 h-4 text-[#E63946]" />
            <span>Go to Agent Dashboard</span>
          </Link>
        )}
      </nav>

      <div className="pt-4 border-t border-[#333333]">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-[6px] text-sm text-[#E63946] hover:bg-[#2A2A2A] hover:text-[#FFFFFF] transition-colors font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
