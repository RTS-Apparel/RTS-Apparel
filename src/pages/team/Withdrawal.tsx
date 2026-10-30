import React, { useState } from "react";
import { Wallet } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { TeamSidebar } from "../../components/layout/TeamSidebar";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0 || !accountDetails.trim()) return;
    requestWithdrawal({
      agent_id: agentId,
      amount: numericAmount,
      payment_method: paymentMethod,
      account_details: accountDetails.trim(),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      <TeamSidebar />

      <div className="flex-1 space-y-8">
        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-[#4A4A4A]">
              Approved Commission Available for Payout
            </p>
            <p className="text-3xl font-mono font-bold text-[#C9A84C] mt-1 tabular-nums">
              {formatPKR(approvedBalance)}
            </p>
          </div>
          <Wallet className="w-10 h-10 text-[#C9A84C]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 h-fit shadow-xs"
          >
            <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
              Request Withdrawal
            </h2>

            <div className="space-y-1">
              <label htmlFor="wd-amount" className="text-xs font-medium text-[#4A4A4A]">
                Withdrawal Amount (PKR) *
              </label>
              <input
                id="wd-amount"
                type="number"
                min={500}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm font-mono text-[#1A1A1A]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="wd-method" className="text-xs font-medium text-[#4A4A4A]">
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
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A]"
              >
                <option value="jazzcash">JazzCash</option>
                <option value="easypaisa">EasyPaisa</option>
                <option value="bank_transfer">Bank Transfer (IBAN)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="wd-acc" className="text-xs font-medium text-[#4A4A4A]">
                Account Title & Number / IBAN *
              </label>
              <textarea
                id="wd-acc"
                rows={2}
                required
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs hover:bg-[#E2C07A]"
            >
              Submit Withdrawal Request
            </button>
          </form>

          <div className="lg:col-span-7 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 shadow-xs">
            <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
              Withdrawal History
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E0D0] text-[#4A4A4A]">
                    <th className="py-3 pr-3">Date</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Account</th>
                    <th className="py-3 pl-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                  {myWithdrawals.map((w) => (
                    <tr key={w.id}>
                      <td className="py-3.5 pr-3 text-[#4A4A4A]">
                        {new Date(w.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#C9A84C]">
                        {formatPKR(w.amount)}
                      </td>
                      <td className="py-3.5 px-3 font-sans text-[#1A1A1A]">
                        {w.account_details}
                      </td>
                      <td className="py-3.5 pl-3 text-right uppercase font-semibold text-[#16A34A]">
                        {w.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
