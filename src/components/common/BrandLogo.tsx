import React from "react";

interface BrandLogoProps {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  className = "",
}) => {
  const logoSizeClass =
    size === "sm"
      ? "h-12 w-12 sm:h-14 sm:w-14"
      : size === "lg"
      ? "h-[48px] w-[48px] sm:h-[76px] sm:w-[76px] lg:h-[120px] lg:w-[120px]"
      : "h-[76px] w-[76px] sm:h-[84px] sm:w-[84px]";

  return (
    <span className={`${logoSizeClass} rts-logo-orbit shrink-0 relative isolate inline-flex rounded-full p-[2px] ${className}`}>
      <span className="rts-logo-core relative block h-full w-full overflow-hidden rounded-full bg-black">
        <img
          src="/images/rts-logo.webp"
          alt="RTS Apparel Logo"
          className="block h-full w-full rounded-full object-contain"
          width={512}
          height={512}
          fetchPriority="high"
        />
      </span>
    </span>
  );
};

export default BrandLogo;
