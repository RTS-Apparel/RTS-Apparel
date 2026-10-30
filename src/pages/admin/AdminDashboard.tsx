import React from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  ShoppingBag,
  UserPlus,
  WalletCards,
  Shirt,
  Users,
} from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { ADMIN_TRANSLATIONS, getProductName } from "../../lib/i18n";

export const AdminDashboard: React.FC = () => {
  const orders = useDataStore((s) => s.orders);
  const products = useDataStore((s) => s.products);
  const users = useDataStore((s) => s.users);
  const commissions = useDataStore((s) => s.commissions);
  const withdrawals = useDataStore((s) => s.withdrawalRequests);
  const adminLanguage = useDataStore((s) => s.adminLanguage);

  const t = ADMIN_TRANSLATIONS[adminLanguage];

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "pending"
  ).length;
  const pendingAgentsCount = users.filter(
    (u) => u.role === "agent" && !u.is_approved
  ).length;
  const pendingWithdrawalsCount = withdrawals.filter(
    (w) => w.status === "pending"
  ).length;
  const activeAgents = users.filter(
    (u) => u.role === "agent" && u.is_approved && !u.is_blocked
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-[#C9A84C] font-bold uppercase tracking-wider">
              {t.adminConsoleSubtitle}
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1A1A1A] mt-1">
              {t.adminConsoleTitle}
            </h1>
          </div>
          <Link
            to="/admin/products/new"
            className="h-10 px-4 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs flex items-center justify-center hover:bg-[#E2C07A] self-start shadow-xs"
          >
            + {t.addProduct}
          </Link>
        </div>

        {/* 6 Live Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono tabular-nums">
          <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] space-y-1 shadow-xs">
            <TrendingUp className="w-4 h-4 text-[#C9A84C]" />
            <p className="text-lg font-bold text-[#C9A84C] pt-1">
              {formatPKR(totalRevenue)}
            </p>
            <p className="text-[11px] font-sans text-[#4A4A4A]">
              {t.totalRevenue}
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] hover:border-[#C9A84C] transition-colors space-y-1 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#D97706]" />
            <p className="text-lg font-bold text-[#1A1A1A] pt-1">
              {pendingOrdersCount}
            </p>
            <p className="text-[11px] font-sans text-[#4A4A4A]">
              {t.pendingOrders}
            </p>
          </Link>

          <Link
            to="/admin/team"
            className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] hover:border-[#C9A84C] transition-colors space-y-1 shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-[#C9A84C]" />
            <p className="text-lg font-bold text-[#C9A84C] pt-1">
              {pendingAgentsCount}
            </p>
            <p className="text-[11px] font-sans text-[#4A4A4A]">
              {t.agentApprovals}
            </p>
          </Link>

          <Link
            to="/admin/withdrawals"
            className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] hover:border-[#C9A84C] transition-colors space-y-1 shadow-xs"
          >
            <WalletCards className="w-4 h-4 text-[#16A34A]" />
            <p className="text-lg font-bold text-[#1A1A1A] pt-1">
              {pendingWithdrawalsCount}
            </p>
            <p className="text-[11px] font-sans text-[#4A4A4A]">
              {t.pendingPayouts}
            </p>
          </Link>

          <Link
            to="/admin/products"
            className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] hover:border-[#C9A84C] transition-colors space-y-1 shadow-xs"
          >
            <Shirt className="w-4 h-4 text-[#C9A84C]" />
            <p className="text-lg font-bold text-[#1A1A1A] pt-1">
              {products.length}
            </p>
            <p className="text-[11px] font-sans text-[#4A4A4A]">
              {t.catalogItems}
            </p>
          </Link>

          <Link
            to="/admin/team"
            className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] hover:border-[#C9A84C] transition-colors space-y-1 shadow-xs"
          >
            <Users className="w-4 h-4 text-[#C9A84C]" />
            <p className="text-lg font-bold text-[#1A1A1A] pt-1">
              {activeAgents.length}
            </p>
            <p className="text-[11px] font-sans text-[#4A4A4A]">
              {t.activeAgents}
            </p>
          </Link>
        </div>

        {/* Recent Orders Table */}
        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif-display font-bold text-[#1A1A1A]">
              {t.recentOrders}
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-[#C9A84C] hover:underline"
            >
              {t.manageAllOrders}
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3 pr-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">City</th>
                  <th className="py-3 px-3">Referral Code</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Total</th>
                  <th className="py-3 pl-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {orders.slice(0, 6).map((ord) => (
                  <tr
                    key={ord.id}
                    className="hover:bg-[#F5F4F0] transition-colors"
                  >
                    <td className="py-3.5 pr-3 font-semibold text-[#C9A84C]">
                      {ord.order_number}
                    </td>
                    <td className="py-3.5 px-3 font-sans font-medium text-[#1A1A1A]">
                      {ord.customer_name}
                    </td>
                    <td className="py-3.5 px-3 font-sans text-[#4A4A4A]">
                      {ord.delivery_city}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#9B7B2F]">
                      {ord.referral_code || "—"}
                    </td>
                    <td className="py-3.5 px-3 uppercase font-semibold text-[#1A1A1A]">
                      {ord.status}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-[#1A1A1A]">
                      {formatPKR(ord.total_amount)}
                    </td>
                    <td className="py-3.5 pl-3 text-right font-sans">
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="font-semibold text-[#C9A84C] hover:underline"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Agents & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-serif-display font-bold text-[#1A1A1A]">
              {t.topAgents}
            </h2>
            <div className="space-y-3">
              {activeAgents.map((ag) => {
                const agComms = commissions.filter((c) => c.agent_id === ag.id);
                const earned = agComms.reduce(
                  (sum, c) => sum + (c.amount || 0),
                  0
                );
                return (
                  <div
                    key={ag.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">
                        {ag.full_name}
                      </p>
                      <p className="font-mono text-[#9B7B2F]">
                        Code: {ag.referral_code} · {agComms.length} orders
                      </p>
                    </div>
                    <span className="font-mono font-bold text-[#16A34A] tabular-nums">
                      {formatPKR(earned)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-serif-display font-bold text-[#1A1A1A]">
              {t.topProducts}
            </h2>
            <div className="space-y-3">
              {products.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs"
                >
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">
                      {getProductName(prod, adminLanguage)}
                    </p>
                    <p className="text-[#4A4A4A]">Stock: {prod.stock} units</p>
                  </div>
                  <span className="font-mono font-bold text-[#C9A84C] tabular-nums">
                    {formatPKR(prod.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
