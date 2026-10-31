import React from "react";
import { OrderStatus } from "../../types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-[#FFF3CD] text-[#856404] border-[#856404]/25",
  confirmed: "bg-[#D1ECF1] text-[#0C5460] border-[#0C5460]/25",
  packed: "bg-[#D1ECF1] text-[#0C5460] border-[#0C5460]/25",
  shipped: "bg-[#E8D5FF] text-[#6A0DAD] border-[#6A0DAD]/25",
  delivered: "bg-[#D4EDDA] text-[#155724] border-[#155724]/25",
  cancelled: "bg-[#F8D7DA] text-[#721C24] border-[#721C24]/25",
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({
  status,
}) => {
  return (
    <span
      className={`px-3 py-1 rounded-[6px] border font-mono text-xs font-bold uppercase tracking-wider inline-block ${
        STATUS_STYLES[status] || STATUS_STYLES.pending
      }`}
    >
      {status}
    </span>
  );
};
