import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { OrderStatus, PaymentStatus } from "../../types";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";

export const AdminOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orders = useDataStore((s) => s.orders);
  const orderItems = useDataStore((s) => s.orderItems);
  const updateOrderStatus = useDataStore((s) => s.updateOrderStatus);

  const order = orders.find((o) => o.id === id) || orders[0];
  const items = orderItems.filter((i) => i.order_id === order?.id);

  const [status, setStatus] = useState<OrderStatus>(order?.status || "pending");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    order?.payment_status || "pending"
  );
  const [adminNote, setAdminNote] = useState(order?.admin_note || "");

  if (!order) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderStatus(order.id, status, paymentStatus, adminNote);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-[#C9A84C] flex items-center gap-1 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders</span>
          </Link>
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A] mt-2">
            Manage Order {order.order_number}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleSave}
            className="lg:col-span-6 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 shadow-sm"
          >
            <h2 className="text-base font-serif-display font-bold text-[#1A1A1A]">
              Fulfillment & Payment Verification
            </h2>

            <div className="space-y-1">
              <label htmlFor="ao-status" className="text-xs font-medium text-[#4A4A4A]">
                Order Status
              </label>
              <select
                id="ao-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled (Cancels Commission)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="ao-pay" className="text-xs font-medium text-[#4A4A4A]">
                Payment Verification ({order.payment_method.toUpperCase()})
              </label>
              <select
                id="ao-pay"
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(e.target.value as PaymentStatus)
                }
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
              >
                <option value="pending">Pending Verification</option>
                <option value="verified">Verified</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {order.transaction_id && (
              <div className="p-3 rounded-lg bg-[#F5F4F0] border border-[#C9A84C]/50 text-xs font-mono text-[#9B7B2F] font-semibold">
                Customer Transaction Reference: {order.transaction_id}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="ao-note" className="text-xs font-medium text-[#4A4A4A]">
                Admin Internal Note
              </label>
              <textarea
                id="ao-note"
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs flex items-center gap-2 hover:bg-[#E2C07A]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Update Order & Sync Commission</span>
            </button>
          </form>

          <div className="lg:col-span-6 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-serif-display font-bold text-[#1A1A1A]">
              Customer & Items Breakdown
            </h2>
            <div className="text-xs text-[#4A4A4A] space-y-1.5">
              <p>
                <strong className="text-[#1A1A1A]">Customer:</strong>{" "}
                {order.customer_name} ({order.customer_phone})
              </p>
              <p>
                <strong className="text-[#1A1A1A]">Address:</strong>{" "}
                {order.delivery_address}, {order.delivery_city}
              </p>
              <p>
                <strong className="text-[#1A1A1A]">Referral Code:</strong>{" "}
                <span className="font-mono font-bold text-[#9B7B2F]">
                  {order.referral_code || "None"}
                </span>
              </p>
            </div>

            <div className="border-t border-[#E8E0D0] pt-4 space-y-2 text-xs font-mono tabular-nums">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-[#1A1A1A]">
                  <span>
                    {item.product_name_en} ({item.size}) × {item.quantity}
                  </span>
                  <span className="font-semibold">{formatPKR(item.unit_price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-[#4A4A4A] pt-2 border-t border-[#E8E0D0]">
                <span>Delivery ({order.delivery_city})</span>
                <span>{formatPKR(order.delivery_charge)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#C9A84C]">
                <span>Total Amount</span>
                <span>{formatPKR(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
