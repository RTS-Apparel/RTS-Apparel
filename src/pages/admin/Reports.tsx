import React, { useState } from "react";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import {
  pageVariants,
  statCardVariants,
  CountUpNumber,
} from "../../lib/animations";

export const AdminReports: React.FC = () => {
  const orders = useDataStore((s) => s.orders);
  const users = useDataStore((s) => s.users);
  const products = useDataStore((s) => s.products);
  const commissions = useDataStore((s) => s.commissions);

  const [tab, setTab] = useState<"sales" | "agents" | "products">("sales");

  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = validOrders.reduce((s, o) => s + o.total_amount, 0);
  const avgOrderValue =
    validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  const agents = users.filter((u) => u.role === "agent" && u.is_approved);

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
          title="Reports"
          subtitle="Sales and performance insights"
          icon={<BarChart3 className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Reports" },
          ]}
          actions={
            <div className="flex gap-1.5 p-1 rounded-[6px] bg-[#2A2A2A] border border-[#333333]">
              <button
                type="button"
                onClick={() => setTab("sales")}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-colors ${
                  tab === "sales"
                    ? "bg-[#E63946] text-[#FFFFFF]"
                    : "text-[#CCCCCC] hover:text-[#FFFFFF]"
                }`}
              >
                Sales Report
              </button>
              <button
                type="button"
                onClick={() => setTab("agents")}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-colors ${
                  tab === "agents"
                    ? "bg-[#E63946] text-[#FFFFFF]"
                    : "text-[#CCCCCC] hover:text-[#FFFFFF]"
                }`}
              >
                Agent Leaderboard
              </button>
              <button
                type="button"
                onClick={() => setTab("products")}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-colors ${
                  tab === "products"
                    ? "bg-[#E63946] text-[#FFFFFF]"
                    : "text-[#CCCCCC] hover:text-[#FFFFFF]"
                }`}
              >
                Top Products
              </button>
            </div>
          }
        />

        {tab === "sales" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
              <motion.div
                custom={0}
                variants={statCardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] shadow-xs"
              >
                <p className="text-xs font-sans text-[#666666]">Gross Revenue</p>
                <p className="text-[24px] font-bold text-[#1A1A1A] mt-1">
                  <CountUpNumber value={totalRevenue} prefix="Rs. " />
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
                <p className="text-xs font-sans text-[#666666]">Completed & Active Orders</p>
                <p className="text-[24px] font-bold text-[#1A1A1A] mt-1">
                  <CountUpNumber value={validOrders.length} />
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
                <p className="text-xs font-sans text-[#666666]">Average Order Value</p>
                <p className="text-[24px] font-bold text-[#1A1A1A] mt-1">
                  <CountUpNumber value={avgOrderValue} prefix="Rs. " />
                </p>
              </motion.div>
            </div>
          </div>
        )}

        {tab === "agents" && (
          <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">Agent Name</th>
                  <th className="py-3.5 px-4">Referral Code</th>
                  <th className="py-3.5 px-4 text-right">Orders Referred</th>
                  <th className="py-3.5 px-4 text-right">Total Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {agents.map((ag, idx) => {
                  const agComms = commissions.filter((c) => c.agent_id === ag.id);
                  const sumComm = agComms.reduce((s, c) => s + (c.amount || 0), 0);
                  return (
                    <motion.tr
                      key={ag.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[#FFFFFF] text-[#1A1A1A]"
                    >
                      <td className="py-3.5 px-4 font-bold text-[#E63946]">#{idx + 1}</td>
                      <td className="py-3.5 px-4 font-sans font-bold text-[#1A1A1A]">
                        {ag.full_name}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#E63946]">
                        {ag.referral_code}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#1A1A1A] font-semibold">
                        {agComms.length}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#E63946]">
                        {formatPKR(sumComm)}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "products" && (
          <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-right">Remaining Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {products.map((prod, idx) => (
                  <motion.tr
                    key={prod.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#FFFFFF] text-[#1A1A1A]"
                  >
                    <td className="py-3.5 px-4 font-sans font-bold text-[#1A1A1A]">
                      {prod.name_en}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#E63946]">
                      {formatPKR(prod.price)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#1A1A1A] font-semibold">
                      {prod.stock}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminReports;
