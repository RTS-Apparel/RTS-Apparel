import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AccountSidebar } from "../../components/layout/AccountSidebar";
import { OrderStatusTimeline } from "../../components/common/OrderStatusTimeline";
import { LuxuryImage } from "../../components/common/LuxuryImage";

export const AccountOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orders = useDataStore((s) => s.orders);
  const orderItems = useDataStore((s) => s.orderItems);

  const order = orders.find((o) => o.id === id) || orders[0];
  const items = orderItems.filter((i) => i.order_id === order?.id);

  if (!order) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      <AccountSidebar />

      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/account/orders"
              className="text-xs text-[#C9A84C] font-semibold flex items-center gap-1 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Orders</span>
            </Link>
            <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A] mt-2">
              Order {order.order_number}
            </h1>
          </div>
          <span className="font-mono text-xs font-semibold uppercase px-3 py-1 rounded bg-[#FAFAFA] border border-[#C9A84C] text-[#C9A84C]">
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Fulfillment Timeline
            </h2>
            <OrderStatusTimeline status={order.status} />
          </div>

          <div className="lg:col-span-6 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Ordered Garments
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0]"
                >
                  <LuxuryImage
                    src={item.product_image}
                    alt={item.product_name_en}
                    className="w-14 h-14 rounded object-cover border border-[#E8E0D0]"
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-[#1A1A1A]">
                      {item.product_name_en}
                    </p>
                    <p className="text-[#4A4A4A]">
                      Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#C9A84C] tabular-nums">
                    {formatPKR(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E8E0D0] pt-4 space-y-1.5 text-xs font-mono tabular-nums">
              <div className="flex justify-between text-[#4A4A4A]">
                <span>Subtotal</span>
                <span>{formatPKR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#4A4A4A]">
                <span>Delivery ({order.delivery_city})</span>
                <span>{formatPKR(order.delivery_charge)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#C9A84C] pt-2 border-t border-[#E8E0D0]">
                <span>Total</span>
                <span>{formatPKR(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
