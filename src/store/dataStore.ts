import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AdminLanguage,
  Banner,
  Category,
  Commission,
  CommissionStatus,
  CustomerLanguage,
  DeliveryRate,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Product,
  SavedAddress,
  SiteSettings,
  User,
  WithdrawalRequest,
} from "../types";
import { PRODUCT_ARTWORKS } from "../lib/artworks";
import {
  formatOrderNumber,
  generateReferralCode,
  getEffectiveDiscountPercent,
  slugify,
} from "../lib/utils";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "info";
}

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-kurta",
    name_en: "Kurta Shalwar",
    name_ur: "کرتہ شلوار",
    name_roman_ur: "Shahi Kurta Shalwar",
    slug: "kurta-shalwar",
    display_order: 1,
    discount_percent: 10,
    is_active: true,
  },
  {
    id: "cat-shirts",
    name_en: "Shirts",
    name_ur: "شرٹس",
    name_roman_ur: "Formal Shirts",
    slug: "shirts",
    display_order: 2,
    discount_percent: 0,
    is_active: true,
  },
  {
    id: "cat-trousers",
    name_en: "Trousers",
    name_ur: "ٹراؤزر",
    name_roman_ur: "Tailored Trousers",
    slug: "trousers",
    display_order: 3,
    discount_percent: 5,
    is_active: true,
  },
  {
    id: "cat-jackets",
    name_en: "Jackets",
    name_ur: "جیکٹس",
    name_roman_ur: "Suede & Leather Jackets",
    slug: "jackets",
    display_order: 4,
    discount_percent: 15,
    is_active: true,
  },
  {
    id: "cat-hoodies",
    name_en: "Hoodies",
    name_ur: "ہوڈیز",
    name_roman_ur: "Luxury Hoodies",
    slug: "hoodies",
    display_order: 5,
    discount_percent: 0,
    is_active: true,
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name_en: "Obsidian Zari Karandi Kurta Shalwar",
    name_ur: "شاہی سیاہ زری کرنڈی کرتہ شلوار",
    name_roman_ur: "Shahi Siyah Zari Karandi Kurta Shalwar",
    description_en:
      "Hand-loomed winter Karandi kurta in deep obsidian black featuring metallic gold tilla embroidery along the Mandarin collar and concealed placket. Paired with a tailored straight-cut shalwar.",
    description_ur:
      "خالص کرنڈی فیبرک میں تیار کردہ شاہی سیاہ کرتہ شلوار، جس کے کالر اور پٹی پر سنہری تلا کڑھائی کی گئی ہے۔ شادی اور تقریبات کے لیے بہترین انتخاب۔",
    description_roman_ur:
      "Khalis winter Karandi fabric mein tayyar karda shahi siyah Kurta Shalwar, collar aur placket par sunehri tilla karhai ke sath.",
    category_id: "cat-kurta",
    price: 12500,
    discount_percent: 20,
    images: [PRODUCT_ARTWORKS.kurtaObsidian, PRODUCT_ARTWORKS.kurtaIvory],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Obsidian Black", "Midnight Gold"],
    stock: 28,
    is_active: true,
    is_featured: true,
    created_at: "2026-10-01T10:00:00Z",
  },
  {
    id: "prod-2",
    name_en: "Imperial Emerald Boski Silk Kurta Set",
    name_ur: "امپیریل زمرد بوسکی سلک کرتہ سیٹ",
    name_roman_ur: "Imperial Emerald Boski Silk Kurta Set",
    description_en:
      "Lustrous spun Boski silk-blend kurta in rich emerald green with brushed brass cuff buttons and tonal stitch detailing. Breathable drape crafted for formal evenings.",
    description_ur:
      "اعلیٰ معیار کے بوسکی سلک بلینڈ سے تیار کردہ زمرد سبز کرتہ شلوار، پیتل کے نفیس بٹنوں اور بہترین فٹنگ کے ساتھ۔",
    description_roman_ur:
      "Aala mayar ke Boski silk blend se tayyar karda emerald sabz Kurta Shalwar, brass cuff buttons aur shandar fitting ke sath.",
    category_id: "cat-kurta",
    price: 14800,
    discount_percent: 15,
    images: [PRODUCT_ARTWORKS.kurtaEmerald, PRODUCT_ARTWORKS.kurtaObsidian],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Emerald", "Deep Forest"],
    stock: 19,
    is_active: true,
    is_featured: true,
    created_at: "2026-10-04T12:00:00Z",
  },
  {
    id: "prod-3",
    name_en: "Sovereign Ivory Tilla Kurta Shalwar",
    name_ur: "سفید طلا کڑھائی مصری کاٹن کرتہ",
    name_roman_ur: "Safed Tilla Karhai Egyptian Cotton Kurta",
    description_en:
      "Crisp 100% Egyptian Giza cotton kurta in warm ivory accented with delicate gold resham embroidery on the collar edge. Engineered for Friday prayers and daytime festivities.",
    description_ur:
      "خالص مصری گیزا کاٹن میں تیار کردہ آئیوری سفید کرتہ شلوار، نفیس سنہری ریشم کڑھائی کے ساتھ۔",
    description_roman_ur:
      "100% Egyptian Giza cotton mein tayyar karda ivory safed Kurta Shalwar, nafees sunehri resham karhai ke sath.",
    category_id: "cat-kurta",
    price: 9800,
    discount_percent: 0,
    images: [PRODUCT_ARTWORKS.kurtaIvory, PRODUCT_ARTWORKS.kurtaObsidian],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Warm Ivory", "Sand Gold"],
    stock: 34,
    is_active: true,
    is_featured: false,
    created_at: "2026-10-08T09:00:00Z",
  },
  {
    id: "prod-4",
    name_en: "Noir Giza 120s Executive Dress Shirt",
    name_ur: "سیاہ مصری کاٹن ایگزیکٹو ڈریس شرٹ",
    name_roman_ur: "Siyah Egyptian Cotton Executive Dress Shirt",
    description_en:
      "Two-ply 120s Egyptian cotton formal shirt in jet black with gold-rimmed mother-of-pearl buttons, cutaway collar, and removable brass collar stays.",
    description_ur:
      "ٹو پلائی 120s مصری کاٹن سے بنی سیاہ فارمل شرٹ، سنہری کناروں والے بٹن اور پائیدار کالر کے ساتھ۔",
    description_roman_ur:
      "Two-ply 120s Egyptian cotton se bani jet black formal shirt, gold-rimmed buttons aur cutaway collar ke sath.",
    category_id: "cat-shirts",
    price: 7500,
    discount_percent: 15,
    images: [PRODUCT_ARTWORKS.shirtOnyx, PRODUCT_ARTWORKS.shirtOxford],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Jet Black", "Charcoal"],
    stock: 42,
    is_active: true,
    is_featured: true,
    created_at: "2026-10-10T11:30:00Z",
  },
  {
    id: "prod-5",
    name_en: "Savile Charcoal Tailored Oxford Shirt",
    name_ur: "چارکول ٹیلرڈ آکسفورڈ شرٹ",
    name_roman_ur: "Savile Charcoal Tailored Oxford Shirt",
    description_en:
      "Heavyweight brushed pinpoint Oxford weave with a structured button-down collar and subtle gold monogram embroidery on the left cuff.",
    description_ur:
      "بہترین آکسفورڈ کاٹن سے تیار کردہ چارکول شرٹ جس کے کف پر ARTS کا سنہری مونوگرام موجود ہے۔",
    description_roman_ur:
      "Behtareen Oxford cotton se tayyar karda charcoal shirt jis ke cuff par ARTS ka sunehri monogram maujood hai.",
    category_id: "cat-shirts",
    price: 6800,
    discount_percent: 0,
    images: [PRODUCT_ARTWORKS.shirtOxford, PRODUCT_ARTWORKS.shirtOnyx],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Charcoal Slate", "Espresso"],
    stock: 25,
    is_active: true,
    is_featured: false,
    created_at: "2026-10-12T15:00:00Z",
  },
  {
    id: "prod-6",
    name_en: "Sartorial Double-Pleat Gurkha Trousers",
    name_ur: "اطالوی وول ڈبل پلیٹ گورکھا ٹراؤزر",
    name_roman_ur: "Sartorial Double-Pleat Gurkha Trousers",
    description_en:
      "High-waisted Italian wool-blend Gurkha trousers featuring signature extended cummerbund waistband and solid brushed-brass side buckles.",
    description_ur:
      "اطالوی وول بلینڈ میں تیار کردہ گورکھا ٹراؤزر، پیتل کے بکلز اور شاندار ٹیلرڈ فٹنگ کے ساتھ۔",
    description_roman_ur:
      "Italian wool-blend mein tayyar karda Gurkha trousers, solid brass side buckles aur shandar tailored fitting ke sath.",
    category_id: "cat-trousers",
    price: 9200,
    discount_percent: 12,
    images: [PRODUCT_ARTWORKS.trouserGurkha, PRODUCT_ARTWORKS.trouserChino],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Onyx Black", "Warm Taupe", "Espresso"],
    stock: 22,
    is_active: true,
    is_featured: true,
    created_at: "2026-10-14T16:20:00Z",
  },
  {
    id: "prod-7",
    name_en: "Obsidian Pima Stretch Tailored Chinos",
    name_ur: "پریمیم اسٹریچ ٹیلرڈ چینو ٹراؤزر",
    name_roman_ur: "Obsidian Pima Stretch Tailored Chinos",
    description_en:
      "Peached Pima cotton twill trousers with 3% elastane for effortless movement, horn buttons, and a clean tapered ankle profile.",
    description_ur:
      "پیما کاٹن ٹوئل سے تیار کردہ آرام دہ اور پائیدار چینو ٹراؤزر، روزمرہ اور سیمی فارمل پہننے کے لیے۔",
    description_roman_ur:
      "Pima cotton twill se tayyar karda aram-deh aur paidaar chino trousers, rozmarra aur semi-formal pehanne ke liye.",
    category_id: "cat-trousers",
    price: 6400,
    discount_percent: 0,
    images: [PRODUCT_ARTWORKS.trouserChino, PRODUCT_ARTWORKS.trouserGurkha],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Obsidian", "Khaki Bronze"],
    stock: 38,
    is_active: true,
    is_featured: false,
    created_at: "2026-10-16T14:00:00Z",
  },
  {
    id: "prod-8",
    name_en: "Mayfair Lambskin Suede Bomber Jacket",
    name_ur: "مے فیئر لیمب اسکن سويڈ بمبر جیکٹ",
    name_roman_ur: "Mayfair Lambskin Suede Bomber Jacket",
    description_en:
      "Supple full-grain goat suede bomber jacket in dark espresso-black with custom two-way brushed gold zippers, ribbed merino cuffs, and diamond-quilted satin lining.",
    description_ur:
      "اصلی سويڈ لیدر سے تیار کردہ لگژری بمبر جیکٹ، سنہری زپ اور ریشمی استر کے ساتھ۔",
    description_roman_ur:
      "Asli full-grain suede leather se tayyar karda luxury bomber jacket, brushed gold zippers aur satin quilted lining ke sath.",
    category_id: "cat-jackets",
    price: 28500,
    discount_percent: 20,
    images: [PRODUCT_ARTWORKS.jacketSuede, PRODUCT_ARTWORKS.jacketRacer],
    sizes: ["M", "L", "XL"],
    colors: ["Dark Espresso", "Onyx"],
    stock: 11,
    is_active: true,
    is_featured: true,
    created_at: "2026-10-18T18:00:00Z",
  },
  {
    id: "prod-9",
    name_en: "Vanguard Matte Onyx Nappa Leather Jacket",
    name_ur: "وین گارڈ میٹ اونیکس لیدر رائیڈر جیکٹ",
    name_roman_ur: "Vanguard Matte Onyx Nappa Leather Jacket",
    description_en:
      "Hand-waxed Pakistani full-grain Nappa leather café racer jacket with throat latch, articulated shoulders, and heavy gold-plated hardware.",
    description_ur:
      "اعلیٰ پاکستانی ناپا لیدر سے بنی رائیڈر جیکٹ، گولڈ پلیٹڈ ہارڈ ویئر اور مضبوط سلائی کے ساتھ۔",
    description_roman_ur:
      "Aala Pakistani full-grain Nappa leather se bani cafe racer jacket, gold-plated hardware aur mazboot silai ke sath.",
    category_id: "cat-jackets",
    price: 34000,
    discount_percent: 15,
    images: [PRODUCT_ARTWORKS.jacketRacer, PRODUCT_ARTWORKS.jacketSuede],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Matte Onyx"],
    stock: 9,
    is_active: true,
    is_featured: false,
    created_at: "2026-10-20T19:00:00Z",
  },
  {
    id: "prod-10",
    name_en: "Monolith 480GSM Heavyweight Luxury Hoodie",
    name_ur: "مونولتھ 480GSM ہیوی ویٹ لگژری ہوڈی",
    name_roman_ur: "Monolith 480GSM Heavyweight Luxury Hoodie",
    description_en:
      "Architectural drop-shoulder hoodie cut from 480GSM combed loopback organic cotton with antique brass aglets and tonal metallic crest on the chest.",
    description_ur:
      "480GSM بھاری کاٹن سے تیار کردہ پریمیم اسٹریٹ ویئر ہوڈی، پیتل کی ٹپس اور جدید ڈراپ شولڈر ڈیزائن۔",
    description_roman_ur:
      "480GSM bhari organic cotton se tayyar karda premium luxury hoodie, brass tips aur drop-shoulder design ke sath.",
    category_id: "cat-hoodies",
    price: 8900,
    discount_percent: 10,
    images: [PRODUCT_ARTWORKS.hoodieMonolith],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Obsidian Black", "Bronzed Charcoal"],
    stock: 30,
    is_active: true,
    is_featured: true,
    created_at: "2026-10-22T12:00:00Z",
  },
];

const INITIAL_USERS: User[] = [
  {
    id: "user-admin-1",
    email: "admin@rtsapparel.pk",
    full_name: "Tariq Mehmood (ARTS APPAREL Owner)",
    phone: "03058165623",
    role: "admin",
    referral_code: "RTS-ADMIN001",
    is_approved: true,
    is_blocked: false,
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "user-agent-1",
    email: "ali@rtsapparel.pk",
    full_name: "Ali Raza Khan",
    phone: "0321-4567890",
    role: "agent",
    referral_code: "RTS-ALI123",
    is_approved: true,
    is_blocked: false,
    payment_method: "jazzcash",
    payment_account_details: "JazzCash: 0321-4567890 (Ali Raza Khan)",
    created_at: "2026-09-12T10:00:00Z",
  },
  {
    id: "user-agent-2",
    email: "usman@rtsapparel.pk",
    full_name: "Usman Sheikh",
    phone: "0333-9988776",
    role: "agent",
    referral_code: "RTS-USM786",
    is_approved: true,
    is_blocked: false,
    payment_method: "bank_transfer",
    payment_account_details: "Meezan Bank IBAN: PK36MEZN0001234567890123",
    created_at: "2026-09-18T11:00:00Z",
  },
  {
    id: "user-agent-pending",
    email: "hamza@rtsapparel.pk",
    full_name: "Hamza Durrani",
    phone: "0345-1122334",
    role: "agent",
    referral_code: null,
    is_approved: false,
    is_blocked: false,
    join_reason: "Menswear stylist in Islamabad with 18k Instagram followers.",
    created_at: "2026-10-27T14:30:00Z",
  },
  {
    id: "user-agent-blocked",
    email: "bilal@rtsapparel.pk",
    full_name: "Bilal Qureshi",
    phone: "0312-5544332",
    role: "agent",
    referral_code: "RTS-BIL404",
    is_approved: true,
    is_blocked: true,
    created_at: "2026-09-25T09:00:00Z",
  },
  {
    id: "user-customer-1",
    email: "zain@rtsapparel.pk",
    full_name: "Zainab & Saad Ahmed",
    phone: "0301-7766554",
    role: "customer",
    referral_code: null,
    is_approved: true,
    is_blocked: false,
    created_at: "2026-10-02T16:00:00Z",
  },
];

const INITIAL_ORDER_ITEMS: OrderItem[] = [
  {
    id: "oi-1",
    order_id: "ord-1001",
    product_id: "prod-1",
    product_name_en: "Obsidian Zari Karandi Kurta Shalwar",
    name_en: "Obsidian Zari Karandi Kurta Shalwar",
    product_image: PRODUCT_ARTWORKS.kurtaObsidian,
    image: PRODUCT_ARTWORKS.kurtaObsidian,
    quantity: 1,
    size: "L",
    color: "Obsidian Black",
    unit_price: 10000,
    final_unit_price: 10000,
    original_price: 12500,
  },
  {
    id: "oi-2",
    order_id: "ord-1002",
    product_id: "prod-8",
    product_name_en: "Mayfair Lambskin Suede Bomber Jacket",
    name_en: "Mayfair Lambskin Suede Bomber Jacket",
    product_image: PRODUCT_ARTWORKS.jacketSuede,
    image: PRODUCT_ARTWORKS.jacketSuede,
    quantity: 1,
    size: "L",
    color: "Dark Espresso",
    unit_price: 22800,
    final_unit_price: 22800,
    original_price: 28500,
  },
  {
    id: "oi-3",
    order_id: "ord-1003",
    product_id: "prod-2",
    product_name_en: "Imperial Emerald Boski Silk Kurta Set",
    name_en: "Imperial Emerald Boski Silk Kurta Set",
    product_image: PRODUCT_ARTWORKS.kurtaEmerald,
    image: PRODUCT_ARTWORKS.kurtaEmerald,
    quantity: 1,
    size: "M",
    color: "Emerald",
    unit_price: 12580,
    final_unit_price: 12580,
    original_price: 14800,
  },
  {
    id: "oi-4",
    order_id: "ord-1003",
    product_id: "prod-4",
    product_name_en: "Noir Giza 120s Executive Dress Shirt",
    name_en: "Noir Giza 120s Executive Dress Shirt",
    product_image: PRODUCT_ARTWORKS.shirtOnyx,
    image: PRODUCT_ARTWORKS.shirtOnyx,
    quantity: 1,
    size: "M",
    color: "Jet Black",
    unit_price: 6375,
    final_unit_price: 6375,
    original_price: 7500,
  },
  {
    id: "oi-5",
    order_id: "ord-1004",
    product_id: "prod-10",
    product_name_en: "Monolith 480GSM Heavyweight Luxury Hoodie",
    name_en: "Monolith 480GSM Heavyweight Luxury Hoodie",
    product_image: PRODUCT_ARTWORKS.hoodieMonolith,
    image: PRODUCT_ARTWORKS.hoodieMonolith,
    quantity: 1,
    size: "XL",
    color: "Obsidian Black",
    unit_price: 8010,
    final_unit_price: 8010,
    original_price: 8900,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1001",
    order_number: "RTS-2026-0001",
    customer_id: "user-customer-1",
    customer_name: "Saad Ahmed",
    customer_phone: "0301-7766554",
    agent_id: "user-agent-1",
    referral_code: "RTS-ALI123",
    status: "delivered",
    payment_method: "cod",
    payment_status: "verified",
    transaction_id: null,
    subtotal: 10000,
    delivery_charge: 200,
    discount_amount: 2500,
    total_amount: 10200,
    delivery_city: "Lahore",
    delivery_address: "House 42-B, Block Z, DHA Phase 3, Lahore",
    admin_note: "Delivered on time via TCS Courier.",
    created_at: "2026-10-20T11:20:00Z",
    items: INITIAL_ORDER_ITEMS.filter((i) => i.order_id === "ord-1001"),
  },
  {
    id: "ord-1002",
    order_number: "RTS-2026-0002",
    customer_id: "user-customer-1",
    customer_name: "Saad Ahmed",
    customer_phone: "0301-7766554",
    agent_id: "user-agent-1",
    referral_code: "RTS-ALI123",
    status: "shipped",
    payment_method: "jazzcash",
    payment_status: "verified",
    transaction_id: "JC-994827162",
    subtotal: 22800,
    delivery_charge: 250,
    discount_amount: 5700,
    total_amount: 23050,
    delivery_city: "Karachi",
    delivery_address: "Apartment 802, Clifton Block 5, Karachi",
    admin_note: "JazzCash verified by admin.",
    created_at: "2026-10-26T15:45:00Z",
    items: INITIAL_ORDER_ITEMS.filter((i) => i.order_id === "ord-1002"),
  },
  {
    id: "ord-1003",
    order_number: "RTS-2026-0003",
    customer_id: null,
    customer_name: "Kamran Akmal",
    customer_phone: "0333-4112233",
    agent_id: "user-agent-1",
    referral_code: "RTS-ALI123",
    status: "pending",
    payment_method: "bank_transfer",
    payment_status: "pending",
    transaction_id: "MEZN-8837120",
    subtotal: 18955,
    delivery_charge: 250,
    discount_amount: 3345,
    total_amount: 19205,
    delivery_city: "Islamabad",
    delivery_address: "Street 14, Sector F-7/2, Islamabad",
    admin_note: "Awaiting Meezan Bank transfer verification.",
    created_at: "2026-10-29T19:10:00Z",
    items: INITIAL_ORDER_ITEMS.filter((i) => i.order_id === "ord-1003"),
  },
  {
    id: "ord-1004",
    order_number: "RTS-2026-0004",
    customer_id: null,
    customer_name: "Fawad Alam",
    customer_phone: "0322-8877665",
    agent_id: "user-agent-2",
    referral_code: "RTS-USM786",
    status: "confirmed",
    payment_method: "easypaisa",
    payment_status: "verified",
    transaction_id: "EP-55231984",
    subtotal: 8010,
    delivery_charge: 220,
    discount_amount: 890,
    total_amount: 8230,
    delivery_city: "Faisalabad",
    delivery_address: "214 People's Colony No. 1, Faisalabad",
    admin_note: null,
    created_at: "2026-10-29T21:00:00Z",
    items: INITIAL_ORDER_ITEMS.filter((i) => i.order_id === "ord-1004"),
  },
];

const INITIAL_COMMISSIONS: Commission[] = [
  {
    id: "comm-1",
    order_id: "ord-1001",
    agent_id: "user-agent-1",
    amount: 1200,
    status: "paid",
    admin_note: "Paid via JazzCash",
    paid_at: "2026-10-23T14:00:00Z",
    created_at: "2026-10-20T11:20:00Z",
  },
  {
    id: "comm-2",
    order_id: "ord-1002",
    agent_id: "user-agent-1",
    amount: 2400,
    status: "approved",
    admin_note: "10.5% luxury outerwear tier bonus",
    paid_at: null,
    created_at: "2026-10-26T15:45:00Z",
  },
  {
    id: "comm-3",
    order_id: "ord-1003",
    agent_id: "user-agent-1",
    amount: 1850,
    status: "pending",
    admin_note: "Pending order confirmation",
    paid_at: null,
    created_at: "2026-10-29T19:10:00Z",
  },
  {
    id: "comm-4",
    order_id: "ord-1004",
    agent_id: "user-agent-2",
    amount: 850,
    status: "approved",
    admin_note: null,
    paid_at: null,
    created_at: "2026-10-29T21:00:00Z",
  },
];

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: "wd-1",
    agent_id: "user-agent-1",
    amount: 1200,
    payment_method: "jazzcash",
    account_details: "JazzCash: 0321-4567890 — Ali Raza Khan",
    status: "paid",
    paid_at: "2026-10-23T15:00:00Z",
    admin_note: "Transferred Ref #JC-77123",
    created_at: "2026-10-22T18:00:00Z",
  },
  {
    id: "wd-2",
    agent_id: "user-agent-2",
    amount: 850,
    payment_method: "bank_transfer",
    account_details: "Meezan Bank IBAN: PK36MEZN0001234567890123 — Usman Sheikh",
    status: "pending",
    paid_at: null,
    admin_note: null,
    created_at: "2026-10-29T22:00:00Z",
  },
];

const INITIAL_DELIVERY_RATES: DeliveryRate[] = [
  { id: "city-1", city_name: "Lahore", charge: 200, is_active: true },
  { id: "city-2", city_name: "Karachi", charge: 250, is_active: true },
  { id: "city-3", city_name: "Islamabad", charge: 250, is_active: true },
  { id: "city-4", city_name: "Rawalpindi", charge: 250, is_active: true },
  { id: "city-5", city_name: "Faisalabad", charge: 220, is_active: true },
  { id: "city-6", city_name: "Multan", charge: 280, is_active: true },
  { id: "city-7", city_name: "Peshawar", charge: 300, is_active: true },
  { id: "city-8", city_name: "Sialkot", charge: 220, is_active: true },
  { id: "city-9", city_name: "Quetta", charge: 350, is_active: true },
  { id: "city-10", city_name: "Sadiqabad", charge: 150, is_active: true },
];

const INITIAL_BANNERS: Banner[] = [
  {
    id: "ban-1",
    title_en: "Where Pakistani Men Dress Sharp.",
    title_ur: "پاکستان کا پریمیم مینز فیشن برانڈ",
    title_roman_ur: "Jahan Pakistani Mard Shaan Se Pehante Hain.",
    subtitle_en:
      "Autumn / Winter Atelier — Hand-loomed Karandi Kurtas, Egyptian 120s Dress Shirts & Lambskin Suede Outerwear.",
    subtitle_ur:
      "موسمِ سرما کلیکشن — خالص کرنڈی کرتہ شلوار، مصری کاٹن شرٹس اور لیدر سوئیڈ جیکٹس۔",
    subtitle_roman_ur:
      "Sardiyon Ka Shahi Collection — Hand-loomed Karandi Kurtas, Egyptian Cotton Shirts aur Suede Jackets.",
    image_url: PRODUCT_ARTWORKS.bannerFestive,
    link_url: "/category/kurta-shalwar",
    cta_link: "/category/kurta-shalwar",
    display_order: 1,
    is_active: true,
    created_at: "2026-10-01T00:00:00Z",
  },
  {
    id: "ban-2",
    title_en: "Architectural Tailoring in Black & Gold",
    title_ur: "شاہی لباس اور جدید تراش خراش",
    title_roman_ur: "Shahi Libas Aur Jadeed Tailoring",
    subtitle_en:
      "Bespoke festive silhouettes and executive formals with complimentary size exchange across Pakistan.",
    subtitle_ur:
      "پاکستان بھر میں 7 دن کی مفت سائز ایکسچینج سہولت کے ساتھ بہترین ملبوسات۔",
    subtitle_roman_ur:
      "Poore Pakistan mein 7-din ki muft size exchange sahulat ke sath.",
    image_url: PRODUCT_ARTWORKS.bannerSartorial,
    link_url: "/category/jackets",
    cta_link: "/category/jackets",
    display_order: 2,
    is_active: true,
    created_at: "2026-10-05T00:00:00Z",
  },
];

const INITIAL_SETTINGS: SiteSettings = {
  jazzcash_number: "03058165623 (ARTS APPAREL Official)",
  easypaisa_number: "03058165623 (ARTS APPAREL Official)",
  bank_name: "Meezan Bank Limited",
  bank_account_title: "ARTS APPAREL",
  bank_iban: "PK88MEZN0002410105678912",
  whatsapp_number: "03058165623",
  contact_email: "concierge@artsapparel.pk",
  physical_address:
    "Club Road Near New Cafe Sajawal Sadiqabad, Sadiqabad Pakistan",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
};

const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    user_id: "user-customer-1",
    label: "Home (DHA Lahore)",
    recipient_name: "Saad Ahmed",
    phone: "0301-7766554",
    city: "Lahore",
    address_line: "House 42-B, Block Z, DHA Phase 3, Lahore",
    is_default: true,
  },
  {
    id: "addr-2",
    user_id: "user-customer-1",
    label: "Executive Office (Gulberg)",
    recipient_name: "Saad Ahmed",
    phone: "0301-7766554",
    city: "Lahore",
    address_line: "Suite 402, Tricon Corporate Centre, Jail Road, Lahore",
    is_default: false,
  },
];

interface DataState {
  categories: Category[];
  products: Product[];
  users: User[];
  orders: Order[];
  orderItems: OrderItem[];
  commissions: Commission[];
  withdrawalRequests: WithdrawalRequest[];
  deliveryRates: DeliveryRate[];
  banners: Banner[];
  siteSettings: SiteSettings;
  addresses: SavedAddress[];
  wishlist: string[];
  toasts: ToastMessage[];
  language: CustomerLanguage;
  adminLanguage: AdminLanguage;

  setLanguage: (lang: CustomerLanguage) => void;
  setAdminLanguage: (lang: AdminLanguage) => void;
  getEffectiveDiscount: (product: Product) => number;
  addToast: (
    title: string,
    type?: "success" | "error" | "info",
    description?: string
  ) => void;
  removeToast: (id: string) => void;

  // Wishlist
  toggleWishlist: (productId: string) => void;

  // Addresses
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  updateAddress: (id: string, data: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (userId: string, id: string) => void;

  // Products
  addProduct: (product: Omit<Product, "id" | "created_at">) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Categories
  addCategory: (cat: {
    name_en: string;
    name_ur: string;
    name_roman_ur?: string;
    discount_percent?: number;
  }) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  reorderCategory: (id: string, direction: "up" | "down") => void;
  deleteCategory: (id: string) => { success: boolean; message: string };

  // Orders & Checkout
  placeOrder: (payload: {
    customer_id: string | null;
    customer_name: string;
    customer_phone: string;
    referral_code: string | null;
    payment_method: PaymentMethod;
    transaction_id?: string | null;
    payment_proof_url?: string | null;
    subtotal: number;
    delivery_charge: number;
    discount_amount: number;
    total_amount: number;
    delivery_city: string;
    delivery_address: string;
    notes?: string | null;
    items: Array<OrderItem>;
  }) => Order;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus,
    adminNote?: string
  ) => void;

  // Agents / Users
  approveAgent: (userId: string) => void;
  rejectAgent: (userId: string) => void;
  toggleBlockAgent: (userId: string) => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  registerUser: (user: Omit<User, "id" | "created_at">) => User;

  // Commissions & Withdrawals
  updateCommission: (
    commissionId: string,
    amount: number,
    status: CommissionStatus,
    note?: string
  ) => void;
  markCommissionPaid: (commissionId: string) => void;
  requestWithdrawal: (payload: {
    agent_id: string;
    amount: number;
    payment_method: "jazzcash" | "easypaisa" | "bank_transfer";
    account_details: string;
  }) => void;
  markWithdrawalPaid: (withdrawalId: string, adminNote?: string) => void;

  // Delivery Rates
  addDeliveryRate: (city_name: string, charge: number) => void;
  updateDeliveryRate: (id: string, updates: Partial<DeliveryRate>) => void;
  deleteDeliveryRate: (id: string) => void;

  // Banners & Settings
  addBanner: (banner: Omit<Banner, "id" | "created_at">) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  reorderBanner: (id: string, direction: "up" | "down") => void;
  deleteBanner: (id: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
}

const initialCustomerLang = ((): CustomerLanguage => {
  try {
    const saved = localStorage.getItem("rts_customer_lang");
    if (saved === "en" || saved === "ur" || saved === "roman_ur") return saved;
  } catch {}
  return "en";
})();

const initialAdminLang = ((): AdminLanguage => {
  try {
    const saved = localStorage.getItem("rts_admin_lang");
    if (saved === "en" || saved === "roman_ur") return saved;
  } catch {}
  return "en";
})();

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      users: INITIAL_USERS,
      orders: INITIAL_ORDERS,
      orderItems: INITIAL_ORDER_ITEMS,
      commissions: INITIAL_COMMISSIONS,
      withdrawalRequests: INITIAL_WITHDRAWALS,
      deliveryRates: INITIAL_DELIVERY_RATES,
      banners: INITIAL_BANNERS,
      siteSettings: INITIAL_SETTINGS,
      addresses: INITIAL_ADDRESSES,
      wishlist: ["prod-1", "prod-8"],
      toasts: [],
      language: initialCustomerLang,
      adminLanguage: initialAdminLang,

      setLanguage: (language) => {
        try {
          localStorage.setItem("rts_customer_lang", language);
        } catch {}
        set({ language });
      },

      setAdminLanguage: (adminLanguage) => {
        try {
          localStorage.setItem("rts_admin_lang", adminLanguage);
        } catch {}
        set({ adminLanguage });
      },

      getEffectiveDiscount: (product) => {
        const category = get().categories.find(
          (c) => c.id === product.category_id
        );
        return getEffectiveDiscountPercent(product, category);
      },

      addToast: (title, type = "success", description) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        set((state) => ({
          toasts: [...state.toasts, { id, title, type, description }],
        }));
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 3800);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      toggleWishlist: (productId) => {
        const exists = get().wishlist.includes(productId);
        set((state) => ({
          wishlist: exists
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        }));
        get().addToast(
          exists ? "Removed from Wishlist" : "Saved to Wishlist",
          "info"
        );
      },

      addAddress: (address) => {
        const newAddr: SavedAddress = {
          ...address,
          id: `addr-${Date.now()}`,
        };
        set((state) => {
          const updated = address.is_default
            ? state.addresses.map((a) =>
                a.user_id === address.user_id ? { ...a, is_default: false } : a
              )
            : state.addresses;
          return { addresses: [...updated, newAddr] };
        });
        get().addToast("Delivery address saved");
      },

      updateAddress: (id, data) => {
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        }));
        get().addToast("Address updated");
      },

      deleteAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        }));
        get().addToast("Address removed", "info");
      },

      setDefaultAddress: (userId, id) => {
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.user_id === userId ? { ...a, is_default: a.id === id } : a
          ),
        }));
        get().addToast("Default address updated");
      },

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `prod-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
        if (isSupabaseConfigured && supabase) {
          supabase.from("products").insert([newProduct]).then(() => {});
        }
        get().addToast("Product added to catalog");
        return newProduct;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, ...updates, updated_at: new Date().toISOString() }
              : p
          ),
        }));
        if (isSupabaseConfigured && supabase) {
          supabase.from("products").update(updates).eq("id", id).then(() => {});
        }
        get().addToast("Product updated");
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        if (isSupabaseConfigured && supabase) {
          supabase.from("products").delete().eq("id", id).then(() => {});
        }
        get().addToast("Product deleted", "info");
      },

      addCategory: ({
        name_en,
        name_ur,
        name_roman_ur,
        discount_percent = 0,
      }) => {
        const maxOrder = get().categories.reduce(
          (max, c) => Math.max(max, c.display_order),
          0
        );
        const newCat: Category = {
          id: `cat-${Date.now()}`,
          name_en,
          name_ur,
          name_roman_ur: name_roman_ur || name_en,
          slug: slugify(name_en),
          display_order: maxOrder + 1,
          discount_percent,
          is_active: true,
        };
        set((state) => ({
          categories: [...state.categories, newCat],
        }));
        get().addToast(`Category "${name_en}" created`);
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...updates,
                  slug: updates.name_en ? slugify(updates.name_en) : c.slug,
                }
              : c
          ),
        }));
        get().addToast("Category updated");
      },

      reorderCategory: (id, direction) => {
        const sorted = [...get().categories].sort(
          (a, b) => a.display_order - b.display_order
        );
        const idx = sorted.findIndex((c) => c.id === id);
        if (idx === -1) return;
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return;

        const currentOrder = sorted[idx].display_order;
        sorted[idx].display_order = sorted[swapIdx].display_order;
        sorted[swapIdx].display_order = currentOrder;

        set({ categories: [...sorted] });
      },

      deleteCategory: (id) => {
        const hasProducts = get().products.some((p) => p.category_id === id);
        if (hasProducts) {
          get().addToast(
            "Cannot delete category with existing products",
            "error"
          );
          return {
            success: false,
            message: "Cannot delete category that still contains products.",
          };
        }
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
        get().addToast("Category deleted", "info");
        return { success: true, message: "Category deleted." };
      },

      placeOrder: (payload) => {
        const state = get();
        const nextSequence = state.orders.length + 1;
        const orderId = `ord-${Date.now()}`;
        const orderNumber = formatOrderNumber(nextSequence, 2026);

        let matchedAgent: User | undefined;
        if (payload.referral_code) {
          matchedAgent = state.users.find(
            (u) =>
              u.referral_code?.toUpperCase() ===
                payload.referral_code?.trim().toUpperCase() &&
              u.role === "agent" &&
              u.is_approved &&
              !u.is_blocked
          );
        }

        const newOrderItems: OrderItem[] = payload.items.map((item, idx) => ({
          id: `oi-${Date.now()}-${idx}`,
          order_id: orderId,
          product_id: item.product_id,
          product_name_en: item.product_name_en || item.name_en || "Garment",
          name_en: item.name_en || item.product_name_en || "Garment",
          name_ur: item.name_ur || null,
          product_image: item.product_image || item.image || "",
          image: item.image || item.product_image || "",
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          unit_price: item.final_unit_price ?? item.unit_price,
          final_unit_price: item.final_unit_price ?? item.unit_price,
          original_price: item.original_price ?? item.unit_price,
          discount_percent: item.discount_percent ?? 0,
        }));

        const newOrder: Order = {
          id: orderId,
          order_number: orderNumber,
          customer_id: payload.customer_id,
          customer_name: payload.customer_name,
          customer_phone: payload.customer_phone,
          agent_id: matchedAgent ? matchedAgent.id : null,
          referral_code: matchedAgent
            ? matchedAgent.referral_code
            : payload.referral_code,
          status: "pending",
          payment_method: payload.payment_method,
          payment_status: "pending",
          transaction_id:
            payload.transaction_id || payload.payment_proof_url || null,
          payment_proof_url:
            payload.payment_proof_url || payload.transaction_id || null,
          subtotal: payload.subtotal,
          delivery_charge: payload.delivery_charge,
          discount_amount: payload.discount_amount,
          total_amount: payload.total_amount,
          delivery_city: payload.delivery_city,
          delivery_address: payload.delivery_address,
          notes: payload.notes || null,
          created_at: new Date().toISOString(),
          items: newOrderItems,
        };

        const updatedCommissions = [...state.commissions];
        if (matchedAgent) {
          updatedCommissions.unshift({
            id: `comm-${Date.now()}`,
            order_id: orderId,
            agent_id: matchedAgent.id,
            amount: Math.round(payload.subtotal * 0.1),
            status: "pending",
            admin_note: `Auto-linked via code ${matchedAgent.referral_code}`,
            paid_at: null,
            created_at: new Date().toISOString(),
          });
        }

        const updatedProducts = state.products.map((prod) => {
          const orderedQty = payload.items
            .filter((i) => i.product_id === prod.id)
            .reduce((sum, i) => sum + i.quantity, 0);
          if (orderedQty > 0) {
            return { ...prod, stock: Math.max(0, prod.stock - orderedQty) };
          }
          return prod;
        });

        set({
          orders: [newOrder, ...state.orders],
          orderItems: [...newOrderItems, ...state.orderItems],
          commissions: updatedCommissions,
          products: updatedProducts,
        });

        get().addToast(`Order ${orderNumber} placed!`, "success");
        return newOrder;
      },

      updateOrderStatus: (orderId, status, paymentStatus, adminNote) => {
        set((state) => {
          const updatedOrders = state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  payment_status: paymentStatus ?? o.payment_status,
                  admin_note: adminNote !== undefined ? adminNote : o.admin_note,
                  updated_at: new Date().toISOString(),
                }
              : o
          );

          // Business Rule #8: If order is cancelled, linked commission is also cancelled
          const updatedCommissions =
            status === "cancelled"
              ? state.commissions.map((c) =>
                  c.order_id === orderId && c.status !== "paid"
                    ? { ...c, status: "cancelled" as CommissionStatus }
                    : c
                )
              : state.commissions;

          return {
            orders: updatedOrders,
            commissions: updatedCommissions,
          };
        });
        get().addToast(`Order status updated to ${status.toUpperCase()}`);
      },

      approveAgent: (userId) => {
        const target = get().users.find((u) => u.id === userId);
        if (!target) return;
        const code =
          target.referral_code || generateReferralCode(target.full_name);
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  is_approved: true,
                  is_blocked: false,
                  referral_code: code,
                }
              : u
          ),
        }));
        get().addToast(`Agent approved with code ${code}`);
      },

      rejectAgent: (userId) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
        }));
        get().addToast("Agent application rejected", "info");
      },

      toggleBlockAgent: (userId) => {
        const target = get().users.find((u) => u.id === userId);
        if (!target) return;
        const nextBlocked = !target.is_blocked;
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, is_blocked: nextBlocked } : u
          ),
        }));
        get().addToast(
          nextBlocked ? "Agent account suspended" : "Agent account unblocked",
          nextBlocked ? "error" : "success"
        );
      },

      updateUserProfile: (userId, updates) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, ...updates } : u
          ),
        }));
        get().addToast("Profile settings saved");
      },

      registerUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          users: [...state.users, newUser],
        }));
        return newUser;
      },

      updateCommission: (commissionId, amount, status, note) => {
        set((state) => ({
          commissions: state.commissions.map((c) =>
            c.id === commissionId
              ? {
                  ...c,
                  amount,
                  status,
                  admin_note: note !== undefined ? note : c.admin_note,
                  paid_at: status === "paid" ? new Date().toISOString() : c.paid_at,
                }
              : c
          ),
        }));
        get().addToast("Commission record updated");
      },

      markCommissionPaid: (commissionId) => {
        set((state) => ({
          commissions: state.commissions.map((c) =>
            c.id === commissionId
              ? { ...c, status: "paid", paid_at: new Date().toISOString() }
              : c
          ),
        }));
        get().addToast("Commission marked as PAID");
      },

      requestWithdrawal: (payload) => {
        const newReq: WithdrawalRequest = {
          id: `wd-${Date.now()}`,
          agent_id: payload.agent_id,
          amount: payload.amount,
          payment_method: payload.payment_method,
          account_details: payload.account_details,
          status: "pending",
          paid_at: null,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          withdrawalRequests: [newReq, ...state.withdrawalRequests],
        }));
        get().addToast("Withdrawal request submitted to Admin");
      },

      markWithdrawalPaid: (withdrawalId, adminNote) => {
        set((state) => ({
          withdrawalRequests: state.withdrawalRequests.map((w) =>
            w.id === withdrawalId
              ? {
                  ...w,
                  status: "paid",
                  paid_at: new Date().toISOString(),
                  admin_note: adminNote || "Payout completed",
                }
              : w
          ),
        }));
        get().addToast("Withdrawal marked as PAID");
      },

      addDeliveryRate: (city_name, charge) => {
        const newRate: DeliveryRate = {
          id: `city-${Date.now()}`,
          city_name: city_name.trim(),
          charge: Number(charge) || 0,
          is_active: true,
        };
        set((state) => ({
          deliveryRates: [...state.deliveryRates, newRate],
        }));
        get().addToast(`Added delivery rate for ${city_name}`);
      },

      updateDeliveryRate: (id, updates) => {
        set((state) => ({
          deliveryRates: state.deliveryRates.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
        get().addToast("City delivery rate updated");
      },

      deleteDeliveryRate: (id) => {
        set((state) => ({
          deliveryRates: state.deliveryRates.filter((r) => r.id !== id),
        }));
        get().addToast("City removed from delivery table", "info");
      },

      addBanner: (bannerData) => {
        const newBanner: Banner = {
          ...bannerData,
          id: `ban-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          banners: [...state.banners, newBanner],
        }));
        get().addToast("Homepage banner added");
      },

      updateBanner: (id, updates) => {
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        }));
        get().addToast("Banner updated");
      },

      reorderBanner: (id, direction) => {
        const sorted = [...get().banners].sort(
          (a, b) => a.display_order - b.display_order
        );
        const idx = sorted.findIndex((b) => b.id === id);
        if (idx === -1) return;
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return;

        const currentOrder = sorted[idx].display_order;
        sorted[idx].display_order = sorted[swapIdx].display_order;
        sorted[swapIdx].display_order = currentOrder;

        set({ banners: [...sorted] });
      },

      deleteBanner: (id) => {
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        }));
        get().addToast("Banner deleted", "info");
      },

      updateSiteSettings: (settings) => {
        set((state) => ({
          siteSettings: { ...state.siteSettings, ...settings },
        }));
        get().addToast("Site settings saved");
      },
    }),
    {
      name: "arts-apparel-data-v6",
      partialize: (state) => ({
        categories: state.categories,
        products: state.products,
        users: state.users,
        orders: state.orders,
        orderItems: state.orderItems,
        commissions: state.commissions,
        withdrawalRequests: state.withdrawalRequests,
        deliveryRates: state.deliveryRates,
        banners: state.banners,
        siteSettings: state.siteSettings,
        addresses: state.addresses,
        wishlist: state.wishlist,
        language: state.language,
        adminLanguage: state.adminLanguage,
      }),
    }
  )
);

