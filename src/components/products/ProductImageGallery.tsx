import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  alt?: string;
  title?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  alt,
  title,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const label = alt || title || "RTS Apparel Garment";
  const safeImages = images.length > 0 ? images : [];
  const currentImage = safeImages[activeIndex] || safeImages[0];

  const handlePrev = () => {
    if (safeImages.length <= 1) return;
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (safeImages.length <= 1) return;
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) handleNext();
      else handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {safeImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 shrink-0">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[3/4] w-16 md:w-20 rounded-lg border overflow-hidden transition-all ${
                activeIndex === idx
                  ? "border-[#C9A84C] ring-1 ring-[#C9A84C]"
                  : "border-[#E8E0D0] opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${label} view ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div
        className="flex-1 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] aspect-[3/4] overflow-hidden relative group select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={currentImage}
          alt={label}
          onClick={() => setIsZoomed((prev) => !prev)}
          className={`w-full h-full object-cover transition-transform duration-500 cursor-zoom-in ${
            isZoomed ? "scale-150 cursor-zoom-out" : "group-hover:scale-105"
          }`}
        />

        {/* Zoom Toggle Button */}
        <button
          type="button"
          onClick={() => setIsZoomed((prev) => !prev)}
          aria-label={isZoomed ? "Zoom Out" : "Zoom In"}
          className="absolute top-3 right-3 p-2 rounded-lg bg-[#FFFFFF]/90 border border-[#E8E0D0] text-[#1A1A1A] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors shadow-xs"
        >
          {isZoomed ? (
            <ZoomOut className="w-4 h-4" />
          ) : (
            <ZoomIn className="w-4 h-4" />
          )}
        </button>

        {/* Previous / Next Buttons */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-[#FFFFFF]/90 border border-[#E8E0D0] text-[#1A1A1A] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-[#FFFFFF]/90 border border-[#E8E0D0] text-[#1A1A1A] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded bg-[#1A1A1A]/75 text-white text-[11px] font-mono px-2.5 py-0.5 tracking-widest">
              {activeIndex + 1} / {safeImages.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;
