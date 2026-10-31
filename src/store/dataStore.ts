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

import {
  demoProducts,
  demoBanners,
  demoAgents,
  demoOrders,
  demoCityRates,
  demoSiteSettings,
} from "../data/demoData";

const CATEGORY_SLUG_TO_ID: Record<string, string> = {
  shirts: "cat-shirts",
  trousers: "cat-trousers",
  "kurta-shalwar": "cat-kurta",
  hoodies: "cat-hoodies",
  jackets: "cat-jackets",
};

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-shirts",
    name_en: "Shirts",
    name_ur: "شرٹس",
    name_roman_ur: "Shirts",
    slug: "shirts",
    display_order: 1,
    discount_percent: 0,
    is_active: true,
  },
  {
    id: "cat-trousers",
    name_en: "Trousers",
    name_ur: "ٹراؤزر",
    name_roman_ur: "Trousers",
    slug: "trousers",
    display_order: 2,
    discount_percent: 0,
    is_active: true,
  },
  {
    id: "cat-kurta",
    name_en: "Kurta Shalwar",
    name_ur: "کرتہ شلوار",
    name_roman_ur: "Kurta Shalwar",
    slug: "kurta-shalwar",
    display_order: 3,
    discount_percent: 0,
    is_active: true,
  },
  {
    id: "cat-hoodies",
    name_en: "Hoodies",
    name_ur: "ہوڈیز",
    name_roman_ur: "Hoodies",
    slug: "hoodies",
    display_order: 4,
    discount_percent: 0,
    is_active: true,
  },
  {
    id: "cat-jackets",
    name_en: "Jackets",
    name_ur: "جیکٹس",
    name_roman_ur: "Jackets",
    slug: "jackets",
    display_order: 5,
    discount_percent: 0,
    is_active: true,
  },
];

const INITIAL_PRODUCTS: Product[] = demoProducts.map((dp, index) => ({
  id: dp.id,
  name_en: dp.name_en,
  name_ur: dp.name_ur,
  name_roman_ur: dp.name_en,
  description_en: dp.description_en,
  description_ur: dp.description_en,
  description_roman_ur: dp.description_en,
  category_id: CATEGORY_SLUG_TO_ID[dp.category_slug] || "cat-shirts",
  category_slug: dp.category_slug,
  category_name: dp.category_name,
  price: dp.price,
  discount_percent: dp.discount_percent,
  discounted_price: dp.discounted_price,
  images: dp.images,
  sizes: dp.sizes,
  colors: dp.colors,
  stock: dp.stock,
  is_active: true,
  is_featured: dp.is_featured,
  is_new: dp.is_new,
  created_at:
    dp.created_at ||
    new Date(Date.now() - (demoProducts.length - index) * 86400000).toISOString(),
}));

const currentYear = new Date().getFullYear();
const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
};

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
    created_at: `${daysAgo(60)}T08:00:00Z`,
  },
  ...demoAgents.map((ag, idx) => ({
    id: ag.id,
    email:
      idx === 0
        ? "ali@rtsapparel.pk"
        : idx === 1
        ? "usman@rtsapparel.pk"
        : idx === 2
        ? "bilal@rtsapparel.pk"
        : "hamza@rtsapparel.pk",
    full_name: ag.full_name,
    phone: ag.phone,
    role: "agent" as const,
    referral_code: ag.referral_code,
    total_referrals: ag.total_referrals,
    total_commission_earned: ag.total_commission_earned,
    is_approved: ag.is_approved,
    is_blocked: ag.is_blocked,
    payment_method: "jazzcash" as const,
    payment_account_details: `JazzCash: ${ag.phone} (${ag.full_name})`,
    join_reason: !ag.is_approved
      ? "Fashion promoter in Sadiqabad & Rahimyar Khan"
      : undefined,
    created_at: `${daysAgo(30 - idx)}T10:00:00Z`,
  })),
  {
    id: "user-customer-1",
    email: "zain@rtsapparel.pk",
    full_name: "Muhammad Tariq",
    phone: "03001234567",
    role: "customer",
    referral_code: null,
    is_approved: true,
    is_blocked: false,
    created_at: `${daysAgo(25)}T16:00:00Z`,
  },
];

const INITIAL_ORDER_ITEMS: OrderItem[] = [
  {
    id: "oi-1",
    order_id: "ord-1001",
    product_id: "shirt-001",
    product_name_en: "Classic White Oxford Shirt",
    name_en: "Classic White Oxford Shirt",
    product_image: demoProducts[0].images[0],
    image: demoProducts[0].images[0],
    quantity: 2,
    size: "L",
    color: "White",
    unit_price: 2720,
    final_unit_price: 2720,
    original_price: 3200,
  },
  {
    id: "oi-2",
    order_id: "ord-1002",
    product_id: "kurta-002",
    product_name_en: "Embroidered Eid Kurta Set",
    name_en: "Embroidered Eid Kurta Set",
    product_image: demoProducts[8].images[0],
    image: demoProducts[8].images[0],
    quantity: 1,
    size: "L",
    color: "Beige",
    unit_price: 7800,
    final_unit_price: 7800,
    original_price: 7800,
  },
  {
    id: "oi-3",
    order_id: "ord-1003",
    product_id: "jacket-001",
    product_name_en: "Classic Leather Biker Jacket",
    name_en: "Classic Leather Biker Jacket",
    product_image: demoProducts[12].images[0],
    image: demoProducts[12].images[0],
    quantity: 1,
    size: "L",
    color: "Black",
    unit_price: 11250,
    final_unit_price: 11250,
    original_price: 12500,
  },
  {
    id: "oi-4",
    order_id: "ord-1004",
    product_id: "trouser-003",
    product_name_en: "Cargo Pants Street Style",
    name_en: "Cargo Pants Street Style",
    product_image: demoProducts[6].images[0],
    image: demoProducts[6].images[0],
    quantity: 1,
    size: "34",
    color: "Olive",
    unit_price: 3500,
    final_unit_price: 3500,
    original_price: 3500,
  },
  {
    id: "oi-5",
    order_id: "ord-1005",
    product_id: "hoodie-001",
    product_name_en: "Premium Oversized Hoodie",
    name_en: "Premium Oversized Hoodie",
    product_image: demoProducts[10].images[0],
    image: demoProducts[10].images[0],
    quantity: 1,
    size: "XL",
    color: "Black",
    unit_price: 4420,
    final_unit_price: 4420,
    original_price: 5200,
  },
];

const INITIAL_ORDERS: Order[] = demoOrders.map((doItem, idx) => {
  const orderId = `ord-${1001 + idx}`;
  const matchedAgent = demoAgents.find(
    (ag) => ag.referral_code && ag.referral_code === doItem.referral_code
  );
  const cityRate =
    demoCityRates.find(
      (c) => c.city_name.toLowerCase() === doItem.delivery_city.toLowerCase()
    )?.charge || 200;

  return {
    id: orderId,
    order_number: doItem.order_number,
    customer_id: idx === 0 ? "user-customer-1" : null,
    customer_name: doItem.customer_name,
    customer_phone: doItem.customer_phone,
    agent_id: matchedAgent ? matchedAgent.id : null,
    referral_code: doItem.referral_code,
    status: doItem.status,
    payment_method: doItem.payment_method,
    payment_status:
      doItem.status === "delivered" ||
      doItem.status === "shipped" ||
      doItem.status === "confirmed" ||
      doItem.status === "packed"
        ? "verified"
        : "pending",
    transaction_id:
      doItem.payment_method === "cod" ? null : `TXN-${currentYear}-00${idx + 1}`,
    subtotal: Math.max(0, doItem.total_amount - cityRate),
    delivery_charge: cityRate,
    discount_amount: 0,
    total_amount: doItem.total_amount,
    delivery_city: doItem.delivery_city,
    delivery_address: `Main Boulevard, ${doItem.delivery_city}, Pakistan`,
    admin_note: null,
    created_at: `${doItem.created_at}T12:00:00Z`,
    items: INITIAL_ORDER_ITEMS.filter((i) => i.order_id === orderId),
  };
});

const INITIAL_COMMISSIONS: Commission[] = [
  {
    id: "comm-1",
    order_id: "ord-1001",
    agent_id: "agent-001",
    amount: 550,
    status: "paid",
    admin_note: "Paid via JazzCash",
    paid_at: `${daysAgo(4)}T14:00:00Z`,
    created_at: `${daysAgo(5)}T11:20:00Z`,
  },
  {
    id: "comm-2",
    order_id: "ord-1003",
    agent_id: "agent-002",
    amount: 1125,
    status: "approved",
    admin_note: "10% referral commission",
    paid_at: null,
    created_at: `${daysAgo(2)}T15:45:00Z`,
  },
  {
    id: "comm-3",
    order_id: "ord-1005",
    agent_id: "agent-003",
    amount: 450,
    status: "pending",
    admin_note: "Pending delivery completion",
    paid_at: null,
    created_at: `${daysAgo(0)}T19:10:00Z`,
  },
];

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: "wd-1",
    agent_id: "agent-001",
    amount: 4500,
    payment_method: "jazzcash",
    account_details: "JazzCash: 03001234567 — Ali Hassan",
    status: "pending",
    paid_at: null,
    admin_note: null,
    created_at: `${daysAgo(2)}T18:00:00Z`,
  },
  {
    id: "wd-2",
    agent_id: "agent-002",
    amount: 3200,
    payment_method: "easypaisa",
    account_details: "EasyPaisa: 03129876543 — Usman Ahmed",
    status: "pending",
    paid_at: null,
    admin_note: null,
    created_at: `${daysAgo(1)}T10:00:00Z`,
  },
];

const INITIAL_DELIVERY_RATES: DeliveryRate[] = demoCityRates.map(
  (cr, idx) => ({
    id: `city-${idx + 1}`,
    city_name: cr.city_name,
    charge: cr.charge,
    is_active: true,
  })
);

const INITIAL_BANNERS: Banner[] = demoBanners.map((b) => ({
  id: b.id,
  title: b.title,
  title_en: b.title,
  title_ur: b.title,
  title_roman_ur: b.title,
  subtitle: b.subtitle,
  subtitle_en: b.subtitle,
  subtitle_ur: b.subtitle,
  subtitle_roman_ur: b.subtitle,
  cta_text: b.cta_text,
  image_url: b.image_url,
  link_url: b.link_url,
  cta_link: b.link_url,
  display_order: b.display_order,
  is_active: b.is_active,
  created_at: `${daysAgo(10)}T00:00:00Z`,
}));

const INITIAL_SETTINGS: SiteSettings = {
  jazzcash_number: demoSiteSettings.jazzcash_number,
  easypaisa_number: demoSiteSettings.easypaisa_number,
  bank_name: demoSiteSettings.bank_name,
  bank_account_title: demoSiteSettings.bank_account_title,
  bank_iban: demoSiteSettings.bank_iban,
  whatsapp_number: demoSiteSettings.whatsapp_number,
  contact_phone: demoSiteSettings.contact_phone,
  contact_email: demoSiteSettings.contact_email,
  physical_address: demoSiteSettings.shop_address,
  shop_address: demoSiteSettings.shop_address,
  instagram_url: demoSiteSettings.instagram_url,
  facebook_url: demoSiteSettings.facebook_url,
  tiktok_url: demoSiteSettings.tiktok_url,
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
      wishlist: ["shirt-001", "jacket-001"],
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
        const orderNumber = formatOrderNumber(nextSequence, new Date().getFullYear());

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
      name: "arts-apparel-data-v8",
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

