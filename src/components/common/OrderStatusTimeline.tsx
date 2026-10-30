import React from "react";
import { Check, Package, Truck, Home, Clock, XCircle } from "lucide-react";
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
    desc: "Order registered at RTS Apparel Atelier",
    icon: Clock,
  },
  {
    key: "confirmed",
    label: "Order Confirmed",
    urdu: "تصدیق شدہ",
    desc: "Payment & tailoring specifications verified",
    icon: Check,
  },
  {
    key: "packed",
    label: "Quality Checked & Packed",
    urdu: "پیکنگ مکمل",
    desc: "Garment pressed and sealed in signature RTS box",
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
      <div className="p-5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center gap-4">
        <XCircle className="w-7 h-7 text-[#EF4444] shrink-0" />
        <div>
          <p className="text-base font-semibold text-[#EF4444]">
            Order Cancelled · آرڈر منسوخ
          </p>
          <p className="text-sm text-[#4A4A4A] mt-0.5">
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
        const isCompleted = index <= currentIdx;
        const isCurrent = index === currentIdx;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.key} className="relative flex items-start gap-4">
            {!isLast && (
              <div
                className={`absolute left-5 top-10 w-0.5 h-8 ${
                  index < currentIdx ? "bg-[#C9A84C]" : "bg-[#E8E0D0]"
                }`}
              />
            )}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                isCompleted
                  ? "bg-[#C9A84C] text-[#1A1A1A] border-[#C9A84C]"
                  : "bg-[#FFFFFF] text-[#9A9A9A] border-[#E8E0D0]"
              } ${isCurrent ? "ring-4 ring-[#C9A84C]/25" : ""}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="pt-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${
                    isCompleted ? "text-[#1A1A1A]" : "text-[#9A9A9A]"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-xs text-[#9A9A9A]" aria-hidden="true">
                  ·
                </span>
                <span className="text-xs font-urdu text-[#4A4A4A]">
                  {step.urdu}
                </span>
                {isCurrent && (
                  <span className="text-xs font-mono font-semibold text-[#C9A84C] ml-2">
                    [Current Stage]
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4A4A4A] mt-0.5">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
