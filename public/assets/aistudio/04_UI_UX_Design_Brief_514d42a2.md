# 04 — UI/UX Design Brief
# RTS Apparel — Premium Men's Fashion E-Commerce

---

## 1. Design Direction

**Style:** Dark Premium Luxury
**Tagline feel:** "Where Pakistani men dress sharp."
**Mood:** High-end fashion retail — like a premium menswear boutique, dark-lit, gold-accented, confident.

**Inspiration references (aesthetic only):**
- Dark luxury fashion stores (think: high-end menswear editorial)
- Black background, gold typography, clean whitespace
- NOT busy or colorful — minimal, premium, intentional

---

## 2. Color Palette

### Primary Colors
| Token | Value | Usage |
|---|---|---|
| `background` | `#0A0A0A` | Page background |
| `surface` | `#111111` | Cards, panels, drawers |
| `surface-elevated` | `#1A1A1A` | Modals, dropdowns, nav |
| `border` | `#2A2A2A` | Card borders, dividers |

### Accent — Gold
| Token | Value | Usage |
|---|---|---|
| `gold-primary` | `#C9A84C` | Primary buttons, links, highlights |
| `gold-light` | `#E2C07A` | Hover states, text accents |
| `gold-dark` | `#9B7B2F` | Active states, pressed |
| `gold-muted` | `#C9A84C1A` | Subtle backgrounds, badges |

### Text Colors
| Token | Value | Usage |
|---|---|---|
| `text-primary` | `#F5F5F5` | Headings, main content |
| `text-secondary` | `#A0A0A0` | Subheadings, descriptions |
| `text-muted` | `#606060` | Placeholders, disabled |
| `text-gold` | `#C9A84C` | Price highlights, CTAs |

### Semantic Colors
| Token | Value | Usage |
|---|---|---|
| `success` | `#22C55E` | Order confirmed, in stock |
| `warning` | `#F59E0B` | Pending status, low stock |
| `error` | `#EF4444` | Out of stock, errors |
| `info` | `#3B82F6` | Informational banners |

### Tailwind Config
```ts
// tailwind.config.ts — extend colors
colors: {
  background: '#0A0A0A',
  surface: '#111111',
  'surface-elevated': '#1A1A1A',
  border: '#2A2A2A',
  gold: {
    DEFAULT: '#C9A84C',
    light: '#E2C07A',
    dark: '#9B7B2F',
    muted: 'rgba(201,168,76,0.1)',
  },
  text: {
    primary: '#F5F5F5',
    secondary: '#A0A0A0',
    muted: '#606060',
    gold: '#C9A84C',
  }
}
```

---

## 3. Typography

### Fonts
- **Primary:** `Inter` (Google Fonts) — clean, modern, highly readable
- **Display/Hero:** `Playfair Display` (Google Fonts) — elegant serif for headings, luxury feel
- **Urdu:** `Noto Nastaliq Urdu` (Google Fonts) — for Urdu text content

### Type Scale
| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Hero heading | Playfair Display | 48–64px | 700 | `text-primary` |
| Page heading (H1) | Playfair Display | 36px | 600 | `text-primary` |
| Section heading (H2) | Inter | 24px | 600 | `text-primary` |
| Card title | Inter | 16px | 600 | `text-primary` |
| Body text | Inter | 14–16px | 400 | `text-secondary` |
| Small / label | Inter | 12–13px | 400 | `text-muted` |
| Price (main) | Inter | 20px | 700 | `text-gold` |
| Price (struck) | Inter | 16px | 400 | `text-muted` strikethrough |
| Button text | Inter | 14px | 600 | depends on button type |
| Urdu text | Noto Nastaliq Urdu | 16px | 400 | `text-primary` |

---

## 4. Layout & Grid

- **Max content width:** 1280px (centered)
- **Horizontal padding:** 16px (mobile), 24px (tablet), 48px (desktop)
- **Grid — Product grid:**
  - Mobile: 2 columns
  - Tablet: 3 columns
  - Desktop: 4 columns
- **Spacing system:** 4px base unit — use Tailwind spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)
- **Card border-radius:** 12px
- **Input border-radius:** 8px
- **Button border-radius:** 8px (standard), 999px (pill — for tags/badges)

---

## 5. Component Design

### 5.1 Buttons
| Type | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | `gold-primary` | `#0A0A0A` | none | `gold-light` bg |
| Secondary | transparent | `gold-primary` | `gold-primary` 1px | `gold-muted` bg |
| Ghost | transparent | `text-secondary` | `border` 1px | `surface-elevated` bg |
| Danger | `#EF4444` | white | none | darker red |
| Disabled | `#2A2A2A` | `text-muted` | none | no change |

All buttons: `height: 44px`, `padding: 0 20px`, `font-weight: 600`, `transition: all 0.2s`

### 5.2 Product Card
```
┌─────────────────────────┐
│  [Discount Badge -20%]  │ ← top-left, gold bg, black text
│                         │
│    [Product Image]      │ ← aspect-ratio 4:3, object-cover
│                         │
│  [New Tag]              │ ← optional, green
│                         │
├─────────────────────────┤
│  Category Name          │ ← 12px, text-muted
│  Product Name           │ ← 15px, text-primary, 2 lines max
│                         │
│  ₨ 2,500  ~~₨ 3,200~~  │ ← gold price + muted strikethrough
│                         │
│  [Add to Cart ▶]        │ ← primary button, full width
└─────────────────────────┘
```
- Card background: `surface`
- Card border: `border` (1px)
- Hover: slight scale(1.02), border-color: `gold-primary`
- Image hover: zoom effect on image (overflow: hidden on container)

### 5.3 Navigation (Navbar)
- Fixed top, full width
- Background: `#0A0A0A` with `backdrop-filter: blur(10px)` on scroll
- Left: RTS Apparel logo (gold colored text or SVG logo)
- Center: Category links (desktop only) — horizontal nav
- Right: Search icon, Wishlist icon, Cart icon (with badge), Account avatar/login button
- Mobile: hamburger menu → slide-in drawer (left side)
- Gold bottom border (1px) on scroll

### 5.4 Category Page Header
- Dark hero strip with category name in Playfair Display
- Breadcrumb: Home > Category Name
- Filter sidebar (desktop) / filter bottom sheet (mobile)
  - Filter by: Size, Color, Price range, Discount
  - Sort: Newest, Price Low-High, Price High-Low, Most Popular

### 5.5 Product Detail Page
- Left: Image gallery (main image + thumbnails below)
- Right: Product info
  - Category breadcrumb
  - Product name (H1, Playfair Display)
  - Rating placeholder (optional)
  - Price + discount price
  - Size selector (buttons, selected = gold border)
  - Color selector (color circles, selected = gold ring)
  - Quantity selector (- / number / +)
  - Add to Cart button (primary, large)
  - Add to Wishlist (secondary)
  - Short description
- Below: Product description tabs (Details, Size Guide, Returns)
- Bottom: "You May Also Like" carousel (AI recommendations)

### 5.6 Forms
- Input background: `surface-elevated`
- Input border: `border` normally, `gold-primary` on focus
- Label: 13px, `text-secondary`, above input
- Placeholder: `text-muted`
- Error state: red border + red error message below
- Success state: green border + checkmark

### 5.7 Admin Panel Layout
- Left sidebar (240px wide, fixed): dark `surface` bg, gold active indicator
- Top header bar: page title + action buttons
- Content area: white/elevated surface cards
- Tables: striped rows (alternating `surface` and `surface-elevated`)
- Status badges: pill-shaped, color-coded
  - Pending: amber bg + text
  - Confirmed: blue
  - Shipped: purple
  - Delivered: green
  - Cancelled: red

### 5.8 AI Chat Widget
- Floating button: bottom-right corner, gold circle with chat icon
- Chat window: 360px wide, 480px tall
- Dark background (`surface`), gold accents
- User messages: right-aligned, gold-muted bubble
- AI messages: left-aligned, surface-elevated bubble
- Input: bottom, with send button
- Header: "RTS Support" + gold dot (online indicator)

---

## 6. Responsive Behavior

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | < 768px | Single column, bottom nav, hamburger menu |
| Tablet | 768–1024px | 2-3 column grid, sidebar collapses |
| Desktop | > 1024px | Full layout, sidebar visible, 4 column grid |

**Mobile-specific:**
- Cart: full-screen drawer from bottom
- Filters: bottom sheet modal
- Admin panel: stacked cards (no sidebar table layout)
- Chat widget: full-screen on mobile

---

## 7. Animations & Transitions

- Page transitions: fade-in (150ms ease)
- Button hover: color transition (200ms)
- Card hover: scale + border (200ms)
- Cart drawer: slide-in from right (300ms ease-out)
- Mobile menu: slide-in from left (300ms ease-out)
- Toast notifications: slide-in from top-right
- Loading skeleton: shimmer animation (gold shimmer on dark bg)
- Product image: smooth zoom on hover (300ms)

---

## 8. Icons

- Library: **Lucide React** (consistent, clean outline style)
- Key icons: ShoppingCart, Heart, Search, User, Menu, ChevronDown, Star, Package, Truck, CheckCircle, X, Plus, Minus, Copy, Share2, LogOut, Settings

---

## 9. Special UI Elements

### Discount Badge
- Position: absolute top-left of product image
- Style: `background: gold-primary`, `color: #0A0A0A`, `font-weight: 700`, `font-size: 12px`, `padding: 4px 8px`, `border-radius: 4px`
- Text: `-20%` or `SALE`

### Order Status Timeline
- Vertical steps with connecting line
- Completed steps: gold filled circle + gold line
- Current step: gold pulsing circle
- Upcoming steps: gray circle + gray line

### Referral Code Box
- Dark card with gold border
- Code in large monospace font
- Copy button (gold)
- WhatsApp share button (green)

### Price Display
```
₨ 2,500   ~~₨ 3,200~~   (-21%)
```
- Main price: `text-gold`, `font-size: 22px`, `font-weight: 700`
- Struck price: `text-muted`, `font-size: 16px`, `text-decoration: line-through`
- Discount %: small green badge

---

## 10. Accessibility

- All interactive elements keyboard-navigable
- ARIA labels on icon-only buttons
- Color contrast: minimum 4.5:1 for normal text
- Focus visible rings (gold color)
- Alt text on all product images
- Form error messages associated with inputs via `aria-describedby`
- Screen reader announcements for cart updates

---

## 11. Image & Asset Direction

- Product images: placeholder images from `https://picsum.photos` or similar (will be replaced by admin uploads)
- Hero banners: dark editorial men's fashion aesthetic placeholders
- Logo: RTS Apparel text logo in gold (`font-family: Playfair Display`, or use actual logo SVG when provided)
- Favicon: "RTS" initials in gold on black
- No stock photo faces — use clothing-only or model from behind/profile shots

---

## 12. Dark Mode Note

This design IS the dark mode. No light mode toggle needed. All surfaces, backgrounds, and components are designed for the dark luxury theme only.
