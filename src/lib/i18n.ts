import {
  AdminLanguage,
  Banner,
  Category,
  CustomerLanguage,
  Product,
} from "../types";

export const CUSTOMER_TRANSLATIONS: Record<
  CustomerLanguage,
  Record<string, string>
> = {
  en: {
    // Core Prompt Examples & Navigation
    home: "Home",
    shopNow: "Shop Now",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    myOrders: "My Orders",
    checkout: "Checkout",
    orderTracking: "Order Tracking",
    freeDelivery: "Free Delivery",
    contactUs: "Contact Us",
    myAccount: "My Account",
    agentHub: "Agent Hub",
    bag: "Bag",
    smartSearch: "Smart Search",
    searchPlaceholder: "Search kurtas, shirts, jackets...",
    searchGo: "Search",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    wishlist: "Wishlist",
    saved: "Saved",
    outOfStock: "Out of Stock",
    inStock: "in stock",

    // Home Page
    heroBadge: "ARTS APPAREL · Futuristic Dark Luxury · 2026",
    joinAgentNetwork: "Join Partner Agent Network",
    heroPriceCaption: "Bespoke Hand-Finished Plackets & Brass Hardware",
    trustDelivery: "Nationwide Delivery in 3–5 Business Days",
    trustExchange: "7-Day Complimentary Size Exchange",
    trustPayments: "COD · JazzCash · EasyPaisa · Meezan Bank",
    trustReferral: "Partner Referral Code: RTS-ALI123",
    sec1Kicker: "01. Sartorial Departments",
    shopByCategory: "Shop by Category",
    browseAllGarments: "Browse All Garments →",
    viewDepartment: "View Department",
    itemsCount: "items",
    sec2Kicker: "02. Signature Silhouettes",
    featuredCollection: "Featured Atelier Collection",
    exploreFullCatalog: "Explore Full Catalog →",
    sec3Kicker: "03. Latest Atelier Drops",
    newArrivals: "New Arrivals",
    viewAllNewArrivals: "View All New Arrivals →",
    sec4Kicker: "04. Seasonal Privilege",
    saleOffers: "Luxury Sale & Special Offers",
    shopAllDiscounted: "Shop All Discounted Pieces →",
    sec5Kicker: "05. The ARTS APPAREL Partner Network",
    partnerHeading: "Earn Commissions as an Approved ARTS APPAREL Style Partner",
    partnerSub:
      "Stylists, creators, and menswear enthusiasts across Pakistan earn direct commission on every order placed with their personal ARTS APPAREL referral code. Track real-time referrals and request instant payouts via JazzCash, EasyPaisa, or Bank Transfer.",
    openAgentDashboard: "Open Agent Dashboard",
    applyAgentAccount: "Apply for Agent Account",

    // Category & Filters
    allCollections: "All Collections",
    sortBy: "Sort by:",
    sortNewest: "Newest Arrivals",
    sortPriceLow: "Price: Low to High",
    sortPriceHigh: "Price: High to Low",
    filterGarments: "Filter Garments",
    reset: "Reset",
    size: "Size",
    color: "Tone / Color",
    maxPrice: "Max Price",
    saleOnly: "Show Sale / Discounted Only",
    all: "All",

    // Product Detail
    selectSize: "Select Size",
    selectColor: "Select Tone",
    piecesAvailable: "pieces available",
    craftSpecs: "Craft & Specifications",
    sizeGuide: "Pakistani Size Guide",
    deliveryExchange: "Delivery & Exchange",
    aiSuggestionsTitle: "AI Sartorial Pairing Suggestions",
    youMayAlsoLike: "You May Also Like",

    // Cart & Checkout
    shoppingBag: "Shopping Bag",
    emptyBagTitle: "Your Shopping Bag is Empty",
    emptyBagSub:
      "Explore our hand-loomed Karandi Kurtas, Egyptian cotton shirts, and suede outerwear.",
    browseCollections: "Browse Collections",
    orderSummary: "Order Summary",
    selectDeliveryCity: "Select Delivery City (Auto-calculates Charge)",
    agentReferralCode: "Agent Referral Code",
    apply: "Apply",
    remove: "Remove",
    originalTotal: "Original Total",
    discountsApplied: "Product & Category Discounts",
    subtotal: "Subtotal",
    delivery: "Delivery",
    totalPayable: "Total Payable",
    proceedToCheckout: "Proceed to Checkout",
    placeOrder: "Place Order",
    deliveryDestination: "1. Delivery Destination",
    paymentMethodTitle: "2. Payment Method",
    orderReviewTitle: "3. Order Review",
    recipientName: "Recipient Full Name *",
    mobileNumber: "Pakistan Mobile Number *",
    streetAddress: "Complete Street Address & Sector / Phase *",
    codTitle: "Cash on Delivery (COD)",
    codSub: "Pay in cash upon doorstep delivery",
    jazzcashTitle: "JazzCash Mobile Account",
    easypaisaTitle: "EasyPaisa Mobile Wallet",
    bankTransferTitle: "Bank Transfer (IBAN)",
    trxIdLabel: "Enter Transaction ID / Reference Number *",

    // Track Order
    trackHeading: "Order Tracking",
    trackSub:
      "Enter both your ARTS APPAREL Order Number and registered Phone Number to verify and inspect live delivery progress.",
    orderNumberPlaceholder: "Order Number (e.g. RTS-2026-0001)",
    phoneVerifyPlaceholder: "Verification Phone Number (e.g. 0301-7766554)",
    trackBtn: "Track Order",
    dispatchDetails: "Dispatch Details",

    // Footer
    footerTagline:
      "Premium Men's Fashion. Bespoke Karandi Kurtas, two-ply Egyptian cotton shirts, and full-grain suede outerwear by ARTS APPAREL.",
    collections: "Collections",
    clientCare: "Client Care",
    conciergePayments: "Concierge & Payments",
    aboutAtelier: "About ARTS APPAREL",
  },
  ur: {
    // Core Prompt Examples & Navigation
    home: "ہوم",
    shopNow: "ابھی خریداری کریں",
    addToCart: "کارٹ میں شامل کریں",
    buyNow: "ابھی خریدیں",
    myOrders: "میرے آرڈرز",
    checkout: "چیک آؤٹ",
    orderTracking: "آرڈر ٹریکنگ",
    freeDelivery: "مفت ڈیلیوری",
    contactUs: "رابطہ کریں",
    myAccount: "میرا اکاؤنٹ",
    agentHub: "ایجنٹ پورٹل",
    bag: "بیگ",
    smartSearch: "سمارٹ سرچ",
    searchPlaceholder: "کرتہ شلوار، شرٹس، جیکٹس تلاش کریں...",
    searchGo: "تلاش",
    signIn: "سائن ان کریں",
    signUp: "نیا اکاؤنٹ بنائیں",
    signOut: "لاگ آؤٹ",
    wishlist: "پسندیدہ",
    saved: "محفوظ شدہ",
    outOfStock: "اسٹاک ختم",
    inStock: "دستیاب",

    // Home Page
    heroBadge: "لاہور فلیگ شپ اٹیلیئر · موسمِ سرما 2026",
    joinAgentNetwork: "پارٹنر ایجنٹ نیٹ ورک میں شامل ہوں",
    heroPriceCaption: "ہاتھ سے تیار کردہ نفیس کڑھائی اور پیتل کے بٹن",
    trustDelivery: "پورے پاکستان میں 3 سے 5 دن میں ڈیلیوری",
    trustExchange: "7 دن کے اندر مفت سائز ایکسچینج",
    trustPayments: "کیش آن ڈیلیوری · جاز کیش · ایزی پیسہ · میزان بینک",
    trustReferral: "پارٹنر ریفرل کوڈ: RTS-ALI123",
    sec1Kicker: "01. ملبوسات کی اقسام",
    shopByCategory: "اقسام کے مطابق خریداری کریں",
    browseAllGarments: "تمام ملبوسات دیکھیں ←",
    viewDepartment: "مکمل کلیکشن دیکھیں",
    itemsCount: "ملبوسات",
    sec2Kicker: "02. خاص کلیکشن",
    featuredCollection: "نمایاں شاہی ملبوسات",
    exploreFullCatalog: "مکمل کیٹلاگ دیکھیں ←",
    sec3Kicker: "03. نئی کلیکشن",
    newArrivals: "نئی آمد",
    viewAllNewArrivals: "تمام نئے ملبوسات دیکھیں ←",
    sec4Kicker: "04. خصوصی رعایت",
    saleOffers: "سیل اور ڈسکاؤنٹ آفرز",
    shopAllDiscounted: "تمام رعایتی ملبوسات دیکھیں ←",
    sec5Kicker: "05. آرٹس اپیرل پارٹنر پروگرام",
    partnerHeading: "ARTS APPAREL اسٹائل پارٹنر بن کر کمیشن کمائیں",
    partnerSub:
      "پاکستان بھر سے اپنے ذاتی ریفرل کوڈ کے ذریعے ہر آرڈر پر کمیشن حاصل کریں اور جاز کیش، ایزی پیسہ یا بینک کے ذریعے فوری رقم نکلوائیں۔",
    openAgentDashboard: "ایجنٹ ڈیش بورڈ کھولیں",
    applyAgentAccount: "ایجنٹ اکاؤنٹ کے لیے اپلائی کریں",

    // Category & Filters
    allCollections: "تمام کلیکشنز",
    sortBy: "ترتیب:",
    sortNewest: "نئی آمد پہلے",
    sortPriceLow: "قیمت: کم سے زیادہ",
    sortPriceHigh: "قیمت: زیادہ سے کم",
    filterGarments: "فلٹرز",
    reset: "ری سیٹ",
    size: "سائز",
    color: "رنگ",
    maxPrice: "زیادہ سے زیادہ قیمت",
    saleOnly: "صرف ڈسکاؤنٹ والے ملبوسات",
    all: "سب",

    // Product Detail
    selectSize: "سائز منتخب کریں",
    selectColor: "رنگ منتخب کریں",
    piecesAvailable: "عدد اسٹاک میں موجود",
    craftSpecs: "تفصیلات اور معیار",
    sizeGuide: "پاکستانی سائز گائیڈ",
    deliveryExchange: "ڈیلیوری اور واپسی",
    aiSuggestionsTitle: "اے آئی اسٹائلنگ تجاویز",
    youMayAlsoLike: "آپ کو یہ بھی پسند آ سکتے ہیں",

    // Cart & Checkout
    shoppingBag: "شاپنگ بیگ",
    emptyBagTitle: "آپ کا شاپنگ بیگ خالی ہے",
    emptyBagSub: "ہمارے خالص کرنڈی کرتہ شلوار، کاٹن شرٹس اور جیکٹس دریافت کریں۔",
    browseCollections: "کلیکشنز دیکھیں",
    orderSummary: "آرڈر کا خلاصہ",
    selectDeliveryCity: "ڈیلیوری کا شہر منتخب کریں",
    agentReferralCode: "ایجنٹ ریفرل کوڈ",
    apply: "لاگو کریں",
    remove: "ہٹائیں",
    originalTotal: "اصل رقم",
    discountsApplied: "ڈسکاؤنٹ",
    subtotal: "ذیلی کل",
    delivery: "ڈیلیوری چارجز",
    totalPayable: "واجب الادا کل رقم",
    proceedToCheckout: "چیک آؤٹ کریں",
    placeOrder: "آرڈر مکمل کریں",
    deliveryDestination: "1. ڈیلیوری کا پتہ",
    paymentMethodTitle: "2. ادائیگی کا طریقہ",
    orderReviewTitle: "3. آرڈر کی تفصیل",
    recipientName: "مکمل نام *",
    mobileNumber: "موبائل نمبر *",
    streetAddress: "مکمل پتہ اور سیکٹر / فیز *",
    codTitle: "کیش آن ڈیلیوری (COD)",
    codSub: "پارسل ملنے پر نقد ادائیگی کریں",
    jazzcashTitle: "جاز کیش موبائل اکاؤنٹ",
    easypaisaTitle: "ایزی پیسہ موبائل اکاؤنٹ",
    bankTransferTitle: "بینک ٹرانسفر (IBAN)",
    trxIdLabel: "ٹرانزیکشن آئی ڈی / حوالہ نمبر درج کریں *",

    // Track Order
    trackHeading: "آرڈر ٹریکنگ",
    trackSub:
      "اپنے آرڈر کی لائیو معلومات دیکھنے کے لیے آرڈر نمبر اور موبائل نمبر دونوں درج کریں۔",
    orderNumberPlaceholder: "آرڈر نمبر (مثلاً RTS-2026-0001)",
    phoneVerifyPlaceholder: "موبائل نمبر (مثلاً 0301-7766554)",
    trackBtn: "آرڈر ٹریک کریں",
    dispatchDetails: "ترسیل کی تفصیلات",

    // Footer
    footerTagline:
      "پاکستان کا پریمیم مینز فیشن برانڈ — لاہور میں تیار کردہ خالص کرنڈی کرتہ شلوار، شرٹس اور جیکٹس۔",
    collections: "کلیکشنز",
    clientCare: "کسٹمر سروس",
    conciergePayments: "رابطہ اور ادائیگی",
    aboutAtelier: "ہمارے بارے میں",
  },
  roman_ur: {
    // Core Prompt Examples & Navigation
    home: "Home",
    shopNow: "Abhi Shopping Karein",
    addToCart: "Cart Mein Shamil Karein",
    buyNow: "Abhi Khareedein",
    myOrders: "Mere Orders",
    checkout: "Checkout",
    orderTracking: "Order Track Karein",
    freeDelivery: "Muft Delivery",
    contactUs: "Rabta Karein",
    myAccount: "Mera Account",
    agentHub: "Agent Portal",
    bag: "Bag",
    smartSearch: "Smart Search",
    searchPlaceholder: "Kurta, shirts, jackets talash karein...",
    searchGo: "Talash Karein",
    signIn: "Sign In Karein",
    signUp: "Account Banayein",
    signOut: "Logout Karein",
    wishlist: "Pasandeeda",
    saved: "Mahfooz",
    outOfStock: "Stock Khatam",
    inStock: "stock mein",

    // Home Page
    heroBadge: "Lahore Flagship Atelier · Sardiyon Ka Collection 2026",
    joinAgentNetwork: "Partner Agent Network Join Karein",
    heroPriceCaption: "Hath Se Tayyar Karda Karhai Aur Brass Buttons",
    trustDelivery: "Poore Pakistan Mein 3–5 Din Mein Delivery",
    trustExchange: "7 Din Mein Muft Size Exchange",
    trustPayments: "COD · JazzCash · EasyPaisa · Meezan Bank",
    trustReferral: "Partner Referral Code: RTS-ALI123",
    sec1Kicker: "01. Libas Ki Iqsam",
    shopByCategory: "Category Ke Mutabiq Khareedari",
    browseAllGarments: "Tamam Libas Dekhein →",
    viewDepartment: "Collection Dekhein",
    itemsCount: "products",
    sec2Kicker: "02. Khas Collection",
    featuredCollection: "Numayan Shahi Libas",
    exploreFullCatalog: "Mukammal Catalog Dekhein →",
    sec3Kicker: "03. Naya Stock",
    newArrivals: "Naye Libas (New Arrivals)",
    viewAllNewArrivals: "Tamam Naye Libas Dekhein →",
    sec4Kicker: "04. Khasosi Riayat",
    saleOffers: "Luxury Sale Aur Discount Offers",
    shopAllDiscounted: "Tamam Discounted Libas Dekhein →",
    sec5Kicker: "05. ARTS APPAREL Partner Network",
    partnerHeading: "ARTS APPAREL Style Partner Ban Kar Commission Kamayein",
    partnerSub:
      "Apne referral code ke zariye har order par commission hasil karein aur JazzCash, EasyPaisa ya Bank Transfer se payout lein.",
    openAgentDashboard: "Agent Dashboard Kholein",
    applyAgentAccount: "Agent Account Ke Liye Apply Karein",

    // Category & Filters
    allCollections: "Tamam Collections",
    sortBy: "Tarteeb:",
    sortNewest: "Naye Libas Pehle",
    sortPriceLow: "Qeemat: Kam Se Zyada",
    sortPriceHigh: "Qeemat: Zyada Se Kam",
    filterGarments: "Libas Filter Karein",
    reset: "Reset Karein",
    size: "Size",
    color: "Rang / Color",
    maxPrice: "Zyada Se Zyada Qeemat",
    saleOnly: "Sirf Discount Wale Dikhayein",
    all: "Sab",

    // Product Detail
    selectSize: "Size Muntakhib Karein",
    selectColor: "Rang Muntakhib Karein",
    piecesAvailable: "pieces dastiyab hain",
    craftSpecs: "Mayar Aur Tafseelat",
    sizeGuide: "Pakistani Size Guide",
    deliveryExchange: "Delivery Aur Exchange",
    aiSuggestionsTitle: "AI Styling Mashwaray",
    youMayAlsoLike: "Aap Ko Yeh Bhi Pasand Aa Sakte Hain",

    // Cart & Checkout
    shoppingBag: "Shopping Bag",
    emptyBagTitle: "Aap Ka Shopping Bag Khali Hai",
    emptyBagSub:
      "Hamare hand-loomed Karandi Kurtas, Egyptian cotton shirts aur jackets dekhein.",
    browseCollections: "Collections Dekhein",
    orderSummary: "Order Ka Khulasa",
    selectDeliveryCity: "Delivery Shehar Muntakhib Karein",
    agentReferralCode: "Agent Referral Code",
    apply: "Lagayein",
    remove: "Hatayein",
    originalTotal: "Asal Raqam",
    discountsApplied: "Product Aur Category Discount",
    subtotal: "Subtotal",
    delivery: "Delivery Charges",
    totalPayable: "Kul Wajib-ul-Ada Raqam",
    proceedToCheckout: "Checkout Par Jayein",
    placeOrder: "Order Mukammal Karein",
    deliveryDestination: "1. Delivery Ka Pata",
    paymentMethodTitle: "2. Payment Ka Tareeqa",
    orderReviewTitle: "3. Order Ki Tafseel",
    recipientName: "Mukammal Naam *",
    mobileNumber: "Mobile Number *",
    streetAddress: "Mukammal Street Address Aur Sector / Phase *",
    codTitle: "Cash on Delivery (COD)",
    codSub: "Parcel milne par naqad adaigi karein",
    jazzcashTitle: "JazzCash Mobile Account",
    easypaisaTitle: "EasyPaisa Mobile Wallet",
    bankTransferTitle: "Bank Transfer (IBAN)",
    trxIdLabel: "Transaction ID / Reference Number Darj Karein *",

    // Track Order
    trackHeading: "Order Track Karein",
    trackSub:
      "Apne order ka live status dekhne ke liye Order Number aur apna Mobile Number dono darj karein.",
    orderNumberPlaceholder: "Order Number (maslan RTS-2026-0001)",
    phoneVerifyPlaceholder: "Verification Mobile Number (maslan 0301-7766554)",
    trackBtn: "Order Track Karein",
    dispatchDetails: "Delivery Ki Tafseelat",

    // Footer
    footerTagline:
      "Pakistan ka premium men's fashion brand — Lahore mein tayyar karda Karandi Kurtas, shirts aur jackets.",
    collections: "Collections",
    clientCare: "Customer Care",
    conciergePayments: "Rabta Aur Payments",
    aboutAtelier: "Hamare Bare Mein",
  },
};

export const ADMIN_TRANSLATIONS: Record<
  AdminLanguage,
  Record<string, string>
> = {
  en: {
    dashboard: "Dashboard",
    products: "Products",
    addProduct: "Add Product",
    editProduct: "Edit Product",
    deleteProduct: "Delete Product",
    categories: "Categories",
    customers: "Customers",
    orders: "Orders",
    pendingOrders: "Pending Orders",
    discounts: "Discounts",
    teamMembers: "Agent Management",
    commissions: "Commissions",
    withdrawals: "Withdrawals",
    deliveryCharges: "Delivery Charges",
    banners: "Hero Banners",
    settings: "Settings",
    reports: "Reports",
    saveChanges: "Save Changes",
    logout: "Logout",
    totalRevenue: "Total Revenue",
    agentApprovals: "Agent Approvals",
    pendingPayouts: "Pending Payouts",
    catalogItems: "Catalog Items",
    activeAgents: "Active Agents",
    recentOrders: "Recent Customer Orders",
    manageAllOrders: "Manage All Orders →",
    topAgents: "Top Partner Agents",
    topProducts: "Top Performing Garments",
    adminConsoleTitle: "ARTS APPAREL Admin Console",
    adminConsoleSubtitle: "Store Operations & Executive Overview",
  },
  roman_ur: {
    dashboard: "Dashboard",
    products: "Products",
    addProduct: "Naya Product Shamil Karein",
    editProduct: "Product Mein Tabdeeli Karein",
    deleteProduct: "Product Delete Karein",
    categories: "Categories",
    customers: "Customers",
    orders: "Orders",
    pendingOrders: "Pending Orders",
    discounts: "Discounts",
    teamMembers: "Agents Management",
    commissions: "Commissions",
    withdrawals: "Withdrawals",
    deliveryCharges: "Delivery Charges",
    banners: "Hero Banners",
    settings: "Settings",
    reports: "Reports",
    saveChanges: "Tabdeeliyan Save Karein",
    logout: "Logout Karein",
    totalRevenue: "Kul Amdani (Revenue)",
    agentApprovals: "Agent Approvals",
    pendingPayouts: "Pending Payouts",
    catalogItems: "Kul Products",
    activeAgents: "Active Agents",
    recentOrders: "Haaliya Customer Orders",
    manageAllOrders: "Tamam Orders Dekhein →",
    topAgents: "Behtareen Partner Agents",
    topProducts: "Sab Se Zyada Bikne Wale Libas",
    adminConsoleTitle: "ARTS APPAREL Admin Console",
    adminConsoleSubtitle: "Store Operations Aur Intizamiya",
  },
};

export function getCategoryName(
  cat: Category | undefined,
  lang: CustomerLanguage | AdminLanguage
): string {
  if (!cat) return "";
  if (lang === "ur") return cat.name_ur || cat.name_en;
  if (lang === "roman_ur") return cat.name_roman_ur || cat.name_en;
  return cat.name_en;
}

export function getProductName(
  prod: Product | undefined,
  lang: CustomerLanguage | AdminLanguage
): string {
  if (!prod) return "";
  if (lang === "ur") return prod.name_ur || prod.name_en;
  if (lang === "roman_ur") return prod.name_roman_ur || prod.name_en;
  return prod.name_en;
}

export function getProductDescription(
  prod: Product | undefined,
  lang: CustomerLanguage | AdminLanguage
): string {
  if (!prod) return "";
  if (lang === "ur") return prod.description_ur || prod.description_en || "";
  if (lang === "roman_ur")
    return prod.description_roman_ur || prod.description_en || "";
  return prod.description_en || "";
}

export function getBannerTitle(
  ban: Banner | undefined,
  lang: CustomerLanguage
): string {
  if (!ban) return "Where Pakistani Men Dress Sharp.";
  if (lang === "ur") return ban.title_ur || ban.title_en || "";
  if (lang === "roman_ur")
    return ban.title_roman_ur || ban.title_en || "";
  return ban.title_en || "";
}

export function getBannerSubtitle(
  ban: Banner | undefined,
  lang: CustomerLanguage
): string {
  if (!ban) return "";
  if (lang === "ur")
    return (
      ban.subtitle_ur ||
      "ہاتھ سے تیار کردہ خالص کرنڈی کرتہ شلوار، مصری کاٹن شرٹس اور سوئیڈ جیکٹس۔"
    );
  if (lang === "roman_ur")
    return (
      ban.subtitle_roman_ur ||
      "Hand-loomed Karandi Kurtas, Egyptian cotton shirts aur lambskin suede jackets."
    );
  return ban.subtitle_en || "";
}
