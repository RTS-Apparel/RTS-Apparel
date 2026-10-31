import React from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Users,
  UserCheck,
  Package,
  Wallet,
  LayoutDashboard,
  Plus,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge";
import { ADMIN_TRANSLATIONS, getProductName } from "../../lib/i18n";
import {
  pageVariants,
  statCardVariants,
  CountUpNumber,
} from "../../lib/animations";
import { demoDashboardStats } from "../../data/demoData";
import { SetupGuideBanner } from "./SetupGuide";

export const AdminDashboard: React.FC = () => {
  const orders = useDataStore((s) => s.orders);
  const products = useDataStore((s) => s.products);
  const users = useDataStore((s) => s.users);
  const commissions = useDataStore((s) => s.commissions);
  const adminLanguage = useDataStore((s) => s.adminLanguage);

  const t = ADMIN_TRANSLATIONS[adminLanguage];

  const activeAgents = users.filter(
    (u) => u.role === "agent" && u.is_approved && !u.is_blocked
  );

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 bg-[#F5F5F5] rounded-[8px]"
    >
      <AdminSidebar />

      <div className="flex-1 space-y-8">
        <PageHeading
          title="Dashboard"
          subtitle="Welcome back, Admin 👋"
          icon={<LayoutDashboard size={22} />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin" },
            { label: "Dashboard" },
          ]}
          actions={
            <Link
              to="/admin/products/new"
              className="h-10 px-4 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#C1121F] shadow-xs transition-colors"
            >
              <Plus size={16} />
              <span>{t.addProduct}</span>
            </Link>
          }
        />

        {/* Supabase Admin Setup Guide Banner */}
        <SetupGuideBanner />

        {/* Stat Cards from demoDashboardStats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono tabular-nums">
          <motion.div
            custom={0}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="group p-4 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs"
          >
            <TrendingUp size={24} color="#E63946" className="group-hover:rotate-[5deg] transition-transform" />
            <p className="text-[20px] font-bold text-[#1A1A1A] pt-1">
              <CountUpNumber
                value={demoDashboardStats.today_revenue}
                prefix="Rs. "
              />
            </p>
            <p className="text-[11px] font-sans text-[#666666]">
              Today Revenue ({demoDashboardStats.today_orders} orders)
            </p>
          </motion.div>

          <motion.div
            custom={1}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="group p-4 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs"
          >
            <TrendingUp size={24} color="#E63946" className="group-hover:rotate-[5deg] transition-transform" />
            <p className="text-[20px] font-bold text-[#1A1A1A] pt-1">
              <CountUpNumber
                value={demoDashboardStats.total_revenue}
                prefix="Rs. "
              />
            </p>
            <p className="text-[11px] font-sans text-[#666666]">
              {t.totalRevenue}
            </p>
          </motion.div>

          <motion.div
            custom={2}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link
              to="/admin/orders"
              className="group block p-4 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs h-full"
            >
              <ShoppingBag size={24} color="#E63946" className="group-hover:rotate-[5deg] transition-transform" />
              <p className="text-[24px] font-bold text-[#1A1A1A] pt-1">
                <CountUpNumber value={demoDashboardStats.total_orders} />
              </p>
              <p className="text-[11px] font-sans text-[#666666]">
                Total Orders
              </p>
            </Link>
          </motion.div>

          <motion.div
            custom={3}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link
              to="/admin/orders"
              className="group block p-4 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs h-full"
            >
              <Clock size={24} color="#F59E0B" className="group-hover:rotate-[5deg] transition-transform" />
              <p className="text-[24px] font-bold text-[#1A1A1A] pt-1">
                <CountUpNumber value={demoDashboardStats.pending_orders} />
              </p>
              <p className="text-[11px] font-sans text-[#666666]">
                {t.pendingOrders}
              </p>
            </Link>
          </motion.div>

          <motion.div
            custom={4}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link
              to="/admin/team"
              className="group block p-4 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs h-full"
            >
              <UserCheck size={24} color="#E63946" className="group-hover:rotate-[5deg] transition-transform" />
              <p className="text-[24px] font-bold text-[#1A1A1A] pt-1">
                <CountUpNumber
                  value={demoDashboardStats.pending_agent_approvals}
                />
              </p>
              <p className="text-[11px] font-sans text-[#666666]">
                {t.agentApprovals}
              </p>
            </Link>
          </motion.div>

          <motion.div
            custom={5}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link
              to="/admin/withdrawals"
              className="group block p-4 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs h-full"
            >
              <Wallet size={24} color="#E63946" className="group-hover:rotate-[5deg] transition-transform" />
              <p className="text-[24px] font-bold text-[#1A1A1A] pt-1">
                <CountUpNumber value={demoDashboardStats.pending_withdrawals} />
              </p>
              <p className="text-[11px] font-sans text-[#666666]">
                {t.pendingPayouts}
              </p>
            </Link>
          </motion.div>

          <motion.div
            custom={6}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link
              to="/admin/products"
              className="group block p-4 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs h-full"
            >
              <Package size={24} color="#E63946" className="group-hover:rotate-[5deg] transition-transform" />
              <p className="text-[24px] font-bold text-[#1A1A1A] pt-1">
                <CountUpNumber value={products.length || demoDashboardStats.total_products} />
              </p>
              <p className="text-[11px] font-sans text-[#666666]">
                {t.catalogItems}
              </p>
            </Link>
          </motion.div>

          <motion.div
            custom={7}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link
              to="/admin/team"
              className="group block p-4 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs h-full"
            >
              <UserCheck size={24} color="#E63946" className="group-hover:rotate-[5deg] transition-transform" />
              <p className="text-[24px] font-bold text-[#1A1A1A] pt-1">
                <CountUpNumber value={activeAgents.length || demoDashboardStats.active_agents} />
              </p>
              <p className="text-[11px] font-sans text-[#666666]">
                {t.activeAgents}
              </p>
            </Link>
          </motion.div>

          <motion.div
            custom={8}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link
              to="/admin/customers"
              className="group block p-4 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs h-full"
            >
              <Users size={24} color="#E63946" className="group-hover:rotate-[5deg] transition-transform" />
              <p className="text-[24px] font-bold text-[#1A1A1A] pt-1">
                <CountUpNumber value={demoDashboardStats.total_customers} />
              </p>
              <p className="text-[11px] font-sans text-[#666666]">
                Total Customers
              </p>
            </Link>
          </motion.div>
        </div>

        {/* Recent Orders Table from demoOrders */}
        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif-display font-bold text-[#1A1A1A]">
              {t.recentOrders}
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-[#E63946] hover:underline"
            >
              {t.manageAllOrders}
            </Link>
          </div>

          <div className="overflow-x-auto border border-[#E0E0E0] rounded-[8px]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Referral Code</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Total</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {orders.slice(0, 6).map((ord, idx) => (
                  <motion.tr
                    key={ord.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#FFFFFF] text-[#1A1A1A]"
                  >
                    <td className="py-3.5 px-4 font-bold text-[#1A1A1A]">
                      {ord.order_number}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-[#1A1A1A]">
                      {ord.customer_name}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#666666]">
                      {ord.delivery_city}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#E63946]">
                      {ord.referral_code || "—"}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#E63946]">
                      {formatPKR(ord.total_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="font-semibold text-[#E63946] hover:underline inline-flex items-center gap-1"
                      >
                        <Eye size={15} />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Agents (from demoAgents) & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-serif-display font-bold text-[#1A1A1A]">
              {t.topAgents}
            </h2>
            <div className="space-y-3">
              {activeAgents.map((ag) => {
                const agComms = commissions.filter((c) => c.agent_id === ag.id);
                const referralsCount =
                  ag.total_referrals !== undefined
                    ? ag.total_referrals
                    : agComms.length;
                const earned =
                  ag.total_commission_earned !== undefined
                    ? ag.total_commission_earned
                    : agComms.reduce((sum, c) => sum + (c.amount || 0), 0);
                return (
                  <div
                    key={ag.id}
                    className="flex items-center justify-between p-3 rounded-[6px] bg-[#F5F5F5] border border-[#E0E0E0] text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#1A1A1A]">
                        {ag.full_name}
                      </p>
                      <p className="font-mono text-[#666666]">
                        Code:{" "}
                        <span className="text-[#E63946] font-bold">
                          {ag.referral_code}
                        </span>{" "}
                        · {referralsCount} referrals
                      </p>
                    </div>
                    <span className="font-mono font-bold text-[#E63946] tabular-nums">
                      {formatPKR(earned)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-serif-display font-bold text-[#1A1A1A]">
              {t.topProducts}
            </h2>
            <div className="space-y-3">
              {products.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 rounded-[6px] bg-[#F5F5F5] border border-[#E0E0E0] text-xs"
                >
                  <div>
                    <p className="font-bold text-[#1A1A1A]">
                      {getProductName(prod, adminLanguage)}
                    </p>
                    <p className="text-[#666666]">Stock: {prod.stock} units</p>
                  </div>
                  <span className="font-mono font-bold text-[#E63946] tabular-nums">
                    {formatPKR(prod.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
