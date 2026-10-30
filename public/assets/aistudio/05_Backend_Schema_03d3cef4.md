# 05 — Backend Schema
# RTS Apparel — Supabase PostgreSQL
# (Planning document — ChatGPT will create this in Supabase via plugin)

---

## Important Notes

- This is a planning document only. The actual Supabase project and database will be created by ChatGPT using the Supabase plugin after the website is built in Google AI Studio.
- ALL table names, column names, and types in this document must match exactly what Google AI Studio generates in the frontend code.
- RLS (Row Level Security) must be enabled on every table.

---

## 1. Tables Overview

| Table | Description |
|---|---|
| `users` | All users — customers, agents, admin (linked to auth.users) |
| `products` | Product catalog |
| `categories` | Product categories (dynamic) |
| `orders` | Customer orders |
| `order_items` | Individual items within each order |
| `commissions` | Agent commission per order |
| `city_delivery_rates` | Delivery charges per city |
| `withdrawal_requests` | Agent withdrawal requests |
| `site_settings` | Key-value store for admin settings |
| `banners` | Homepage banner images |
| `wishlist` | Customer saved products |

---

## 2. Table Definitions

### 2.1 `users`
Extended profile table linked to `auth.users`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, references auth.users(id) ON DELETE CASCADE | Auth user ID |
| `full_name` | `text` | NOT NULL | User's full name |
| `phone` | `text` | | Pakistan phone number |
| `role` | `text` | NOT NULL, default 'customer', CHECK IN ('customer','agent','admin') | User role |
| `referral_code` | `text` | UNIQUE, nullable | Agent's unique referral code (e.g. RTS-ALI123) |
| `is_approved` | `boolean` | NOT NULL, default false | Agent approval status |
| `is_blocked` | `boolean` | NOT NULL, default false | Admin block status |
| `created_at` | `timestamptz` | NOT NULL, default now() | Registration date |
| `updated_at` | `timestamptz` | NOT NULL, default now() | Last update |

**Indexes:** `referral_code` (for checkout lookup), `role` (for role-based queries)

**RLS Policies:**
- `SELECT`: user can read own row (`auth.uid() = id`); admin can read all
- `INSERT`: only on signup (via service role or trigger)
- `UPDATE`: user can update own non-role fields; admin can update all fields
- `DELETE`: admin only

---

### 2.2 `categories`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default gen_random_uuid() | |
| `name_en` | `text` | NOT NULL | English name |
| `name_ur` | `text` | NOT NULL | Urdu name |
| `slug` | `text` | NOT NULL, UNIQUE | URL-friendly slug |
| `display_order` | `integer` | NOT NULL, default 0 | Sort order |
| `is_active` | `boolean` | NOT NULL, default true | Show/hide |
| `created_at` | `timestamptz` | NOT NULL, default now() | |

**Seed data (initial categories):**
- Shirts / شرٹس
- Trousers / ٹراؤزر
- Kurta Shalwar / کرتہ شلوار
- Hoodies / ہوڈیز
- Jackets / جیکٹس

**RLS Policies:**
- `SELECT`: public (all can read active categories)
- `INSERT/UPDATE/DELETE`: admin only

---

### 2.3 `products`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default gen_random_uuid() | |
| `name_en` | `text` | NOT NULL | English name |
| `name_ur` | `text` | | Urdu name |
| `description_en` | `text` | | English description |
| `description_ur` | `text` | | Urdu description |
| `category_id` | `uuid` | NOT NULL, FK → categories(id) | |
| `price` | `numeric(10,2)` | NOT NULL | Original price (PKR) |
| `discount_percent` | `numeric(5,2)` | default 0 | Product-level discount % |
| `images` | `text[]` | default '{}' | Supabase Storage URLs array |
| `sizes` | `text[]` | default '{}' | e.g. ['S','M','L','XL'] |
| `colors` | `text[]` | default '{}' | e.g. ['Black','White','Navy'] |
| `stock` | `integer` | NOT NULL, default 0 | Inventory count |
| `is_active` | `boolean` | NOT NULL, default true | Show/hide product |
| `is_featured` | `boolean` | NOT NULL, default false | Show in featured section |
| `created_at` | `timestamptz` | NOT NULL, default now() | |
| `updated_at` | `timestamptz` | NOT NULL, default now() | |

**Computed (via view or frontend):**
- `discounted_price = price * (1 - discount_percent/100)` (if category has discount, use max of product vs category discount)

**Indexes:** `category_id`, `is_active`, `is_featured`, full-text search on `name_en`

**RLS Policies:**
- `SELECT`: public (all can read active products)
- `INSERT/UPDATE/DELETE`: admin only

---

### 2.4 `orders`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default gen_random_uuid() | |
| `order_number` | `text` | UNIQUE, NOT NULL | Human-readable (RTS-2024-0001) |
| `customer_id` | `uuid` | FK → users(id) | Nullable (guest checkout future) |
| `customer_name` | `text` | NOT NULL | Name at checkout |
| `customer_phone` | `text` | NOT NULL | Phone at checkout |
| `agent_id` | `uuid` | FK → users(id), nullable | Referring agent |
| `referral_code` | `text` | nullable | Code entered at checkout |
| `status` | `text` | NOT NULL, default 'pending', CHECK IN ('pending','confirmed','packed','shipped','delivered','cancelled') | |
| `payment_method` | `text` | NOT NULL, CHECK IN ('cod','jazzcash','easypaisa','bank_transfer') | |
| `payment_status` | `text` | NOT NULL, default 'pending', CHECK IN ('pending','verified','failed') | |
| `transaction_id` | `text` | nullable | Customer-entered transaction ID |
| `subtotal` | `numeric(10,2)` | NOT NULL | Items total before delivery |
| `delivery_charge` | `numeric(10,2)` | NOT NULL, default 0 | City-based charge |
| `discount_amount` | `numeric(10,2)` | NOT NULL, default 0 | Total discount applied |
| `total_amount` | `numeric(10,2)` | NOT NULL | Final amount |
| `delivery_city` | `text` | NOT NULL | Selected city |
| `delivery_address` | `text` | NOT NULL | Full delivery address |
| `admin_note` | `text` | nullable | Admin internal note |
| `created_at` | `timestamptz` | NOT NULL, default now() | |
| `updated_at` | `timestamptz` | NOT NULL, default now() | |

**Indexes:** `customer_id`, `agent_id`, `status`, `created_at`, `order_number`

**RLS Policies:**
- `SELECT`: customer can read own orders (`customer_id = auth.uid()`); agent can read orders where `agent_id = auth.uid()`; admin can read all
- `INSERT`: authenticated users (or service role for guest)
- `UPDATE`: admin only (for status/payment changes)

---

### 2.5 `order_items`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default gen_random_uuid() | |
| `order_id` | `uuid` | NOT NULL, FK → orders(id) ON DELETE CASCADE | |
| `product_id` | `uuid` | NOT NULL, FK → products(id) | |
| `product_name_en` | `text` | NOT NULL | Snapshot at order time |
| `product_image` | `text` | | First image URL snapshot |
| `quantity` | `integer` | NOT NULL, default 1 | |
| `size` | `text` | | Selected size |
| `color` | `text` | | Selected color |
| `unit_price` | `numeric(10,2)` | NOT NULL | Price at order time (after discount) |
| `original_price` | `numeric(10,2)` | NOT NULL | Original price snapshot |

**RLS Policies:**
- `SELECT`: same as orders (via order_id join)
- `INSERT`: on order creation
- `UPDATE/DELETE`: admin only

---

### 2.6 `commissions`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default gen_random_uuid() | |
| `order_id` | `uuid` | NOT NULL, UNIQUE, FK → orders(id) | One commission per order |
| `agent_id` | `uuid` | NOT NULL, FK → users(id) | |
| `amount` | `numeric(10,2)` | nullable | Admin-set commission amount |
| `status` | `text` | NOT NULL, default 'pending', CHECK IN ('pending','approved','paid','cancelled') | |
| `admin_note` | `text` | nullable | |
| `paid_at` | `timestamptz` | nullable | When marked as paid |
| `created_at` | `timestamptz` | NOT NULL, default now() | |
| `updated_at` | `timestamptz` | NOT NULL, default now() | |

**RLS Policies:**
- `SELECT`: agent can read own commissions (`agent_id = auth.uid()`); admin reads all
- `INSERT`: service role / trigger on order creation with referral code
- `UPDATE`: admin only

---

### 2.7 `city_delivery_rates`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default gen_random_uuid() | |
| `city_name` | `text` | NOT NULL, UNIQUE | City name in English |
| `charge` | `numeric(10,2)` | NOT NULL | Delivery charge (PKR) |
| `is_active` | `boolean` | NOT NULL, default true | |

**RLS Policies:**
- `SELECT`: public (all can read — needed for checkout)
- `INSERT/UPDATE/DELETE`: admin only

---

### 2.8 `withdrawal_requests`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default gen_random_uuid() | |
| `agent_id` | `uuid` | NOT NULL, FK → users(id) | |
| `amount` | `numeric(10,2)` | NOT NULL | Requested amount (PKR) |
| `payment_method` | `text` | NOT NULL, CHECK IN ('jazzcash','easypaisa','bank_transfer') | |
| `account_details` | `text` | NOT NULL | JazzCash/bank account info (JSON string or text) |
| `status` | `text` | NOT NULL, default 'pending', CHECK IN ('pending','paid') | |
| `paid_at` | `timestamptz` | nullable | |
| `admin_note` | `text` | nullable | |
| `created_at` | `timestamptz` | NOT NULL, default now() | |

**RLS Policies:**
- `SELECT`: agent reads own requests; admin reads all
- `INSERT`: agent only (own requests)
- `UPDATE`: admin only

---

### 2.9 `site_settings`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `key` | `text` | PK | Setting key |
| `value` | `text` | | Setting value (JSON string for complex values) |
| `updated_at` | `timestamptz` | NOT NULL, default now() | |

**Initial keys:**
- `jazzcash_number`
- `easypaisa_number`
- `bank_name`, `bank_account_title`, `bank_iban`
- `whatsapp_number`
- `contact_email`
- `instagram_url`, `facebook_url`, `tiktok_url`

**RLS Policies:**
- `SELECT`: public (payment details needed at checkout)
- `INSERT/UPDATE/DELETE`: admin only

---

### 2.10 `banners`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default gen_random_uuid() | |
| `image_url` | `text` | NOT NULL | Supabase Storage URL |
| `link_url` | `text` | nullable | Click destination |
| `display_order` | `integer` | NOT NULL, default 0 | |
| `is_active` | `boolean` | NOT NULL, default true | |
| `created_at` | `timestamptz` | NOT NULL, default now() | |

**RLS Policies:**
- `SELECT`: public
- `INSERT/UPDATE/DELETE`: admin only

---

### 2.11 `wishlist`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default gen_random_uuid() | |
| `user_id` | `uuid` | NOT NULL, FK → users(id) ON DELETE CASCADE | |
| `product_id` | `uuid` | NOT NULL, FK → products(id) ON DELETE CASCADE | |
| `created_at` | `timestamptz` | NOT NULL, default now() | |

**Unique constraint:** `(user_id, product_id)`

**RLS Policies:**
- `SELECT/INSERT/DELETE`: user reads/manages own wishlist only (`user_id = auth.uid()`)

---

## 3. Category Discount Support

Add a `discount_percent` column to `categories` table for category-level discounts:

```sql
ALTER TABLE categories ADD COLUMN discount_percent numeric(5,2) DEFAULT 0;
ALTER TABLE categories ADD COLUMN discount_start_date timestamptz;
ALTER TABLE categories ADD COLUMN discount_end_date timestamptz;
```

**Discount priority logic (frontend):**
1. If product has `discount_percent > 0` → use product discount
2. Else if category has active `discount_percent > 0` → use category discount
3. Else → no discount

---

## 4. Storage Buckets

| Bucket Name | Public? | Allowed Types | Used For |
|---|---|---|---|
| `product-images` | Yes (public read) | image/jpeg, image/png, image/webp | Product photos |
| `banners` | Yes (public read) | image/jpeg, image/png, image/webp | Homepage banners |

**Storage Policies:**
- `product-images`: public read; authenticated admin write only
- `banners`: public read; authenticated admin write only

---

## 5. Database Functions & Triggers

### 5.1 Auto-create user profile on signup
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 5.2 Auto-create commission on order with referral code
```sql
CREATE OR REPLACE FUNCTION handle_order_commission()
RETURNS TRIGGER AS $$
DECLARE
  v_agent_id uuid;
BEGIN
  IF NEW.referral_code IS NOT NULL THEN
    SELECT id INTO v_agent_id
    FROM public.users
    WHERE referral_code = NEW.referral_code
      AND role = 'agent'
      AND is_approved = true
      AND is_blocked = false;

    IF v_agent_id IS NOT NULL THEN
      UPDATE public.orders SET agent_id = v_agent_id WHERE id = NEW.id;
      INSERT INTO public.commissions (order_id, agent_id, status)
      VALUES (NEW.id, v_agent_id, 'pending');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_created
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION handle_order_commission();
```

### 5.3 Cancel commission when order is cancelled
```sql
CREATE OR REPLACE FUNCTION handle_order_cancellation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE public.commissions
    SET status = 'cancelled'
    WHERE order_id = NEW.id AND status IN ('pending', 'approved');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION handle_order_cancellation();
```

### 5.4 Generate order number
```sql
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'RTS-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
    LPAD(NEXTVAL('order_number_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();
```

---

## 6. Auth Settings (Supabase Dashboard)

- Enable Email auth provider
- Disable "Confirm email" (for Pakistan market — most users don't check email)
  - Or enable if email flow is implemented
- Site URL: `https://rts-apparel.pages.dev` (update when custom domain is ready)
- Redirect URLs: add `https://rts-apparel.pages.dev/**`

---

## 7. Admin Role Setup

After Supabase is set up, manually insert admin user:
```sql
-- After creating admin account via signup:
UPDATE public.users
SET role = 'admin', is_approved = true
WHERE id = 'admin-auth-uid-here';
```

Or seed via Supabase dashboard SQL editor.

---

## 8. Environment Variables for Frontend

| Variable | Where to Get It |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon/public key |

These go in:
1. Local `.env` file (gitignored)
2. Cloudflare Pages Dashboard → Settings → Environment Variables (Production + Preview)
3. Also add `SUPABASE_URL` and `SUPABASE_KEY` for Pages Functions (encrypted)
