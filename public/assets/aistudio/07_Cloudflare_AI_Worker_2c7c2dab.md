# 07 — Cloudflare Workers AI Setup
# RTS Apparel — Complete AI Backend Files
# Based on Cloudflare Official Documentation (Oct 2026)

---

## Overview

RTS Apparel uses **Cloudflare Pages Functions** (NOT a standalone Worker) for all AI features.
- Same repo as React frontend
- Auto-deploys with every `git push` — no separate deploy command
- Same domain = no CORS issues
- Free Plan: 10,000 Neurons/day, resets at 00:00 UTC

**AI Models Used:**
| Feature | Model | Free Plan |
|---|---|---|
| Chatbot | `@cf/meta/llama-3.1-8b-instruct` | ✅ |
| Smart Search (embeddings) | `@cf/baai/bge-m3` | ✅ |
| Smart Search (keywords) | `@cf/meta/llama-3.1-8b-instruct` | ✅ |
| Recommendations | `@cf/meta/llama-3.1-8b-instruct` | ✅ |

---

## File 1: `wrangler.toml`
**Location:** Project root (same level as `package.json`)

```toml
name = "rts-apparel"
compatibility_date = "2026-10-29"
compatibility_flags = ["nodejs_compat"]

# Workers AI binding — available as context.env.AI in Pages Functions
[ai]
binding = "AI"

# Vite build output directory
pages_build_output_dir = "dist"

# Observability (recommended — free)
[observability]
enabled = true

# Non-secret vars for local dev (wrangler pages dev)
# Secrets must be set in Cloudflare Pages Dashboard, NOT here
[vars]
SUPABASE_URL = "https://your-project.supabase.co"
```

**After adding wrangler.toml — also add binding via Dashboard:**
1. Cloudflare Dashboard → Workers & Pages → your project
2. Settings → Bindings → Add
3. Type: Workers AI → Name: `AI`
4. Save → Redeploy

---

## File 2: `functions/_lib/cors.ts`
**Location:** `functions/_lib/cors.ts`

```typescript
// Shared CORS headers and JSON response helper
// Pages Functions run on same domain as frontend — CORS not strictly needed
// but included for safety if called from preview URLs or different origins

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  })
}

// Handle CORS preflight for all AI endpoints
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}
```

---

## File 3: `functions/api/ai/search.ts`
**Location:** `functions/api/ai/search.ts`
**Endpoint:** `POST /api/ai/search`

```typescript
import { json } from "../../_lib/cors"

interface Env {
  AI: Ai
  SUPABASE_URL: string
  SUPABASE_KEY: string
}

interface SearchRequest {
  query: string
  language?: "en" | "ur"
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as SearchRequest

    if (!body.query || typeof body.query !== "string" || body.query.trim().length === 0) {
      return json({ error: "Missing or empty 'query' field" }, 400)
    }

    const query = body.query.trim()
    const language = body.language || "en"

    // Step 1: Generate multilingual embedding for the search query
    // @cf/baai/bge-m3 supports 100+ languages including Urdu
    const embeddingResult = await context.env.AI.run(
      "@cf/baai/bge-m3",
      { text: [query] }
    ) as { data: number[][] }

    // Step 2: Extract search keywords via LLM
    // In production, combine with pgvector cosine similarity against stored product embeddings
    const keywordResult = await context.env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          {
            role: "system",
            content:
              "You are a product search assistant for RTS Apparel, a men's fashion store in Pakistan. " +
              "Extract 3-5 relevant product search keywords from the user's query. " +
              "The store sells: Shirts, Trousers, Kurta Shalwar, Hoodies, Jackets. " +
              "Respond ONLY with a valid JSON array of strings. No explanation, no markdown. " +
              "Example: [\"blue shirt\", \"shirts\", \"blue\", \"cotton\"]",
          },
          {
            role: "user",
            content: `Search query (language: ${language}): "${query}"`,
          },
        ],
        max_tokens: 150,
      }
    ) as { response: string }

    // Parse keywords safely
    let keywords: string[] = []
    try {
      const cleaned = (keywordResult.response || "[]")
        .replace(/```json|```/g, "")
        .trim()
      const parsed = JSON.parse(cleaned)
      if (Array.isArray(parsed)) {
        keywords = parsed.filter((k): k is string => typeof k === "string")
      }
    } catch {
      // Fallback: use raw query as single keyword
      keywords = [query]
    }

    return json({
      success: true,
      query,
      language,
      keywords,
      // embedding: embeddingResult.data[0], // Include if using pgvector search
    })

  } catch (err) {
    // Graceful fallback — frontend should handle this and use basic text search
    console.error("Search AI error:", err)

    // Check for Cloudflare-specific errors
    const errorMsg = String(err)
    if (errorMsg.includes("3036")) {
      return json({ error: "Daily AI limit reached. Please try again tomorrow.", keywords: [] }, 429)
    }
    if (errorMsg.includes("3040")) {
      return json({ error: "AI service temporarily unavailable. Using basic search.", keywords: [] }, 503)
    }

    return json({ error: "Search failed. Using basic search.", keywords: [] }, 500)
  }
}
```

---

## File 4: `functions/api/ai/recommendations.ts`
**Location:** `functions/api/ai/recommendations.ts`
**Endpoint:** `POST /api/ai/recommendations`

```typescript
import { json } from "../../_lib/cors"

interface Env {
  AI: Ai
  SUPABASE_URL: string
  SUPABASE_KEY: string
}

interface RecommendationRequest {
  product_id: string
  category: string
  tags?: string[]
  name?: string
}

interface RecommendationItem {
  attribute: string
  reason: string
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as RecommendationRequest

    if (!body.category) {
      return json({ error: "Missing 'category' field" }, 400)
    }

    const result = await context.env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          {
            role: "system",
            content:
              "You are a product recommendation engine for RTS Apparel, a premium men's fashion store in Pakistan. " +
              "The store sells: Shirts, Trousers, Kurta Shalwar, Hoodies, Jackets. " +
              "Given a product's details, suggest 4 related product attributes that would " +
              "appeal to the same customer. Focus on Pakistani men's fashion trends. " +
              "Respond ONLY with valid JSON in this exact format — no markdown, no extra text: " +
              "{\"recommendations\": [{\"attribute\": \"string\", \"reason\": \"string\"}]}",
          },
          {
            role: "user",
            content: JSON.stringify({
              product_id: body.product_id,
              category: body.category,
              name: body.name || "",
              tags: body.tags || [],
            }),
          },
        ],
        max_tokens: 400,
      }
    ) as { response: string }

    // Parse response safely
    let recommendations: RecommendationItem[] = []
    try {
      const cleaned = (result.response || "{}")
        .replace(/```json|```/g, "")
        .trim()
      const parsed = JSON.parse(cleaned)
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        recommendations = parsed.recommendations
      }
    } catch {
      // Return empty recommendations — frontend shows nothing or hides section
      recommendations = []
    }

    return json({
      success: true,
      product_id: body.product_id,
      category: body.category,
      recommendations,
    })

  } catch (err) {
    console.error("Recommendations AI error:", err)
    // Return empty — frontend hides the "You May Also Like" section gracefully
    return json({
      success: false,
      product_id: "",
      category: "",
      recommendations: [],
    }, 200) // Return 200 so frontend doesn't show error to user
  }
}
```

---

## File 5: `functions/api/ai/chat.ts`
**Location:** `functions/api/ai/chat.ts`
**Endpoint:** `POST /api/ai/chat`

```typescript
import { json } from "../../_lib/cors"

interface Env {
  AI: Ai
  SUPABASE_URL: string
  SUPABASE_KEY: string
}

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

interface ChatRequest {
  message: string
  history?: ChatMessage[]
}

// RTS Apparel customer support system prompt
// Urdu + English bilingual
const SYSTEM_PROMPT = `You are the RTS Apparel customer support assistant.
RTS Apparel is a premium men's fashion e-commerce store based in Pakistan.

Your role:
- Answer questions about orders, delivery, returns, exchanges, sizing, products, and payment.
- Be helpful, friendly, and concise. Keep responses under 120 words.
- If the customer writes in Urdu, respond ONLY in Urdu.
- If the customer writes in English, respond ONLY in English.
- If you don't know specific order details, direct them to check their email or contact support.
- Never make up order details, tracking numbers, or specific product availability.
- Never mention competitors.

Store policies:
- Delivery: 3-5 business days in major cities, 5-7 days for other areas
- Returns: 7 days, items must be unworn with original tags attached
- Exchange: Free size exchange within 7 days of delivery
- Payment: Cash on Delivery (COD), JazzCash, EasyPaisa, Bank Transfer
- Order tracking: Go to our website → Track Order → enter order number

Contact for complex issues: WhatsApp number shown on our website.`

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as ChatRequest

    if (!body.message || typeof body.message !== "string" || body.message.trim().length === 0) {
      return json({ error: "Missing or empty 'message' field" }, 400)
    }

    // Limit history to last 8 messages to control token usage (Neuron cost)
    const history = (body.history || []).slice(-8)

    // Validate history format
    const validHistory = history.filter(
      (msg) =>
        msg &&
        typeof msg === "object" &&
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string"
    )

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...validHistory,
      { role: "user", content: body.message.trim() },
    ]

    const result = await context.env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages,
        max_tokens: 300,
      }
    ) as { response: string }

    const reply = result.response?.trim()
    if (!reply) {
      return json({
        reply: "Sorry, I couldn't process your message. Please try again or contact us on WhatsApp.",
      })
    }

    return json({
      success: true,
      reply,
      model: "@cf/meta/llama-3.1-8b-instruct",
    })

  } catch (err) {
    console.error("Chat AI error:", err)

    const errorMsg = String(err)

    // Cloudflare-specific error codes
    if (errorMsg.includes("3036")) {
      return json({
        reply: "Our AI chat is temporarily unavailable (daily limit reached). Please contact us on WhatsApp for immediate help.",
      })
    }
    if (errorMsg.includes("3040")) {
      return json({
        reply: "Chat is temporarily unavailable. Please try again in a moment or contact us on WhatsApp.",
      })
    }

    return json({
      reply: "Something went wrong. Please contact us on WhatsApp for help.",
    })
  }
}
```

---

## File 6: `src/lib/ai.ts`
**Location:** `src/lib/ai.ts`
**Purpose:** Frontend fetch helpers that call Pages Functions

```typescript
// Frontend helpers for Cloudflare Pages Functions AI endpoints
// API_BASE is empty string for Pages Functions (same origin)
// Set VITE_AI_API_BASE in .env if using a different origin

const API_BASE = import.meta.env.VITE_AI_API_BASE || ""

// ─── Smart Search ──────────────────────────────────────────────────────────

export interface SearchResult {
  success: boolean
  query: string
  language: string
  keywords: string[]
  error?: string
}

export async function aiSearch(
  query: string,
  language: "en" | "ur" = "en"
): Promise<SearchResult> {
  try {
    const res = await fetch(`${API_BASE}/api/ai/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, language }),
    })

    if (!res.ok) {
      return { success: false, query, language, keywords: [query] }
    }

    return await res.json() as SearchResult
  } catch {
    // Network error fallback — use query as keyword
    return { success: false, query, language, keywords: [query] }
  }
}

// ─── Product Recommendations ───────────────────────────────────────────────

export interface RecommendationItem {
  attribute: string
  reason: string
}

export interface RecommendationsResult {
  success: boolean
  product_id: string
  category: string
  recommendations: RecommendationItem[]
}

export async function aiRecommendations(
  product_id: string,
  category: string,
  tags: string[] = [],
  name?: string
): Promise<RecommendationsResult> {
  try {
    const res = await fetch(`${API_BASE}/api/ai/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id, category, tags, name }),
    })

    if (!res.ok) {
      return { success: false, product_id, category, recommendations: [] }
    }

    return await res.json() as RecommendationsResult
  } catch {
    return { success: false, product_id, category, recommendations: [] }
  }
}

// ─── Customer Support Chat ─────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface ChatResult {
  success?: boolean
  reply: string
  error?: string
}

export async function aiChat(
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResult> {
  try {
    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    })

    if (!res.ok) {
      return {
        reply: "Chat is temporarily unavailable. Please contact us on WhatsApp.",
      }
    }

    return await res.json() as ChatResult
  } catch {
    return {
      reply: "Unable to connect. Please check your internet and try again.",
    }
  }
}
```

---

## Environment Variables Reference

### Cloudflare Pages Dashboard
Go to: Workers & Pages → rts-apparel → Settings → Environment variables

| Variable | Value | Encrypted | Environment |
|---|---|---|---|
| `NODE_VERSION` | `20` | No | Production + Preview |
| `SUPABASE_URL` | `https://xxx.supabase.co` | No | Production + Preview |
| `SUPABASE_KEY` | `your-supabase-anon-key` | **Yes** | Production + Preview |
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | No | Production + Preview |
| `VITE_SUPABASE_ANON_KEY` | `your-supabase-anon-key` | No | Production + Preview |
| `VITE_AI_API_BASE` | *(leave empty)* | No | Production + Preview |

### Also add AI Binding via Dashboard
Settings → Bindings → Add → Workers AI → Variable name: `AI` → Save → Redeploy

### Local `.env` (gitignored)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_AI_API_BASE=
```

---

## Local Testing

```bash
# Test Pages Functions locally with AI binding
npx wrangler pages dev --compatibility-date=2026-10-29 --ai AI

# Test chat endpoint
curl -X POST http://localhost:8788/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, when will my order arrive?","history":[]}'

# Test search endpoint
curl -X POST http://localhost:8788/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{"query":"blue cotton shirt","language":"en"}'

# Test recommendations endpoint
curl -X POST http://localhost:8788/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{"product_id":"abc123","category":"Shirts","tags":["blue","cotton"]}'
```

---

## Deployment Checklist

- [ ] `wrangler.toml` exists at project root with `[ai]` binding
- [ ] `functions/` folder is at project root (NOT inside `src/`)
- [ ] All 3 Pages Functions files created (search.ts, recommendations.ts, chat.ts)
- [ ] `functions/_lib/cors.ts` created
- [ ] `src/lib/ai.ts` frontend helpers created
- [ ] AI binding added via Cloudflare Pages Dashboard (Settings → Bindings → AI)
- [ ] `NODE_VERSION=20` set in Pages dashboard
- [ ] `SUPABASE_KEY` set as encrypted in Pages dashboard
- [ ] `bun.lock`/`bun.lockb` deleted from repo (if present)
- [ ] `.npmrc` with `legacy-peer-deps=true` at project root
- [ ] Redeployed after adding AI binding
- [ ] Tested all 3 endpoints after deployment
- [ ] Monitored Neuron usage in Workers AI dashboard

---

## Error Codes Reference

| Code | HTTP | Meaning | Frontend Action |
|---|---|---|---|
| `3036` | 429 | Daily 10,000 Neuron limit reached | Show fallback message, hide AI features |
| `3040` | 429 | Out of capacity (peak time) | Retry once after 2s, then show fallback |
| `5035` | 403 | Model requires paid plan | Switch to different free model |
| Network error | — | No internet / worker down | Show offline fallback message |

---

## Free Plan Usage Estimate (RTS Apparel)

| Feature | Neurons per request (approx) | Daily requests (small store) | Daily Neurons |
|---|---|---|---|
| Chat | ~15–25 | 50 | ~1,000 |
| Search (embeddings + keywords) | ~10–20 | 100 | ~1,500 |
| Recommendations | ~10–15 | 80 | ~1,000 |
| **Total** | | | **~3,500/day** |

Estimated usage: **~3,500 Neurons/day** — well within 10,000 free Neurons/day limit for a small-to-medium store. Monitor in Cloudflare Dashboard → Workers AI → Usage.
