export interface DemoProduct {
  id: string;
  name_en: string;
  name_ur: string;
  category_slug: string;
  category_name: string;
  price: number;
  discount_percent: number;
  discounted_price: number;
  stock: number;
  sizes: string[];
  colors: string[];
  is_featured: boolean;
  is_new: boolean;
  description_en: string;
  images: string[];
  created_at?: string;
}

export interface DemoBanner {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  cta_text: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
}

export interface DemoAgent {
  id: string;
  full_name: string;
  phone: string;
  referral_code: string | null;
  total_referrals: number;
  total_commission_earned: number;
  is_approved: boolean;
  is_blocked: boolean;
}

export interface DemoOrder {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_city: string;
  total_amount: number;
  payment_method: "cod" | "jazzcash" | "easypaisa" | "bank_transfer";
  status: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
  referral_code: string | null;
  created_at: string;
}

export interface DemoCityRate {
  city_name: string;
  charge: number;
}

export interface DemoSiteSettings {
  jazzcash_number: string;
  easypaisa_number: string;
  bank_name: string;
  bank_account_title: string;
  bank_iban: string;
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  shop_address: string;
  facebook_url: string;
  tiktok_url: string;
  instagram_url: string;
}

export interface DemoDashboardStats {
  today_revenue: number;
  today_orders: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  active_agents: number;
  pending_agent_approvals: number;
  pending_withdrawals: number;
  total_products: number;
  total_customers: number;
}

const currentYear = new Date().getFullYear();
const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
};

export const demoProducts: DemoProduct[] = [
  // ── SHIRTS (4 products) ──────────────────────────────

  {
    id: "shirt-001",
    name_en: "Classic White Oxford Shirt",
    name_ur: "کلاسک وائٹ آکسفورڈ شرٹ",
    category_slug: "shirts",
    category_name: "Shirts",
    price: 3200,
    discount_percent: 15,
    discounted_price: 2720,
    stock: 45,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Grey"],
    is_featured: true,
    is_new: false,
    description_en:
      "Premium cotton Oxford shirt with a classic fit. Perfect for formal and semi-formal occasions. Easy to iron and long-lasting fabric.",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(14)}T10:00:00Z`,
  },

  {
    id: "shirt-002",
    name_en: "Navy Blue Slim Fit Shirt",
    name_ur: "نیوی بلیو سلم فٹ شرٹ",
    category_slug: "shirts",
    category_name: "Shirts",
    price: 2800,
    discount_percent: 0,
    discounted_price: 2800,
    stock: 32,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy Blue", "Black", "Dark Green"],
    is_featured: true,
    is_new: true,
    description_en:
      "Slim fit shirt in premium cotton blend. Modern cut that looks sharp for office and casual outings.",
    images: [
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(1)}T12:00:00Z`,
  },

  {
    id: "shirt-003",
    name_en: "Black Formal Dress Shirt",
    name_ur: "بلیک فارمل ڈریس شرٹ",
    category_slug: "shirts",
    category_name: "Shirts",
    price: 3500,
    discount_percent: 20,
    discounted_price: 2800,
    stock: 28,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal"],
    is_featured: false,
    is_new: false,
    description_en:
      "Elegant black dress shirt for formal events and weddings. Wrinkle-resistant fabric with premium finish.",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(13)}T10:00:00Z`,
  },

  {
    id: "shirt-004",
    name_en: "Casual Linen Check Shirt",
    name_ur: "کیژوئل لینن چیک شرٹ",
    category_slug: "shirts",
    category_name: "Shirts",
    price: 2200,
    discount_percent: 10,
    discounted_price: 1980,
    stock: 50,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue Check", "Green Check", "Brown Check"],
    is_featured: false,
    is_new: true,
    description_en:
      "Lightweight linen check shirt ideal for summer and casual outings. Comfortable and breathable.",
    images: [
      "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(2)}T10:00:00Z`,
  },

  // ── TROUSERS (3 products) ────────────────────────────

  {
    id: "trouser-001",
    name_en: "Classic Black Chino Trouser",
    name_ur: "کلاسک بلیک چینو ٹراؤزر",
    category_slug: "trousers",
    category_name: "Trousers",
    price: 3800,
    discount_percent: 0,
    discounted_price: 3800,
    stock: 40,
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Black", "Navy", "Khaki", "Grey"],
    is_featured: true,
    is_new: false,
    description_en:
      "Premium chino trouser with a modern slim fit. Versatile — wear it formal or casual. Durable fabric that holds its shape.",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(12)}T10:00:00Z`,
  },

  {
    id: "trouser-002",
    name_en: "Slim Fit Formal Trouser",
    name_ur: "سلم فٹ فارمل ٹراؤزر",
    category_slug: "trousers",
    category_name: "Trousers",
    price: 4200,
    discount_percent: 12,
    discounted_price: 3696,
    stock: 25,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Charcoal", "Black", "Dark Navy"],
    is_featured: true,
    is_new: false,
    description_en:
      "Sharp formal trouser for office and events. Slim cut with straight hem. Premium wool-blend fabric.",
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(11)}T10:00:00Z`,
  },

  {
    id: "trouser-003",
    name_en: "Cargo Pants Street Style",
    name_ur: "کارگو پینٹس اسٹریٹ اسٹائل",
    category_slug: "trousers",
    category_name: "Trousers",
    price: 3500,
    discount_percent: 0,
    discounted_price: 3500,
    stock: 35,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Olive", "Black", "Beige"],
    is_featured: false,
    is_new: true,
    description_en:
      "Trendy cargo pants with multiple utility pockets. Relaxed fit for street style and casual everyday wear.",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(3)}T10:00:00Z`,
  },

  // ── KURTA SHALWAR (3 products) ───────────────────────

  {
    id: "kurta-001",
    name_en: "Premium White Kurta Shalwar",
    name_ur: "پریمیم وائٹ کرتہ شلوار",
    category_slug: "kurta-shalwar",
    category_name: "Kurta Shalwar",
    price: 5500,
    discount_percent: 10,
    discounted_price: 4950,
    stock: 30,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Off-White", "Cream"],
    is_featured: true,
    is_new: false,
    description_en:
      "Classic white kurta shalwar set in premium cotton. Perfect for Eid, Juma prayers, and formal occasions. Traditional Pakistani style with a modern clean finish.",
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(10)}T10:00:00Z`,
  },

  {
    id: "kurta-002",
    name_en: "Embroidered Eid Kurta Set",
    name_ur: "کڑھائی والا عید کرتہ سیٹ",
    category_slug: "kurta-shalwar",
    category_name: "Kurta Shalwar",
    price: 7800,
    discount_percent: 0,
    discounted_price: 7800,
    stock: 20,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Beige", "Light Grey", "Mint Green"],
    is_featured: true,
    is_new: true,
    description_en:
      "Beautifully embroidered Eid special kurta shalwar. Intricate neckline embroidery with matching shalwar. Premium fabric, festival-ready look.",
    images: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(4)}T10:00:00Z`,
  },

  {
    id: "kurta-003",
    name_en: "Daily Wear Cotton Shalwar Kameez",
    name_ur: "روزانہ پہننے والا سوتی شلوار قمیض",
    category_slug: "kurta-shalwar",
    category_name: "Kurta Shalwar",
    price: 3200,
    discount_percent: 0,
    discounted_price: 3200,
    stock: 60,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Grey", "Brown", "Green"],
    is_featured: false,
    is_new: false,
    description_en:
      "Comfortable daily wear shalwar kameez in pure cotton. Breathable and easy to wash. Available in multiple solid colors.",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1500648767791-00dcc994443e?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(9)}T10:00:00Z`,
  },

  // ── HOODIES (2 products) ─────────────────────────────

  {
    id: "hoodie-001",
    name_en: "Premium Oversized Hoodie",
    name_ur: "پریمیم اوور سائزڈ ہوڈی",
    category_slug: "hoodies",
    category_name: "Hoodies",
    price: 5200,
    discount_percent: 15,
    discounted_price: 4420,
    stock: 38,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Grey", "Navy", "Maroon"],
    is_featured: true,
    is_new: true,
    description_en:
      "Ultra-soft premium fleece hoodie in oversized fit. Perfect for winter and casual outings. Kangaroo pocket, adjustable drawstring hood.",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(5)}T10:00:00Z`,
  },

  {
    id: "hoodie-002",
    name_en: "Zip-Up Fleece Hoodie",
    name_ur: "زپ اپ فلیس ہوڈی",
    category_slug: "hoodies",
    category_name: "Hoodies",
    price: 4800,
    discount_percent: 0,
    discounted_price: 4800,
    stock: 22,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Dark Green", "Grey Melange"],
    is_featured: false,
    is_new: false,
    description_en:
      "Full zip fleece hoodie for layering. Warm and lightweight. Great for outdoor activities and casual wear.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(8)}T10:00:00Z`,
  },

  // ── JACKETS (3 products) ─────────────────────────────

  {
    id: "jacket-001",
    name_en: "Classic Leather Biker Jacket",
    name_ur: "کلاسک لیدر بائیکر جیکٹ",
    category_slug: "jackets",
    category_name: "Jackets",
    price: 12500,
    discount_percent: 10,
    discounted_price: 11250,
    stock: 15,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Dark Brown"],
    is_featured: true,
    is_new: false,
    description_en:
      "Premium faux leather biker jacket with zip details. Bold, stylish and durable. A wardrobe staple for the modern Pakistani man.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1520975867064-5a895de24b5f?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(7)}T10:00:00Z`,
  },

  {
    id: "jacket-002",
    name_en: "Puffer Winter Jacket",
    name_ur: "پفر ونٹر جیکٹ",
    category_slug: "jackets",
    category_name: "Jackets",
    price: 9500,
    discount_percent: 20,
    discounted_price: 7600,
    stock: 18,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Olive"],
    is_featured: true,
    is_new: true,
    description_en:
      "Warm and lightweight puffer jacket for cold winters. Water-resistant outer shell with thermal insulation. Packable design.",
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(0)}T10:00:00Z`,
  },

  {
    id: "jacket-003",
    name_en: "Denim Casual Jacket",
    name_ur: "ڈینم کیژوئل جیکٹ",
    category_slug: "jackets",
    category_name: "Jackets",
    price: 6800,
    discount_percent: 0,
    discounted_price: 6800,
    stock: 27,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Light Blue Denim", "Dark Denim", "Black Denim"],
    is_featured: false,
    is_new: true,
    description_en:
      "Classic denim jacket for casual outings. Timeless style that pairs with everything. Sturdy fabric, comfortable fit.",
    images: [
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=70&fm=webp&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=70&fm=webp&fit=crop&auto=format",
    ],
    created_at: `${daysAgo(6)}T10:00:00Z`,
  },
];

export const demoBanners: DemoBanner[] = [
  {
    id: "banner-001",
    image_url:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=75&fm=webp&fit=crop",
    title: "New Arrivals — Premium Shirts",
    subtitle: "Pakistan ka No.1 Men's Fashion Store",
    cta_text: "Shop Shirts",
    link_url: "/category/shirts",
    is_active: true,
    display_order: 1,
  },
  {
    id: "banner-002",
    image_url:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&q=75&fm=webp&fit=crop",
    title: "Winter Jackets & Hoodies",
    subtitle: "Stay Warm, Stay Stylish — 20% Off",
    cta_text: "Shop Now",
    link_url: "/category/jackets",
    is_active: true,
    display_order: 2,
  },
  {
    id: "banner-003",
    image_url:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1200&q=75&fm=webp&fit=crop",
    title: "Kurta Shalwar Collection",
    subtitle: "Traditional Style — Modern Comfort",
    cta_text: "Explore",
    link_url: "/category/kurta-shalwar",
    is_active: true,
    display_order: 3,
  },
  {
    id: "banner-004",
    image_url:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&q=75&fm=webp&fit=crop",
    title: "Trouser Collection",
    subtitle: "Slim Fit, Chinos, Formal — All Styles",
    cta_text: "View Collection",
    link_url: "/category/trousers",
    is_active: true,
    display_order: 4,
  },
];

export const demoAgents: DemoAgent[] = [
  {
    id: "agent-001",
    full_name: "Ali Hassan",
    phone: "03001234567",
    referral_code: "ARTS-ALI847",
    total_referrals: 34,
    total_commission_earned: 15200,
    is_approved: true,
    is_blocked: false,
  },
  {
    id: "agent-002",
    full_name: "Usman Ahmed",
    phone: "03129876543",
    referral_code: "ARTS-USM321",
    total_referrals: 21,
    total_commission_earned: 9800,
    is_approved: true,
    is_blocked: false,
  },
  {
    id: "agent-003",
    full_name: "Bilal Khan",
    phone: "03451122334",
    referral_code: "ARTS-BIL556",
    total_referrals: 8,
    total_commission_earned: 3200,
    is_approved: true,
    is_blocked: false,
  },
  {
    id: "agent-004",
    full_name: "Hamza Raza",
    phone: "03219988776",
    referral_code: null,
    total_referrals: 0,
    total_commission_earned: 0,
    is_approved: false,
    is_blocked: false,
  },
];

export const demoOrders: DemoOrder[] = [
  {
    order_number: `RTS-${currentYear}-0001`,
    customer_name: "Muhammad Tariq",
    customer_phone: "03001234567",
    delivery_city: "Sadiqabad",
    total_amount: 5440,
    payment_method: "cod",
    status: "delivered",
    referral_code: "ARTS-ALI847",
    created_at: daysAgo(5),
  },
  {
    order_number: `RTS-${currentYear}-0002`,
    customer_name: "Adeel Farooq",
    customer_phone: "03119988776",
    delivery_city: "Bahawalpur",
    total_amount: 7800,
    payment_method: "jazzcash",
    status: "shipped",
    referral_code: null,
    created_at: daysAgo(3),
  },
  {
    order_number: `RTS-${currentYear}-0003`,
    customer_name: "Kashif Mehmood",
    customer_phone: "03451122334",
    delivery_city: "Lahore",
    total_amount: 11250,
    payment_method: "bank_transfer",
    status: "confirmed",
    referral_code: "ARTS-USM321",
    created_at: daysAgo(2),
  },
  {
    order_number: `RTS-${currentYear}-0004`,
    customer_name: "Zubair Ahmad",
    customer_phone: "03219988776",
    delivery_city: "Karachi",
    total_amount: 3500,
    payment_method: "cod",
    status: "pending",
    referral_code: null,
    created_at: daysAgo(1),
  },
  {
    order_number: `RTS-${currentYear}-0005`,
    customer_name: "Imran Butt",
    customer_phone: "03001122334",
    delivery_city: "Multan",
    total_amount: 4420,
    payment_method: "easypaisa",
    status: "packed",
    referral_code: "ARTS-BIL556",
    created_at: daysAgo(0),
  },
];

export const demoCityRates: DemoCityRate[] = [
  { city_name: "Sadiqabad", charge: 250 },
  { city_name: "Rahimyar Khan", charge: 250 },
  { city_name: "Bahawalpur", charge: 250 },
  { city_name: "Multan", charge: 250 },
  { city_name: "Lahore", charge: 250 },
  { city_name: "Karachi", charge: 250 },
  { city_name: "Islamabad", charge: 250 },
  { city_name: "Rawalpindi", charge: 250 },
  { city_name: "Faisalabad", charge: 250 },
  { city_name: "Peshawar", charge: 250 },
  { city_name: "Quetta", charge: 250 },
  { city_name: "Hyderabad", charge: 250 },
  { city_name: "Sialkot", charge: 250 },
  { city_name: "Gujranwala", charge: 250 },
  { city_name: "Sukkur", charge: 250 },
  { city_name: "Larkana", charge: 250 },
];

export const demoSiteSettings: DemoSiteSettings = {
  jazzcash_number: "03058165623",
  easypaisa_number: "03058165623",
  bank_name: "Meezan Bank",
  bank_account_title: "ARTS APPAREL",
  bank_iban: "PK00MEZN0000001234567890",
  whatsapp_number: "923058165623",
  contact_phone: "03058165623",
  contact_email: "info@artsapparel.pk",
  shop_address: "Club Road Near New Cafe Sajawal Sadiqabad, Sadiqabad Pakistan",
  facebook_url: "",
  tiktok_url: "",
  instagram_url: "",
};

export const demoDashboardStats: DemoDashboardStats = {
  today_revenue: 32450,
  today_orders: 7,
  total_orders: 142,
  total_revenue: 892500,
  pending_orders: 4,
  active_agents: 3,
  pending_agent_approvals: 1,
  pending_withdrawals: 2,
  total_products: 15,
  total_customers: 87,
};
