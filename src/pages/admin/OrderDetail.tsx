import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { OrderStatus, PaymentStatus } from "../../types";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants } from "../../lib/animations";

export const AdminOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orders = useDataStore((s) => s.orders);
  const orderItems = useDataStore((s) => s.orderItems);
  const updateOrderStatus = useDataStore((s) => s.updateOrderStatus);
  const users = useDataStore((s) => s.users);
  const agents = users.filter((u) => u.role === "agent" && u.is_approved && !u.is_blocked);

  const order = orders.find((o) => o.id === id) || orders[0];
  const items = orderItems.filter((i) => i.order_id === order?.id);

  const [status, setStatus] = useState<OrderStatus>(order?.status || "pending");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    order?.payment_status || "pending"
  );
  const [adminNote, setAdminNote] = useState(order?.admin_note || "");
  const [selectedAgentId, setSelectedAgentId] = useState(order?.agent_id || "");
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [agentMessage, setAgentMessage] = useState("");

  if (!order) return null;


  const handleSaveAgent = async () => {
    if (!isSupabaseConfigured) {
      setAgentMessage("Database connection is not configured.");
      return;
    }
    setIsSavingAgent(true);
    setAgentMessage("");
    try {
      const { data, error } = await supabase.rpc("admin_set_order_agent", {
        p_order_id: order.id,
        p_agent_id: selectedAgentId || null,
      });
      if (error) throw error;
      useDataStore.setState((state) => ({
        orders: state.orders.map((item) => item.id === order.id ? {
          ...item,
          agent_id: data?.agent_id ?? null,
          referral_code: data?.referral_code ?? null,
          updated_at: data?.updated_at ?? item.updated_at,
        } : item),
        commissions: selectedAgentId
          ? state.commissions.some((commission) => commission.order_id === order.id)
            ? state.commissions.map((commission) => commission.order_id === order.id
                ? { ...commission, agent_id: selectedAgentId, amount: Math.round(order.subtotal * 0.1 * 100) / 100, status: commission.status === "paid" ? "paid" : "pending", admin_note: "Assigned manually by admin" }
                : commission)
            : [{ id: `commission-${order.id}`, order_id: order.id, agent_id: selectedAgentId, amount: Math.round(order.subtotal * 0.1 * 100) / 100, status: "pending", admin_note: "Assigned manually by admin", paid_at: null, created_at: new Date().toISOString() }, ...state.commissions]
          : state.commissions.map((commission) => commission.order_id === order.id && commission.status !== "paid"
              ? { ...commission, status: "cancelled" }
              : commission),
      }));
      setAgentMessage(selectedAgentId ? "Agent assigned and commission linked." : "Agent removed from this order.");
    } catch (err) {
      setAgentMessage(err instanceof Error ? err.message : "Could not update agent assignment.");
    } finally {
      setIsSavingAgent(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderStatus(order.id, status, paymentStatus, adminNote);
  };

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
          title={`Order ${order.order_number}`}
          subtitle="Manage order status & payment verification"
          icon={<ShoppingBag className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Orders", to: "/admin/orders" },
            { label: order.order_number },
          ]}
          actions={
            <Link
              to="/admin/orders"
              className="px-3.5 py-2 rounded-[6px] bg-[#E63946] text-xs font-semibold text-[#FFFFFF] flex items-center gap-1.5 hover:bg-[#C1121F] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Orders</span>
            </Link>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleSave}
            className="lg:col-span-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs"
          >
            <h2 className="text-base font-serif-display font-bold text-[#1A1A1A]">
              Fulfillment & Payment Verification
            </h2>

            <div className="space-y-1">
              <label htmlFor="ao-status" className="text-xs font-medium text-[#1A1A1A]">
                Order Status
              </label>
              <select
                id="ao-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
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
              <label htmlFor="ao-pay" className="text-xs font-medium text-[#1A1A1A]">
                Payment Verification ({order.payment_method.toUpperCase()})
              </label>
              <select
                id="ao-pay"
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(e.target.value as PaymentStatus)
                }
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
              >
                <option value="pending">Pending Verification</option>
                <option value="verified">Verified</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {order.transaction_id && (
              <div className="p-3 rounded-[6px] bg-[#F5F5F5] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] font-bold">
                Customer Transaction Reference: <span className="text-[#E63946]">{order.transaction_id}</span>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="ao-note" className="text-xs font-medium text-[#1A1A1A]">
                Admin Internal Note
              </label>
              <textarea
                id="ao-note"
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full p-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
              />
            </div>

            <button
              type="submit"
              className="h-10 px-5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs flex items-center gap-2 hover:bg-[#C1121F] transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Update Order & Sync Commission</span>
            </button>
          </form>

          <div className="lg:col-span-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-serif-display font-bold text-[#1A1A1A]">
              Agent Assignment (Admin Only)
            </h2>
            <p className="text-xs text-[#666666]">Customer ko koi referral code enter nahi karna hota. Is order ke liye agent yahan se assign ya remove karein.</p>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
            >
              <option value="">No agent assigned</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.full_name} — {agent.referral_code || "No code"}</option>
              ))}
            </select>
            <button
              type="button"
              disabled={isSavingAgent || selectedAgentId === (order.agent_id || "")}
              onClick={handleSaveAgent}
              className="h-10 px-5 rounded-[6px] bg-[#1A1A1A] text-[#FFFFFF] font-semibold text-xs disabled:opacity-50"
            >
              {isSavingAgent ? "Saving..." : selectedAgentId ? "Assign Agent" : "Remove Agent"}
            </button>
            {agentMessage && <p className="text-xs text-[#666666]" role="status">{agentMessage}</p>}
          </div>

          <div className="lg:col-span-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-serif-display font-bold text-[#1A1A1A]">
              Customer & Items Breakdown
            </h2>
            <div className="text-xs text-[#666666] space-y-1.5">
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
                <span className="font-mono font-bold text-[#E63946]">
                  {order.referral_code || "None"}
                </span>
              </p>
            </div>

            <div className="border-t border-[#E0E0E0] pt-4 space-y-2 text-xs font-mono tabular-nums">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-[#1A1A1A]">
                  <span>
                    {item.product_name_en} ({item.size}) × {item.quantity}
                  </span>
                  <span className="font-bold">{formatPKR(item.unit_price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-[#666666] pt-2 border-t border-[#E0E0E0]">
                <span>Delivery ({order.delivery_city})</span>
                <span className="text-[#1A1A1A] font-semibold">{formatPKR(order.delivery_charge)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1A1A1A]">
                <span>Total Amount</span>
                <span className="text-[#E63946]">{formatPKR(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminOrderDetail;
