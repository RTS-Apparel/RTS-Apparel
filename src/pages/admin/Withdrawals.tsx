import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";

export const AdminWithdrawals: React.FC = () => {
  const withdrawalRequests = useDataStore((s) => s.withdrawalRequests);
  const users = useDataStore((s) => s.users);
  const markWithdrawalPaid = useDataStore((s) => s.markWithdrawalPaid);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Agent Withdrawal Requests
          </h1>
          <p className="text-xs text-[#4A4A4A]">
            Verify partner JazzCash, EasyPaisa, or IBAN details and mark payouts as paid.
          </p>
        </div>

        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3.5 px-4">Agent</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Account Details</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {withdrawalRequests.map((req) => {
                  const agent = users.find((u) => u.id === req.agent_id);
                  return (
                    <tr key={req.id} className="hover:bg-[#F5F4F0] transition-colors">
                      <td className="py-3.5 px-4 font-sans font-semibold text-[#1A1A1A]">
                        {agent?.full_name || "Agent"}
                      </td>
                      <td className="py-3.5 px-4 uppercase font-bold text-[#9B7B2F]">
                        {req.payment_method}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">
                        {req.account_details}
                      </td>
                      <td className="py-3.5 px-4 text-[#4A4A4A]">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#C9A84C]">
                        {formatPKR(req.amount)}
                      </td>
                      <td className="py-3.5 px-4 uppercase font-semibold text-[#16A34A]">
                        {req.status}
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        {req.status === "pending" ? (
                          <button
                            type="button"
                            onClick={() => markWithdrawalPaid(req.id)}
                            className="px-3 py-1.5 rounded bg-[#16A34A] text-white font-semibold text-xs inline-flex items-center gap-1 hover:bg-[#15803D]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark as Paid</span>
                          </button>
                        ) : (
                          <span className="text-[#9A9A9A] font-medium">Completed</span>
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
