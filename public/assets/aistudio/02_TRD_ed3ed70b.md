# 02 — Technical Requirements Document (TRD)
# RTS Apparel — Premium Men's Fashion E-Commerce

---

## 1. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18 + TypeScript (Vite) | SPA, file-based routing via React Router v6 |
| Styling | Tailwind CSS v3 + shadcn/ui | Dark theme, custom gold accent tokens |
| State Management | Zustand | Cart, auth state, UI state |
| Backend / Database | Supabase (PostgreSQL) | Auth, DB, Storage, Realtime |
| Auth | Supabase Auth | Email+Password; role stored in `users` table |
| File Storage | Supabase Storage | Product images, banners |
| AI Services | Cloudflare Workers AI (Free Plan) | Via Pages Functions — same domain |
| AI Endpoints | Cloudflare Pages Functions (`functions/` folder) | Auto-deployed with GitHub push |
| Source Control | GitHub | AI Studio → Export to GitHub |
| Deployment | Cloudflare Pages (Workers & Pages) | GitHub import, auto-deploy on push |
| Package Manager | npm | Delete `bun.lock`/`bun.lockb` if present |

---

## 2. Architecture Overview

```
Browser (React + TypeScript + Vite)
    │
    ├── /api/ai/* ──────────────────► Cloudflare Pages Functions
    │                                  (functions/api/ai/*.ts)
    │                                  └── Workers AI (Llama 3.1 8B, BGE-M3)
    │
    └── Supabase Client (env vars) ──► Supabase (PostgreSQL + Auth + Storage)
                                        ├── Auth (email/password)
                                        ├── Database (10 tables, RLS)
                                        └── Storage (product-images, banners)
```

**Key architectural decisions:**
- Pages Functions used (not standalone Worker) — same repo, auto-deploys, no CORS issues (same origin)
- Supabase client initialized once in `src/lib/supabase.ts` using env vars
- Admin role enforced via RLS + frontend route guard (check `users.role = 'admin'`)
- Agent approval enforced via `users.is_approved` flag checked at login

---

## 3. Frontend Folder Structure

```
rts-apparel/
├── src/
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductImageGallery.tsx
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx
│   │   ├── ai/
│   │   │   └── ChatWidget.tsx       # floating AI chatbot
│   │   └── common/
│   │       ├── DiscountBadge.tsx
│   │       └── OrderStatusTimeline.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Category.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── TrackOrder.tsx
│   │   ├── Search.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── account/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Addresses.tsx
│   │   │   └── Wishlist.tsx
│   │   ├── team/
│   │   │   ├── TeamDashboard.tsx
│   │   │   ├── MyReferrals.tsx
│   │   │   ├── Commission.tsx
│   │   │   ├── Withdrawal.tsx
│   │   │   └── TeamProfile.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── Products.tsx
│   │       ├── ProductForm.tsx
│   │       ├── Categories.tsx
│   │       ├── Orders.tsx
│   │       ├── OrderDetail.tsx
│   │       ├── Discounts.tsx
│   │       ├── TeamMembers.tsx
│   │       ├── Commissions.tsx
│   │       ├── Withdrawals.tsx
│   │       ├── DeliveryRates.tsx
│   │       ├── Banners.tsx
│   │       ├── SiteSettings.tsx
│   │       └── Reports.tsx
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client (env vars)
│   │   ├── ai.ts                    # fetch helpers for /api/ai/*
│   │   └── utils.ts
│   ├── store/
│   │   ├── cartStore.ts             # Zustand cart
│   │   └── authStore.ts             # Zustand auth/user
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useProducts.ts
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── App.tsx                      # Routes
│   └── main.tsx
├── functions/                       # Cloudflare Pages Functions (AI backend)
│   ├── _lib/
│   │   └── cors.ts                  # shared CORS + json() helper
│   └── api/
│       └── ai/
│           ├── search.ts            # POST /api/ai/search
│           ├── recommendations.ts   # POST /api/ai/recommendations
│           └── chat.ts              # POST /api/ai/chat
├── public/
│   └── _redirects                   # SPA fallback for Cloudflare Pages
├── dist/                            # Vite build output (gitignored)
├── wrangler.toml                    # AI binding + Pages config
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .npmrc                           # legacy-peer-deps=true
└── .gitignore
```

---

## 4. Routing (React Router v6)

| Path | Component | Auth Required | Role |
|---|---|---|---|
| `/` | Home | No | — |
| `/category/:slug` | Category | No | — |
| `/product/:id` | ProductDetail | No | — |
| `/search` | Search | No | — |
| `/cart` | Cart | No | — |
| `/checkout` | Checkout | Yes | customer |
| `/order/:id` | OrderConfirmation | Yes | customer |
| `/track` | TrackOrder | No | — |
| `/about` | About | No | — |
| `/contact` | Contact | No | — |
| `/login` | Login | No | — |
| `/signup` | Signup | No | — |
| `/account` | Account Dashboard | Yes | customer |
| `/account/orders` | Orders | Yes | customer |
| `/account/orders/:id` | OrderDetail | Yes | customer |
| `/account/profile` | Profile | Yes | customer |
| `/account/addresses` | Addresses | Yes | customer |
| `/account/wishlist` | Wishlist | Yes | customer |
| `/team` | Team Dashboard | Yes | agent (approved) |
| `/team/referrals` | MyReferrals | Yes | agent |
| `/team/commission` | Commission | Yes | agent |
| `/team/withdrawal` | Withdrawal | Yes | agent |
| `/team/profile` | TeamProfile | Yes | agent |
| `/admin` | Admin Dashboard | Yes | admin |
| `/admin/products` | Products | Yes | admin |
| `/admin/products/new` | ProductForm | Yes | admin |
| `/admin/products/:id/edit` | ProductForm | Yes | admin |
| `/admin/categories` | Categories | Yes | admin |
| `/admin/orders` | Orders | Yes | admin |
| `/admin/orders/:id` | OrderDetail | Yes | admin |
| `/admin/discounts` | Discounts | Yes | admin |
| `/admin/team` | TeamMembers | Yes | admin |
| `/admin/commissions` | Commissions | Yes | admin |
| `/admin/withdrawals` | Withdrawals | Yes | admin |
| `/admin/delivery` | DeliveryRates | Yes | admin |
| `/admin/banners` | Banners | Yes | admin |
| `/admin/settings` | SiteSettings | Yes | admin |
| `/admin/reports` | Reports | Yes | admin |

---

## 5. Supabase Integration Strategy

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- Auth: `supabase.auth.signInWithPassword()`, `signUp()`, `signOut()`, `onAuthStateChange()`
- After signup, insert row into `public.users` table with role = `'customer'`
- Agent role upgrade: admin updates `users.role = 'agent'` + `is_approved = true`
- All DB queries via Supabase JS client — never direct SQL in frontend
- Storage: `supabase.storage.from('product-images').upload()`

---

## 6. Cloudflare Pages Functions — AI Backend

### wrangler.toml
```toml
name = "rts-apparel"
compatibility_date = "2026-10-29"
compatibility_flags = ["nodejs_compat"]

[ai]
binding = "AI"

pages_build_output_dir = "dist"

[observability]
enabled = true

[vars]
SUPABASE_URL = "https://your-project.supabase.co"
```

### AI Models Used
| Feature | Model | Notes |
|---|---|---|
| Chatbot | `@cf/meta/llama-3.1-8b-instruct` | Urdu + English |
| Smart Search | `@cf/baai/bge-m3` + Llama 3.1 8B | Multilingual embeddings |
| Recommendations | `@cf/meta/llama-3.1-8b-instruct` | Prompt-based |

### API Endpoints (Pages Functions)
| Endpoint | File | Method |
|---|---|---|
| `/api/ai/search` | `functions/api/ai/search.ts` | POST |
| `/api/ai/recommendations` | `functions/api/ai/recommendations.ts` | POST |
| `/api/ai/chat` | `functions/api/ai/chat.ts` | POST |

No CORS headers needed — same origin (Pages Functions live on same domain as frontend).

---

## 7. Auth Approach

1. User signs up with email + password via Supabase Auth
2. On signup success: insert row in `public.users` (id = auth.uid, role = 'customer')
3. Agent signup: same flow but role = 'agent', `is_approved = false`
4. Admin checks pending agents in admin panel → sets `is_approved = true`
5. Login: `supabase.auth.signInWithPassword()` → check `users.role` + `is_approved`
6. If agent and `is_approved = false` → show "Pending approval" message, block dashboard access
7. Route guards: `<ProtectedRoute role="admin">` wraps all `/admin/*` routes
8. Session persisted via Supabase localStorage session

---

## 8. Storage Strategy

| Bucket | Content | Access |
|---|---|---|
| `product-images` | Product photos | Public read, authenticated write |
| `banners` | Homepage banner images | Public read, admin write only |
| `avatars` | User profile pictures (optional) | Owner read/write |

---

## 9. Security Requirements

- RLS enabled on ALL Supabase tables (see Backend Schema)
- Service role key: NEVER in frontend code or GitHub repo — only used in Supabase Edge Functions (if needed)
- Anon key in frontend: `VITE_SUPABASE_ANON_KEY` — acceptable (read-only operations protected by RLS)
- Admin role: verified server-side via RLS policy (`auth.jwt() ->> 'role' = 'admin'` or check `public.users` table)
- Agent approval check: RLS policy on `agent_dashboards` view checks `is_approved = true`
- No hardcoded secrets in any file
- All env vars in Cloudflare Pages dashboard (encrypted for secrets)

---

## 10. Environment Variables — Complete List

### Frontend (.env / Cloudflare Pages Dashboard)
| Variable | Description | Encrypted? |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | No |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/publishable key | No |
| `VITE_AI_API_BASE` | Leave empty (Pages Functions = same origin) | No |

### Cloudflare Pages Dashboard Only
| Variable | Description | Encrypted? |
|---|---|---|
| `NODE_VERSION` | `20` | No |
| `SUPABASE_URL` | Supabase URL (for Pages Functions) | No |
| `SUPABASE_KEY` | Supabase anon key (for Pages Functions) | Yes |

### Local Dev Only (.env — gitignored)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_AI_API_BASE=
```

---

## 11. Cloudflare Deployment Requirements

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Root Directory | `/` |
| Node Version | Set `NODE_VERSION=20` as env var |

**SPA Fallback (`public/_redirects`):**
```
/* /index.html 200
```

**Build Fail Prevention Checklist:**
- Delete `bun.lock` / `bun.lockb` — keep only `package-lock.json`
- Create `.npmrc` at root: `legacy-peer-deps=true`
- `NODE_VERSION=20` set in Pages dashboard
- AI binding `[ai]` in `wrangler.toml` — add via dashboard too (Settings → Bindings → Workers AI → name: `AI`)
- Redeploy after adding AI binding

---

## 12. Local Development

```bash
# Frontend (Vite dev server on :5173)
npm run dev

# Pages Functions + AI binding local test (on :8788)
npx wrangler pages dev --compatibility-date=2026-10-29 --ai AI
```

Test AI endpoints:
```bash
curl -X POST http://localhost:8788/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, where is my order?","history":[]}'
```
