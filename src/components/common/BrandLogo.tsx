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
      ? "text-sm sm:text-base tracking-[0.08em]"
      : size === "lg"
      ? "text-xl sm:text-2xl tracking-[0.1em]"
      : "text-base sm:text-lg tracking-[0.08em]";

  const taglineSizeClass =
    size === "sm"
      ? "text-[9px] tracking-[0.18em]"
      : size === "lg"
      ? "text-[11px] tracking-[0.22em]"
      : "text-[9.5px] tracking-[0.2em]";

  const apparelTextColor = variant === "dark" ? "#FFFFFF" : "#1A1A1A";
  const taglineColor = variant === "dark" ? "#CCCCCC" : "#666666";

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none shrink-0 whitespace-nowrap ${className}`}
    >
      <img
        src="https://kommodo.ai/i/teVvjKPRCu515Q0wyHeG"
        alt="ARTS APPAREL Logo"
        onLoad={() => setImgVisible(true)}
        onError={() => setImgVisible(false)}
        className={`h-8 w-8 object-contain shrink-0 ${
          imgVisible ? "block" : "hidden"
        }`}
      />
      <div className="flex flex-col leading-none whitespace-nowrap">
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
              <span aria-hidden="true" className="absolute h-[1.5px] w-[115%] bg-[#E63946] -rotate-[28deg] top-[58%] left-[-8%]" />
            </span>
          </span>
          <span
            className="inline-flex items-center justify-center ml-0.5"
            style={{ color: apparelTextColor }}
          >
            RTS
          </span>
          <span className="ml-1.5 text-[0.77em]" style={{ color: apparelTextColor }}>
            APPAREL
          </span>
        </span>
        {showTagline && (
          <span
            className={`mt-1 font-semibold uppercase whitespace-nowrap ${taglineSizeClass}`}
            style={{ color: taglineColor }}
          >
            Premium Men&apos;s Fashion
          </span>
        )}
      </div>
    </div>
  );
};
