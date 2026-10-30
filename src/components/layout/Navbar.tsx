import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Truck,
  Award,
  LogOut,
  Globe,
  Heart,
} from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { CUSTOMER_TRANSLATIONS, getCategoryName } from "../../lib/i18n";
import { CustomerLanguage } from "../../types";

export const Navbar: React.FC = () => {
  const categories = useDataStore((s) => s.categories);
  const language = useDataStore((s) => s.language);
  const setLanguage = useDataStore((s) => s.setLanguage);
  const wishlist = useDataStore((s) => s.wishlist);

  const { user, logout } = useAuth();
  const { totalCount, setDrawerOpen } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E8E0D0]">
      {/* Top Announcement & Customer Language Switcher Bar (NO Admin Links) */}
      <div className="bg-[#F5F4F0] text-[#1A1A1A] text-xs py-2 px-4 border-b border-[#E8E0D0]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium tracking-wide truncate">
            {announcementMessage}
          </p>

          <div className="flex items-center gap-3 ml-auto">
            {/* Language Switcher: 🌐 English | اردو | Roman Urdu */}
            <div
              className="inline-flex items-center bg-white border border-[#E8E0D0] rounded px-1.5 py-0.5"
              role="group"
              aria-label="Customer website language"
            >
              <Globe className="w-3.5 h-3.5 text-[#C9A84C] mx-1" />
              {languageOptions.map((opt, idx) => (
                <React.Fragment key={opt.code}>
                  {idx > 0 && <span className="text-[#E8E0D0] px-0.5">|</span>}
                  <button
                    type="button"
                    onClick={() => setLanguage(opt.code)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      language === opt.code
                        ? "bg-[#C9A84C] text-[#1A1A1A] font-semibold"
                        : "text-[#4A4A4A] hover:text-[#C9A84C]"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[#4A4A4A] hover:text-[#C9A84C]"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <Link to="/" className="flex flex-col">
            <span className="font-serif-display text-2xl sm:text-3xl font-bold tracking-[0.22em] text-[#1A1A1A]">
              RTS APPAREL
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#4A4A4A] uppercase -mt-1">
              Lahore · Luxury Menswear
            </span>
          </Link>
        </div>

        {/* Desktop Category Links (Only Selected Language Shown) */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            to="/"
            className={`text-xs uppercase tracking-[0.15em] transition-colors ${
              location.pathname === "/"
                ? "text-[#C9A84C] font-semibold"
                : "text-[#4A4A4A] hover:text-[#C9A84C]"
            }`}
          >
            {t.home}
          </Link>
          {activeCategories.map((cat) => {
            const active = location.pathname === `/category/${cat.slug}`;
            const catName = getCategoryName(cat, language);
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`text-xs uppercase tracking-[0.15em] transition-colors py-1 border-b-2 ${
                  active
                    ? "border-[#C9A84C] text-[#C9A84C] font-semibold"
                    : "border-transparent text-[#4A4A4A] hover:text-[#C9A84C]"
                }`}
              >
                {catName}
              </Link>
            );
          })}
          <Link
            to="/track"
            className={`text-xs uppercase tracking-[0.15em] flex items-center gap-1 transition-colors ${
              location.pathname === "/track"
                ? "text-[#C9A84C] font-semibold"
                : "text-[#4A4A4A] hover:text-[#C9A84C]"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t.orderTracking}</span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center relative"
          >
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="bg-[#FAFAFA] border border-[#E8E0D0] rounded-lg focus:border-[#C9A84C] text-xs text-[#1A1A1A] px-3 py-2 pr-8 w-44 lg:w-52 focus:outline-none transition-colors placeholder:text-[#9A9A9A]"
            />
            <button
              type="submit"
              aria-label={t.searchGo}
              className="absolute right-2.5 text-[#4A4A4A] hover:text-[#C9A84C]"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {user?.role === "agent" && (
            <Link
              to="/team"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#C9A84C]/10 border border-[#C9A84C] text-[#9B7B2F] hover:bg-[#C9A84C] hover:text-[#1A1A1A] transition-colors font-semibold"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{t.agentHub}</span>
            </Link>
          )}

          <Link
            to="/account/wishlist"
            aria-label={t.wishlist}
            className="relative p-2 text-[#4A4A4A] hover:text-[#C9A84C] transition-colors hidden sm:inline-flex"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C9A84C] text-[#1A1A1A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {user && user.role !== "admin" ? (
            <div className="flex items-center gap-1.5">
              <Link
                to="/account"
                className="p-2 text-[#4A4A4A] hover:text-[#C9A84C] transition-colors flex items-center gap-1.5 text-xs"
                title={user.full_name}
              >
                <User className="w-5 h-5 text-[#C9A84C]" />
                <span className="hidden xl:inline max-w-[100px] truncate text-[#1A1A1A] font-medium">
                  {user.full_name}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="p-2 text-[#9A9A9A] hover:text-red-600 transition-colors"
                title={t.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="p-2 text-[#4A4A4A] hover:text-[#C9A84C] transition-colors flex items-center gap-1 text-xs uppercase tracking-wider font-medium"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">{t.signIn}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={t.shoppingBag}
            className="relative p-2 text-[#1A1A1A] hover:text-[#C9A84C] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C9A84C] text-[#1A1A1A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#FAFAFA] border-b border-[#E8E0D0] px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex items-center relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="bg-[#FFFFFF] border border-[#E8E0D0] rounded-lg text-sm text-[#1A1A1A] px-3 py-2.5 pr-10 w-full focus:border-[#C9A84C] focus:outline-none"
            />
            <button type="submit" className="absolute right-3 text-[#C9A84C]">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-1 gap-2">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="py-2 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm text-[#1A1A1A]"
            >
              {t.home}
            </Link>
            {activeCategories.map((cat) => {
              const catName = getCategoryName(cat, language);
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] flex items-center justify-between text-sm text-[#1A1A1A] hover:border-[#C9A84C]"
                >
                  <span>{catName}</span>
                </Link>
              );
            })}
            <Link
              to="/track"
              onClick={() => setMobileOpen(false)}
              className="py-2 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] flex items-center justify-between text-sm text-[#C9A84C]"
            >
              <span>{t.orderTracking}</span>
              <Truck className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
