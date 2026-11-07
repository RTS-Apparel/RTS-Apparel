import React from "react";
import {
  Shirt,
  Footprints,
  Layers3,
  Wind,
  BriefcaseBusiness,
  Baby,
  Watch,
  ShoppingBag,
  Package,
  Gem,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const iconByCategory: Array<{ terms: string[]; Icon: LucideIcon }> = [
  { terms: ["shirt", "shirts", "t-shirt", "tshirt", "tee", "polo", "formal-wear", "casual-wear"], Icon: Shirt },
  { terms: ["trouser", "trousers", "pant", "pants", "jean", "jeans", "bottom", "bottomwear", "chino", "cargo"], Icon: Footprints },
  { terms: ["kurta", "shalwar", "kameez", "shalwar-kameez", "ethnic", "traditional", "eastern-wear"], Icon: Layers3 },
  { terms: ["hoodie", "hoodies", "sweatshirt", "sweater", "winterwear", "winter-wear", "fleece"], Icon: Wind },
  { terms: ["jacket", "jackets", "coat", "coats", "outerwear", "blazer"], Icon: BriefcaseBusiness },
  { terms: ["kid", "kids", "child", "children", "baby", "boys", "girls"], Icon: Baby },
  { terms: ["watch", "watches", "accessory", "accessories"], Icon: Watch },
  { terms: ["bag", "bags", "cap", "caps", "hat", "hats", "shoe", "shoes", "footwear", "sneaker"], Icon: ShoppingBag },
  { terms: ["perfume", "fragrance", "beauty", "cosmetic"], Icon: Gem },
  { terms: ["home", "lifestyle", "collection", "other", "others"], Icon: Package },
];

export const CategoryIcon: React.FC<{
  name?: string | null;
  slug?: string | null;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}> = ({ name = "", slug = "", size = "md", animated = true, className = "" }) => {
  const key = `${slug} ${name}`.toLowerCase().replace(/[_-]+/g, " ").replace(/[^a-z0-9 ]/g, " ");
  const words = key.split(/\s+/).filter(Boolean);
  const match = iconByCategory.find(({ terms }) =>
    terms.some((term) => key.includes(term.replace(/[_-]+/g, " ")) || words.includes(term)),
  );
  const Icon = match?.Icon || Tag;
  const categoryImage =
    /\b(shirt|shirts|t-shirt|tshirt|tee|polo)\b/.test(key) ? "/images/categories/shirts.webp" :
    /\b(trouser|trousers|pant|pants|jean|jeans|bottom|chino|cargo)\b/.test(key) ? "/images/categories/trousers.webp" :
    /\b(kurta|shalwar|kameez|ethnic|traditional|eastern)\b/.test(key) ? "/images/categories/kurta-shalwar.webp" :
    /\b(hoodie|hoodies|sweatshirt|sweater|winterwear|fleece)\b/.test(key) ? "/images/categories/hoodies.webp" :
    /\b(jacket|jackets|coat|coats|outerwear|blazer)\b/.test(key) ? "/images/categories/jackets.webp" : null;
  const dimensions = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const glyph = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5";
  const content = (
    <span className={`relative inline-flex ${dimensions} shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E63946]/20 bg-gradient-to-br from-[#FFF7F7] to-[#FFE5E7] text-[#D62839] shadow-sm ${className}`}>
      <span className="pointer-events-none absolute inset-1 rounded-lg border border-white/90" />
      {categoryImage ? <img src={categoryImage} alt="" className="relative z-10 h-full w-full object-cover" loading="lazy" /> : <Icon className={`${glyph} relative z-10`} strokeWidth={1.8} aria-hidden="true" />}
    </span>
  );
  if (!animated) return content;
  return (
    <motion.span
      className="inline-flex"
      whileHover={{ y: -3, rotate: -3, scale: 1.06 }}
      transition={{ type: "spring", stiffness: 320, damping: 16 }}
    >
      {content}
    </motion.span>
  );
};

export default CategoryIcon;
