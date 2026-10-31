import React, { useState, useEffect } from "react";

interface LuxuryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const LuxuryImage: React.FC<LuxuryImageProps> = ({
  src,
  alt,
  className = "",
  ...rest
}) => {
  const [hasError, setHasError] = useState(!src);

  useEffect(() => {
    setHasError(!src);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt || "ARTS APPAREL"}
        className={`bg-[#1A1A1A] flex items-center justify-center text-center select-none p-2 ${className}`}
      >
        <span
          className="text-[#FFFFFF] font-bold tracking-[0.14em] uppercase text-[10px] sm:text-xs"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ARTS APPAREL
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "ARTS APPAREL"}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
      {...rest}
    />
  );
};
