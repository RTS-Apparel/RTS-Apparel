import React from "react";

interface DiscountBadgeProps {
  percent: number;
  className?: string;
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({
  percent,
  className = "",
}) => {
  if (!percent || percent <= 0) return null;
  return (
    <span
      className={`inline-block bg-[#C9A84C] text-[#1A1A1A] font-mono font-bold text-xs px-2 py-1 rounded tracking-wider tabular-nums shadow-xs ${className}`}
    >
      -{Math.round(percent)}%
    </span>
  );
};
