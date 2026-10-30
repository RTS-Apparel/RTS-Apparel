import React from "react";
import { Check, Clock, Package, Truck, CheckCircle2, XCircle } from "lucide-react";
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
      <div className="p-4 rounded-xl bg-red-50 border border-red-300 flex items-center gap-3 text-xs text-red-700 font-semibold">
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
        const isCompleted = idx <= currentIdx;
        const isCurrent = idx === currentIdx;

        return (
          <div
            key={step.key}
            className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all ${
              isCurrent
                ? "bg-[#C9A84C]/15 border-[#C9A84C] text-[#1A1A1A]"
                : isCompleted
                ? "bg-[#FFFFFF] border-[#C9A84C]/50 text-[#1A1A1A]"
                : "bg-[#FFFFFF] border-[#E8E0D0] text-[#9A9A9A]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted
                  ? "bg-[#C9A84C] text-[#1A1A1A]"
                  : "bg-[#F5F4F0] text-[#9A9A9A]"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};
