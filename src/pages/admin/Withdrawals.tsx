import React from "react";
import { CheckCircle2, WalletCards } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants } from "../../lib/animations";

export const AdminWithdrawals: React.FC = () => {
  const withdrawalRequests = useDataStore((s) => s.withdrawalRequests);
  const users = useDataStore((s) => s.users);
  const markWithdrawalPaid = useDataStore((s) => s.markWithdrawalPaid);

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
          title="Withdrawals"
          subtitle="Process payout requests"
          icon={<WalletCards className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Withdrawals" },
          ]}
        />

        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Agent</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Account Details</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {withdrawalRequests.map((req, idx) => {
                  const agent = users.find((u) => u.id === req.agent_id);
                  return (
                    <motion.tr
                      key={req.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[#FFFFFF] text-[#1A1A1A]"
                    >
                      <td className="py-3.5 px-4 font-sans font-bold text-[#1A1A1A]">
                        {agent?.full_name || "Agent"}
                      </td>
                      <td className="py-3.5 px-4 uppercase font-bold text-[#E63946]">
                        {req.payment_method}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">
                        {req.account_details}
                      </td>
                      <td className="py-3.5 px-4 text-[#666666]">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#E63946]">
                        {formatPKR(req.amount)}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            req.status === "paid"
                              ? "bg-[#D4EDDA] text-[#155724]"
                              : "bg-[#FFF3CD] text-[#856404]"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        {req.status === "pending" ? (
                          <button
                            type="button"
                            onClick={() => markWithdrawalPaid(req.id)}
                            className="px-3 py-1.5 rounded-[4px] bg-[#22C55E] text-[#FFFFFF] font-semibold text-xs inline-flex items-center gap-1 hover:opacity-90"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark as Paid</span>
                          </button>
                        ) : (
                          <span className="text-[#666666] font-medium">Completed</span>
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

export default AdminWithdrawals;
