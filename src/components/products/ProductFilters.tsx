import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { CUSTOMER_TRANSLATIONS } from "../../lib/i18n";

interface ProductFiltersProps {
  selectedSize: string;
  setSelectedSize: (s: string) => void;
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
  onlyDiscounted: boolean;
  setOnlyDiscounted: (d: boolean) => void;
  onReset: () => void;
  availableSizes?: string[];
  availableColors?: string[];
}

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"];
const DEFAULT_COLORS = [
  "White",
  "Black",
  "Navy",
  "Grey",
  "Blue",
  "Olive",
  "Beige",
  "Charcoal",
  "Brown",
  "Green",
  "Maroon",
  "Cream",
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  maxPrice,
  setMaxPrice,
  onlyDiscounted,
  setOnlyDiscounted,
  onReset,
  availableSizes,
  availableColors,
}) => {
  const language = useDataStore((s) => s.language);
  const t = CUSTOMER_TRANSLATIONS[language];

  const sizes =
    availableSizes && availableSizes.length > 0 ? availableSizes : DEFAULT_SIZES;
  const colors =
    availableColors && availableColors.length > 0
      ? availableColors
      : DEFAULT_COLORS;

  return (
    <aside className="rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] p-5 space-y-6 sticky top-28 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E0E0E0] pb-3">
        <div className="flex items-center gap-2 text-sm font-serif-display font-semibold text-[#1A1A1A]">
          <SlidersHorizontal className="w-4 h-4 text-[#E63946]" />
          <span>{t.filterGarments}</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#E63946] hover:underline flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.reset}</span>
        </button>
      </div>

      {/* Size Filter */}
      <div className="space-y-2.5">
        <span className="text-xs font-mono uppercase tracking-wider text-[#1A1A1A] font-semibold block">
          {t.size}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedSize("")}
            className={`px-2.5 py-1.5 rounded-[6px] text-xs font-mono border transition-colors ${
              selectedSize === ""
                ? "bg-[#E63946] text-[#FFFFFF] border-[#E63946] font-bold"
                : "bg-[#F5F5F5] text-[#1A1A1A] border-[#E0E0E0] hover:border-[#E63946]"
            }`}
          >
            {t.all}
          </button>
          {sizes.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSelectedSize(selectedSize === sz ? "" : sz)}
              className={`px-2.5 py-1.5 rounded-[6px] text-xs font-mono border transition-colors ${
                selectedSize === sz
                  ? "bg-[#E63946] text-[#FFFFFF] border-[#E63946] font-bold"
                  : "bg-[#F5F5F5] text-[#1A1A1A] border-[#E0E0E0] hover:border-[#E63946]"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-2.5">
        <span className="text-xs font-mono uppercase tracking-wider text-[#1A1A1A] font-semibold block">
          {t.color}
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedColor("")}
            className={`px-2.5 py-1 rounded-[6px] text-xs border transition-colors ${
              selectedColor === ""
                ? "bg-[#E63946] text-[#FFFFFF] border-[#E63946] font-semibold"
                : "bg-[#F5F5F5] text-[#1A1A1A] border-[#E0E0E0] hover:border-[#E63946]"
            }`}
          >
            {t.all}
          </button>
          {colors.map((clr) => (
            <button
              key={clr}
              type="button"
              onClick={() =>
                setSelectedColor(selectedColor === clr ? "" : clr)
              }
              className={`px-2.5 py-1 rounded-[6px] text-xs border transition-colors ${
                selectedColor === clr
                  ? "bg-[#E63946] text-[#FFFFFF] border-[#E63946] font-semibold"
                  : "bg-[#F5F5F5] text-[#1A1A1A] border-[#E0E0E0] hover:border-[#E63946]"
              }`}
            >
              {clr}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono uppercase tracking-wider text-[#1A1A1A] font-semibold">
            {t.maxPrice}
          </span>
          <span className="font-mono font-bold text-[#E63946] tabular-nums">
            {formatPKR(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={1500}
          max={15000}
          step={250}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label={t.maxPrice}
          className="w-full accent-[#E63946]"
        />
      </div>

      {/* Discount Toggle */}
      <div className="pt-2 border-t border-[#E0E0E0]">
        <label className="flex items-center gap-2.5 text-xs text-[#1A1A1A] font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={onlyDiscounted}
            onChange={(e) => setOnlyDiscounted(e.target.checked)}
            className="accent-[#E63946] w-4 h-4"
          />
          <span>{t.saleOnly}</span>
        </label>
      </div>
    </aside>
  );
};
