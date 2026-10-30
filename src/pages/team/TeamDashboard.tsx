import React from "react";
import { Link } from "react-router-dom";
import { Copy, Share2, TrendingUp, Users, Coins, Clock, ShoppingBag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { TeamSidebar } from "../../components/layout/TeamSidebar";

export const TeamDashboard: React.FC = () => {
  const { user } = useAuth();
  const orders = useDataStore((s) => s.orders);
  const commissions = useDataStore((s) => s.commissions);
  const addToast = useDataStore((s) => s.addToast);

  const agentId = user?.role === "agent" ? user.id : "user-agent-1";
  const referralCode = user?.referral_code || "RTS-ALI123";

  const myOrders = orders.filter(
    (o) => o.agent_id === agentId || o.referral_code === referralCode
  );
  const myCommissions = commissions.filter((c) => c.agent_id === agentId);

  // Today's sales (or latest active day sales for referred orders)
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todaysOrders = myOrders.filter(
    (o) =>
      o.created_at.slice(0, 10) === todayDateStr ||
      o.created_at.slice(0, 10) === "2026-10-29"
  );
  const todaysSales = todaysOrders.reduce(
    (sum, o) => sum + (o.total_amount || 0),
    0
  );

  const totalEarned = myCommissions
    .filter((c) => c.status === "paid" || c.status === "approved")
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  const pendingAmount = myCommissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode).catch(() => {});
    addToast(`Referral code ${referralCode} copied to clipboard!`);
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Shop luxury Pakistani menswear at RTS Apparel using my Partner Code ${referralCode}: ${window.location.origin}`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      <TeamSidebar />

      <div className="flex-1 space-y-8">
        <div>
          <p className="text-xs text-[#C9A84C] font-semibold tracking-widest uppercase">
            Partner Agent Hub · نمائندہ ڈیش بورڈ
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1A1A1A] mt-1">
            Partner Performance Overview
          </h1>
        </div>

        {/* Referral Code Box with Copy + WhatsApp Share */}
        <div className="rounded-xl bg-[#FAFAFA] border-2 border-[#C9A84C] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#4A4A4A]">
              Your Unique RTS Partner Referral Code
            </p>
            <p className="text-3xl font-mono font-bold text-[#C9A84C] tracking-wider">
              {referralCode}
            </p>
            <p className="text-xs text-[#4A4A4A]">
              Every checkout using this code automatically links the order and commission to your account.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopyCode}
              className="h-11 px-5 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs flex items-center gap-2 hover:bg-[#E2C07A]"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Code</span>
            </button>
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="h-11 px-5 rounded-lg bg-[#16A34A] text-white font-semibold text-xs flex items-center gap-2 hover:opacity-90"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Stats Cards: Today's Sales, Total Referrals, Pending Commission, Total Commission Earned */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono tabular-nums">
          <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] space-y-1 shadow-xs">
            <ShoppingBag className="w-5 h-5 text-[#C9A84C]" />
            <p className="text-2xl font-bold text-[#1A1A1A] pt-2">
              {formatPKR(todaysSales)}
            </p>
            <p className="text-xs font-sans text-[#4A4A4A]">
              Today&apos;s Sales ({todaysOrders.length} orders)
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] space-y-1 shadow-xs">
            <Users className="w-5 h-5 text-[#C9A84C]" />
            <p className="text-2xl font-bold text-[#1A1A1A] pt-2">
              {myOrders.length}
            </p>
            <p className="text-xs font-sans text-[#4A4A4A]">
              Total Referrals
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] space-y-1 shadow-xs">
            <Clock className="w-5 h-5 text-[#D97706]" />
            <p className="text-2xl font-bold text-[#D97706] pt-2">
              {formatPKR(pendingAmount)}
            </p>
            <p className="text-xs font-sans text-[#4A4A4A]">
              Pending Commission
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] space-y-1 shadow-xs">
            <TrendingUp className="w-5 h-5 text-[#16A34A]" />
            <p className="text-2xl font-bold text-[#C9A84C] pt-2">
              {formatPKR(totalEarned)}
            </p>
            <p className="text-xs font-sans text-[#4A4A4A]">
              Total Commission Earned
            </p>
          </div>
        </div>

        {/* Recent Referral Activity */}
        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Recent Referral Orders
            </h2>
            <Link
              to="/team/referrals"
              className="text-xs font-semibold text-[#C9A84C] hover:underline"
            >
              View Full Referral Log →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3 pr-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Order Total</th>
                  <th className="py-3 px-4">Commission</th>
                  <th className="py-3 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {myOrders.map((ord) => {
                  const comm = myCommissions.find((c) => c.order_id === ord.id);
                  return (
                    <tr key={ord.id} className="hover:bg-[#F5F4F0]">
                      <td className="py-3.5 pr-4 font-semibold text-[#C9A84C]">
                        {ord.order_number}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">
                        {ord.customer_name} ({ord.delivery_city})
                      </td>
                      <td className="py-3.5 px-4 text-[#1A1A1A]">
                        {formatPKR(ord.total_amount)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#16A34A]">
                        {comm?.amount ? formatPKR(comm.amount) : "Pending Admin"}
                      </td>
                      <td className="py-3.5 pl-4 text-right uppercase font-semibold text-[#4A4A4A]">
                        {comm?.status || ord.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
