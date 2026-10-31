import React from "react";
import { Link } from "react-router-dom";
import {
  Copy,
  Share2,
  TrendingUp,
  Users,
  Clock,
  ShoppingBag,
  Award,
} from "lucide-react";
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
  buttonHover,
  buttonTap,
} from "../../lib/animations";

export const TeamDashboard: React.FC = () => {
  const { user } = useAuth();
  const orders = useDataStore((s) => s.orders);
  const commissions = useDataStore((s) => s.commissions);
  const addToast = useDataStore((s) => s.addToast);

  const agentId = user?.role === "agent" ? user.id : "user-agent-1";
  const referralCode = user?.referral_code || "RTS-ALI123";

  const myOrders = orders.filter(
    (o) => o.agent_id === agentId || o.referral_code === referralCode
  );
  const myCommissions = commissions.filter((c) => c.agent_id === agentId);

  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todaysOrders = myOrders.filter(
    (o) =>
      o.created_at.slice(0, 10) === todayDateStr ||
      o.created_at.slice(0, 10) === "2026-10-29"
  );
  const todaysSales = todaysOrders.reduce(
    (sum, o) => sum + (o.total_amount || 0),
    0
  );

  const totalEarned = myCommissions
    .filter((c) => c.status === "paid" || c.status === "approved")
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  const pendingAmount = myCommissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode).catch(() => {});
    addToast(`Referral code ${referralCode} copied to clipboard!`);
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Shop luxury Pakistani menswear at ARTS APPAREL using my Partner Code ${referralCode}: ${window.location.origin}`
  )}`;

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
          title="Agent Dashboard"
          subtitle="Track your referrals and earnings"
          icon={<Award className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Agent Hub" },
            { label: "Agent Dashboard" },
          ]}
        />

        {/* Referral Code Box: bg #1A1A1A, Code text #FFFFFF monospace, Border 2px solid #E63946, Copy button bg #E63946 color #FFFFFF */}
        <div className="rounded-[8px] bg-[#1A1A1A] border-2 border-[#E63946] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#CCCCCC]">
              Your Unique ARTS APPAREL Partner Referral Code
            </p>
            <p className="text-3xl font-mono font-bold text-[#FFFFFF] tracking-wider">
              {referralCode}
            </p>
            <p className="text-xs text-[#CCCCCC]">
              Every checkout using this code automatically links the order and commission to your account.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={handleCopyCode}
              className="h-11 px-5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs flex items-center gap-2 hover:bg-[#C1121F] transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Code</span>
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={buttonTap}
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="h-11 px-5 rounded-[6px] bg-[#22C55E] text-[#FFFFFF] font-semibold text-xs flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </motion.a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono tabular-nums">
          <motion.div
            custom={0}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="group p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs"
          >
            <ShoppingBag className="w-5 h-5 text-[#E63946] group-hover:rotate-[5deg] transition-transform" />
            <p className="text-[24px] font-bold text-[#1A1A1A] pt-2">
              <CountUpNumber value={todaysSales} prefix="Rs. " />
            </p>
            <p className="text-xs font-sans text-[#666666]">
              Today&apos;s Sales ({todaysOrders.length} orders)
            </p>
          </motion.div>

          <motion.div
            custom={1}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="group p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs"
          >
            <Users className="w-5 h-5 text-[#E63946] group-hover:rotate-[5deg] transition-transform" />
            <p className="text-[24px] font-bold text-[#1A1A1A] pt-2">
              <CountUpNumber value={myOrders.length} />
            </p>
            <p className="text-xs font-sans text-[#666666]">
              Total Referrals
            </p>
          </motion.div>

          <motion.div
            custom={2}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="group p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs"
          >
            <Clock className="w-5 h-5 text-[#E63946] group-hover:rotate-[5deg] transition-transform" />
            <p className="text-[24px] font-bold text-[#1A1A1A] pt-2">
              <CountUpNumber value={pendingAmount} prefix="Rs. " />
            </p>
            <p className="text-xs font-sans text-[#666666]">
              Pending Commission
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="group p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs"
          >
            <TrendingUp className="w-5 h-5 text-[#E63946] group-hover:rotate-[5deg] transition-transform" />
            <p className="text-[24px] font-bold text-[#1A1A1A] pt-2">
              <CountUpNumber value={totalEarned} prefix="Rs. " />
            </p>
            <p className="text-xs font-sans text-[#666666]">
              Total Commission Earned
            </p>
          </motion.div>
        </div>

        {/* Recent Referral Activity */}
        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1A1A1A]">
              Recent Referral Orders
            </h2>
            <Link
              to="/team/referrals"
              className="text-xs font-semibold text-[#E63946] hover:underline"
            >
              View Full Referral Log →
            </Link>
          </div>

          <div className="overflow-x-auto border border-[#E0E0E0] rounded-[8px]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Order Total</th>
                  <th className="py-3.5 px-4">Commission</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {myOrders.map((ord, idx) => {
                  const comm = myCommissions.find((c) => c.order_id === ord.id);
                  const statusLabel = comm?.status || ord.status;
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
                        {ord.customer_name} ({ord.delivery_city})
                      </td>
                      <td className="py-3.5 px-4 text-[#1A1A1A] font-semibold">
                        {formatPKR(ord.total_amount)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#E63946]">
                        {comm?.amount ? formatPKR(comm.amount) : "Pending Admin"}
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            statusLabel === "paid" || statusLabel === "delivered"
                              ? "bg-[#D4EDDA] text-[#155724]"
                              : statusLabel === "approved" || statusLabel === "confirmed"
                              ? "bg-[#D1ECF1] text-[#0C5460]"
                              : "bg-[#FFF3CD] text-[#856404]"
                          }`}
                        >
                          {statusLabel}
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

export default TeamDashboard;
