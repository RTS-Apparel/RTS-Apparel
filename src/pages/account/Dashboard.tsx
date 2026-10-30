import React from "react";
import { Link } from "react-router-dom";
import { Package, MapPin, Heart, User, Award, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AccountSidebar } from "../../components/layout/AccountSidebar";

export const AccountDashboard: React.FC = () => {
  const { user, switchDemoRole } = useAuth();
  const orders = useDataStore((s) => s.orders);
  const wishlist = useDataStore((s) => s.wishlist);
  const allAddresses = useDataStore((s) => s.addresses);
  const addresses = allAddresses.filter((a) => a.user_id === user?.id);

  const userOrders = orders.filter(
    (o) =>
      o.customer_id === user?.id ||
      o.customer_phone === user?.phone ||
      o.customer_id === "user-customer-1"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      <AccountSidebar />

      <div className="flex-1 space-y-8">
        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <p className="text-xs text-[#C9A84C] font-semibold uppercase tracking-wider">
              Client Wardrobe Portal
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1A1A1A] mt-1">
              Welcome back, {user?.full_name}
            </h1>
          </div>
          <Link
            to="/team"
            onClick={() => {
              if (user?.role !== "agent") switchDemoRole("agent");
            }}
            className="h-10 px-4 rounded-lg border border-[#C9A84C] text-[#C9A84C] text-xs font-semibold flex items-center gap-2 hover:bg-[#C9A84C]/10 self-start"
          >
            <Award className="w-4 h-4" />
            <span>Go to Agent Dashboard</span>
          </Link>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/account/orders"
            className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] hover:border-[#C9A84C] hover:shadow-md transition-all space-y-1"
          >
            <Package className="w-5 h-5 text-[#C9A84C]" />
            <p className="text-2xl font-mono font-bold text-[#1A1A1A] pt-2 tabular-nums">
              {userOrders.length}
            </p>
            <p className="text-xs text-[#4A4A4A]">Total Orders</p>
          </Link>

          <Link
            to="/account/addresses"
            className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] hover:border-[#C9A84C] hover:shadow-md transition-all space-y-1"
          >
            <MapPin className="w-5 h-5 text-[#C9A84C]" />
            <p className="text-2xl font-mono font-bold text-[#1A1A1A] pt-2 tabular-nums">
              {addresses.length}
            </p>
            <p className="text-xs text-[#4A4A4A]">Saved Addresses</p>
          </Link>

          <Link
            to="/account/wishlist"
            className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] hover:border-[#C9A84C] hover:shadow-md transition-all space-y-1"
          >
            <Heart className="w-5 h-5 text-[#C9A84C]" />
            <p className="text-2xl font-mono font-bold text-[#1A1A1A] pt-2 tabular-nums">
              {wishlist.length}
            </p>
            <p className="text-xs text-[#4A4A4A]">Saved Garments</p>
          </Link>

          <Link
            to="/account/profile"
            className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] hover:border-[#C9A84C] hover:shadow-md transition-all space-y-1"
          >
            <User className="w-5 h-5 text-[#C9A84C]" />
            <p className="text-sm font-semibold text-[#1A1A1A] pt-2 truncate">
              {user?.phone}
            </p>
            <p className="text-xs text-[#4A4A4A]">Profile & Security</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
              Recent Orders
            </h2>
            <Link
              to="/account/orders"
              className="text-xs font-semibold text-[#C9A84C] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3 pr-4">Order ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {userOrders.slice(0, 3).map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F5F4F0]">
                    <td className="py-3.5 pr-4 font-semibold text-[#C9A84C]">
                      {ord.order_number}
                    </td>
                    <td className="py-3.5 px-4 text-[#4A4A4A]">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">
                      {ord.delivery_city}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[#1A1A1A] font-semibold">
                      {ord.status}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[#1A1A1A]">
                      {formatPKR(ord.total_amount)}
                    </td>
                    <td className="py-3.5 pl-4 text-right font-sans">
                      <Link
                        to={`/account/orders/${ord.id}`}
                        className="text-[#C9A84C] font-semibold hover:underline"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
