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
