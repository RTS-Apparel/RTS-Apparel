import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PackageCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AccountSidebar } from "../../components/layout/AccountSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { OrderStatusTimeline } from "../../components/common/OrderStatusTimeline";
import { LuxuryImage } from "../../components/common/LuxuryImage";
import { pageVariants } from "../../lib/animations";

export const AccountOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orders = useDataStore((s) => s.orders);
  const orderItems = useDataStore((s) => s.orderItems);

  const order = orders.find((o) => o.id === id) || orders[0];
  const items = orderItems.filter((i) => i.order_id === order?.id);

  if (!order) return null;

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
          title={`Order ${order.order_number}`}
          subtitle="Track your shipment & garment details"
          icon={<PackageCheck className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "My Orders", to: "/account/orders" },
            { label: order.order_number },
          ]}
          actions={
            <Link
              to="/account/orders"
              className="px-3.5 py-2 rounded-[6px] bg-[#E63946] text-xs text-[#FFFFFF] font-semibold flex items-center gap-1.5 hover:bg-[#C1121F] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Orders</span>
            </Link>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-[#1A1A1A]">
              Fulfillment Timeline
            </h2>
            <OrderStatusTimeline status={order.status} />
          </div>

          <div className="lg:col-span-6 rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-[#1A1A1A]">
              Ordered Garments
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-[8px] bg-[#F5F5F5] border border-[#E0E0E0]"
                >
                  <LuxuryImage
                    src={item.product_image}
                    alt={item.product_name_en}
                    className="w-14 h-14 rounded object-cover border border-[#E0E0E0]"
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-[#1A1A1A]">
                      {item.product_name_en}
                    </p>
                    <p className="text-[#666666]">
                      Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#E63946] tabular-nums">
                    {formatPKR(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E0E0E0] pt-4 space-y-1.5 text-xs font-mono tabular-nums">
              <div className="flex justify-between text-[#666666]">
                <span>Subtotal</span>
                <span className="text-[#1A1A1A] font-semibold">{formatPKR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span>Delivery ({order.delivery_city})</span>
                <span className="text-[#1A1A1A] font-semibold">{formatPKR(order.delivery_charge)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-2 border-t border-[#E0E0E0]">
                <span>Total</span>
                <span className="text-[#E63946]">{formatPKR(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountOrderDetail;
