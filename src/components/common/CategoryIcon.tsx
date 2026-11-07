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
  Tag,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const iconByCategory: Array<{ terms: string[]; Icon: LucideIcon }> = [
  { terms: ["shirt", "tee", "t-shirt", "tshirt", "polo"], Icon: Shirt },
  { terms: ["trouser", "pant", "jean", "bottom"], Icon: Footprints },
  { terms: ["kurta", "shalwar", "traditional", "ethnic"], Icon: Layers3 },
  { terms: ["hoodie", "sweatshirt", "sweater", "winter"], Icon: Wind },
  { terms: ["jacket", "coat", "outerwear"], Icon: BriefcaseBusiness },
  { terms: ["kid", "child", "baby"], Icon: Baby },
  { terms: ["watch", "accessory", "accessories"], Icon: Watch },
  { terms: ["bag", "cap", "hat", "shoe", "footwear"], Icon: ShoppingBag },
];

export const CategoryIcon: React.FC<{
  name?: string | null;
  slug?: string | null;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}> = ({ name = "", slug = "", size = "md", animated = true, className = "" }) => {
  const key = `${slug} ${name}`.toLowerCase().replace(/[_-]+/g, " ");
  const match = iconByCategory.find(({ terms }) => terms.some((term) => key.includes(term)));
  const Icon = match?.Icon || Tag;
  const dimensions = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const glyph = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5";
  const content = (
    <span className={`relative inline-flex ${dimensions} shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E63946]/20 bg-gradient-to-br from-[#FFF7F7] to-[#FFE5E7] text-[#D62839] shadow-sm ${className}`}>
      <span className="pointer-events-none absolute inset-1 rounded-lg border border-white/90" />
      <Icon className={`${glyph} relative z-10`} strokeWidth={1.8} aria-hidden="true" />
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
