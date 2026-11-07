import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Truck,
  LogOut,
  Globe,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { CUSTOMER_TRANSLATIONS, getCategoryName } from "../../lib/i18n";
import { CustomerLanguage } from "../../types";
import { BrandLogo } from "../common/BrandLogo";

export const Navbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const categories = useDataStore((s) => s.categories);
  const whatsappNumber = useDataStore((s) => s.siteSettings.whatsapp_number);
  const language = useDataStore((s) => s.language);
  const setLanguage = useDataStore((s) => s.setLanguage);
  const wishlist = useDataStore((s) => s.wishlist);

  const { user, logout } = useAuth();
  const { totalCount, setDrawerOpen } = useCart();

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
    }
  };

  const whatsappDigits = (whatsappNumber || "03058165623").replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappDigits.startsWith("0") ? `92${whatsappDigits.slice(1)}` : whatsappDigits}`;

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

          <div className="flex items-center gap-2 sm:gap-3 ml-auto min-w-0">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-8 items-center gap-1.5 whitespace-nowrap rounded-sm px-1 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-white transition-colors hover:text-[#E63946] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946] shrink-0"
              aria-label="Contact us on WhatsApp"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0 text-[#25D366]"
                fill="currentColor"
              >
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.96L.05 24l6.27-1.64a11.9 11.9 0 0 0 5.75 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.19-3.49-8.42ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.86 9.86 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.46-4.44 9.9-9.91 9.9Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
              </svg>
              <span>Contact Us</span>
            </a>
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
                    className={`px-1.5 sm:px-2 py-1 rounded text-[10px] sm:text-[11px] whitespace-nowrap transition-colors ${
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
      <div className="max-w-7xl mx-auto w-full min-w-0 px-2 sm:px-4 lg:px-6 h-[68px] sm:h-24 lg:h-40 flex items-center justify-between gap-1.5 sm:gap-3 bg-[#FFFFFF]">
        <div className="flex min-w-0 items-center gap-1 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="relative z-50 inline-flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px] rounded-lg border-2 border-[#E63946] bg-[#1A1A1A] text-white shadow-md transition-all hover:bg-[#E63946] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946] focus-visible:ring-offset-2"
            aria-label="Open shop menu"
            title="Open shop menu"
          >
            <span className="block h-[2.5px] w-6 rounded-full bg-white" />
            <span className="block h-[2.5px] w-6 rounded-full bg-white" />
            <span className="block h-[2.5px] w-6 rounded-full bg-white" />
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {location.pathname !== "/" && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Go back"
                title="Go back"
                className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#E0E0E0] bg-white text-[#1A1A1A] hover:border-[#E63946] hover:bg-[#FFF5F5] hover:text-[#E63946] transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>
            )}
            <Link to="/" aria-label="ARTS APPAREL Home">
              <BrandLogo size="lg" variant="light" />
            </Link>
          </div>
        </div>

        {/* Desktop Category Links */}
        <nav className="hidden lg:flex min-w-0 items-center gap-1 shrink">
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
        <div className="flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-2.5">
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

    </motion.header>
  );
};

export default Navbar;
