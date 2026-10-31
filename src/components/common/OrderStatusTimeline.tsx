import React from "react";
import { CheckCircle, Package, Truck, Home, ClipboardList, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { OrderStatus } from "../../types";

interface OrderStatusTimelineProps {
  status: OrderStatus;
}

const STEPS: Array<{
  key: OrderStatus;
  label: string;
  urdu: string;
  desc: string;
  icon: React.FC<{ className?: string }>;
}> = [
  {
    key: "pending",
    label: "Order Placed",
    urdu: "آرڈر موصول",
    desc: "Order registered at ARTS APPAREL Atelier",
    icon: ClipboardList,
  },
  {
    key: "confirmed",
    label: "Order Confirmed",
    urdu: "تصدیق شدہ",
    desc: "Payment & tailoring specifications verified",
    icon: CheckCircle,
  },
  {
    key: "packed",
    label: "Quality Checked & Packed",
    urdu: "پیکنگ مکمل",
    desc: "Garment pressed and sealed in signature ARTS APPAREL box",
    icon: Package,
  },
  {
    key: "shipped",
    label: "Shipped via Courier",
    urdu: "روانہ کر دیا گیا",
    desc: "In transit to your city delivery hub",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    urdu: "پہنچا دیا گیا",
    desc: "Handed over at destination address",
    icon: Home,
  },
];

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  status,
}) => {
  if (status === "cancelled") {
    return (
      <div className="p-5 rounded-xl bg-[#F8D7DA] border border-[#E63946]/30 flex items-center gap-4">
        <XCircle className="w-7 h-7 text-[#721C24] shrink-0" />
        <div>
          <p className="text-base font-semibold text-[#721C24]">
            Order Cancelled · آرڈر منسوخ
          </p>
          <p className="text-sm text-[#721C24]/80 mt-0.5">
            This order and any linked referral commission have been cancelled.
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="space-y-4">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentIdx;
        const isCurrent = index === currentIdx;
        const isLast = index === STEPS.length - 1;

        return (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.35 }}
            className="relative flex items-start gap-4"
          >
            {!isLast && (
              <div
                className={`absolute left-5 top-10 w-0.5 h-8 ${
                  index < currentIdx ? "bg-[#22C55E]" : "bg-[#E0E0E0]"
                }`}
              />
            )}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                isCurrent
                  ? "bg-[#E63946] text-[#FFFFFF] animate-pulse shadow-md"
                  : isCompleted
                  ? "bg-[#22C55E] text-[#FFFFFF] shadow-xs"
                  : "bg-[#E0E0E0] text-[#999999]"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-sm font-semibold ${
                    isCurrent || isCompleted ? "text-[#1A1A1A]" : "text-[#666666]"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-xs text-[#666666]" aria-hidden="true">
                  ·
                </span>
                <span className="text-xs font-urdu text-[#666666]">
                  {step.urdu}
                </span>
                {isCurrent && (
                  <span className="text-xs font-mono font-semibold text-[#E63946] ml-2">
                    [Current Stage]
                  </span>
                )}
              </div>
              <p className="text-xs text-[#666666] mt-0.5">{step.desc}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
