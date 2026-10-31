import React from "react";

export const FuturisticSpinner: React.FC = () => (
  <div className="inline-flex items-center justify-center">
    <div className="relative w-10 h-10 rounded-full border-2 border-[#E0E0E0] border-t-[#E63946] animate-spin" />
  </div>
);

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <FuturisticSpinner />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden p-4 space-y-4"
          >
            <div className="aspect-[4/3] w-full rounded-lg skeleton-shimmer" />
            <div className="h-3 w-1/3 rounded skeleton-shimmer" />
            <div className="h-4 w-3/4 rounded skeleton-shimmer" />
            <div className="h-5 w-1/2 rounded skeleton-shimmer" />
            <div className="h-10 w-full rounded-lg skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
};
