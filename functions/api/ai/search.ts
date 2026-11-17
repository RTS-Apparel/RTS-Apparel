import { json, PagesFunction } from "../../_lib/cors";

interface Ai {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}

interface Env {
  AI: Ai;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

interface SearchRequest {
  query: string;
  language?: "en" | "ur" | "roman_ur";
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as SearchRequest;

    if (!body.query || typeof body.query !== "string" || body.query.trim().length === 0) {
      return json({ error: "Missing or empty 'query' field" }, 400);
    }

    const query = body.query.trim().slice(0, 250);
    const language = body.language || "en";

    if (!context.env || !context.env.AI) {
      console.error("Cloudflare Workers AI binding (context.env.AI) is not available.");
      return json({
        success: true,
        query,
        language,
        keywords: query.split(/\s+/).filter(Boolean),
      });
    }

    // Expand the query into multilingual terms; the storefront matches these against live Supabase products.
    const keywordResult = (await context.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are a product search assistant for ARTS APPAREL, a men's fashion store in Pakistan. " +
            "Extract 4-8 concise product search terms and useful English, Roman Urdu, and Urdu synonyms from the user's query. " +
            "Include garment type, colour, fabric, fit and category terms when implied, but do not invent a specific product. " +
            "The store sells men's shirts, trousers, kurta shalwar, waistcoats, hoodies, jackets, T-shirts and jeans. " +
            "Respond ONLY with a valid JSON array of strings. No explanation, no markdown. " +
            'Example: ["blue shirt", "blue", "neeli shirt", "shirts", "cotton"]',
        },
        {
          role: "user",
          content: `Search query (language: ${language}): "${query}"`,
        },
      ],
      max_tokens: 150,
    })) as { response?: string };

    let keywords: string[] = [];
    try {
      const cleaned = (keywordResult.response || "[]")
        .replace(/```json|```/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        keywords = parsed.filter((k): k is string => typeof k === "string").map((k) => k.trim().slice(0, 80)).filter(Boolean).slice(0, 8);
      }
    } catch {
      keywords = [query];
    }

    return json({
      success: true,
      query,
      language,
      keywords,
    });
  } catch (err) {
    console.error("Search AI error:", err);
    const errorMsg = String(err);
    if (errorMsg.includes("3036")) {
      return json({ error: "Daily AI limit reached. Please try again tomorrow.", keywords: [] }, 429);
    }
    if (errorMsg.includes("3040")) {
      return json({ error: "AI service temporarily unavailable. Using basic search.", keywords: [] }, 503);
    }
    return json({ error: "Search failed. Using basic search.", keywords: [] }, 500);
  }
};
