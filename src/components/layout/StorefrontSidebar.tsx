import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home, LayoutGrid, ShoppingBag, ShoppingCart, Package, Heart,
  UserRound, Truck, MessageCircle, Info, Phone, Menu, X, ChevronRight,
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.35 21v-8.2h2.76l.41-3.2h-3.17V7.56c0-.93.26-1.56 1.59-1.56h1.69V3.14c-.29-.04-1.3-.14-2.47-.14-2.45 0-4.13 1.5-4.13 4.25V9.6H7.25v3.2h2.78V21h3.32z"/></svg>
            </a>
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="Open ARTS APPAREL TikTok profile" className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDDDDD] bg-white text-[#444444] transition-colors hover:border-black hover:bg-black hover:text-white">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
              </svg>
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

      <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open shop sidebar"
        className="fixed bottom-5 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1A1A] text-white shadow-xl ring-2 ring-white lg:hidden">
        <Menu size={21} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[70] bg-black/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMobile}>
            <motion.aside initial={{ x: -310 }} animate={{ x: 0 }} exit={{ x: -310 }} transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(event) => event.stopPropagation()} className="flex h-full w-[min(86vw,320px)] flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-end border-b border-[#EEEEEE] px-4 py-2">
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
