import { CustomerLanguage } from "../types";

const AI_API_BASE = (import.meta.env.VITE_AI_API_BASE as string) || "/api/ai";

export interface AISearchResponse {
  keywords: string[];
  original: string;
}

export interface AIRecommendationsResponse {
  recommendations: string[];
}

export interface AIChatResponse {
  reply: string;
}

export async function aiSearch(
  query: string,
  language: CustomerLanguage = "en"
): Promise<AISearchResponse> {
  try {
    const res = await fetch(`${AI_API_BASE}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, language }),
    });
    if (!res.ok) throw new Error("AI search failed");
    return await res.json();
  } catch {
    return {
      keywords: query
        .split(/\s+/)
        .map((s) => s.trim())
        .filter(Boolean),
      original: query,
    };
  }
}

export async function aiRecommendations(
  productName: string,
  category: string,
  price: number,
  language: CustomerLanguage = "en"
): Promise<AIRecommendationsResponse> {
  try {
    const res = await fetch(`${AI_API_BASE}/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName, category, price, language }),
    });
    if (!res.ok) throw new Error("AI recommendations failed");
    return await res.json();
  } catch {
    if (language === "ur") {
      return {
        recommendations: [
          "کشمیر پشمینہ زری شال",
          "لیدرسوئیڈ بومبر جیکٹ",
          "گرکھا پلیٹڈ ٹراؤزرز",
        ],
      };
    }
    if (language === "roman_ur") {
      return {
        recommendations: [
          "Kashmir Pashmina Zari Shawl",
          "Lahore Lambskin Suede Bomber Jacket",
          "Savile Gurkha Pleated Trousers",
        ],
      };
    }
    return {
      recommendations: [
        "Royal Obsidian Zari Karandi Kurta",
        "Savile Gurkha Pleated Trousers",
        "Kashmir Pashmina Zari Shawl",
      ],
    };
  }
}

export async function aiChat(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
  language: CustomerLanguage = "en"
): Promise<AIChatResponse> {
  try {
    const res = await fetch(`${AI_API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, language }),
    });
    if (!res.ok) throw new Error("AI chat failed");
    return await res.json();
  } catch {
    return {
      reply:
        language === "ur"
          ? "آر ٹی ایس اپیرل میں خوش آمدید! ہمارے پاس کُرتہ شلوار، شرٹس، پینٹس اور جیکٹس کی مکمل ورائٹی موجود ہے۔"
          : language === "roman_ur"
          ? "RTS Apparel mein khush aamdeed! Hamare paas Karandi Kurta Shalwar, Shirts, Gurkha Trousers aur Suede Jackets dastiyab hain."
          : "Welcome to RTS Apparel! Explore our luxury Kurta Shalwar, formal shirts, Gurkha trousers, and lambskin suede jackets.",
    };
  }
}
