export type UserRole = "customer" | "agent" | "admin";

export type CustomerLanguage = "en" | "ur" | "roman_ur";
export type AdminLanguage = "en" | "roman_ur";

export interface User {
  id: string;
  email?: string;
  full_name: string;
  phone: string;
  role: UserRole;
  referral_code: string | null;
  is_approved: boolean;
  is_blocked: boolean;
  payment_method?: "jazzcash" | "easypaisa" | "bank_transfer";
  payment_account_details?: string;
  join_reason?: string;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_ur: string;
  name_roman_ur?: string;
  slug: string;
  display_order: number;
  discount_percent: number;
  discount_start_date?: string | null;
  discount_end_date?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  name_en: string;
  name_ur: string | null;
  name_roman_ur?: string | null;
  description_en: string | null;
  description_ur: string | null;
  description_roman_ur?: string | null;
  category_id: string;
  price: number;
  discount_percent: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
  categories?: Category;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod =
  | "cod"
  | "jazzcash"
  | "easypaisa"
  | "bank_transfer";

export type PaymentStatus = "pending" | "verified" | "failed";

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name_en?: string;
  name_en?: string;
  name_ur?: string | null;
  product_image?: string;
  image?: string;
  quantity: number;
  size: string;
  color: string;
  unit_price: number;
  original_price?: number;
  discount_percent?: number;
  final_unit_price?: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  agent_id: string | null;
  referral_code: string | null;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id: string | null;
  payment_proof_url?: string | null;
  subtotal: number;
  delivery_charge: number;
  discount_amount: number;
  total_amount: number;
  delivery_city: string;
  delivery_address: string;
  notes?: string | null;
  admin_note?: string | null;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
}

export type CommissionStatus = "pending" | "approved" | "paid" | "cancelled";

export interface Commission {
  id: string;
  order_id: string;
  agent_id: string;
  amount: number | null;
  status: CommissionStatus;
  admin_note?: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at?: string;
}

export interface DeliveryRate {
  id: string;
  city_name: string;
  charge: number;
  is_active: boolean;
}

export interface WithdrawalRequest {
  id: string;
  agent_id: string;
  amount: number;
  payment_method: "jazzcash" | "easypaisa" | "bank_transfer";
  account_details: string;
  status: "pending" | "paid";
  paid_at: string | null;
  admin_note?: string | null;
  created_at: string;
}

export interface SiteSettings {
  jazzcash_number: string;
  easypaisa_number: string;
  bank_name: string;
  bank_account_title: string;
  bank_iban: string;
  whatsapp_number: string;
  contact_email: string;
  physical_address: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
}

export interface Banner {
  id: string;
  title_en?: string;
  title_ur?: string;
  title_roman_ur?: string;
  subtitle_en?: string;
  subtitle_ur?: string;
  subtitle_roman_ur?: string;
  image_url: string;
  link_url: string | null;
  cta_link?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface SavedAddress {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  city: string;
  address_line: string;
  is_default: boolean;
}

export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
}
