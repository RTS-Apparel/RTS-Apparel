import React, { useState } from "react";

interface BrandLogoProps {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  showTagline = true,
  size = "md",
  variant = "light",
  className = "",
}) => {
  const [imgVisible, setImgVisible] = useState(false);

  const textSizeClass =
    size === "sm"
      ? "text-base sm:text-lg tracking-[0.06em]"
      : size === "lg"
      ? "text-2xl sm:text-3xl tracking-[0.08em]"
      : "text-xl sm:text-2xl tracking-[0.06em]";

  const taglineSizeClass =
    size === "sm"
      ? "text-[10px] tracking-[0.14em]"
      : size === "lg"
      ? "text-xs sm:text-sm tracking-[0.18em]"
      : "text-[11px] sm:text-xs tracking-[0.16em]";

  const logoSizeClass =
    size === "sm"
      ? "h-12 w-12 sm:h-14 sm:w-14"
      : size === "lg"
      ? "h-20 w-20 sm:h-24 sm:w-24"
      : "h-[76px] w-[76px] sm:h-[84px] sm:w-[84px]";

  const apparelTextColor = variant === "dark" ? "#FFFFFF" : "#1A1A1A";
  const taglineColor = variant === "dark" ? "#CCCCCC" : "#666666";

  return (
    <div
      className={`inline-flex items-center gap-3 select-none shrink-0 whitespace-nowrap ${className}`}
    >
      <img
        src="https://cdn.phototourl.com/member/2026-10-31-622505d6-04bd-44dc-8ab9-397e44cb219e.png"
        alt="ARTS APPAREL Logo"
        onLoad={() => setImgVisible(true)}
        onError={() => setImgVisible(false)}
        className={`${logoSizeClass} object-contain shrink-0 ${imgVisible ? "block" : "hidden"}`}
      />
      <div className="flex flex-col leading-tight whitespace-nowrap">
        <span
          className={`font-serif-display font-bold uppercase whitespace-nowrap inline-flex items-center ${textSizeClass}`}
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
        >
          <span
            className="inline-flex items-center justify-center"
            style={{ color: apparelTextColor }}
          >
            <span className="relative inline-flex items-center justify-center font-black" style={{ fontFamily: "serif", fontStyle: "italic", transform: "skewX(-9deg) scale(1.12)", letterSpacing: "-0.09em" }}>
              A
              <span aria-hidden="true" className="absolute h-[2px] w-[115%] bg-[#E63946] -rotate-[28deg] top-[58%] left-[-8%]" />
            </span>
          </span>
          <span
            className="inline-flex items-center justify-center ml-0.5"
            style={{ color: apparelTextColor }}
          >
            RTS
          </span>
          <span className="ml-2 text-[0.77em]" style={{ color: apparelTextColor }}>
            APPAREL
          </span>
        </span>
        {showTagline && (
          <span
            className={`mt-1.5 font-semibold uppercase whitespace-nowrap ${taglineSizeClass}`}
            style={{ color: taglineColor }}
          >
            Premium Men&apos;s Fashion
          </span>
        )}
      </div>
    </div>
  );
};
