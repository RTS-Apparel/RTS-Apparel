import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { OrderStatus } from "../../types";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants } from "../../lib/animations";

export const AdminOrders: React.FC = () => {
  const orders = useDataStore((s) => s.orders);
  const updateOrderStatus = useDataStore((s) => s.updateOrderStatus);

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
      );
    }
    return true;
  });

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
          title="Orders"
          subtitle="Track and manage all orders"
          icon={<ShoppingBag className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Orders" },
          ]}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer name, or phone..."
            className="flex-1 h-10 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by order status"
            className="h-10 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Total</th>
                  <th className="py-3.5 px-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
                {filtered.map((ord, idx) => (
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
                      <p className="font-bold">{ord.customer_name}</p>
                      <p className="text-[11px] font-mono text-[#666666]">
                        {ord.customer_phone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#666666]">
                      {ord.delivery_city}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[#666666]">
                      {ord.payment_method} ({ord.payment_status})
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <select
                        value={ord.status}
                        aria-label={`Change status for ${ord.order_number}`}
                        onChange={(e) =>
                          updateOrderStatus(
                            ord.id,
                            e.target.value as OrderStatus
                          )
                        }
                        className="h-8 px-2 rounded-[4px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:border-[#E63946]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#E63946]">
                      {formatPKR(ord.total_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="font-semibold text-[#E63946] hover:underline inline-block"
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

export default AdminOrders;
