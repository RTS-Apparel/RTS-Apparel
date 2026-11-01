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
    const trimmedHistory = history\n      .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")\n      .slice(-8)\n      .map((item) => ({ role: item.role, content: item.content.slice(0, 1000) }));
    const res = await fetch(`${AI_API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim(), history: trimmedHistory, language }),
    });
    if (!res.ok) throw new Error("AI chat failed");
    const data = await res.json();
    if (data && typeof data.reply === "string" && data.reply.trim()) {
      return { success: true, reply: data.reply };
    }
    throw new Error("Empty AI reply");
  } catch {
    // Keep the assistant useful even if the AI endpoint is temporarily unavailable.
    const q = message.toLowerCase();
    let reply =
      "Bhai, aap apna sawal thora detail se dobara poochho. Main ARTS APPAREL ke products, sizes, delivery, payment aur return policy mein madad karta hun. 😊👕";
    if (/delivery|shipping|deliver|parcel|kitne din|kab tak/.test(q)) {
      reply = "Dost, major cities mein delivery aam tor par 3–5 working days aur baqi areas mein 5–7 days leti hai. 🚚📦";
    } else if (/size|fit|chest|measurement|chart/.test(q)) {
      reply = "Bhai, product page par available sizes aur size guide check karo. Aam tor par S, M, L, XL aur XXL milte hain; product ke hisaab se sizes farq ho sakte hain. 👕📏";
    } else if (/return|refund|exchange|wapas|wapsi/.test(q)) {
      reply = "Bhai, 7 din ke andar unworn item original tags ke saath return ya free size exchange ke liye request kar sakte ho. 😊🔄";
    } else if (/payment|cod|cash on delivery|jazzcash|easypaisa|bank/.test(q)) {
      reply = "Dost, payment ke liye Cash on Delivery (COD), JazzCash, EasyPaisa aur Bank Transfer ke options available hain. 💳✨";
    } else if (/track|tracking|order status|mera order/.test(q)) {
      reply = "Bhai, website ke Track Order page par apna order number enter karo taake status check kar sako. 📦🔍";
    } else if (/discount|sale|offer|promo/.test(q)) {
      reply = "Dost, current discounts aur offers ke liye homepage aur product prices check karo; available offer checkout par nazar aa sakta hai. 🔥🛍️";
    } else if (/address|location|shop|store|contact|whatsapp|number/.test(q)) {
      reply = "Bhai, ARTS APPAREL ka store Club Road, New Cafe Sajawal ke qareeb, Sadiqabad mein hai. Zaroorat par WhatsApp: 03058165623 📍💬";
    }
    return { success: false, reply };
  }
}
