# 01 — Product Requirements Document (PRD)
# RTS Apparel — Premium Men's Fashion E-Commerce

---

## 1. Project Purpose & Vision

RTS Apparel ek premium online men's wear store hai jo Pakistan mein operate karega. Black & Gold dark luxury theme ke saath ek high-end shopping experience dena maqsad hai.

**Core Vision:** Ek complete multi-role e-commerce ecosystem jisme:
- Customers browse aur shop kar sakein
- Agents referral codes se commission kamayein
- Admin poori website ek jagah se manage kare

---

## 2. Target Users

| User Type | Description |
|---|---|
| Customer | Pakistani men jo online men's fashion khareedte hain |
| Agent (Team Member) | Referral agents jo apne code se sales karwaate hain aur commission lete hain |
| Admin | Website owner — full control over products, orders, team, settings |

---

## 3. User Roles & Permissions

| Role | Access Level |
|---|---|
| `guest` | Browse products, search, view categories — no login required |
| `customer` | Guest + cart, checkout, order history, profile, wishlist |
| `agent` | Customer + referral dashboard, commission tracking, withdrawal requests |
| `admin` | Full access — all portals, settings, team management, reports |

**Role Rules:**
- Agent signup requires admin approval before login is granted
- Admin can approve, block, or unblock any agent at any time
- A customer can also be an agent (same account, additional agent tab)
- Admin account is seeded at setup — no public admin signup

---

## 4. Portal Structure

| Portal | URL Path | Who Uses It |
|---|---|---|
| Customer Store | `/` | Guests & Customers |
| Customer Account | `/account/*` | Logged-in Customers |
| Agent Dashboard | `/team/*` | Approved Agents |
| Admin Panel | `/admin/*` | Admin only |

---

## 5. Feature List

### 5.1 Customer Store (Public)

- **Home Page:** Hero banner (admin-managed), categories grid, featured products, new arrivals, sale/discount section, footer
- **Category Pages:** Dynamic — Shirts, Trousers, Kurta Shalwar, Hoodies, Jackets + any new category admin adds
- **Product Detail Page:** Image gallery, size selector, color selector, price + discounted price (strikethrough), discount badge, Add to Cart
- **Search:** Full-text product search (AI-powered smart search via Cloudflare Workers AI)
- **Cart:** Item list, quantity update, remove item, referral/agent code input box, order summary
- **Checkout:** Delivery address form, city selector (auto-loads delivery charge), payment method selector (COD / JazzCash / EasyPaisa / Bank Transfer), order confirmation
- **Order Tracking:** `/track` — enter order ID to see live status
- **AI Customer Support Chatbot:** Floating chat widget — powered by Cloudflare Workers AI (Llama 3.1 8B), supports Urdu + English
- **AI Product Recommendations:** "You may also like" section on product detail page
- **About Page & Contact Page**

### 5.2 Customer Account Dashboard (`/account`)

- Order history with status timeline
- Order detail view
- Saved addresses (add/edit/delete multiple)
- Profile update (name, phone, email)
- Wishlist
- If also an agent: link to agent dashboard

### 5.3 Agent Dashboard (`/team`)

- Unique referral code display + copy button + WhatsApp share
- Today's stats: referral sales count, pending commission
- Lifetime stats: total commission earned, total customers referred
- My Referrals list: who used my code + their order details
- Commission breakdown: pending / approved / paid
- Withdrawal request form (with JazzCash/bank account details)
- Profile & payment account settings

**Agent Signup Flow:**
1. Agent fills signup form
2. Status = `pending_approval`
3. Admin approves → agent gets login access + unique referral code assigned
4. Admin rejects → account stays locked

### 5.4 Admin Panel (`/admin`)

- **Dashboard:** Live stats — today's revenue, pending orders, pending agent approvals, pending withdrawal requests, top products, top agents
- **Products:** Add / edit / delete products; upload multiple images; set sizes, colors, stock; set per-product discount %
- **Categories:** Add / rename / reorder / delete categories dynamically
- **Orders:** All orders list; filter by status / city / date / payment method; update order status; view order detail
- **Discounts:** Set discount % per product or per category; optional start/end date
- **Team Members:** View all agents; approve / reject pending; block / unblock; view agent's referral history; manually set commission amount per order; mark commission as paid
- **Commission Manager:** All commissions list; filter by status (pending/approved/paid); set amount; mark paid
- **Withdrawal Requests:** View agent withdrawal requests; approve / mark as paid
- **City Delivery Rates:** Add / edit / delete city names and their delivery charges (PKR)
- **Banners:** Upload / reorder / activate / deactivate homepage banners
- **Site Settings:** Update JazzCash number, EasyPaisa number, bank details (name, title, IBAN), contact info, social media links
- **Reports:** Sales report (daily/monthly), agent leaderboard, top products

---

## 6. Business Rules

1. **Referral Code at Checkout:** Customer enters agent's code → order links to that agent → commission entry created with status `pending`
2. **Commission:** Admin manually sets commission amount per order → agent sees it in dashboard → agent requests withdrawal → admin pays and marks as paid
3. **Discount:** Admin sets % discount per product or category → auto-applied at checkout with strikethrough original price and discount badge
4. **Delivery Charge:** Auto-calculated at checkout based on selected city from admin-managed rate table
5. **Payment Verification:** JazzCash/EasyPaisa/Bank Transfer orders require customer to enter transaction ID → admin manually verifies → order confirmed
6. **COD:** No upfront payment — order placed directly, admin confirms on delivery
7. **Agent Blocking:** Blocked agent cannot log in; pending commissions are held
8. **Order Cancellation:** If order is cancelled, linked commission entry is also cancelled

---

## 7. Payment Methods

| Method | Flow |
|---|---|
| Cash on Delivery (COD) | Order placed → admin confirms on delivery |
| JazzCash | Customer pays to admin's JazzCash number → enters transaction ID → admin verifies |
| EasyPaisa | Same as JazzCash |
| Bank Transfer | Customer transfers to admin's bank account → enters reference → admin verifies |

Payment account details (numbers, IBAN) are managed by admin in Site Settings.

---

## 8. AI Features (Cloudflare Workers AI — Free Plan)

| Feature | Model | Endpoint |
|---|---|---|
| Smart Search | `@cf/baai/bge-m3` (multilingual embeddings) + `@cf/meta/llama-3.1-8b-instruct` | `POST /api/ai/search` |
| Product Recommendations | `@cf/meta/llama-3.1-8b-instruct` | `POST /api/ai/recommendations` |
| Customer Support Chatbot | `@cf/meta/llama-3.1-8b-instruct` | `POST /api/ai/chat` |

- All AI endpoints are Cloudflare Pages Functions (same domain, no CORS needed)
- Supports Urdu + English
- Free plan: 10,000 Neurons/day limit

---

## 9. Language Support

- **Bilingual:** English + Urdu
- UI labels, product names, category names: both languages
- AI chatbot: detects and responds in user's language (Urdu or English)
- RTL support for Urdu text where needed

---

## 10. Non-Functional Requirements

- Fully responsive: Mobile + Tablet + Desktop
- Dark premium theme: Black background, Gold accents
- Page load < 3 seconds on mobile
- Supabase Row Level Security (RLS) on all tables
- No secrets in frontend code or GitHub repo
- SPA routing with `_redirects` file for Cloudflare Pages (no 404 on refresh)
- Image storage via Supabase Storage buckets

---

## 11. Scope & Exclusions

**In Scope:**
- All 4 portals (Customer Store, Account, Agent, Admin)
- 3 AI features via Cloudflare Workers AI
- Referral + commission system
- Dynamic category management
- City-based delivery charges
- Multi-method payment (manual verification)

**Out of Scope (Phase 2):**
- Stripe / international payment gateway
- SMS OTP login
- Mobile app
- Multi-language admin panel (admin panel English only)
- Email notifications (can be added later via Supabase Edge Functions)
