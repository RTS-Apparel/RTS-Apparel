import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Sparkles } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useDataStore } from "../store/dataStore";
import { aiSearch } from "../lib/ai";
import { isUrduText } from "../lib/utils";
import { ProductGrid } from "../components/products/ProductGrid";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { CUSTOMER_TRANSLATIONS } from "../lib/i18n";

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { activeProducts, categories } = useProducts();
  const language = useDataStore((s) => s.language);
  const t = CUSTOMER_TRANSLATIONS[language];

  const runSmartSearch = async (searchText: string) => {
    const clean = searchText.trim();
    if (!clean) {
      setKeywords([]);
      return;
    }
    setIsSearching(true);
    const detectedLang = isUrduText(clean) ? "ur" : language;
    const result = await aiSearch(clean, detectedLang);
    setKeywords(
      result.keywords && result.keywords.length > 0
        ? result.keywords
        : [clean]
    );
    setIsSearching(false);
  };

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    if (q) {
      runSmartSearch(q);
    } else {
      setKeywords([]);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  const matchedProducts = activeProducts.filter((prod) => {
    if (!query.trim() && keywords.length === 0) return true;
    const cat = categories.find((c) => c.id === prod.category_id);
    const haystack = [
      prod.name_en,
      prod.name_ur || "",
      prod.name_roman_ur || "",
      prod.description_en || "",
      prod.description_ur || "",
      prod.description_roman_ur || "",
      cat?.name_en || "",
      cat?.name_ur || "",
      cat?.name_roman_ur || "",
      ...prod.colors,
    ]
      .join(" ")
      .toLowerCase();

    const searchTerms =
      keywords.length > 0 ? keywords : [query.trim().toLowerCase()];
    return searchTerms.some((term) =>
      haystack.includes(term.toLowerCase().trim())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 md:p-8 space-y-5 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#C9A84C] font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>{t.smartSearch}</span>
          </div>
          <h1 className="text-3xl font-serif-display font-bold text-[#1A1A1A]">
            {t.searchPlaceholder}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-[#9A9A9A] absolute left-3.5 top-3.5" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label="Search query"
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm text-[#1A1A1A] focus:border-[#C9A84C] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm hover:bg-[#E2C07A] transition-colors whitespace-nowrap"
          >
            {t.searchGo}
          </button>
        </form>

        {keywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#4A4A4A]">
            <span className="font-medium">AI Semantic Keywords:</span>
            {keywords.map((kw, i) => (
              <React.Fragment key={kw}>
                <span className="font-mono font-semibold text-[#C9A84C]">
                  {kw}
                </span>
                {i < keywords.length - 1 && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {isSearching ? (
        <LoadingSkeleton count={4} />
      ) : (
        <ProductGrid
          products={matchedProducts}
          categories={categories}
          emptyMessage={`No garments found matching "${query}". Try searching for Kurta, Shirt, Gurkha, or Jacket.`}
        />
      )}
    </div>
  );
};
