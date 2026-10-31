import React from "react";
import { Check, Clock, Package, Truck, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { OrderStatus } from "../../types";

const STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: Check },
  { key: "packed", label: "Atelier Packed", icon: Package },
  { key: "shipped", label: "Dispatched", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export const OrderStatusTimeline: React.FC<{ status: OrderStatus }> = ({
  status,
}) => {
  if (status === "cancelled") {
    return (
      <div className="p-4 rounded-xl bg-[#F8D7DA] border border-[#E63946]/30 flex items-center gap-3 text-xs text-[#721C24] font-semibold">
        <XCircle className="w-5 h-5 shrink-0" />
        <span>This order has been cancelled.</span>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;

        return (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.35 }}
            className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all ${
              isCurrent
                ? "bg-[#FFFFFF] border-2 border-[#E63946] text-[#1A1A1A] shadow-sm"
                : isCompleted
                ? "bg-[#FFFFFF] border border-[#22C55E] text-[#1A1A1A]"
                : "bg-[#F5F5F5] border border-[#E0E0E0] text-[#666666]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCurrent
                  ? "bg-[#E63946] text-[#FFFFFF] animate-pulse"
                  : isCompleted
                  ? "bg-[#22C55E] text-[#FFFFFF]"
                  : "bg-[#E0E0E0] text-[#999999]"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">{step.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
};
