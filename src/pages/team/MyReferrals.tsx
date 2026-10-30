import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { TeamSidebar } from "../../components/layout/TeamSidebar";

export const MyReferralsPage: React.FC = () => {
  const { user } = useAuth();
  const orders = useDataStore((s) => s.orders);
  const commissions = useDataStore((s) => s.commissions);

  const agentId = user?.role === "agent" ? user.id : "user-agent-1";
  const referralCode = user?.referral_code || "RTS-ALI123";

  const myOrders = orders.filter(
    (o) => o.agent_id === agentId || o.referral_code === referralCode
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      <TeamSidebar />

      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            My Referrals ({myOrders.length})
          </h1>
          <p className="text-xs text-[#4A4A4A] mt-1">
            All customer orders placed using your referral code <strong className="font-mono text-[#C9A84C]">{referralCode}</strong>.
          </p>
        </div>

        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Order Amount</th>
                  <th className="py-3.5 px-4 text-right">Commission</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {myOrders.map((ord) => {
                  const comm = commissions.find((c) => c.order_id === ord.id);
                  return (
                    <tr key={ord.id} className="hover:bg-[#F5F4F0]">
                      <td className="py-3.5 px-4 font-semibold text-[#C9A84C]">
                        {ord.order_number}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">
                        {ord.customer_name}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-[#4A4A4A]">
                        {ord.delivery_city}
                      </td>
                      <td className="py-3.5 px-4 text-[#4A4A4A]">
                        {new Date(ord.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#1A1A1A]">
                        {formatPKR(ord.total_amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-[#16A34A]">
                        {comm?.amount ? formatPKR(comm.amount) : "To Be Set"}
                      </td>
                      <td className="py-3.5 px-4 text-right uppercase font-semibold text-[#1A1A1A]">
                        {comm?.status || "pending"}
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
