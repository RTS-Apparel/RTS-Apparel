import React, { useState } from "react";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";

export const AdminCommissions: React.FC = () => {
  const commissions = useDataStore((s) => s.commissions);
  const orders = useDataStore((s) => s.orders);
  const users = useDataStore((s) => s.users);
  const updateCommission = useDataStore((s) => s.updateCommission);
  const markCommissionPaid = useDataStore((s) => s.markCommissionPaid);

  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = commissions.filter((c) =>
    statusFilter === "all" ? true : c.status === statusFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
              Commission Ledger
            </h1>
            <p className="text-xs text-[#4A4A4A]">
              Set commission amount per referred order, approve, or mark as paid.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["all", "pending", "approved", "paid", "cancelled"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                  statusFilter === st
                    ? "bg-[#C9A84C] text-[#1A1A1A] font-semibold"
                    : "bg-[#FAFAFA] border border-[#E8E0D0] text-[#4A4A4A] hover:border-[#C9A84C]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3.5 px-4">Agent</th>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4 text-right">Order Amount</th>
                  <th className="py-3.5 px-4 text-right">Commission (PKR)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {filtered.map((comm) => {
                  const agent = users.find((u) => u.id === comm.agent_id);
                  const order = orders.find((o) => o.id === comm.order_id);
                  return (
                    <tr key={comm.id} className="hover:bg-[#F5F4F0] transition-colors">
                      <td className="py-3.5 px-4 font-sans font-semibold text-[#1A1A1A]">
                        {agent?.full_name || "Agent"} ({agent?.referral_code})
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#C9A84C]">
                        {order?.order_number || comm.order_id}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#4A4A4A]">
                        {order ? formatPKR(order.total_amount) : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <input
                          type="number"
                          min={0}
                          value={comm.amount || 0}
                          aria-label={`Commission amount for ${order?.order_number}`}
                          onChange={(e) =>
                            updateCommission(
                              comm.id,
                              Number(e.target.value) || 0,
                              comm.status
                            )
                          }
                          className="w-24 h-8 px-2 rounded bg-[#FFFFFF] border border-[#E8E0D0] text-right text-xs font-bold text-[#16A34A] focus:outline-none focus:border-[#C9A84C]"
                        />
                      </td>
                      <td className="py-3.5 px-4 uppercase font-semibold text-[#1A1A1A]">
                        {comm.status}
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        {comm.status === "pending" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateCommission(
                                comm.id,
                                comm.amount || 1000,
                                "approved"
                              )
                            }
                            className="px-3 py-1 rounded bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs hover:bg-[#E2C07A]"
                          >
                            Approve
                          </button>
                        )}
                        {comm.status === "approved" && (
                          <button
                            type="button"
                            onClick={() => markCommissionPaid(comm.id)}
                            className="px-3 py-1 rounded bg-[#16A34A] text-white font-semibold text-xs hover:bg-[#15803D]"
                          >
                            Mark as Paid
                          </button>
                        )}
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
