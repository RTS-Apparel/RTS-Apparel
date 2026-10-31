import React from "react";
import { Link } from "react-router-dom";
import { Package, MapPin, Heart, User, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AccountSidebar } from "../../components/layout/AccountSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge";
import {
  pageVariants,
  statCardVariants,
  CountUpNumber,
} from "../../lib/animations";

export const AccountDashboard: React.FC = () => {
  const { user, switchDemoRole } = useAuth();
  const orders = useDataStore((s) => s.orders);
  const wishlist = useDataStore((s) => s.wishlist);
  const allAddresses = useDataStore((s) => s.addresses);
  const addresses = allAddresses.filter((a) => a.user_id === user?.id);

  const userOrders = orders.filter(
    (o) =>
      o.customer_id === user?.id ||
      o.customer_phone === user?.phone ||
      o.customer_id === "user-customer-1"
  );

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8"
    >
      <AccountSidebar />

      <div className="flex-1 space-y-8">
        <PageHeading
          title="My Account"
          subtitle="Welcome back! 👋"
          icon={<User className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Account" },
            { label: "My Account" },
          ]}
        />

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            custom={0}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link
              to="/account/orders"
              className="group block p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs"
            >
              <Package className="w-5 h-5 text-[#E63946] group-hover:rotate-[5deg] transition-transform" />
              <p className="text-[24px] font-mono font-bold text-[#1A1A1A] pt-2 tabular-nums">
                <CountUpNumber value={userOrders.length} />
              </p>
              <p className="text-xs text-[#666666]">Total Orders</p>
            </Link>
          </motion.div>

          <motion.div
            custom={1}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link
              to="/account/addresses"
              className="group block p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs"
            >
              <MapPin className="w-5 h-5 text-[#E63946] group-hover:rotate-[5deg] transition-transform" />
              <p className="text-[24px] font-mono font-bold text-[#1A1A1A] pt-2 tabular-nums">
                <CountUpNumber value={addresses.length} />
              </p>
              <p className="text-xs text-[#666666]">Saved Addresses</p>
            </Link>
          </motion.div>

          <motion.div
            custom={2}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link
              to="/account/wishlist"
              className="group block p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs"
            >
              <Heart className="w-5 h-5 text-[#E63946] group-hover:rotate-[5deg] transition-transform" />
              <p className="text-[24px] font-mono font-bold text-[#1A1A1A] pt-2 tabular-nums">
                <CountUpNumber value={wishlist.length} />
              </p>
              <p className="text-xs text-[#666666]">Saved Garments</p>
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
              to="/account/profile"
              className="group block p-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-all space-y-1 shadow-xs"
            >
              <User className="w-5 h-5 text-[#E63946] group-hover:rotate-[5deg] transition-transform" />
              <p className="text-base font-bold text-[#1A1A1A] pt-2 truncate">
                {user?.phone || "03058165623"}
              </p>
              <p className="text-xs text-[#666666]">Profile & Security</p>
            </Link>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif-display font-bold text-[#1A1A1A]">
              Recent Orders
            </h2>
            <Link
              to="/account/orders"
              className="text-xs font-semibold text-[#E63946] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto border border-[#E0E0E0] rounded-[8px]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Total</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {userOrders.slice(0, 3).map((ord, idx) => (
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
                    <td className="py-3.5 px-4 text-[#666666]">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">
                      {ord.delivery_city}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#E63946]">
                      {formatPKR(ord.total_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <Link
                        to={`/account/orders/${ord.id}`}
                        className="text-[#E63946] font-semibold hover:underline"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountDashboard;
