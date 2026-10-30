# 06 — Implementation Plan
# RTS Apparel — Google AI Studio Execution Guide

---

## Important: How This File Is Used

This document is the internal execution plan for **Google AI Studio**. When all 6 files are uploaded and `Follow the plan` is sent:
- AI Studio reads ALL 6 files first
- Builds the complete React + TypeScript website in the order defined below
- Does NOT ask clarifying questions — it follows this plan exactly
- Outputs all files ready for GitHub export

---

## Build Order & Execution Plan

### Phase 1 — Project Setup & Configuration

**1.1 Initialize project structure**
- Vite + React + TypeScript project
- Install dependencies: `react-router-dom`, `@supabase/supabase-js`, `zustand`, `tailwindcss`, `shadcn-ui`, `lucide-react`, `@tanstack/react-query`
- Configure Tailwind with custom dark theme tokens from UI/UX Design Brief (Section 2)
- Configure TypeScript paths (`@/` → `src/`)
- Create `public/_redirects` file with `/* /index.html 200`
- Create `.npmrc` with `legacy-peer-deps=true`
- Create `.gitignore` (node_modules, dist, .env, .wrangler)
- Create `.env.example` with all required env variable names

**1.2 Core files to create first**
- `src/lib/supabase.ts` — Supabase client using `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- `src/lib/ai.ts` — fetch helpers for `/api/ai/search`, `/api/ai/recommendations`, `/api/ai/chat`
- `src/lib/utils.ts` — shared utilities (price formatter PKR, discount calculator, order number formatter)
- `src/types/index.ts` — ALL TypeScript interfaces (User, Product, Category, Order, OrderItem, Commission, Agent, CartItem, Banner, SiteSettings, DeliveryRate, WithdrawalRequest)
- `src/store/authStore.ts` — Zustand: current user, role, session
- `src/store/cartStore.ts` — Zustand: cart items, add/remove/update, persist to localStorage
- `wrangler.toml` — AI binding config (as per TRD Section 6)

**1.3 TypeScript interfaces (must match Backend Schema exactly)**
```typescript
// Key interfaces — all must be in src/types/index.ts
interface User {
  id: string
  full_name: string
  phone: string
  role: 'customer' | 'agent' | 'admin'
  referral_code: string | null
  is_approved: boolean
  is_blocked: boolean
  created_at: string
}

interface Product {
  id: string
  name_en: string
  name_ur: string | null
  description_en: string | null
  description_ur: string | null
  category_id: string
  price: number
  discount_percent: number
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  categories?: Category
}

interface Category {
  id: string
  name_en: string
  name_ur: string
  slug: string
  display_order: number
  discount_percent: number
  is_active: boolean
}

interface Order {
  id: string
  order_number: string
  customer_id: string | null
  customer_name: string
  customer_phone: string
  agent_id: string | null
  referral_code: string | null
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer'
  payment_status: 'pending' | 'verified' | 'failed'
  transaction_id: string | null
  subtotal: number
  delivery_charge: number
  discount_amount: number
  total_amount: number
  delivery_city: string
  delivery_address: string
  created_at: string
}

interface Commission {
  id: string
  order_id: string
  agent_id: string
  amount: number | null
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
  paid_at: string | null
  created_at: string
}

interface CartItem {
  product_id: string
  product: Product
  quantity: number
  size: string
  color: string
}
```

---

### Phase 2 — Layout & Design System

**2.1 Global styles & Tailwind setup**
- Apply dark theme: `background: #0A0A0A` on `body`
- Import Google Fonts: Inter, Playfair Display, Noto Nastaliq Urdu
- shadcn/ui component overrides for dark theme (input, button, card, dialog, dropdown)
- Custom CSS variables matching UI/UX Design Brief color tokens

**2.2 Layout components**
- `src/components/layout/Navbar.tsx` — fixed top, logo, categories dropdown, search icon, wishlist, cart icon with count badge, account dropdown
- `src/components/layout/Footer.tsx` — brand info, category links, payment method logos, social links, copyright
- `src/components/layout/AdminSidebar.tsx` — 240px fixed sidebar with all admin nav items, gold active indicator
- `src/components/layout/AccountSidebar.tsx` — customer account nav
- `src/components/layout/TeamSidebar.tsx` — agent dashboard nav
- `src/components/common/ProtectedRoute.tsx` — wraps routes; checks auth + role; redirects if unauthorized
- `src/components/common/LoadingSkeleton.tsx` — shimmer skeleton for cards
- `src/components/common/DiscountBadge.tsx` — gold badge "-X%"
- `src/components/common/OrderStatusTimeline.tsx` — vertical steps component
- `src/components/common/Toast.tsx` — top-right notification

---

### Phase 3 — Customer Store Pages

Build in this order (each page fully functional with Supabase data):

**3.1 Home Page (`src/pages/Home.tsx`)**
- Hero banner slider (fetch from `banners` table, active only)
- Categories grid (fetch from `categories` table, display_order sorted)
- Featured products grid (fetch products where `is_featured = true`)
- New arrivals (latest 8 products)
- Sale/discount section (products with `discount_percent > 0`)

**3.2 Category Page (`src/pages/Category.tsx`)**
- Route: `/category/:slug`
- Fetch category by slug → fetch products by `category_id`
- Filter sidebar (size, color, price range)
- Sort dropdown (newest, price asc/desc)
- Product grid with `ProductCard` component
- Pagination or infinite scroll (show 12 per load)

**3.3 Product Card Component (`src/components/products/ProductCard.tsx`)**
- Image with discount badge overlay
- Category name, product name (English)
- Discounted price (gold) + original price (strikethrough)
- Add to Cart button
- Wishlist heart icon
- Hover: scale + gold border

**3.4 Product Detail Page (`src/pages/ProductDetail.tsx`)**
- Route: `/product/:id`
- Left: Image gallery (main + thumbnails)
- Right: Product info — name, category, price, size selector, color selector, quantity, Add to Cart, Add to Wishlist
- Show computed discounted price
- Below: AI Recommendations section (`POST /api/ai/recommendations`)
- Product description (English + Urdu toggle)

**3.5 Search Page (`src/pages/Search.tsx`)**
- Route: `/search?q=query`
- On search: `POST /api/ai/search` → get keywords → query Supabase products
- Show loading state while AI processes
- Fallback: if AI fails, do basic text search on `name_en`

**3.6 Cart Page (`src/pages/Cart.tsx`)**
- Route: `/cart`
- Cart items from Zustand store
- Quantity update, remove item
- Referral code input with validation (check `users.referral_code` in Supabase)
- Order summary: subtotal, discount, delivery (not yet — selected at checkout), total
- "Proceed to Checkout" button

**3.7 Checkout Page (`src/pages/Checkout.tsx`)**
- Route: `/checkout` (auth required)
- Step 1: Delivery address (name, phone, address, city dropdown from `city_delivery_rates` — auto-show charge)
- Step 2: Payment method (radio buttons: COD / JazzCash / EasyPaisa / Bank)
  - JazzCash/EasyPaisa: show admin number from `site_settings`, input for transaction ID
  - Bank: show bank details from `site_settings`, input for reference number
- Step 3: Review + Place Order
- On submit: insert to `orders` + `order_items` tables
- Redirect to `/order/:id`

**3.8 Order Confirmation (`src/pages/OrderConfirmation.tsx`)**
- Route: `/order/:id`
- Fetch order details, show summary
- Status badge, order number
- "Track Order" button link

**3.9 Track Order (`src/pages/TrackOrder.tsx`)**
- Route: `/track`
- Input: order number + phone
- Query orders table
- Show `OrderStatusTimeline` component

**3.10 About & Contact pages**
- Simple static pages with dark premium layout

**3.11 AI Chat Widget (`src/components/ai/ChatWidget.tsx`)**
- Floating button (bottom-right) on ALL pages
- Chat drawer (360x480px)
- Sends to `POST /api/ai/chat` with message + history[]
- Shows loading dots while waiting for AI response
- Error fallback: "Chat is temporarily unavailable"
- Supports Urdu input (RTL text detection)

---

### Phase 4 — Auth Pages

**4.1 Login Page (`src/pages/auth/Login.tsx`)**
- Email + password form
- `supabase.auth.signInWithPassword()`
- Post-login role check → redirect to appropriate dashboard
- "Forgot password" link (placeholder)
- Link to signup

**4.2 Signup Page (`src/pages/auth/Signup.tsx`)**
- Tab or toggle: "Customer" / "Join as Agent"
- Customer signup: name, email, phone, password
- Agent signup: name, email, phone, password, (optional: note about why joining)
- On agent signup: role = 'agent', is_approved = false → show pending message

---

### Phase 5 — Customer Account Pages

All under `/account/*`, require auth, role = customer or agent:

- `Dashboard.tsx` — welcome, recent orders, quick links
- `Orders.tsx` — order list with status filter
- `OrderDetail.tsx` — full order + timeline
- `Profile.tsx` — edit profile form
- `Addresses.tsx` — saved addresses CRUD
- `Wishlist.tsx` — wishlist products grid

---

### Phase 6 — Agent Dashboard Pages

All under `/team/*`, require auth, role = agent, is_approved = true:

- `TeamDashboard.tsx` — stats cards, referral code box with copy + WhatsApp share
- `MyReferrals.tsx` — table of referred orders
- `Commission.tsx` — commission breakdown table
- `Withdrawal.tsx` — balance summary + withdrawal request form + history
- `TeamProfile.tsx` — edit profile + payment account details

---

### Phase 7 — Admin Panel Pages

All under `/admin/*`, require auth, role = admin:

**7.1 Dashboard (`AdminDashboard.tsx`)**
- Stats cards (4 main stats)
- Recent orders table
- Top agents + top products

**7.2 Products (`admin/Products.tsx` + `admin/ProductForm.tsx`)**
- Table with search + category filter
- Add/Edit form with image upload to Supabase Storage
- Delete with confirmation

**7.3 Categories (`admin/Categories.tsx`)**
- Reorderable list (drag or up/down arrows)
- Add/Edit/Delete categories with EN + UR names

**7.4 Orders (`admin/Orders.tsx` + `admin/OrderDetail.tsx`)**
- Full orders table with filters
- Order detail with status update dropdown
- Payment verification notes

**7.5 Discounts (`admin/Discounts.tsx`)**
- Two tabs: product discounts + category discounts
- Inline editing of discount % per row

**7.6 Team Members (`admin/TeamMembers.tsx`)**
- Three tabs: Pending / Active / Blocked
- Approve / Reject / Block / Unblock actions

**7.7 Commissions (`admin/Commissions.tsx`)**
- List filtered by status
- Inline commission amount input for pending
- Approve / Mark as Paid actions

**7.8 Withdrawals (`admin/Withdrawals.tsx`)**
- List of withdrawal requests
- View account details
- Mark as Paid

**7.9 Delivery Rates (`admin/DeliveryRates.tsx`)**
- Table: city name + charge
- Add / Edit (inline) / Delete

**7.10 Banners (`admin/Banners.tsx`)**
- Image upload to Supabase `banners` bucket
- Reorder, activate/deactivate, delete

**7.11 Site Settings (`admin/SiteSettings.tsx`)**
- Form: JazzCash, EasyPaisa, Bank details, Contact, Social links
- Save to `site_settings` table

**7.12 Reports (`admin/Reports.tsx`)**
- Three tabs: Sales, Agent Leaderboard, Top Products
- Date range filter
- Simple data tables (charts optional with recharts)

---

### Phase 8 — Cloudflare Pages Functions (AI Backend)

Create the `functions/` folder at project root:

**8.1 `functions/_lib/cors.ts`**
```typescript
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  })
}
```

**8.2 `functions/api/ai/search.ts`** — Smart Search
- Accepts: `{ query: string, language: "en" | "ur" }`
- Uses `@cf/baai/bge-m3` for multilingual embeddings
- Uses `@cf/meta/llama-3.1-8b-instruct` to extract keywords
- Returns: `{ query, keywords, language }`
- Error fallback: return `{ error, keywords: [] }`

**8.3 `functions/api/ai/recommendations.ts`** — Product Recommendations
- Accepts: `{ product_id: string, category: string, tags: string[] }`
- Uses `@cf/meta/llama-3.1-8b-instruct` with structured prompt
- Returns: `{ product_id, category, recommendations: [{attribute, reason}] }`
- Returns JSON only — no extra text

**8.4 `functions/api/ai/chat.ts`** — Customer Support Chatbot
- Accepts: `{ message: string, history: Array<{role, content}> }`
- System prompt: RTS Apparel customer support (Urdu + English, store policies)
- Uses `@cf/meta/llama-3.1-8b-instruct`
- Returns: `{ reply: string }`
- Store policies in system prompt: 3-5 day delivery, 7-day returns, free size exchange, COD + card

---

### Phase 9 — Polish & QA

**9.1 Error boundaries**
- Wrap all page-level components
- Show user-friendly error UI

**9.2 Loading states**
- Skeleton loaders on all data-fetching components
- Spinner on all form submit buttons

**9.3 Empty states**
- "No products found" with illustration + browse button
- "No orders yet" with shop button
- "No referrals yet" with share button

**9.4 Responsive check**
- Mobile: 2-column product grid, bottom cart drawer, hamburger menu
- Tablet: 3-column grid
- Desktop: 4-column grid, full nav

**9.5 SPA routing fix**
- Ensure `public/_redirects` contains `/* /index.html 200`
- Test refresh on `/category/shirts`, `/product/abc`, `/admin/orders`

**9.6 Environment variable usage**
- Zero hardcoded URLs or keys anywhere in code
- All `VITE_` vars used via `import.meta.env.VITE_*`

**9.7 Build verification**
- `npm run build` must complete with zero errors
- `dist/` folder generated with `index.html` + assets

---

## File Checklist (What Must Exist in Final Output)

```
rts-apparel/
├── src/
│   ├── components/ (all listed above)
│   ├── pages/ (all listed above — ~35 pages)
│   ├── lib/supabase.ts
│   ├── lib/ai.ts
│   ├── lib/utils.ts
│   ├── types/index.ts
│   ├── store/authStore.ts
│   ├── store/cartStore.ts
│   ├── App.tsx (all routes defined)
│   └── main.tsx
├── functions/
│   ├── _lib/cors.ts
│   └── api/ai/
│       ├── search.ts
│       ├── recommendations.ts
│       └── chat.ts
├── public/
│   └── _redirects
├── wrangler.toml
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .npmrc
├── .gitignore
└── .env.example
```

---

## Critical Rules for AI Studio

1. **Dark theme only** — `background: #0A0A0A`, all components dark
2. **Gold accent** — `#C9A84C` for all CTAs, active states, prices
3. **Table/column names** must exactly match `05_Backend_Schema.md` — zero deviation
4. **Env vars** — only `import.meta.env.VITE_*`, never hardcoded
5. **Pages Functions** — `functions/` folder at root, NOT inside `src/`
6. **TypeScript** — strict types, no `any` types
7. **`_redirects`** in `public/` — required for Cloudflare SPA routing
8. **`.npmrc`** at root — required for Cloudflare build
9. **AI error handling** — ALL `/api/ai/*` calls must have try/catch with graceful fallback
10. **Bilingual** — product names, category names support both English and Urdu display
