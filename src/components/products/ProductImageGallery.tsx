import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedImage } from "../common/OptimizedImage";

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

  useEffect(() => {
    setActiveIndex(0);
    setIsZoomed(false);
  }, [images]);

  const label = alt || title || "ARTS APPAREL Garment";
  const safeImages = (images || []).filter(Boolean);
  const selectedImage = safeImages[activeIndex] || safeImages[0] || "";

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
      <div
        className="rounded-xl bg-[#1A1A1A] border border-[#E0E0E0] flex flex-col items-center justify-center p-8 text-center"
        style={{ height: "450px" }}
      >
        <span
          className="text-[#FFFFFF] font-bold tracking-[0.18em] uppercase text-lg"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ARTS APPAREL
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main large image: OptimizedImage with priority={true} and height 450px */}
      <div
        className="w-full rounded-xl bg-[#1A1A1A] border border-[#E0E0E0] hover:border-[#E63946] overflow-hidden relative group select-none transition-colors"
        style={{ height: "450px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage + activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: isZoomed ? 1.35 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setIsZoomed((prev) => !prev)}
            className={`w-full h-full ${
              isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
          >
            <OptimizedImage
              src={`${selectedImage}?w=800&q=75&fm=webp&fit=crop`}
              alt={label}
              priority={true}
              style={{ height: "450px" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom Toggle Button */}
        <button
          type="button"
          onClick={() => setIsZoomed((prev) => !prev)}
          aria-label={isZoomed ? "Zoom Out" : "Zoom In"}
          className="absolute top-3 right-3 z-10 p-2 rounded-[6px] bg-[#1A1A1A] text-[#FFFFFF] hover:bg-[#E63946] transition-colors shadow-md"
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
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-[6px] bg-[#1A1A1A] text-[#FFFFFF] hover:bg-[#E63946] transition-colors shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-[6px] bg-[#1A1A1A] text-[#FFFFFF] hover:bg-[#E63946] transition-colors shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 rounded bg-[#1A1A1A] text-[#FFFFFF] text-[11px] font-mono px-2.5 py-0.5 tracking-widest">
              {activeIndex + 1} / {safeImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip below (all 3 images, clickable, 80x80 OptimizedImage) */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative rounded-lg border overflow-hidden shrink-0 transition-all bg-[#1A1A1A] ${
                activeIndex === idx
                  ? "border-[#E63946] ring-2 ring-[#E63946]/50 scale-105"
                  : "border-[#E0E0E0] opacity-75 hover:opacity-100 hover:border-[#E63946]"
              }`}
              style={{ height: "80px", width: "80px", cursor: "pointer" }}
            >
              <OptimizedImage
                src={`${img}?w=120&q=60&fm=webp&fit=crop`}
                alt=""
                priority={false}
                style={{ height: "80px", width: "80px", cursor: "pointer" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
