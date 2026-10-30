import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDataStore } from "../../store/dataStore";
import { OrderStatus } from "../../types";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";

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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Orders Management ({filtered.length})
          </h1>
          <p className="text-xs text-[#4A4A4A]">
            Verify digital payments, update fulfillment statuses, and inspect referral codes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer name, or phone..."
            className="flex-1 h-10 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by order status"
            className="h-10 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
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

        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Total</th>
                  <th className="py-3.5 px-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F5F4F0] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#C9A84C]">
                      {ord.order_number}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">
                      <p className="font-semibold">{ord.customer_name}</p>
                      <p className="text-[11px] font-mono text-[#4A4A4A]">
                        {ord.customer_phone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#4A4A4A]">
                      {ord.delivery_city}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[#4A4A4A]">
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
                        className="h-8 px-2 rounded bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#C9A84C]">
                      {formatPKR(ord.total_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="font-semibold text-[#C9A84C] hover:underline"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
