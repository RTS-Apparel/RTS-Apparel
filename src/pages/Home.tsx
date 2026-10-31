import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Users2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import { useDataStore } from "../store/dataStore";
import { ProductGrid } from "../components/products/ProductGrid";
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

const HERO_PARTICLES = [
  { id: 1, left: "8%", top: "16%", color: "#E63946", duration: 9, delay: 0 },
  { id: 2, left: "22%", top: "74%", color: "#FFFFFF", duration: 11, delay: 1 },
  { id: 3, left: "38%", top: "22%", color: "#E63946", duration: 10, delay: 0.5 },
  { id: 4, left: "52%", top: "82%", color: "#FFFFFF", duration: 12, delay: 1.5 },
  { id: 5, left: "66%", top: "28%", color: "#E63946", duration: 10.5, delay: 0.8 },
  { id: 6, left: "78%", top: "68%", color: "#FFFFFF", duration: 11.5, delay: 2 },
  { id: 7, left: "88%", top: "18%", color: "#E63946", duration: 9.5, delay: 1.2 },
  { id: 8, left: "93%", top: "78%", color: "#E63946", duration: 12.5, delay: 0.3 },
];

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
          created_at: "2024-11-01T00:00:00Z",
        }));

  const [currentSlide, setCurrentSlide] = useState(0);
  const [failedBannerImgs, setFailedBannerImgs] = useState<Record<string, boolean>>({});

  // Auto-play 4s slider
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
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
    <div className="space-y-20 pb-12 bg-[#FFFFFF]">
      {/* HERO SLIDER SECTION: 3 slides from demoBanners, auto-play 4s, #1A1A1A bg, #FFFFFF & #E63946 text */}
      <section className="hero-gradient-mesh relative min-h-[78vh] flex items-center border-b-2 border-[#E63946] overflow-hidden bg-[#1A1A1A]">
        <AnimatePresence mode="wait">
          {heroBanner && (
            <motion.div
              key={`bg-${heroBanner.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 overflow-hidden"
            >
              {!failedBannerImgs[heroBanner.image_url] && (
                <img
                  src={heroBanner.image_url}
                  alt={heroTitle}
                  loading="lazy"
                  onError={() =>
                    setFailedBannerImgs((prev) => ({
                      ...prev,
                      [heroBanner.image_url]: true,
                    }))
                  }
                  className="w-full h-full object-cover object-center opacity-25 scale-105 transition-transform duration-1000"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/90 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle Floating Dots */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {HERO_PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              style={{
                left: p.left,
                top: p.top,
                width: 4,
                height: 4,
                backgroundColor: p.color,
              }}
              animate={{
                y: [0, -28, 12, 0],
                x: [0, 16, -12, 0],
                opacity: [0.25, 0.4, 0.2, 0.25],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute rounded-full opacity-25"
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
          <div className="lg:col-span-7 space-y-6">
            {/* Tag/label above heading */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] text-xs uppercase tracking-[0.18em] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#FFFFFF]" />
              <span>{t.heroBadge}</span>
            </div>

            {/* Slide Heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${heroBanner?.id || currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#FFFFFF] leading-[1.12] flex flex-wrap gap-x-3 gap-y-1">
                  {heroWords.map((word, idx) => (
                    <span
                      key={`${word}-${idx}`}
                      className={
                        idx === heroWords.length - 1 ||
                        word.toLowerCase().includes("special") ||
                        word.toLowerCase().includes("2024") ||
                        word.toLowerCase().includes("collection")
                          ? "text-[#E63946]"
                          : "text-[#FFFFFF]"
                      }
                    >
                      {word}
                    </span>
                  ))}
                </h1>

                <p className="text-[#CCCCCC] text-base sm:text-lg max-w-xl leading-relaxed">
                  {heroSubtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Link
                  to={heroBanner?.link_url || "/category/shirts"}
                  className="btn-primary-futuristic group relative px-8 py-4 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs uppercase tracking-[0.18em] hover:bg-[#C1121F] transition-all flex items-center gap-3"
                >
                  <span>{heroCta}</span>
                  <ArrowRight className="w-4 h-4 text-[#FFFFFF] group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Slider Controls & Dots */}
            {slides.length > 1 && (
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Slide ${idx + 1}: ${s.title || s.title_en}`}
                      className={`h-2.5 rounded-full transition-all ${
                        currentSlide === idx
                          ? "w-8 bg-[#E63946]"
                          : "w-2.5 bg-[#FFFFFF]/40 hover:bg-[#FFFFFF]"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? slides.length - 1 : prev - 1
                      )
                    }
                    aria-label="Previous slide"
                    className="p-2 rounded-[6px] bg-[#2A2A2A] text-[#FFFFFF] hover:bg-[#E63946] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSlide((prev) => (prev + 1) % slides.length)
                    }
                    aria-label="Next slide"
                    className="p-2 rounded-[6px] bg-[#2A2A2A] text-[#FFFFFF] hover:bg-[#E63946] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {heroBanner && (
            <div className="lg:col-span-5 hidden lg:block">
              <div className="rounded-xl border-2 border-[#E63946] p-3 bg-[#1A1A1A] shadow-2xl overflow-hidden">
                <AnimatePresence mode="wait">
                  {failedBannerImgs[heroBanner.image_url] ? (
                    <motion.div
                      key={`fallback-card-${heroBanner.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full aspect-[4/3] rounded-lg bg-[#1A1A1A] flex items-center justify-center p-6 text-center border border-[#333333]"
                    >
                      <span
                        className="text-[#FFFFFF] font-bold tracking-[0.18em] uppercase text-xl"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        ARTS APPAREL
                      </span>
                    </motion.div>
                  ) : (
                    <motion.img
                      key={`img-${heroBanner.id}`}
                      src={heroBanner.image_url}
                      alt={heroTitle}
                      loading="lazy"
                      onError={() =>
                        setFailedBannerImgs((prev) => ({
                          ...prev,
                          [heroBanner.image_url]: true,
                        }))
                      }
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="w-full aspect-[4/3] rounded-lg object-cover hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
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
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
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
                    <div>
                      <h3 className="font-serif-display text-lg font-bold text-[#FFFFFF] group-hover:-translate-y-0.5 transition-all duration-300">
                        {catName}
                      </h3>
                      <p className="text-xs text-[#CCCCCC] mt-1 font-mono">
                        {count} {t.itemsCount}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E63946] text-[#FFFFFF] text-xs font-mono font-bold shrink-0">
                      {count}
                    </span>
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
