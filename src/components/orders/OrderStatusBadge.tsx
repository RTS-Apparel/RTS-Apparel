import React from "react";
import { OrderStatus } from "../../types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-[#D97706]/15 text-[#D97706] border-[#D97706]/30",
  confirmed: "bg-[#C9A84C]/20 text-[#9B7B2F] border-[#C9A84C]",
  packed: "bg-[#C9A84C]/20 text-[#9B7B2F] border-[#C9A84C]",
  shipped: "bg-[#2563EB]/15 text-[#2563EB] border-[#2563EB]/30",
  delivered: "bg-[#16A34A]/15 text-[#16A34A] border-[#16A34A]/30",
  cancelled: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({
  status,
}) => {
  return (
    <span
      className={`px-3 py-1 rounded-md border font-mono text-xs font-bold uppercase tracking-wider ${
        STATUS_STYLES[status] || STATUS_STYLES.pending
      }`}
    >
      {status}
    </span>
  );
};
