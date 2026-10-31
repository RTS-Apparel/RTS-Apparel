import React from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, PackageSearch, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../store/dataStore";
import { formatPKR } from "../lib/utils";
import { OrderStatusTimeline } from "../components/common/OrderStatusTimeline";
import { pageVariants } from "../lib/animations";

export const OrderConfirmationPage: React.FC = () => {
  const { id, orderNumber } = useParams<{ id?: string; orderNumber?: string }>();
  const targetRef = id || orderNumber;
  const orders = useDataStore((s) => s.orders);
  const orderItems = useDataStore((s) => s.orderItems);

  const order =
    orders.find((o) => o.id === targetRef || o.order_number === targetRef) ||
    orders[0];
  const items = orderItems.filter((i) => i.order_id === order?.id);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <p className="text-[#666666]">Order not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8"
    >
      <div className="rounded-xl bg-[#FFFFFF] border-2 border-[#E63946] p-6 md:p-8 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0E0E0] pb-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-10 h-10 text-[#22C55E] shrink-0 mt-1" />
            <div>
              <p className="text-xs font-mono font-bold text-[#22C55E] uppercase tracking-wider">
                Order Confirmed · آرڈر بک ہو گیا ہے
              </p>
              <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1A1A1A] mt-1">
                Thank You, {order.customer_name}
              </h1>
              <p className="text-xs text-[#666666] mt-1">
                Order Reference:{" "}
                <strong className="font-mono text-[#E63946]">
                  {order.order_number}
                </strong>
              </p>
            </div>
          </div>

          <Link
            to={`/track?order=${encodeURIComponent(order.order_number)}`}
            className="h-10 px-4 rounded-[6px] border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold text-xs flex items-center gap-2 hover:bg-[#1A1A1A] hover:text-[#FFFFFF] transition-colors whitespace-nowrap self-start"
          >
            <PackageSearch className="w-4 h-4" />
            <span>Track Live Status</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">
              Order Status Timeline
            </h2>
            <OrderStatusTimeline status={order.status} />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">
              Delivery & Payment Summary
            </h2>
            <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E0E0E0] space-y-2 text-xs text-[#666666]">
              <p>
                <strong className="text-[#1A1A1A]">Recipient:</strong>{" "}
                {order.customer_name} ({order.customer_phone})
              </p>
              <p>
                <strong className="text-[#1A1A1A]">City:</strong>{" "}
                {order.delivery_city}
              </p>
              <p>
                <strong className="text-[#1A1A1A]">Address:</strong>{" "}
                {order.delivery_address}
              </p>
              <p>
                <strong className="text-[#1A1A1A]">Payment Method:</strong>{" "}
                <span className="uppercase font-mono font-semibold text-[#E63946]">
                  {order.payment_method}
                </span>{" "}
                ({order.payment_status})
              </p>
              {order.referral_code && (
                <p>
                  <strong className="text-[#1A1A1A]">Partner Code Linked:</strong>{" "}
                  <span className="font-mono font-semibold text-[#E63946]">
                    {order.referral_code}
                  </span>
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E0E0E0] space-y-2 text-xs font-mono tabular-nums">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-[#1A1A1A]"
                >
                  <span>
                    {item.product_name_en} ({item.size}) × {item.quantity}
                  </span>
                  <span>{formatPKR(item.unit_price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-[#E0E0E0] pt-2 flex justify-between text-[#666666]">
                <span>Delivery ({order.delivery_city})</span>
                <span>{formatPKR(order.delivery_charge)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#E63946] pt-1">
                <span>Total Amount</span>
                <span>{formatPKR(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E0E0E0] flex flex-wrap justify-between gap-4">
          <Link
            to="/account/orders"
            className="text-xs text-[#666666] hover:text-[#E63946] font-medium"
          >
            View All Orders in Account →
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#E63946]"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmationPage;
