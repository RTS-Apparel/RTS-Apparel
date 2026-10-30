import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Award, Truck, ShieldCheck } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useDataStore } from "../store/dataStore";
import { ProductGrid } from "../components/products/ProductGrid";
import {
  CUSTOMER_TRANSLATIONS,
  getBannerSubtitle,
  getBannerTitle,
  getCategoryName,
} from "../lib/i18n";

export const HomePage: React.FC = () => {
  const {
    categories,
    featuredProducts,
    newArrivals,
    saleProducts,
    activeBanners,
    activeProducts,
  } = useProducts();
  const language = useDataStore((s) => s.language);
  const t = CUSTOMER_TRANSLATIONS[language];

  const heroBanner = activeBanners[0];
  const heroTitle = getBannerTitle(heroBanner, language);
  const heroSubtitle = getBannerSubtitle(heroBanner, language);

  return (
    <main className="space-y-20">
      {/* Hero Section */}
      <section className="relative min-h-[72vh] flex items-center border-b border-[#E8E0D0] overflow-hidden bg-[#FAFAFA]">
        {heroBanner && (
          <div className="absolute inset-0">
            <img
              src={heroBanner.image_url}
              alt={heroTitle}
              className="w-full h-full object-cover object-center opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF]/90 to-[#FFFFFF]/50" />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/40 text-[#9B7B2F] text-xs uppercase tracking-[0.2em] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.heroBadge}</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#1A1A1A] leading-[1.12]">
              {heroTitle}
            </h1>

            <p className="text-[#4A4A4A] text-base sm:text-lg max-w-xl leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={heroBanner?.link_url || "/category/kurta-shalwar"}
                className="px-8 py-4 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#E2C07A] transition-colors flex items-center gap-3"
              >
                <span>{t.shopNow}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/signup?tab=agent"
                className="px-7 py-4 rounded-lg border border-[#C9A84C] text-[#9B7B2F] hover:bg-[#C9A84C]/10 text-xs uppercase tracking-[0.2em] transition-colors font-semibold"
              >
                {t.joinAgentNetwork}
              </Link>
            </div>
          </div>

          {heroBanner && (
            <div className="lg:col-span-5 hidden lg:block">
              <div className="rounded-xl border border-[#C9A84C]/40 p-3 bg-[#FFFFFF] shadow-xl">
                <img
                  src={heroBanner.image_url}
                  alt={heroTitle}
                  className="w-full aspect-[4/5] rounded-lg object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E0D0] pb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A84C] block mb-1 font-semibold">
              {t.sec1Kicker}
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1A1A] font-bold">
              {t.shopByCategory}
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs font-semibold text-[#C9A84C] hover:underline"
          >
            {t.browseAllGarments}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const count = activeProducts.filter(
              (p) => p.category_id === cat.id
            ).length;
            const catName = getCategoryName(cat, language);
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] hover:border-[#C9A84C] p-5 transition-all hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div>
                  <h3 className="font-serif-display text-lg font-bold text-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors">
                    {catName}
                  </h3>
                  <p className="text-xs text-[#4A4A4A] mt-1 font-mono">
                    {count} {t.itemsCount}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#C9A84C] flex items-center gap-1">
                  <span>{t.viewDepartment}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E0D0] pb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A84C] block mb-1 font-semibold">
              {t.sec2Kicker}
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1A1A] font-bold">
              {t.featuredCollection}
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs font-semibold text-[#C9A84C] hover:underline"
          >
            {t.exploreFullCatalog}
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts.slice(0, 4)}
          categories={categories}
        />
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E0D0] pb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A84C] block mb-1 font-semibold">
              {t.sec3Kicker}
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1A1A] font-bold">
              {t.newArrivals}
            </h2>
          </div>
        </div>

        <ProductGrid
          products={newArrivals.slice(0, 4)}
          categories={categories}
        />
      </section>

      {/* Luxury Sale & Special Offers */}
      {saleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E0D0] pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A84C] block mb-1 font-semibold">
                {t.sec4Kicker}
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1A1A] font-bold">
                {t.saleOffers}
              </h2>
            </div>
          </div>

          <ProductGrid
            products={saleProducts.slice(0, 4)}
            categories={categories}
          />
        </section>
      )}

      {/* Partner Agent Network Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#FAFAFA] border border-[#E8E0D0] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A84C] font-semibold flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>{t.sec5Kicker}</span>
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              {t.partnerHeading}
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              {t.partnerSub}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/signup?tab=agent"
              className="px-6 py-3.5 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider hover:bg-[#E2C07A]"
            >
              {t.applyAgentAccount}
            </Link>
            <Link
              to="/team"
              className="px-6 py-3.5 rounded-lg border border-[#C9A84C] text-[#9B7B2F] font-semibold text-xs uppercase tracking-wider hover:bg-[#C9A84C]/10"
            >
              {t.openAgentDashboard}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
