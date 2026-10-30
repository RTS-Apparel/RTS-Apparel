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
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  "Obsidian Black",
  "Emerald",
  "Ivory",
  "White",
  "Navy",
  "Olive",
  "Cognac",
  "Charcoal",
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
}) => {
  const language = useDataStore((s) => s.language);
  const t = CUSTOMER_TRANSLATIONS[language];

  return (
    <aside className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-5 space-y-6 sticky top-28 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E8E0D0] pb-3">
        <div className="flex items-center gap-2 text-sm font-serif-display font-semibold text-[#1A1A1A]">
          <SlidersHorizontal className="w-4 h-4 text-[#C9A84C]" />
          <span>{t.filterGarments}</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#C9A84C] hover:underline flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.reset}</span>
        </button>
      </div>

      {/* Size Filter */}
      <div className="space-y-2.5">
        <span className="text-xs font-mono uppercase tracking-wider text-[#4A4A4A] font-semibold block">
          {t.size}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedSize("")}
            className={`px-2.5 py-1.5 rounded text-xs font-mono border transition-colors ${
              selectedSize === ""
                ? "bg-[#C9A84C] text-[#1A1A1A] border-[#C9A84C] font-bold"
                : "bg-[#FFFFFF] text-[#4A4A4A] border-[#E8E0D0] hover:border-[#C9A84C]"
            }`}
          >
            {t.all}
          </button>
          {SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSelectedSize(selectedSize === sz ? "" : sz)}
              className={`px-2.5 py-1.5 rounded text-xs font-mono border transition-colors ${
                selectedSize === sz
                  ? "bg-[#C9A84C] text-[#1A1A1A] border-[#C9A84C] font-bold"
                  : "bg-[#FFFFFF] text-[#4A4A4A] border-[#E8E0D0] hover:border-[#C9A84C]"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-2.5">
        <span className="text-xs font-mono uppercase tracking-wider text-[#4A4A4A] font-semibold block">
          {t.color}
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedColor("")}
            className={`px-2.5 py-1 rounded text-xs border transition-colors ${
              selectedColor === ""
                ? "bg-[#C9A84C] text-[#1A1A1A] border-[#C9A84C] font-semibold"
                : "bg-[#FFFFFF] text-[#4A4A4A] border-[#E8E0D0] hover:border-[#C9A84C]"
            }`}
          >
            {t.all}
          </button>
          {COLORS.map((clr) => (
            <button
              key={clr}
              type="button"
              onClick={() =>
                setSelectedColor(selectedColor === clr ? "" : clr)
              }
              className={`px-2.5 py-1 rounded text-xs border transition-colors ${
                selectedColor === clr
                  ? "bg-[#C9A84C] text-[#1A1A1A] border-[#C9A84C] font-semibold"
                  : "bg-[#FFFFFF] text-[#4A4A4A] border-[#E8E0D0] hover:border-[#C9A84C]"
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
          <span className="font-mono uppercase tracking-wider text-[#4A4A4A] font-semibold">
            {t.maxPrice}
          </span>
          <span className="font-mono font-bold text-[#C9A84C] tabular-nums">
            {formatPKR(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={3000}
          max={35000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label={t.maxPrice}
          className="w-full accent-[#C9A84C]"
        />
      </div>

      {/* Discount Toggle */}
      <div className="pt-2 border-t border-[#E8E0D0]">
        <label className="flex items-center gap-2.5 text-xs text-[#1A1A1A] font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={onlyDiscounted}
            onChange={(e) => setOnlyDiscounted(e.target.checked)}
            className="accent-[#C9A84C] w-4 h-4"
          />
          <span>{t.saleOnly}</span>
        </label>
      </div>
    </aside>
  );
};
