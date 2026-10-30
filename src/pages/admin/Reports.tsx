import React, { useState } from "react";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";

export const AdminReports: React.FC = () => {
  const orders = useDataStore((s) => s.orders);
  const users = useDataStore((s) => s.users);
  const products = useDataStore((s) => s.products);
  const commissions = useDataStore((s) => s.commissions);

  const [tab, setTab] = useState<"sales" | "agents" | "products">("sales");

  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = validOrders.reduce((s, o) => s + o.total_amount, 0);
  const avgOrderValue =
    validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  const agents = users.filter((u) => u.role === "agent" && u.is_approved);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Executive Analytics & Reports
          </h1>

          <div className="flex gap-1.5 p-1 rounded-lg bg-[#FAFAFA] border border-[#E8E0D0]">
            <button
              type="button"
              onClick={() => setTab("sales")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                tab === "sales"
                  ? "bg-[#C9A84C] text-[#1A1A1A]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A]"
              }`}
            >
              Sales Report
            </button>
            <button
              type="button"
              onClick={() => setTab("agents")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                tab === "agents"
                  ? "bg-[#C9A84C] text-[#1A1A1A]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A]"
              }`}
            >
              Agent Leaderboard
            </button>
            <button
              type="button"
              onClick={() => setTab("products")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                tab === "products"
                  ? "bg-[#C9A84C] text-[#1A1A1A]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A]"
              }`}
            >
              Top Products
            </button>
          </div>
        </div>

        {tab === "sales" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
              <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] shadow-sm">
                <p className="text-xs font-sans text-[#4A4A4A]">Gross Revenue</p>
                <p className="text-2xl font-bold text-[#C9A84C] mt-1">
                  {formatPKR(totalRevenue)}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] shadow-sm">
                <p className="text-xs font-sans text-[#4A4A4A]">Completed & Active Orders</p>
                <p className="text-2xl font-bold text-[#1A1A1A] mt-1">
                  {validOrders.length}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] shadow-sm">
                <p className="text-xs font-sans text-[#4A4A4A]">Average Order Value</p>
                <p className="text-2xl font-bold text-[#16A34A] mt-1">
                  {formatPKR(avgOrderValue)}
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === "agents" && (
          <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">Agent Name</th>
                  <th className="py-3.5 px-4">Referral Code</th>
                  <th className="py-3.5 px-4 text-right">Orders Referred</th>
                  <th className="py-3.5 px-4 text-right">Total Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {agents.map((ag, idx) => {
                  const agComms = commissions.filter((c) => c.agent_id === ag.id);
                  const sumComm = agComms.reduce((s, c) => s + (c.amount || 0), 0);
                  return (
                    <tr key={ag.id} className="hover:bg-[#F5F4F0] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#C9A84C]">#{idx + 1}</td>
                      <td className="py-3.5 px-4 font-sans font-semibold text-[#1A1A1A]">
                        {ag.full_name}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#9B7B2F]">
                        {ag.referral_code}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#1A1A1A]">
                        {agComms.length}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#16A34A]">
                        {formatPKR(sumComm)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "products" && (
          <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-right">Remaining Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F5F4F0] transition-colors">
                    <td className="py-3.5 px-4 font-sans font-semibold text-[#1A1A1A]">
                      {prod.name_en}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#C9A84C]">
                      {formatPKR(prod.price)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#1A1A1A]">
                      {prod.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
