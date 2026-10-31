import { CustomerLanguage } from "../types";

const AI_API_BASE = (import.meta.env.VITE_AI_API_BASE as string) || "/api/ai";

export interface AISearchResponse {
  success?: boolean;
  keywords: string[];
  original?: string;
}

export interface RecommendationAttribute {
  attribute: string;
  reason?: string;
}

export interface AIRecommendationsResponse {
  success: boolean;
  recommendations: Array<string | RecommendationAttribute>;
}

export interface AIChatResponse {
  success?: boolean;
  reply: string;
}

export async function aiSearch(
  query: string,
  language: CustomerLanguage = "en"
): Promise<AISearchResponse> {
  const apiLang: "en" | "ur" = language === "ur" ? "ur" : "en";
  try {
    const res = await fetch(`${AI_API_BASE}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, language: apiLang }),
    });
    if (!res.ok) throw new Error("AI search failed");
    const data = await res.json();
    if (Array.isArray(data.keywords) && data.keywords.length > 0) {
      return {
        success: true,
        keywords: data.keywords,
        original: query,
      };
    }
    throw new Error("Empty keywords");
  } catch {
    // Fallback to basic text search keywords
    return {
      success: false,
      keywords: query
        .split(/\s+/)
        .map((s) => s.trim())
        .filter(Boolean),
      original: query,
    };
  }
}

export interface AIRecommendationPayload {
  product_id: string;
  category: string;
  tags: string[];
  name?: string;
  language?: CustomerLanguage;
}

export async function aiRecommendations(
  payload: AIRecommendationPayload
): Promise<AIRecommendationsResponse> {
  try {
    const res = await fetch(`${AI_API_BASE}/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: payload.product_id,
        category: payload.category,
        tags: payload.tags,
        name: payload.name || "",
        language: payload.language || "en",
      }),
    });
    if (!res.ok) throw new Error("AI recommendations failed");
    const data = await res.json();
    if (
      data &&
      Array.isArray(data.recommendations) &&
      data.recommendations.length > 0
    ) {
      return {
        success: true,
        recommendations: data.recommendations,
      };
    }
    return { success: false, recommendations: [] };
  } catch {
    // Silent failure — hide section when AI fails
    return {
      success: false,
      recommendations: [],
    };
  }
}

export async function aiChat(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
  language: CustomerLanguage = "en"
): Promise<AIChatResponse> {
  try {
    const trimmedHistory = history.slice(-8);
    const res = await fetch(`${AI_API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: trimmedHistory, language }),
    });
    if (!res.ok) throw new Error("AI chat failed");
    const data = await res.json();
    if (data && typeof data.reply === "string" && data.reply.trim()) {
      return { success: true, reply: data.reply };
    }
    throw new Error("Empty AI reply");
  } catch {
    return {
      success: false,
      reply:
        "Yaar seedha WhatsApp karo: 03058165623, main wahan bhi mojood hun! 😄💬",
    };
  }
}
