import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Award } from "lucide-react";
import { motion } from "framer-motion";
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

  const heroBanner = activeBanners[0];
  const heroTitle = getBannerTitle(heroBanner, language);
  const heroSubtitle = getBannerSubtitle(heroBanner, language);
  const heroWords = heroTitle.split(/\s+/);

  return (
    <div className="space-y-20 pb-12 bg-[#FFFFFF]">
      {/* HERO SECTION: bg #1A1A1A, Heading #FFFFFF, Accent words #E63946, Subheading #CCCCCC, Primary CTA bg #E63946 text #FFFFFF, Secondary CTA border 2px #FFFFFF text #FFFFFF bg transparent, Tag above heading bg #E63946 text #FFFFFF */}
      <section className="hero-gradient-mesh relative min-h-[78vh] flex items-center border-b-2 border-[#E63946] overflow-hidden bg-[#1A1A1A]">
        {heroBanner && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={heroBanner.image_url}
              alt={heroTitle}
              loading="lazy"
              className="w-full h-full object-cover object-center opacity-20 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/90 to-transparent" />
          </div>
        )}

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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* Tag/label above heading: bg #E63946, color #FFFFFF */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] text-xs uppercase tracking-[0.18em] font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFFFFF]" />
              <span>{t.heroBadge}</span>
            </motion.div>

            {/* Heading: #FFFFFF, Accent words: #E63946 */}
            <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#FFFFFF] leading-[1.12] flex flex-wrap gap-x-3 gap-y-1">
              {heroWords.map((word, idx) => (
                <motion.span
                  key={`${word}-${idx}`}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className={
                    word.toLowerCase().includes("sharp") ||
                    word.toLowerCase().includes("shaan")
                      ? "text-[#E63946]"
                      : "text-[#FFFFFF]"
                  }
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subheading/paragraph: color #CCCCCC */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-[#CCCCCC] text-base sm:text-lg max-w-xl leading-relaxed"
            >
              {heroSubtitle}
            </motion.p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary CTA button: bg #E63946, color #FFFFFF */}
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Link
                  to={heroBanner?.link_url || "/category/kurta-shalwar"}
                  className="btn-primary-futuristic group relative px-8 py-4 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs uppercase tracking-[0.18em] hover:bg-[#C1121F] transition-all flex items-center gap-3"
                >
                  <span>{t.shopNow}</span>
                  <ArrowRight className="w-4 h-4 text-[#FFFFFF] group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Secondary CTA button: border 2px #FFFFFF, color #FFFFFF, bg transparent */}
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Link
                  to="/signup?tab=agent"
                  className="px-7 py-4 rounded-[6px] border-2 border-[#FFFFFF] text-[#FFFFFF] bg-transparent hover:bg-[#FFFFFF] hover:text-[#1A1A1A] text-xs uppercase tracking-[0.18em] transition-colors font-semibold inline-block"
                >
                  {t.joinAgentNetwork}
                </Link>
              </motion.div>
            </div>
          </div>

          {heroBanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotateY: -8 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="rounded-xl border-2 border-[#E63946] p-3 bg-[#1A1A1A] shadow-2xl overflow-hidden">
                <img
                  src={heroBanner.image_url}
                  alt={heroTitle}
                  loading="lazy"
                  className="w-full aspect-[4/5] rounded-lg object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Categories Showcase — Card bg: #1A1A1A, Category name: #FFFFFF, Border: 2px solid transparent, Hover border: 2px solid #E63946 */}
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
              (p) => p.category_id === cat.id
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
                  <div className="relative z-10">
                    <h3 className="font-serif-display text-lg font-bold text-[#FFFFFF] group-hover:-translate-y-0.5 transition-all duration-300">
                      {catName}
                    </h3>
                    <p className="text-xs text-[#CCCCCC] mt-1 font-mono">
                      {count} {t.itemsCount}
                    </p>
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

      {/* Featured Collection */}
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
          products={featuredProducts.slice(0, 4)}
          categories={categories}
        />
      </section>

      {/* New Arrivals */}
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
          products={newArrivals.slice(0, 4)}
          categories={categories}
        />
      </section>

      {/* Luxury Sale & Special Offers */}
      {saleProducts.length > 0 && (
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
            products={saleProducts.slice(0, 4)}
            categories={categories}
          />
        </section>
      )}

      {/* Partner Agent Network Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-[#1A1A1A] border-2 border-[#E63946] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl"
        >
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E63946] font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-[#E63946]" />
              <span>{t.sec5Kicker}</span>
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
              {t.partnerHeading}
            </h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              {t.partnerSub}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Link
                to="/signup?tab=agent"
                className="btn-primary-futuristic inline-block px-6 py-3.5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs uppercase tracking-wider hover:bg-[#C1121F]"
              >
                {t.applyAgentAccount}
              </Link>
            </motion.div>
            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Link
                to="/team"
                className="inline-block px-6 py-3.5 rounded-[6px] border-2 border-[#FFFFFF] text-[#FFFFFF] font-semibold text-xs uppercase tracking-wider hover:bg-[#FFFFFF] hover:text-[#1A1A1A] transition-colors"
              >
                {t.openAgentDashboard}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
