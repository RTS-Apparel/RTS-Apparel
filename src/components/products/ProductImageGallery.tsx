import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const label = alt || title || "ARTS APPAREL Garment";
  const safeImages = (images || []).filter(Boolean);
  const currentImage = safeImages[activeIndex] || safeImages[0] || "";

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

  if (safeImages.length === 0) {
    return (
      <div className="rounded-xl bg-[#F5F5F5] border border-[#E0E0E0] aspect-[3/4] flex flex-col items-center justify-center p-8 text-center">
        <ImageOff className="w-12 h-12 text-[#666666] mb-3" />
        <p className="text-sm font-serif-display text-[#1A1A1A] font-semibold">
          ARTS APPAREL Preview Placeholder
        </p>
        <p className="text-xs text-[#666666] mt-1">
          No gallery images uploaded for this garment yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className="w-full rounded-xl bg-[#F5F5F5] border border-[#E0E0E0] hover:border-[#E63946] aspect-[3/4] overflow-hidden relative group select-none transition-colors"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage + activeIndex}
            src={currentImage}
            alt={label}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: isZoomed ? 1.45 : 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            onClick={() => setIsZoomed((prev) => !prev)}
            className={`w-full h-full object-cover cursor-zoom-in ${
              isZoomed ? "cursor-zoom-out" : "group-hover:scale-105 transition-transform duration-500"
            }`}
          />
        </AnimatePresence>

        {/* Zoom Toggle Button */}
        <button
          type="button"
          onClick={() => setIsZoomed((prev) => !prev)}
          aria-label={isZoomed ? "Zoom Out" : "Zoom In"}
          className="absolute top-3 right-3 p-2 rounded-[6px] bg-[#1A1A1A] text-[#FFFFFF] hover:bg-[#E63946] transition-colors shadow-md"
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
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-[6px] bg-[#1A1A1A] text-[#FFFFFF] hover:bg-[#E63946] transition-colors shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-[6px] bg-[#1A1A1A] text-[#FFFFFF] hover:bg-[#E63946] transition-colors shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded bg-[#1A1A1A] text-[#FFFFFF] text-[11px] font-mono px-2.5 py-0.5 tracking-widest">
              {activeIndex + 1} / {safeImages.length}
            </div>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-square w-20 h-20 rounded-lg border overflow-hidden shrink-0 transition-all bg-[#F5F5F5] ${
                activeIndex === idx
                  ? "border-[#E63946] ring-2 ring-[#E63946]/50 scale-105"
                  : "border-[#E0E0E0] opacity-75 hover:opacity-100 hover:border-[#E63946]"
              }`}
            >
              <img
                src={img}
                alt={`${label} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
