import React, { useState } from "react";
import { Wallet, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { TeamSidebar } from "../../components/layout/TeamSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import {
  pageVariants,
  CountUpNumber,
  buttonHover,
  buttonTap,
} from "../../lib/animations";

export const TeamWithdrawalPage: React.FC = () => {
  const { user } = useAuth();
  const commissions = useDataStore((s) => s.commissions);
  const withdrawalRequests = useDataStore((s) => s.withdrawalRequests);
  const requestWithdrawal = useDataStore((s) => s.requestWithdrawal);

  const agentId = user?.role === "agent" ? user.id : "user-agent-1";
  const myCommissions = commissions.filter((c) => c.agent_id === agentId);
  const myWithdrawals = withdrawalRequests.filter((w) => w.agent_id === agentId);

  const approvedBalance = myCommissions
    .filter((c) => c.status === "approved")
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  const [amount, setAmount] = useState<string>(String(approvedBalance || 1500));
  const [paymentMethod, setPaymentMethod] = useState<
    "jazzcash" | "easypaisa" | "bank_transfer"
  >(user?.payment_method || "jazzcash");
  const [accountDetails, setAccountDetails] = useState<string>(
    user?.payment_account_details || "JazzCash: 0321-4567890 (Ali Raza Khan)"
  );
  const [submitting, setSubmitting] = useState(false);
  const [submittedOk, setSubmittedOk] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0 || !accountDetails.trim()) return;
    setSubmitting(true);
    setSubmittedOk(false);
    window.setTimeout(() => {
      requestWithdrawal({
        agent_id: agentId,
        amount: numericAmount,
        payment_method: paymentMethod,
        account_details: accountDetails.trim(),
      });
      setSubmitting(false);
      setSubmittedOk(true);
      window.setTimeout(() => setSubmittedOk(false), 2500);
    }, 300);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8"
    >
      <TeamSidebar />

      <div className="flex-1 space-y-8">
        <PageHeading
          title="Withdrawal"
          subtitle="Request your payout"
          icon={<Wallet className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Agent Hub", to: "/team" },
            { label: "Withdrawal" },
          ]}
        />

        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] p-6 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-[#666666]">
              Approved Commission Available for Payout
            </p>
            <p className="text-3xl font-mono font-bold text-[#1A1A1A] mt-1 tabular-nums">
              <CountUpNumber value={approvedBalance} prefix="Rs. " />
            </p>
          </div>
          <Wallet className="w-10 h-10 text-[#E63946]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-5 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 h-fit shadow-xs"
          >
            <h2 className="text-lg font-serif-display font-bold text-[#1A1A1A]">
              Request Withdrawal
            </h2>

            <div className="space-y-1">
              <label htmlFor="wd-amount" className="text-xs font-medium text-[#1A1A1A]">
                Withdrawal Amount (PKR) *
              </label>
              <input
                id="wd-amount"
                type="number"
                min={500}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] text-sm font-mono text-[#1A1A1A] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="wd-method" className="text-xs font-medium text-[#1A1A1A]">
                Payout Channel *
              </label>
              <select
                id="wd-method"
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value as "jazzcash" | "easypaisa" | "bank_transfer"
                  )
                }
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] text-xs text-[#1A1A1A] outline-none"
              >
                <option value="jazzcash">JazzCash</option>
                <option value="easypaisa">EasyPaisa</option>
                <option value="bank_transfer">Bank Transfer (IBAN)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="wd-acc" className="text-xs font-medium text-[#1A1A1A]">
                Account Title & Number / IBAN *
              </label>
              <textarea
                id="wd-acc"
                rows={2}
                required
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                className="w-full p-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] text-xs font-mono text-[#1A1A1A] outline-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={buttonHover}
              whileTap={buttonTap}
              className="w-full h-11 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs hover:bg-[#C1121F] transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>loading...</span>
                </>
              ) : (
                <span>Submit Withdrawal Request</span>
              )}
            </motion.button>

            {submittedOk && (
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                className="text-xs font-semibold text-[#22C55E] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Payout request submitted!</span>
              </motion.p>
            )}
          </form>

          <div className="lg:col-span-7 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
            <h2 className="text-lg font-serif-display font-bold text-[#1A1A1A]">
              Withdrawal History
            </h2>

            <div className="overflow-x-auto border border-[#E0E0E0] rounded-[8px]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Account</th>
                    <th className="py-3.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                  {myWithdrawals.map((w, idx) => (
                    <motion.tr
                      key={w.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[#FFFFFF] text-[#1A1A1A]"
                    >
                      <td className="py-3.5 px-4 text-[#666666]">
                        {new Date(w.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#E63946]">
                        {formatPKR(w.amount)}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">
                        {w.account_details}
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            w.status === "paid"
                              ? "bg-[#D4EDDA] text-[#155724]"
                              : w.status === "rejected"
                              ? "bg-[#F8D7DA] text-[#721C24]"
                              : "bg-[#FFF3CD] text-[#856404]"
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamWithdrawalPage;
