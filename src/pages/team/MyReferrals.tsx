import React from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { TeamSidebar } from "../../components/layout/TeamSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants } from "../../lib/animations";

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
          title="My Referrals"
          subtitle="Customers you referred"
          icon={<Users className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Agent Hub", to: "/team" },
            { label: "My Referrals" },
          ]}
        />

        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Order Amount</th>
                  <th className="py-3.5 px-4 text-right">Commission</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {myOrders.map((ord, idx) => {
                  const comm = commissions.find((c) => c.order_id === ord.id);
                  const st = comm?.status || "pending";
                  return (
                    <motion.tr
                      key={ord.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[#FFFFFF] text-[#1A1A1A]"
                    >
                      <td className="py-3.5 px-4 font-bold text-[#1A1A1A]">
                        {ord.order_number}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">
                        {ord.customer_name}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-[#666666]">
                        {ord.delivery_city}
                      </td>
                      <td className="py-3.5 px-4 text-[#666666]">
                        {new Date(ord.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#1A1A1A] font-semibold">
                        {formatPKR(ord.total_amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#E63946]">
                        {comm?.amount ? formatPKR(comm.amount) : "To Be Set"}
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            st === "paid"
                              ? "bg-[#D4EDDA] text-[#155724]"
                              : st === "approved"
                              ? "bg-[#D1ECF1] text-[#0C5460]"
                              : "bg-[#FFF3CD] text-[#856404]"
                          }`}
                        >
                          {st}
                        </span>
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

export default MyReferralsPage;
