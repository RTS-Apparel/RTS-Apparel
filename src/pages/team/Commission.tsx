import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { TeamSidebar } from "../../components/layout/TeamSidebar";

export const TeamCommissionPage: React.FC = () => {
  const { user } = useAuth();
  const commissions = useDataStore((s) => s.commissions);
  const orders = useDataStore((s) => s.orders);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const agentId = user?.role === "agent" ? user.id : "user-agent-1";
  const myCommissions = commissions.filter((c) => c.agent_id === agentId);

  const filtered = myCommissions.filter((c) =>
    statusFilter === "all" ? true : c.status === statusFilter
  );

  const totalPending = myCommissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalApproved = myCommissions
    .filter((c) => c.status === "approved")
    .reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalPaid = myCommissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      <TeamSidebar />

      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Commission Breakdown
          </h1>

          <div className="flex gap-1.5">
            {["all", "pending", "approved", "paid"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize ${
                  statusFilter === st
                    ? "bg-[#C9A84C] text-[#1A1A1A] font-semibold"
                    : "bg-[#FAFAFA] border border-[#E8E0D0] text-[#4A4A4A]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
          <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] shadow-xs">
            <p className="text-xs font-sans text-[#4A4A4A]">Pending Approval</p>
            <p className="text-xl font-bold text-[#D97706] mt-1">
              {formatPKR(totalPending)}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] shadow-xs">
            <p className="text-xs font-sans text-[#4A4A4A]">Approved (Unpaid)</p>
            <p className="text-xl font-bold text-[#16A34A] mt-1">
              {formatPKR(totalApproved)}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] shadow-xs">
            <p className="text-xs font-sans text-[#4A4A4A]">Total Paid Out</p>
            <p className="text-xl font-bold text-[#C9A84C] mt-1">
              {formatPKR(totalPaid)}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Order Total</th>
                <th className="py-3.5 px-4">Commission</th>
                <th className="py-3.5 px-4">Note</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
              {filtered.map((comm) => {
                const ord = orders.find((o) => o.id === comm.order_id);
                return (
                  <tr key={comm.id} className="hover:bg-[#F5F4F0]">
                    <td className="py-3.5 px-4 font-semibold text-[#C9A84C]">
                      {ord?.order_number || comm.order_id}
                    </td>
                    <td className="py-3.5 px-4 text-[#1A1A1A]">
                      {ord ? formatPKR(ord.total_amount) : "—"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#16A34A]">
                      {comm.amount ? formatPKR(comm.amount) : "Pending"}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#4A4A4A]">
                      {comm.admin_note || "Standard Referral"}
                    </td>
                    <td className="py-3.5 px-4 text-right uppercase font-semibold text-[#1A1A1A]">
                      {comm.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
