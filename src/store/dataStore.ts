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

const INITIAL_CATEGORIES: Category[] = [];
const INITIAL_PRODUCTS: Product[] = [];
const INITIAL_USERS: User[] = [];
const INITIAL_ORDER_ITEMS: OrderItem[] = [];
const INITIAL_ORDERS: Order[] = [];
const INITIAL_COMMISSIONS: Commission[] = [];
const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [];
const INITIAL_DELIVERY_RATES: DeliveryRate[] = [];
const INITIAL_BANNERS: Banner[] = [];
const INITIAL_SETTINGS: SiteSettings = {
  jazzcash_number: "",
  easypaisa_number: "",
  bank_name: "",
  bank_account_title: "",
  bank_iban: "",
  whatsapp_number: "",
  contact_phone: "",
  contact_email: "",
  physical_address: "",
  shop_address: "",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
};
const INITIAL_ADDRESSES: SavedAddress[] = [];

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

try { localStorage.removeItem("arts-apparel-data-v8"); } catch {}

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
      wishlist: [],
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
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ products: [newProduct, ...state.products] }));

        if (isSupabaseConfigured) {
          const dbPayload = {
            id: newProduct.id,
            name_en: newProduct.name_en,
            name_ur: newProduct.name_ur,
            name_roman_ur: newProduct.name_roman_ur,
            description_en: newProduct.description_en,
            description_ur: newProduct.description_ur,
            description_roman_ur: newProduct.description_roman_ur,
            category_id: newProduct.category_id,
            price: newProduct.price,
            discount_percent: newProduct.discount_percent,
            images: newProduct.images,
            sizes: newProduct.sizes,
            colors: newProduct.colors,
            stock: newProduct.stock,
            is_active: newProduct.is_active,
            is_featured: newProduct.is_featured,
          };
          void supabase.from("products").insert(dbPayload).select("*").single().then(({ data, error }) => {
            if (error || !data) {
              set((state) => ({ products: state.products.filter((product) => product.id !== newProduct.id) }));
              get().addToast("Product could not be saved to database", "error", error?.message);
              return;
            }
            const category = get().categories.find((item) => item.id === data.category_id);
            set((state) => ({
              products: state.products.map((product) => product.id === data.id
                ? { ...data, price: Number(data.price), discount_percent: Number(data.discount_percent), category_slug: category?.slug || "", category_name: category?.name_en || "" }
                : product),
            }));
            get().addToast("Product saved to Supabase");
          });
        } else {
          get().addToast("Product added locally", "info");
        }
        return newProduct;
      },

      updateProduct: (id, updates) => {
        const previous = get().products.find((product) => product.id === id);
        const updatedAt = new Date().toISOString();
        const allowedFields = new Set([
          "name_en", "name_ur", "name_roman_ur", "description_en", "description_ur",
          "description_roman_ur", "category_id", "price", "discount_percent",
          "images", "sizes", "colors", "stock", "is_active", "is_featured",
        ]);
        const dbUpdates = Object.fromEntries(
          Object.entries(updates).filter(([key]) => allowedFields.has(key))
        );
        set((state) => ({
          products: state.products.map((product) => product.id === id
            ? { ...product, ...updates, updated_at: updatedAt }
            : product),
        }));

        if (isSupabaseConfigured) {
          void supabase.from("products").update({ ...dbUpdates, updated_at: updatedAt }).eq("id", id).select("id").single().then(({ error }) => {
            if (error) {
              if (previous) set((state) => ({ products: state.products.map((product) => product.id === id ? previous : product) }));
              get().addToast("Product update could not be saved", "error", error.message);
              return;
            }
            get().addToast("Product updated in Supabase");
          });
        } else {
          get().addToast("Product updated locally", "info");
        }
      },

      deleteProduct: (id) => {
        const previous = get().products.find((product) => product.id === id);
        set((state) => ({ products: state.products.filter((product) => product.id !== id) }));
        if (isSupabaseConfigured) {
          void supabase.from("products").delete().eq("id", id).then(({ error }) => {
            if (error) {
              if (previous) set((state) => ({ products: [previous, ...state.products] }));
              get().addToast("Product could not be deleted", "error", error.message);
              return;
            }
            get().addToast("Product deleted from Supabase", "info");
          });
        } else {
          get().addToast("Product deleted locally", "info");
        }
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
          id: crypto.randomUUID(),
          name_en,
          name_ur,
          name_roman_ur: name_roman_ur || name_en,
          slug: slugify(name_en),
          display_order: maxOrder + 1,
          discount_percent,
          is_active: true,
        };
        set((state) => ({ categories: [...state.categories, newCat] }));
        if (isSupabaseConfigured) {
          void supabase.from("categories").insert({
            id: newCat.id,
            name_en: newCat.name_en,
            name_ur: newCat.name_ur,
            name_roman_ur: newCat.name_roman_ur,
            slug: newCat.slug,
            display_order: newCat.display_order,
            discount_percent: newCat.discount_percent,
            is_active: newCat.is_active,
          }).select("*").single().then(({ data, error }) => {
            if (error || !data) {
              set((state) => ({ categories: state.categories.filter((category) => category.id !== newCat.id) }));
              get().addToast("Category could not be saved", "error", error?.message);
              return;
            }
            set((state) => ({ categories: state.categories.map((category) => category.id === newCat.id ? data : category) }));
            get().addToast(`Category "${name_en}" saved to Supabase`);
          });
        } else {
          get().addToast(`Category "${name_en}" added locally`, "info");
        }
      },

      updateCategory: (id, updates) => {
        const previous = get().categories.find((category) => category.id === id);
        const nextUpdates = {
          ...updates,
          ...(updates.name_en ? { slug: slugify(updates.name_en) } : {}),
        };
        set((state) => ({
          categories: state.categories.map((category) => category.id === id
            ? { ...category, ...nextUpdates }
            : category),
        }));
        if (isSupabaseConfigured) {
          void supabase.from("categories").update(nextUpdates).eq("id", id).select("id").single().then(({ error }) => {
            if (error) {
              if (previous) set((state) => ({ categories: state.categories.map((category) => category.id === id ? previous : category) }));
              get().addToast("Category update could not be saved", "error", error.message);
              return;
            }
            get().addToast("Category updated in Supabase");
          });
        } else {
          get().addToast("Category updated locally", "info");
        }
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
        if (isSupabaseConfigured) {
          const moved = [sorted[idx], sorted[swapIdx]];
          void Promise.all(moved.map((category) =>
            supabase.from("categories").update({ display_order: category.display_order }).eq("id", category.id)
          )).then((results) => {
            const failed = results.find((result) => result.error);
            if (failed?.error) get().addToast("Category order could not be saved", "error", failed.error.message);
          });
        }
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
        const previous = get().categories.find((category) => category.id === id);
        set((state) => ({ categories: state.categories.filter((category) => category.id !== id) }));
        if (isSupabaseConfigured) {
          void supabase.from("categories").delete().eq("id", id).then(({ error }) => {
            if (error) {
              if (previous) set((state) => ({ categories: [...state.categories, previous].sort((a, b) => a.display_order - b.display_order) }));
              get().addToast("Category could not be deleted", "error", error.message);
              return;
            }
            get().addToast("Category deleted from Supabase", "info");
          });
        } else {
          get().addToast("Category deleted locally", "info");
        }
        return { success: true, message: "Category deletion requested." };
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
        const previous = get().orders.find((order) => order.id === orderId);
        const updatedAt = new Date().toISOString();
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  payment_status: paymentStatus ?? order.payment_status,
                  admin_note: adminNote !== undefined ? adminNote : order.admin_note,
                  updated_at: updatedAt,
                }
              : order
          ),
          commissions: status === "cancelled"
            ? state.commissions.map((commission) =>
                commission.order_id === orderId && commission.status !== "paid"
                  ? { ...commission, status: "cancelled" as CommissionStatus }
                  : commission
              )
            : state.commissions,
        }));

        const isDatabaseId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId);
        if (isSupabaseConfigured && isDatabaseId) {
          const update: Record<string, unknown> = { status, updated_at: updatedAt };
          if (paymentStatus !== undefined) update.payment_status = paymentStatus;
          if (adminNote !== undefined) update.admin_note = adminNote;

          void supabase.from("orders").update(update).eq("id", orderId).then(async ({ error }) => {
            if (error) {
              if (previous) {
                set((state) => ({
                  orders: state.orders.map((order) => order.id === orderId ? previous : order),
                }));
              }
              get().addToast("Order update could not be saved", "error", error.message);
              return;
            }
            if (status === "cancelled") {
              const { error: commissionError } = await supabase
                .from("commissions")
                .update({ status: "cancelled" })
                .eq("order_id", orderId)
                .neq("status", "paid");
              if (commissionError) console.error("Commission cancellation failed:", commissionError.message);
            }
            get().addToast(`Order status updated to ${status.toUpperCase()}`);
          });
        } else {
          get().addToast(`Order status updated to ${status.toUpperCase()}`);
        }
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
      name: "arts-apparel-data-v9",
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

