import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  Truck,
  LogOut,
  Globe,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { CUSTOMER_TRANSLATIONS, getCategoryName } from "../../lib/i18n";
import { CustomerLanguage } from "../../types";
import { BrandLogo } from "../common/BrandLogo";

export const Navbar: React.FC = () => {
  const categories = useDataStore((s) => s.categories);
  const language = useDataStore((s) => s.language);
  const setLanguage = useDataStore((s) => s.setLanguage);
  const wishlist = useDataStore((s) => s.wishlist);

  const { user, logout } = useAuth();
  const { totalCount, setDrawerOpen } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [cartWiggle, setCartWiggle] = useState(false);
  const prevCountRef = useRef(totalCount);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (totalCount > prevCountRef.current) {
      setCartWiggle(true);
      const timer = window.setTimeout(() => setCartWiggle(false), 550);
      prevCountRef.current = totalCount;
      return () => window.clearTimeout(timer);
    }
    prevCountRef.current = totalCount;
  }, [totalCount]);

  const t = CUSTOMER_TRANSLATIONS[language];
  const activeCategories = [...categories]
    .filter((c) => c.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setSearchText("");
      setMobileOpen(false);
    }
  };

  const languageOptions: { code: CustomerLanguage; label: string }[] = [
    { code: "en", label: "English" },
    { code: "ur", label: "اردو" },
    { code: "roman_ur", label: "Roman Urdu" },
  ];

  const announcementMessage =
    language === "ur"
      ? "پورے پاکستان میں کیش آن ڈیلیوری، جیز کیش اور ایزی پیسہ دستیاب ہے"
      : language === "roman_ur"
      ? "Poore Pakistan mein Cash on Delivery, JazzCash aur EasyPaisa dastiyab hai"
      : "Nationwide Delivery Across Pakistan · Cash on Delivery, JazzCash & EasyPaisa";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-40 bg-[#FFFFFF] border-b-2 border-[#E63946] transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      {/* Top Announcement & Customer Language Switcher Bar */}
      <div className="bg-[#1A1A1A] text-[#FFFFFF] text-[10px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#333333]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <p className="hidden sm:block font-medium tracking-wide truncate text-[#CCCCCC]">
            {announcementMessage}
          </p>

          <div className="flex items-center gap-3 ml-auto">
            <div
              className="inline-flex items-center bg-[#2A2A2A] border border-[#333333] rounded px-1.5 py-0.5"
              role="group"
              aria-label="Customer website language"
            >
              <Globe className="w-3.5 h-3.5 text-[#E63946] mx-1" />
              {languageOptions.map((opt, idx) => (
                <React.Fragment key={opt.code}>
                  {idx > 0 && <span className="text-[#666666] px-0.5">|</span>}
                  <button
                    type="button"
                    onClick={() => setLanguage(opt.code)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      language === opt.code
                        ? "bg-[#E63946] text-[#FFFFFF] font-semibold"
                        : "text-[#CCCCCC] hover:text-[#FFFFFF]"
                    }`}
                  >
                    {opt.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 h-[68px] sm:h-24 lg:h-40 flex items-center justify-between gap-1.5 sm:gap-3 bg-[#FFFFFF]">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[#1A1A1A] hover:text-[#E63946]"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <Link to="/" aria-label="ARTS APPAREL Home">
            <BrandLogo size="lg" variant="light" />
          </Link>
        </div>

        {/* Desktop Category Links */}
        <nav className="hidden lg:flex items-center gap-1 shrink">
          <Link
            to="/"
            className={`text-xs uppercase tracking-[0.12em] px-3 py-2 rounded-[6px] font-semibold transition-colors ${
              location.pathname === "/"
                ? "bg-[#E63946] text-[#FFFFFF]"
                : "text-[#1A1A1A] hover:text-[#E63946]"
            }`}
          >
            <span>{t.home}</span>
          </Link>

          {activeCategories.map((cat) => {
            const active = location.pathname === `/category/${cat.slug}`;
            const catName = getCategoryName(cat, language);
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`text-xs uppercase tracking-[0.12em] px-3 py-2 rounded-[6px] font-semibold transition-colors ${
                  active
                    ? "bg-[#E63946] text-[#FFFFFF]"
                    : "text-[#1A1A1A] hover:text-[#E63946]"
                }`}
              >
                <span>{catName}</span>
              </Link>
            );
          })}

          <Link
            to="/track"
            className={`text-xs uppercase tracking-[0.12em] px-3 py-2 rounded-[6px] flex items-center gap-1.5 font-semibold transition-colors ${
              location.pathname === "/track"
                ? "bg-[#E63946] text-[#FFFFFF]"
                : "text-[#1A1A1A] hover:text-[#E63946]"
            }`}
          >
            <Truck
              className={`w-3.5 h-3.5 ${
                location.pathname === "/track"
                  ? "text-[#FFFFFF]"
                  : "text-[#E63946]"
              }`}
            />
            <span>{t.orderTracking}</span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center relative"
          >
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-[6px] focus:border-2 focus:border-[#E63946] text-xs text-[#1A1A1A] px-3 py-2 pr-8 w-44 lg:w-52 focus:outline-none transition-colors placeholder:text-[#999999]"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              aria-label={t.searchGo}
              className="absolute right-2.5 text-[#1A1A1A] hover:text-[#E63946]"
            >
              <Search size={18} />
            </motion.button>
          </form>

          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="inline-flex"
          >
            <Link
              to="/account/wishlist"
              aria-label={t.wishlist}
              className="relative p-2 text-[#1A1A1A] hover:text-[#E63946] transition-colors"
            >
              <Heart size={20} />
              <AnimatePresence mode="popLayout">
                {wishlist.length > 0 && (
                  <motion.span
                    key={wishlist.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-0.5 -right-0.5 bg-[#E63946] text-[#FFFFFF] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>

          {user && user.role !== "admin" ? (
            <div className="flex items-center gap-1.5">
              <Link
                to="/account"
                className="p-2 text-[#1A1A1A] hover:text-[#E63946] transition-colors flex items-center gap-1.5 text-xs"
                title={user.full_name}
              >
                <User size={20} className="text-[#1A1A1A]" />
                <span className="hidden xl:inline max-w-[100px] truncate text-[#1A1A1A] font-semibold">
                  {user.full_name}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="p-2 text-[#666666] hover:text-[#E63946] transition-colors"
                title={t.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          <motion.button
            type="button"
            onClick={() => setDrawerOpen(true)}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            animate={
              cartWiggle
                ? { rotate: [-10, 10, -10, 10, 0] }
                : { rotate: 0 }
            }
            transition={{ duration: 0.4 }}
            aria-label={t.shoppingBag}
            className="relative p-2 text-[#1A1A1A] hover:text-[#E63946] transition-colors"
          >
            <ShoppingCart size={20} />
            <AnimatePresence mode="popLayout">
              {totalCount > 0 && (
                <motion.span
                  key={totalCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-0.5 -right-0.5 bg-[#E63946] text-[#FFFFFF] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {totalCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Slide-In From Left */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="lg:hidden bg-[#FFFFFF] border-t border-[#E0E0E0] border-b-2 border-b-[#E63946] px-4 pt-3 pb-6 space-y-4 overflow-hidden shadow-lg"
          >
            <form onSubmit={handleSearch} className="flex items-center relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-[6px] text-sm text-[#1A1A1A] px-3 py-2.5 pr-10 w-full focus:border-2 focus:border-[#E63946] focus:outline-none placeholder:text-[#999999]"
              />
              <button type="submit" className="absolute right-3 text-[#1A1A1A] hover:text-[#E63946]">
                <Search size={18} />
              </button>
            </form>

            <div className="grid grid-cols-1 gap-2">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className={`py-2.5 px-3 rounded-[6px] text-sm font-semibold border ${
                  location.pathname === "/"
                    ? "bg-[#E63946] text-[#FFFFFF] border-[#E63946]"
                    : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946]"
                }`}
              >
                {t.home}
              </Link>
              {activeCategories.map((cat) => {
                const catName = getCategoryName(cat, language);
                const active = location.pathname === `/category/${cat.slug}`;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className={`py-2.5 px-3 rounded-[6px] flex items-center justify-between text-sm font-semibold border ${
                      active
                        ? "bg-[#E63946] text-[#FFFFFF] border-[#E63946]"
                        : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946]"
                    }`}
                  >
                    <span>{catName}</span>
                  </Link>
                );
              })}
              <Link
                to="/track"
                onClick={() => setMobileOpen(false)}
                className={`py-2.5 px-3 rounded-[6px] flex items-center justify-between text-sm font-semibold border ${
                  location.pathname === "/track"
                    ? "bg-[#E63946] text-[#FFFFFF] border-[#E63946]"
                    : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946]"
                }`}
              >
                <span>{t.orderTracking}</span>
                <Truck
                  className={`w-4 h-4 ${
                    location.pathname === "/track"
                      ? "text-[#FFFFFF]"
                      : "text-[#E63946]"
                  }`}
                />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
