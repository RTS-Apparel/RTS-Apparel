import React from "react";

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden p-4 space-y-4"
        >
          <div className="aspect-[4/3] w-full rounded-lg skeleton-gold" />
          <div className="h-3 w-1/3 rounded skeleton-gold" />
          <div className="h-4 w-3/4 rounded skeleton-gold" />
          <div className="h-5 w-1/2 rounded skeleton-gold" />
          <div className="h-10 w-full rounded-lg skeleton-gold" />
        </div>
      ))}
    </div>
  );
};
