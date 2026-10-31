import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AccountSidebar } from "../../components/layout/AccountSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge";
import { pageVariants } from "../../lib/animations";

export const AccountOrders: React.FC = () => {
  const orders = useDataStore((s) => s.orders);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((o) =>
    statusFilter === "all" ? true : o.status === statusFilter
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

      <div className="flex-1 space-y-6">
        <PageHeading
          title="My Orders"
          subtitle="Track all your purchases"
          icon={<ShoppingBag size={22} />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Account", to: "/account" },
            { label: "My Orders" },
          ]}
        />

        <div className="flex flex-wrap gap-1.5">
          {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-[6px] text-xs capitalize transition-colors font-semibold ${
                  statusFilter === st
                    ? "bg-[#E63946] text-[#FFFFFF]"
                    : "bg-[#FFFFFF] border border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946] hover:text-[#E63946]"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-16 px-6 text-center rounded-[8px] bg-[#F5F5F5] border border-[#E0E0E0] flex flex-col items-center justify-center space-y-3">
            <ShoppingBag size={64} className="text-[#999999]" />
            <p className="text-base text-[#666666]">No orders found matching this filter.</p>
          </div>
        ) : (
          <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                    <th className="py-3.5 px-4">Order Number</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">City</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-4 text-right">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                  {filteredOrders.map((order, idx) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[#FFFFFF] text-[#1A1A1A]"
                    >
                      <td className="py-3.5 px-4 font-bold text-[#1A1A1A]">
                        {order.order_number}
                      </td>
                      <td className="py-3.5 px-4 text-[#666666]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">
                        {order.delivery_city}
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[#666666]">
                        {order.payment_method}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#E63946]">
                        {formatPKR(order.total_amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <Link
                          to={`/account/orders/${order.id}`}
                          className="text-[#E63946] font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <Eye size={15} />
                          <span>View Timeline</span>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AccountOrders;
