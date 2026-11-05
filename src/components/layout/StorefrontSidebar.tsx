import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home, LayoutGrid, ShoppingBag, ShoppingCart, Package, Heart,
  UserRound, Truck, MessageCircle, Info, Phone, X, ChevronRight,
} from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { useCart } from "../../hooks/useCart";
import { formatPKR } from "../../lib/utils";
import { getCategoryName } from "../../lib/i18n";
import { useDataStore as useLanguageStore } from "../../store/dataStore";

const StorefrontSidebar: React.FC = () => {
  const location = useLocation();
  const categories = useDataStore((s) => s.categories)
    .filter((category) => category.is_active)
    .sort((a, b) => a.display_order - b.display_order);
  const language = useLanguageStore((s) => s.language);
  const siteSettings = useDataStore((s) => s.siteSettings);
  const facebookUrl = siteSettings.facebook_url?.trim() || "https://www.facebook.com/share/1E3Yv7ro6S/";
  const tiktokUrl = siteSettings.tiktok_url?.trim() || "https://www.tiktok.com/@artsapparel3?_r=1&_t=ZS-9AzeKQChL6N";
  const { totalCount, totals, setDrawerOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const openFromSwipe = (event: React.TouchEvent) => {
    if (touchStartX !== null && event.changedTouches[0].clientX - touchStartX > 45) setMobileOpen(true);
    setTouchStartX(null);
  };
  const closeFromSwipe = (event: React.TouchEvent) => {
    if (touchStartX !== null && touchStartX - event.changedTouches[0].clientX > 65) closeMobile();
    setTouchStartX(null);
  };

  const closeMobile = () => setMobileOpen(false);
  const active = (path: string) => location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path + "/"));
  const navClass = (path: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active(path)
      ? "bg-[#FFF0F1] text-[#C1121F]"
      : "text-[#555555] hover:bg-[#F5F5F5] hover:text-[#C1121F]"}`;

  const content = (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#EEEEEE] px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#999999]">Shop navigation</p>
        <h2 className="mt-1 font-serif-display text-lg font-bold text-[#1A1A1A]">Explore ARTS</h2>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <section>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0A0A0]">Main menu</p>
          <nav className="space-y-1">
            <Link to="/" onClick={closeMobile} className={navClass("/")}>
              <Home size={17} /><span>Home</span>
            </Link>
            <Link to="/search" onClick={closeMobile} className={navClass("/search")}>
              <LayoutGrid size={17} /><span>All products</span>
            </Link>
            <button type="button" onClick={() => { setDrawerOpen(true); closeMobile(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#555555] transition-colors hover:bg-[#F5F5F5] hover:text-[#C1121F]">
              <ShoppingCart size={17} /><span className="flex-1">Shopping bag</span>
              <span className="min-w-5 rounded-full bg-[#E63946] px-1.5 py-0.5 text-center text-[10px] font-bold text-white">{totalCount}</span>
            </button>
            <Link to="/account/wishlist" onClick={closeMobile} className={navClass("/account/wishlist")}>
              <Heart size={17} /><span>Wishlist</span>
            </Link>
          </nav>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0A0A0]">Categories</p>
            <ChevronRight size={13} className="text-[#BBBBBB]" />
          </div>
          <nav className="space-y-1">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`} onClick={closeMobile}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${active(`/category/${category.slug}`) ? "bg-[#FFF0F1] font-semibold text-[#C1121F]" : "text-[#555555] hover:bg-[#F5F5F5] hover:text-[#C1121F]"}`}>
                <span>{getCategoryName(category, language)}</span><ChevronRight size={14} className="text-[#BBBBBB]" />
              </Link>
            ))}
          </nav>
        </section>

        <section>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0A0A0]">Your account & support</p>
          <nav className="space-y-1">
            <Link to="/account" onClick={closeMobile} className={navClass("/account")}><UserRound size={17} /><span>My account</span></Link>
            <Link to="/account/orders" onClick={closeMobile} className={navClass("/account/orders")}><Package size={17} /><span>My orders</span></Link>
            <Link to="/track" onClick={closeMobile} className={navClass("/track")}><Truck size={17} /><span>Track an order</span></Link>
            <Link to="/assistant" onClick={closeMobile} className={navClass("/assistant")}><MessageCircle size={17} /><span>AI assistant</span></Link>
            <Link to="/about" onClick={closeMobile} className={navClass("/about")}><Info size={17} /><span>About us</span></Link>
            <Link to="/contact" onClick={closeMobile} className={navClass("/contact")}><Phone size={17} /><span>Contact</span></Link>
          </nav>
        </section>
      </div>

      <div className="border-t border-[#EEEEEE] bg-[#FAFAFA] p-4">
        <div className="rounded-xl border border-[#EEEEEE] bg-white p-3.5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold text-[#333333]"><ShoppingBag size={15} className="text-[#E63946]" />Order summary</span>
            <span className="text-[10px] text-[#888888]">{totalCount} items</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#777777]">
            <span>Subtotal</span><span className="font-mono font-semibold text-[#222222]">{formatPKR(totals.subtotal)}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link to="/cart" onClick={closeMobile} className="rounded-md border border-[#DDDDDD] py-2 text-center text-[11px] font-semibold text-[#333333] hover:border-[#E63946]">View bag</Link>
            <Link to="/checkout" onClick={closeMobile} className="rounded-md bg-[#E63946] py-2 text-center text-[11px] font-semibold text-white hover:bg-[#C1121F]">Checkout</Link>
          </div>
        </div>
        <div className="mt-4 border-t border-[#EEEEEE] pt-4">
          <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#999999]">Follow ARTS APPAREL</p>
          <div className="flex items-center justify-center gap-3">
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Open ARTS APPAREL Facebook page" className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1877F2] bg-[#1877F2] text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-[#166FE5]">
              <img src="https://cdn.simpleicons.org/facebook/FFFFFF" alt="" aria-hidden="true" width="21" height="21" loading="lazy" decoding="async" className="block object-contain" />
            </a>
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="Open ARTS APPAREL TikTok profile" className="flex h-10 w-10 items-center justify-center rounded-lg border border-black bg-black shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md">
              <img src="https://cdn.simpleicons.org/tiktok/FFFFFF" alt="" aria-hidden="true" width="22" height="22" loading="lazy" decoding="async" className="block object-contain" />
            </a>
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] leading-relaxed text-[#999999]">Nationwide delivery across Pakistan</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-[calc(100vh-0px)] w-[258px] shrink-0 border-r border-[#EAEAEA] bg-white lg:block">
        {content}
      </aside>

      {/* Mobile edge rail: swipe right or tap an icon to reveal the full sidebar */}
      <nav aria-label="Quick shop navigation" onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)} onTouchEnd={openFromSwipe}
        className="fixed left-0 top-1/2 z-[65] flex -translate-y-1/2 flex-col gap-1 rounded-r-2xl border border-l-0 border-[#E8E8E8] bg-white/95 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur lg:hidden">
        {[
          { to: "/", label: "Home", Icon: Home },
          { to: "/search", label: "Products", Icon: LayoutGrid },
          { to: "/cart", label: "Shopping bag", Icon: ShoppingCart },
          { to: "/account/wishlist", label: "Wishlist", Icon: Heart },
          { to: "/account", label: "My account", Icon: UserRound },
          { to: "/account/orders", label: "My orders", Icon: Package },
          { to: "/track", label: "Track order", Icon: Truck },
          { to: "/assistant", label: "AI assistant", Icon: MessageCircle },
        ].map(({ to, label, Icon }) => (
          <button key={to} type="button" aria-label={label} title={label}
            onClick={() => { if (to === "/cart") setDrawerOpen(true); else window.location.href = to; }}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${active(to) ? "bg-[#FFF0F1] text-[#C1121F]" : "text-[#555555] hover:bg-[#F5F5F5]"}`}>
            <Icon size={19} />
            {to === "/cart" && totalCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E63946] px-1 text-[9px] font-bold text-white">{totalCount}</span>}
          </button>
        ))}
        <span className="my-0.5 h-px bg-[#EEEEEE]" />
        <button type="button" onClick={() => setMobileOpen(true)} aria-label="Expand full sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A1A1A] text-white">
          <ChevronRight size={20} />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[70] bg-black/35 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMobile}>
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(event) => event.stopPropagation()} onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)} onTouchEnd={closeFromSwipe}
              className="flex h-full w-[min(86vw,320px)] flex-col border-r border-[#EEEEEE] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#EEEEEE] px-4 py-3">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#888888]">ARTS APPAREL MENU</span>
                <button type="button" onClick={closeMobile} aria-label="Close sidebar" className="rounded-lg p-2 text-[#555555] hover:bg-[#F5F5F5]"><X size={20} /></button>
              </div>
              {content}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StorefrontSidebar;
