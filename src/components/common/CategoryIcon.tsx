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
  Footprints,
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
