import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import { useDataStore } from "../store/dataStore";
import { aiSearch } from "../lib/ai";
import { isUrduText } from "../lib/utils";
import { ProductGrid } from "../components/products/ProductGrid";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { CUSTOMER_TRANSLATIONS } from "../lib/i18n";
import { pageVariants } from "../lib/animations";
import { PageHeading } from "../components/layout/PageHeading";

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [aiUsed, setAiUsed] = useState(true);
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
    setAiUsed(result.success !== false);
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

    const qLower = query.trim().toLowerCase();
    // Always match directly on name_en, name_ur, or category_name first
    if (
      qLower &&
      (prod.name_en.toLowerCase().includes(qLower) ||
        (prod.name_ur || "").toLowerCase().includes(qLower) ||
        (prod.category_name || "").toLowerCase().includes(qLower))
    ) {
      return true;
    }

    if (!aiUsed) {
      return (prod.name_roman_ur || "").toLowerCase().includes(qLower);
    }

    const cat = categories.find((c) => c.id === prod.category_id);
    const haystack = [
      prod.name_en,
      prod.name_ur || "",
      prod.name_roman_ur || "",
      prod.description_en || "",
      prod.category_name || "",
      cat?.name_en || "",
      cat?.name_ur || "",
      ...prod.colors,
    ]
      .join(" ")
      .toLowerCase();

    const searchTerms =
      keywords.length > 0 ? keywords : [qLower];
    return searchTerms.some((term) =>
      haystack.includes(term.toLowerCase().trim())
    );
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8"
    >
      <PageHeading
        title={t.smartSearch}
        subtitle={t.searchPlaceholder}
        breadcrumbs={[
          { label: t.home, href: "/" },
          { label: t.smartSearch },
        ]}
      />

      <div className="rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] p-6 md:p-8 space-y-5 shadow-xs">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon size={16} className="text-[#666666] absolute left-3.5 top-3.5" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label="Search query"
              className="w-full h-11 pl-10 pr-4 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn-primary-futuristic h-11 px-6 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm hover:bg-[#C1121F] transition-colors whitespace-nowrap inline-flex items-center gap-2"
          >
            <SearchIcon size={16} />
            <span>{t.searchGo}</span>
          </button>
        </form>

        {keywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#666666]">
            <span className="font-medium text-[#1A1A1A]">AI Semantic Keywords:</span>
            {keywords.map((kw, i) => (
              <React.Fragment key={kw}>
                <span className="font-mono font-semibold text-[#E63946]">
                  {kw}
                </span>
                {i < keywords.length - 1 && (
                  <span aria-hidden="true" className="text-[#666666]">
                    ·
                  </span>
                )}
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
          emptyIcon={<SearchX size={64} />}
          emptyMessage="Bhai koi product nahi mila! Koi aur search karo 😊"
        />
      )}
    </motion.div>
  );
};

export default SearchPage;
