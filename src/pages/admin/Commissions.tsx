import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants } from "../../lib/animations";

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
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 bg-[#F5F5F5] rounded-[8px]"
    >
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <PageHeading
          title="Commissions"
          subtitle="Track agent earnings"
          icon={<TrendingUp className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Commissions" },
          ]}
        />

        <div className="flex flex-wrap gap-1.5">
          {["all", "pending", "approved", "paid", "cancelled"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-[6px] text-xs capitalize transition-colors font-semibold ${
                statusFilter === st
                  ? "bg-[#E63946] text-[#FFFFFF]"
                  : "bg-[#FFFFFF] border border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946] hover:text-[#E63946]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Agent</th>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4 text-right">Order Amount</th>
                  <th className="py-3.5 px-4 text-right">Commission (PKR)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {filtered.map((comm, idx) => {
                  const agent = users.find((u) => u.id === comm.agent_id);
                  const order = orders.find((o) => o.id === comm.order_id);
                  return (
                    <motion.tr
                      key={comm.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[#FFFFFF] text-[#1A1A1A]"
                    >
                      <td className="py-3.5 px-4 font-sans font-bold text-[#1A1A1A]">
                        {agent?.full_name || "Agent"} (<span className="text-[#E63946] font-mono">{agent?.referral_code}</span>)
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#1A1A1A]">
                        {order?.order_number || comm.order_id}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#666666]">
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
                          className="w-24 h-8 px-2 rounded-[4px] bg-[#FFFFFF] border border-[#E0E0E0] text-right text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            comm.status === "paid"
                              ? "bg-[#D4EDDA] text-[#155724]"
                              : comm.status === "approved"
                              ? "bg-[#D1ECF1] text-[#0C5460]"
                              : comm.status === "cancelled"
                              ? "bg-[#F8D7DA] text-[#721C24]"
                              : "bg-[#FFF3CD] text-[#856404]"
                          }`}
                        >
                          {comm.status}
                        </span>
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
                            className="px-3 py-1 rounded-[4px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs hover:bg-[#C1121F]"
                          >
                            Approve
                          </button>
                        )}
                        {comm.status === "approved" && (
                          <button
                            type="button"
                            onClick={() => markCommissionPaid(comm.id)}
                            className="px-3 py-1 rounded-[4px] bg-[#22C55E] text-[#FFFFFF] font-semibold text-xs hover:opacity-90"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminCommissions;
