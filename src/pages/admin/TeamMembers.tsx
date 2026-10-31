import React, { useState } from "react";
import { Check, X, Ban, Unlock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants } from "../../lib/animations";

export const AdminTeamMembers: React.FC = () => {
  const users = useDataStore((s) => s.users);
  const commissions = useDataStore((s) => s.commissions);
  const approveAgent = useDataStore((s) => s.approveAgent);
  const rejectAgent = useDataStore((s) => s.rejectAgent);
  const toggleBlockAgent = useDataStore((s) => s.toggleBlockAgent);

  const [tab, setTab] = useState<"pending" | "active" | "blocked">("active");

  const agents = users.filter((u) => u.role === "agent");
  const pendingAgents = agents.filter((a) => !a.is_approved && !a.is_blocked);
  const activeAgents = agents.filter((a) => a.is_approved && !a.is_blocked);
  const blockedAgents = agents.filter((a) => a.is_blocked);

  const currentList =
    tab === "pending"
      ? pendingAgents
      : tab === "active"
      ? activeAgents
      : blockedAgents;

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
          title="Team Members"
          subtitle="Manage your agent network"
          icon={<Users className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Team Members" },
          ]}
          actions={
            <div className="flex gap-1.5 p-1 rounded-[6px] bg-[#2A2A2A] border border-[#333333]">
              <button
                type="button"
                onClick={() => setTab("pending")}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-colors ${
                  tab === "pending"
                    ? "bg-[#E63946] text-[#FFFFFF]"
                    : "text-[#CCCCCC] hover:text-[#FFFFFF]"
                }`}
              >
                Pending ({pendingAgents.length})
              </button>
              <button
                type="button"
                onClick={() => setTab("active")}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-colors ${
                  tab === "active"
                    ? "bg-[#E63946] text-[#FFFFFF]"
                    : "text-[#CCCCCC] hover:text-[#FFFFFF]"
                }`}
              >
                Active ({activeAgents.length})
              </button>
              <button
                type="button"
                onClick={() => setTab("blocked")}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-colors ${
                  tab === "blocked"
                    ? "bg-[#E63946] text-[#FFFFFF]"
                    : "text-[#CCCCCC] hover:text-[#FFFFFF]"
                }`}
              >
                Blocked ({blockedAgents.length})
              </button>
            </div>
          }
        />

        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Agent Name</th>
                  <th className="py-3.5 px-4">Phone / Email</th>
                  <th className="py-3.5 px-4">Referral Code</th>
                  <th className="py-3.5 px-4 text-right">Referrals</th>
                  <th className="py-3.5 px-4 text-right">Commission</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {currentList.map((ag, idx) => {
                  const agComms = commissions.filter(
                    (c) => c.agent_id === ag.id
                  );
                  const referralsCount =
                    ag.total_referrals !== undefined
                      ? ag.total_referrals
                      : agComms.length;
                  const totalComm =
                    ag.total_commission_earned !== undefined
                      ? ag.total_commission_earned
                      : agComms.reduce((s, c) => s + (c.amount || 0), 0);
                  return (
                    <motion.tr
                      key={ag.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[#FFFFFF] text-[#1A1A1A]"
                    >
                      <td className="py-3.5 px-4 font-sans">
                        <p className="font-bold text-[#1A1A1A]">
                          {ag.full_name}
                        </p>
                        {ag.join_reason && (
                          <p className="text-[11px] text-[#666666]">
                            Note: {ag.join_reason}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#666666]">
                        {ag.phone} {ag.email ? `· ${ag.email}` : ""}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#E63946]">
                        {ag.referral_code || "Pending Approval"}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#1A1A1A] font-semibold">
                        {referralsCount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#E63946]">
                        {formatPKR(totalComm)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        {tab === "pending" && (
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => approveAgent(ag.id)}
                              className="px-3 py-1.5 rounded-[4px] bg-[#22C55E] text-[#FFFFFF] font-semibold text-xs flex items-center gap-1 hover:opacity-90"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectAgent(ag.id)}
                              className="px-3 py-1.5 rounded-[4px] bg-[#C1121F] text-[#FFFFFF] font-semibold text-xs flex items-center gap-1 hover:bg-[#E63946]"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                        {tab === "active" && (
                          <button
                            type="button"
                            onClick={() => toggleBlockAgent(ag.id)}
                            className="px-3 py-1.5 rounded-[4px] bg-[#C1121F] text-[#FFFFFF] font-semibold text-xs inline-flex items-center gap-1 hover:bg-[#E63946]"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Block Agent</span>
                          </button>
                        )}
                        {tab === "blocked" && (
                          <button
                            type="button"
                            onClick={() => toggleBlockAgent(ag.id)}
                            className="px-3 py-1.5 rounded-[4px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs inline-flex items-center gap-1 hover:bg-[#C1121F]"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Unblock</span>
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

export default AdminTeamMembers;
