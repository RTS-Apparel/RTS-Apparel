import React, { useState } from "react";
import { Check, X, Ban, Unlock } from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";

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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
              Partner Team Members
            </h1>
            <p className="text-xs text-[#4A4A4A]">
              Approve pending agent signups, generate referral codes, or suspend accounts.
            </p>
          </div>

          <div className="flex gap-1.5 p-1 rounded-lg bg-[#FAFAFA] border border-[#E8E0D0]">
            <button
              type="button"
              onClick={() => setTab("pending")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                tab === "pending"
                  ? "bg-[#C9A84C] text-[#1A1A1A]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A]"
              }`}
            >
              Pending Approval ({pendingAgents.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("active")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                tab === "active"
                  ? "bg-[#C9A84C] text-[#1A1A1A]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A]"
              }`}
            >
              Active ({activeAgents.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("blocked")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                tab === "blocked"
                  ? "bg-[#C9A84C] text-[#1A1A1A]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A]"
              }`}
            >
              Blocked ({blockedAgents.length})
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3.5 px-4">Agent Name</th>
                  <th className="py-3.5 px-4">Phone / Email</th>
                  <th className="py-3.5 px-4">Referral Code</th>
                  <th className="py-3.5 px-4 text-right">Referrals</th>
                  <th className="py-3.5 px-4 text-right">Commission</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {currentList.map((ag) => {
                  const agComms = commissions.filter(
                    (c) => c.agent_id === ag.id
                  );
                  const totalComm = agComms.reduce(
                    (s, c) => s + (c.amount || 0),
                    0
                  );
                  return (
                    <tr key={ag.id} className="hover:bg-[#F5F4F0] transition-colors">
                      <td className="py-3.5 px-4 font-sans">
                        <p className="font-semibold text-[#1A1A1A]">
                          {ag.full_name}
                        </p>
                        {ag.join_reason && (
                          <p className="text-[11px] text-[#4A4A4A]">
                            Note: {ag.join_reason}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#4A4A4A]">
                        {ag.phone} · {ag.email}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#9B7B2F]">
                        {ag.referral_code || "Pending Approval"}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#1A1A1A]">
                        {agComms.length}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-[#16A34A]">
                        {formatPKR(totalComm)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        {tab === "pending" && (
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => approveAgent(ag.id)}
                              className="px-3 py-1.5 rounded bg-[#16A34A] text-white font-semibold text-xs flex items-center gap-1 hover:bg-[#15803D]"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectAgent(ag.id)}
                              className="px-3 py-1.5 rounded bg-red-50 border border-red-200 text-red-600 font-semibold text-xs flex items-center gap-1 hover:bg-red-100"
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
                            className="px-3 py-1.5 rounded bg-red-50 border border-red-200 text-red-600 font-semibold text-xs inline-flex items-center gap-1 hover:bg-red-100"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Block Agent</span>
                          </button>
                        )}
                        {tab === "blocked" && (
                          <button
                            type="button"
                            onClick={() => toggleBlockAgent(ag.id)}
                            className="px-3 py-1.5 rounded bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs inline-flex items-center gap-1 hover:bg-[#E2C07A]"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Unblock</span>
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
