import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Banknote,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import { useDataStore } from "../store/dataStore";
import { ProductGrid } from "../components/products/ProductGrid";
import { OptimizedImage } from "../components/common/OptimizedImage";
import { CategoryIcon } from "../components/common/CategoryIcon";
import {
  CUSTOMER_TRANSLATIONS,
  getBannerSubtitle,
  getBannerTitle,
  getCategoryName,
} from "../lib/i18n";
import {
  categoryFlipVariants,
  buttonHover,
  buttonTap,
} from "../lib/animations";
import { demoBanners } from "../data/demoData";

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

  const slides =
    activeBanners.length > 0
      ? activeBanners
      : demoBanners.map((b) => ({
          ...b,
          title_en: b.title,
          subtitle_en: b.subtitle,
          created_at: new Date().toISOString(),
        }));

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const heroBanner = slides[currentSlide] || slides[0];
  const heroTitle =
    heroBanner?.title || getBannerTitle(heroBanner, language);
  const heroSubtitle =
    heroBanner?.subtitle || getBannerSubtitle(heroBanner, language);
  const heroCta = heroBanner?.cta_text || t.shopNow;
  const heroWords = heroTitle.split(/\s+/);

  const saleItems = activeProducts.filter((p) => p.discount_percent > 0);
  const displaySale = saleItems.length > 0 ? saleItems : saleProducts;

  return (
    <div className="space-y-10 sm:space-y-16 pb-10 sm:pb-12 bg-[#FFFFFF]">
      {/* HERO BANNER SECTION:
          - Height: 500px desktop, 280px mobile
          - object-fit: cover, object-position: top center
          - Dark overlay: linear-gradient(to right, rgba(0,0,0,0.75) 40%, transparent)
          - Text always on LEFT side, white color
          - Auto-slide: every 5 seconds
          - Dots navigation below banner */}
      <div>
        <section className="relative h-[300px] sm:h-[360px] md:h-[500px] w-full flex items-center border-b-2 border-[#E63946] overflow-hidden bg-[#1A1A1A]">
          <AnimatePresence mode="wait">
            {heroBanner && (
              <motion.div
                key={`bg-${heroBanner.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 overflow-hidden"
              >
                <OptimizedImage
                  src={heroBanner.image_url}
                  alt={heroTitle}
                  priority={currentSlide === 0}
                  style={{ width: "100%", height: "100%" }}
                />
                {/* Dark overlay on image so text is readable */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.48) 72%, rgba(0,0,0,0.18) 100%)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center">
            <div className="max-w-xl space-y-3 md:space-y-5 text-left pr-2">
              {/* Tag/label above heading */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#E63946] text-[#FFFFFF] text-[10px] sm:text-xs uppercase tracking-[0.18em] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#FFFFFF]" />
                <span>{t.heroBadge}</span>
              </div>

              {/* Slide Heading & Subtitle — Always on LEFT side, white color */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${heroBanner?.id || currentSlide}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-2 md:space-y-4"
                >
                  <h1 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-bold text-[#FFFFFF] leading-[1.15] flex flex-wrap gap-x-2.5 gap-y-1">
                    {heroWords.map((word, idx) => (
                      <span
                        key={`${word}-${idx}`}
                        className={
                          idx === heroWords.length - 1 ||
                          word.toLowerCase().includes("special") ||
                          word.toLowerCase().includes("collection")
                            ? "text-[#E63946]"
                            : "text-[#FFFFFF]"
                        }
                      >
                        {word}
                      </span>
                    ))}
                  </h1>

                  <p className="text-[#FFFFFF] text-xs sm:text-base md:text-lg max-w-lg leading-relaxed opacity-95">
                    {heroSubtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Link
                    to={heroBanner?.link_url || "/category/shirts"}
                    className="btn-primary-futuristic group relative px-5 py-2.5 md:px-7 md:py-3.5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs uppercase tracking-[0.18em] hover:bg-[#C1121F] transition-all inline-flex items-center gap-2.5"
                  >
                    <span>{heroCta}</span>
                    <ArrowRight className="w-4 h-4 text-[#FFFFFF] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Left / Right Slide Arrows on Desktop */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === 0 ? slides.length - 1 : prev - 1
                  )
                }
                aria-label="Previous slide"
                className="flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-[#1A1A1A]/85 text-[#FFFFFF] hover:bg-[#E63946] active:bg-[#E63946] transition-colors border border-white/40 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentSlide((prev) => (prev + 1) % slides.length)
                }
                aria-label="Next slide"
                className="flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-[#1A1A1A]/85 text-[#FFFFFF] hover:bg-[#E63946] active:bg-[#E63946] transition-colors border border-white/40 shadow-lg"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </section>

        {/* Dots navigation below banner */}
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 py-3.5 bg-[#FFFFFF]">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Slide ${idx + 1}: ${s.title || s.title_en}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? "w-8 bg-[#E63946]"
                    : "w-2.5 bg-[#CCCCCC] hover:bg-[#1A1A1A]"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <section
        aria-label="Shopping benefits"
        className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-8"
      >
        {[
          {
            title: "Cash on Delivery Available",
            description: "Pay safely when your parcel arrives",
            Icon: Banknote,
            delay: 0,
          },
          {
            title: "Delivery in 3–5 Working Days",
            description: "Reliable delivery across Pakistan",
            Icon: Truck,
            delay: 0.1,
          },
          {
            title: "100% Original Products",
            description: "Authentic quality you can trust",
            Icon: ShieldCheck,
            delay: 0.2,
          },
        ].map(({ title, description, Icon, delay }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay, ease: "easeOut" }}
            whileHover={{ y: -5, transition: { duration: 0.22 } }}
            className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-[#E7E7E7] bg-white px-5 py-5 text-left shadow-[0_5px_22px_rgba(0,0,0,0.045)] transition-all duration-300 hover:border-[#E63946]/50 hover:shadow-[0_12px_30px_rgba(230,57,70,0.10)] sm:px-4 lg:px-5"
          >
            <motion.div
              initial={{ scale: 0.82, rotate: -8 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 190, damping: 13, delay: delay + 0.08 }}
              className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#E63946] transition-colors duration-300 group-hover:bg-[#E63946] group-hover:text-white"
            >
              <Icon className="h-7 w-7" strokeWidth={1.8} />
              <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-[#E63946]/10" />
            </motion.div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold leading-snug text-[#1A1A1A] sm:text-[13px] lg:text-sm">
                {title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#777777]">
                {description}
              </p>
            </div>
            <span className="pointer-events-none absolute bottom-0 left-5 right-5 h-[2px] origin-left scale-x-0 bg-[#E63946] transition-transform duration-300 group-hover:scale-x-100" />
          </motion.div>
        ))}
      </section>

      {/* Categories Showcase — 5 categories (Shirts, Trousers, Kurta Shalwar, Hoodies, Jackets), each with product count badge */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E0E0E0] pb-5"
        >
          <div className="border-l-[3px] border-[#E63946] pl-[10px]">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E63946] block mb-1 font-semibold">
              {t.sec1Kicker}
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1A1A] font-bold">
              {t.shopByCategory}
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs font-semibold text-[#E63946] hover:underline"
          >
            {t.browseAllGarments}
          </Link>
        </motion.div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-6"
          style={{ perspective: 1000 }}
        >
          {categories.map((cat, idx) => {
            const count = activeProducts.filter(
              (p) =>
                p.category_id === cat.id || p.category_slug === cat.slug
            ).length;
            const catName = getCategoryName(cat, language);
            return (
              <motion.div
                key={cat.id}
                custom={idx}
                variants={categoryFlipVariants}
                initial="initial"
                whileInView="animate"
                whileHover={{ scale: 1.04 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-[#1A1A1A] border-2 border-transparent hover:border-[#E63946] p-6 transition-all flex flex-col justify-between space-y-4 h-full shadow-md"
                >
                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <CategoryIcon name={catName} slug={cat.slug} size="lg" />
                      <div>
                      <h3 className="font-serif-display text-lg font-bold text-[#FFFFFF] group-hover:-translate-y-0.5 transition-all duration-300">
                        {catName}
                      </h3>
                      <p className="text-xs text-[#CCCCCC] mt-1 font-mono">
                        {count} {t.itemsCount}
                      </p>
                      </div>
                    </div>
                  </div>
                  <span className="relative z-10 text-xs font-semibold text-[#FFFFFF] flex items-center gap-1 group-hover:text-[#E63946] transition-colors duration-300">
                    <span>{t.viewDepartment}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E63946] group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Collection (demoProducts where is_featured=true) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E0E0E0] pb-5"
        >
          <div className="border-l-[3px] border-[#E63946] pl-[10px]">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E63946] block mb-1 font-semibold">
              {t.sec2Kicker}
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1A1A] font-bold">
              {t.featuredCollection}
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs font-semibold text-[#E63946] hover:underline"
          >
            {t.exploreFullCatalog}
          </Link>
        </motion.div>

        <ProductGrid
          products={featuredProducts.slice(0, 8)}
          categories={categories}
        />
      </section>

      {/* New Arrivals (demoProducts sorted by created_at desc) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E0E0E0] pb-5"
        >
          <div className="border-l-[3px] border-[#E63946] pl-[10px]">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E63946] block mb-1 font-semibold">
              {t.sec3Kicker}
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1A1A] font-bold">
              {t.newArrivals}
            </h2>
          </div>
        </motion.div>

        <ProductGrid
          products={newArrivals.slice(0, 8)}
          categories={categories}
        />
      </section>

      {/* Sale Section (demoProducts where discount_percent > 0) */}
      {displaySale.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E0E0E0] pb-5"
          >
            <div className="border-l-[3px] border-[#E63946] pl-[10px]">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E63946] block mb-1 font-semibold">
                {t.sec4Kicker}
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1A1A] font-bold">
                {t.saleOffers}
              </h2>
            </div>
          </motion.div>

          <ProductGrid
            products={displaySale.slice(0, 8)}
            categories={categories}
          />
        </section>
      )}


    </div>
  );
};

export default HomePage;
