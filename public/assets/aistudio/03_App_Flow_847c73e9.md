# 03 — App Flow: User & Admin Experience
# RTS Apparel — Premium Men's Fashion E-Commerce

---

## 1. Guest / Customer Flow

### 1.1 Browse & Shop Flow
```
Home Page
  ├── Click Category (Shirts / Trousers / Kurta Shalwar / Hoodies / Jackets / more)
  │     └── Category Page (grid of products, filter by size/color/price, sort)
  │           └── Click Product → Product Detail Page
  │                 ├── View images, select size + color
  │                 ├── See original price + discounted price (strikethrough)
  │                 ├── See "You May Also Like" (AI recommendations)
  │                 └── Click "Add to Cart" → Cart Drawer opens (or go to /cart)
  │
  ├── Search Bar (header) → Search Page
  │     └── AI Smart Search → results grid → Product Detail
  │
  └── Hero Banner Click → Category or Product page
```

### 1.2 Checkout Flow
```
Cart Page
  ├── Review items, update quantities, remove items
  ├── Enter Agent Referral Code (optional) → validates code
  └── Click "Proceed to Checkout"
        └── Checkout Page
              ├── Step 1: Delivery Address
              │     ├── Enter full name, phone, address
              │     ├── Select City → delivery charge auto-loads
              │     └── Save address (if logged in)
              ├── Step 2: Payment Method
              │     ├── COD → direct place order
              │     ├── JazzCash → show admin JazzCash number → customer pays → enter transaction ID
              │     ├── EasyPaisa → same as JazzCash
              │     └── Bank Transfer → show bank details → customer transfers → enter reference
              └── Step 3: Review & Place Order
                    ├── Show order summary, total, delivery charge, discount
                    └── Click "Place Order"
                          ├── Success → Order Confirmation Page (/order/:id)
                          │     └── Show order ID, summary, status: Pending
                          └── Error → Show error message, stay on checkout
```

### 1.3 Order Tracking Flow
```
/track
  └── Enter Order ID + Phone Number
        ├── Found → Show status timeline:
        │     1. ✅ Order Placed
        │     2. ✅ Order Confirmed
        │     3. 📦 Packed
        │     4. 🚚 Shipped
        │     5. 🏠 Delivered
        └── Not Found → "Order not found. Check your order ID."
```

### 1.4 AI Chatbot Flow
```
Floating Chat Button (bottom-right, all pages)
  └── Click → Chat Widget opens
        ├── User types in English or Urdu
        ├── POST /api/ai/chat → Llama 3.1 8B responds
        ├── Conversation history maintained in component state
        └── Topics: orders, delivery, returns, sizes, products
              └── Unknown → "Please contact us on WhatsApp: [number]"
```

---

## 2. Auth Flow

### 2.1 Customer Signup / Login
```
/signup
  ├── Enter name, email, phone, password
  ├── Supabase Auth signUp()
  ├── Insert row in public.users (role = 'customer')
  └── Redirect to /account

/login
  ├── Enter email + password
  ├── Supabase Auth signInWithPassword()
  ├── Fetch users row → check role
  │     ├── role = 'customer' → redirect to /account
  │     ├── role = 'agent' + is_approved = true → redirect to /team
  │     ├── role = 'agent' + is_approved = false → show "Pending Approval" message
  │     └── role = 'admin' → redirect to /admin
  └── Error → show inline error message
```

### 2.2 Agent Signup
```
/signup (Agent tab or separate form)
  ├── Enter name, email, phone, password, reason for joining (optional)
  ├── Supabase Auth signUp()
  ├── Insert row in public.users (role = 'agent', is_approved = false)
  └── Show: "Your agent account is under review. Admin will approve shortly."

After Admin Approves:
  ├── users.is_approved = true
  ├── users.referral_code = auto-generated (RTS-[NAME][3 digits])
  └── Agent can now login and access /team dashboard
```

---

## 3. Customer Account Flow (`/account`)

```
/account (Dashboard)
  ├── Recent orders (last 3)
  ├── Quick links: Orders, Profile, Addresses, Wishlist
  └── If also agent → "Go to Agent Dashboard" button

/account/orders
  ├── All orders list (newest first)
  ├── Filter by status
  └── Click order → /account/orders/:id
        └── Full order detail + status timeline + items

/account/profile
  ├── Edit name, phone, email
  └── Save → update users table

/account/addresses
  ├── List of saved addresses
  ├── Add new address
  ├── Edit / delete existing
  └── Set as default

/account/wishlist
  ├── Saved products grid
  ├── Remove from wishlist
  └── Click → Product Detail Page
```

---

## 4. Agent Dashboard Flow (`/team`)

```
/team (Dashboard)
  ├── Stats cards: Today's sales, This month's commission, Total earned, Total referrals
  ├── Referral code box: code + Copy button + WhatsApp share link
  │     (WhatsApp link: wa.me/?text=Use my code [CODE] on RTS Apparel: [site URL])
  └── Recent referral activity

/team/referrals
  ├── List: Customer name, Order ID, Order amount, Date, Commission status
  └── Click → order detail (read-only)

/team/commission
  ├── Summary: Total earned, Total pending, Total paid
  ├── Table: Order ID, Amount, Commission, Status (pending/approved/paid)
  └── Filter by status

/team/withdrawal
  ├── Current balance (approved commissions not yet paid)
  ├── Withdrawal request form:
  │     ├── Amount
  │     ├── Payment method (JazzCash / EasyPaisa / Bank)
  │     └── Account details (number / IBAN)
  ├── Submit → creates withdrawal_requests row (status = pending)
  └── Past withdrawal requests list

/team/profile
  ├── Edit name, phone
  ├── Update payment account details
  └── Save
```

---

## 5. Admin Panel Flow (`/admin`)

### 5.1 Dashboard
```
/admin
  ├── Stats cards: Today's revenue, Pending orders, Pending agent approvals,
  │                Pending withdrawals, Total products, Total agents
  ├── Recent orders table (last 10)
  ├── Top agents by commission (this month)
  └── Top products by sales
```

### 5.2 Products
```
/admin/products
  ├── Products table: image, name, category, price, discount%, stock, status
  ├── Filter by category, status
  ├── Click "Add Product" → /admin/products/new
  └── Click Edit → /admin/products/:id/edit

/admin/products/new OR /admin/products/:id/edit
  ├── Form fields:
  │     ├── Product name (English + Urdu)
  │     ├── Category (dropdown)
  │     ├── Price (PKR)
  │     ├── Discount % (optional, overrides category discount)
  │     ├── Sizes (multi-select: XS, S, M, L, XL, XXL)
  │     ├── Colors (add multiple)
  │     ├── Stock quantity
  │     ├── Images (upload multiple → Supabase Storage)
  │     └── Active/Inactive toggle
  └── Save → redirect to /admin/products
```

### 5.3 Categories
```
/admin/categories
  ├── List: name (EN + UR), slug, order, product count
  ├── Drag to reorder (or up/down buttons)
  ├── Add new category: name EN, name UR, auto-generate slug
  ├── Edit name
  └── Delete (only if no products in category)
```

### 5.4 Orders
```
/admin/orders
  ├── Orders table: order ID, customer, city, total, payment method, status, date
  ├── Filters: status, city, date range, payment method
  ├── Search by order ID or customer name/phone
  └── Click order → /admin/orders/:id
        ├── Full order detail: items, amounts, delivery, customer info, referral code
        ├── Update status (dropdown): pending → confirmed → packed → shipped → delivered → cancelled
        ├── Payment verification note (for JazzCash/Bank: transaction ID shown)
        └── View linked agent (if referral code used)
```

### 5.5 Discounts
```
/admin/discounts
  ├── Tab 1: Product Discounts
  │     ├── List products with current discount %
  │     ├── Inline edit discount % (0 = no discount)
  │     └── Optional: start date, end date
  └── Tab 2: Category Discounts
        ├── Set discount % for entire category
        ├── Applies to all products in category (product-level overrides this)
        └── Optional: start/end date
```

### 5.6 Team Members
```
/admin/team
  ├── Tabs: Pending Approval | Active | Blocked
  ├── Pending tab:
  │     ├── List of pending agent signups
  │     └── Approve button (sets is_approved=true, generates referral_code)
  │           OR Reject button (deletes account or sets status=rejected)
  ├── Active tab:
  │     ├── List: name, code, total referrals, total commission earned, status
  │     ├── Click agent → view full profile + referral history
  │     └── Block button → sets is_blocked=true
  └── Blocked tab:
        ├── List of blocked agents
        └── Unblock button
```

### 5.7 Commissions
```
/admin/commissions
  ├── List: Agent name, Order ID, Order amount, Commission amount, Status
  ├── Filter: pending / approved / paid
  ├── For pending commissions:
  │     ├── Click to set commission amount (input field)
  │     └── Click Approve → status = approved
  └── For approved:
        └── Click Mark as Paid → status = paid, paid_at = now()
```

### 5.8 Withdrawal Requests
```
/admin/withdrawals
  ├── List: Agent name, Amount requested, Payment account, Date, Status
  ├── View account details (JazzCash/EasyPaisa number or bank IBAN)
  └── Click "Mark as Paid" → status = paid
```

### 5.9 City Delivery Rates
```
/admin/delivery
  ├── Table: City name, Charge (PKR)
  ├── Add new city + charge
  ├── Edit charge for existing city (inline)
  └── Delete city
```

### 5.10 Banners
```
/admin/banners
  ├── List: image preview, link URL, active/inactive, order
  ├── Upload new banner → Supabase Storage (banners bucket)
  ├── Set link URL (optional)
  ├── Toggle active/inactive
  ├── Drag to reorder (or order number)
  └── Delete banner
```

### 5.11 Site Settings
```
/admin/settings
  ├── Section: Payment Details
  │     ├── JazzCash account number
  │     ├── EasyPaisa account number
  │     └── Bank: Account name, Account title, IBAN, Bank name
  ├── Section: Contact Info
  │     ├── WhatsApp number
  │     ├── Email address
  │     └── Physical address (optional)
  └── Section: Social Media
        ├── Instagram URL
        ├── Facebook URL
        └── TikTok URL
  └── Save → update site_settings table
```

### 5.12 Reports
```
/admin/reports
  ├── Tab 1: Sales Report
  │     ├── Date range selector
  │     ├── Total revenue, total orders, average order value
  │     └── Daily/monthly bar chart
  ├── Tab 2: Agent Leaderboard
  │     ├── Ranked by total sales referred
  │     ├── Columns: Agent, Total referrals, Total sales, Commission paid
  │     └── Date range filter
  └── Tab 3: Top Products
        ├── Most sold products
        └── Date range filter
```

---

## 6. States to Handle

| State | How to Handle |
|---|---|
| Loading | Skeleton loaders on product grids, spinner on buttons |
| Empty | Empty state illustration + message (e.g. "No products found") |
| Error | Inline error message, retry button where applicable |
| No auth (protected route) | Redirect to /login with `returnUrl` param |
| Agent not approved | Show "Pending approval" banner, disable dashboard |
| Admin blocked agent | Agent sees "Account suspended" on login |
| Out of stock | Disable "Add to Cart", show "Out of Stock" badge |
| AI service down (error 3036/3040) | Show graceful fallback: "Search is temporarily unavailable. Please browse categories." |
| Payment verification pending | Order status = "Awaiting payment verification" |
| Commission pending | Show pending badge, no withdrawal available |

---

## 7. Navigation Structure

### Public Navbar
- Logo (home link)
- Categories dropdown
- Search bar (AI-powered)
- Wishlist icon (if logged in)
- Cart icon + item count
- Login / Account dropdown

### Account Sidebar (`/account`)
- Dashboard, Orders, Addresses, Profile, Wishlist
- "Agent Dashboard" link (if agent)
- Logout

### Agent Sidebar (`/team`)
- Dashboard, My Referrals, Commission, Withdrawal, Profile
- "My Account" link
- Logout

### Admin Sidebar (`/admin`)
- Dashboard
- Products, Categories
- Orders
- Discounts
- Team Members, Commissions, Withdrawals
- Delivery Rates
- Banners, Site Settings
- Reports
- Logout
