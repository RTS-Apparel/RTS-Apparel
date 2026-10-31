import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { TeamSidebar } from "../../components/layout/TeamSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import {
  pageVariants,
  statCardVariants,
  CountUpNumber,
} from "../../lib/animations";

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
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8"
    >
      <TeamSidebar />

      <div className="flex-1 space-y-6">
        <PageHeading
          title="My Commission"
          subtitle="Your earnings breakdown"
          icon={<TrendingUp className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Agent Hub", to: "/team" },
            { label: "My Commission" },
          ]}
        />

        <div className="flex flex-wrap gap-1.5">
          {["all", "pending", "approved", "paid"].map((st) => (
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
          <motion.div
            custom={0}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] shadow-xs"
          >
            <p className="text-xs font-sans text-[#666666]">Pending Approval</p>
            <p className="text-[24px] font-bold text-[#1A1A1A] mt-1">
              <CountUpNumber value={totalPending} prefix="Rs. " />
            </p>
          </motion.div>
          <motion.div
            custom={1}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] shadow-xs"
          >
            <p className="text-xs font-sans text-[#666666]">Approved (Unpaid)</p>
            <p className="text-[24px] font-bold text-[#1A1A1A] mt-1">
              <CountUpNumber value={totalApproved} prefix="Rs. " />
            </p>
          </motion.div>
          <motion.div
            custom={2}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] shadow-xs"
          >
            <p className="text-xs font-sans text-[#666666]">Total Paid Out</p>
            <p className="text-[24px] font-bold text-[#1A1A1A] mt-1">
              <CountUpNumber value={totalPaid} prefix="Rs. " />
            </p>
          </motion.div>
        </div>

        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Order Total</th>
                <th className="py-3.5 px-4">Commission</th>
                <th className="py-3.5 px-4">Note</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
              {filtered.map((comm, idx) => {
                const ord = orders.find((o) => o.id === comm.order_id);
                return (
                  <motion.tr
                    key={comm.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#FFFFFF] text-[#1A1A1A]"
                  >
                    <td className="py-3.5 px-4 font-bold text-[#1A1A1A]">
                      {ord?.order_number || comm.order_id}
                    </td>
                    <td className="py-3.5 px-4 text-[#1A1A1A] font-semibold">
                      {ord ? formatPKR(ord.total_amount) : "—"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#E63946]">
                      {comm.amount ? formatPKR(comm.amount) : "Pending"}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#666666]">
                      {comm.admin_note || "Standard Referral"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          comm.status === "paid"
                            ? "bg-[#D4EDDA] text-[#155724]"
                            : comm.status === "approved"
                            ? "bg-[#D1ECF1] text-[#0C5460]"
                            : "bg-[#FFF3CD] text-[#856404]"
                        }`}
                      >
                        {comm.status}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCommissionPage;
