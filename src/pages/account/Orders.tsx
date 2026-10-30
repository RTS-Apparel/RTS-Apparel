import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AccountSidebar } from "../../components/layout/AccountSidebar";

export const AccountOrders: React.FC = () => {
  const orders = useDataStore((s) => s.orders);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((o) =>
    statusFilter === "all" ? true : o.status === statusFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      <AccountSidebar />

      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Order History
          </h1>

          <div className="flex flex-wrap gap-1.5">
            {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                    statusFilter === st
                      ? "bg-[#C9A84C] text-[#1A1A1A] font-semibold"
                      : "bg-[#FAFAFA] border border-[#E8E0D0] text-[#4A4A4A]"
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
        </div>

        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                  <th className="py-3.5 px-4">Order Number</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F5F4F0]">
                    <td className="py-3.5 px-4 font-semibold text-[#C9A84C]">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-4 text-[#4A4A4A]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#1A1A1A]">
                      {order.delivery_city}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[#4A4A4A]">
                      {order.payment_method}
                    </td>
                    <td className="py-3.5 px-4 uppercase font-semibold text-[#1A1A1A]">
                      {order.status}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[#C9A84C]">
                      {formatPKR(order.total_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="text-[#C9A84C] font-semibold hover:underline"
                      >
                        View Timeline →
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
